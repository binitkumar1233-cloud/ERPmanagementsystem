import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import ExportMenu from '../../components/common/ExportMenu.jsx';
import {
    Plus, Search, Edit2, Trash2, Phone, Mail, Eye,
    Users, GraduationCap, BookOpen, Award, LayoutList, LayoutGrid,
    ArrowUpDown, Filter, Building2, Star, Clock, Briefcase,
} from 'lucide-react';
import { getAvatarColor } from '../../utils/helpers.js';

const TEACHER_COLUMNS = [
    { label: 'Teacher ID',    key: 'id'            },
    { label: 'Name',          key: 'name'          },
    { label: 'Department',    key: 'dept'          },
    { label: 'Subject',       key: 'subject'       },
    { label: 'Designation',   key: 'designation'   },
    { label: 'Qualification', key: 'qualification' },
    { label: 'Experience',    key: 'exp', value: r => `${r.exp} yrs` },
    { label: 'Type',          key: 'type'          },
    { label: 'Campus',        key: 'campus'        },
    { label: 'Status',        key: 'status'        },
    { label: 'Rating',        key: 'rating'        },
    { label: 'Email',         key: 'email'         },
    { label: 'Phone',         key: 'phone'         },
    { label: 'Joined',        key: 'join'          },
];

const DATA = [
    { id: 'TCH001', name: 'Dr. Kavitha Rao',    dept: 'Computer Science',  subject: 'Data Structures',    phone: '9876001001', email: 'kavitha@school.edu', exp: 12, status: 'Active',   designation: 'Professor',            qualification: 'Ph.D',   type: 'Full-time', campus: 'Main',  classes: 18, rating: 4.8, join: '2012' },
    { id: 'TCH002', name: 'Prof. Arun Mishra',   dept: 'Mathematics',       subject: 'Calculus & Algebra', phone: '9876001002', email: 'arun@school.edu',    exp: 8,  status: 'Active',   designation: 'Associate Professor',  qualification: 'Ph.D',   type: 'Full-time', campus: 'Main',  classes: 16, rating: 4.6, join: '2016' },
    { id: 'TCH003', name: 'Mrs. Sunita Devi',    dept: 'English',           subject: 'English Literature', phone: '9876001003', email: 'sunita@school.edu',  exp: 15, status: 'Active',   designation: 'Senior Lecturer',      qualification: 'M.A',    type: 'Full-time', campus: 'North', classes: 20, rating: 4.9, join: '2009' },
    { id: 'TCH004', name: 'Mr. Rajan Pillai',    dept: 'Electronics',       subject: 'Digital Circuits',   phone: '9876001004', email: 'rajan@school.edu',   exp: 6,  status: 'Active',   designation: 'Assistant Professor',  qualification: 'M.Tech', type: 'Full-time', campus: 'Main',  classes: 14, rating: 4.3, join: '2018' },
    { id: 'TCH005', name: 'Dr. Priti Saxena',    dept: 'Chemistry',         subject: 'Organic Chemistry',  phone: '9876001005', email: 'priti@school.edu',   exp: 10, status: 'Inactive', designation: 'Associate Professor',  qualification: 'Ph.D',   type: 'Full-time', campus: 'South', classes: 0,  rating: 4.5, join: '2014' },
    { id: 'TCH006', name: 'Mr. Deepak Sharma',   dept: 'Commerce',          subject: 'Accountancy',        phone: '9876001006', email: 'deepak@school.edu',  exp: 4,  status: 'Active',   designation: 'Lecturer',             qualification: 'M.Com',  type: 'Full-time', campus: 'North', classes: 22, rating: 4.1, join: '2020' },
    { id: 'TCH007', name: 'Mrs. Lata Nayak',     dept: 'History',           subject: 'World History',      phone: '9876001007', email: 'lata@school.edu',    exp: 9,  status: 'Active',   designation: 'Assistant Professor',  qualification: 'M.A',    type: 'Full-time', campus: 'South', classes: 16, rating: 4.4, join: '2015' },
    { id: 'TCH008', name: 'Ms. Meera Iyer',      dept: 'Biology',           subject: 'Genetics',           phone: '9876001008', email: 'meera@school.edu',   exp: 7,  status: 'Active',   designation: 'Assistant Professor',  qualification: 'M.Sc',   type: 'Full-time', campus: 'Main',  classes: 15, rating: 4.7, join: '2017' },
    { id: 'TCH009', name: 'Mr. Rohit Verma',     dept: 'Physical Education',subject: 'Sports Science',     phone: '9876001009', email: 'rohit@school.edu',   exp: 5,  status: 'Active',   designation: 'Lecturer',             qualification: 'M.P.Ed', type: 'Contract',  campus: 'Main',  classes: 24, rating: 4.2, join: '2019' },
    { id: 'TCH010', name: 'Dr. Neha Joshi',      dept: 'Psychology',        subject: 'Child Development',  phone: '9876001010', email: 'neha@school.edu',    exp: 11, status: 'Active',   designation: 'Associate Professor',  qualification: 'Ph.D',   type: 'Full-time', campus: 'North', classes: 12, rating: 4.6, join: '2013' },
];

