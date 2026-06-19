import { createContext, useContext, useState, useCallback } from 'react';
import ToastStack from '../components/common/ToastStack.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const push = useCallback((type, message, duration = 3500) => {
        const id = Date.now() + Math.random();
        setToasts(p => [...p, { id, type, message }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), duration);
    }, []);

    const dismiss = useCallback((id) => setToasts(p => p.filter(t => t.id !== id)), []);

    const toast = {
        success: (msg, d) => push('success', msg, d),
        error:   (msg, d) => push('error',   msg, d),
        info:    (msg, d) => push('info',     msg, d),
        warning: (msg, d) => push('warning',  msg, d),
    };

    return (
        <ToastContext.Provider value={toast}>
            {children}
            <ToastStack toasts={toasts} dismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
