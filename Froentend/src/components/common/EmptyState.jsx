export default function EmptyState({ icon: Icon, title, subtitle, action = null }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '64px 20px',
            gap: 12,
            textAlign: 'center',
        }}>
            {Icon && (
                <div style={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    background: 'var(--primary-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    marginBottom: 4,
                }}>
                    <Icon size={22} strokeWidth={1.8} />
                </div>
            )}
            {title && (
                <p style={{
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    margin: 0,
                }}>
                    {title}
                </p>
            )}
            {subtitle && (
                <p style={{
                    fontSize: '0.82rem',
                    color: 'var(--text-muted)',
                    margin: 0,
                    maxWidth: 320,
                    lineHeight: 1.5,
                }}>
                    {subtitle}
                </p>
            )}
            {action && (
                <button
                    onClick={action.onClick}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 8 }}
                >
                    {action.label}
                </button>
            )}
        </div>
    );
}