const DEPT_COLORS = {
    'Computer Science': '#2563eb', 'Mathematics': '#7c3aed', 'English': '#059669',
    'Electronics': '#0284c7', 'Chemistry': '#dc2626', 'Commerce': '#d97706',
    'History': '#92400e', 'Biology': '#059669', 'Physical Education': '#0891b2',
    'Psychology': '#7c3aed',
};
const QUAL_COLORS = {
    'Ph.D':   { color: '#7c3aed', bg: 'rgba(124,58,237,0.10)', border: 'rgba(124,58,237,0.25)' },
    'M.Tech': { color: '#2563eb', bg: 'rgba(37,99,235,0.10)',  border: 'rgba(37,99,235,0.25)'  },
    'M.Sc':   { color: '#059669', bg: 'rgba(5,150,105,0.10)',  border: 'rgba(5,150,105,0.25)'  },
    'M.A':    { color: '#d97706', bg: 'rgba(217,119,6,0.10)',  border: 'rgba(217,119,6,0.25)'  },
    'M.Com':  { color: '#ca8a04', bg: 'rgba(202,138,4,0.10)',  border: 'rgba(202,138,4,0.25)'  },
    'M.P.Ed': { color: '#0284c7', bg: 'rgba(2,132,199,0.10)',  border: 'rgba(2,132,199,0.25)'  },
};
const DESIG_RANK = { 'Professor': 4, 'Associate Professor': 3, 'Senior Lecturer': 3, 'Assistant Professor': 2, 'Lecturer': 1 };
const DESIG_COLORS = {
    'Professor':           { color: '#7c3aed', bg: 'rgba(124,58,237,0.09)' },
    'Associate Professor': { color: '#2563eb', bg: 'rgba(37,99,235,0.09)'  },
    'Senior Lecturer':     { color: '#059669', bg: 'rgba(5,150,105,0.09)'  },
    'Assistant Professor': { color: '#0284c7', bg: 'rgba(2,132,199,0.09)'  },
    'Lecturer':            { color: '#d97706', bg: 'rgba(217,119,6,0.09)'  },
};
const campusBadge = c => {
    const m = { Main: ['#2563eb','rgba(37,99,235,0.09)'], North: ['#059669','rgba(5,150,105,0.09)'], South: ['#7c3aed','rgba(124,58,237,0.09)'] };
    const [color,bg] = m[c] || ['#64748b','#f1f5f9'];
    return { display:'inline-block', padding:'2px 8px', borderRadius:5, fontSize:'0.64rem', fontWeight:700, color, background:bg };
};

const DEPTS = ['All', ...new Set(DATA.map(t => t.dept))];

