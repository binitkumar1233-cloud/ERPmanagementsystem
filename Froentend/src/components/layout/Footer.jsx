import { NavLink } from 'react-router-dom';
import {
    Mail, Phone, MapPin, Globe,
    GraduationCap, Users, BookOpen, CreditCard,
    BarChart2, ClipboardCheck, Shield, HelpCircle,
    Github, Twitter, Linkedin,
} from 'lucide-react';
import Logo from '../common/Logo.jsx';

const QUICK_LINKS = [
    { label: 'Dashboard',  to: '/dashboard',   icon: GraduationCap },
    { label: 'Students',   to: '/students',    icon: Users         },
    { label: 'Teachers',   to: '/teachers',    icon: BookOpen      },
    { label: 'Fees',       to: '/fees',        icon: CreditCard    },
    { label: 'Results',    to: '/results',     icon: BarChart2     },
    { label: 'Attendance', to: '/attendance',  icon: ClipboardCheck},
];

const ADMIN_LINKS = [
    { label: 'Admin Panel', to: '/admin-panel' },
    { label: 'Settings',    to: '/settings'    },
    { label: 'Help & Support', to: '/support'  },
    { label: 'Admissions',  to: '/admissions'  },
    { label: 'LMS',         to: '/lms'         },
    { label: 'Exam Management', to: '/exam-management' },
];

const CONTACT = [
    { icon: Phone,  label: '+91 98765 43210'        },
    { icon: Mail,   label: 'support@edumanage.in'   },
    { icon: MapPin, label: 'Patna, Bihar, India'    },
    { icon: Globe,  label: 'www.edumanage.in'       },
];

const SOCIALS = [
    { icon: Github,   href: '#', label: 'GitHub'   },
    { icon: Twitter,  href: '#', label: 'Twitter'  },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer style={S.footer}>
            <style>{`
                .footer-link:hover { color: #a5b4fc !important; }
                .footer-social:hover { background: rgba(99,102,241,0.22) !important; border-color: rgba(99,102,241,0.5) !important; color: #a5b4fc !important; }
                .footer-col-title { font-size: 0.68rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 14px; }
            `}</style>

            {/* ── Top bar ── */}
            <div style={S.topBar}>
                <div style={S.topBarInner}>
                    <div style={S.brandBlock}>
                        <div style={S.logoWrap}><Logo variant="icon" size="sm" /></div>
                        <div>
                            <div style={S.brandName}>EduManage</div>
                            <div style={S.brandSub}>School &amp; College ERP</div>
                        </div>
                    </div>
                    <p style={S.tagline}>
                        A complete academic management platform — built for institutions that move fast.
                    </p>
                </div>
            </div>

            {/* ── Main grid ── */}
            <div style={S.grid}>

                {/* Quick links */}
                <div>
                    <p className="footer-col-title">Quick Access</p>
                    <div style={S.linkList}>
                        {QUICK_LINKS.map(({ label, to, icon: Icon }) => (
                            <NavLink key={to} to={to} style={S.link} className="footer-link">
                                <Icon size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
                                {label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Admin / modules */}
                <div>
                    <p className="footer-col-title">Modules</p>
                    <div style={S.linkList}>
                        {ADMIN_LINKS.map(({ label, to }) => (
                            <NavLink key={to} to={to} style={S.link} className="footer-link">
                                {label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <p className="footer-col-title">Contact</p>
                    <div style={S.linkList}>
                        {CONTACT.map(({ icon: Icon, label }) => (
                            <div key={label} style={S.contactRow}>
                                <Icon size={13} style={{ opacity: 0.55, flexShrink: 0 }} />
                                <span style={S.contactText}>{label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* About / socials */}
                <div>
                    <p className="footer-col-title">About</p>
                    <p style={S.aboutText}>
                        EduManage is developed by <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Binit Software Solution</strong> to streamline administration, academics, and student services in a single unified platform.
                    </p>
                    <div style={S.socials}>
                        {SOCIALS.map(({ icon: Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                title={label}
                                style={S.social}
                                className="footer-social"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Icon size={14} />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div style={S.bottomBar}>
                <p style={S.copyright}>© {year} Binit Software Solution. All rights reserved.</p>
                <div style={S.bottomRight}>
                    <span style={S.badge}>v2.0.0</span>
                    <span style={S.badge}>Academic Year 2026–27</span>
                    <NavLink to="/support" style={S.bottomLink} className="footer-link">
                        <HelpCircle size={12} />
                        Support
                    </NavLink>
                    <NavLink to="/admin-panel" style={S.bottomLink} className="footer-link">
                        <Shield size={12} />
                        Admin
                    </NavLink>
                </div>
            </div>
        </footer>
    );
}

const S = {
    footer: {
        background: 'linear-gradient(160deg, #0d1321 0%, #111827 50%, #080d1a 100%)',
        borderTop: '1px solid rgba(79,70,229,0.15)',
        marginLeft: 'var(--sidebar-width)',
        transition: 'margin-left 0.24s cubic-bezier(0.4,0,0.2,1)',
        fontFamily: 'var(--font-body)',
    },
    topBar: {
        background: 'linear-gradient(135deg, rgba(79,70,229,0.14) 0%, rgba(99,102,241,0.06) 50%, transparent 100%)',
        borderBottom: '1px solid rgba(99,102,241,0.1)',
        padding: '28px 40px',
    },
    topBarInner: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        flexWrap: 'wrap',
    },
    brandBlock: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexShrink: 0,
    },
    logoWrap: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandName: {
        fontFamily: 'var(--font-display)',
        fontSize: '1.15rem',
        fontWeight: 800,
        color: 'white',
        letterSpacing: '-0.01em',
        lineHeight: 1,
    },
    brandSub: {
        fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.3)',
        marginTop: 4,
        letterSpacing: '0.05em',
    },
    tagline: {
        fontSize: '0.82rem',
        color: 'rgba(255,255,255,0.38)',
        lineHeight: 1.6,
        maxWidth: 420,
        margin: 0,
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 32,
        padding: '36px 40px',
    },
    linkList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    link: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.42)',
        textDecoration: 'none',
        transition: 'color 0.15s',
        lineHeight: 1.4,
    },
    contactRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        marginBottom: 2,
    },
    contactText: {
        fontSize: '0.8rem',
        color: 'rgba(255,255,255,0.4)',
        lineHeight: 1.4,
    },
    aboutText: {
        fontSize: '0.78rem',
        color: 'rgba(255,255,255,0.36)',
        lineHeight: 1.7,
        marginBottom: 16,
    },
    socials: {
        display: 'flex',
        gap: 8,
    },
    social: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'grid',
        placeItems: 'center',
        color: 'rgba(255,255,255,0.4)',
        textDecoration: 'none',
        transition: 'all 0.16s',
    },
    bottomBar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '14px 40px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(0,0,0,0.18)',
    },
    copyright: {
        fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.22)',
        margin: 0,
        letterSpacing: '0.02em',
    },
    bottomRight: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    badge: {
        fontSize: '0.62rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.22)',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 4,
        padding: '2px 7px',
        letterSpacing: '0.03em',
    },
    bottomLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontSize: '0.72rem',
        color: 'rgba(255,255,255,0.28)',
        textDecoration: 'none',
        transition: 'color 0.15s',
    },
};
