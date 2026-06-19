export default function Skeleton({ width = '100%', height = 16, radius = 8, style = {} }) {
    return (
        <div
            className="skeleton"
            style={{ width, height, borderRadius: radius, flexShrink: 0, ...style }}
        />
    );
}

export function SkeletonTable({ rows = 5, cols = 4 }) {
    return (
        <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
                <Skeleton width={180} height={18} radius={6} />
            </div>
            <div style={{ padding: '0 0 8px' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gap: 0,
                    padding: '14px 22px',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--bg-elevated)',
                }}>
                    {Array.from({ length: cols }).map((_, i) => (
                        <Skeleton key={i} width="60%" height={12} radius={4} />
                    ))}
                </div>
                {Array.from({ length: rows }).map((_, r) => (
                    <div key={r} style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gap: 0,
                        padding: '16px 22px',
                        borderBottom: r < rows - 1 ? '1px solid var(--border)' : 'none',
                        alignItems: 'center',
                    }}>
                        {Array.from({ length: cols }).map((_, c) => (
                            <Skeleton key={c} width={c === 0 ? '75%' : '55%'} height={13} radius={4} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export function SkeletonCard({ lines = 3 }) {
    return (
        <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                <Skeleton width={40} height={40} radius={10} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
                    <Skeleton width="55%" height={14} radius={5} />
                    <Skeleton width="35%" height={11} radius={4} />
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {Array.from({ length: lines }).map((_, i) => (
                    <Skeleton key={i} width={i === lines - 1 ? '65%' : '100%'} height={12} radius={4} />
                ))}
            </div>
        </div>
    );
}

export function SkeletonStats() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card" style={{ padding: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                        <Skeleton width={46} height={46} radius={10} />
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <Skeleton width="65%" height={11} radius={4} />
                            <Skeleton width="50%" height={26} radius={5} />
                            <Skeleton width="45%" height={10} radius={99} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
