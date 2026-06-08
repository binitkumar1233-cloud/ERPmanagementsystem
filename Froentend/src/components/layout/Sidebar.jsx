import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, GraduationCap, Users, BookOpen,
    ClipboardCheck, CreditCard, BarChart2,
    Settings, HelpCircle, ChevronRight, UserCircle,
    MonitorPlay, ClipboardList, Bus, Home, Package, Shield, UserPlus,
} from 'lucide-react';
import Logo from '../common/Logo.jsx';

const NAV = [
    { label: 'Dashboard',  icon: LayoutDashboard, to: '/dashboard'  },
    { label: 'Students',   icon: GraduationCap,   to: '/students'   },
    { label: 'Teachers',   icon: Users,            to: '/teachers'   },
    { label: 'Courses',    icon: BookOpen,         to: '/courses'    },
    { label: 'Attendance', icon: ClipboardCheck,   to: '/attendance' },
    { label: 'Fees',       icon: CreditCard,       to: '/fees'       },
    { label: 'Results',    icon: BarChart2,        to: '/results'    },
];

const ADMISSIONS = [
    { label: 'Admissions', icon: UserPlus, to: '/admissions' },
];

const ELEARNING = [
    { label: 'LMS',               icon: MonitorPlay,   to: '/lms'              },
    { label: 'Exam Management',   icon: ClipboardList, to: '/exam-management'  },
];

const CAMPUS = [
    { label: 'Transport',  icon: Bus,     to: '/transport' },
    { label: 'Hostel',     icon: Home,    to: '/hostel'    },
    { label: 'Inventory',  icon: Package, to: '/inventory' },
];

const STUDENT_PORTAL = { label: 'Student Portal', icon: UserCircle, to: '/student-login' };
const ADMIN_PANEL    = { label: 'Admin Panel',    icon: Shield,     to: '/admin-panel'  };

