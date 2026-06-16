import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { api } from '../../services/api.js';
import { db } from '../../config/firebase.js';
import Navbar from '../../components/layout/Navbar.jsx';
import ExportMenu from '../../components/common/ExportMenu.jsx';
import {
    Plus, Search, BookOpen, Users, Clock, Edit2,
    GraduationCap, TrendingUp, LayoutGrid, LayoutList,
    ArrowUpDown, Filter, Star, BookMarked, Award, Layers,
    ChevronRight, BarChart3, MapPin,
} from 'lucide-react';

const COURSE_COLUMNS = [
    { label: 'Course ID',   key: 'id'       },
    { label: 'Name',        key: 'name'     },
    { label: 'Department',  key: 'dept'     },
    { label: 'Level',       key: 'level'    },
    { label: 'Duration',    key: 'duration' },
    { label: 'Semesters',   key: 'sems'     },
    { label: 'Seats',       key: 'seats'    },
    { label: 'Enrolled',    key: 'enrolled' },
    { label: 'Credits',     key: 'credits'  },
    { label: 'Annual Fee',  key: 'fee', value: r => `₹${r.fee.toLocaleString('en-IN')}` },
    { label: 'Status',      key: 'status'   },
    { label: 'Coordinator', key: 'coord'    },
    { label: 'Rating',      key: 'rating'   },
];

const SEMS_BY_DURATION = { '2 years': 4, '2 Years': 4, '3 years': 6, '3 Years': 6, '4 years': 8, '4 Years': 8 };

const normCourse = d => {
    const sems  = SEMS_BY_DURATION[d.duration] || 6;
    const level = sems <= 4 ? 'PG' : 'UG';
    return {
        id:       d.courseId || d._id,
        name:     d.name,
        dept:     d.dept,
        level,
        duration: d.duration,
        sems,
        seats:    d.seats,
        enrolled: d.enrolled || 0,
        credits:  0,
        fee:      d.fees || 0,
        status:   d.status,
        campus:   ['Main'],
        coord:    d.headOfDept?.name || '—',
        rating:   0,
    };
};

const DEPT_COLORS = {
    'Computer Science':'#2563eb', 'Commerce':'#d97706',    'English':'#059669',
    'Electronics':'#0284c7',     'Mathematics':'#7c3aed',  'Management':'#dc2626',
    'History':'#92400e',         'Science':'#0891b2',      'Social Sciences':'#7c3aed',
};
const LEVEL_STYLE = {
    UG: { color:'#2563eb', bg:'rgba(37,99,235,0.09)',  border:'rgba(37,99,235,0.22)'  },
    PG: { color:'#7c3aed', bg:'rgba(124,58,237,0.09)', border:'rgba(124,58,237,0.22)' },
};
const SORT_OPTS = [
    { label:'Name',      key:'name'     },
    { label:'Fee',       key:'fee'      },
    { label:'Occupancy', key:'occ'      },
    { label:'Enrolled',  key:'enrolled' },
];

const occOf  = c => Math.round(c.enrolled / c.seats * 100);
const occClr = p => p >= 95 ? '#dc2626' : p >= 80 ? '#d97706' : p >= 60 ? '#2563eb' : '#059669';
const fmtFee = f => '₹' + (f >= 100000 ? (f/100000).toFixed(1)+'L' : (f/1000).toFixed(0)+'K');

const campusBadge = c => {
    const m = { Main:['#2563eb','rgba(37,99,235,0.09)'], North:['#059669','rgba(5,150,105,0.09)'], South:['#7c3aed','rgba(124,58,237,0.09)'] };
    const [col,bg] = m[c] || ['#64748b','#f1f5f9'];
    return { display:'inline-block', padding:'2px 7px', borderRadius:5, fontSize:'0.62rem', fontWeight:700, color:col, background:bg };
};

