import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountUp } from '../../hooks/useCountUp.js';
import Navbar from '../../components/layout/Navbar.jsx';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
    GraduationCap, Users, BookOpen, TrendingUp,
    ArrowUpRight, ArrowDownRight, CreditCard,
    CheckCircle, AlertTriangle, Calendar, Award, Clock,
    ChevronRight, Bell, Zap, Activity, Building2,
    UserPlus, FileText, BarChart3, Star, MapPin,
    BookMarked, Target, PieChart, Layers, Globe,
} from 'lucide-react';

/* ═══════════════════════════════════════
   MULTI-CAMPUS DATA
═══════════════════════════════════════ */
const CAMPUSES = [
    { id: 'all',   label: 'All Campuses',  short: 'ALL' },
    { id: 'main',  label: 'Main Campus',   short: 'MCH' },
    { id: 'north', label: 'North Campus',  short: 'NCH' },
    { id: 'south', label: 'South Campus',  short: 'SCH' },
];

const CAMPUS_STATS = {
    all:   { students: 1284, faculty: 86, courses: 34, passRate: '91.4%', attendance: '89%', feesPending: '₹2.4L', pendingCount: 38, newAdm: 14, cgpa: '7.8' },
    main:  { students: 620,  faculty: 42, courses: 18, passRate: '92.1%', attendance: '91%', feesPending: '₹1.1L', pendingCount: 16, newAdm: 7,  cgpa: '8.0' },
    north: { students: 390,  faculty: 26, courses: 10, passRate: '90.5%', attendance: '87%', feesPending: '₹0.8L', pendingCount: 13, newAdm: 4,  cgpa: '7.6' },
    south: { students: 274,  faculty: 18, courses: 6,  passRate: '91.0%', attendance: '88%', feesPending: '₹0.5L', pendingCount: 9,  newAdm: 3,  cgpa: '7.7' },
};

const CAMPUS_OVERVIEW = [
    { id: 'main',  name: 'Main Campus',  location: 'Sector-12, Chandigarh', students: 620,  faculty: 42, depts: 8,  util: 78, color: '#2563eb', gradient: 'linear-gradient(135deg,#1e3a8a,#2563eb)' },
    { id: 'north', name: 'North Campus', location: 'Panchkula Extension',   students: 390,  faculty: 26, depts: 5,  util: 65, color: '#059669', gradient: 'linear-gradient(135deg,#065f46,#10b981)' },
    { id: 'south', name: 'South Campus', location: 'Mohali Phase-7',        students: 274,  faculty: 18, depts: 4,  util: 57, color: '#7c3aed', gradient: 'linear-gradient(135deg,#4c1d95,#8b5cf6)' },
];

/* ═══════════════════════════════════════
   ACADEMIC REPORTING DATA
═══════════════════════════════════════ */
const SEMESTERS = ['Sem I', 'Sem II', 'Sem III', 'Sem IV', 'Sem V', 'Sem VI'];
const SEM_PASS  = [88, 91, 87, 93, 90, 94];
const SEM_AVG   = [7.1, 7.4, 7.0, 7.8, 7.6, 8.1];

const SUBJECT_PERF = [
    { sub: 'Mathematics',       passRate: 88, avgMarks: 71, color: '#2563eb' },
    { sub: 'Data Structures',   passRate: 92, avgMarks: 76, color: '#059669' },
    { sub: 'Physics',           passRate: 84, avgMarks: 68, color: '#7c3aed' },
    { sub: 'Business Studies',  passRate: 95, avgMarks: 81, color: '#d97706' },
    { sub: 'English Language',  passRate: 97, avgMarks: 84, color: '#0284c7' },
    { sub: 'Computer Networks', passRate: 86, avgMarks: 70, color: '#dc2626' },
];

const GRADE_DIST = [
    { grade: 'O (≥90)', count: 124, pct: 10, color: '#059669' },
    { grade: 'A+ (80-89)', count: 287, pct: 22, color: '#2563eb' },
    { grade: 'A  (70-79)', count: 412, pct: 32, color: '#7c3aed' },
    { grade: 'B+ (60-69)', count: 298, pct: 23, color: '#d97706' },
    { grade: 'B  (50-59)', count: 112, pct:  9, color: '#f59e0b' },
    { grade: 'F  (<50)',   count:  51, pct:  4, color: '#dc2626' },
];

