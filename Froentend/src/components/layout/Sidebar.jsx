import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, GraduationCap, Users, BookOpen,
    ClipboardCheck, CreditCard, BarChart2,
    Settings, HelpCircle, ChevronRight, UserCircle,
    MonitorPlay, ClipboardList, Bus, Home, Package, Shield, UserPlus,
    PanelLeftClose, PanelLeftOpen,
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
    { label: 'LMS',             icon: MonitorPlay,   to: '/lms'             },
    { label: 'Exam Management', icon: ClipboardList, to: '/exam-management' },
];

const CAMPUS = [
    { label: 'Transport', icon: Bus,     to: '/transport' },
    { label: 'Hostel',    icon: Home,    to: '/hostel'    },
    { label: 'Inventory', icon: Package, to: '/inventory' },
];

const STUDENT_PORTAL = { label: 'Student Portal', icon: UserCircle, to: '/student-login' };
const ADMIN_PANEL    = { label: 'Admin Panel',    icon: Shield,     to: '/admin-panel'  };

function NavItem({ label, icon: Icon, to, collapsed, extra = {}, activeExtra = {} }) {
    return (
        <NavLink
            key={to}
            to={to}
            title={collapsed ? label : undefined}
            style={({ isActive }) => ({
                ...styles.link,
                ...extra,
                ...(isActive ? { ...styles.linkActive, ...activeExtra } : {}),
                ...(collapsed ? styles.linkCollapsed : {}),
            })}
        >
            <span style={{ ...styles.linkIcon, ...(collapsed ? styles.linkIconCollapsed : {}) }}>
                <Icon size={17} strokeWidth={2} />
            </span>
            {!collapsed && <span style={styles.linkLabel}>{label}</span>}
            {!collapsed && <ChevronRight size={13} style={styles.chevron} />}
        </NavLink>
    );
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* CSS variable injection for layout shift */}
            <style>{`
                :root {
                    --sidebar-width: ${collapsed ? '64px' : '260px'};
                }
                .sidebar-transition {
                    transition: width 0.22s cubic-bezier(0.4,0,0.2,1);
                }
            `}</style>

            <aside style={{ ...styles.sidebar, width: collapsed ? 64 : 260 }} className="sidebar-transition">

                {/* ── Brand ── */}
                <div style={{ ...styles.brand, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '18px 0' : '22px 18px 18px' }}>
                    <Logo variant="icon" size="sm" />
                    {!collapsed && (
                        <div>
                            <div style={styles.brandName}>EduManage</div>
                            <div style={styles.brandTag}>School &amp; College ERP</div>
                        </div>
                    )}
                </div>

                {/* ── Collapse toggle ── */}
                <button
                    style={{ ...styles.collapseBtn, justifyContent: collapsed ? 'center' : 'flex-end' }}
                    onClick={() => setCollapsed(v => !v)}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed
                        ? <PanelLeftOpen size={15} color="rgba(255,255,255,0.45)" />
                        : <><span style={styles.collapseBtnLabel}>Collapse</span><PanelLeftClose size={15} color="rgba(255,255,255,0.45)" /></>
                    }
                </button>

                {/* ── Navigation ── */}
                <div style={{ ...styles.navWrap, padding: collapsed ? '14px 6px 10px' : '18px 10px 10px' }}>
                    {!collapsed && <p style={styles.sectionLabel}>Main Navigation</p>}
                    <nav>
                        {NAV.map(item => <NavItem key={item.to} {...item} collapsed={collapsed} />)}
                    </nav>

                    {!collapsed && <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Admissions & Onboarding</p>}
                    {collapsed && <div style={styles.collapsedDivider} />}
                    <nav>
                        {ADMISSIONS.map(item => (
                            <NavItem key={item.to} {...item} collapsed={collapsed}
                                extra={styles.admLink} activeExtra={styles.admLinkActive} />
                        ))}
                    </nav>

                    {!collapsed && <p style={{ ...styles.sectionLabel, marginTop: 20 }}>E-Learning & Assessments</p>}
                    {collapsed && <div style={styles.collapsedDivider} />}
                    <nav>
                        {ELEARNING.map(item => (
                            <NavItem key={item.to} {...item} collapsed={collapsed}
                                extra={styles.eLink} activeExtra={styles.eLinkActive} />
                        ))}
                    </nav>

                    {!collapsed && <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Campus Services</p>}
                    {collapsed && <div style={styles.collapsedDivider} />}
                    <nav>
                        {CAMPUS.map(item => (
                            <NavItem key={item.to} {...item} collapsed={collapsed}
                                extra={styles.campusLink} activeExtra={styles.campusLinkActive} />
                        ))}
                    </nav>

                    {!collapsed && <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Administration</p>}
                    {collapsed && <div style={styles.collapsedDivider} />}
                    <NavItem {...ADMIN_PANEL} collapsed={collapsed}
                        extra={styles.adminLink} activeExtra={styles.adminLinkActive} />

                    {!collapsed && <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Student Access</p>}
                    {collapsed && <div style={styles.collapsedDivider} />}
                    <NavItem {...STUDENT_PORTAL} collapsed={collapsed}
                        extra={styles.portalLink} activeExtra={styles.portalLinkActive} />
                </div>

                {/* ── Bottom ── */}
                {!collapsed ? (
                    <div style={styles.bottom}>
                        <div style={styles.bottomBtnGroup}>
                            <NavLink to="/settings" style={({ isActive }) => ({ ...styles.bottomBtn, ...(isActive ? styles.bottomBtnActive : {}) })}>
                                <span style={styles.bottomBtnIcon}><Settings size={14} /></span>
                                <span style={styles.bottomBtnLabel}>Settings</span>
                            </NavLink>
                            <NavLink to="/support" style={({ isActive }) => ({ ...styles.bottomBtn, ...(isActive ? styles.bottomBtnActive : {}) })}>
                                <span style={styles.bottomBtnIcon}><HelpCircle size={14} /></span>
                                <span style={styles.bottomBtnLabel}>Help & Support</span>
                            </NavLink>
                        </div>
                        <p style={styles.support}>Live support: +91 98765 43210</p>
                        <p style={styles.version}>v2.0.0 · Academic Year 2026–27</p>
                        <div style={styles.copyright}>
                            <div style={styles.copyrightDivider} />
                            <p style={styles.copyrightText}>© 2026 Binit Software Solution</p>
                            <p style={styles.copyrightSub}>All Rights Reserved</p>
                        </div>
                    </div>
                ) : (
                    <div style={styles.collapsedBottom}>
                        <NavLink to="/settings" title="Settings" style={({ isActive }) => ({ ...styles.collapsedBottomBtn, ...(isActive ? styles.bottomBtnActive : {}) })}>
                            <Settings size={15} />
                        </NavLink>
                        <NavLink to="/support" title="Help & Support" style={({ isActive }) => ({ ...styles.collapsedBottomBtn, ...(isActive ? styles.bottomBtnActive : {}) })}>
                            <HelpCircle size={15} />
                        </NavLink>
                    </div>
                )}
            </aside>
        </>
    );
}

