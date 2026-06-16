import { useState, useEffect } from 'react';
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

function NavItem({ label, icon: Icon, to, collapsed, accent = null, onNavClick }) {
    return (
        <NavLink
            to={to}
            title={collapsed ? label : undefined}
            onClick={onNavClick}
            style={({ isActive }) => ({
                ...styles.link,
                ...(collapsed ? styles.linkCollapsed : {}),
                ...(isActive
                    ? {
                        background: accent
                            ? `${accent}22`
                            : 'rgba(99, 102, 241, 0.15)',
                        color: accent || '#a5b4fc',
                        fontWeight: 700,
                        borderLeft: `3px solid ${accent || '#6366f1'}`,
                        paddingLeft: collapsed ? undefined : '9px',
                    }
                    : {}),
            })}
        >
            <span style={{
                ...styles.linkIcon,
                ...(collapsed ? styles.linkIconCollapsed : {}),
            }}>
                <Icon size={17} strokeWidth={2} />
            </span>
            {!collapsed && <span style={styles.linkLabel}>{label}</span>}
            {!collapsed && <ChevronRight size={12} style={styles.chevron} />}
        </NavLink>
    );
}

function SectionLabel({ label, collapsed }) {
    if (collapsed) return <div style={styles.collapsedDivider} />;
    return <p style={styles.sectionLabel}>{label}</p>;
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        document.documentElement.style.setProperty('--sidebar-width', collapsed ? '64px' : '260px');
    }, [collapsed]);

    useEffect(() => {
        const onToggle = () => setMobileOpen(v => !v);
        window.addEventListener('toggle-mobile-sidebar', onToggle);
        return () => window.removeEventListener('toggle-mobile-sidebar', onToggle);
    }, []);

    const closeMobile = () => setMobileOpen(false);

    return (
        <>
            {mobileOpen && (
                <div className="sidebar-mobile-overlay" onClick={closeMobile} />
            )}

            <style>{`
                .sidebar-transition { transition: width 0.24s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1); }
                .sb-link:hover { background: rgba(255,255,255,0.06) !important; color: rgba(255,255,255,0.9) !important; }
                .sidebar-transition::-webkit-scrollbar { width: 3px; }
                .sidebar-transition::-webkit-scrollbar-thumb { background: rgba(79,70,229,0.3); border-radius: 99px; }
                @media (max-width: 1024px) {
                    :root { --sidebar-width: 0px !important; }
                    .sidebar-transition { transform: translateX(-100%); width: 260px !important; }
                    .sidebar-transition.sidebar--mobile-open { transform: translateX(0); box-shadow: 4px 0 32px rgba(0,0,0,0.35); }
                }
            `}</style>

            <aside
                style={{ ...styles.sidebar, width: collapsed ? 64 : 260 }}
                className={`sidebar-transition${mobileOpen ? ' sidebar--mobile-open' : ''}`}
            >
                {/* ── Brand ── */}
                <div style={{
                    ...styles.brand,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    padding: collapsed ? '18px 0' : '20px 18px 16px',
                }}>
                    <div style={styles.logoWrap}>
                        <Logo variant="icon" size="sm" />
                    </div>
                    {!collapsed && (
                        <div>
                            <div style={styles.brandName}>EduManage</div>
                            <div style={styles.brandTag}>School &amp; College ERP</div>
                        </div>
                    )}
                </div>

                {/* ── Collapse toggle ── */}
                <button
                    style={{
                        ...styles.collapseBtn,
                        justifyContent: collapsed ? 'center' : 'flex-end',
                    }}
                    onClick={() => setCollapsed(v => !v)}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed
                        ? <PanelLeftOpen size={15} color="rgba(255,255,255,0.4)" />
                        : (
                            <>
                                <span style={styles.collapseBtnLabel}>Collapse</span>
                                <PanelLeftClose size={15} color="rgba(255,255,255,0.4)" />
                            </>
                        )
                    }
                </button>

                {/* ── Navigation ── */}
                <div style={{ ...styles.navWrap, padding: collapsed ? '14px 6px 10px' : '16px 10px 10px' }}>

                    <SectionLabel label="Main Navigation" collapsed={collapsed} />
                    <nav>
                        {NAV.map(item => (
                            <NavItem key={item.to} {...item} collapsed={collapsed} onNavClick={closeMobile} />
                        ))}
                    </nav>

                    <SectionLabel label="Admissions & Onboarding" collapsed={collapsed} />
                    <nav>
                        {ADMISSIONS.map(item => (
                            <NavItem key={item.to} {...item} collapsed={collapsed} accent="#f59e0b" onNavClick={closeMobile} />
                        ))}
                    </nav>

                    <SectionLabel label="E-Learning & Assessments" collapsed={collapsed} />
                    <nav>
                        {ELEARNING.map(item => (
                            <NavItem key={item.to} {...item} collapsed={collapsed} accent="#8b5cf6" onNavClick={closeMobile} />
                        ))}
                    </nav>

                    <SectionLabel label="Campus Services" collapsed={collapsed} />
                    <nav>
                        {CAMPUS.map(item => (
                            <NavItem key={item.to} {...item} collapsed={collapsed} accent="#06b6d4" onNavClick={closeMobile} />
                        ))}
                    </nav>

                    <SectionLabel label="Administration" collapsed={collapsed} />
                    <NavItem {...ADMIN_PANEL} collapsed={collapsed} accent="#ef4444" onNavClick={closeMobile} />

                    <SectionLabel label="Student Access" collapsed={collapsed} />
                    <NavItem {...STUDENT_PORTAL} collapsed={collapsed} accent="#10b981" onNavClick={closeMobile} />
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
                                <span style={styles.bottomBtnLabel}>Help &amp; Support</span>
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
        background: 'linear-gradient(160deg, #111827 0%, #0d1321 40%, #080d1a 100%)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflowY: 'auto',
        overflowX: 'hidden',
        borderRight: '1px solid rgba(79,70,229,0.12)',
    },
    brand: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(135deg, rgba(79,70,229,0.16) 0%, rgba(99,102,241,0.05) 60%, transparent 100%)',
    },
    logoWrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    brandName: {
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        fontWeight: 800,
        color: 'white',
        lineHeight: 1,
        letterSpacing: '-0.01em',
    },
    brandTag: {
        fontSize: '0.62rem',
        color: 'rgba(255,255,255,0.32)',
        marginTop: 4,
        letterSpacing: '0.04em',
    },
    collapseBtn: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        width: '100%',
        padding: '6px 14px',
        background: 'transparent',
        border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        cursor: 'pointer',
        transition: 'background 0.15s',
    },
    collapseBtnLabel: {
        fontSize: '0.62rem',
        color: 'rgba(255,255,255,0.28)',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        flex: 1,
        textAlign: 'right',
        paddingRight: 4,
    },
    navWrap: {
        flex: 1,
    },
    sectionLabel: {
        fontSize: '0.6rem',
        fontWeight: 800,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.22)',
        padding: '14px 12px 6px',
    },
    collapsedDivider: {
        height: 1,
        background: 'rgba(255,255,255,0.06)',
        margin: '8px 8px',
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 10,
        color: 'rgba(255,255,255,0.46)',
        fontSize: '0.83rem',
        fontWeight: 500,
        transition: 'all 0.17s ease',
        textDecoration: 'none',
        marginBottom: 2,
        position: 'relative',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        borderLeft: '3px solid transparent',
        letterSpacing: '0.01em',
    },
    linkCollapsed: {
        padding: '9px 0',
        justifyContent: 'center',
        gap: 0,
        borderRadius: 8,
        borderLeft: 'none',
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
    chevron: { opacity: 0.3, flexShrink: 0 },

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
        color: 'rgba(255,255,255,0.38)',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
        textAlign: 'center',
        textDecoration: 'none',
        transition: 'all 0.18s ease',
    },
    bottomBtnActive: {
        background: 'rgba(79,70,229,0.22)',
        border: '1px solid rgba(99,102,241,0.4)',
        color: '#a5b4fc',
    },
    bottomBtnIcon: {
        width: 30,
        height: 30,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.07)',
        display: 'grid',
        placeItems: 'center',
    },
    bottomBtnLabel: {
        fontSize: '0.63rem',
        fontWeight: 600,
        letterSpacing: '0.02em',
        lineHeight: 1,
    },
    support: {
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.38)',
        padding: '4px 12px',
        marginTop: 8,
        lineHeight: 1.4,
    },
    version: {
        fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.18)',
        padding: '6px 12px 0',
        letterSpacing: '0.03em',
    },
    copyright: {
        marginTop: 10,
        textAlign: 'center',
    },
    copyrightDivider: {
        height: 1,
        background: 'rgba(255,255,255,0.06)',
        marginBottom: 8,
    },
    copyrightText: {
        fontSize: '0.63rem',
        fontWeight: 700,
        color: 'rgba(255,255,255,0.22)',
        letterSpacing: '0.04em',
        margin: 0,
        lineHeight: 1.6,
    },
    copyrightSub: {
        fontSize: '0.56rem',
        color: 'rgba(255,255,255,0.12)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        margin: '2px 0 0',
    },
};