const REPORTS = [
    { title: 'Semester Result Report',    desc: 'Sem IV 2025-26',    icon: FileText,   color: '#2563eb', bg: 'rgba(37,99,235,0.09)',  to: '/results'          },
    { title: 'Attendance Summary',        desc: 'May 2026',          icon: CheckCircle,color: '#059669', bg: 'rgba(5,150,105,0.09)',  to: '/attendance'       },
    { title: 'Fee Collection Report',     desc: 'Q1 2026',           icon: CreditCard, color: '#d97706', bg: 'rgba(217,119,6,0.09)',  to: '/fees'             },
    { title: 'Admission Analytics',       desc: 'AY 2026-27',        icon: BarChart3,  color: '#7c3aed', bg: 'rgba(124,58,237,0.09)', to: '/admissions'       },
    { title: 'Faculty Performance',       desc: 'Annual Review',     icon: Users,      color: '#0284c7', bg: 'rgba(2,132,199,0.09)',  to: '/teachers'         },
    { title: 'Campus Utilisation',        desc: 'All Campuses',      icon: Building2,  color: '#dc2626', bg: 'rgba(220,38,38,0.09)',  to: '/admin-panel'      },
];

/* ═══════════════════════════════════════
   OTHER MOCK DATA
═══════════════════════════════════════ */
const STUDENTS = [
    { id: 'STU001', name: 'Priya Sharma',  course: 'B.Sc CSE',    year: 'Sem IV', campus: 'Main',  status: 'Active',   fees: 'Paid',    cgpa: '9.1', avatar: '#2563eb' },
    { id: 'STU002', name: 'Rohan Das',     course: 'B.Com Hons',  year: 'Sem VI', campus: 'North', status: 'Active',   fees: 'Pending', cgpa: '7.8', avatar: '#059669' },
    { id: 'STU003', name: 'Ananya Patel',  course: 'B.A English', year: 'Sem II', campus: 'South', status: 'Active',   fees: 'Paid',    cgpa: '8.4', avatar: '#7c3aed' },
    { id: 'STU004', name: 'Suresh Kumar',  course: 'B.Tech ECE',  year: 'Sem VII',campus: 'Main',  status: 'Inactive', fees: 'Overdue', cgpa: '6.2', avatar: '#dc2626' },
    { id: 'STU005', name: 'Meena Nayak',   course: 'M.Sc Maths',  year: 'Sem III',campus: 'Main',  status: 'Active',   fees: 'Paid',    cgpa: '8.9', avatar: '#d97706' },
    { id: 'STU006', name: 'Kiran Reddy',   course: 'B.Tech CSE',  year: 'Sem V',  campus: 'North', status: 'Active',   fees: 'Paid',    cgpa: '9.4', avatar: '#0284c7' },
];

const ACTIVITY = [
    { icon: GraduationCap, text: 'Arjun Mehta enrolled in B.Tech CSE — Main Campus',  time: '2 hrs ago',  color: '#2563eb', bg: 'rgba(37,99,235,0.10)' },
    { icon: CreditCard,    text: 'Fee payments received from 12 students (North)',      time: '4 hrs ago',  color: '#059669', bg: 'rgba(5,150,105,0.10)'  },
    { icon: Award,         text: 'Sem IV results published across all campuses',        time: '6 hrs ago',  color: '#7c3aed', bg: 'rgba(124,58,237,0.10)' },
    { icon: Building2,     text: 'South Campus lab block capacity upgraded',            time: '1 day ago',  color: '#d97706', bg: 'rgba(217,119,6,0.10)'  },
    { icon: Calendar,      text: 'Cross-campus attendance report generated',            time: '1 day ago',  color: '#0284c7', bg: 'rgba(2,132,199,0.10)'  },
];

const EVENTS = [
    { title: 'Mid-Semester Exams',      date: 'Jun 10', dept: 'All Campuses',         color: '#dc2626', bg: 'rgba(220,38,38,0.07)'  },
    { title: 'Faculty Review Meet',     date: 'Jun 12', dept: 'Administration',        color: '#d97706', bg: 'rgba(217,119,6,0.07)'  },
    { title: 'Admission Counselling',   date: 'Jun 14', dept: 'Admissions — All',      color: '#2563eb', bg: 'rgba(37,99,235,0.07)'  },
    { title: 'Inter-Campus Sports Day', date: 'Jun 18', dept: 'Student Council',       color: '#059669', bg: 'rgba(5,150,105,0.07)'  },
];

