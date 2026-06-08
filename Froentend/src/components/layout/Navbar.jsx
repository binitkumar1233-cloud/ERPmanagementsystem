import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, Search, LogOut, ChevronDown, Settings, User,
    X, Check, AlertCircle, Info, Clock,
    Sun, Moon, Monitor, Plus, BookOpen,
    UserPlus, FileText, CalendarDays, Wifi, WifiOff,
    GraduationCap, ChevronRight,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { useSocket } from '../../context/SocketContext.jsx';
import { getInitials } from '../../utils/helpers.js';

/* ─── Notifications data ─── */
const NOTIFS_INIT = [
    { id: 1, type: 'alert',   title: 'Fee Due',            body: 'Semester IV fees due in 3 days.',           time: '5m ago',    read: false },
    { id: 2, type: 'success', title: 'Result Published',   body: 'Semester II results are now available.',    time: '1h ago',    read: false },
    { id: 3, type: 'info',    title: 'Holiday Notice',     body: 'College closed on 15 June for Eid.',        time: '3h ago',    read: false },
    { id: 4, type: 'success', title: 'Attendance Marked',  body: 'Your attendance for today has been marked.', time: 'Yesterday', read: true  },
    { id: 5, type: 'alert',   title: 'Assignment Due',     body: 'DSA assignment due tomorrow.',               time: '2d ago',    read: true  },
    { id: 6, type: 'info',    title: 'New Course Added',   body: 'Cloud Computing (CS407) has been added.',   time: '3d ago',    read: true  },
];

const NOTIF_CFG = {
    alert:   { icon: AlertCircle, color: '#dc2626', bg: '#fee2e2' },
    success: { icon: Check,       color: '#059669', bg: '#d1fae5' },
    info:    { icon: Info,        color: '#0891b2', bg: '#e0f2fe' },
};

/* ─── Search data ─── */
const SEARCH_DATA = [
    { type: 'Student',  label: 'Priya Sharma',         sub: 'STU001 · B.Sc CSE',       path: '/students'   },
    { type: 'Student',  label: 'Rohan Das',             sub: 'STU002 · B.Com Hons',     path: '/students'   },
    { type: 'Student',  label: 'Ananya Patel',          sub: 'STU003 · B.A English',    path: '/students'   },
    { type: 'Page',     label: 'Results',               sub: 'Academic performance',     path: '/results'    },
    { type: 'Page',     label: 'Attendance',            sub: 'Track attendance',         path: '/attendance' },
    { type: 'Page',     label: 'Fees',                  sub: 'Fee management',           path: '/fees'       },
    { type: 'Page',     label: 'Settings',              sub: 'System configuration',     path: '/settings'   },
    { type: 'Teacher',  label: 'Dr. Sharma',            sub: 'Mathematics Dept.',        path: '/teachers'   },
    { type: 'Course',   label: 'B.Tech CSE',            sub: '4 Year · Semester VI',     path: '/courses'    },
];

const QUICK_ACTIONS = [
    { label: 'Add Student',    icon: UserPlus,      path: '/students'   },
    { label: 'Add Teacher',    icon: GraduationCap, path: '/teachers'   },
    { label: 'New Report',     icon: FileText,       path: '/results'    },
    { label: 'New Course',     icon: BookOpen,       path: '/courses'    },
    { label: 'View Calendar',  icon: CalendarDays,   path: '/attendance' },
];

