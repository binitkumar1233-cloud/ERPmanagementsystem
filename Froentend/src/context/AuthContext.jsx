import { createContext, useState, useCallback, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase.js';
import { authService } from '../services/authService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('erp_user')); }
        catch { return null; }
    });
    const [authLoading, setAuthLoading] = useState(true);

    /* Keep Firebase token fresh — only for Firebase-authenticated users */
    useEffect(() => {
        // Fallback: if Firebase never responds (blocked, offline), unblock the app
        const timeout = setTimeout(() => setAuthLoading(false), 5000);

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            clearTimeout(timeout);
            // Only refresh erp_token from Firebase when the session was originally
            // established via Firebase (Google/email-Firebase). Backend JWT users must
            // NOT have their token overwritten — that would cause 401 on every page reload.
            if (firebaseUser && localStorage.getItem('erp_auth_source') === 'firebase') {
                const token = await firebaseUser.getIdToken();
                localStorage.setItem('erp_token', token);
            }
            setAuthLoading(false);
        }, () => {
            clearTimeout(timeout);
            setAuthLoading(false);
        });

        return () => { unsub(); clearTimeout(timeout); };
    }, []);

    const login = useCallback(async (email, password) => {
        const userData = await authService.login(email, password);
        setUser(userData);
        localStorage.setItem('erp_user', JSON.stringify(userData));
        return userData;
    }, []);

    // loginWithGoogle triggers signInWithRedirect — page navigates away immediately,
    // so there is no return value to process here. The redirect result is handled
    // by getGoogleRedirectResult in Login.jsx's useEffect after the page returns.
    const loginWithGoogle = useCallback(() => authService.loginWithGoogle(), []);

    const loginStudent = useCallback(async (email, password) => {
        const userData = await authService.loginStudent(email, password);
        setUser(userData);
        localStorage.setItem('erp_user', JSON.stringify(userData));
        return userData;
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
        window.location.href = '/login';
    }, []);

    if (authLoading) return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#eef2ff' }}>
            <div style={{ textAlign: 'center', color: '#4f6ef7' }}>
                <div style={{ width: 40, height: 40, border: '4px solid #c7d2fe', borderTopColor: '#4f6ef7', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Loading…</p>
            </div>
        </div>
    );

    return (
        <AuthContext.Provider value={{
            user, login, loginWithGoogle, loginStudent, logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
