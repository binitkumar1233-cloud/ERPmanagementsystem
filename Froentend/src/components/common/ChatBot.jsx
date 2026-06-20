import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Trash2 } from 'lucide-react';

const KEY   = import.meta.env.VITE_GROQ_API_KEY;
const MODEL = 'llama-3.1-8b-instant';

const SYSTEM = `You are EduBot, a smart AI assistant for EduManage ERP — a comprehensive School & College Management System.

You help users with:
- Student enrollment, profiles, and record management
- Fee management and online payments (Razorpay integration)
- Attendance tracking and reports
- Academic results, grades, and CGPA trends
- Teacher and staff management
- Course and department management
- Admissions and application processing
- Timetable, exam schedules, and notifications
- LMS (Learning Management System)
- Transport, hostel, and inventory management
- Role-based access (SuperAdmin > Administrator > Teacher > Staff > Student)
- Student portal features (dashboard, marksheet download, exam schedule)

Keep answers concise and practical. Use bullet points for lists. If a question is outside EduManage ERP, gently redirect to ERP topics.`;

const WELCOME = { role: 'assistant', content: "Hi! I'm **EduBot** 👋\n\nI'm your AI assistant for EduManage ERP. I can help you with:\n- Student & fee management\n- Attendance & results\n- Admissions & timetables\n- Student portal features\n\nWhat can I help you with today?" };

function renderContent(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n- /g, '\n• ')
        .split('\n')
        .map((line, i) => <span key={i}>{i > 0 && <br />}<span dangerouslySetInnerHTML={{ __html: line }} /></span>);
}