const styles = {
    sidebar: {
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        background: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: '1px solid rgba(255,255,255,0.04)',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
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
    collapseBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        width: '100%',
        padding: '7px 14px',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        cursor: 'pointer',
        transition: 'background 0.15s',
    },
    collapseBtnLabel: {
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        flex: 1,
        textAlign: 'right',
        paddingRight: 4,
    },
    navWrap: {
        flex: 1,
    },
    sectionLabel: {
        fontSize: '0.62rem',
        fontWeight: 700,
        letterSpacing: '0.10em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        padding: '0 10px 10px',
    },
    collapsedDivider: {
        height: 1,
        background: 'rgba(255,255,255,0.06)',
        margin: '6px 8px',
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
        whiteSpace: 'nowrap',
        overflow: 'hidden',
    },
    linkCollapsed: {
        padding: '9px 0',
        justifyContent: 'center',
        gap: 0,
        borderRadius: 8,
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
    linkIconCollapsed: {
        width: 36,
        height: 36,
        borderRadius: 9,
    },
    linkLabel: { flex: 1 },
    chevron: { opacity: 0.4 },

    admLink:       { background: 'rgba(245,158,11,0.07)',  color: 'rgba(253,230,138,0.9)',  border: '1px solid rgba(245,158,11,0.18)', marginTop: 2 },
    admLinkActive: { background: 'rgba(245,158,11,0.22)',  color: '#fde68a',                border: '1px solid rgba(245,158,11,0.45)', fontWeight: 600 },
    eLink:         { background: 'rgba(124,58,237,0.06)',  color: 'rgba(196,181,253,0.85)', border: '1px solid rgba(124,58,237,0.15)', marginTop: 2 },
    eLinkActive:   { background: 'rgba(124,58,237,0.25)',  color: '#c4b5fd',                border: '1px solid rgba(124,58,237,0.45)', fontWeight: 600 },
    campusLink:    { background: 'rgba(14,165,233,0.07)',  color: 'rgba(125,211,252,0.85)', border: '1px solid rgba(14,165,233,0.18)', marginTop: 2 },
    campusLinkActive:{ background:'rgba(14,165,233,0.22)', color: '#7dd3fc',                border: '1px solid rgba(14,165,233,0.45)', fontWeight: 600 },
    adminLink:     { background: 'rgba(220,38,38,0.07)',   color: 'rgba(252,165,165,0.9)',  border: '1px solid rgba(220,38,38,0.18)', marginTop: 2 },
    adminLinkActive:{ background:'rgba(220,38,38,0.22)',   color: '#fca5a5',                border: '1px solid rgba(220,38,38,0.45)', fontWeight: 600 },
    portalLink:    { background: 'rgba(16,185,129,0.08)',  color: 'rgba(52,211,153,0.85)',  border: '1px solid rgba(16,185,129,0.2)',  marginTop: 4 },
    portalLinkActive:{ background:'rgba(16,185,129,0.22)', color: '#34d399',                border: '1px solid rgba(16,185,129,0.45)', fontWeight: 600 },

    bottom: {
        padding: '10px 10px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    collapsedBottom: {
        padding: '10px 6px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
    },
    collapsedBottomBtn: {
        width: 36,
        height: 36,
        borderRadius: 9,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.07)',
        display: 'grid',
        placeItems: 'center',
        color: 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        transition: 'all 0.15s',
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