/* ─── Live clock ─── */
function LiveClock() {
    const [now, setNow] = useState(new Date());
    useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
    return (
        <div className="nb-clock">
            <Clock size={12} />
            <span>{now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="nb-clock-date">{now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
    );
}

/* ─── Online pill ─── */
function OnlinePill() {
    const [online, setOnline] = useState(navigator.onLine);
    useEffect(() => {
        const up = () => setOnline(true); const dn = () => setOnline(false);
        window.addEventListener('online', up); window.addEventListener('offline', dn);
        return () => { window.removeEventListener('online', up); window.removeEventListener('offline', dn); };
    }, []);
    return (
        <span className={online ? 'nb-pill nb-pill--green' : 'nb-pill nb-pill--red'}>
            {online ? <Wifi size={11} /> : <WifiOff size={11} />}
            {online ? 'Online' : 'Offline'}
        </span>
    );
}

/* ─── Generic close-on-outside-click hook ─── */
function useOutsideClick(ref, cb) {
    useEffect(() => {
        const h = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, [ref, cb]);
}

/* ═══════════════════════════ NAVBAR ═══════════════════════════ */
export default function Navbar({ title = 'Dashboard', subtitle = '' }) {
    const { user, logout }    = useContext(AuthContext);
    const { theme, setTheme } = useTheme();
    const navigate            = useNavigate();
    const socketCtx           = useSocket();
    const connected           = socketCtx?.connected  ?? false;
    const liveNotifs          = socketCtx?.notifications ?? [];

    /* panel visibility */
    const [showUser,  setShowUser]  = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [showQuick, setShowQuick] = useState(false);
    const [showSearch,setShowSearch]= useState(false);

    /* data */
    const [notifs, setNotifs]   = useState(NOTIFS_INIT);
    const [searchQ, setSearchQ] = useState('');

    // Merge live socket notifications into the list
    useEffect(() => {
        if (!liveNotifs?.length) return;
        const mapped = liveNotifs.map((n, i) => ({
            id: `live-${i}-${n.timestamp}`,
            type: n.type?.includes('deleted') ? 'alert' : n.type?.includes('fee') ? 'success' : 'info',
            title: n.message || '',
            body: n.data ? Object.values(n.data).join(' · ') : '',
            time: 'Live',
            read: false,
        }));
        setNotifs([...mapped, ...NOTIFS_INIT]);
    }, [liveNotifs]);

    /* refs — each wraps trigger + panel together */
    const userRef   = useRef(null);
    const notifRef  = useRef(null);
    const quickRef  = useRef(null);
    const searchRef = useRef(null);

    useOutsideClick(userRef,   () => setShowUser(false));
    useOutsideClick(notifRef,  () => setShowNotif(false));
    useOutsideClick(quickRef,  () => setShowQuick(false));
    useOutsideClick(searchRef, () => { setShowSearch(false); setSearchQ(''); });

    /* close all others when opening one */
    const openUser  = () => { setShowUser(v => !v); setShowNotif(false); setShowQuick(false); setShowSearch(false); };
    const openNotif = () => { setShowNotif(v => !v); setShowUser(false); setShowQuick(false); setShowSearch(false); };
    const openQuick = () => { setShowQuick(v => !v); setShowUser(false); setShowNotif(false); setShowSearch(false); };

    const initials  = getInitials(user?.name || 'Admin');
    const unread    = notifs.filter(n => !n.read).length;

    const hour      = new Date().getHours();
    const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const emoji     = hour < 12 ? '☀️' : hour < 17 ? '👋' : '🌙';

    const searchResults = searchQ.trim()
        ? SEARCH_DATA.filter(d =>
            d.label.toLowerCase().includes(searchQ.toLowerCase()) ||
            d.sub.toLowerCase().includes(searchQ.toLowerCase()))
        : [];

    const markAllRead = () => setNotifs(ns => ns.map(n => ({ ...n, read: true })));
    const markRead    = (id) => setNotifs(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));

    const ThemeIcon = theme === 'dark' ? Moon : theme === 'system' ? Monitor : Sun;
    const cycleTheme = () => {
        const order = ['light', 'dark', 'system'];
        setTheme(order[(order.indexOf(theme) + 1) % order.length]);
    };

    const handleNav = (path) => { navigate(path); setShowUser(false); };

    return (
        <>
            <header className="navbar">

                {/* LEFT */}
                <div className="nb-left">
                    <h1 className="nb-title">{title}</h1>
                    <span className="nb-subtitle">
                        {subtitle || `${greeting}, ${user?.name?.split(' ')[0] || 'User'}. ${emoji}`}
                    </span>
                </div>

                {/* RIGHT */}
                <div className="nb-right">

                    {/* Clock */}
                    <LiveClock />

                    {/* Online */}
                    <OnlinePill />

                    {/* Live socket indicator */}
                    <span className={connected ? 'nb-pill nb-pill--live' : 'nb-pill nb-pill--dim'} title={connected ? 'Real-time connected' : 'Real-time disconnected'}>
                        <span className={connected ? 'nb-live-dot' : ''} />
                        {connected ? 'Live' : 'Offline'}
                    </span>

                    {/* ── Search ── */}
                    <div className="nb-wrap" ref={searchRef}>
                        <div className={`nb-search${showSearch || searchQ ? ' nb-search--open' : ''}`}>
                            <Search size={14} className="nb-search-icon" />
                            <input
                                placeholder="Search anything…"
                                value={searchQ}
                                onChange={e => setSearchQ(e.target.value)}
                                onFocus={() => setShowSearch(true)}
                            />
                            {searchQ
                                ? <button className="nb-clear" onClick={() => setSearchQ('')}><X size={12} /></button>
                                : <kbd className="nb-kbd">⌘K</kbd>
                            }
                        </div>
                        {/* Search panel */}
                        {showSearch && searchQ && (
                            <div className="nb-panel nb-search-panel">
                                {searchResults.length === 0 ? (
                                    <div className="nb-empty">
                                        <Search size={20} style={{ opacity: 0.25 }} />
                                        <p>No results for "<strong>{searchQ}</strong>"</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="nb-panel-label">{searchResults.length} result{searchResults.length !== 1 ? 's' : ''}</p>
                                        {searchResults.map((r, i) => (
                                            <button key={i} className="nb-search-item" onClick={() => { navigate(r.path); setShowSearch(false); setSearchQ(''); }}>
                                                <span className={`nb-type nb-type--${r.type.toLowerCase()}`}>{r.type}</span>
                                                <div className="nb-si-text">
                                                    <p className="nb-si-label">{r.label}</p>
                                                    <p className="nb-si-sub">{r.sub}</p>
                                                </div>
                                                <ChevronRight size={12} className="nb-si-arrow" />
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Quick Add ── */}
                    <div className="nb-wrap" ref={quickRef}>
                        <button className="nb-btn nb-btn--primary" title="Quick Add" onClick={openQuick}>
                            <Plus size={16} />
                        </button>
                        {showQuick && (
                            <div className="nb-panel nb-quick-panel">
                                <p className="nb-panel-label">Quick Actions</p>
                                {QUICK_ACTIONS.map(({ label, icon: Icon, path }) => (
                                    <button key={label} className="nb-quick-item" onClick={() => { navigate(path); setShowQuick(false); }}>
                                        <div className="nb-qi-icon"><Icon size={14} /></div>
                                        <span>{label}</span>
                                        <ChevronRight size={12} className="nb-si-arrow" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Theme ── */}
                    <button className="nb-btn" title={`Theme: ${theme}`} onClick={cycleTheme}>
                        <ThemeIcon size={15} />
                    </button>

                    {/* ── Notifications ── */}
                    <div className="nb-wrap" ref={notifRef}>
                        <button className="nb-btn" onClick={openNotif} aria-label="Notifications">
                            <Bell size={16} />
                            {unread > 0 && <span className="nb-badge">{unread > 9 ? '9+' : unread}</span>}
                        </button>
                        {showNotif && (
                            <div className="nb-panel nb-notif-panel">
                                <div className="nb-notif-head">
                                    <div>
                                        <p className="nb-panel-title">Notifications</p>
                                        {unread > 0 && <p className="nb-notif-unread">{unread} unread</p>}
                                    </div>
                                    {unread > 0 && (
                                        <button className="nb-markall" onClick={markAllRead}>
                                            <Check size={11} /> Mark all read
                                        </button>
                                    )}
                                </div>
                                <div className="nb-notif-list">
                                    {notifs.map(n => {
                                        const cfg  = NOTIF_CFG[n.type];
                                        const Icon = cfg.icon;
                                        return (
                                            <div key={n.id}
                                                className={`nb-notif-item${n.read ? '' : ' nb-notif-item--unread'}`}
                                                onClick={() => markRead(n.id)}>
                                                <div className="nb-notif-ico" style={{ background: cfg.bg, color: cfg.color }}>
                                                    <Icon size={13} />
                                                </div>
                                                <div className="nb-notif-body">
                                                    <p className="nb-notif-name">{n.title}</p>
                                                    <p className="nb-notif-text">{n.body}</p>
                                                    <p className="nb-notif-time">{n.time}</p>
                                                </div>
                                                {!n.read && <div className="nb-unread-dot" />}
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="nb-notif-foot">
                                    <button className="nb-see-all" onClick={() => { navigate('/settings'); setShowNotif(false); }}>
                                        View All Notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── User menu ── */}
                    <div className="nb-wrap nb-user-wrap" ref={userRef}>
                        {/* Trigger — plain button, NO children sharing onClick */}
                        <button className="nb-user-btn" onClick={openUser}>
                            <div className="nb-avatar">{initials}</div>
                            <div className="nb-user-text">
                                <span className="nb-name">{user?.name || 'Administrator'}</span>
                                <span className="nb-role">{user?.role || 'Admin'}</span>
                            </div>
                            <ChevronDown size={13} className={`nb-chevron${showUser ? ' nb-chevron--up' : ''}`} />
                        </button>

                        {/* Dropdown — SIBLING to trigger, not child */}
                        {showUser && (
                            <div className="nb-panel nb-user-panel">
                                {/* Header */}
                                <div className="nb-dd-header">
                                    <div className="nb-avatar nb-avatar--lg">{initials}</div>
                                    <div>
                                        <p className="nb-dd-name">{user?.name || 'Administrator'}</p>
                                        <p className="nb-dd-email">{user?.email || 'admin@school.edu'}</p>
                                        <span className="nb-dd-role">{user?.role || 'Admin'}</span>
                                    </div>
                                </div>

                                <div className="nb-divider" />

                                {/* Nav links */}
                                <button className="nb-dd-item" onClick={() => handleNav('/settings')}>
                                    <div className="nb-dd-ico"><User size={14} /></div>
                                    <div>
                                        <p className="nb-dd-item-name">My Profile</p>
                                        <p className="nb-dd-item-sub">View & edit your profile</p>
                                    </div>
                                    <ChevronRight size={12} className="nb-dd-arrow" />
                                </button>
                                <button className="nb-dd-item" onClick={() => handleNav('/settings')}>
                                    <div className="nb-dd-ico"><Settings size={14} /></div>
                                    <div>
                                        <p className="nb-dd-item-name">Settings</p>
                                        <p className="nb-dd-item-sub">Preferences & security</p>
                                    </div>
                                    <ChevronRight size={12} className="nb-dd-arrow" />
                                </button>
                                <button className="nb-dd-item" onClick={() => { openNotif(); setShowUser(false); }}>
                                    <div className="nb-dd-ico"><Bell size={14} /></div>
                                    <div>
                                        <p className="nb-dd-item-name">Notifications</p>
                                        <p className="nb-dd-item-sub">{unread} unread alert{unread !== 1 ? 's' : ''}</p>
                                    </div>
                                    {unread > 0 && <span className="nb-dd-count">{unread}</span>}
                                </button>

                                <div className="nb-divider" />

                                {/* Theme picker */}
                                <div className="nb-dd-theme">
                                    <span className="nb-dd-theme-label">Theme</span>
                                    <div className="nb-dd-theme-btns">
                                        {[{ k: 'light', I: Sun }, { k: 'dark', I: Moon }, { k: 'system', I: Monitor }].map(({ k, I }) => (
                                            <button key={k} title={k}
                                                className={`nb-dd-tb${theme === k ? ' nb-dd-tb--on' : ''}`}
                                                onClick={() => setTheme(k)}>
                                                <I size={13} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="nb-divider" />

                                <button className="nb-dd-logout" onClick={() => { logout(); setShowUser(false); }}>
                                    <LogOut size={14} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </header>

            <style>{`
                /* ── Shell ── */
                .navbar {
                    position: fixed; top: 0;
                    left: var(--sidebar-width); right: 0;
                    height: var(--navbar-height);
                    background: white;
                    border-bottom: 1px solid var(--border);
                    display: flex; align-items: center;
                    justify-content: space-between;
                    padding: 0 20px;
                    z-index: 1000;
                    isolation: isolate;
                    box-shadow: 0 1px 0 var(--border), 0 2px 8px rgba(15,23,42,0.05);
                    gap: 10px; box-sizing: border-box;
                }

                /* LEFT */
                .nb-left { display:flex; flex-direction:column; justify-content:center; flex-shrink:0; }
                .nb-title { font-size:1.1rem; font-weight:800; color:var(--text-primary); line-height:1; }
                .nb-subtitle { font-size:0.72rem; color:var(--text-muted); margin-top:2px; }

                /* RIGHT */
                .nb-right { display:flex; align-items:center; gap:7px; flex-shrink:0; }

                /* Clock */
                .nb-clock {
                    display:flex; align-items:center; gap:5px;
                    font-size:0.74rem; font-weight:600; color:var(--text-muted);
                    padding:5px 10px; border-radius:8px;
                    border:1.5px solid var(--border); background:var(--bg);
                    white-space:nowrap; flex-shrink:0;
                }
                .nb-clock-date { opacity:0.6; margin-left:1px; }

                /* Pills */
                .nb-pill {
                    display:flex; align-items:center; gap:4px;
                    font-size:0.7rem; font-weight:700; padding:4px 9px;
                    border-radius:99px; white-space:nowrap; flex-shrink:0;
                }
                .nb-pill--green { background:#d1fae5; color:#065f46; }
                .nb-pill--red   { background:#fee2e2; color:#991b1b; }
                .nb-pill--live  { background:#ede9fe; color:#5b21b6; }
                .nb-pill--dim   { background:#f3f4f6; color:#9ca3af; }
                .nb-live-dot {
                    width:7px; height:7px; border-radius:50%;
                    background:#7c3aed;
                    animation:livePulse 1.4s ease-in-out infinite;
                    flex-shrink:0;
                }
                @keyframes livePulse {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%      { opacity:0.4; transform:scale(0.7); }
                }

                /* ── Icon buttons ── */
                .nb-btn {
                    width:36px; height:36px; border-radius:9px;
                    border:1.5px solid var(--border); background:white;
                    display:grid; place-items:center; cursor:pointer;
                    color:var(--text-secondary); transition:all 0.15s ease;
                    position:relative; flex-shrink:0;
                }
                .nb-btn:hover { background:var(--bg); color:var(--primary); border-color:var(--border-dark); }
                .nb-btn--primary { background:var(--primary); border-color:var(--primary); color:white; }
                .nb-btn--primary:hover { background:var(--primary-dark); border-color:var(--primary-dark); color:white; }
                .nb-badge {
                    position:absolute; top:-5px; right:-5px;
                    min-width:16px; height:16px; border-radius:99px;
                    background:#dc2626; color:white; font-size:0.55rem;
                    font-weight:800; display:grid; place-items:center;
                    padding:0 3px; border:2px solid white;
                }

                /* ── Search ── */
                .nb-wrap { position:relative; }
                .nb-search {
                    display:flex; align-items:center; gap:7px;
                    background:var(--bg); border:1.5px solid var(--border);
                    border-radius:9px; padding:7px 11px;
                    width:clamp(130px,18vw,230px); transition:all 0.18s ease;
                }
                .nb-search--open, .nb-search:focus-within {
                    background:white; border-color:var(--primary);
                    box-shadow:0 0 0 3px rgba(30,64,175,0.08);
                    width:250px;
                }
                .nb-search-icon { color:var(--text-muted); flex-shrink:0; }
                .nb-search input {
                    border:none; background:none; outline:none;
                    font-size:0.82rem; color:var(--text-primary); flex:1; min-width:0;
                }
                .nb-search input::placeholder { color:var(--text-muted); }
                .nb-kbd { font-size:0.58rem; color:var(--text-muted); background:var(--border); padding:1px 5px; border-radius:3px; flex-shrink:0; }
                .nb-clear { background:none; border:none; cursor:pointer; color:var(--text-muted); display:flex; padding:2px; border-radius:4px; }
                .nb-clear:hover { color:var(--danger); }

                /* ── Shared panel base ── */
                .nb-panel {
                    position:absolute; top:calc(100% + 10px);
                    background:white; border:1.5px solid var(--border);
                    border-radius:14px; box-shadow:0 8px 32px rgba(15,23,42,0.13), 0 1px 4px rgba(15,23,42,0.08);
                    z-index:2000; animation:panelIn 0.15s ease;
                    overflow:hidden;
                }
                @keyframes panelIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }

                /* Search panel */
                .nb-search-panel { left:0; min-width:340px; right:auto; }
                .nb-panel-label { font-size:0.68rem; font-weight:800; color:var(--text-muted); padding:10px 14px 4px; text-transform:uppercase; letter-spacing:0.05em; }
                .nb-empty { padding:28px 20px; text-align:center; color:var(--text-muted); display:flex; flex-direction:column; align-items:center; gap:8px; font-size:0.84rem; }
                .nb-search-item {
                    display:flex; align-items:center; gap:11px;
                    width:100%; padding:10px 14px;
                    background:none; border:none; border-bottom:1px solid var(--bg);
                    cursor:pointer; text-align:left; transition:background 0.1s;
                    font-family:var(--font-body);
                }
                .nb-search-item:last-child { border-bottom:none; }
                .nb-search-item:hover { background:var(--bg); }
                .nb-type { font-size:0.6rem; font-weight:800; padding:2px 7px; border-radius:99px; text-transform:uppercase; flex-shrink:0; }
                .nb-type--student { background:#dbeafe; color:#1e40af; }
                .nb-type--page    { background:#f3e8ff; color:#7c3aed; }
                .nb-type--teacher { background:#d1fae5; color:#065f46; }
                .nb-type--course  { background:#fef3c7; color:#92400e; }
                .nb-si-text { flex:1; min-width:0; }
                .nb-si-label { font-size:0.83rem; font-weight:600; color:var(--text-primary); }
                .nb-si-sub   { font-size:0.71rem; color:var(--text-muted); margin-top:1px; }
                .nb-si-arrow { color:var(--text-muted); opacity:0.4; flex-shrink:0; }

                /* Quick panel */
                .nb-quick-panel { right:0; width:210px; padding:6px; }
                .nb-quick-item {
                    display:flex; align-items:center; gap:10px;
                    width:100%; padding:9px 10px; border:none; background:none;
                    cursor:pointer; border-radius:8px; transition:background 0.1s;
                    font-size:0.83rem; font-weight:500; color:var(--text-primary);
                    font-family:var(--font-body); text-align:left;
                }
                .nb-quick-item:hover { background:var(--bg); }
                .nb-qi-icon { width:26px; height:26px; border-radius:7px; background:rgba(30,64,175,0.08); color:var(--primary); display:grid; place-items:center; flex-shrink:0; }

                /* Notification panel */
                .nb-notif-panel { right:0; width:360px; display:flex; flex-direction:column; max-height:460px; }
                .nb-notif-head { display:flex; align-items:center; justify-content:space-between; padding:13px 16px 10px; border-bottom:1px solid var(--border); flex-shrink:0; }
                .nb-panel-title { font-weight:800; font-size:0.9rem; color:var(--text-primary); }
                .nb-notif-unread { font-size:0.71rem; color:var(--primary); margin-top:1px; }
                .nb-markall { font-size:0.71rem; font-weight:700; color:var(--primary); background:rgba(30,64,175,0.07); border:none; cursor:pointer; padding:5px 9px; border-radius:7px; display:flex; align-items:center; gap:4px; font-family:var(--font-body); }
                .nb-markall:hover { background:rgba(30,64,175,0.14); }
                .nb-notif-list { overflow-y:auto; flex:1; }
                .nb-notif-item { display:flex; align-items:flex-start; gap:11px; padding:11px 16px; cursor:pointer; border-bottom:1px solid var(--bg); transition:background 0.1s; position:relative; }
                .nb-notif-item:hover { background:var(--bg); }
                .nb-notif-item--unread { background:#f0f5ff; }
                .nb-notif-item--unread:hover { background:#e8eeff; }
                .nb-notif-ico { width:32px; height:32px; border-radius:9px; display:grid; place-items:center; flex-shrink:0; }
                .nb-notif-body { flex:1; min-width:0; }
                .nb-notif-name { font-size:0.82rem; font-weight:700; color:var(--text-primary); }
                .nb-notif-text { font-size:0.74rem; color:var(--text-secondary); margin-top:2px; line-height:1.4; }
                .nb-notif-time { font-size:0.66rem; color:var(--text-muted); margin-top:4px; }
                .nb-unread-dot { width:8px; height:8px; border-radius:50%; background:var(--primary); flex-shrink:0; margin-top:5px; }
                .nb-notif-foot { padding:10px 16px; border-top:1px solid var(--border); flex-shrink:0; }
                .nb-see-all { width:100%; padding:8px; border:1.5px solid var(--border); border-radius:8px; background:none; cursor:pointer; font-size:0.8rem; font-weight:600; color:var(--primary); transition:background 0.15s; font-family:var(--font-body); }
                .nb-see-all:hover { background:var(--bg); }

                /* User button */
                .nb-user-wrap { }
                .nb-user-btn {
                    display:flex; align-items:center; gap:8px;
                    padding:5px 9px; border-radius:9px;
                    border:1.5px solid var(--border); background:white;
                    cursor:pointer; transition:all 0.15s; flex-shrink:0;
                    min-width:120px; font-family:var(--font-body);
                }
                .nb-user-btn:hover { background:var(--bg); border-color:var(--border-dark); }
                .nb-avatar { width:30px; height:30px; border-radius:50%; background:var(--primary); color:white; display:grid; place-items:center; font-family:var(--font-display); font-size:0.72rem; font-weight:800; flex-shrink:0; }
                .nb-avatar--lg { width:38px; height:38px; font-size:0.85rem; }
                .nb-user-text { display:flex; flex-direction:column; text-align:left; min-width:0; }
                .nb-name { font-size:0.81rem; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.2; }
                .nb-role { font-size:0.67rem; color:var(--text-muted); }
                .nb-chevron { color:var(--text-muted); flex-shrink:0; transition:transform 0.18s; }
                .nb-chevron--up { transform:rotate(180deg); }

                /* User panel */
                .nb-user-panel { right:0; width:250px; }
                .nb-dd-header { display:flex; align-items:center; gap:12px; padding:14px 16px; }
                .nb-dd-name  { font-size:0.87rem; font-weight:700; color:var(--text-primary); }
                .nb-dd-email { font-size:0.71rem; color:var(--text-muted); margin-top:1px; }
                .nb-dd-role  { font-size:0.64rem; font-weight:700; background:rgba(30,64,175,0.1); color:var(--primary); padding:2px 8px; border-radius:99px; display:inline-block; margin-top:5px; text-transform:uppercase; }
                .nb-divider  { height:1px; background:var(--border); }
                .nb-dd-item {
                    display:flex; align-items:center; gap:11px;
                    width:100%; padding:11px 16px;
                    background:none; border:none; cursor:pointer;
                    text-align:left; transition:background 0.1s;
                    font-family:var(--font-body);
                }
                .nb-dd-item:hover { background:var(--bg); }
                .nb-dd-ico { width:30px; height:30px; border-radius:8px; background:var(--bg); color:var(--text-secondary); display:grid; place-items:center; flex-shrink:0; }
                .nb-dd-item-name { font-size:0.83rem; font-weight:600; color:var(--text-primary); }
                .nb-dd-item-sub  { font-size:0.71rem; color:var(--text-muted); margin-top:1px; }
                .nb-dd-arrow { color:var(--text-muted); opacity:0.35; margin-left:auto; }
                .nb-dd-count { margin-left:auto; background:#dc2626; color:white; font-size:0.6rem; font-weight:800; min-width:18px; height:18px; border-radius:99px; display:grid; place-items:center; padding:0 4px; }
                .nb-dd-theme { display:flex; align-items:center; justify-content:space-between; padding:10px 16px; }
                .nb-dd-theme-label { font-size:0.76rem; font-weight:600; color:var(--text-secondary); }
                .nb-dd-theme-btns { display:flex; gap:4px; }
                .nb-dd-tb { width:30px; height:30px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); color:var(--text-muted); display:grid; place-items:center; cursor:pointer; transition:all 0.14s; }
                .nb-dd-tb:hover { border-color:var(--primary); color:var(--primary); }
                .nb-dd-tb--on { background:var(--primary); border-color:var(--primary); color:white; }
                .nb-dd-logout { display:flex; align-items:center; gap:8px; width:100%; padding:11px 16px; background:none; border:none; cursor:pointer; font-size:0.83rem; color:var(--danger); font-family:var(--font-body); transition:background 0.1s; }
                .nb-dd-logout:hover { background:rgba(220,38,38,0.06); }

                /* Responsive */
                @media (max-width:1100px) { .nb-clock, .nb-pill { display:none; } }
                @media (max-width:900px)  { .nb-search { width:130px; } .nb-kbd { display:none; } }
                @media (max-width:760px)  { .navbar { left:0; padding:0 12px; } .nb-clock, .nb-pill { display:none; } }
            `}</style>
        </>
    );
}