const express = require('express');
const crypto  = require('crypto');
const Razorpay = require('razorpay');

const router = express.Router();

// Lazy-init: .env is loaded before any request hits these handlers
function getRzp() {
    return new Razorpay({
        key_id:     process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

/* ──────────────────────────────────────────────
   POST /api/payments/create-order
   Body: { amount (INR), currency?, notes? }
   Returns Razorpay order object
────────────────────────────────────────────── */
router.post('/create-order', async (req, res) => {
    try {
        const { amount, currency = 'INR', notes = {} } = req.body;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: 'Valid amount is required' });
        }

        const order = await getRzp().orders.create({
            amount:   Math.round(Number(amount) * 100), // convert ₹ → paise
            currency,
            receipt:  `rcpt_${Date.now()}`,
            notes,
        });

        res.json({
            success:  true,
            order_id: order.id,
            amount:   order.amount,
            currency: order.currency,
        });
    } catch (err) {
        console.error('[Razorpay create-order]', err.message);
        res.status(500).json({ success: false, message: err.message || 'Failed to create order' });
    }
});

/* ──────────────────────────────────────────────
   POST /api/payments/verify
   Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
   Returns { success, verified }
────────────────────────────────────────────── */
router.post('/verify', (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing payment fields' });
    }

    // Razorpay signature = HMAC-SHA256( order_id + "|" + payment_id, key_secret )
    const body      = razorpay_order_id + '|' + razorpay_payment_id;
    const expected  = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest('hex');

    const verified = crypto.timingSafeEqual(
        Buffer.from(expected,            'hex'),
        Buffer.from(razorpay_signature,  'hex'),
    );

    if (verified) {
        return res.json({ success: true, verified: true, payment_id: razorpay_payment_id });
    } else {
        return res.status(400).json({ success: false, verified: false, message: 'Invalid payment signature' });
    }
});

module.exports = router;
