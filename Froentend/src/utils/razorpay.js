import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase.js';

const KEY_ID  = import.meta.env.VITE_RAZORPAY_KEY_ID;
const API_URL = import.meta.env.VITE_API_URL || '/api';

/* ── helpers ── */
async function apiPost(path, body) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 5000);
    try {
        const res = await fetch(API_URL + path, {
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': 'Bearer ' + (localStorage.getItem('erp_token') || ''),
            },
            body:   JSON.stringify(body),
            signal: ctrl.signal,
        });
        clearTimeout(timer);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
        return data;
    } finally {
        clearTimeout(timer);
    }
}

/**
 * Full Razorpay payment flow with server-side signature verification.
 *
 * Flow:
 *  1. Backend creates an order  → order_id
 *  2. Razorpay checkout opens   → user pays
 *  3. Backend verifies HMAC-SHA256 signature
 *  4. Payment record saved to Firestore
 *
 * Falls back to unverified mode if backend is unreachable (test/offline env).
 *
 * @param {{ feeId, studentId, studentName, email, phone, course, amount }} opts
 * @returns {Promise<{ paymentId, orderId, verified }>}
 */
export function openRazorpay(opts) {
    return new Promise(async (resolve, reject) => {
        if (!window.Razorpay) {
            reject(new Error('Razorpay SDK not loaded. Check your internet connection.'));
            return;
        }

        /* ── Step 1: Create order on backend ── */
        let orderId   = null;
        let backendUp = false;

        try {
            const orderRes = await apiPost('/payments/create-order', {
                amount: opts.amount,
                notes: {
                    fee_id:     opts.feeId     || '',
                    student_id: opts.studentId || '',
                    course:     opts.course    || '',
                },
            });
            orderId   = orderRes.order_id;
            backendUp = true;
        } catch {
            // Backend unavailable – continue without order_id (test / offline mode)
            console.warn('[Razorpay] Backend unavailable – running without order_id');
        }

        /* ── Step 2: Open Razorpay checkout ── */
        const checkoutOptions = {
            key:         KEY_ID,
            amount:      Math.round(opts.amount * 100), // paise
            currency:    'INR',
            name:        'EduManage ERP',
            description: `Fee Payment – ${opts.course || 'Course Fee'}`,
            image:       '/favicon.svg',
            prefill: {
                name:    opts.studentName || '',
                email:   opts.email       || '',
                contact: opts.phone       || '',
            },
            notes: {
                fee_id:     opts.feeId     || '',
                student_id: opts.studentId || '',
            },
            theme: { color: '#2563eb' },

            handler: async function (response) {
                const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

                let verified = false;

                /* ── Step 3: Verify signature on backend ── */
                if (backendUp && razorpay_order_id && razorpay_signature) {
                    try {
                        const verifyRes = await apiPost('/payments/verify', {
                            razorpay_order_id,
                            razorpay_payment_id,
                            razorpay_signature,
                        });
                        verified = verifyRes.verified === true;
                    } catch {
                        // Verification network error – log but don't block the user
                        console.warn('[Razorpay] Signature verification request failed');
                    }
                }

                /* ── Step 4: Persist to Firestore ── */
                try {
                    await addDoc(collection(db, 'feePayments'), {
                        feeId:        opts.feeId     || null,
                        studentId:    opts.studentId || null,
                        studentName:  opts.studentName,
                        course:       opts.course    || '',
                        amount:       opts.amount,
                        currency:     'INR',
                        paymentId:    razorpay_payment_id,
                        orderId:      razorpay_order_id  || null,
                        signature:    razorpay_signature || null,
                        verified,
                        method:       'Razorpay Online',
                        status:       'Paid',
                        paidAt:       serverTimestamp(),
                    });
                } catch {
                    // Non-fatal – payment already succeeded
                }

                resolve({
                    paymentId: razorpay_payment_id,
                    orderId:   razorpay_order_id || null,
                    verified,
                });
            },

            modal: {
                ondismiss: () => reject(new Error('Payment cancelled by user.')),
            },
        };

        // Attach order_id only if backend created one
        if (orderId) checkoutOptions.order_id = orderId;

        const rzp = new window.Razorpay(checkoutOptions);
        rzp.on('payment.failed', (res) => {
            reject(new Error(res.error?.description || 'Payment failed.'));
        });
        rzp.open();
    });
}
