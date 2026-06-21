import { useContext, useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { openRazorpay } from '../../utils/razorpay.js';
import {
    BookOpen, CheckCircle2, Wallet, User, BarChart2,
    LogOut, Bell, Download, Calendar, Clock, Award,
    TrendingUp, CreditCard, FileText, ChevronRight,
    MapPin, Phone, Mail, Shield, ArrowUpRight, Star,
    BookMarked, Activity, AlertCircle, CheckCircle, X,
    Search,
} from 'lucide-react';

/* ── Mock data ── */
const SUBJECTS = [
    { name: 'Data Structures',      marks: 84, max: 100, grade: 'A',  attendance: 94, color: '#2563eb' },
    { name: 'Mathematics III',      marks: 76, max: 100, grade: 'B+', attendance: 88, color: '#7c3aed' },
    { name: 'Computer Networks',    marks: 91, max: 100, grade: 'O',  attendance: 97, color: '#059669' },
    { name: 'Operating Systems',    marks: 68, max: 100, grade: 'B',  attendance: 82, color: '#d97706' },
    { name: 'Software Engineering', marks: 79, max: 100, grade: 'B+', attendance: 91, color: '#0284c7' },
    { name: 'Database Management',  marks: 88, max: 100, grade: 'A',  attendance: 95, color: '#dc2626' },
];

const TIMETABLE = [
    { time: '09:00', subject: 'Data Structures',   room: 'A-201', type: 'Lecture', color: '#2563eb' },
    { time: '10:30', subject: 'Mathematics III',   room: 'B-105', type: 'Lecture', color: '#7c3aed' },
    { time: '12:00', subject: 'Lunch Break',        room: '',      type: 'Break',   color: '#94a3b8' },
    { time: '13:30', subject: 'Computer Networks', room: 'Lab-3',  type: 'Lab',     color: '#059669' },
    { time: '15:30', subject: 'OS Tutorial',        room: 'A-105', type: 'Tutorial',color: '#d97706' },
];

const EXAMS = [
    { subject: 'Data Structures',   date: 'Jun 10', type: 'Mid-Sem',  color: '#dc2626' },
    { subject: 'Mathematics III',   date: 'Jun 12', type: 'Mid-Sem',  color: '#d97706' },
    { subject: 'Computer Networks', date: 'Jun 14', type: 'Practical',color: '#059669' },
    { subject: 'OS',                date: 'Jun 17', type: 'Mid-Sem',  color: '#7c3aed' },
];

const FEE_SCHEDULE = [
    { label: 'Tuition Fee',   amount: 45000, paid: true,  date: 'Jan 15, 2026' },
    { label: 'Lab Fee',       amount: 8000,  paid: true,  date: 'Jan 15, 2026' },
    { label: 'Library Fee',   amount: 2000,  paid: true,  date: 'Feb 02, 2026' },
    { label: 'Sports Fee',    amount: 3000,  paid: false,  date: 'Due Jun 30' },
    { label: 'Exam Fee',      amount: 2500,  paid: false, date: 'Due Jul 10' },
];

const NOTIFICATIONS = [
    { text: 'Mid-semester exam schedule released', time: '2h ago', icon: Bell,         color: '#2563eb', bg: 'rgba(37,99,235,0.09)',  unread: true  },
    { text: 'Sports Fee payment reminder',         time: '1d ago', icon: AlertCircle,  color: '#dc2626', bg: 'rgba(220,38,38,0.09)',  unread: true  },
    { text: 'Sem III results published',            time: '3d ago', icon: Award,        color: '#059669', bg: 'rgba(5,150,105,0.09)',  unread: false },
    { text: 'Attendance marked for Jun 5',          time: '3d ago', icon: CheckCircle,  color: '#7c3aed', bg: 'rgba(124,58,237,0.09)', unread: false },
];

const CGPA_TREND = [
    { sem: 'I',   cgpa: 7.2 },
    { sem: 'II',  cgpa: 7.6 },
    { sem: 'III', cgpa: 7.4 },
    { sem: 'IV',  cgpa: 7.9 },
];


const gradeColor = g => ({ O: '#059669', 'A+': '#2563eb', A: '#2563eb', 'B+': '#7c3aed', B: '#d97706', C: '#f59e0b', F: '#dc2626' }[g] || '#64748b');

export default function StudentDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('marks');
    const [showNotif, setShowNotif] = useState(false);
    const [notifPos, setNotifPos] = useState({ top: 0, right: 0 });
    const bellRef = useRef(null);
    const [modal, setModal] = useState(null); // 'timetable' | 'exams' | 'results' | 'fees'
    const [payingFee, setPayingFee] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchDropPos, setSearchDropPos] = useState({ top: 0, left: 0, width: 560 });
    const searchRef = useRef(null);

    useEffect(() => {
        const handler = e => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleBellClick = useCallback(() => {
        if (bellRef.current) {
            const r = bellRef.current.getBoundingClientRect();
            setNotifPos({ top: r.bottom + 8, right: window.innerWidth - r.right });
        }
        setShowNotif(v => !v);
    }, []);

    const name   = user?.name  || 'Student';
    const id     = user?.id    || 'STU101';
    const course = user?.course|| 'B.Sc Computer Science';
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    const totalFees = FEE_SCHEDULE.reduce((s, f) => s + f.amount, 0);
    const paidFees  = FEE_SCHEDULE.filter(f => f.paid).reduce((s, f) => s + f.amount, 0);
    const dueFees   = totalFees - paidFees;

    const downloadMarksheet = () => {
        const header = 'Subject,Marks,Max Marks,Grade,Attendance\n';
        const rows = SUBJECTS.map(s => `${s.name},${s.marks},${s.max},${s.grade},${s.attendance}%`).join('\n');
        const blob = new Blob([header + rows], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.download = `Marksheet_${name.replace(/\s+/g, '_')}_Sem4.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Marksheet downloaded!');
    };

    const handlePayFees = async () => {
        setPayingFee(true);
        try {
            const result = await openRazorpay({
                amount:      dueFees,
                studentName: name,
                email:       user?.email || '',
                phone:       user?.phone || '',
                course,
                studentId:   id,
                feeId:       `sem4_${id}`,
            });
            toast.success(`Payment successful! ID: ${result.paymentId}`);
            setModal(null);
        } catch (err) {
            if (!err.message?.includes('cancelled')) toast.error(err.message || 'Payment failed.');
        } finally {
            setPayingFee(false);
        }
    };

    const QUICK_ACTIONS = [
        { label: 'Pay Fees',           icon: CreditCard, color: '#2563eb', bg: 'rgba(37,99,235,0.10)', action: () => setModal('fees')        },
        { label: 'Download Marksheet', icon: Download,   color: '#059669', bg: 'rgba(5,150,105,0.10)', action: downloadMarksheet             },
        { label: 'View Timetable',     icon: Calendar,   color: '#7c3aed', bg: 'rgba(124,58,237,0.10)',action: () => setModal('timetable')   },
        { label: 'My Profile',         icon: User,       color: '#d97706', bg: 'rgba(217,119,6,0.10)', action: () => navigate('/student-information') },
        { label: 'Exam Schedule',      icon: BookMarked, color: '#0284c7', bg: 'rgba(2,132,199,0.10)', action: () => setModal('exams')       },
        { label: 'Result History',     icon: BarChart2,  color: '#dc2626', bg: 'rgba(220,38,38,0.10)', action: () => setModal('results')     },
    ];

    const searchResults = (() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return [];
        const hits = [];

        SUBJECTS.forEach(s => {
            if (s.name.toLowerCase().includes(q) || s.grade.toLowerCase().includes(q)) {
                hits.push({ type: 'Subject', label: s.name, sub: `${s.marks}/100 · Grade ${s.grade} · Attendance ${s.attendance}%`, color: s.color, Icon: BookOpen, action: () => { setActiveTab('marks'); setSearchQuery(''); setShowSearchResults(false); } });
            }
        });

        TIMETABLE.forEach(t => {
            if (t.subject.toLowerCase().includes(q) || t.type.toLowerCase().includes(q) || t.room.toLowerCase().includes(q)) {
                hits.push({ type: 'Schedule', label: t.subject, sub: `${t.time} · ${t.room || 'Break'} · ${t.type}`, color: t.color, Icon: Clock, action: () => { setModal('timetable'); setSearchQuery(''); setShowSearchResults(false); } });
            }
        });

        EXAMS.forEach(ex => {
            if (ex.subject.toLowerCase().includes(q) || ex.type.toLowerCase().includes(q)) {
                hits.push({ type: 'Exam', label: ex.subject, sub: `${ex.date} · ${ex.type}`, color: ex.color, Icon: FileText, action: () => { setModal('exams'); setSearchQuery(''); setShowSearchResults(false); } });
            }
        });

        FEE_SCHEDULE.forEach(f => {
            if (f.label.toLowerCase().includes(q)) {
                hits.push({ type: 'Fee', label: f.label, sub: `₹${f.amount.toLocaleString()} · ${f.paid ? 'Paid' : 'Due'} · ${f.date}`, color: f.paid ? '#059669' : '#dc2626', Icon: CreditCard, action: () => { setModal('fees'); setSearchQuery(''); setShowSearchResults(false); } });
            }
        });

        NOTIFICATIONS.forEach(n => {
            if (n.text.toLowerCase().includes(q)) {
                hits.push({ type: 'Alert', label: n.text, sub: n.time, color: n.color, Icon: Bell, action: () => { setShowNotif(true); setSearchQuery(''); setShowSearchResults(false); } });
            }
        });

        QUICK_ACTIONS.forEach(a => {
            if (a.label.toLowerCase().includes(q)) {
                hits.push({ type: 'Action', label: a.label, sub: 'Quick Action', color: a.color, Icon: a.icon, action: () => { a.action(); setSearchQuery(''); setShowSearchResults(false); } });
            }
        });

        return hits;
    })();

    return (
        <div className="erp-page" style={{ padding: 0 }}>

            {/* ── Hero Banner ── */}
            <div style={S.hero}>
                <div style={S.heroGlow} />
                <div style={S.heroContent}>
                    {/* Avatar */}
                    <div style={S.avatar}>{initials}</div>

                    {/* Identity */}
                    <div style={S.heroId}>
                        <div style={S.heroGreeting}>{greeting} 👋</div>
                        <div style={S.heroName}>{name}</div>
                        <div style={S.heroChips}>
                            <span style={S.heroChip}><BookOpen size={11} /> {course}</span>
                            <span style={S.heroChip}><Shield size={11} /> {id}</span>
                            <span style={S.heroChip}><MapPin size={11} /> Main Campus</span>
                            <span style={S.heroChip}><Calendar size={11} /> Semester IV</span>
                        </div>
                    </div>

                    {/* Hero KPIs */}
                    <div style={S.heroKpis}>
                        {[
                            { label: 'CGPA',        value: '7.9',  sub: 'Current sem',    color: '#a5f3fc' },
                            { label: 'Attendance',  value: '91%',  sub: 'This semester',  color: '#86efac' },
                            { label: 'Class Rank',  value: '#14',  sub: 'Out of 60',      color: '#c4b5fd' },
                        ].map(k => (
                            <div key={k.label} style={S.heroKpi}>
                                <div style={{ ...S.heroKpiVal, color: k.color }}>{k.value}</div>
                                <div style={S.heroKpiLbl}>{k.label}</div>
                                <div style={S.heroKpiSub}>{k.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div style={S.heroActions}>
                        <button ref={bellRef} style={{ ...S.heroNotifBtn, position: 'relative' }} onClick={handleBellClick}>
                            <Bell size={16} color="rgba(255,255,255,0.8)" />
                            {NOTIFICATIONS.some(n => n.unread) && (
                                <span style={S.notifBadgeDot} />
                            )}
                        </button>
                        <button style={S.heroLogoutBtn} onClick={logout}><LogOut size={14} /> Logout</button>
                    </div>
                </div>
                <div style={S.heroDate}>{today}</div>
            </div>

            {/* ── Search Bar (between hero and grid) ── */}
            <div style={S.searchStrip}>
                <div ref={searchRef} style={S.searchInner}>
                    <div style={S.searchBox}>
                        <Search size={15} color={searchQuery ? '#2563eb' : '#94a3b8'} style={{ flexShrink: 0 }} />
                        <input
                            style={S.searchInput}
                            placeholder="Search subjects, exams, fees, timetable, actions…"
                            value={searchQuery}
                            onChange={e => {
                                setSearchQuery(e.target.value);
                                setShowSearchResults(true);
                                if (searchRef.current) {
                                    const r = searchRef.current.getBoundingClientRect();
                                    setSearchDropPos({ top: r.bottom + 4, left: r.left, width: r.width });
                                }
                            }}
                            onFocus={() => {
                                if (searchQuery && searchRef.current) {
                                    const r = searchRef.current.getBoundingClientRect();
                                    setSearchDropPos({ top: r.bottom + 4, left: r.left, width: r.width });
                                    setShowSearchResults(true);
                                }
                            }}
                        />
                        {searchQuery
                            ? <button style={S.searchClear} onClick={() => { setSearchQuery(''); setShowSearchResults(false); }}><X size={13} /></button>
                            : <span style={S.searchHint}>⌘K</span>
                        }
                    </div>
                </div>
            </div>

            {/* ── Main 3-col Grid ── */}
            <div style={S.mainGrid}>

                {/* ── LEFT: Profile + Academic Performance ── */}
                <div style={S.leftCol}>

                    {/* Profile Card */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <User size={14} color="#2563eb" />
                            <span style={S.cardTitle}>Student Profile</span>
                        </div>
                        <div style={S.profileGrid}>
                            {[
                                { label: 'Student ID',  value: id,                            icon: Shield   },
                                { label: 'Email',       value: user?.email || 'student@edu.in', icon: Mail     },
                                { label: 'Phone',       value: user?.phone || '98765 43210',   icon: Phone    },
                                { label: 'Year',        value: '2nd Year (Sem IV)',             icon: BookOpen },
                                { label: 'Section',     value: user?.section || 'A',            icon: Star     },
                                { label: 'Campus',      value: 'Main Campus, Chandigarh',       icon: MapPin   },
                                { label: 'Admission No',value: 'ADM-2024-0892',                 icon: FileText },
                                { label: 'Category',    value: 'General',                       icon: User     },
                            ].map(row => (
                                <div key={row.label} style={S.profileRow}>
                                    <div style={S.profileIcon}><row.icon size={12} color="#2563eb" /></div>
                                    <div>
                                        <div style={S.profileLbl}>{row.label}</div>
                                        <div style={S.profileVal}>{row.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            style={S.profileViewBtn}
                            onClick={() => navigate('/student-information')}
                        >
                            View Full Profile <ChevronRight size={13} />
                        </button>
                    </div>

                    {/* Fee Status Card */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <Wallet size={14} color="#d97706" />
                            <span style={S.cardTitle}>Fee Status — Sem IV</span>
                            <span style={{ ...S.feeDueBadge }}> Due: ₹{dueFees.toLocaleString()}</span>
                        </div>
                        <div style={S.feeBarWrap}>
                            <div style={{ ...S.feeBar, width: `${(paidFees / totalFees) * 100}%` }} />
                        </div>
                        <div style={S.feeMeta}>
                            <span style={{ color: '#059669', fontWeight: 700 }}>₹{paidFees.toLocaleString()} paid</span>
                            <span style={{ color: 'var(--text-muted)' }}>of ₹{totalFees.toLocaleString()}</span>
                        </div>
                        <div style={S.feeList}>
                            {FEE_SCHEDULE.map(f => (
                                <div key={f.label} style={S.feeRow}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ ...S.feeStatusDot, background: f.paid ? '#059669' : '#dc2626' }} />
                                        <span style={S.feeName}>{f.label}</span>
                                    </div>
                                    <span style={S.feeAmt}>₹{f.amount.toLocaleString()}</span>
                                    <span style={{ ...S.feeDate, color: f.paid ? '#059669' : '#dc2626' }}>{f.date}</span>
                                </div>
                            ))}
                        </div>
                        {dueFees > 0 && (
                            <button style={S.payNowBtn} onClick={() => navigate('/fees')}>
                                <CreditCard size={14} /> Pay Now — ₹{dueFees.toLocaleString()}
                            </button>
                        )}
                    </div>
                </div>

                {/* ── MIDDLE: Academic Performance ── */}
                <div style={S.midCol}>

                    {/* Tab switcher */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <TrendingUp size={14} color="#7c3aed" />
                            <span style={S.cardTitle}>Academic Performance</span>
                            <div style={S.tabRow}>
                                {[
                                    { id: 'marks',      label: 'Subject Marks' },
                                    { id: 'attendance', label: 'Attendance'    },
                                    { id: 'cgpa',       label: 'CGPA Trend'   },
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        style={{ ...S.tab, ...(activeTab === t.id ? S.tabActive : {}) }}
                                        onClick={() => setActiveTab(t.id)}
                                    >{t.label}</button>
                                ))}
                            </div>
                        </div>

                        {/* Subject Marks */}
                        {activeTab === 'marks' && (
                            <div style={S.subjectList}>
                                {SUBJECTS.map(sub => (
                                    <div key={sub.name} style={S.subjectRow}>
                                        <div style={S.subjectMeta}>
                                            <span style={S.subjectName}>{sub.name}</span>
                                            <span style={{ ...S.gradePill, color: gradeColor(sub.grade), background: `${gradeColor(sub.grade)}15` }}>
                                                {sub.grade}
                                            </span>
                                        </div>
                                        <div style={S.subjectTrack}>
                                            <div style={{ ...S.subjectBar, width: `${sub.marks}%`, background: sub.color }} />
                                        </div>
                                        <div style={{ ...S.subjectScore, color: sub.color }}>{sub.marks}/100</div>
                                    </div>
                                ))}
                                <div style={S.marksFooter}>
                                    Semester Average: <strong style={{ color: '#2563eb' }}>81/100</strong>
                                    &nbsp;·&nbsp; Highest: <strong style={{ color: '#059669' }}>91 (Networks)</strong>
                                    &nbsp;·&nbsp; Lowest: <strong style={{ color: '#dc2626' }}>68 (OS)</strong>
                                </div>
                            </div>
                        )}

                        {/* Attendance per subject */}
                        {activeTab === 'attendance' && (
                            <div style={S.subjectList}>
                                {SUBJECTS.map(sub => {
                                    const pct = sub.attendance;
                                    const ok  = pct >= 75;
                                    return (
                                        <div key={sub.name} style={S.subjectRow}>
                                            <div style={S.subjectMeta}>
                                                <span style={S.subjectName}>{sub.name}</span>
                                                <span style={{ ...S.gradePill, color: ok ? '#059669' : '#dc2626', background: ok ? 'rgba(5,150,105,0.10)' : 'rgba(220,38,38,0.10)' }}>
                                                    {ok ? '✓ OK' : '⚠ Low'}
                                                </span>
                                            </div>
                                            <div style={S.subjectTrack}>
                                                <div style={{ ...S.subjectBar, width: `${pct}%`, background: ok ? '#059669' : '#dc2626' }} />
                                            </div>
                                            <div style={{ ...S.subjectScore, color: ok ? '#059669' : '#dc2626' }}>{pct}%</div>
                                        </div>
                                    );
                                })}
                                <div style={S.marksFooter}>
                                    Overall Attendance: <strong style={{ color: '#2563eb' }}>91%</strong>
                                    &nbsp;·&nbsp; Minimum Required: <strong style={{ color: '#dc2626' }}>75%</strong>
                                </div>
                            </div>
                        )}

                        {/* CGPA Trend */}
                        {activeTab === 'cgpa' && (
                            <div style={{ padding: '16px 20px 20px' }}>
                                <div style={S.cgpaChartWrap}>
                                    {CGPA_TREND.map((s, i) => {
                                        const ht = ((s.cgpa - 6) / 4) * 100;
                                        return (
                                            <div key={s.sem} style={S.cgpaCol}>
                                                <div style={{ ...S.cgpaValLbl, color: s.cgpa >= 7.7 ? '#2563eb' : '#7c3aed' }}>{s.cgpa}</div>
                                                <div style={S.cgpaBarWrap}>
                                                    <div style={{ ...S.cgpaBar, height: `${ht}%`, background: s.cgpa >= 7.7 ? 'linear-gradient(to top,#1e40af,#3b82f6)' : 'linear-gradient(to top,#5b21b6,#8b5cf6)' }} />
                                                </div>
                                                <div style={S.cgpaLbl}>Sem {s.sem}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div style={S.cgpaSummary}>
                                    <div style={S.cgpaStat}><span style={{ color: '#2563eb', fontWeight: 800, fontSize: '1.1rem' }}>7.9</span><span style={S.cgpaStatLbl}>Current CGPA</span></div>
                                    <div style={S.cgpaDivider} />
                                    <div style={S.cgpaStat}><span style={{ color: '#059669', fontWeight: 800, fontSize: '1.1rem' }}>+0.3</span><span style={S.cgpaStatLbl}>vs Last Sem</span></div>
                                    <div style={S.cgpaDivider} />
                                    <div style={S.cgpaStat}><span style={{ color: '#7c3aed', fontWeight: 800, fontSize: '1.1rem' }}>#14</span><span style={S.cgpaStatLbl}>Class Rank</span></div>
                                    <div style={S.cgpaDivider} />
                                    <div style={S.cgpaStat}><span style={{ color: '#d97706', fontWeight: 800, fontSize: '1.1rem' }}>A</span><span style={S.cgpaStatLbl}>Current Grade</span></div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Notifications */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <Bell size={14} color="#d97706" />
                            <span style={S.cardTitle}>Notifications</span>
                            <span style={S.unreadBadge}>{NOTIFICATIONS.filter(n => n.unread).length} new</span>
                        </div>
                        <div>
                            {NOTIFICATIONS.map((n, i) => (
                                <div key={i} style={{ ...S.notifRow, background: n.unread ? 'rgba(37,99,235,0.03)' : 'transparent' }}>
                                    <div style={{ ...S.notifIcon, background: n.bg, color: n.color }}><n.icon size={13} /></div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ ...S.notifText, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                                        <div style={S.notifTime}><Clock size={9} /> {n.time}</div>
                                    </div>
                                    {n.unread && <div style={S.unreadDot} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: Schedule + Exams + Quick Actions ── */}
                <div style={S.rightCol}>

                    {/* Today's Schedule */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <Clock size={14} color="#059669" />
                            <span style={S.cardTitle}>Today's Schedule</span>
                            <span style={S.todayBadge}>Friday</span>
                        </div>
                        <div>
                            {TIMETABLE.map((t, i) => (
                                <div key={i} style={{ ...S.ttRow, borderLeft: `3px solid ${t.color}`, background: t.type === 'Break' ? 'var(--bg-hover)' : 'white' }}>
                                    <div style={{ ...S.ttTime, color: t.color }}>{t.time}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ ...S.ttSubject, color: t.type === 'Break' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{t.subject}</div>
                                        {t.room && <div style={S.ttMeta}><MapPin size={9} /> {t.room} · <span style={{ ...S.ttType, color: t.color }}>{t.type}</span></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Exams */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <FileText size={14} color="#dc2626" />
                            <span style={S.cardTitle}>Upcoming Exams</span>
                        </div>
                        <div style={{ padding: '4px 0 10px' }}>
                            {EXAMS.map(ex => (
                                <div key={ex.subject} style={{ ...S.examRow, borderLeft: `3px solid ${ex.color}`, background: `${ex.color}07` }}>
                                    <div style={{ ...S.examDate, color: ex.color }}>{ex.date}</div>
                                    <div>
                                        <div style={S.examSubject}>{ex.subject}</div>
                                        <div style={{ ...S.examType, color: ex.color }}>{ex.type}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div style={S.card}>
                        <div style={S.cardHeader}>
                            <Activity size={14} color="#7c3aed" />
                            <span style={S.cardTitle}>Quick Actions</span>
                        </div>
                        <div style={S.qaGrid}>
                            {QUICK_ACTIONS.map(a => (
                                <button
                                    key={a.label}
                                    style={{ ...S.qaBtn, background: a.bg }}
                                    onClick={() => a.action && a.action()}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 18px ${a.bg}`; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)';    e.currentTarget.style.boxShadow = 'none'; }}
                                >
                                    <div style={{ ...S.qaIcon, color: a.color }}><a.icon size={18} strokeWidth={2} /></div>
                                    <span style={{ ...S.qaLabel, color: a.color }}>{a.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Search results dropdown (fixed, avoids overflow clipping) ── */}
            {showSearchResults && searchQuery && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 499 }} onClick={() => setShowSearchResults(false)} />
                    <div style={{ ...S.searchDropdown, position: 'fixed', top: searchDropPos.top, left: searchDropPos.left, width: searchDropPos.width, zIndex: 500 }}>
                        {searchResults.length === 0 ? (
                            <div style={S.searchEmpty}>
                                <Search size={18} color="#cbd5e1" />
                                <span>No results for <strong>"{searchQuery}"</strong></span>
                            </div>
                        ) : (
                            <>
                                <div style={S.searchResultCount}>{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</div>
                                {searchResults.map((r, i) => (
                                    <button key={i} style={S.searchResultItem} onClick={r.action}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{ ...S.searchResultIcon, background: `${r.color}15`, color: r.color }}>
                                            <r.Icon size={13} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={S.searchResultLabel}>{r.label}</div>
                                            <div style={S.searchResultSub}>{r.sub}</div>
                                        </div>
                                        <span style={{ ...S.searchResultBadge, background: `${r.color}12`, color: r.color }}>{r.type}</span>
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                </>
            )}

            {/* ── Notification dropdown (fixed, anchored to bell button) ── */}
            {showNotif && (
                <>
                    <div style={{ position: 'fixed', inset: 0, zIndex: 1099 }} onClick={() => setShowNotif(false)} />
                    <div style={{ ...S.notifDropdown, position: 'fixed', top: notifPos.top, right: notifPos.right, zIndex: 1100 }}>
                        <div style={S.notifDropHeader}>
                            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>Notifications</span>
                            <button style={S.notifDropClose} onClick={() => setShowNotif(false)}><X size={13} /></button>
                        </div>
                        {NOTIFICATIONS.map((n, i) => (
                            <div key={i} style={{ ...S.notifRow, background: n.unread ? 'rgba(37,99,235,0.04)' : 'transparent', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ ...S.notifIcon, background: n.bg, color: n.color }}><n.icon size={13} /></div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ ...S.notifText, fontWeight: n.unread ? 600 : 400 }}>{n.text}</div>
                                    <div style={S.notifTime}><Clock size={9} /> {n.time}</div>
                                </div>
                                {n.unread && <div style={S.unreadDot} />}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── MODALS ── */}
            {modal && (
                <div style={S.overlay} onClick={() => setModal(null)}>
                    <div style={S.modalBox} onClick={e => e.stopPropagation()}>

                        {/* Timetable modal */}
                        {modal === 'timetable' && (
                            <>
                                <div style={S.modalHead}>
                                    <Calendar size={16} color="#7c3aed" />
                                    <span style={S.modalTitle}>Weekly Timetable</span>
                                    <button style={S.modalClose} onClick={() => setModal(null)}><X size={14} /></button>
                                </div>
                                <div style={S.modalBody}>
                                    {[
                                        { day: 'Monday',    slots: ['Data Structures (A-201)', 'Mathematics III (B-105)', 'Database Management (Lab-1)'] },
                                        { day: 'Tuesday',   slots: ['Computer Networks (B-201)', 'Operating Systems (A-301)', 'Software Engineering (C-105)'] },
                                        { day: 'Wednesday', slots: ['Mathematics III (B-105)', 'Data Structures Lab (Lab-2)', 'Computer Networks (B-201)'] },
                                        { day: 'Thursday',  slots: ['Database Management (Lab-1)', 'Software Engineering (C-105)', 'OS Tutorial (A-105)'] },
                                        { day: 'Friday',    slots: ['Data Structures (A-201)', 'Mathematics III (B-105)', 'Computer Networks Lab (Lab-3)', 'OS Tutorial (A-105)'] },
                                    ].map(row => (
                                        <div key={row.day} style={{ marginBottom: 14 }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>{row.day}</div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {row.slots.map(slot => (
                                                    <span key={slot} style={{ padding: '4px 10px', background: 'rgba(124,58,237,0.07)', color: '#4c1d95', borderRadius: 6, fontSize: '0.74rem', fontWeight: 500 }}>{slot}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Exams modal */}
                        {modal === 'exams' && (
                            <>
                                <div style={S.modalHead}>
                                    <BookMarked size={16} color="#0284c7" />
                                    <span style={S.modalTitle}>Upcoming Exam Schedule</span>
                                    <button style={S.modalClose} onClick={() => setModal(null)}><X size={14} /></button>
                                </div>
                                <div style={S.modalBody}>
                                    {[
                                        ...EXAMS,
                                        { subject: 'Software Engineering', date: 'Jun 19', type: 'Mid-Sem',   color: '#2563eb' },
                                        { subject: 'Database Management',  date: 'Jun 21', type: 'Practical', color: '#059669' },
                                    ].map(ex => (
                                        <div key={ex.subject} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', borderRadius: 10, background: `${ex.color}09`, borderLeft: `3px solid ${ex.color}`, marginBottom: 6 }}>
                                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: ex.color, minWidth: 46 }}>{ex.date}</div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ex.subject}</div>
                                                <div style={{ fontSize: '0.68rem', fontWeight: 600, color: ex.color, marginTop: 2 }}>{ex.type}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Results modal */}
                        {modal === 'results' && (
                            <>
                                <div style={S.modalHead}>
                                    <BarChart2 size={16} color="#dc2626" />
                                    <span style={S.modalTitle}>Result History</span>
                                    <button style={S.modalClose} onClick={() => setModal(null)}><X size={14} /></button>
                                </div>
                                <div style={S.modalBody}>
                                    {CGPA_TREND.map(sem => (
                                        <div key={sem.sem} style={{ marginBottom: 18 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-primary)' }}>Semester {sem.sem}</span>
                                                <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#2563eb' }}>CGPA {sem.cgpa}</span>
                                            </div>
                                            <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${(sem.cgpa / 10) * 100}%`, background: sem.cgpa >= 7.7 ? 'linear-gradient(90deg,#1e40af,#3b82f6)' : 'linear-gradient(90deg,#5b21b6,#8b5cf6)', borderRadius: 99 }} />
                                            </div>
                                        </div>
                                    ))}
                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 12, marginTop: 4 }}>
                                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10 }}>Current Semester — Subject Marks</div>
                                        {SUBJECTS.map(s => (
                                            <div key={s.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f8fafc', fontSize: '0.78rem' }}>
                                                <span style={{ color: 'var(--text-secondary)' }}>{s.name}</span>
                                                <span style={{ fontWeight: 700, color: s.color }}>{s.marks}/{s.max} &nbsp;<span style={{ background: `${gradeColor(s.grade)}15`, color: gradeColor(s.grade), padding: '1px 6px', borderRadius: 4, fontSize: '0.65rem', fontWeight: 800 }}>{s.grade}</span></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Fees modal */}
                        {modal === 'fees' && (
                            <>
                                <div style={S.modalHead}>
                                    <CreditCard size={16} color="#2563eb" />
                                    <span style={S.modalTitle}>Fee Payment — Sem IV</span>
                                    <button style={S.modalClose} onClick={() => setModal(null)}><X size={14} /></button>
                                </div>
                                <div style={S.modalBody}>
                                    <div style={{ height: 7, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
                                        <div style={{ height: '100%', width: `${(paidFees / totalFees) * 100}%`, background: 'linear-gradient(90deg,#059669,#10b981)', borderRadius: 99 }} />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 14 }}>
                                        <span style={{ color: '#059669', fontWeight: 700 }}>₹{paidFees.toLocaleString()} paid</span>
                                        <span style={{ color: 'var(--text-muted)' }}>of ₹{totalFees.toLocaleString()}</span>
                                    </div>
                                    {FEE_SCHEDULE.map(f => (
                                        <div key={f.label} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: '1px solid #f8fafc' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 7, height: 7, borderRadius: '50%', background: f.paid ? '#059669' : '#dc2626', flexShrink: 0 }} />
                                                <span style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{f.label}</span>
                                            </div>
                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>₹{f.amount.toLocaleString()}</span>
                                            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: f.paid ? '#059669' : '#dc2626' }}>{f.date}</span>
                                        </div>
                                    ))}
                                    {dueFees > 0 ? (
                                        <button
                                            style={{ ...S.payNowBtn, borderRadius: 10, marginTop: 16, opacity: payingFee ? 0.7 : 1 }}
                                            onClick={handlePayFees}
                                            disabled={payingFee}
                                        >
                                            <CreditCard size={15} /> {payingFee ? 'Processing…' : `Pay Now — ₹${dueFees.toLocaleString()}`}
                                        </button>
                                    ) : (
                                        <div style={{ textAlign: 'center', padding: '16px 0', color: '#059669', fontWeight: 700, fontSize: '0.84rem' }}>
                                            ✓ All fees paid for this semester
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Styles ── */
const S = {
    /* Hero */
    hero: {
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #1e40af 100%)',
        padding: 'calc(var(--navbar-height) + 20px) 32px 24px',
    },
    heroGlow: { position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(99,102,241,0.18)', filter: 'blur(60px)', pointerEvents: 'none' },
    heroContent: { display: 'flex', alignItems: 'center', gap: 22, position: 'relative', zIndex: 1 },
    avatar: {
        width: 68, height: 68, borderRadius: 18, flexShrink: 0,
        background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
        display: 'grid', placeItems: 'center',
        fontSize: '1.4rem', fontWeight: 900, color: 'white',
        border: '3px solid rgba(255,255,255,0.2)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    },
    heroId: { flex: 1 },
    heroGreeting: { fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 3, letterSpacing: '0.04em' },
    heroName: { fontSize: '1.35rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-display)', marginBottom: 8, lineHeight: 1 },
    heroChips: { display: 'flex', flexWrap: 'wrap', gap: 6 },
    heroChip: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 20, fontSize: '0.67rem', fontWeight: 600, background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.15)' },
    heroKpis: { display: 'flex', gap: 2 },
    heroKpi: { padding: '10px 20px', borderLeft: '1px solid rgba(255,255,255,0.12)', textAlign: 'center' },
    heroKpiVal: { fontSize: '1.4rem', fontWeight: 900, fontFamily: 'var(--font-display)', lineHeight: 1 },
    heroKpiLbl: { fontSize: '0.65rem', fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.06em' },
    heroKpiSub: { fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 },
    heroActions: { display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 },
    heroNotifBtn: { width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'grid', placeItems: 'center' },
    heroLogoutBtn: { display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 9, background: 'rgba(220,38,38,0.25)', border: '1px solid rgba(220,38,38,0.4)', color: '#fca5a5', fontSize: '0.74rem', fontWeight: 700, cursor: 'pointer' },
    heroDate: { position: 'absolute', bottom: 14, right: 32, fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 500 },

    /* Layout */
    mainGrid: { display: 'grid', gridTemplateColumns: '300px 1fr 280px', gap: 16, padding: '0 28px 32px' },
    leftCol:  { display: 'flex', flexDirection: 'column', gap: 16 },
    midCol:   { display: 'flex', flexDirection: 'column', gap: 16 },
    rightCol: { display: 'flex', flexDirection: 'column', gap: 16 },

    /* Card */
    card: { background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', boxShadow: '0 1px 6px rgba(15,23,42,0.05)', overflow: 'hidden' },
    cardHeader: { display: 'flex', alignItems: 'center', gap: 7, padding: '14px 18px 10px', borderBottom: '1px solid #f1f5f9' },
    cardTitle: { flex: 1, fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' },

    /* Profile */
    profileGrid: { display: 'flex', flexDirection: 'column' },
    profileRow: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 18px', borderBottom: '1px solid #f8fafc' },
    profileIcon: { width: 26, height: 26, borderRadius: 7, background: 'rgba(37,99,235,0.08)', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 },
    profileLbl: { fontSize: '0.62rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 },
    profileVal: { fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' },
    profileViewBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, width: '100%', padding: '11px', background: 'rgba(37,99,235,0.06)', border: 'none', color: '#2563eb', fontSize: '0.76rem', fontWeight: 700, cursor: 'pointer', marginTop: 2 },

    /* Fee */
    feeDueBadge: { marginLeft: 'auto', fontSize: '0.68rem', fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: 'rgba(220,38,38,0.09)', color: '#dc2626' },
    feeBarWrap: { height: 7, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden', margin: '12px 18px 6px' },
    feeBar: { height: '100%', borderRadius: 99, background: 'linear-gradient(90deg,#059669,#10b981)', transition: 'width 0.6s' },
    feeMeta: { display: 'flex', justifyContent: 'space-between', padding: '0 18px 12px', fontSize: '0.72rem' },
    feeList: { borderTop: '1px solid #f1f5f9' },
    feeRow: { display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 10, padding: '9px 18px', borderBottom: '1px solid #f8fafc' },
    feeStatusDot: { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
    feeName: { fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)' },
    feeAmt: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' },
    feeDate: { fontSize: '0.67rem', fontWeight: 600 },
    payNowBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', padding: '12px', background: 'linear-gradient(90deg,#1e40af,#2563eb)', border: 'none', color: 'white', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', marginTop: 2 },

    /* Tabs */
    tabRow: { display: 'flex', gap: 3, background: '#f8fafc', borderRadius: 8, padding: 3 },
    tab: { padding: '5px 11px', borderRadius: 6, fontSize: '0.68rem', fontWeight: 500, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' },
    tabActive: { background: 'white', color: '#2563eb', fontWeight: 700, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },

    /* Subject list */
    subjectList: { padding: '10px 18px 14px', display: 'flex', flexDirection: 'column', gap: 13 },
    subjectRow: { display: 'grid', gridTemplateColumns: '1fr 90px 52px', alignItems: 'center', gap: 10 },
    subjectMeta: { display: 'flex', alignItems: 'center', gap: 7 },
    subjectName: { fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-primary)', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    gradePill: { fontSize: '0.62rem', fontWeight: 800, padding: '2px 7px', borderRadius: 5, flexShrink: 0 },
    subjectTrack: { height: 8, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' },
    subjectBar: { height: '100%', borderRadius: 99 },
    subjectScore: { fontSize: '0.74rem', fontWeight: 700, textAlign: 'right' },
    marksFooter: { fontSize: '0.67rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: 10, lineHeight: 1.6 },

    /* CGPA chart */
    cgpaChartWrap: { display: 'flex', gap: 16, alignItems: 'flex-end', height: 110, marginBottom: 16 },
    cgpaCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', gap: 5 },
    cgpaValLbl: { fontSize: '0.75rem', fontWeight: 800 },
    cgpaBarWrap: { flex: 1, width: '100%', background: '#f1f5f9', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
    cgpaBar: { width: '100%', borderRadius: '8px 8px 0 0' },
    cgpaLbl: { fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 500 },
    cgpaSummary: { display: 'flex', background: '#f8fafc', borderRadius: 10, overflow: 'hidden', border: '1px solid #e2e8f0' },
    cgpaStat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 8px', gap: 3 },
    cgpaStatLbl: { fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 },
    cgpaDivider: { width: 1, background: '#e2e8f0', margin: '10px 0' },

    /* Notifications */
    unreadBadge: { marginLeft: 'auto', fontSize: '0.64rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: 'rgba(220,38,38,0.09)', color: '#dc2626' },
    notifRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', borderBottom: '1px solid #f8fafc' },
    notifIcon: { width: 28, height: 28, borderRadius: 8, display: 'grid', placeItems: 'center', flexShrink: 0 },
    notifText: { fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.4 },
    notifTime: { fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 },
    unreadDot: { width: 8, height: 8, borderRadius: '50%', background: '#2563eb', flexShrink: 0 },

    /* Timetable */
    todayBadge: { marginLeft: 'auto', fontSize: '0.66rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: 'rgba(5,150,105,0.09)', color: '#059669' },
    ttRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', marginBottom: 2 },
    ttTime: { fontSize: '0.68rem', fontWeight: 800, minWidth: 38, fontFamily: 'monospace' },
    ttSubject: { fontSize: '0.77rem', fontWeight: 600 },
    ttMeta: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: 2 },
    ttType: { fontWeight: 700 },

    /* Exams */
    examRow: { margin: '5px 12px', borderRadius: 8, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 12 },
    examDate: { fontSize: '0.66rem', fontWeight: 800, minWidth: 38, textAlign: 'center' },
    examSubject: { fontSize: '0.77rem', fontWeight: 600, color: 'var(--text-primary)' },
    examType: { fontSize: '0.63rem', fontWeight: 600, marginTop: 2 },

    /* Quick actions */
    qaGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 14px 14px' },
    qaBtn: { border: 'none', borderRadius: 10, padding: '11px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s' },
    qaIcon: { width: 34, height: 34, borderRadius: 9, display: 'grid', placeItems: 'center' },
    qaLabel: { fontSize: '0.65rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.3 },

    /* Notification dropdown */
    notifBadgeDot: { position: 'absolute', top: 5, right: 5, width: 8, height: 8, borderRadius: '50%', background: '#dc2626', border: '2px solid rgba(255,255,255,0.3)' },
    notifDropdown: { width: 300, background: 'white', borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.18)', overflow: 'hidden', border: '1px solid #e2e8f0' },
    notifDropHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f1f5f9' },
    notifDropClose: { width: 26, height: 26, borderRadius: 7, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' },

    /* Modal */
    overlay: { position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(4px)', display: 'grid', placeItems: 'center', zIndex: 1100, padding: 16 },
    modalBox: { background: 'white', borderRadius: 16, width: '100%', maxWidth: 500, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden' },
    modalHead: { display: 'flex', alignItems: 'center', gap: 8, padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9' },
    modalTitle: { flex: 1, fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' },
    modalClose: { width: 30, height: 30, borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' },
    modalBody: { padding: '16px 20px 20px', maxHeight: '65vh', overflowY: 'auto' },

    /* Search strip */
    searchStrip: { background: 'white', borderBottom: '1px solid #e8edf5', padding: '10px 28px', display: 'flex', justifyContent: 'center', boxShadow: '0 2px 8px rgba(15,23,42,0.05)' },
    searchInner: { width: '100%', maxWidth: 560 },
    searchBox: { display: 'flex', alignItems: 'center', gap: 10, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '9px 14px', transition: 'border-color 0.15s, box-shadow 0.15s' },
    searchInput: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '0.84rem', color: 'var(--text-primary)', minWidth: 0 },
    searchClear: { width: 22, height: 22, borderRadius: 6, border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer', display: 'grid', placeItems: 'center', color: '#94a3b8', flexShrink: 0 },
    searchHint: { fontSize: '0.65rem', color: '#94a3b8', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 5, padding: '2px 6px', flexShrink: 0, fontFamily: 'monospace' },
    searchDropdown: { background: 'white', borderRadius: 14, border: '1.5px solid #e2e8f0', boxShadow: '0 16px 48px rgba(15,23,42,0.18)', overflow: 'hidden', maxHeight: 360, overflowY: 'auto' },
    searchResultCount: { padding: '8px 14px 4px', fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' },
    searchResultItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background 0.1s' },
    searchResultIcon: { width: 30, height: 30, borderRadius: 8, display: 'grid', placeItems: 'center', flexShrink: 0 },
    searchResultLabel: { fontSize: '0.79rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    searchResultSub: { fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    searchResultBadge: { fontSize: '0.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 5, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em' },
    searchEmpty: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 16px', color: 'var(--text-muted)', fontSize: '0.8rem' },
};