const TOP_PERFORMERS = [
    { name: 'Kiran Reddy',  course: 'B.Tech CSE', campus: 'North', cgpa: '9.4', rank: 1, avatar: '#0284c7' },
    { name: 'Priya Sharma', course: 'B.Sc CSE',   campus: 'Main',  cgpa: '9.1', rank: 2, avatar: '#2563eb' },
    { name: 'Meena Nayak',  course: 'M.Sc Maths', campus: 'Main',  cgpa: '8.9', rank: 3, avatar: '#d97706' },
];

const feeBadge    = s => ({ Paid: 'badge-success', Pending: 'badge-warning', Overdue: 'badge-danger' }[s] || 'badge-neutral');
const statusBadge = s => s === 'Active' ? 'badge-success' : 'badge-neutral';
function cgpaStyle(cgpa) {
    const v = parseFloat(cgpa);
    const color = v >= 9 ? '#059669' : v >= 8 ? '#2563eb' : v >= 7 ? '#d97706' : '#dc2626';
    const bg    = v >= 9 ? 'rgba(5,150,105,0.10)' : v >= 8 ? 'rgba(37,99,235,0.10)' : v >= 7 ? 'rgba(217,119,6,0.10)' : 'rgba(220,38,38,0.10)';
    return { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: bg, color, borderRadius: 6, padding: '2px 9px', fontSize: '0.76rem', fontWeight: 700 };
}

/* ═══════════════════════════════════════
   ANIMATED SUB-COMPONENTS
═══════════════════════════════════════ */
function HeroCard({ label, value, change, up, icon: Icon, gradient, glow, sub }) {
    const animated = useCountUp(value);
    return (
        <div style={{ ...S.heroCard, background: gradient, boxShadow: `0 8px 28px ${glow}` }}>
            <div style={S.heroTop}>
                <div style={S.heroIconBox}><Icon size={21} strokeWidth={2} color="white" /></div>
                <div style={S.heroChangePill}>
                    {up === true  && <ArrowUpRight size={11} />}
                    {up === false && <ArrowDownRight size={11} />}
                    {change}
                </div>
            </div>
            <div style={S.heroVal}>{animated}</div>
            <div style={S.heroLbl}>{label}</div>
            <div style={S.heroSub}>{sub}</div>
            <div style={S.heroShine} />
        </div>
    );
}

function KpiCard({ label, value, sub, icon: Icon, color, bg, border }) {
    const animated = useCountUp(value);
    return (
        <div style={{ ...S.kpiCard, background: bg, border: `1px solid ${border}` }}>
            <div style={{ ...S.kpiIcon, color }}><Icon size={15} strokeWidth={2} /></div>
            <div style={{ ...S.kpiVal, color }}>{animated}</div>
            <div style={S.kpiLbl}>{label}</div>
            <div style={S.kpiSub}>{sub}</div>
        </div>
    );
}

