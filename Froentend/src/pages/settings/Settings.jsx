import { useState, useContext } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import {
    User, Lock, Bell, Palette, Shield, Globe,
    Mail, Phone, Eye, EyeOff, Check, AlertCircle,
    ChevronRight, Sun, Moon, Monitor, Key, Smartphone,
    LogOut, Trash2, Download, RefreshCw, CheckCircle2,
    Send, Clock, Building, BookOpen, Calendar,
} from 'lucide-react';

/* ── Toggle Switch ── */
const Toggle = ({ checked, onChange }) => (
    <button
        onClick={() => onChange(!checked)}
        style={{
            width: 46, height: 26, borderRadius: 99, border: 'none',
            background: checked ? 'var(--primary)' : '#cbd5e1',
            position: 'relative', cursor: 'pointer',
            transition: 'background 0.22s ease', flexShrink: 0,
        }}
    >
        <span style={{
            position: 'absolute', top: 3,
            left: checked ? 23 : 3,
            width: 20, height: 20, borderRadius: '50%',
            background: 'white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            transition: 'left 0.22s ease',
        }} />
    </button>
);

/* ── Section card ── */
const SCard = ({ children, style, accent }) => (
    <div className="set-card" style={{ borderTop: accent ? `3px solid ${accent}` : undefined, ...style }}>
        {children}
    </div>
);

/* ── Section header ── */
const SHead = ({ icon: Icon, title, subtitle, color = 'var(--primary)' }) => (
    <div className="set-sec-head">
        <div className="set-sec-icon" style={{ background: `linear-gradient(135deg, ${color}22, ${color}10)`, color, border: `1px solid ${color}28` }}>
            <Icon size={18} />
        </div>
        <div style={{ flex: 1 }}>
            <p className="set-sec-title">{title}</p>
            {subtitle && <p className="set-sec-sub">{subtitle}</p>}
        </div>
    </div>
);

/* ── Row ── */
const Row = ({ label, sub, children }) => (
    <div className="set-row">
        <div style={{ flex: 1 }}>
            <p className="set-row-label">{label}</p>
            {sub && <p className="set-row-sub">{sub}</p>}
        </div>
        <div className="set-row-ctrl">{children}</div>
    </div>
);

const TAB_GROUPS = [
    {
        label: 'Account',
        items: [
            { key: 'profile',  label: 'Profile',  icon: User,    color: '#1e40af' },
            { key: 'security', label: 'Security', icon: Lock,    color: '#dc2626' },
        ],
    },
    {
        label: 'Preferences',
        items: [
            { key: 'notify',     label: 'Notifications', icon: Bell,    color: '#059669' },
            { key: 'appearance', label: 'Appearance',    icon: Palette, color: '#7c3aed' },
        ],
    },
    {
        label: 'System',
        items: [
            { key: 'system',  label: 'System',  icon: Building, color: '#d97706' },
            { key: 'privacy', label: 'Privacy', icon: Shield,   color: '#0891b2' },
        ],
    },
];
const TABS = TAB_GROUPS.flatMap(g => g.items);

