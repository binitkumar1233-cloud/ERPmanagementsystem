import { useState, useEffect, useRef } from 'react';

export function useCountUp(target, duration = 1200, startOnMount = true) {
    const [value, setValue] = useState(0);
    const started = useRef(false);

    useEffect(() => {
        if (!startOnMount || started.current) return;
        started.current = true;

        const numeric = parseFloat(String(target).replace(/[^0-9.]/g, ''));
        if (isNaN(numeric) || numeric === 0) { setValue(numeric); return; }

        const start = performance.now();
        const raf = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * numeric * 10) / 10);
            if (progress < 1) requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }, [target, duration, startOnMount]);

    // Re-attach suffix/prefix from original target string
    const raw = String(target);
    const prefix = raw.match(/^[^0-9]*/)?.[0] ?? '';
    const suffix = raw.match(/[^0-9.]+$/)?.[0] ?? '';
    const decimals = raw.includes('.') ? (raw.split('.')[1]?.replace(/[^0-9]/g, '').length ?? 0) : 0;

    return `${prefix}${decimals ? value.toFixed(decimals) : value.toLocaleString('en-IN')}${suffix}`;
}
