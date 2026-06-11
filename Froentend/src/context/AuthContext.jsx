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
        // Emergency fallback — releases loading gate if Firebase never fires
        const timeout = setTimeout(() => setAuthLoading(false), 8000);

        // Hold the loading gate open until BOTH the redirect-result check AND the
        // auth-state check complete, so the login page never flashes mid-flow.
        let redirectDone = false;
        let stateDone    = false;
        const release = () => {
            if (redirectDone && stateDone) {
                clearTimeout(timeout);
                setAuthLoading(false);
            }
        };

        // Pick up a Google redirect result (if the user just came back from Google OAuth).
        // Returns null on every normal page load — safe to call unconditionally.
        authService.getGoogleRedirectResult()
            .then((userData) => {
                if (userData) {
                    localStorage.setItem('erp_user', JSON.stringify(userData));
                    setUser(userData);
                    // Redirect result means we just signed in — go to dashboard
                    window.location.replace('/dashboard');
                    // Don't release loading gate — the page is navigating away
                    return;
                }
                redirectDone = true;
                release();
            })
            .catch((err) => {
                console.error('[Auth] getGoogleRedirectResult error:', err);
                redirectDone = true;
                release();
            });

        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            const authSource = localStorage.getItem('erp_auth_source');
            const storedUser = localStorage.getItem('erp_user');

            // Silently refresh a stored Firebase token on subsequent page loads
            if (storedUser && authSource === 'firebase' && firebaseUser) {
                try {
                    const token = await firebaseUser.getIdToken();
                    localStorage.setItem('erp_token', token);
                } catch { /* ignore */ }
            }

            stateDone = true;
            release();
        }, () => {
            stateDone = true;
            release();
        });

        return () => { unsub(); clearTimeout(timeout); };
    }, []);

    const login = useCallback(async (email, password) => {
        const userData = await authService.login(email, password);
        localStorage.setItem('erp_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    }, []);

    const loginWithGoogle = useCallback(
        () => authService.loginWithGoogle(), // triggers redirect — no return value
        []
    );

    const loginStudent = useCallback(async (email, password) => {
        const userData = await authService.loginStudent(email, password);
        localStorage.setItem('erp_user', JSON.stringify(userData));
        setUser(userData);
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
