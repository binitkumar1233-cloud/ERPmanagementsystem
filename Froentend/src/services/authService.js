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
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const token = await credential.user.getIdToken();
        localStorage.setItem('erp_token', token);
        return {
            id:    credential.user.uid,
            name:  credential.user.displayName || email.split('@')[0],
            email: credential.user.email,
            role:  'Administrator',
            photo: credential.user.photoURL,
        };
    },

    loginWithGoogle: async () => {
        const credential = await signInWithPopup(auth, googleProvider);
        const token = await credential.user.getIdToken();
        localStorage.setItem('erp_token', token);
        return {
            id:    credential.user.uid,
            name:  credential.user.displayName,
            email: credential.user.email,
            role:  'Administrator',
            photo: credential.user.photoURL,
        };
    },

    loginStudent: async (email, password) => {
        await new Promise(r => setTimeout(r, 600));
        return {
            id: 'STU101', name: 'Riya Student', email,
            role: 'Student', course: 'B.Sc Computer Science',
            year: '2nd Year', section: 'A', phone: '98765 43210',
            feesStatus: 'Pending ₹12,000', latestGrade: 'A-',
        };
    },

    logout: async () => {
        await signOut(auth);
        localStorage.removeItem('erp_token');
        localStorage.removeItem('erp_user');
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
