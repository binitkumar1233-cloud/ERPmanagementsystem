import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function PageProgress() {
    const location = useLocation();
    const [state, setState] = useState('idle'); // idle | loading | done
    const [width, setWidth] = useState(0);
    const timerRef = useRef(null);
    const doneTimerRef = useRef(null);

    useEffect(() => {
        clearTimeout(timerRef.current);
        clearTimeout(doneTimerRef.current);

        setWidth(0);
        setState('loading');

        const raf = requestAnimationFrame(() => {
            setWidth(80);
        });

        timerRef.current = setTimeout(() => {
            setWidth(100);
            setState('done');
            doneTimerRef.current = setTimeout(() => {
                setState('idle');
                setWidth(0);
            }, 300);
        }, 300);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(timerRef.current);
            clearTimeout(doneTimerRef.current);
        };
    }, [location.pathname]);

    if (state === 'idle') return null;

    return (
        <>
            <style>{`
                @keyframes progressIndeterminate {
                    0%   { opacity: 1; }
                    100% { opacity: 0; }
                }
            `}</style>
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                height: 3,
                width: `${width}%`,
                background: 'linear-gradient(90deg, var(--primary-dark), var(--primary), var(--primary-light))',
                zIndex: 9999,
                transition: state === 'loading'
                    ? 'width 300ms cubic-bezier(0.4,0,0.2,1)'
                    : 'width 120ms ease, opacity 200ms ease',
                opacity: state === 'done' ? 0 : 1,
                borderRadius: '0 2px 2px 0',
                boxShadow: '0 0 8px rgba(79,70,229,0.5)',
                pointerEvents: 'none',
            }} />
        </>
    );
}
