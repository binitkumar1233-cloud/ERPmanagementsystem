import {
    signInWithEmailAndPassword,
    signInWithRedirect,
    getRedirectResult,
    browserPopupRedirectResolver,
    signOut,
    sendPasswordResetEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase.js';
import { api } from './api.js';

const BASE = () => import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {

    login: async (email, password) => {
        try {
            const res = await fetch(`${BASE()}/auth/login`, {
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
            throw new Error(data.message || 'Invalid email or password');
        } catch (err) {
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

    // Triggers Google sign-in via redirect — browser navigates away immediately.
    // Pass browserPopupRedirectResolver explicitly so Vite never tree-shakes it.
    loginWithGoogle: () =>
        signInWithRedirect(auth, googleProvider, browserPopupRedirectResolver),

    // Called on app mount to pick up the result AFTER Google redirects back.
    // Returns a user object if a redirect just completed, null otherwise.
    getGoogleRedirectResult: async () => {
        const result = await getRedirectResult(auth, browserPopupRedirectResolver);
        if (!result) return null;

        // Exchange the Firebase credential for a backend JWT
        try {
            const res = await fetch(`${BASE()}/auth/google`, {
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
        } catch { /* backend offline — use Firebase token */ }

        const fbToken = await result.user.getIdToken();
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
        const res = await fetch(`${BASE()}/auth/login/student`, {
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

    // fetchSignInMethodsForEmail is deprecated in Firebase v10+ and removed in v12.
    // Call sendPasswordResetEmail directly; Firebase throws auth/user-not-found if unknown.
    sendPasswordResetEmail: async (email) => {
        if (!email) throw new Error('Email is required');
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