export default function ChatBot() {
    const [open, setOpen]       = useState(false);
    const [msgs, setMsgs]       = useState([WELCOME]);
    const [input, setInput]     = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef  = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);
    useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 120); }, [open]);

    const send = async () => {
        const text = input.trim();
        if (!text || loading || !KEY) return;

        const userMsg = { role: 'user', content: text };
        setMsgs(prev => [...prev, userMsg, { role: 'assistant', content: '' }]);
        setInput('');
        setLoading(true);

        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: MODEL,
                    stream: true,
                    max_tokens: 600,
                    messages: [
                        { role: 'system', content: SYSTEM },
                        ...msgs.filter(m => m.content).slice(-10),
                        userMsg,
                    ],
                }),
            });

            if (!res.ok) throw new Error(`API error ${res.status}`);

            const reader  = res.body.getReader();
            const decoder = new TextDecoder();
            let buf = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                const lines = buf.split('\n');
                buf = lines.pop();
                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue;
                    const raw = line.slice(6).trim();
                    if (raw === '[DONE]') break;
                    try {
                        const delta = JSON.parse(raw).choices?.[0]?.delta?.content || '';
                        if (delta) {
                            setMsgs(prev => {
                                const copy = [...prev];
                                copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + delta };
                                return copy;
                            });
                        }
                    } catch { /* skip malformed SSE line */ }
                }
            }
        } catch {
            setMsgs(prev => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' };
                return copy;
            });
        } finally {
            setLoading(false);
        }
    };

    const unreadCount = !open ? msgs.filter(m => m.role === 'assistant' && m !== WELCOME).length : 0;

    return (
        <>
            {/* Chat window */}
            {open && (
                <div style={S.window}>
                    {/* Header */}
                    <div style={S.header}>
                        <div style={S.headerAvatar}><Bot size={17} color="white" /></div>
                        <div style={{ flex: 1 }}>
                            <div style={S.headerName}>EduBot</div>
                            <div style={S.headerSub}>
                                <span style={S.onlineDot} /> AI Assistant · EduManage ERP
                            </div>
                        </div>
                        <button
                            title="Clear chat"
                            style={{ ...S.iconBtn, marginRight: 4 }}
                            onClick={() => setMsgs([WELCOME])}
                        >
                            <Trash2 size={14} />
                        </button>
                        <button style={S.iconBtn} onClick={() => setOpen(false)}>
                            <X size={15} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={S.msgList}>
                        {msgs.map((m, i) => (
                            <div key={i} style={{ ...S.msgRow, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                                {m.role === 'assistant' && (
                                    <div style={S.botAv}><Bot size={11} color="white" /></div>
                                )}
                                <div style={{ ...S.bubble, ...(m.role === 'user' ? S.userBubble : S.botBubble) }}>
                                    {m.content
                                        ? renderContent(m.content)
                                        : <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
                                            {[0, 0.2, 0.4].map((delay, di) => (
                                                <span key={di} style={{ width: 7, height: 7, borderRadius: '50%', background: '#94a3b8', display: 'inline-block', animation: `chatDot 1.2s ${delay}s ease-in-out infinite` }} />
                                            ))}
                                          </span>
                                    }
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div style={S.inputBar}>
                        <input
                            ref={inputRef}
                            style={S.input}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                            placeholder="Ask EduBot anything…"
                            disabled={loading}
                            maxLength={500}
                        />
                        <button
                            style={{ ...S.sendBtn, opacity: (!input.trim() || loading) ? 0.45 : 1 }}
                            onClick={send}
                            disabled={!input.trim() || loading}
                        >
                            <Send size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* FAB */}
            <button
                style={S.fab}
                onClick={() => setOpen(v => !v)}
                title={open ? 'Close chat' : 'Open EduBot'}
            >
                {open
                    ? <X size={22} color="white" />
                    : <MessageCircle size={22} color="white" />
                }
                {unreadCount > 0 && !open && (
                    <span style={S.fabBadge}>{unreadCount}</span>
                )}
            </button>

            <style>{`
                @keyframes chatDot {
                    0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
                    40%         { transform: scale(1);   opacity: 1;   }
                }
            `}</style>
        </>
    );
}

/* ── Styles ── */
const S = {
    /* FAB */
    fab: {
        position: 'fixed', bottom: 24, right: 90,
        width: 54, height: 54, borderRadius: '50%',
        background: 'linear-gradient(135deg, #1e3a8a, #2563eb)',
        border: 'none', cursor: 'pointer',
        display: 'grid', placeItems: 'center',
        boxShadow: '0 6px 24px rgba(37,99,235,0.45)',
        zIndex: 1200, transition: 'transform 0.2s, box-shadow 0.2s',
    },
    fabBadge: {
        position: 'absolute', top: -3, right: -3,
        minWidth: 18, height: 18, borderRadius: 99,
        background: '#dc2626', color: 'white',
        fontSize: '0.6rem', fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: '2px solid white', padding: '0 3px',
    },

    /* Window */
    window: {
        position: 'fixed', bottom: 90, right: 24,
        width: 370, height: 510,
        background: 'white', borderRadius: 18,
        boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
        zIndex: 1200, display: 'flex', flexDirection: 'column',
        overflow: 'hidden', border: '1px solid #e2e8f0',
    },

    /* Header */
    header: {
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 14px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)',
        flexShrink: 0,
    },
    headerAvatar: {
        width: 36, height: 36, borderRadius: 10,
        background: 'rgba(255,255,255,0.15)',
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'grid', placeItems: 'center', flexShrink: 0,
    },
    headerName: { fontSize: '0.86rem', fontWeight: 800, color: 'white', lineHeight: 1 },
    headerSub:  { fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 },
    onlineDot:  { width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' },
    iconBtn: {
        width: 28, height: 28, borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(255,255,255,0.1)',
        cursor: 'pointer', display: 'grid', placeItems: 'center',
        color: 'rgba(255,255,255,0.75)', flexShrink: 0,
    },

    /* Messages */
    msgList: {
        flex: 1, overflowY: 'auto', padding: '14px 12px 6px',
        display: 'flex', flexDirection: 'column', gap: 10,
    },
    msgRow: { display: 'flex', alignItems: 'flex-end', gap: 7 },
    botAv: {
        width: 24, height: 24, borderRadius: 7, flexShrink: 0,
        background: 'linear-gradient(135deg, #1e40af, #2563eb)',
        display: 'grid', placeItems: 'center',
    },
    bubble: {
        maxWidth: '80%', padding: '9px 13px', borderRadius: 14,
        fontSize: '0.79rem', lineHeight: 1.6, wordBreak: 'break-word',
    },
    botBubble:  { background: '#f1f5f9', color: '#0f172a', borderBottomLeftRadius: 4 },
    userBubble: {
        background: 'linear-gradient(135deg, #1e40af, #2563eb)',
        color: 'white', borderBottomRightRadius: 4,
    },

    /* Input bar */
    inputBar: {
        display: 'flex', gap: 8, padding: '10px 12px 14px',
        borderTop: '1px solid #f1f5f9', flexShrink: 0,
        background: 'white',
    },
    input: {
        flex: 1, padding: '9px 13px', borderRadius: 10,
        border: '1.5px solid #e2e8f0', fontSize: '0.82rem',
        outline: 'none', background: '#f8fafc',
        color: '#0f172a', transition: 'border-color 0.15s',
    },
    sendBtn: {
        width: 38, height: 38, borderRadius: 10,
        background: 'linear-gradient(135deg, #1e40af, #2563eb)',
        border: 'none', cursor: 'pointer',
        display: 'grid', placeItems: 'center',
        color: 'white', flexShrink: 0, transition: 'opacity 0.15s',
    },
};