/* ═══════════════════════════════════════
   COMPONENT
═══════════════════════════════════════ */
export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [campus, setCampus] = useState('all');
    const [reportTab, setReportTab] = useState('subject');

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const firstName = user?.name?.split(' ')[0] || 'Admin';
    const cs = CAMPUS_STATS[campus];

    const heroCards = [
        { label: 'Total Students',  value: cs.students, change: '+12%', up: true,  icon: GraduationCap, gradient: 'linear-gradient(135deg,#312e81,#4f46e5,#6366f1)', glow: 'rgba(79,70,229,0.35)', sub: 'Across selected campus' },
        { label: 'Faculty Members', value: cs.faculty,  change: '+3%',  up: true,  icon: Users,         gradient: 'linear-gradient(135deg,#064e3b,#059669,#10b981)', glow: 'rgba(16,185,129,0.35)', sub: 'All departments' },
        { label: 'Active Courses',  value: cs.courses,  change: '0%',   up: null,  icon: BookOpen,      gradient: 'linear-gradient(135deg,#4c1d95,#7c3aed,#8b5cf6)', glow: 'rgba(139,92,246,0.35)', sub: 'Current semester' },
        { label: 'Pass Rate',       value: cs.passRate, change: '+5%',  up: true,  icon: TrendingUp,    gradient: 'linear-gradient(135deg,#78350f,#d97706,#f59e0b)', glow: 'rgba(245,158,11,0.35)', sub: 'Above national avg' },
    ];

    return (
        <div className="erp-page">
            <Navbar title="Dashboard" subtitle={`${greeting}, ${firstName} 👋`} />

            {/* ── Campus Selector ── */}
            <div style={S.campusBar}>
                <div style={S.campusLeft}>
                    <Globe size={14} color="#2563eb" />
                    <span style={S.campusBarLabel}>Campus View:</span>
                </div>
                <div style={S.campusTabs}>
                    {CAMPUSES.map(c => (
                        <button
                            key={c.id}
                            style={{ ...S.campusTab, ...(campus === c.id ? S.campusTabActive : {}) }}
                            onClick={() => setCampus(c.id)}
                        >
                            {campus === c.id && <span style={S.campusDot} />}
                            {c.label}
                        </button>
                    ))}
                </div>
                <div style={S.campusRight}>
                    <span style={S.campusAY}>Academic Year 2026–27</span>
                    <span style={S.campusSem}>· Semester IV</span>
                </div>
            </div>

            {/* ── Hero KPI Cards ── */}
            <div style={S.heroGrid}>
                {heroCards.map((card) => (
                    <HeroCard key={card.label} {...card} />
                ))}
            </div>

            {/* ── KPI Strip ── */}
            <div style={S.kpiGrid}>
                {[
                    { label: 'Attendance Today', value: cs.attendance,     sub: `${cs.students} enrolled`,     icon: CheckCircle,  color:'#059669', bg:'rgba(16,185,129,0.09)',  border:'rgba(16,185,129,0.22)' },
                    { label: 'Fees Pending',      value: cs.feesPending,   sub: `${cs.pendingCount} students`, icon: AlertTriangle,color:'#d97706', bg:'rgba(245,158,11,0.09)',  border:'rgba(245,158,11,0.22)' },
                    { label: 'Exams This Week',   value: '6',              sub: '3 departments',               icon: Calendar,     color:'#7c3aed', bg:'rgba(139,92,246,0.09)',  border:'rgba(139,92,246,0.22)' },
                    { label: 'New Admissions',    value: String(cs.newAdm),sub: 'This month',                  icon: UserPlus,     color:'#0284c7', bg:'rgba(2,132,199,0.09)',   border:'rgba(2,132,199,0.22)'  },
                    { label: 'Avg. CGPA',         value: cs.cgpa,          sub: '+0.3 from last sem',          icon: Star,         color:'#dc2626', bg:'rgba(220,38,38,0.09)',   border:'rgba(220,38,38,0.22)'  },
                    { label: 'Pending Alerts',    value: '23',             sub: '5 require action',            icon: Bell,         color:'#7c3aed', bg:'rgba(124,58,237,0.09)',  border:'rgba(124,58,237,0.22)' },
                ].map(item => <KpiCard key={item.label} {...item} />)}
            </div>

            {/* ── Campus Overview Cards (only when All Campuses) ── */}
            {campus === 'all' && (
                <div style={S.campusOvGrid}>
                    <div style={S.campusOvLabel}>
                        <Building2 size={14} style={{ marginRight: 6 }} />
                        Campus Overview
                    </div>
                    {CAMPUS_OVERVIEW.map(c => (
                        <div key={c.id} style={{ ...S.campusOvCard, borderTop: `3px solid ${c.color}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                <div style={{ ...S.campusOvIconBox, background: c.gradient }}>
                                    <Building2 size={16} color="white" />
                                </div>
                                <button
                                    style={{ ...S.campusOvSwitch, color: c.color, border: `1px solid ${c.color}30` }}
                                    onClick={() => setCampus(c.id)}
                                >
                                    Switch →
                                </button>
                            </div>
                            <div style={{ ...S.campusOvName, color: c.color }}>{c.name}</div>
                            <div style={S.campusOvLoc}><MapPin size={10} /> {c.location}</div>
                            <div style={S.campusOvStats}>
                                <div style={S.campusOvStat}><span style={{ ...S.campusOvNum, color: c.color }}>{c.students}</span><span>Students</span></div>
                                <div style={S.campusOvStat}><span style={{ ...S.campusOvNum, color: c.color }}>{c.faculty}</span><span>Faculty</span></div>
                                <div style={S.campusOvStat}><span style={{ ...S.campusOvNum, color: c.color }}>{c.depts}</span><span>Depts</span></div>
                            </div>
                            <div style={S.campusOvBarWrap}>
                                <div style={{ ...S.campusOvBar, width: `${c.util}%`, background: c.color }} />
                            </div>
                            <div style={S.campusOvUtil}>Campus utilisation: <strong style={{ color: c.color }}>{c.util}%</strong></div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Academic Reporting Module ── */}
            <div style={S.academicBox}>
                {/* Header */}
                <div style={S.academicHeader}>
                    <div>
                        <div style={S.academicTitle}><BookMarked size={16} style={{ marginRight: 7 }} color="#2563eb" />Academic Reporting Module</div>
                        <div style={S.academicSub}>Detailed performance analytics · Current Academic Year 2026-27</div>
                    </div>
                    <div style={S.academicTabs}>
                        {[
                            { id: 'subject', label: 'Subject-wise' },
                            { id: 'semester', label: 'Semester Trend' },
                            { id: 'grades', label: 'Grade Distribution' },
                        ].map(t => (
                            <button
                                key={t.id}
                                style={{ ...S.academicTab, ...(reportTab === t.id ? S.academicTabActive : {}) }}
                                onClick={() => setReportTab(t.id)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject-wise Performance */}
                {reportTab === 'subject' && (
                    <div style={S.academicContent}>
                        <div style={S.subjectGrid}>
                            {SUBJECT_PERF.map(sub => (
                                <div key={sub.sub} style={S.subjectCard}>
                                    <div style={S.subjectTop}>
                                        <span style={S.subjectName}>{sub.sub}</span>
                                        <span style={{ ...S.subjectPassBadge, color: sub.color, background: `${sub.color}15` }}>
                                            {sub.passRate}% pass
                                        </span>
                                    </div>
                                    <div style={S.subjectBarTrack}>
                                        <div style={{ ...S.subjectBar, width: `${sub.avgMarks}%`, background: sub.color }} />
                                    </div>
                                    <div style={S.subjectMeta}>
                                        Avg marks: <strong style={{ color: sub.color }}>{sub.avgMarks}/100</strong>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Semester Trend */}
                {reportTab === 'semester' && (
                    <div style={S.academicContent}>
                        <div style={S.semGrid}>
                            {SEMESTERS.map((sem, i) => (
                                <div key={sem} style={S.semCard}>
                                    <div style={S.semLabel}>{sem}</div>
                                    <div style={S.semBarWrap}>
                                        <div style={{ ...S.semBar, height: `${SEM_PASS[i]}%`, background: SEM_PASS[i] >= 91 ? '#2563eb' : SEM_PASS[i] >= 89 ? '#059669' : '#d97706' }} />
                                    </div>
                                    <div style={{ ...S.semVal, color: SEM_PASS[i] >= 91 ? '#2563eb' : '#059669' }}>{SEM_PASS[i]}%</div>
                                    <div style={S.semCgpa}>CGPA {SEM_AVG[i]}</div>
                                </div>
                            ))}
                        </div>
                        <div style={S.semLegend}>
                            <span style={{ color: '#2563eb' }}>■</span> ≥91% pass rate &nbsp;
                            <span style={{ color: '#059669' }}>■</span> 89-91% &nbsp;
                            <span style={{ color: '#d97706' }}>■</span> &lt;89%
                        </div>
                    </div>
                )}

                {/* Grade Distribution */}
                {reportTab === 'grades' && (
                    <div style={S.academicContent}>
                        <div style={S.gradeGrid}>
                            {GRADE_DIST.map(g => (
                                <div key={g.grade} style={S.gradeRow}>
                                    <div style={{ ...S.gradeLabel }}>{g.grade}</div>
                                    <div style={S.gradeTrack}>
                                        <div style={{ ...S.gradeBar, width: `${g.pct * 2.5}%`, background: g.color }} />
                                    </div>
                                    <div style={{ ...S.gradeCount, color: g.color }}>{g.count}</div>
                                    <div style={S.gradePct}>{g.pct}%</div>
                                </div>
                            ))}
                        </div>
                        <div style={S.gradeSummary}>
                            Total Assessed: <strong>1,284</strong> &nbsp;·&nbsp;
                            Distinction (O+A+): <strong style={{ color: '#2563eb' }}>411 (32%)</strong> &nbsp;·&nbsp;
                            At Risk (F): <strong style={{ color: '#dc2626' }}>51 (4%)</strong>
                        </div>
                    </div>
                )}

                {/* Report Quick Access */}
                <div style={S.reportsBar}>
                    <span style={S.reportsBarLabel}><FileText size={13} style={{ marginRight: 5 }} />Quick Report Access:</span>
                    {REPORTS.map(r => (
                        <button
                            key={r.title}
                            style={{ ...S.reportChip, background: r.bg, color: r.color, border: `1px solid ${r.color}25` }}
                            onClick={() => navigate(r.to)}
                            onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)';    }}
                        >
                            <r.icon size={12} strokeWidth={2} />
                            {r.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Bottom Grid ── */}
            <div style={S.bottomGrid}>

                {/* Recent Students Table */}
                <div className="card" style={{ flex: '1 1 0', minWidth: 0 }}>
                    <div className="card-header">
                        <div>
                            <h2>Recent Admissions</h2>
                            <p>Latest enrolled students across campuses</p>
                        </div>
                        <button style={S.viewAllBtn} onClick={() => navigate('/students')}>
                            View All <ChevronRight size={13} />
                        </button>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Semester</th>
                                    <th>Campus</th>
                                    <th>CGPA</th>
                                    <th>Status</th>
                                    <th>Fees</th>
                                </tr>
                            </thead>
                            <tbody>
                                {STUDENTS.map(s => (
                                    <tr key={s.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div className="avatar avatar-md" style={{ background: s.avatar }}>{s.name[0]}</div>
                                                <div>
                                                    <div style={{ fontWeight: 600, fontSize: '0.855rem', color: 'var(--text-primary)' }}>{s.name}</div>
                                                    <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: '0.8rem' }}>{s.course}</td>
                                        <td><span className="badge badge-neutral">{s.year}</span></td>
                                        <td>
                                            <span style={campusBadgeStyle(s.campus)}>{s.campus}</span>
                                        </td>
                                        <td><div style={cgpaStyle(s.cgpa)}>{s.cgpa}</div></td>
                                        <td><span className={`badge ${statusBadge(s.status)}`}>{s.status}</span></td>
                                        <td><span className={`badge ${feeBadge(s.fees)}`}>{s.fees}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Column */}
                <div style={S.rightCol}>

                    {/* Top Performers */}
                    <div className="card">
                        <div className="card-header">
                            <div><h2>Top Performers</h2><p>Highest CGPA — all campuses</p></div>
                            <Star size={14} color="#d97706" />
                        </div>
                        <div>
                            {TOP_PERFORMERS.map(p => (
                                <div key={p.name} style={S.perfRow}>
                                    <div style={{ ...S.perfRank, background: p.rank === 1 ? '#fef3c7' : p.rank === 2 ? '#f1f5f9' : '#fff7ed', color: p.rank === 1 ? '#92400e' : p.rank === 2 ? '#475569' : '#9a3412' }}>
                                        #{p.rank}
                                    </div>
                                    <div className="avatar avatar-md" style={{ background: p.avatar }}>{p.name[0]}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.81rem', color: 'var(--text-primary)' }}>{p.name}</div>
                                        <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>{p.course} · {p.campus}</div>
                                    </div>
                                    <div style={S.cgpaBadge}>{p.cgpa}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="card">
                        <div className="card-header">
                            <div><h2>Upcoming Events</h2><p>Next 2 weeks · all campuses</p></div>
                            <Calendar size={14} color="var(--text-muted)" />
                        </div>
                        <div style={{ padding: '4px 0 10px' }}>
                            {EVENTS.map(ev => (
                                <div key={ev.title} style={{ ...S.eventRow, background: ev.bg, borderLeft: `3px solid ${ev.color}` }}>
                                    <div style={{ ...S.eventDate, color: ev.color }}>{ev.date}</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.78rem', color: 'var(--text-primary)' }}>{ev.title}</div>
                                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{ev.dept}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="card">
                        <div className="card-header">
                            <div><h2>Recent Activity</h2><p>Latest system events</p></div>
                        </div>
                        <div>
                            {ACTIVITY.map((a, i) => {
                                const Icon = a.icon;
                                return (
                                    <div key={i} style={S.actRow}>
                                        <div style={{ ...S.actIcon, background: a.bg, color: a.color }}><Icon size={13} /></div>
                                        <div>
                                            <p style={S.actText}>{a.text}</p>
                                            <p style={S.actTime}><Clock size={9} /> {a.time}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function campusBadgeStyle(campus) {
    const map = { Main: ['#2563eb', 'rgba(37,99,235,0.10)'], North: ['#059669', 'rgba(5,150,105,0.10)'], South: ['#7c3aed', 'rgba(124,58,237,0.10)'] };
    const [color, bg] = map[campus] || ['#64748b', '#f1f5f9'];
    return { display: 'inline-block', padding: '2px 9px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600, color, background: bg };
}

/* ═══════════════════════════════════════
   STYLES
═══════════════════════════════════════ */
const S = {
    /* Campus bar */
    campusBar: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '10px 16px', background: 'white', borderRadius: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' },
    campusLeft: { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 },
    campusBarLabel: { fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-muted)', whiteSpace: 'nowrap' },
    campusTabs: { display: 'flex', gap: 4 },
    campusTab: { display: 'flex', alignItems: 'center', gap: 5, padding: '5px 13px', borderRadius: 8, fontSize: '0.76rem', fontWeight: 500, color: 'var(--text-muted)', background: 'transparent', border: '1px solid transparent', cursor: 'pointer', transition: 'all 0.15s' },
    campusTabActive: { background: 'rgba(79,70,229,0.08)', color: '#4f46e5', border: '1px solid rgba(79,70,229,0.22)', fontWeight: 700 },
    campusDot: { width: 6, height: 6, borderRadius: '50%', background: '#4f46e5', display: 'inline-block' },
    campusRight: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 },
    campusAY: { fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' },
    campusSem: { fontSize: '0.72rem', color: 'var(--text-muted)' },

    /* Hero */
    heroGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 14 },
    heroCard: { borderRadius: 16, padding: '20px 22px 16px', position: 'relative', overflow: 'hidden', color: 'white' },
    heroTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
    heroIconBox: { width: 42, height: 42, borderRadius: 11, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', backdropFilter: 'blur(4px)' },
    heroChangePill: { display: 'flex', alignItems: 'center', gap: 3, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)', padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 },
    heroVal: { fontSize: '1.9rem', fontFamily: 'var(--font-display)', fontWeight: 900, lineHeight: 1, marginBottom: 4 },
    heroLbl: { fontSize: '0.76rem', fontWeight: 600, opacity: 0.9, marginBottom: 2 },
    heroSub: { fontSize: '0.66rem', opacity: 0.55 },
    heroShine: { position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', background: 'rgba(255,255,255,0.055)', clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 60% 100%)', pointerEvents: 'none' },

    /* KPI strip */
    kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 11, marginBottom: 14 },
    kpiCard: { borderRadius: 11, padding: '13px 15px', display: 'flex', flexDirection: 'column', gap: 1 },
    kpiIcon: { width: 26, height: 26, borderRadius: 7, display: 'grid', placeItems: 'center', marginBottom: 4 },
    kpiVal: { fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1 },
    kpiLbl: { fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: 3 },
    kpiSub: { fontSize: '0.63rem', color: 'var(--text-muted)' },

    /* Campus Overview */
    campusOvGrid: { display: 'grid', gridTemplateColumns: 'auto 1fr 1fr 1fr', gap: 14, marginBottom: 14, alignItems: 'stretch' },
    campusOvLabel: { display: 'flex', alignItems: 'center', writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)', fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 4px' },
    campusOvCard: { background: 'white', borderRadius: 14, padding: '18px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' },
    campusOvIconBox: { width: 38, height: 38, borderRadius: 10, display: 'grid', placeItems: 'center' },
    campusOvSwitch: { fontSize: '0.68rem', fontWeight: 700, padding: '4px 10px', borderRadius: 7, background: 'transparent', cursor: 'pointer' },
    campusOvName: { fontWeight: 800, fontSize: '0.9rem', fontFamily: 'var(--font-display)', marginBottom: 3 },
    campusOvLoc: { display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 12 },
    campusOvStats: { display: 'flex', gap: 0, marginBottom: 12, borderTop: '1px solid var(--border)', paddingTop: 12 },
    campusOvStat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.62rem', color: 'var(--text-muted)', gap: 2 },
    campusOvNum: { fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 },
    campusOvBarWrap: { height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 5 },
    campusOvBar: { height: '100%', borderRadius: 99, transition: 'width 0.6s ease' },
    campusOvUtil: { fontSize: '0.63rem', color: 'var(--text-muted)' },

    /* Academic Reporting Module */
    academicBox: { background: 'white', borderRadius: 16, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: 16, overflow: 'hidden' },
    academicHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px 14px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(90deg, rgba(79,70,229,0.04) 0%, transparent 60%)' },
    academicTitle: { display: 'flex', alignItems: 'center', fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 },
    academicSub: { fontSize: '0.7rem', color: 'var(--text-muted)', paddingLeft: 23 },
    academicTabs: { display: 'flex', gap: 4, background: 'var(--bg-hover)', borderRadius: 10, padding: 4 },
    academicTab: { padding: '6px 14px', borderRadius: 7, fontSize: '0.74rem', fontWeight: 500, color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.15s' },
    academicTabActive: { background: 'white', color: '#4f46e5', fontWeight: 700, boxShadow: '0 1px 6px rgba(79,70,229,0.12)' },
    academicContent: { padding: '20px 22px' },

    /* Subject performance */
    subjectGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 },
    subjectCard: { padding: '14px', background: 'var(--bg-hover)', borderRadius: 11, border: '1px solid var(--border)' },
    subjectTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    subjectName: { fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' },
    subjectPassBadge: { fontSize: '0.67rem', fontWeight: 700, padding: '2px 8px', borderRadius: 6 },
    subjectBarTrack: { height: 7, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 },
    subjectBar: { height: '100%', borderRadius: 99 },
    subjectMeta: { fontSize: '0.67rem', color: 'var(--text-muted)' },

    /* Semester trend */
    semGrid: { display: 'flex', gap: 14, alignItems: 'flex-end', height: 140 },
    semCard: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%' },
    semLabel: { fontSize: '0.67rem', fontWeight: 600, color: 'var(--text-muted)' },
    semBarWrap: { flex: 1, width: '100%', background: 'var(--border)', borderRadius: 8, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' },
    semBar: { width: '100%', borderRadius: '8px 8px 0 0', transition: 'height 0.6s ease' },
    semVal: { fontSize: '0.8rem', fontWeight: 800 },
    semCgpa: { fontSize: '0.62rem', color: 'var(--text-muted)' },
    semLegend: { marginTop: 12, fontSize: '0.67rem', color: 'var(--text-muted)', display: 'flex', gap: 4, alignItems: 'center' },

    /* Grade distribution */
    gradeGrid: { display: 'flex', flexDirection: 'column', gap: 10 },
    gradeRow: { display: 'grid', gridTemplateColumns: '130px 1fr 60px 46px', alignItems: 'center', gap: 12 },
    gradeLabel: { fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)' },
    gradeTrack: { height: 10, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' },
    gradeBar: { height: '100%', borderRadius: 99 },
    gradeCount: { fontSize: '0.76rem', fontWeight: 700, textAlign: 'right' },
    gradePct: { fontSize: '0.68rem', color: 'var(--text-muted)', textAlign: 'right' },
    gradeSummary: { marginTop: 16, fontSize: '0.72rem', color: 'var(--text-muted)', padding: '10px 14px', background: 'var(--bg-hover)', borderRadius: 8, border: '1px solid var(--border)' },

    /* Reports bar */
    reportsBar: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', padding: '14px 22px', borderTop: '1px solid var(--border)', background: 'var(--bg-hover)' },
    reportsBarLabel: { display: 'flex', alignItems: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap', marginRight: 4 },
    reportChip: { display: 'flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.15s' },

    /* Bottom */
    bottomGrid: { display: 'flex', gap: 16, alignItems: 'flex-start' },
    rightCol: { flex: '0 0 310px', display: 'flex', flexDirection: 'column', gap: 16 },

    /* Table extras */
    viewAllBtn: { display: 'flex', alignItems: 'center', gap: 4, background: 'var(--bg-hover)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 11px', fontSize: '0.76rem', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' },

    /* Top performers */
    perfRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', borderBottom: '1px solid var(--border)' },
    perfRank: { width: 26, height: 26, borderRadius: 7, display: 'grid', placeItems: 'center', fontSize: '0.67rem', fontWeight: 800, flexShrink: 0 },
    cgpaBadge: { background: 'rgba(5,150,105,0.1)', color: '#059669', fontSize: '0.76rem', fontWeight: 800, borderRadius: 8, padding: '3px 9px' },

    /* Events */
    eventRow: { margin: '6px 14px', borderRadius: 9, padding: '9px 13px', display: 'flex', alignItems: 'center', gap: 12 },
    eventDate: { fontSize: '0.66rem', fontWeight: 800, minWidth: 36, textAlign: 'center' },

    /* Activity */
    actRow: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 20px', borderBottom: '1px solid var(--border)' },
    actIcon: { width: 29, height: 29, borderRadius: 8, display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 1 },
    actText: { fontSize: '0.77rem', color: 'var(--text-secondary)', lineHeight: 1.45 },
    actTime: { fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', gap: 4 },
};
