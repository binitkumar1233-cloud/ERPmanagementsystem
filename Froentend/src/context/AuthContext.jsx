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

    /* Keep token fresh — Firebase rotates tokens every hour */
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const token = await firebaseUser.getIdToken();
                localStorage.setItem('erp_token', token);
            } else {
                /* Only clear if not a student session (students don't use Firebase) */
                const stored = JSON.parse(localStorage.getItem('erp_user') || 'null');
                if (stored?.role !== 'Student') {
                    setUser(null);
                    localStorage.removeItem('erp_user');
                    localStorage.removeItem('erp_token');
                }
            }
            setAuthLoading(false);
        });
        return unsub;
    }, []);

    const login = useCallback(async (email, password) => {
        const userData = await authService.login(email, password);
        setUser(userData);
        localStorage.setItem('erp_user', JSON.stringify(userData));
        return userData;
    }, []);

    const loginWithGoogle = useCallback(async () => {
        const userData = await authService.loginWithGoogle();
        setUser(userData);
        localStorage.setItem('erp_user', JSON.stringify(userData));
        return userData;
    }, []);

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

    if (authLoading) return null;

    return (
        <AuthContext.Provider value={{
            user, login, loginWithGoogle, loginStudent, logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}
