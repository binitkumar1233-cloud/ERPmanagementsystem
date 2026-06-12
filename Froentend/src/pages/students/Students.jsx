import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import Navbar from '../../components/layout/Navbar.jsx';
import ExportMenu from '../../components/common/ExportMenu.jsx';
import {
    Plus, Search, Eye, Edit2, Trash2,
    ChevronLeft, ChevronRight, LayoutGrid, LayoutList,
    GraduationCap, Users, AlertTriangle, XCircle,
    ArrowUpDown, Filter, Mail, Phone, BookOpen,
    TrendingUp, TrendingDown, Minus,
} from 'lucide-react';
import { getAvatarColor, getBarColor } from '../../utils/helpers.js';

const STUDENT_COLUMNS = [
    { label: 'Student ID',  key: 'id'     },
    { label: 'Name',        key: 'name'   },
    { label: 'Course',      key: 'course' },
    { label: 'Department',  key: 'dept'   },
    { label: 'Year',        key: 'year'   },
    { label: 'Email',       key: 'email'  },
    { label: 'Phone',       key: 'phone'  },
    { label: 'Roll No',     key: 'roll'   },
    { label: 'Status',      key: 'status' },
    { label: 'Fees',        key: 'fees'   },
    { label: 'Avg %',       key: 'avg'    },
    { label: 'Campus',      key: 'campus' },
];

const YEAR_MAP = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4 };
const normStudent = d => ({
    id: d.studentId || d._id,
    name: d.name,
    dob: d.dob?.slice(0, 10) || '',
    course: d.course,
    dept: 'All',
    year: YEAR_MAP[d.year] || 1,
    phone: d.phone || '',
    email: d.email || '',
    roll: d.rollNumber || d.studentId || '',
    status: d.status,
    fees: d.fees,
    avg: 0,
    campus: 'Main',
});

const DEPTS = ['All', 'Engineering', 'Sciences', 'Commerce', 'Arts'];
const DEPT_COLORS = { Engineering: '#2563eb', Sciences: '#059669', Commerce: '#d97706', Arts: '#7c3aed' };

const feeBadge    = s => ({ Paid: 'badge-success', Pending: 'badge-warning', Overdue: 'badge-danger' }[s] || 'badge-neutral');
const statusBadge = s => s === 'Active' ? 'badge-success' : 'badge-neutral';
const PER_PAGE    = 6;

const avgIcon = v => v >= 85 ? <TrendingUp size={11} /> : v >= 70 ? <Minus size={11} /> : <TrendingDown size={11} />;
const avgColor = v => v >= 85 ? '#059669' : v >= 70 ? '#d97706' : '#dc2626';

const campusBadge = c => {
    const map = { Main: ['#2563eb', 'rgba(37,99,235,0.09)'], North: ['#059669', 'rgba(5,150,105,0.09)'], South: ['#7c3aed', 'rgba(124,58,237,0.09)'] };
    const [color, bg] = map[c] || ['#64748b', '#f1f5f9'];
    return { display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: '0.66rem', fontWeight: 700, color, background: bg };
};