export default function Teachers() {
    const navigate = useNavigate();
    const [q,    setQ]    = useState('');
    const [dept, setDept] = useState('All');
    const [sf,   setSF]   = useState('All');
    const [view, setView] = useState('table');
    const [sortKey, setSortKey] = useState('name');
    const [sortAsc, setSortAsc] = useState(true);

    const toggleSort = k => { if (sortKey===k) setSortAsc(a=>!a); else { setSortKey(k); setSortAsc(true); } };

    const filtered = DATA
        .filter(t => {
            const mq = !q || [t.name,t.dept,t.subject,t.designation,t.qualification].some(v=>v.toLowerCase().includes(q.toLowerCase()));
            const md = dept === 'All' || t.dept === dept;
            const ms = sf   === 'All' || t.status === sf;
            return mq && md && ms;
        })
        .sort((a,b) => {
            const va=a[sortKey], vb=b[sortKey];
            if (typeof va==='number') return sortAsc ? va-vb : vb-va;
            return sortAsc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
        });

    const SortTh = ({ label, k }) => (
        <th onClick={()=>toggleSort(k)} style={{ cursor:'pointer', userSelect:'none', whiteSpace:'nowrap' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                {label}
                <ArrowUpDown size={10} style={{ opacity: sortKey===k?1:0.3, color: sortKey===k?'#2563eb':'inherit' }} />
            </span>
        </th>
    );

    const phds  = DATA.filter(t=>t.qualification==='Ph.D').length;
    const depts = new Set(DATA.map(t=>t.dept)).size;

    return (
        <div className="erp-page">
            <Navbar title="Teachers" subtitle="Manage faculty and staff records" />

            {/* ── Hero KPI Cards ── */}
            <div style={S.heroGrid}>
                {[
                    { label:'Total Faculty',    value:DATA.length, icon:Users,         gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  sub:`${DATA.filter(t=>t.type==='Full-time').length} full-time · ${DATA.filter(t=>t.type==='Contract').length} contract` },
                    { label:'Active Faculty',   value:DATA.filter(t=>t.status==='Active').length, icon:Award, gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(16,185,129,0.28)', sub:`${Math.round(DATA.filter(t=>t.status==='Active').length/DATA.length*100)}% active rate` },
                    { label:'Ph.D Holders',     value:phds, icon:GraduationCap, gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(139,92,246,0.28)', sub:`${Math.round(phds/DATA.length*100)}% doctoral faculty` },
                    { label:'Departments',      value:depts, icon:Building2, gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', sub:'Across all campuses' },
                ].map(({ label, value, icon:Icon, gradient, glow, sub }) => (
                    <div key={label} style={{ ...S.heroCard, background:gradient, boxShadow:`0 8px 24px ${glow}` }}>
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
            <div style={S.chipRow}>
                <Filter size={13} color="var(--text-muted)" />
                <span style={S.chipRowLabel}>Department:</span>
                {DEPTS.map(d => {
                    const active = dept === d;
                    const color  = d === 'All' ? '#2563eb' : (DEPT_COLORS[d] || '#64748b');
                    return (
                        <button key={d}
                            style={{ ...S.chip, ...(active ? { background:`${color}16`, color, border:`1px solid ${color}38`, fontWeight:700 } : {}) }}
                            onClick={() => setDept(d)}
                        >
                            {d !== 'All' && <span style={{ ...S.chipDot, background:color }} />}
                            {d !== 'All' ? d.split(' ')[0] : 'All'}
                            {d !== 'All' && ` (${DATA.filter(t=>t.dept===d).length})`}
                        </button>
                    );
                })}
            </div>

            {/* ── Toolbar ── */}
            <div className="page-toolbar">
                <div className="toolbar-left">
                    <div className="search-box">
                        <Search size={14} />
                        <input placeholder="Search name, dept, subject, qualification…" value={q} onChange={e=>setQ(e.target.value)} />
                    </div>
                    <select className="filter-select" value={sf} onChange={e=>setSF(e.target.value)}>
                        <option value="All">All Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                    </select>
                </div>
                <div className="toolbar-right">
                    <div style={S.viewToggle}>
                        <button style={{ ...S.viewBtn, ...(view==='table' ? S.viewBtnOn : {}) }} onClick={()=>setView('table')} title="Table view"><LayoutList size={15}/></button>
                        <button style={{ ...S.viewBtn, ...(view==='card'  ? S.viewBtnOn : {}) }} onClick={()=>setView('card')}  title="Card view" ><LayoutGrid size={15}/></button>
                    </div>
                    <ExportMenu title="Teachers" rows={filtered} columns={TEACHER_COLUMNS} />
                    <Link to="/teachers/add" className="btn btn-primary btn-sm"><Plus size={14}/> Add Teacher</Link>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <h2>Faculty Records <span className="count-pill">{filtered.length}</span></h2>
                        <p>All registered teaching staff{dept!=='All'?` · ${dept}`:''}</p>
                    </div>
                </div>

                {/* ── TABLE VIEW ── */}
                {view === 'table' && (
                    <div style={{ overflowX:'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <SortTh label="Teacher"       k="name"        />
                                    <SortTh label="Department"    k="dept"        />
                                    <SortTh label="Designation"   k="designation" />
                                    <SortTh label="Subject"       k="subject"     />
                                    <SortTh label="Qualification" k="qualification"/>
                                    <th>Contact</th>
                                    <SortTh label="Exp."          k="exp"         />
                                    <SortTh label="Rating"        k="rating"      />
                                    <SortTh label="Status"        k="status"      />
                                    <th style={{ textAlign:'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(t => {
                                    const qc  = QUAL_COLORS[t.qualification] || { color:'#64748b', bg:'#f1f5f9', border:'#e2e8f0' };
                                    const dc  = DESIG_COLORS[t.designation]  || { color:'#64748b', bg:'#f1f5f9' };
                                    return (
                                        <tr key={t.id}>
                                            {/* Teacher */}
                                            <td>
                                                <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                                                    <div style={{ ...S.avatar, background:getAvatarColor(t.name) }}>{t.name[0]}</div>
                                                    <div>
                                                        <div style={S.tName}>{t.name}</div>
                                                        <div style={S.tMeta}>{t.id}</div>
                                                        <div style={S.tMeta}><span style={campusBadge(t.campus)}>{t.campus}</span></div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Dept */}
                                            <td>
                                                <span style={{ ...S.deptBadge, color: DEPT_COLORS[t.dept]||'#64748b', background:`${DEPT_COLORS[t.dept]||'#64748b'}14` }}>
                                                    {t.dept}
                                                </span>
                                            </td>
                                            {/* Designation */}
                                            <td>
                                                <span style={{ ...S.desigBadge, color:dc.color, background:dc.bg }}>
                                                    {t.designation}
                                                </span>
                                            </td>
                                            {/* Subject */}
                                            <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)', maxWidth:130 }}>{t.subject}</td>
                                            {/* Qualification */}
                                            <td>
                                                <span style={{ ...S.qualBadge, color:qc.color, background:qc.bg, border:`1px solid ${qc.border}` }}>
                                                    {t.qualification}
                                                </span>
                                            </td>
                                            {/* Contact */}
                                            <td>
                                                <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                                                    <span style={S.contactItem}><Phone size={10}/>{t.phone}</span>
                                                    <span style={S.contactItem}><Mail  size={10}/>{t.email}</span>
                                                </div>
                                            </td>
                                            {/* Experience */}
                                            <td>
                                                <div style={S.expCell}>
                                                    <div style={S.expTrack}>
                                                        <div style={{ ...S.expBar, width:`${Math.min(t.exp/20*100,100)}%`, background: t.exp>=10?'#2563eb':t.exp>=6?'#059669':'#d97706' }} />
                                                    </div>
                                                    <span style={{ fontSize:'0.74rem', fontWeight:700, color:'var(--text-primary)' }}>{t.exp}y</span>
                                                </div>
                                            </td>
                                            {/* Rating */}
                                            <td>
                                                <span style={S.ratingPill}>
                                                    <Star size={10} style={{ fill:'#f59e0b', color:'#f59e0b' }} /> {t.rating}
                                                </span>
                                            </td>
                                            {/* Status */}
                                            <td>
                                                <span className={`badge ${t.status==='Active'?'badge-success':'badge-neutral'}`}>{t.status}</span>
                                            </td>
                                            {/* Actions */}
                                            <td>
                                                <div style={{ display:'flex', gap:4, justifyContent:'flex-end' }}>
                                                    <button className="tbl-btn" title="View Profile" onClick={()=>navigate(`/teachers/${t.id}`)}><Eye   size={13}/></button>
                                                    <button className="tbl-btn" title="Edit"><Edit2  size={13}/></button>
                                                    <button className="tbl-btn danger" title="Delete"><Trash2 size={13}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon"><Users size={36}/></div>
                                <p>No teachers match your search.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* ── CARD VIEW ── */}
                {view === 'card' && (
                    <div style={S.cardGrid}>
                        {filtered.length === 0 && (
                            <div className="empty-state" style={{ gridColumn:'1/-1' }}>
                                <div className="empty-icon"><Users size={36}/></div>
                                <p>No teachers match your search.</p>
                            </div>
                        )}
                        {filtered.map(t => {
                            const deptColor = DEPT_COLORS[t.dept] || '#64748b';
                            const qc = QUAL_COLORS[t.qualification] || { color:'#64748b', bg:'#f1f5f9', border:'#e2e8f0' };
                            const dc = DESIG_COLORS[t.designation]  || { color:'#64748b', bg:'#f1f5f9' };
                            return (
                                <div key={t.id} style={S.facultyCard}>
                                    {/* Accent bar */}
                                    <div style={{ height:4, background:`linear-gradient(90deg,${deptColor},${deptColor}80)` }} />

                                    {/* Header */}
                                    <div style={S.fcHead}>
                                        <div style={{ ...S.fcAvatar, background:getAvatarColor(t.name) }}>{t.name[0]}</div>
                                        <div style={{ flex:1, minWidth:0 }}>
                                            <div style={S.fcName}>{t.name}</div>
                                            <div style={{ ...S.desigBadge, color:dc.color, background:dc.bg, marginTop:4, display:'inline-flex' }}>
                                                {t.designation}
                                            </div>
                                        </div>
                                        <span className={`badge ${t.status==='Active'?'badge-success':'badge-neutral'}`} style={{ flexShrink:0 }}>{t.status}</span>
                                    </div>

                                    {/* Dept + Qual row */}
                                    <div style={S.fcBadgeRow}>
                                        <span style={{ ...S.deptBadge, color:deptColor, background:`${deptColor}14`, fontSize:'0.67rem' }}>{t.dept}</span>
                                        <span style={{ ...S.qualBadge, color:qc.color, background:qc.bg, border:`1px solid ${qc.border}` }}>{t.qualification}</span>
                                        <span style={campusBadge(t.campus)}>{t.campus}</span>
                                        {t.type === 'Contract' && <span style={S.contractBadge}>Contract</span>}
                                    </div>

                                    {/* Subject + Classes */}
                                    <div style={S.fcInfoRow}>
                                        <div style={S.fcInfoItem}><BookOpen size={11} color="var(--text-muted)"/><span>{t.subject}</span></div>
                                        <div style={S.fcInfoItem}><Clock    size={11} color="var(--text-muted)"/><span>{t.classes} classes/wk</span></div>
                                    </div>

                                    {/* Contact */}
                                    <div style={S.fcInfoRow}>
                                        <div style={S.fcInfoItem}><Phone size={11} color="var(--text-muted)"/><span>{t.phone}</span></div>
                                        <div style={S.fcInfoItem}><Mail  size={11} color="var(--text-muted)"/><span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.email}</span></div>
                                    </div>

                                    {/* Stats strip */}
                                    <div style={S.fcStats}>
                                        <div style={S.fcStat}>
                                            <span style={{ ...S.fcStatVal, color:'#2563eb' }}>{t.exp}y</span>
                                            <span style={S.fcStatLbl}>Experience</span>
                                        </div>
                                        <div style={S.fcStatDiv}/>
                                        <div style={S.fcStat}>
                                            <span style={{ ...S.fcStatVal, color:'#f59e0b', display:'flex', alignItems:'center', gap:3 }}>
                                                <Star size={12} style={{ fill:'#f59e0b', color:'#f59e0b' }}/>{t.rating}
                                            </span>
                                            <span style={S.fcStatLbl}>Rating</span>
                                        </div>
                                        <div style={S.fcStatDiv}/>
                                        <div style={S.fcStat}>
                                            <span style={{ ...S.fcStatVal, color:'#7c3aed' }}>{t.join}</span>
                                            <span style={S.fcStatLbl}>Joined</span>
                                        </div>
                                    </div>

                                    {/* Experience bar */}
                                    <div style={S.fcExpRow}>
                                        <span style={S.fcExpLbl}>Experience progress</span>
                                        <div style={S.fcExpTrack}>
                                            <div style={{ ...S.fcExpBar, width:`${Math.min(t.exp/20*100,100)}%`, background:`linear-gradient(90deg,${deptColor}aa,${deptColor})` }} />
                                        </div>
                                        <span style={{ ...S.fcExpLbl, fontWeight:700 }}>{t.exp}/20y</span>
                                    </div>

                                    {/* Footer actions */}
                                    <div style={S.fcFooter}>
                                        <span style={{ fontSize:'0.64rem', color:'var(--text-muted)' }}>{t.id}</span>
                                        <div style={{ display:'flex', gap:5, marginLeft:'auto' }}>
                                            <button className="tbl-btn" title="View Profile" onClick={()=>navigate(`/teachers/${t.id}`)}><Eye   size={12}/></button>
                                            <button className="tbl-btn" title="Edit"><Edit2  size={12}/></button>
                                            <button className="tbl-btn danger" title="Delete"><Trash2 size={12}/></button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Styles ── */
const S = {
    /* Hero */
    heroGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:16 },
    heroCard: { borderRadius:14, padding:'18px 20px 14px', position:'relative', overflow:'hidden', color:'white' },
    heroTop:  { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
    heroIconBox: { width:40, height:40, borderRadius:11, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
    heroVal:  { fontSize:'2rem', fontFamily:'var(--font-display)', fontWeight:900 },
    heroLbl:  { fontSize:'0.77rem', fontWeight:600, opacity:0.9, marginBottom:2 },
    heroSub:  { fontSize:'0.65rem', opacity:0.55 },
    heroShine:{ position:'absolute', top:0, right:0, width:'45%', height:'100%', background:'rgba(255,255,255,0.055)', clipPath:'polygon(30% 0, 100% 0, 100% 100%, 60% 100%)', pointerEvents:'none' },

    /* Chips */
    chipRow:      { display:'flex', alignItems:'center', gap:7, marginBottom:14, flexWrap:'wrap' },
    chipRowLabel: { fontSize:'0.72rem', fontWeight:600, color:'var(--text-muted)', marginRight:2 },
    chip:         { display:'inline-flex', alignItems:'center', gap:5, padding:'5px 12px', borderRadius:20, fontSize:'0.71rem', fontWeight:500, color:'var(--text-muted)', background:'white', border:'1px solid var(--border)', cursor:'pointer', transition:'all 0.15s' },
    chipDot:      { width:7, height:7, borderRadius:'50%', flexShrink:0 },

    /* View toggle */
    viewToggle: { display:'flex', background:'var(--bg-hover)', borderRadius:9, padding:3, gap:2, border:'1px solid var(--border)' },
    viewBtn:    { width:30, height:30, borderRadius:7, border:'none', background:'transparent', color:'var(--text-muted)', cursor:'pointer', display:'grid', placeItems:'center', transition:'all 0.15s' },
    viewBtnOn:  { background:'white', color:'#2563eb', boxShadow:'0 1px 4px rgba(0,0,0,0.1)' },

    /* Table cells */
    avatar:      { width:38, height:38, borderRadius:10, display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.9rem', flexShrink:0 },
    tName:       { fontWeight:700, fontSize:'0.86rem', color:'var(--text-primary)' },
    tMeta:       { fontSize:'0.67rem', color:'var(--text-muted)', marginTop:2 },
    deptBadge:   { display:'inline-block', padding:'3px 9px', borderRadius:6, fontSize:'0.71rem', fontWeight:700 },
    desigBadge:  { display:'inline-block', padding:'3px 9px', borderRadius:6, fontSize:'0.69rem', fontWeight:700 },
    qualBadge:   { display:'inline-block', padding:'3px 9px', borderRadius:6, fontSize:'0.71rem', fontWeight:700 },
    contactItem: { display:'flex', alignItems:'center', gap:5, fontSize:'0.73rem', color:'var(--text-muted)' },
    expCell:     { display:'flex', alignItems:'center', gap:7 },
    expTrack:    { width:50, height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' },
    expBar:      { height:'100%', borderRadius:99 },
    ratingPill:  { display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.75rem', fontWeight:700, color:'#92400e', background:'rgba(245,158,11,0.10)', padding:'3px 8px', borderRadius:6 },

    /* Card grid */
    cardGrid:     { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:16, padding:'16px 20px 20px' },
    facultyCard:  { background:'white', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden' },
    fcHead:       { display:'flex', alignItems:'center', gap:11, padding:'14px 16px 10px' },
    fcAvatar:     { width:44, height:44, borderRadius:12, display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'1rem', flexShrink:0 },
    fcName:       { fontWeight:700, fontSize:'0.86rem', color:'var(--text-primary)', lineHeight:1.2 },
    fcBadgeRow:   { display:'flex', flexWrap:'wrap', gap:5, padding:'0 16px 10px' },
    fcInfoRow:    { display:'flex', gap:16, padding:'0 16px 8px', flexWrap:'wrap' },
    fcInfoItem:   { display:'flex', alignItems:'center', gap:5, fontSize:'0.73rem', color:'var(--text-secondary)' },
    contractBadge:{ display:'inline-block', padding:'2px 8px', borderRadius:5, fontSize:'0.64rem', fontWeight:700, color:'#dc2626', background:'rgba(220,38,38,0.08)' },

    /* Card stats */
    fcStats:    { display:'flex', alignItems:'center', padding:'10px 16px', borderTop:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9' },
    fcStat:     { flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 },
    fcStatVal:  { fontWeight:800, fontSize:'0.88rem', fontFamily:'var(--font-display)' },
    fcStatLbl:  { fontSize:'0.58rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.04em' },
    fcStatDiv:  { width:1, height:28, background:'#e2e8f0', flexShrink:0 },

    /* Card experience bar */
    fcExpRow:   { display:'flex', alignItems:'center', gap:8, padding:'10px 16px' },
    fcExpLbl:   { fontSize:'0.63rem', color:'var(--text-muted)', whiteSpace:'nowrap' },
    fcExpTrack: { flex:1, height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' },
    fcExpBar:   { height:'100%', borderRadius:99 },

    /* Card footer */
    fcFooter:   { display:'flex', alignItems:'center', padding:'10px 16px', background:'#fafbfc', borderTop:'1px solid #f1f5f9' },
};
