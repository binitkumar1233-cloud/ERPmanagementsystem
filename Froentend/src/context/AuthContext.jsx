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

    useEffect(() => {
        const timeout = setTimeout(() => setAuthLoading(false), 5000);

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            clearTimeout(timeout);

            const authSource  = localStorage.getItem('erp_auth_source');
            const onLoginPage = window.location.pathname === '/login' || window.location.pathname === '/';

            if (firebaseUser && (onLoginPage || !authSource)) {
                // Firebase user on the login page (Google redirect just returned)
                // OR first-ever session — exchange for a backend JWT.
                try {
                    const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                    let userData, token;

                    try {
                        const res = await fetch(`${BASE}/auth/google`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                uid:   firebaseUser.uid,
                                name:  firebaseUser.displayName,
                                email: firebaseUser.email,
                                photo: firebaseUser.photoURL,
                            }),
                        });
                        if (res.ok) {
                            const data = await res.json();
                            token    = data.token;
                            userData = data.data;
                            localStorage.setItem('erp_auth_source', 'backend');
                        }
                    } catch { /* backend offline — fall through to Firebase token */ }

                    if (!token) {
                        token = await firebaseUser.getIdToken();
                        userData = {
                            id:    firebaseUser.uid,
                            name:  firebaseUser.displayName,
                            email: firebaseUser.email,
                            role:  'Administrator',
                            photo: firebaseUser.photoURL,
                        };
                        localStorage.setItem('erp_auth_source', 'firebase');
                    }

                    localStorage.setItem('erp_token', token);
                    localStorage.setItem('erp_user', JSON.stringify(userData));
                    setUser(userData);
                    setAuthLoading(false);
                    if (onLoginPage) window.location.href = '/dashboard';
                } catch {
                    setAuthLoading(false);
                }

            } else if (firebaseUser && authSource === 'firebase') {
                // Existing Firebase session on an interior page — just refresh the token
                try {
                    const token = await firebaseUser.getIdToken();
                    localStorage.setItem('erp_token', token);
                } catch { /* ignore */ }
                setAuthLoading(false);

            } else {
                // Backend JWT session or logged-out — don't touch erp_token
                setAuthLoading(false);
            }
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