export default function Students() {
    const [q, setQ]       = useState('');
    const [sf, setSF]     = useState('All');
    const [ff, setFF]     = useState('All');
    const [dept, setDept] = useState('All');
    const [view, setView] = useState('table');
    const [page, setPage] = useState(1);
    const [sortKey, setSortKey] = useState('name');
    const [sortAsc, setSortAsc] = useState(true);
    const [data, setData]       = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState('');

    useEffect(() => {
        api.get('/students')
            .then(res => setData((res.data || []).map(normStudent)))
            .catch(err => setApiError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const toggleSort = key => {
        if (sortKey === key) setSortAsc(a => !a);
        else { setSortKey(key); setSortAsc(true); }
    };

    const isNetworkError = apiError && (apiError.includes('Cannot connect') || apiError.includes('Failed to fetch') || apiError.includes('NetworkError'));

    if (loading) return <div className="erp-page"><Navbar title="Students" subtitle="Manage all student records" /><div className="empty-state"><p>Loading students…</p></div></div>;
    if (apiError) return (
        <div className="erp-page">
            <Navbar title="Students" subtitle="Manage all student records" />
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:340, gap:16, textAlign:'center', padding:32 }}>
                <div style={{ fontSize:48 }}>{isNetworkError ? '🔌' : '⚠️'}</div>
                <div style={{ fontSize:'1.2rem', fontWeight:700, color:'#dc2626' }}>
                    {isNetworkError ? 'Backend server is not running' : 'Failed to load students'}
                </div>
                {isNetworkError ? (
                    <>
                        <div style={{ color:'#64748b', maxWidth:420, lineHeight:1.6 }}>Open a terminal in the project folder and run:</div>
                        <div style={{ background:'#1e293b', color:'#86efac', fontFamily:'monospace', fontSize:'0.95rem', padding:'12px 24px', borderRadius:8, letterSpacing:0.3 }}>
                            cd Backend &amp;&amp; npm run dev
                        </div>
                        <div style={{ color:'#94a3b8', fontSize:'0.85rem' }}>Then refresh this page — your students will appear here.</div>
                    </>
                ) : (
                    <div style={{ color:'#64748b', maxWidth:420, lineHeight:1.6, background:'#fef2f2', border:'1px solid #fecaca', borderRadius:8, padding:'10px 18px', fontSize:'0.875rem' }}>
                        {apiError}
                    </div>
                )}
                <div style={{ display:'flex', gap:12, marginTop:4 }}>
                    <button
                        onClick={() => { setApiError(''); setLoading(true); api.get('/students').then(res => setData((res.data || []).map(normStudent))).catch(err => setApiError(err.message)).finally(() => setLoading(false)); }}
                        style={{ padding:'10px 22px', background:'#2563eb', color:'#fff', borderRadius:8, fontWeight:600, fontSize:'0.9rem', border:'none', cursor:'pointer' }}
                    >
                        Retry
                    </button>
                    <Link to="/students/add" style={{ padding:'10px 24px', background:'#4f46e5', color:'#fff', borderRadius:8, fontWeight:600, textDecoration:'none', fontSize:'0.9rem' }}>
                        + Add First Student
                    </Link>
                </div>
            </div>
        </div>
    );

    const filtered = data
        .filter(s => {
            const mq   = s.name.toLowerCase().includes(q.toLowerCase()) || s.id.toLowerCase().includes(q.toLowerCase()) || s.course.toLowerCase().includes(q.toLowerCase());
            const ms   = sf === 'All'   || s.status === sf;
            const mf   = ff === 'All'   || s.fees   === ff;
            const md   = dept === 'All' || s.dept   === dept;
            return mq && ms && mf && md;
        })
        .sort((a, b) => {
            const va = a[sortKey], vb = b[sortKey];
            if (typeof va === 'number') return sortAsc ? va - vb : vb - va;
            return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
        });

    const pages   = Math.ceil(filtered.length / PER_PAGE);
    const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const SortTh = ({ label, k }) => (
        <th onClick={() => toggleSort(k)} style={{ cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {label}
                <ArrowUpDown size={11} style={{ opacity: sortKey === k ? 1 : 0.35, color: sortKey === k ? '#2563eb' : 'inherit' }} />
            </span>
        </th>
    );

    return (
        <div className="erp-page">
            <Navbar title="Students" subtitle="Manage all student records" />

            {/* ── Hero KPI Cards ── */}
            <div style={S.heroGrid}>
                {[
                    { label: 'Total Students',     value: data.length,                                      icon: GraduationCap, gradient: 'linear-gradient(135deg,#1e3a8a,#2563eb)', glow: 'rgba(37,99,235,0.28)',  sub: `${data.filter(s=>s.campus==='Main').length} Main · ${data.filter(s=>s.campus==='North').length} North · ${data.filter(s=>s.campus==='South').length} South` },
                    { label: 'Active Students',    value: data.filter(s=>s.status==='Active').length,        icon: Users,         gradient: 'linear-gradient(135deg,#065f46,#059669)', glow: 'rgba(16,185,129,0.28)', sub: `${Math.round(data.filter(s=>s.status==='Active').length/data.length*100)}% enrollment rate` },
                    { label: 'Fee Pending',        value: data.filter(s=>s.fees==='Pending').length,         icon: AlertTriangle,  gradient: 'linear-gradient(135deg,#92400e,#d97706)', glow: 'rgba(245,158,11,0.28)', sub: 'Awaiting payment' },
                    { label: 'Fee Overdue',        value: data.filter(s=>s.fees==='Overdue').length,         icon: XCircle,        gradient: 'linear-gradient(135deg,#7f1d1d,#dc2626)', glow: 'rgba(220,38,38,0.28)',  sub: 'Immediate action needed' },
                ].map(({ label, value, icon: Icon, gradient, glow, sub }) => (
                    <div key={label} style={{ ...S.heroCard, background: gradient, boxShadow: `0 8px 24px ${glow}` }}>
                        <div style={S.heroTop}>
                            <div style={S.heroIconBox}><Icon size={20} strokeWidth={2} color="white" /></div>
                            <div style={S.heroVal}>{value}</div>
                        </div>
                        <div style={S.heroLbl}>{label}</div>
                        <div style={S.heroSub}>{sub}</div>
                        <div style={S.heroShine} />
                    </div>
                ))}
            </div>

            {/* ── Dept Filter Chips ── */}
            <div style={S.deptRow}>
                <Filter size={13} color="var(--text-muted)" />
                <span style={S.deptLabel}>Department:</span>
                {DEPTS.map(d => {
                    const active = dept === d;
                    const color  = d === 'All' ? '#2563eb' : DEPT_COLORS[d];
                    return (
                        <button
                            key={d}
                            style={{ ...S.deptChip, ...(active ? { background: `${color}18`, color, border: `1px solid ${color}40`, fontWeight: 700 } : {}) }}
                            onClick={() => { setDept(d); setPage(1); }}
                        >
                            {d !== 'All' && <span style={{ ...S.deptDot, background: color }} />}
                            {d}{d !== 'All' && ` (${data.filter(s => s.dept === d).length})`}
                        </button>
                    );
                })}
            </div>

            {/* ── Toolbar ── */}
            <div className="page-toolbar">
                <div className="toolbar-left">
                    <div className="search-box">
                        <Search size={14} />
                        <input
                            placeholder="Search by name, ID or course…"
                            value={q}
                            onChange={e => { setQ(e.target.value); setPage(1); }}
                        />
                    </div>
                    <select className="filter-select" value={sf} onChange={e => { setSF(e.target.value); setPage(1); }}>
                        <option value="All">All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                    <select className="filter-select" value={ff} onChange={e => { setFF(e.target.value); setPage(1); }}>
                        <option value="All">All Fees</option>
                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Overdue</option>
                    </select>
                </div>
                <div className="toolbar-right">
                    {/* View toggle */}
                    <div style={S.viewToggle}>
                        <button style={{ ...S.viewBtn, ...(view === 'table' ? S.viewBtnActive : {}) }} onClick={() => setView('table')} title="Table view">
                            <LayoutList size={15} />
                        </button>
                        <button style={{ ...S.viewBtn, ...(view === 'card' ? S.viewBtnActive : {}) }} onClick={() => setView('card')} title="Card view">
                            <LayoutGrid size={15} />
                        </button>
                    </div>
                    <ExportMenu title="Students" rows={filtered} columns={STUDENT_COLUMNS} />
                    <Link to="/students/add" className="btn btn-primary btn-sm"><Plus size={14} /> Add Student</Link>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <h2>Student Records <span className="count-pill">{filtered.length}</span></h2>
                        <p>Showing {Math.min(visible.length, filtered.length)} of {filtered.length} results{dept !== 'All' ? ` · ${dept}` : ''}</p>
                    </div>
                </div>

                {/* TABLE VIEW */}
                {view === 'table' && (
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <SortTh label="Student"  k="name"   />
                                    <SortTh label="Course"   k="course" />
                                    <SortTh label="Campus"   k="campus" />
                                    <SortTh label="Year"     k="year"   />
                                    <th>Contact</th>
                                    <SortTh label="Avg %"    k="avg"    />
                                    <SortTh label="Status"   k="status" />
                                    <SortTh label="Fees"     k="fees"   />
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map(s => (
                                    <tr key={s.id}>
                                        {/* Student */}
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                                                <div style={{ ...S.avatar, background: getAvatarColor(s.name) }}>{s.name[0]}</div>
                                                <div>
                                                    <div style={S.stuName}>{s.name}</div>
                                                    <div style={S.stuMeta}>{s.id} · Roll: {s.roll}</div>
                                                    <div style={S.stuMeta}>{new Date(s.dob).toLocaleDateString('en-IN')}</div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Course */}
                                        <td style={{ fontSize: '0.8rem', maxWidth: 160, color: 'var(--text-secondary)' }}>
                                            <div style={{ fontWeight: 500 }}>{s.course}</div>
                                            <div style={{ fontSize: '0.67rem', marginTop: 2 }}>
                                                <span style={{ ...S.deptTag, background: `${DEPT_COLORS[s.dept]}15`, color: DEPT_COLORS[s.dept] }}>{s.dept}</span>
                                            </div>
                                        </td>
                                        {/* Campus */}
                                        <td><span style={campusBadge(s.campus)}>{s.campus}</span></td>
                                        {/* Year */}
                                        <td><span className="badge badge-neutral">Year {s.year}</span></td>
                                        {/* Contact */}
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                                <span style={S.contactRow}><Phone size={10} color="var(--text-muted)" />{s.phone}</span>
                                                <span style={S.contactRow}><Mail  size={10} color="var(--text-muted)" />{s.email}</span>
                                            </div>
                                        </td>
                                        {/* Avg */}
                                        <td>
                                            <div style={S.avgCell}>
                                                <div style={S.miniBarWrap}>
                                                    <div style={{ ...S.miniBarFill, width: `${s.avg}%`, background: avgColor(s.avg) }} />
                                                </div>
                                                <span style={{ ...S.avgVal, color: avgColor(s.avg) }}>
                                                    {avgIcon(s.avg)} {s.avg}%
                                                </span>
                                            </div>
                                        </td>
                                        <td><span className={`badge ${statusBadge(s.status)}`}>{s.status}</span></td>
                                        <td><span className={`badge ${feeBadge(s.fees)}`}>{s.fees}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                                                <button className="tbl-btn" title="View"><Eye    size={13} /></button>
                                                <button className="tbl-btn" title="Edit"><Edit2  size={13} /></button>
                                                <button className="tbl-btn danger" title="Delete"><Trash2 size={13} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {visible.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon"><GraduationCap size={36} /></div>
                                <p>No students match your search.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* CARD VIEW */}
                {view === 'card' && (
                    <div style={S.cardGrid}>
                        {visible.length === 0 && (
                            <div className="empty-state" style={{ gridColumn: '1/-1' }}>
                                <div className="empty-icon"><GraduationCap size={36} /></div>
                                <p>No students match your search.</p>
                            </div>
                        )}
                        {visible.map(s => (
                            <div key={s.id} style={S.stuCard}>
                                {/* Top accent */}
                                <div style={{ ...S.stuCardAccent, background: getAvatarColor(s.name) }} />
                                {/* Header */}
                                <div style={S.stuCardHead}>
                                    <div style={{ ...S.stuCardAvatar, background: getAvatarColor(s.name) }}>{s.name[0]}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={S.stuCardName}>{s.name}</div>
                                        <div style={S.stuCardId}>{s.id} · {s.roll}</div>
                                    </div>
                                    <span className={`badge ${statusBadge(s.status)}`}>{s.status}</span>
                                </div>
                                {/* Info */}
                                <div style={S.stuCardInfo}>
                                    <div style={S.stuCardRow}><BookOpen size={11} color="var(--text-muted)" /><span>{s.course}</span></div>
                                    <div style={S.stuCardRow}><Phone    size={11} color="var(--text-muted)" /><span>{s.phone}</span></div>
                                    <div style={S.stuCardRow}><Mail     size={11} color="var(--text-muted)" /><span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.email}</span></div>
                                </div>
                                {/* Stats strip */}
                                <div style={S.stuCardStats}>
                                    <div style={S.stuCardStat}>
                                        <span style={{ ...S.stuCardStatVal, color: avgColor(s.avg) }}>{s.avg}%</span>
                                        <span style={S.stuCardStatLbl}>Avg Score</span>
                                    </div>
                                    <div style={S.stuCardStatDiv} />
                                    <div style={S.stuCardStat}>
                                        <span style={S.stuCardStatVal}>Year {s.year}</span>
                                        <span style={S.stuCardStatLbl}>Current Year</span>
                                    </div>
                                    <div style={S.stuCardStatDiv} />
                                    <div style={S.stuCardStat}>
                                        <span style={{ ...S.stuCardStatVal, color: s.fees==='Paid'?'#059669':s.fees==='Pending'?'#d97706':'#dc2626' }}>{s.fees}</span>
                                        <span style={S.stuCardStatLbl}>Fee Status</span>
                                    </div>
                                </div>
                                {/* Footer */}
                                <div style={S.stuCardFooter}>
                                    <span style={campusBadge(s.campus)}>{s.campus} Campus</span>
                                    <span style={{ ...S.deptTag, background: `${DEPT_COLORS[s.dept]}13`, color: DEPT_COLORS[s.dept] }}>{s.dept}</span>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                                        <button className="tbl-btn" title="View"><Eye   size={12} /></button>
                                        <button className="tbl-btn" title="Edit"><Edit2 size={12} /></button>
                                        <button className="tbl-btn danger" title="Delete"><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Pagination ── */}
                {pages > 1 && (
                    <div style={S.pagination}>
                        <span style={S.pageInfo}>Page {page} of {pages} · {filtered.length} students</span>
                        <div style={S.pageBtns}>
                            <button style={S.pageNavBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                                <ChevronLeft size={14} /> Prev
                            </button>
                            {Array.from({ length: pages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    style={{ ...S.pageNumBtn, ...(page === i + 1 ? S.pageNumActive : {}) }}
                                    onClick={() => setPage(i + 1)}
                                >{i + 1}</button>
                            ))}
                            <button style={S.pageNavBtn} disabled={page === pages} onClick={() => setPage(p => p + 1)}>
                                Next <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Styles ── */
const S = {
    /* Hero KPI */
    heroGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 16 },
    heroCard: { borderRadius: 14, padding: '18px 20px 14px', position: 'relative', overflow: 'hidden', color: 'white' },
    heroTop:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
    heroIconBox: { width: 40, height: 40, borderRadius: 11, background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center' },
    heroVal:  { fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 900 },
    heroLbl:  { fontSize: '0.77rem', fontWeight: 600, opacity: 0.9, marginBottom: 2 },
    heroSub:  { fontSize: '0.65rem', opacity: 0.55 },
    heroShine:{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', background: 'rgba(255,255,255,0.055)', clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 60% 100%)', pointerEvents: 'none' },

    /* Dept chips */
    deptRow:   { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' },
    deptLabel: { fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: 2 },
    deptChip:  { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)', background: 'white', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.15s' },
    deptDot:   { width: 7, height: 7, borderRadius: '50%', flexShrink: 0 },
    deptTag:   { display: 'inline-block', padding: '2px 7px', borderRadius: 5, fontSize: '0.64rem', fontWeight: 700 },

    /* View toggle */
    viewToggle:    { display: 'flex', background: 'var(--bg-hover)', borderRadius: 9, padding: 3, gap: 2, border: '1px solid var(--border)' },
    viewBtn:       { width: 30, height: 30, borderRadius: 7, border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'grid', placeItems: 'center', transition: 'all 0.15s' },
    viewBtnActive: { background: 'white', color: '#2563eb', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' },

    /* Table cells */
    avatar:     { width: 38, height: 38, borderRadius: 10, display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0 },
    stuName:    { fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' },
    stuMeta:    { fontSize: '0.67rem', color: 'var(--text-muted)', marginTop: 1 },
    contactRow: { display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.74rem', color: 'var(--text-secondary)' },
    avgCell:    { display: 'flex', flexDirection: 'column', gap: 4, minWidth: 80 },
    miniBarWrap:{ height: 5, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' },
    miniBarFill:{ height: '100%', borderRadius: 99 },
    avgVal:     { display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.76rem', fontWeight: 700 },

    /* Card view */
    cardGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, padding: '16px 20px 20px' },
    stuCard:  { background: '#fafbfc', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s', position: 'relative' },
    stuCardAccent:  { height: 4 },
    stuCardHead:    { display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 10px' },
    stuCardAvatar:  { width: 40, height: 40, borderRadius: 11, display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: '0.95rem', flexShrink: 0 },
    stuCardName:    { fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    stuCardId:      { fontSize: '0.66rem', color: 'var(--text-muted)', marginTop: 2 },
    stuCardInfo:    { display: 'flex', flexDirection: 'column', gap: 5, padding: '0 16px 12px', borderBottom: '1px solid #f1f5f9' },
    stuCardRow:     { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.74rem', color: 'var(--text-secondary)' },
    stuCardStats:   { display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid #f1f5f9' },
    stuCardStat:    { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 },
    stuCardStatVal: { fontWeight: 800, fontSize: '0.86rem', fontFamily: 'var(--font-display)' },
    stuCardStatLbl: { fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' },
    stuCardStatDiv: { width: 1, height: 28, background: '#e2e8f0', flexShrink: 0 },
    stuCardFooter:  { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', flexWrap: 'wrap' },

    /* Pagination */
    pagination: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 22px', borderTop: '1px solid var(--border)', background: '#f8fafc', flexWrap: 'wrap' },
    pageInfo:   { fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 },
    pageBtns:   { display: 'flex', alignItems: 'center', gap: 6 },
    pageNavBtn: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 8, border: '1px solid var(--border)', background: 'white', color: 'var(--text-secondary)', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' },
    pageNumBtn: { width: 34, height: 34, borderRadius: 8, border: '1px solid var(--border)', background: 'white', color: 'var(--text-secondary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', display: 'grid', placeItems: 'center' },
    pageNumActive: { background: '#2563eb', color: 'white', border: '1px solid #2563eb' },
};
