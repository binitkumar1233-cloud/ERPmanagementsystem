import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    sendPasswordResetEmail,
    fetchSignInMethodsForEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';
import { api } from './api.js';

export const authService = {

    login: async (email, password) => {
        const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

        // Try backend (MongoDB) first
        try {
            const res = await fetch(`${BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('erp_token', data.token);
                localStorage.setItem('erp_auth_source', 'backend');
                return data.data;
            }
            // Backend responded with auth error — throw immediately, don't try Firebase
            throw new Error(data.message || 'Invalid email or password');
        } catch (err) {
            // Only fall through to Firebase on network errors (TypeError = fetch failed)
            if (!(err instanceof TypeError)) throw err;
        }

        // Fallback: Firebase Auth (only when backend is unreachable)
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const fbToken = await credential.user.getIdToken();
        localStorage.setItem('erp_token', fbToken);
        localStorage.setItem('erp_auth_source', 'firebase');
        return {
            id:    credential.user.uid,
            name:  credential.user.displayName || email.split('@')[0],
            email: credential.user.email,
            role:  'Administrator',
            photo: credential.user.photoURL,
        };
    },

    loginWithGoogle: async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const fbToken = await result.user.getIdToken();

        // Try to exchange for a backend JWT so API calls work
        const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        try {
            const res = await fetch(`${BASE}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    uid:   result.user.uid,
                    name:  result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('erp_token', data.token);
                localStorage.setItem('erp_auth_source', 'backend');
                return data.data;
            }
        } catch {
            // Backend offline — fall through to Firebase token
        }

        // Fallback: store Firebase token directly (same as original behaviour)
        localStorage.setItem('erp_token', fbToken);
        localStorage.setItem('erp_auth_source', 'firebase');
        return {
            id:    result.user.uid,
            name:  result.user.displayName,
            email: result.user.email,
            role:  'Administrator',
            photo: result.user.photoURL,
        };
    },

    loginStudent: async (email, password) => {
        const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res  = await fetch(`${BASE}/auth/login/student`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Invalid student email or password');
        localStorage.setItem('erp_token', data.token);
        localStorage.setItem('erp_auth_source', 'backend');
        return data.data;
    },

    logout: async () => {
        await signOut(auth);
        localStorage.removeItem('erp_token');
        localStorage.removeItem('erp_user');
        localStorage.removeItem('erp_auth_source');
    },

    sendPasswordResetEmail: async (email) => {
        if (!email) throw new Error('Email is required');
        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length === 0) {
            const e = new Error('No account found with this email address.');
            e.code = 'auth/user-not-found';
            throw e;
        }
        if (methods.includes('google.com') && !methods.includes('password')) {
            const e = new Error('GOOGLE_ACCOUNT');
            e.code = 'auth/google-account';
            throw e;
        }
        await sendPasswordResetEmail(auth, email);
        return { success: true };
    },

    changePassword: async (currentPassword, newPassword) => {
        const user = auth.currentUser;
        if (!user) throw new Error('Not authenticated');
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        return { success: true, message: 'Password changed successfully' };
    },

    getToken: async () => {
        const user = auth.currentUser;
        if (!user) return null;
        const token = await user.getIdToken();
        localStorage.setItem('erp_token', token);
        return token;
    },

    getProfile: () => api.get('/auth/me'),
};