export default function Courses() {
    const [q,      setQ]      = useState('');
    const [dept,   setDept]   = useState('All');
    const [status, setStatus] = useState('All');
    const [level,  setLevel]  = useState('All');
    const [view,   setView]   = useState('grid');
    const [sortK,  setSortK]  = useState('name');
    const [sortA,  setSortA]  = useState(true);
    const [data,   setData]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get('/courses');
                setData((res.data || []).map(normCourse));
            } catch {
                try {
                    const snap = await getDocs(collection(db, 'courses'));
                    setData(snap.docs.map(d => normCourse({ ...d.data(), _id: d.id })));
                } catch { /* silent */ }
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const DEPTS = ['All', ...new Set(data.map(c => c.dept))];

    if (loading) return <div className="erp-page"><Navbar title="Courses" subtitle="Manage academic programs and courses" /><div className="empty-state"><p>Loading courses…</p></div></div>;

    const totalSeats    = data.reduce((s,c) => s+c.seats,    0);
    const totalEnrolled = data.reduce((s,c) => s+c.enrolled, 0);
    const avgRating     = data.length ? (data.reduce((s,c)=>s+c.rating,0)/data.length).toFixed(1) : '0.0';

    const withOcc = data.map(c => ({ ...c, occ: occOf(c) }));

    const filtered = withOcc
        .filter(c => {
            const mq = !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.dept.toLowerCase().includes(q.toLowerCase()) || c.coord.toLowerCase().includes(q.toLowerCase());
            const md = dept   === 'All' || c.dept   === dept;
            const ms = status === 'All' || c.status === status;
            const ml = level  === 'All' || c.level  === level;
            return mq && md && ms && ml;
        })
        .sort((a,b) => {
            const va=a[sortK], vb=b[sortK];
            if (typeof va==='number') return sortA ? va-vb : vb-va;
            return sortA ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
        });

    return (
        <div className="erp-page">
            <Navbar title="Courses" subtitle="Manage academic programs and courses" />

            {/* ── Hero KPI Cards ── */}
            <div style={S.heroGrid}>
                {[
                    { label:'Total Courses',   value:data.length,     icon:BookOpen,     gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  sub:`${data.filter(c=>c.level==='UG').length} UG · ${data.filter(c=>c.level==='PG').length} PG programs` },
                    { label:'Active Courses',  value:data.filter(c=>c.status==='Active').length, icon:Award, gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(16,185,129,0.28)', sub:'Currently running' },
                    { label:'Total Seats',     value:totalSeats,      icon:Layers,       gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(139,92,246,0.28)', sub:'Across all courses' },
                    { label:'Total Enrolled',  value:totalEnrolled,   icon:Users,        gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', sub:`${totalSeats-totalEnrolled} seats available` },
                    { label:'Avg Occupancy',   value:(totalSeats ? Math.round(totalEnrolled/totalSeats*100) : 0)+'%', icon:BarChart3, gradient:'linear-gradient(135deg,#0c4a6e,#0284c7)', glow:'rgba(2,132,199,0.28)', sub:`Avg rating ${avgRating} ★` },
                ].map(({ label, value, icon:Icon, gradient, glow, sub }) => (
                    <div key={label} style={{ ...S.heroCard, background:gradient, boxShadow:`0 8px 24px ${glow}` }}>
                        <div style={S.heroTop}>
                            <div style={S.heroIconBox}><Icon size={19} strokeWidth={2} color="white"/></div>
                            <div style={S.heroVal}>{value}</div>
                        </div>
                        <div style={S.heroLbl}>{label}</div>
                        <div style={S.heroSub}>{sub}</div>
                        <div style={S.heroShine}/>
                    </div>
                ))}
            </div>

            {/* ── Dept Filter Chips ── */}
            <div style={S.chipRow}>
                <Filter size={13} color="var(--text-muted)"/>
                <span style={S.chipLabel}>Department:</span>
                {DEPTS.map(d => {
                    const active = dept === d;
                    const color  = d==='All' ? '#2563eb' : (DEPT_COLORS[d]||'#64748b');
                    return (
                        <button key={d}
                            style={{ ...S.chip, ...(active?{ background:`${color}16`, color, border:`1px solid ${color}38`, fontWeight:700 }:{}) }}
                            onClick={() => setDept(d)}
                        >
                            {d!=='All' && <span style={{ ...S.chipDot, background:color }}/>}
                            {d!=='All' ? d.split(' ')[0] : 'All'}
                            {d!=='All' && ` (${data.filter(c=>c.dept===d).length})`}
                        </button>
                    );
                })}
            </div>

            {/* ── Toolbar ── */}
            <div className="page-toolbar">
                <div className="toolbar-left">
                    <div className="search-box">
                        <Search size={14}/>
                        <input placeholder="Search course, department, coordinator…" value={q} onChange={e=>setQ(e.target.value)}/>
                    </div>
                    <select className="filter-select" value={status} onChange={e=>setStatus(e.target.value)}>
                        <option value="All">All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                    <select className="filter-select" value={level} onChange={e=>setLevel(e.target.value)}>
                        <option value="All">All Levels</option>
                        <option value="UG">Under Graduate</option>
                        <option value="PG">Post Graduate</option>
                    </select>
                    {/* Sort */}
                    <div style={S.sortWrap}>
                        <ArrowUpDown size={13} color="var(--text-muted)"/>
                        <select style={S.sortSelect} value={sortK} onChange={e=>setSortK(e.target.value)}>
                            {SORT_OPTS.map(o=><option key={o.key} value={o.key}>{o.label}</option>)}
                        </select>
                        <button style={S.sortDir} onClick={()=>setSortA(a=>!a)} title="Toggle order">
                            {sortA ? '↑' : '↓'}
                        </button>
                    </div>
                </div>
                <div className="toolbar-right">
                    {/* View toggle */}
                    <div style={S.viewToggle}>
                        <button style={{ ...S.viewBtn, ...(view==='grid'?S.viewBtnOn:{}) }} onClick={()=>setView('grid')}  title="Grid"><LayoutGrid  size={15}/></button>
                        <button style={{ ...S.viewBtn, ...(view==='list'?S.viewBtnOn:{}) }} onClick={()=>setView('list')}  title="List"><LayoutList  size={15}/></button>
                    </div>
                    <ExportMenu title="Courses" rows={filtered} columns={COURSE_COLUMNS} />
                    <Link to="/courses/add" className="btn btn-primary btn-sm"><Plus size={14}/> Add Course</Link>
                </div>
            </div>

            {/* ── GRID VIEW ── */}
            {view === 'grid' && (
                <div style={S.cardGrid}>
                    {filtered.length === 0 && (
                        <div className="empty-state" style={{ gridColumn:'1/-1' }}>
                            <div className="empty-icon"><BookOpen size={36}/></div>
                            <p>No courses match your search.</p>
                        </div>
                    )}
                    {filtered.map(c => {
                        const dColor = DEPT_COLORS[c.dept] || '#64748b';
                        const ls     = LEVEL_STYLE[c.level];
                        const occ    = c.occ;
                        const oc     = occClr(occ);
                        const seatsLeft = c.seats - c.enrolled;
                        return (
                            <div key={c.id} style={S.courseCard}>
                                {/* Accent bar */}
                                <div style={{ height:4, background:`linear-gradient(90deg,${dColor},${dColor}60)` }}/>

                                {/* Card top */}
                                <div style={S.cardTop}>
                                    <div style={{ ...S.courseIcon, background:`${dColor}16`, color:dColor }}>
                                        <BookOpen size={20} strokeWidth={2}/>
                                    </div>
                                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5 }}>
                                        <span className={`badge ${c.status==='Active'?'badge-success':'badge-neutral'}`}>{c.status}</span>
                                        <span style={{ ...S.levelBadge, color:ls.color, background:ls.bg, border:`1px solid ${ls.border}` }}>{c.level}</span>
                                    </div>
                                </div>

                                {/* Course info */}
                                <div style={S.cardBody}>
                                    <code style={S.courseId}>{c.id}</code>
                                    <h3 style={S.courseName}>{c.name}</h3>
                                    <span style={{ ...S.deptTag, color:dColor, background:`${dColor}12` }}>{c.dept}</span>
                                </div>

                                {/* Stats row */}
                                <div style={S.statsStrip}>
                                    <div style={S.statItem}>
                                        <Clock size={12} color={dColor}/>
                                        <span>{c.duration}</span>
                                    </div>
                                    <div style={S.statItem}>
                                        <BookMarked size={12} color={dColor}/>
                                        <span>{c.sems} Sems</span>
                                    </div>
                                    <div style={S.statItem}>
                                        <Award size={12} color={dColor}/>
                                        <span>{c.credits} Credits</span>
                                    </div>
                                </div>

                                {/* Enrollment info */}
                                <div style={S.enrollRow}>
                                    <div style={S.enrollStat}>
                                        <span style={{ ...S.enrollNum, color:dColor }}>{c.enrolled}</span>
                                        <span style={S.enrollLbl}>Enrolled</span>
                                    </div>
                                    <div style={S.enrollDiv}/>
                                    <div style={S.enrollStat}>
                                        <span style={{ ...S.enrollNum, color:seatsLeft>0?'#059669':'#dc2626' }}>{seatsLeft}</span>
                                        <span style={S.enrollLbl}>Available</span>
                                    </div>
                                    <div style={S.enrollDiv}/>
                                    <div style={S.enrollStat}>
                                        <span style={{ ...S.enrollNum, color:'#7c3aed' }}>{c.seats}</span>
                                        <span style={S.enrollLbl}>Total Seats</span>
                                    </div>
                                </div>

                                {/* Occupancy bar */}
                                <div style={S.barSection}>
                                    <div style={S.barLabel}>
                                        <span style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:500 }}>Occupancy</span>
                                        <span style={{ fontSize:'0.74rem', fontWeight:800, color:oc }}>{occ}%</span>
                                    </div>
                                    <div style={S.barTrack}>
                                        <div style={{ ...S.barFill, width:`${occ}%`, background:`linear-gradient(90deg,${oc}aa,${oc})` }}/>
                                    </div>
                                </div>

                                {/* Fee + Rating + Campus */}
                                <div style={S.feeRow}>
                                    <div style={{ ...S.feePill, color:dColor, background:`${dColor}10` }}>
                                        {fmtFee(c.fee)}<span style={{ fontSize:'0.6rem', opacity:0.7 }}>/yr</span>
                                    </div>
                                    <div style={S.ratingPill}>
                                        <Star size={10} style={{ fill:'#f59e0b', color:'#f59e0b' }}/>{c.rating}
                                    </div>
                                    <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
                                        {c.campus.map(cam => <span key={cam} style={campusBadge(cam)}>{cam}</span>)}
                                    </div>
                                </div>

                                {/* Coordinator */}
                                <div style={S.coordRow}>
                                    <GraduationCap size={11} color="var(--text-muted)"/>
                                    <span style={S.coordName}>{c.coord}</span>
                                </div>

                                {/* Actions */}
                                <div style={S.cardActions}>
                                    <button style={{ ...S.actionBtn, color:dColor, border:`1px solid ${dColor}30`, background:`${dColor}08` }}>
                                        <Edit2 size={13}/> Edit Course
                                    </button>
                                    <button style={{ ...S.actionBtn, color:'#059669', border:'1px solid rgba(5,150,105,0.25)', background:'rgba(5,150,105,0.06)' }}>
                                        <Users size={13}/> Students
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ── LIST VIEW ── */}
            {view === 'list' && (
                <div className="card">
                    <div className="card-header">
                        <div>
                            <h2>Course Catalogue <span className="count-pill">{filtered.length}</span></h2>
                            <p>All registered academic programs</p>
                        </div>
                    </div>
                    <div style={{ overflowX:'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Course</th>
                                    <th>Department</th>
                                    <th>Level</th>
                                    <th>Duration</th>
                                    <th>Seats</th>
                                    <th>Occupancy</th>
                                    <th>Fee/yr</th>
                                    <th>Rating</th>
                                    <th>Campus</th>
                                    <th>Status</th>
                                    <th style={{ textAlign:'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(c => {
                                    const dColor = DEPT_COLORS[c.dept]||'#64748b';
                                    const ls     = LEVEL_STYLE[c.level];
                                    const occ    = c.occ;
                                    const oc     = occClr(occ);
                                    return (
                                        <tr key={c.id}>
                                            <td>
                                                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                    <div style={{ ...S.listIcon, background:`${dColor}14`, color:dColor }}><BookOpen size={15}/></div>
                                                    <div>
                                                        <div style={{ fontWeight:700, fontSize:'0.85rem', color:'var(--text-primary)' }}>{c.name}</div>
                                                        <div style={{ fontSize:'0.66rem', color:'var(--text-muted)', fontFamily:'monospace' }}>{c.id} · {c.coord}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td><span style={{ ...S.deptTag, color:dColor, background:`${dColor}12` }}>{c.dept}</span></td>
                                            <td><span style={{ ...S.levelBadge, color:ls.color, background:ls.bg, border:`1px solid ${ls.border}` }}>{c.level}</span></td>
                                            <td style={{ fontSize:'0.79rem' }}>{c.duration}</td>
                                            <td style={{ fontSize:'0.79rem' }}>{c.enrolled}/{c.seats}</td>
                                            <td>
                                                <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                                                    <div style={{ width:56, height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                        <div style={{ height:'100%', width:`${occ}%`, background:oc, borderRadius:99 }}/>
                                                    </div>
                                                    <span style={{ fontSize:'0.73rem', fontWeight:700, color:oc }}>{occ}%</span>
                                                </div>
                                            </td>
                                            <td style={{ ...S.feePill, color:dColor, background:`${dColor}10`, display:'inline-block' }}>{fmtFee(c.fee)}</td>
                                            <td>
                                                <span style={S.ratingPill}><Star size={10} style={{ fill:'#f59e0b', color:'#f59e0b' }}/>{c.rating}</span>
                                            </td>
                                            <td>
                                                <div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>
                                                    {c.campus.map(cam=><span key={cam} style={campusBadge(cam)}>{cam}</span>)}
                                                </div>
                                            </td>
                                            <td><span className={`badge ${c.status==='Active'?'badge-success':'badge-neutral'}`}>{c.status}</span></td>
                                            <td>
                                                <div style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
                                                    <button className="tbl-btn"><Edit2 size={13}/></button>
                                                    <button className="tbl-btn"><Users size={13}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filtered.length===0 && (
                            <div className="empty-state">
                                <div className="empty-icon"><BookOpen size={36}/></div>
                                <p>No courses match your search.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Styles ── */
const S = {
    heroGrid: { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:13, marginBottom:16 },
    heroCard: { borderRadius:13, padding:'16px 18px 13px', position:'relative', overflow:'hidden', color:'white' },
    heroTop:  { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 },
    heroIconBox:{ width:38, height:38, borderRadius:10, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
    heroVal:  { fontSize:'1.8rem', fontFamily:'var(--font-display)', fontWeight:900 },
    heroLbl:  { fontSize:'0.73rem', fontWeight:600, opacity:0.9, marginBottom:2 },
    heroSub:  { fontSize:'0.62rem', opacity:0.52 },
    heroShine:{ position:'absolute', top:0, right:0, width:'45%', height:'100%', background:'rgba(255,255,255,0.055)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' },

    chipRow:   { display:'flex', alignItems:'center', gap:7, marginBottom:14, flexWrap:'wrap' },
    chipLabel: { fontSize:'0.72rem', fontWeight:600, color:'var(--text-muted)', marginRight:2 },
    chip:      { display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:20, fontSize:'0.7rem', fontWeight:500, color:'var(--text-muted)', background:'white', border:'1px solid var(--border)', cursor:'pointer', transition:'all 0.15s' },
    chipDot:   { width:7, height:7, borderRadius:'50%', flexShrink:0 },

    sortWrap:   { display:'flex', alignItems:'center', gap:5, background:'white', border:'1px solid var(--border)', borderRadius:9, padding:'5px 10px' },
    sortSelect: { fontSize:'0.74rem', border:'none', outline:'none', background:'transparent', color:'var(--text-secondary)', fontWeight:500, cursor:'pointer' },
    sortDir:    { width:22, height:22, borderRadius:6, border:'1px solid var(--border)', background:'var(--bg-hover)', fontSize:'0.8rem', cursor:'pointer', display:'grid', placeItems:'center', fontWeight:700, color:'var(--text-secondary)' },

    viewToggle: { display:'flex', background:'var(--bg-hover)', borderRadius:9, padding:3, gap:2, border:'1px solid var(--border)' },
    viewBtn:    { width:30, height:30, borderRadius:7, border:'none', background:'transparent', color:'var(--text-muted)', cursor:'pointer', display:'grid', placeItems:'center', transition:'all 0.15s' },
    viewBtnOn:  { background:'white', color:'#2563eb', boxShadow:'0 1px 4px rgba(0,0,0,0.1)' },

    /* Grid */
    cardGrid:   { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:8 },
    courseCard: { background:'white', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column', transition:'box-shadow 0.2s, transform 0.2s' },
    cardTop:    { display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'16px 18px 10px' },
    courseIcon: { width:44, height:44, borderRadius:12, display:'grid', placeItems:'center', flexShrink:0 },
    levelBadge: { display:'inline-block', padding:'2px 8px', borderRadius:5, fontSize:'0.65rem', fontWeight:800, letterSpacing:'0.04em' },

    cardBody:   { padding:'0 18px 10px', display:'flex', flexDirection:'column', gap:5 },
    courseId:   { fontSize:'0.67rem', background:'#f1f5f9', padding:'2px 8px', borderRadius:4, fontFamily:'monospace', color:'var(--text-muted)', display:'inline-block', width:'fit-content' },
    courseName: { fontSize:'0.96rem', fontWeight:800, color:'var(--text-primary)', fontFamily:'var(--font-display)', lineHeight:1.25 },
    deptTag:    { display:'inline-block', padding:'3px 9px', borderRadius:6, fontSize:'0.68rem', fontWeight:700 },

    statsStrip: { display:'flex', gap:0, borderTop:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9' },
    statItem:   { flex:1, display:'flex', alignItems:'center', gap:5, padding:'8px 10px', fontSize:'0.72rem', color:'var(--text-secondary)', fontWeight:500, borderRight:'1px solid #f1f5f9' },

    enrollRow:  { display:'flex', alignItems:'center', padding:'10px 18px', gap:0 },
    enrollStat: { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
    enrollNum:  { fontSize:'1rem', fontWeight:900, fontFamily:'var(--font-display)' },
    enrollLbl:  { fontSize:'0.6rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.04em' },
    enrollDiv:  { width:1, height:28, background:'#e2e8f0' },

    barSection: { padding:'0 18px 10px' },
    barLabel:   { display:'flex', justifyContent:'space-between', marginBottom:5 },
    barTrack:   { height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden' },
    barFill:    { height:'100%', borderRadius:99, transition:'width 0.6s' },

    feeRow:     { display:'flex', alignItems:'center', gap:7, padding:'0 18px 8px', flexWrap:'wrap' },
    feePill:    { display:'inline-flex', alignItems:'baseline', gap:2, padding:'3px 10px', borderRadius:7, fontSize:'0.8rem', fontWeight:800 },
    ratingPill: { display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:700, color:'#92400e', background:'rgba(245,158,11,0.10)', padding:'3px 8px', borderRadius:6 },

    coordRow:   { display:'flex', alignItems:'center', gap:6, padding:'0 18px 10px' },
    coordName:  { fontSize:'0.7rem', color:'var(--text-muted)', fontWeight:500 },

    cardActions:{ display:'flex', gap:8, padding:'12px 18px', borderTop:'1px solid #f1f5f9', marginTop:'auto' },
    actionBtn:  { flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'8px 10px', borderRadius:9, fontSize:'0.74rem', fontWeight:700, cursor:'pointer', transition:'opacity 0.15s' },

    /* List */
    listIcon:   { width:36, height:36, borderRadius:9, display:'grid', placeItems:'center', flexShrink:0 },
};