export default function Sidebar() {
    return (
        <aside style={styles.sidebar}>
            {/* ── Brand ── */}
            <div style={styles.brand}>
                <Logo variant="icon" size="sm" />
                <div>
                    <div style={styles.brandName}>EduManage</div>
                    <div style={styles.brandTag}>School &amp; College ERP</div>
                </div>
            </div>

            {/* ── Navigation ── */}
            <div style={styles.navWrap}>
                <p style={styles.sectionLabel}>Main Navigation</p>
                <nav>
                    {NAV.map(({ label, icon: Icon, to }) => (
                        <NavLink
                            key={to}
                            to={to}
                            style={({ isActive }) => ({
                                ...styles.link,
                                ...(isActive ? styles.linkActive : {}),
                            })}
                        >
                            <span style={styles.linkIcon}>
                                <Icon size={17} strokeWidth={2} />
                            </span>
                            <span style={styles.linkLabel}>{label}</span>
                            <ChevronRight size={13} style={styles.chevron} />
                        </NavLink>
                    ))}
                </nav>

                {/* ── Admissions & Onboarding ── */}
                <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Admissions & Onboarding</p>
                <nav>
                    {ADMISSIONS.map(({ label, icon: Icon, to }) => (
                        <NavLink
                            key={to}
                            to={to}
                            style={({ isActive }) => ({
                                ...styles.link,
                                ...styles.admLink,
                                ...(isActive ? styles.admLinkActive : {}),
                            })}
                        >
                            <span style={{ ...styles.linkIcon, ...styles.admIcon }}>
                                <Icon size={17} strokeWidth={2} />
                            </span>
                            <span style={styles.linkLabel}>{label}</span>
                            <ChevronRight size={13} style={styles.chevron} />
                        </NavLink>
                    ))}
                </nav>

                {/* ── E-Learning & Assessments ── */}
                <p style={{ ...styles.sectionLabel, marginTop: 20 }}>E-Learning & Assessments</p>
                <nav>
                    {ELEARNING.map(({ label, icon: Icon, to }) => (
                        <NavLink
                            key={to}
                            to={to}
                            style={({ isActive }) => ({
                                ...styles.link,
                                ...styles.eLink,
                                ...(isActive ? styles.eLinkActive : {}),
                            })}
                        >
                            <span style={{ ...styles.linkIcon, ...styles.eLinkIcon }}>
                                <Icon size={17} strokeWidth={2} />
                            </span>
                            <span style={styles.linkLabel}>{label}</span>
                            <ChevronRight size={13} style={styles.chevron} />
                        </NavLink>
                    ))}
                </nav>

                {/* ── Campus Services ── */}
                <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Campus Services</p>
                <nav>
                    {CAMPUS.map(({ label, icon: Icon, to }) => (
                        <NavLink
                            key={to}
                            to={to}
                            style={({ isActive }) => ({
                                ...styles.link,
                                ...styles.campusLink,
                                ...(isActive ? styles.campusLinkActive : {}),
                            })}
                        >
                            <span style={{ ...styles.linkIcon, ...styles.campusIcon }}>
                                <Icon size={17} strokeWidth={2} />
                            </span>
                            <span style={styles.linkLabel}>{label}</span>
                            <ChevronRight size={13} style={styles.chevron} />
                        </NavLink>
                    ))}
                </nav>

                {/* ── Admin Panel ── */}
                <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Administration</p>
                <NavLink
                    to={ADMIN_PANEL.to}
                    style={({ isActive }) => ({
                        ...styles.link,
                        ...styles.adminLink,
                        ...(isActive ? styles.adminLinkActive : {}),
                    })}
                >
                    <span style={{ ...styles.linkIcon, ...styles.adminIcon }}>
                        <Shield size={17} strokeWidth={2} />
                    </span>
                    <span style={styles.linkLabel}>{ADMIN_PANEL.label}</span>
                    <ChevronRight size={13} style={styles.chevron} />
                </NavLink>

                {/* ── Student Portal ── */}
                <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Student Access</p>
                <NavLink
                    to={STUDENT_PORTAL.to}
                    style={({ isActive }) => ({
                        ...styles.link,
                        ...styles.portalLink,
                        ...(isActive ? styles.portalLinkActive : {}),
                    })}
                >
                    <span style={{ ...styles.linkIcon, ...styles.portalIcon }}>
                        <UserCircle size={17} strokeWidth={2} />
                    </span>
                    <span style={styles.linkLabel}>{STUDENT_PORTAL.label}</span>
                    <ChevronRight size={13} style={styles.chevron} />
                </NavLink>
            </div>

            {/* ── Bottom ── */}
            <div style={styles.bottom}>
                <div style={styles.bottomBtnGroup}>
                    <NavLink to="/settings" style={({ isActive }) => ({ ...styles.bottomBtn, ...(isActive ? styles.bottomBtnActive : {}) })}>
                        <span style={styles.bottomBtnIcon}>
                            <Settings size={14} />
                        </span>
                        <span style={styles.bottomBtnLabel}>Settings</span>
                    </NavLink>
                    <NavLink to="/support" style={({ isActive }) => ({ ...styles.bottomBtn, ...(isActive ? styles.bottomBtnActive : {}) })}>
                        <span style={styles.bottomBtnIcon}>
                            <HelpCircle size={14} />
                        </span>
                        <span style={styles.bottomBtnLabel}>Help & Support</span>
                    </NavLink>
                </div>
                <p style={styles.support}>Live support: +91 98765 43210</p>
                <p style={styles.version}>v2.0.0 · Academic Year 2026–27</p>

                {/* ── Copyright ── */}
                <div style={styles.copyright}>
                    <div style={styles.copyrightDivider} />
                    <p style={styles.copyrightText}>© 2026 Binit Software Solution</p>
                    <p style={styles.copyrightSub}>All Rights Reserved</p>
                </div>
            </div>
        </aside>
    );
}

