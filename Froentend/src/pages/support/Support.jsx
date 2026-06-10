import { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import {
    Phone, Mail, MessageCircle, ChevronDown, ChevronUp,
    Clock, Headphones, BookOpen, Shield, Zap, Users,
    ExternalLink, Send, CheckCircle, X, Minimize2,
} from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';

const BOT_REPLIES = [
    "Thanks for reaching out! A support agent will join shortly.",
    "I understand your concern. Let me check that for you.",
    "Could you please provide more details so I can assist you better?",
    "Our team is looking into this. You'll hear back within a few minutes.",
    "That's a great question! Here's what you can do...",
];

function LiveChat({ onClose }) {
    const [messages, setMessages] = useState([
        { id: 1, from: 'support', text: 'Hi! Welcome to EduManage Support 👋 How can we help you today?', time: new Date() },
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    const send = async () => {
        const text = input.trim();
        if (!text) return;
        const now = new Date();
        const userMsg = { id: Date.now(), from: 'user', text, time: now };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setTyping(true);

        // Fire email via EmailJS (non-blocking)
        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            {
                message: text,
                time: now.toLocaleString('en-IN'),
                to_email: 'binitkumar1233@gmail.com',
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        ).catch(() => {});

        setTimeout(() => {
            const reply = BOT_REPLIES[Math.floor(Math.random() * BOT_REPLIES.length)];
            setMessages(prev => [...prev, { id: Date.now() + 1, from: 'support', text: reply, time: new Date() }]);
            setTyping(false);
        }, 1400);
    };

    const fmt = (d) => d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, width: 360,
            background: 'white', borderRadius: 18, boxShadow: '0 12px 48px rgba(15,23,42,0.18)',
            border: '1.5px solid var(--border)', zIndex: 9999,
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            animation: 'chatIn 0.2s ease',
        }}>
            <style>{`@keyframes chatIn { from { opacity:0; transform:translateY(16px) scale(0.97); } to { opacity:1; transform:none; } }`}</style>

            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg,#7c3aed,#9d5cf6)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
                        <Headphones size={18} color="white" />
                    </div>
                    <span style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid white' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ color: 'white', fontWeight: 700, fontSize: '0.88rem', lineHeight: 1.2 }}>EduManage Support</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem' }}>Online · Avg. reply in 5 min</p>
                </div>
                <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'white' }}>
                    <X size={15} />
                </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 340, minHeight: 260 }}>
                {messages.map(m => (
                    <div key={m.id} style={{ display: 'flex', flexDirection: m.from === 'user' ? 'row-reverse' : 'row', gap: 8, alignItems: 'flex-end' }}>
                        {m.from === 'support' && (
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ede9fe', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                <Headphones size={13} color="#7c3aed" />
                            </div>
                        )}
                        <div style={{ maxWidth: '72%' }}>
                            <div style={{
                                padding: '9px 13px', borderRadius: m.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                                background: m.from === 'user' ? '#7c3aed' : '#f3f4f6',
                                color: m.from === 'user' ? 'white' : 'var(--text-primary)',
                                fontSize: '0.83rem', lineHeight: 1.5,
                            }}>
                                {m.text}
                            </div>
                            <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 3, textAlign: m.from === 'user' ? 'right' : 'left' }}>{fmt(m.time)}</p>
                        </div>
                    </div>
                ))}
                {typing && (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#ede9fe', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                            <Headphones size={13} color="#7c3aed" />
                        </div>
                        <div style={{ background: '#f3f4f6', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', display: 'flex', gap: 4, alignItems: 'center' }}>
                            {[0,1,2].map(i => (
                                <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#9ca3af', display: 'block', animation: `bounce 1s ${i*0.2}s infinite` }} />
                            ))}
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
                <style>{`.bounce-dot { animation: bounce 1s infinite; } @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }`}</style>
            </div>

            {/* Input */}
            <div style={{ borderTop: '1px solid var(--border)', padding: '12px 14px', display: 'flex', gap: 8 }}>
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && send()}
                    placeholder="Type a message..."
                    style={{ flex: 1, border: '1.5px solid var(--border)', borderRadius: 10, padding: '9px 13px', fontSize: '0.83rem', outline: 'none', fontFamily: 'var(--font-body)' }}
                />
                <button
                    onClick={send}
                    style={{ width: 38, height: 38, borderRadius: 10, background: '#7c3aed', border: 'none', display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0 }}
                >
                    <Send size={15} color="white" />
                </button>
            </div>
        </div>
    );
}

const FAQS = [
    {
        q: 'How to reset password?',
        a: 'Go to the login screen and click "Forgot Password." Enter your registered email address, then follow the instructions sent to your inbox to reset your password securely.',
    },
    {
        q: 'How to manage student records?',
        a: 'Open the Students page from the sidebar. Use the student list to view, edit, or delete records, and click Add Student to register new admissions.',
    },
    {
        q: 'How to update course details?',
        a: 'Navigate to the Courses page, select the course you want to update, then edit the course fields and save the changes to update course information.',
    },
    {
        q: 'How to mark attendance?',
        a: 'Go to the Attendance page, select the class and date, then mark each student as Present, Absent, or Late and click Save to submit.',
    },
    {
        q: 'How to generate fee receipts?',
        a: 'Open the Fees module, search for the student, record the payment details and click Collect Fee. A receipt will be generated automatically.',
    },
];

const CHANNELS = [
    {
        icon: Phone,
        label: 'Phone Support',
        value: '+91 98765 43210',
        sub: 'Available 24 / 7',
        color: '#1e40af',
        bg: '#dbeafe',
        action: 'Call Now',
        href: 'tel:+919876543210',
    },
    {
        icon: Mail,
        label: 'Email Support',
        value: 'support@edumanage.com',
        sub: 'Reply within 1 business day',
        color: '#059669',
        bg: '#d1fae5',
        action: 'Send Email',
        href: 'mailto:support@edumanage.com',
    },
    {
        icon: MessageCircle,
        label: 'Live Chat',
        value: 'Start a conversation',
        sub: 'Avg. response in 5 minutes',
        color: '#7c3aed',
        bg: '#ede9fe',
        action: 'Open Chat',
        href: null,
    },
];

const FEATURES = [
    { icon: Zap,      label: 'Instant Setup',    sub: 'Get started in minutes'     },
    { icon: Shield,   label: 'Secure & Safe',     sub: 'Your data is protected'     },
    { icon: Users,    label: 'Team Support',      sub: 'Dedicated support team'     },
    { icon: BookOpen, label: 'Full Docs',          sub: 'Detailed user guides'       },
];

function FAQ({ q, a }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            onClick={() => setOpen(v => !v)}
            style={{
                border: '1.5px solid var(--border)',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'box-shadow 0.18s',
                boxShadow: open ? 'var(--shadow-md)' : 'none',
                background: open ? '#f8fafc' : 'white',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{q}</span>
                {open
                    ? <ChevronUp size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                    : <ChevronDown size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                }
            </div>
            {open && (
                <div style={{ padding: '0 20px 18px', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, borderTop: '1px solid var(--border)' }}>
                    <p style={{ paddingTop: 14 }}>{a}</p>
                </div>
            )}
        </div>
    );
}

export default function Support() {
    const [sent, setSent] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [chatOpen, setChatOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSent(true);
        setForm({ name: '', email: '', message: '' });
        setTimeout(() => setSent(false), 4000);
    };

    return (
        <div className="erp-page">
            <Navbar title="Support" subtitle="We're here to help you 24/7" />

            {/* ── Hero ── */}
            <div style={{
                background: 'linear-gradient(135deg, #2d1b69 0%, #3730a3 30%, #4f46e5 65%, #6366f1 100%)',
                borderRadius: 20, padding: '40px 36px', marginBottom: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
                flexWrap: 'wrap', position: 'relative', overflow: 'hidden',
            }}>
                {/* Background decoration */}
                <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 65%)', pointerEvents: 'none' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                        <div style={{ background: 'rgba(255,255,255,0.14)', borderRadius: 11, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                            <Headphones size={18} color="white" />
                            <span style={{ color: 'white', fontSize: '0.71rem', fontWeight: 700, letterSpacing: '0.07em' }}>SUPPORT CENTER</span>
                        </div>
                    </div>
                    <h1 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)' }}>Help &amp; Support</h1>
                    <p style={{ color: 'rgba(255,255,255,0.68)', fontSize: '0.88rem', lineHeight: 1.7, maxWidth: 380 }}>Reach out to our team anytime — we're always here and ready to assist you.</p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                    {FEATURES.map(({ icon: Icon, label, sub }) => (
                        <div key={label} style={{ background: 'rgba(255,255,255,0.10)', borderRadius: 14, padding: '14px 18px', minWidth: 128, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.14)', transition: 'background 0.2s' }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(255,255,255,0.14)', display: 'grid', placeItems: 'center', marginBottom: 8 }}>
                                <Icon size={17} color="white" />
                            </div>
                            <p style={{ color: 'white', fontWeight: 700, fontSize: '0.81rem', lineHeight: 1.3, marginBottom: 3 }}>{label}</p>
                            <p style={{ color: 'rgba(255,255,255,0.52)', fontSize: '0.68rem', lineHeight: 1.4 }}>{sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Contact Channels ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                {CHANNELS.map(({ icon: Icon, label, value, sub, color, bg, action, href }) => (
                    <div key={label} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                        {/* Colored accent top bar */}
                        <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}99)` }} />
                        <div style={{ padding: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                                <div style={{ width: 50, height: 50, borderRadius: 14, background: bg, display: 'grid', placeItems: 'center', flexShrink: 0, boxShadow: `0 4px 12px ${color}20` }}>
                                    <Icon size={22} color={color} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 4 }}>{label}</p>
                                    <p style={{ fontWeight: 600, fontSize: '0.82rem', color }}>{value}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 5 }}>
                                        <Clock size={11} color="var(--text-muted)" />
                                        <span style={{ fontSize: '0.71rem', color: 'var(--text-muted)' }}>{sub}</span>
                                    </div>
                                </div>
                            </div>
                            {href ? (
                                <a href={href} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    width: '100%', padding: '10px 0', borderRadius: 10,
                                    background: bg, color, fontWeight: 700, fontSize: '0.82rem',
                                    textDecoration: 'none', border: `1.5px solid ${color}30`,
                                    transition: 'filter 0.15s',
                                }}>
                                    {action} <ExternalLink size={13} />
                                </a>
                            ) : (
                                <button onClick={() => setChatOpen(true)} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                    width: '100%', padding: '10px 0', borderRadius: 10,
                                    background: bg, color, fontWeight: 700, fontSize: '0.82rem',
                                    border: `1.5px solid ${color}30`, cursor: 'pointer',
                                    transition: 'filter 0.15s',
                                }}>
                                    {action} <MessageCircle size={13} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {chatOpen && <LiveChat onClose={() => setChatOpen(false)} />}

            {/* ── FAQ + Contact Form ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                {/* FAQ */}
                <div className="card" style={{ overflow: 'visible' }}>
                    <div className="card-header">
                        <h2>Frequently Asked Questions</h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg)', padding: '3px 10px', borderRadius: 99, fontWeight: 600 }}>{FAQS.length} questions</span>
                    </div>
                    <div style={{ padding: '18px 22px', display: 'grid', gap: 10 }}>
                        {FAQS.map(faq => <FAQ key={faq.q} {...faq} />)}
                    </div>
                </div>

                {/* Contact Form */}
                <div className="card">
                    <div className="card-header">
                        <h2>Send Us a Message</h2>
                    </div>
                    <div style={{ padding: '22px' }}>
                        {sent ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '48px 20px', textAlign: 'center' }}>
                                <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#d1fae5', display: 'grid', placeItems: 'center' }}>
                                    <CheckCircle size={28} color="#059669" />
                                </div>
                                <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Message Sent!</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>We'll get back to you within 1 business day.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
                                <div className="field">
                                    <label>Your Name</label>
                                    <input
                                        placeholder="e.g. Rahul Sharma"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="e.g. rahul@school.com"
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        required
                                    />
                                </div>
                                <div className="field">
                                    <label>Message</label>
                                    <textarea
                                        placeholder="Describe your issue or question..."
                                        rows={5}
                                        value={form.message}
                                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                                    <Send size={15} /> Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
