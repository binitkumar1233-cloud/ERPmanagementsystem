import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const CONFIGS = {
    success: { color: '#10b981', Icon: CheckCircle },
    error:   { color: '#ef4444', Icon: AlertCircle },
    info:    { color: '#06b6d4', Icon: Info },
    warning: { color: '#f59e0b', Icon: AlertTriangle },
};

function Toast({ toast, dismiss }) {
    const { color, Icon } = CONFIGS[toast.type] || CONFIGS.info;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'white',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(15,23,42,0.14), 0 2px 8px rgba(15,23,42,0.08)',
            width: 320,
            padding: '14px 16px',
            position: 'relative',
            overflow: 'hidden',
            animation: 'toastSlideIn 0.22s cubic-bezier(0.4,0,0.2,1) both',
        }}>
            <div style={{
                position: 'absolute',
                left: 0, top: 0, bottom: 0,
                width: 4,
                background: color,
                borderRadius: '14px 0 0 14px',
            }} />
            <div style={{ paddingLeft: 6, flexShrink: 0, color }}>
                <Icon size={18} strokeWidth={2.2} />
            </div>
            <span style={{
                flex: 1,
                fontSize: '0.855rem',
                color: '#0f172a',
                lineHeight: 1.45,
                fontFamily: 'var(--font-body)',
            }}>
                {toast.message}
            </span>
            <button
                onClick={() => dismiss(toast.id)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6b7280',
                    padding: 2,
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    borderRadius: 4,
                    transition: 'color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#0f172a'}
                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}
            >
                <X size={14} strokeWidth={2.5} />
            </button>
        </div>
    );
}

export default function ToastStack({ toasts, dismiss }) {
    if (!toasts.length) return null;

    return (
        <>
            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(48px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
            <div style={{
                position: 'fixed',
                bottom: 24,
                right: 24,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                zIndex: 99999,
                pointerEvents: 'none',
            }}>
                {toasts.map(t => (
                    <div key={t.id} style={{ pointerEvents: 'all' }}>
                        <Toast toast={t} dismiss={dismiss} />
                    </div>
                ))}
            </div>
        </>
    );
}