export default function Settings() {
    const { user, logout } = useContext(AuthContext);
    const { theme, setTheme } = useTheme();
    const [tab, setTab] = useState('profile');

    /* ── Profile state ── */
    const [pName,  setPName]  = useState(user?.name  || 'Administrator');
    const [pEmail, setPEmail] = useState(user?.email || 'admin@school.edu');
    const [pPhone, setPPhone] = useState('+91 98765 43210');
    const [pRole,  setPRole]  = useState(user?.role  || 'Admin');
    const [saved,  setSaved]  = useState(false);

    /* ── Password reset state ── */
    const [pwStep,    setPwStep]    = useState(0); // 0=idle 1=email sent 2=otp entry 3=new pw 4=done
    const [pwEmail,   setPwEmail]   = useState(user?.email || 'admin@school.edu');
    const [otp,       setOtp]       = useState('');
    const [newPw,     setNewPw]     = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [showPw,    setShowPw]    = useState(false);
    const [showCPw,   setShowCPw]   = useState(false);
    const [pwError,   setPwError]   = useState('');
    const [otpTimer,  setOtpTimer]  = useState(60);
    const [timerID,   setTimerID]   = useState(null);

    /* ── 2FA ── */
    const [twoFA, setTwoFA] = useState(false);

    /* ── Notifications ── */
    const [notif, setNotif] = useState({
        attendance:    true,
        fees:          true,
        results:       true,
        announcements: true,
        sms:           false,
        email:         true,
        push:          false,
        weekly:        true,
        marketing:     false,
    });
    const togNotif = (k) => setNotif(n => ({ ...n, [k]: !n[k] }));

    /* ── Appearance ── */
    const [fontSize, setFontSize] = useState('medium');
    const [compact,  setCompact]  = useState(false);
    const [sidebar,  setSidebar]  = useState(true);

    /* ── System ── */
    const [acYear,    setAcYear]    = useState('2026-27');
    const [lang,      setLang]      = useState('en');
    const [timezone,  setTimezone]  = useState('Asia/Kolkata');
    const [dateFormat,setDateFmt]   = useState('DD/MM/YYYY');

    /* ── Privacy ── */
    const [dataShare,  setDataShare]  = useState(false);
    const [analytics,  setAnalytics]  = useState(true);
    const [crashLog,   setCrashLog]   = useState(true);
    const [activityLog,setActLog]     = useState(true);

    /* ── Helpers ── */
    const saveProfile = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

    const startOtpTimer = () => {
        if (timerID) clearInterval(timerID);
        setOtpTimer(60);
        const id = setInterval(() => {
            setOtpTimer(t => { if (t <= 1) { clearInterval(id); return 0; } return t - 1; });
        }, 1000);
        setTimerID(id);
    };

    const sendOtp = () => {
        if (!pwEmail.includes('@')) { setPwError('Please enter a valid email address.'); return; }
        setPwError('');
        setPwStep(1);
        startOtpTimer();
    };

    const verifyOtp = () => {
        if (otp.length !== 6) { setPwError('Enter the 6-digit OTP sent to your email.'); return; }
        setPwError('');
        setPwStep(3);
    };

    const changePassword = () => {
        if (newPw.length < 8)        { setPwError('Password must be at least 8 characters.'); return; }
        if (newPw !== confirmPw)     { setPwError('Passwords do not match.'); return; }
        if (!/[A-Z]/.test(newPw))    { setPwError('Include at least one uppercase letter.'); return; }
        if (!/[0-9]/.test(newPw))    { setPwError('Include at least one number.'); return; }
        setPwError('');
        setPwStep(4);
    };

    const resetPwFlow = () => { setPwStep(0); setOtp(''); setNewPw(''); setConfirmPw(''); setPwError(''); };

    const pwStrength = (pw) => {
        let s = 0;
        if (pw.length >= 8)           s++;
        if (/[A-Z]/.test(pw))         s++;
        if (/[0-9]/.test(pw))         s++;
        if (/[^A-Za-z0-9]/.test(pw))  s++;
        return s; // 0-4
    };
    const pwS = pwStrength(newPw);
    const pwSLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const pwSColors = ['', '#dc2626', '#d97706', '#2563eb', '#059669'];

    return (
        <div className="erp-page">
            <Navbar title="Settings" subtitle="Manage your account and system preferences" />

            {/* ── Layout: sidebar tabs + content ── */}
            <div className="set-layout">

                {/* Tab sidebar */}
                <nav className="set-nav">
                    {TAB_GROUPS.map(group => (
                        <div key={group.label} className="set-nav-group">
                            <div className="set-nav-group-label">{group.label}</div>
                            {group.items.map(({ key, label, icon: Icon, color }) => {
                                const active = tab === key;
                                return (
                                    <button
                                        key={key}
                                        className={`set-nav-btn${active ? ' set-nav-btn--active' : ''}`}
                                        onClick={() => setTab(key)}
                                        style={active ? { '--nav-accent': color } : {}}
                                    >
                                        <div className="set-nav-icon" style={{
                                            background: active ? `${color}18` : 'var(--bg)',
                                            color: active ? color : 'var(--text-muted)',
                                        }}>
                                            <Icon size={14} />
                                        </div>
                                        <span>{label}</span>
                                        {active && <ChevronRight size={12} className="set-nav-arrow" />}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                    <div className="set-nav-footer">
                        <button className="set-nav-logout" onClick={logout}>
                            <LogOut size={14} /> Sign Out
                        </button>
                    </div>
                </nav>

                {/* Content */}
                <div className="set-content" key={tab}>

                    {/* ══════════ PROFILE ══════════ */}
                    {tab === 'profile' && (
                        <div className="set-pane">
                            <SCard accent="#1e40af">
                                <SHead icon={User} title="Personal Information" subtitle="Update your name, email and contact details" />
                                <div className="set-divider" />

                                {/* Avatar row */}
                                <div className="set-avatar-row">
                                    <div className="set-avatar">
                                        {pName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="set-avatar-name">{pName}</p>
                                        <p className="set-avatar-role">{pRole}</p>
                                    </div>
                                </div>

                                <div className="set-form-grid">
                                    <div className="set-field">
                                        <label>Full Name</label>
                                        <input value={pName} onChange={e => setPName(e.target.value)} placeholder="Full Name" />
                                    </div>
                                    <div className="set-field">
                                        <label>Role / Designation</label>
                                        <input value={pRole} onChange={e => setPRole(e.target.value)} placeholder="Role" />
                                    </div>
                                    <div className="set-field">
                                        <label>Email Address</label>
                                        <div className="set-input-icon">
                                            <Mail size={15} />
                                            <input value={pEmail} onChange={e => setPEmail(e.target.value)} placeholder="Email" />
                                        </div>
                                    </div>
                                    <div className="set-field">
                                        <label>Phone Number</label>
                                        <div className="set-input-icon">
                                            <Phone size={15} />
                                            <input value={pPhone} onChange={e => setPPhone(e.target.value)} placeholder="Phone" />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 10, marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                                    <button className="btn btn-primary" onClick={saveProfile}>
                                        {saved ? <><CheckCircle2 size={14} /> Saved!</> : 'Save Changes'}
                                    </button>
                                    <button className="btn btn-secondary">Discard</button>
                                </div>
                            </SCard>
                        </div>
                    )}

                    {/* ══════════ SECURITY ══════════ */}
                    {tab === 'security' && (
                        <div className="set-pane">

                            {/* ── Reset Password via Email ── */}
                            <SCard accent="#dc2626">
                                <SHead icon={Key} title="Reset Password via Email Verification" subtitle="A one-time OTP will be sent to your registered email" color="#dc2626" />
                                <div className="set-divider" />

                                {/* Step 0 — Enter email */}
                                {pwStep === 0 && (
                                    <div className="set-pw-flow">
                                        <div className="set-pw-step-indicator">
                                            {['Send OTP', 'Verify OTP', 'New Password', 'Done'].map((s, i) => (
                                                <div key={s} className="set-pw-step">
                                                    <div className={`set-pw-dot${i < 1 ? ' set-pw-dot--active' : ''}`}>{i + 1}</div>
                                                    <span>{s}</span>
                                                    {i < 3 && <div className="set-pw-line" />}
                                                </div>
                                            ))}
                                        </div>

                                        <p className="set-pw-desc">Enter your registered email address. We'll send a 6-digit OTP to verify your identity before allowing a password change.</p>

                                        <div className="set-field" style={{ maxWidth: 400 }}>
                                            <label>Registered Email Address</label>
                                            <div className="set-input-icon">
                                                <Mail size={15} />
                                                <input
                                                    type="email"
                                                    value={pwEmail}
                                                    onChange={e => { setPwEmail(e.target.value); setPwError(''); }}
                                                    placeholder="admin@school.edu"
                                                />
                                            </div>
                                        </div>
                                        {pwError && <p className="set-error"><AlertCircle size={13} /> {pwError}</p>}
                                        <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={sendOtp}>
                                            <Send size={14} /> Send OTP to Email
                                        </button>
                                    </div>
                                )}

                                {/* Step 1 — OTP sent, waiting */}
                                {pwStep === 1 && (
                                    <div className="set-pw-flow">
                                        <div className="set-pw-step-indicator">
                                            {['Send OTP', 'Verify OTP', 'New Password', 'Done'].map((s, i) => (
                                                <div key={s} className="set-pw-step">
                                                    <div className={`set-pw-dot${i <= 1 ? ' set-pw-dot--active' : ''}${i < 1 ? ' set-pw-dot--done' : ''}`}>
                                                        {i < 1 ? <Check size={12} /> : i + 1}
                                                    </div>
                                                    <span>{s}</span>
                                                    {i < 3 && <div className={`set-pw-line${i < 1 ? ' set-pw-line--done' : ''}`} />}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="set-otp-sent-box">
                                            <div className="set-otp-icon"><Mail size={26} /></div>
                                            <div>
                                                <p className="set-otp-title">OTP Sent Successfully!</p>
                                                <p className="set-otp-sub">A 6-digit code has been sent to <strong>{pwEmail}</strong>. Check your inbox (and spam folder).</p>
                                            </div>
                                        </div>

                                        <div className="set-field" style={{ maxWidth: 300 }}>
                                            <label>Enter 6-digit OTP</label>
                                            <input
                                                className="set-otp-input"
                                                type="text"
                                                maxLength={6}
                                                value={otp}
                                                onChange={e => { setOtp(e.target.value.replace(/\D/, '')); setPwError(''); }}
                                                placeholder="● ● ● ● ● ●"
                                            />
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 8 }}>
                                            <div className="set-timer">
                                                <Clock size={13} />
                                                {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'OTP expired'}
                                            </div>
                                            {otpTimer === 0 && (
                                                <button className="btn btn-secondary btn-sm" onClick={() => { setPwStep(1); startOtpTimer(); }}>
                                                    <RefreshCw size={13} /> Resend OTP
                                                </button>
                                            )}
                                        </div>

                                        {pwError && <p className="set-error"><AlertCircle size={13} /> {pwError}</p>}

                                        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                                            <button className="btn btn-primary" onClick={verifyOtp}>
                                                <Check size={14} /> Verify OTP
                                            </button>
                                            <button className="btn btn-secondary" onClick={resetPwFlow}>Cancel</button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 3 — New password */}
                                {pwStep === 3 && (
                                    <div className="set-pw-flow">
                                        <div className="set-pw-step-indicator">
                                            {['Send OTP', 'Verify OTP', 'New Password', 'Done'].map((s, i) => (
                                                <div key={s} className="set-pw-step">
                                                    <div className={`set-pw-dot${i <= 2 ? ' set-pw-dot--active' : ''}${i < 2 ? ' set-pw-dot--done' : ''}`}>
                                                        {i < 2 ? <Check size={12} /> : i + 1}
                                                    </div>
                                                    <span>{s}</span>
                                                    {i < 3 && <div className={`set-pw-line${i < 2 ? ' set-pw-line--done' : ''}`} />}
                                                </div>
                                            ))}
                                        </div>

                                        <p className="set-pw-desc">OTP verified ✓ — Create a strong new password.</p>

                                        <div className="set-form-grid" style={{ maxWidth: 480 }}>
                                            <div className="set-field">
                                                <label>New Password</label>
                                                <div className="set-input-icon">
                                                    <Lock size={15} />
                                                    <input
                                                        type={showPw ? 'text' : 'password'}
                                                        value={newPw}
                                                        onChange={e => { setNewPw(e.target.value); setPwError(''); }}
                                                        placeholder="Min 8 chars, 1 uppercase, 1 number"
                                                    />
                                                    <button className="set-eye" onClick={() => setShowPw(s => !s)}>
                                                        {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>
                                                {newPw && (
                                                    <div className="set-pw-strength">
                                                        {[1,2,3,4].map(i => (
                                                            <div key={i} className="set-pw-bar" style={{ background: i <= pwS ? pwSColors[pwS] : '#e2e8f0' }} />
                                                        ))}
                                                        <span style={{ color: pwSColors[pwS], fontSize: '0.72rem', fontWeight: 700 }}>{pwSLabels[pwS]}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="set-field">
                                                <label>Confirm New Password</label>
                                                <div className="set-input-icon">
                                                    <Lock size={15} />
                                                    <input
                                                        type={showCPw ? 'text' : 'password'}
                                                        value={confirmPw}
                                                        onChange={e => { setConfirmPw(e.target.value); setPwError(''); }}
                                                        placeholder="Re-enter new password"
                                                    />
                                                    <button className="set-eye" onClick={() => setShowCPw(s => !s)}>
                                                        {showCPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                                    </button>
                                                </div>
                                                {confirmPw && (
                                                    <p style={{ fontSize: '0.72rem', marginTop: 4, color: newPw === confirmPw ? '#059669' : '#dc2626' }}>
                                                        {newPw === confirmPw ? '✓ Passwords match' : '✗ Passwords do not match'}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="set-pw-rules">
                                            {[
                                                { ok: newPw.length >= 8,           txt: 'At least 8 characters' },
                                                { ok: /[A-Z]/.test(newPw),         txt: 'One uppercase letter (A-Z)' },
                                                { ok: /[0-9]/.test(newPw),         txt: 'One number (0-9)' },
                                                { ok: /[^A-Za-z0-9]/.test(newPw),  txt: 'One special character (!@#$…)' },
                                            ].map(({ ok, txt }) => (
                                                <div key={txt} className="set-pw-rule">
                                                    <div style={{ color: ok ? '#059669' : '#cbd5e1' }}>
                                                        {ok ? <CheckCircle2 size={14} /> : <div style={{ width:14,height:14,borderRadius:'50%',border:'2px solid #cbd5e1' }}/>}
                                                    </div>
                                                    <span style={{ color: ok ? '#059669' : 'var(--text-muted)' }}>{txt}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {pwError && <p className="set-error"><AlertCircle size={13} /> {pwError}</p>}

                                        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                                            <button className="btn btn-primary" onClick={changePassword}>
                                                <Lock size={14} /> Update Password
                                            </button>
                                            <button className="btn btn-secondary" onClick={resetPwFlow}>Cancel</button>
                                        </div>
                                    </div>
                                )}

                                {/* Step 4 — Done */}
                                {pwStep === 4 && (
                                    <div className="set-pw-success">
                                        <div className="set-success-icon"><CheckCircle2 size={40} /></div>
                                        <h3>Password Changed Successfully!</h3>
                                        <p>Your password has been updated. You'll be asked to log in again on your next session.</p>
                                        <button className="btn btn-primary" onClick={resetPwFlow} style={{ marginTop: 16 }}>
                                            Done
                                        </button>
                                    </div>
                                )}
                            </SCard>

                            {/* ── Two-Factor Auth ── */}
                            <SCard accent="#7c3aed">
                                <SHead icon={Smartphone} title="Two-Factor Authentication (2FA)" subtitle="Add an extra layer of security to your account" color="#7c3aed" />
                                <div className="set-divider" />
                                <Row
                                    label="Enable 2FA via Authenticator App"
                                    sub="Scan QR code with Google Authenticator or Authy"
                                >
                                    <Toggle checked={twoFA} onChange={setTwoFA} />
                                </Row>
                                {twoFA && (
                                    <div className="set-2fa-box">
                                        <div className="set-qr-placeholder">
                                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                                <Shield size={32} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                                                QR Code would appear here
                                            </div>
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, fontSize: '0.88rem', marginBottom: 6 }}>Setup Instructions:</p>
                                            <ol className="set-2fa-steps">
                                                <li>Install Google Authenticator or Authy on your phone.</li>
                                                <li>Tap <strong>Add Account</strong> → <strong>Scan QR Code</strong>.</li>
                                                <li>Scan the QR code on the left.</li>
                                                <li>Enter the 6-digit code from the app to confirm.</li>
                                            </ol>
                                            <div className="set-field" style={{ maxWidth: 220, marginTop: 14 }}>
                                                <label>Enter Verification Code</label>
                                                <input placeholder="6-digit code" maxLength={6} />
                                            </div>
                                            <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>
                                                <Check size={13} /> Confirm &amp; Enable 2FA
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </SCard>

                            {/* ── Active sessions ── */}
                            <SCard accent="#0891b2">
                                <SHead icon={Globe} title="Active Sessions" subtitle="Devices currently logged into your account" color="#0891b2" />
                                <div className="set-divider" />
                                {[
                                    { device: 'Windows PC — Chrome 124', location: 'Mumbai, Maharashtra', time: 'Active now',   current: true  },
                                    { device: 'Android — Chrome Mobile', location: 'Pune, Maharashtra',   time: '2 hours ago',  current: false },
                                    { device: 'MacBook — Safari 17',     location: 'Delhi, India',        time: '3 days ago',   current: false },
                                ].map(s => (
                                    <div key={s.device} className="set-session-row">
                                        <div className="set-session-dot" style={{ background: s.current ? '#059669' : '#cbd5e1' }} />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                                                {s.device} {s.current && <span className="badge badge-success" style={{ fontSize: '0.65rem', marginLeft: 6 }}>Current</span>}
                                            </p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.location} · {s.time}</p>
                                        </div>
                                        {!s.current && (
                                            <button className="btn btn-danger btn-sm"><LogOut size={12} /> Revoke</button>
                                        )}
                                    </div>
                                ))}
                                <button className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>
                                    <LogOut size={13} /> Sign Out All Other Devices
                                </button>
                            </SCard>
                        </div>
                    )}

                    {/* ══════════ NOTIFICATIONS ══════════ */}
                    {tab === 'notify' && (
                        <div className="set-pane">
                            <SCard accent="#059669">
                                <SHead icon={Bell} title="Alert Preferences" subtitle="Choose what you want to be notified about" color="#059669" />
                                <div className="set-divider" />
                                {[
                                    { k: 'attendance',    l: 'Attendance Alerts',       s: 'Get notified when attendance is marked or updated' },
                                    { k: 'fees',          l: 'Fee Reminders',           s: 'Due dates, payment confirmations and overdue alerts' },
                                    { k: 'results',       l: 'Result Announcements',    s: 'Notifications when new results are published' },
                                    { k: 'announcements', l: 'School Announcements',    s: 'Important circulars, holidays and events' },
                                    { k: 'weekly',        l: 'Weekly Summary Report',   s: 'A digest of the week\'s activity every Monday' },
                                    { k: 'marketing',     l: 'Product Updates & News',  s: 'Tips, new features and EduManage news' },
                                ].map(({ k, l, s }) => (
                                    <Row key={k} label={l} sub={s}><Toggle checked={notif[k]} onChange={() => togNotif(k)} /></Row>
                                ))}
                            </SCard>

                            <SCard accent="#1e40af">
                                <SHead icon={Send} title="Delivery Channels" subtitle="How you want to receive notifications" color="#1e40af" />
                                <div className="set-divider" />
                                {[
                                    { k: 'email', l: 'Email Notifications',          s: 'Sent to ' + pEmail },
                                    { k: 'sms',   l: 'SMS Notifications',            s: 'Sent to ' + pPhone },
                                    { k: 'push',  l: 'Browser Push Notifications',   s: 'In-browser alerts when you\'re online' },
                                ].map(({ k, l, s }) => (
                                    <Row key={k} label={l} sub={s}><Toggle checked={notif[k]} onChange={() => togNotif(k)} /></Row>
                                ))}
                            </SCard>
                        </div>
                    )}

                    {/* ══════════ APPEARANCE ══════════ */}
                    {tab === 'appearance' && (
                        <div className="set-pane">
                            <SCard accent="#7c3aed">
                                <SHead icon={Palette} title="Theme" subtitle="Choose the colour mode for the interface" color="#7c3aed" />
                                <div className="set-divider" />
                                <div className="set-theme-grid">
                                    {[
                                        { key: 'light',  label: 'Light',  icon: Sun,     bg: '#f1f5f9', fg: '#0f172a' },
                                        { key: 'dark',   label: 'Dark',   icon: Moon,    bg: '#0f172a', fg: '#f1f5f9' },
                                        { key: 'system', label: 'System', icon: Monitor, bg: 'linear-gradient(135deg,#f1f5f9 50%,#0f172a 50%)', fg: '#475569' },
                                    ].map(({ key, label, icon: Icon, bg, fg }) => (
                                        <button
                                            key={key}
                                            className={`set-theme-btn${theme === key ? ' set-theme-btn--active' : ''}`}
                                            onClick={() => setTheme(key)}
                                        >
                                            <div className="set-theme-preview" style={{ background: bg }}>
                                                <Icon size={22} color={fg} />
                                            </div>
                                            <span>{label}</span>
                                            {theme === key && <Check size={13} className="set-theme-check" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="set-divider" style={{ margin: '20px 0' }} />

                                <Row label="Font Size" sub="Adjust the text size across the app">
                                    <select className="filter-select" value={fontSize} onChange={e => setFontSize(e.target.value)}>
                                        <option value="small">Small</option>
                                        <option value="medium">Medium (Default)</option>
                                        <option value="large">Large</option>
                                    </select>
                                </Row>
                                <Row label="Compact Mode" sub="Reduce spacing for a denser layout">
                                    <Toggle checked={compact} onChange={setCompact} />
                                </Row>
                                <Row label="Show Sidebar Labels" sub="Display text labels next to sidebar icons">
                                    <Toggle checked={sidebar} onChange={setSidebar} />
                                </Row>
                            </SCard>
                        </div>
                    )}

                    {/* ══════════ SYSTEM ══════════ */}
                    {tab === 'system' && (
                        <div className="set-pane">
                            <SCard accent="#d97706">
                                <SHead icon={Building} title="Academic Settings" subtitle="Configure the current academic year and related options" color="#d97706" />
                                <div className="set-divider" />
                                <Row label="Academic Year" sub="The active year used across all modules">
                                    <select className="filter-select" value={acYear} onChange={e => setAcYear(e.target.value)}>
                                        {['2024-25','2025-26','2026-27','2027-28'].map(y => <option key={y}>{y}</option>)}
                                    </select>
                                </Row>
                                <Row label="Institution Name" sub="Displayed on reports and certificates">
                                    <input className="set-inline-input" defaultValue="EduManage Academy" />
                                </Row>
                                <Row label="Address" sub="Institution address for official documents">
                                    <input className="set-inline-input" defaultValue="123 Education Lane, Mumbai 400001" />
                                </Row>
                            </SCard>

                            <SCard accent="#0891b2">
                                <SHead icon={Globe} title="Localisation" subtitle="Language, timezone and date format" color="#0891b2" />
                                <div className="set-divider" />
                                <Row label="Language" sub="Application display language">
                                    <select className="filter-select" value={lang} onChange={e => setLang(e.target.value)}>
                                        <option value="en">English</option>
                                        <option value="hi">हिन्दी (Hindi)</option>
                                        <option value="mr">मराठी (Marathi)</option>
                                        <option value="ta">தமிழ் (Tamil)</option>
                                        <option value="te">తెలుగు (Telugu)</option>
                                    </select>
                                </Row>
                                <Row label="Timezone" sub="Used for scheduling and timestamps">
                                    <select className="filter-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                                        <option value="Asia/Kolkata">IST — Asia/Kolkata (UTC +5:30)</option>
                                        <option value="Asia/Dubai">GST — Asia/Dubai (UTC +4)</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </Row>
                                <Row label="Date Format">
                                    <select className="filter-select" value={dateFormat} onChange={e => setDateFmt(e.target.value)}>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </Row>
                            </SCard>

                            <SCard accent="#dc2626">
                                <SHead icon={Download} title="Data Management" subtitle="Export or reset your data" color="#dc2626" />
                                <div className="set-divider" />
                                <Row label="Export All Data" sub="Download a full backup of your data as JSON">
                                    <button className="btn btn-secondary btn-sm"><Download size={13} /> Export</button>
                                </Row>
                                <Row label="Clear Cache" sub="Free up local storage used by the application">
                                    <button className="btn btn-secondary btn-sm"><RefreshCw size={13} /> Clear</button>
                                </Row>
                                <Row label="Delete Account" sub="Permanently remove all data — this cannot be undone">
                                    <button className="btn btn-danger btn-sm"><Trash2 size={13} /> Delete</button>
                                </Row>
                            </SCard>
                        </div>
                    )}

                    {/* ══════════ PRIVACY ══════════ */}
                    {tab === 'privacy' && (
                        <div className="set-pane">
                            <SCard accent="#7c3aed">
                                <SHead icon={Shield} title="Privacy Controls" subtitle="Control how your data is used" color="#7c3aed" />
                                <div className="set-divider" />
                                <Row label="Share Anonymised Usage Data" sub="Help us improve EduManage by sharing anonymised data">
                                    <Toggle checked={dataShare} onChange={setDataShare} />
                                </Row>
                                <Row label="Analytics Tracking" sub="Allow analytics to understand how features are used">
                                    <Toggle checked={analytics} onChange={setAnalytics} />
                                </Row>
                                <Row label="Crash & Error Reporting" sub="Automatically send crash reports to help fix bugs">
                                    <Toggle checked={crashLog} onChange={setCrashLog} />
                                </Row>
                                <Row label="Activity Log" sub="Record login history and actions for security review">
                                    <Toggle checked={activityLog} onChange={setActLog} />
                                </Row>
                            </SCard>

                            <SCard accent="#0891b2">
                                <SHead icon={Clock} title="Recent Activity Log" subtitle="Last 5 account actions" color="#0891b2" />
                                <div className="set-divider" />
                                {[
                                    { action: 'Logged in',            time: 'Today, 9:32 AM',       ip: '103.21.58.12' },
                                    { action: 'Updated student data', time: 'Today, 9:28 AM',       ip: '103.21.58.12' },
                                    { action: 'Exported fee report',  time: 'Yesterday, 4:15 PM',   ip: '103.21.58.12' },
                                    { action: 'Password changed',     time: '3 days ago, 11:02 AM', ip: '103.21.58.01' },
                                    { action: 'Logged in',            time: '3 days ago, 10:55 AM', ip: '103.21.58.01' },
                                ].map((a, i) => (
                                    <div key={i} className="set-activity-row">
                                        <div className="set-activity-dot" />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{a.action}</p>
                                            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{a.time} · IP: {a.ip}</p>
                                        </div>
                                    </div>
                                ))}
                            </SCard>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Styles ── */}
            <style>{`
                /* Layout */
                .set-layout { display: grid; grid-template-columns: 228px 1fr; gap: 22px; align-items: start; }

                /* ── Sidebar Nav ── */
                .set-nav {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 12px 10px 10px;
                    display: flex; flex-direction: column; gap: 0;
                    box-shadow: var(--shadow-sm);
                    position: sticky; top: 80px;
                    overflow: hidden;
                }
                .set-nav-group { margin-bottom: 6px; }
                .set-nav-group:last-of-type { margin-bottom: 0; }
                .set-nav-group-label {
                    font-size: 0.63rem; font-weight: 800; letter-spacing: 0.1em;
                    text-transform: uppercase; color: var(--text-muted);
                    padding: 4px 10px 6px; margin-top: 4px;
                }
                .set-nav-btn {
                    display: flex; align-items: center; gap: 10px;
                    padding: 9px 10px; border: none; background: transparent;
                    border-radius: 10px; cursor: pointer; font-size: 0.84rem;
                    font-weight: 500; color: var(--text-secondary);
                    font-family: var(--font-body); transition: all 0.16s ease;
                    text-align: left; width: 100%; position: relative;
                }
                .set-nav-btn:hover { background: var(--bg-hover); color: var(--text-primary); }
                .set-nav-btn--active {
                    background: var(--bg);
                    color: var(--nav-accent, var(--primary));
                    font-weight: 700;
                    box-shadow: inset 3px 0 0 var(--nav-accent, var(--primary));
                }
                .set-nav-icon {
                    width: 28px; height: 28px; border-radius: 8px;
                    display: grid; place-items: center; flex-shrink: 0;
                    transition: all 0.16s ease;
                }
                .set-nav-arrow { margin-left: auto; color: var(--nav-accent, var(--primary)); opacity: 0.5; }
                .set-nav-footer {
                    border-top: 1px solid var(--border);
                    margin-top: 8px;
                    padding-top: 8px;
                }
                .set-nav-logout {
                    display: flex; align-items: center; gap: 8px;
                    width: 100%; padding: 9px 10px; border: none; border-radius: 10px;
                    background: transparent; cursor: pointer; font-size: 0.83rem;
                    font-weight: 500; color: #dc2626; font-family: var(--font-body);
                    transition: background 0.16s ease;
                }
                .set-nav-logout:hover { background: #fef2f2; }

                /* ── Content ── */
                .set-content { min-width: 0; }
                .set-pane { display: flex; flex-direction: column; gap: 18px; animation: setIn 0.2s ease; }
                @keyframes setIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }

                /* ── Card ── */
                .set-card {
                    background: white;
                    border: 1px solid var(--border);
                    border-radius: 16px;
                    padding: 24px 28px;
                    box-shadow: var(--shadow-sm);
                    overflow: hidden;
                }

                /* ── Section head (full-bleed using negative margins) ── */
                .set-sec-head {
                    display: flex; align-items: center; gap: 14px;
                    margin: -24px -28px 20px;
                    padding: 18px 28px;
                    background: var(--bg-hover);
                    border-bottom: 1px solid var(--border);
                }
                .set-sec-icon {
                    width: 40px; height: 40px; border-radius: 12px;
                    display: grid; place-items: center; flex-shrink: 0;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.06);
                }
                .set-sec-title { font-family: var(--font-display); font-size: 0.98rem; font-weight: 700; color: var(--text-primary); }
                .set-sec-sub   { font-size: 0.76rem; color: var(--text-muted); margin-top: 2px; }
                .set-divider   { height: 1px; background: var(--border); margin: 16px -28px; width: calc(100% + 56px); border: none; }
                /* Hide the divider that immediately follows set-sec-head (redundant with SHead's own bottom border) */
                .set-sec-head + .set-divider { display: none; }

                /* Avatar row */
                .set-avatar-row {
                    display: flex; align-items: center; gap: 16px;
                    padding: 16px 20px; margin: 4px 0 20px;
                    background: var(--bg);
                    border-radius: 12px; border: 1px solid var(--border);
                }
                .set-avatar {
                    width: 52px; height: 52px; border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary), #3b60d4);
                    color: white; display: grid; place-items: center;
                    font-family: var(--font-display); font-size: 1rem; font-weight: 800;
                    flex-shrink: 0; box-shadow: 0 2px 8px rgba(30,64,175,0.3);
                }
                .set-avatar-name { font-weight: 700; font-size: 0.95rem; color: var(--text-primary); }
                .set-avatar-role {
                    display: inline-block; margin-top: 4px;
                    font-size: 0.72rem; font-weight: 600;
                    background: rgba(30,64,175,0.1); color: var(--primary);
                    padding: 2px 9px; border-radius: 20px; border: 1px solid rgba(30,64,175,0.2);
                }

                /* Form grid */
                .set-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px 20px; margin-top: 4px; }
                .set-field { display: flex; flex-direction: column; gap: 6px; }
                .set-field label { font-size: 0.72rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
                .set-field input, .set-inline-input {
                    width: 100%; padding: 9px 13px;
                    border: 1.5px solid var(--border); border-radius: 9px;
                    font-size: 0.875rem; font-family: var(--font-body);
                    color: var(--text-primary); background: white; outline: none;
                    transition: var(--transition);
                }
                .set-field input:focus, .set-inline-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30,64,175,0.08); }
                .set-input-icon { position: relative; display: flex; align-items: center; }
                .set-input-icon > svg:first-child { position: absolute; left: 11px; color: var(--text-muted); pointer-events: none; }
                .set-input-icon input { padding-left: 34px; padding-right: 36px; }
                .set-eye { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: var(--text-muted); display: flex; padding: 2px; }

                /* Inline input */
                .set-inline-input { max-width: 240px; }

                /* ── Row (full-bleed using negative margins) ── */
                .set-row {
                    display: flex; align-items: center;
                    gap: 16px; margin: 0 -28px; padding: 14px 28px;
                    border-bottom: 1px solid var(--border);
                    transition: background 0.14s ease;
                }
                .set-row:hover { background: var(--bg-hover); }
                .set-row:last-child { border-bottom: none; }
                .set-row-label { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }
                .set-row-sub   { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }
                .set-row-ctrl  { flex-shrink: 0; display: flex; align-items: center; gap: 8px; margin-left: auto; }

                /* ── Password flow ── */
                .set-pw-flow { display: flex; flex-direction: column; gap: 14px; }
                .set-pw-step-indicator { display: flex; align-items: center; margin-bottom: 8px; flex-wrap: nowrap; }
                .set-pw-step { display: flex; align-items: center; gap: 6px; }
                .set-pw-step span { font-size: 0.72rem; font-weight: 600; color: var(--text-muted); white-space: nowrap; }
                .set-pw-dot {
                    width: 28px; height: 28px; border-radius: 50%;
                    border: 2px solid var(--border); display: grid; place-items: center;
                    font-size: 0.72rem; font-weight: 700; color: var(--text-muted);
                    flex-shrink: 0; transition: all 0.2s; background: white;
                }
                .set-pw-dot--active { border-color: var(--primary); color: var(--primary); background: #eff6ff; }
                .set-pw-dot--done   { background: var(--primary); border-color: var(--primary); color: white; }
                .set-pw-line { flex: 1; min-width: 20px; max-width: 40px; height: 2px; background: var(--border); margin: 0 4px; }
                .set-pw-line--done { background: var(--primary); }
                .set-pw-desc { font-size: 0.84rem; color: var(--text-muted); background: var(--bg); padding: 10px 14px; border-radius: 8px; border-left: 3px solid var(--primary); }

                .set-otp-sent-box {
                    display: flex; align-items: center; gap: 16px;
                    padding: 16px 20px; background: #f0fdf4;
                    border: 1px solid #bbf7d0; border-radius: 12px;
                }
                .set-otp-icon { width: 50px; height: 50px; border-radius: 12px; background: #dcfce7; color: #059669; display: grid; place-items: center; flex-shrink: 0; }
                .set-otp-title { font-weight: 700; font-size: 0.9rem; color: #065f46; margin-bottom: 4px; }
                .set-otp-sub { font-size: 0.78rem; color: #047857; line-height: 1.5; }

                .set-otp-input {
                    font-size: 1.6rem; letter-spacing: 0.5em;
                    font-family: monospace; font-weight: 700;
                    text-align: center; width: 100%;
                    padding: 12px; border: 2px solid var(--border);
                    border-radius: 10px; color: var(--primary); background: #f8faff;
                    outline: none; transition: var(--transition);
                }
                .set-otp-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30,64,175,0.1); }

                .set-timer { display: flex; align-items: center; gap: 5px; font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }
                .set-error { display: flex; align-items: center; gap: 6px; color: #dc2626; font-size: 0.8rem; font-weight: 500; background: #fef2f2; padding: 8px 12px; border-radius: 8px; border: 1px solid #fecaca; }

                /* Password strength */
                .set-pw-strength { display: flex; align-items: center; gap: 5px; margin-top: 8px; }
                .set-pw-bar { height: 4px; flex: 1; border-radius: 99px; transition: background 0.25s; }
                .set-pw-rules { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 4px 0; background: var(--bg); padding: 12px 14px; border-radius: 10px; }
                .set-pw-rule { display: flex; align-items: center; gap: 8px; font-size: 0.78rem; }

                /* Success */
                .set-pw-success { text-align: center; padding: 32px 0; }
                .set-success-icon { width: 80px; height: 80px; border-radius: 50%; background: #d1fae5; color: #059669; display: grid; place-items: center; margin: 0 auto 16px; }
                .set-pw-success h3 { font-size: 1.2rem; font-weight: 800; margin-bottom: 8px; color: var(--text-primary); }
                .set-pw-success p  { color: var(--text-muted); font-size: 0.88rem; max-width: 340px; margin: 0 auto; line-height: 1.6; }

                /* 2FA */
                .set-2fa-box { display: flex; gap: 24px; margin: 14px -28px -24px; padding: 20px 28px 24px; background: var(--bg); align-items: flex-start; flex-wrap: wrap; }
                .set-qr-placeholder { width: 130px; height: 130px; border: 2px dashed var(--border-dark); border-radius: 12px; display: grid; place-items: center; flex-shrink: 0; background: white; }
                .set-2fa-steps { padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: var(--text-secondary); }
                .set-2fa-steps li { line-height: 1.6; }

                /* Sessions */
                .set-session-row { display: flex; align-items: center; gap: 14px; margin: 0 -28px; padding: 13px 28px; border-bottom: 1px solid var(--border); transition: background 0.14s; }
                .set-session-row:hover { background: var(--bg-hover); }
                .set-session-row:last-of-type { border-bottom: none; }
                .set-session-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }

                /* Theme grid */
                .set-theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 8px; }
                .set-theme-btn {
                    display: flex; flex-direction: column; align-items: center; gap: 10px;
                    padding: 18px 12px; border: 2px solid var(--border); border-radius: 14px;
                    background: var(--bg-hover); cursor: pointer; transition: all 0.18s ease;
                    font-size: 0.83rem; font-weight: 600; color: var(--text-secondary); position: relative;
                    font-family: var(--font-body);
                }
                .set-theme-btn:hover { border-color: var(--primary); background: white; transform: translateY(-2px); box-shadow: var(--shadow-sm); }
                .set-theme-btn--active { border-color: var(--primary); color: var(--primary); background: white; box-shadow: 0 0 0 3px rgba(30,64,175,0.1), var(--shadow-sm); }
                .set-theme-preview { width: 56px; height: 44px; border-radius: 10px; display: grid; place-items: center; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.08); }
                .set-theme-check { position: absolute; top: 8px; right: 9px; color: var(--primary); background: #eff6ff; border-radius: 50%; padding: 2px; }

                /* Activity */
                .set-activity-row { display: flex; align-items: flex-start; gap: 12px; margin: 0 -28px; padding: 11px 28px; border-bottom: 1px solid var(--border); }
                .set-activity-row:last-child { border-bottom: none; }
                .set-activity-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--primary); margin-top: 6px; flex-shrink: 0; box-shadow: 0 0 0 3px rgba(30,64,175,0.15); }

                /* filter-select */
                .filter-select {
                    padding: 8px 12px; border: 1.5px solid var(--border); border-radius: 8px;
                    font-size: 0.83rem; background: white; cursor: pointer;
                    color: var(--text-primary); outline: none; transition: var(--transition);
                    font-family: var(--font-body);
                }
                .filter-select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(30,64,175,0.08); }

                /* Dark mode overrides */
                [data-theme="dark"] .set-sec-head { background: #1a2030 !important; border-bottom-color: var(--border) !important; }
                [data-theme="dark"] .set-session-row:hover { background: #1c2128 !important; }
                [data-theme="dark"] .set-activity-row { border-bottom-color: var(--border) !important; }
                [data-theme="dark"] .set-2fa-box { background: #161b22 !important; }
                [data-theme="dark"] .set-theme-btn { background: #1c2128 !important; }
                [data-theme="dark"] .set-theme-btn:hover,
                [data-theme="dark"] .set-theme-btn--active { background: #262c36 !important; }
                [data-theme="dark"] .set-pw-rules { background: #1c2128 !important; }
                [data-theme="dark"] .set-pw-desc { background: #1c2128 !important; }
                [data-theme="dark"] .set-nav-logout:hover { background: rgba(220,38,38,0.12) !important; }
                [data-theme="dark"] .set-nav-group-label { color: #4b5563 !important; }
                [data-theme="dark"] .set-nav-btn--active { background: rgba(30,64,175,0.12) !important; }
                [data-theme="dark"] .set-nav-icon { background: rgba(255,255,255,0.05) !important; }
                [data-theme="dark"] .set-nav-footer { border-top-color: var(--border) !important; }
                [data-theme="dark"] .set-avatar-row { background: #1c2128 !important; border-color: var(--border) !important; }

                /* Responsive */
                @media (max-width: 900px) {
                    .set-layout { grid-template-columns: 1fr; }
                    .set-nav { flex-direction: row; flex-wrap: wrap; position: static; padding: 8px; }
                    .set-nav-group { display: contents; }
                    .set-nav-group-label { display: none; }
                    .set-nav-footer { width: 100%; border-top: 1px solid var(--border); padding-top: 6px; }
                    .set-nav-arrow { display: none; }
                    .set-form-grid { grid-template-columns: 1fr; }
                    .set-pw-rules { grid-template-columns: 1fr; }
                    .set-theme-grid { grid-template-columns: repeat(3, 1fr); }
                    .set-row, .set-session-row, .set-activity-row { margin: 0 -20px; padding-left: 20px; padding-right: 20px; }
                    .set-sec-head { margin: -20px -20px 16px; padding: 16px 20px; }
                    .set-divider { margin: 12px -20px; width: calc(100% + 40px); }
                    .set-2fa-box { margin: 14px -20px -20px; padding: 16px 20px 20px; }
                    .set-card { padding: 20px; }
                }
                @media (max-width: 600px) {
                    .set-theme-grid { grid-template-columns: 1fr; }
                    .set-pw-step-indicator { flex-wrap: wrap; gap: 8px; }
                }
            `}</style>
        </div>
    );
}
