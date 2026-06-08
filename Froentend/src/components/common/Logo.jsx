/**
 * Logo component — icon mark + wordmark.
 * Props:
 *   size    : 'xs' | 'sm' | 'md' (default) | 'lg' | 'xl'
 *   variant : 'full' (default) | 'icon' | 'wordmark'
 *   style   : extra inline styles for the wrapper
 */
export default function Logo({ size = 'md', variant = 'full', style }) {
    const cfg = {
        xs: { box: 28, r: 7,  cap: 10, sub: 8,  main: 13, gap: 8  },
        sm: { box: 36, r: 9,  cap: 13, sub: 9,  main: 16, gap: 10 },
        md: { box: 44, r: 11, cap: 16, sub: 10, main: 19, gap: 12 },
        lg: { box: 56, r: 14, cap: 20, sub: 12, main: 24, gap: 14 },
        xl: { box: 72, r: 18, cap: 26, sub: 14, main: 30, gap: 18 },
    }[size] || { box: 44, r: 11, cap: 16, sub: 10, main: 19, gap: 12 };

    const IconMark = () => (
        <svg
            width={cfg.box}
            height={cfg.box}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ flexShrink: 0 }}
        >
            <defs>
                <linearGradient id="logoIconGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#0f172a" />
                    <stop offset="55%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="logoShine" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
            </defs>

            {/* Background */}
            <rect width="40" height="40" rx={cfg.r * (40 / cfg.box)} fill="url(#logoIconGrad)" />
            <rect width="40" height="20" rx={cfg.r * (40 / cfg.box)} fill="url(#logoShine)" />

            {/* Mortarboard top (diamond) */}
            <polygon points="20,7 31,13 20,19 9,13" fill="white" />

            {/* Cap body */}
            <path d="M12,19 L12,27 C12,29.5 20,31.5 20,31.5 C20,31.5 28,29.5 28,27 L28,19 L20,23.5 Z" fill="rgba(255,255,255,0.86)" />

            {/* Brim */}
            <ellipse cx="20" cy="31.5" rx="8" ry="2.2" fill="rgba(255,255,255,0.4)" />

            {/* Tassel cord */}
            <line x1="31" y1="13" x2="31" y2="24" stroke="white" strokeWidth="1.6" strokeLinecap="round" opacity="0.82" />

            {/* Tassel dot (gold) */}
            <circle cx="31" cy="26.5" r="2.4" fill="#fbbf24" />
            <circle cx="31" cy="26.5" r="1.2" fill="#f59e0b" />
        </svg>
    );

    const Wordmark = () => (
        <div style={{ lineHeight: 1 }}>
            <div style={{
                fontSize: cfg.main,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#0f172a',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                whiteSpace: 'nowrap',
            }}>
                Edu<span style={{ color: '#1e3a8a' }}>Manage</span>
            </div>
            {variant === 'full' && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 6, marginTop: 3,
                }}>
                    <span style={{
                        fontSize: cfg.sub - 1,
                        fontWeight: 700,
                        color: '#1e3a8a',
                        background: '#dbeafe',
                        borderRadius: 4,
                        padding: '1px 5px',
                        letterSpacing: '0.05em',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}>
                        ERP
                    </span>
                    <span style={{
                        fontSize: cfg.sub,
                        fontWeight: 500,
                        color: '#64748b',
                        letterSpacing: '0.01em',
                        whiteSpace: 'nowrap',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}>
                        School &amp; College Management
                    </span>
                </div>
            )}
        </div>
    );

    if (variant === 'icon') return <IconMark />;
    if (variant === 'wordmark') return <Wordmark />;

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: cfg.gap, ...style }}>
            <IconMark />
            <Wordmark />
        </div>
    );
}