const styles = {
    sidebar: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: 'var(--sidebar-width)',
        height: '100vh',
        background: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflowY: 'auto',
        borderRight: '1px solid rgba(255,255,255,0.04)',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '22px 18px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    logoBox: {
        width: 38,
        height: 38,
        borderRadius: 10,
        background: 'var(--primary)',
        color: 'white',
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
        boxShadow: '0 2px 10px rgba(30,64,175,0.5)',
    },
    brandName: {
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        fontWeight: 800,
        color: 'white',
        lineHeight: 1,
    },
    brandTag: {
        fontSize: '0.63rem',
        color: 'rgba(255,255,255,0.35)',
        marginTop: 3,
        letterSpacing: '0.04em',
    },
    navWrap: {
        flex: 1,
        padding: '18px 10px 10px',
    },
    sectionLabel: {
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        padding: '0 10px 10px',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.5)',
        fontSize: '0.85rem',
        fontWeight: 500,
        transition: 'all 0.18s ease',
        textDecoration: 'none',
        marginBottom: 2,
        position: 'relative',
    },
    linkActive: {
        background: 'rgba(30,64,175,0.35)',
        color: 'white',
        fontWeight: 600,
        border: '1px solid rgba(30,64,175,0.4)',
    },
    linkIcon: {
        width: 32,
        height: 32,
        borderRadius: 7,
        display: 'grid',
        placeItems: 'center',
        flexShrink: 0,
    },
    linkLabel: { flex: 1 },
    chevron: { opacity: 0.4 },
    admLink: {
        background: 'rgba(245, 158, 11, 0.07)',
        color: 'rgba(253, 230, 138, 0.9)',
        border: '1px solid rgba(245, 158, 11, 0.18)',
        marginTop: 2,
    },
    admLinkActive: {
        background: 'rgba(245, 158, 11, 0.22)',
        color: '#fde68a',
        border: '1px solid rgba(245, 158, 11, 0.45)',
        fontWeight: 600,
    },
    admIcon: {
        color: '#fbbf24',
    },
    eLink: {
        background: 'rgba(124, 58, 237, 0.06)',
        color: 'rgba(196, 181, 253, 0.85)',
        border: '1px solid rgba(124, 58, 237, 0.15)',
        marginTop: 2,
    },
    eLinkActive: {
        background: 'rgba(124, 58, 237, 0.25)',
        color: '#c4b5fd',
        border: '1px solid rgba(124, 58, 237, 0.45)',
        fontWeight: 600,
    },
    eLinkIcon: {
        color: '#a78bfa',
    },
    campusLink: {
        background: 'rgba(14, 165, 233, 0.07)',
        color: 'rgba(125, 211, 252, 0.85)',
        border: '1px solid rgba(14, 165, 233, 0.18)',
        marginTop: 2,
    },
    campusLinkActive: {
        background: 'rgba(14, 165, 233, 0.22)',
        color: '#7dd3fc',
        border: '1px solid rgba(14, 165, 233, 0.45)',
        fontWeight: 600,
    },
    campusIcon: {
        color: '#38bdf8',
    },
    adminLink: {
        background: 'rgba(220, 38, 38, 0.07)',
        color: 'rgba(252, 165, 165, 0.9)',
        border: '1px solid rgba(220, 38, 38, 0.18)',
        marginTop: 2,
    },
    adminLinkActive: {
        background: 'rgba(220, 38, 38, 0.22)',
        color: '#fca5a5',
        border: '1px solid rgba(220, 38, 38, 0.45)',
        fontWeight: 600,
    },
    adminIcon: {
        color: '#f87171',
    },
    portalLink: {
        background: 'rgba(16, 185, 129, 0.08)',
        color: 'rgba(52, 211, 153, 0.85)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        marginTop: 4,
    },
    portalLinkActive: {
        background: 'rgba(16, 185, 129, 0.22)',
        color: '#34d399',
        border: '1px solid rgba(16, 185, 129, 0.45)',
        fontWeight: 600,
    },
    portalIcon: {
        color: '#34d399',
    },
    bottom: {
        padding: '10px 10px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    bottomBtnGroup: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 6,
        marginBottom: 6,
    },
    bottomBtn: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: '10px 6px',
        borderRadius: 10,
        color: 'rgba(255,255,255,0.4)',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'all 0.18s ease',
    },
    bottomBtnActive: {
        background: 'rgba(30,64,175,0.3)',
        border: '1px solid rgba(30,64,175,0.45)',
        color: 'white',
    },
    bottomBtnIcon: {
        width: 30,
        height: 30,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.08)',
        display: 'grid',
        placeItems: 'center',
    },
    bottomBtnLabel: {
        fontSize: '0.65rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: 1,
    },
    support: {
        fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.45)',
        padding: '4px 12px',
        marginTop: 8,
        lineHeight: 1.4,
    },
    version: {
        fontSize: '0.62rem',
        color: 'rgba(255,255,255,0.2)',
        padding: '6px 12px 0',
        letterSpacing: '0.03em',
    },
    copyright: {
        marginTop: 10,
        textAlign: 'center',
    },
    copyrightDivider: {
        height: 1,
        background: 'rgba(255,255,255,0.07)',
        marginBottom: 8,
    },
    copyrightText: {
        fontSize: '0.65rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.28)',
        letterSpacing: '0.04em',
        margin: 0,
        lineHeight: 1.6,
    },
    copyrightSub: {
        fontSize: '0.58rem',
        color: 'rgba(255,255,255,0.15)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        margin: '2px 0 0',
    },
};