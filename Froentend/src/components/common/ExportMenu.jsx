import { useState, useRef, useEffect } from 'react';
import { Download, FileText, Printer, ChevronDown } from 'lucide-react';
import { exportToCSV, exportToPrint } from '../../utils/exportUtils.js';

export default function ExportMenu({ title, rows, columns, disabled }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const handleCSV = () => {
        exportToCSV(title.replace(/\s+/g, '_'), rows, columns);
        setOpen(false);
    };

    const handlePrint = () => {
        exportToPrint(title, rows, columns);
        setOpen(false);
    };

    return (
        <div style={{ position: 'relative' }} ref={ref}>
            <button
                onClick={() => setOpen(o => !o)}
                disabled={disabled || !rows?.length}
                style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 14px', borderRadius: 10,
                    border: '1.5px solid #d1d5db', background: 'white',
                    fontSize: '0.85rem', fontWeight: 600, color: '#374151',
                    cursor: disabled || !rows?.length ? 'not-allowed' : 'pointer',
                    opacity: disabled || !rows?.length ? 0.5 : 1,
                    transition: 'all 0.15s',
                }}
            >
                <Download size={15} />
                Export
                <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                    background: 'white', border: '1.5px solid #e5e7eb',
                    borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    zIndex: 999, minWidth: 180, overflow: 'hidden',
                    animation: 'fadeDown 0.12s ease',
                }}>
                    <div style={{ padding: '6px 10px 4px', fontSize: '0.68rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        Export as
                    </div>
                    <button onClick={handleCSV} style={menuItemStyle}>
                        <div style={{ ...menuIconStyle, background: '#d1fae5', color: '#059669' }}><FileText size={13} /></div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>CSV / Excel</div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Opens in spreadsheet</div>
                        </div>
                    </button>
                    <button onClick={handlePrint} style={{ ...menuItemStyle, borderBottom: 'none' }}>
                        <div style={{ ...menuIconStyle, background: '#e0e7ff', color: '#4338ca' }}><Printer size={13} /></div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Print / PDF</div>
                            <div style={{ fontSize: '0.72rem', color: '#9ca3af' }}>Save as PDF or print</div>
                        </div>
                    </button>
                </div>
            )}

            <style>{`
                @keyframes fadeDown { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }
            `}</style>
        </div>
    );
}

const menuItemStyle = {
    display: 'flex', alignItems: 'center', gap: 10,
    width: '100%', padding: '10px 12px',
    background: 'none', border: 'none', borderBottom: '1px solid #f3f4f6',
    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
    transition: 'background 0.1s',
};

const menuIconStyle = {
    width: 30, height: 30, borderRadius: 8,
    display: 'grid', placeItems: 'center', flexShrink: 0,
};
