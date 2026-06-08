import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import ExportMenu from '../../components/common/ExportMenu.jsx';
import {
    Plus, Search, Eye, ChevronLeft, ChevronRight,
    CheckCircle, XCircle, Clock, Award, FileText, UserCheck,
    Check, X, ClipboardList, Users, TrendingUp, Ban,
    BookOpen, Filter,
} from 'lucide-react';
import { getAvatarColor } from '../../utils/helpers.js';

const ADMISSION_COLUMNS = [
    { label: 'App ID',     key: 'id'       },
    { label: 'Name',       key: 'name'     },
    { label: 'Email',      key: 'email'    },
    { label: 'Phone',      key: 'phone'    },
    { label: 'Gender',     key: 'gender'   },
    { label: 'Category',   key: 'category' },
    { label: 'Course',     key: 'course'   },
    { label: '10th %',     key: 'score10'  },
    { label: '12th %',     key: 'score12'  },
    { label: 'Ent. Score', key: 'entScore' },
    { label: 'Total',      key: 'total'    },
    { label: 'Applied On', key: 'applied'  },
    { label: 'Status',     key: 'status'   },
];

const MERIT_COLUMNS = [
    { label: 'Rank',       key: 'rank'     },
    { label: 'App ID',     key: 'id'       },
    { label: 'Name',       key: 'name'     },
    { label: 'Course',     key: 'course'   },
    { label: 'Category',   key: 'category' },
    { label: '10th %',     key: 'score10'  },
    { label: '12th %',     key: 'score12'  },
    { label: 'Ent. Score', key: 'entScore' },
    { label: 'Total',      key: 'total'    },
    { label: 'Status',     key: 'st'       },
];

/* ══════════════════════════════ DATA ══════════════════════════════ */
const APPS = [
    { id:'APP2026001', name:'Priyanka Sharma', email:'priyanka.s@gmail.com', phone:'9812345678', gender:'Female', category:'General', course:'B.Tech CSE',           score10:95.2, score12:91.4, entScore:82, total:89.5, applied:'2026-04-28', status:'Accepted',     docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:true,  cc:true  } },
    { id:'APP2026002', name:'Rahul Gupta',      email:'rahul.g@gmail.com',    phone:'9823456789', gender:'Male',   category:'General', course:'B.Tech CSE',           score10:92.4, score12:88.6, entScore:76, total:85.7, applied:'2026-05-02', status:'Merit Listed', docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:false, cc:true  } },
    { id:'APP2026003', name:'Sneha Patel',      email:'sneha.p@gmail.com',    phone:'9834567890', gender:'Female', category:'OBC',     course:'B.Sc Computer Science',score10:89.8, score12:86.2, entScore:71, total:82.3, applied:'2026-05-05', status:'Merit Listed', docs:{photo:true,  idProof:false, marks10:true,  marks12:true,  tc:true,  cc:false } },
    { id:'APP2026004', name:'Arjun Nair',       email:'arjun.n@gmail.com',    phone:'9845678901', gender:'Male',   category:'General', course:'B.Tech ECE',           score10:87.6, score12:84.0, entScore:68, total:79.5, applied:'2026-05-08', status:'Under Review', docs:{photo:true,  idProof:true,  marks10:true,  marks12:false, tc:false, cc:false } },
    { id:'APP2026005', name:'Meera Iyer',       email:'meera.i@gmail.com',    phone:'9856789012', gender:'Female', category:'SC',      course:'B.A English',          score10:91.2, score12:89.0, entScore:74, total:84.8, applied:'2026-05-10', status:'Merit Listed', docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:true,  cc:true  } },
    { id:'APP2026006', name:'Karan Mehta',      email:'karan.m@gmail.com',    phone:'9867890123', gender:'Male',   category:'General', course:'MBA',                  score10:88.0, score12:85.5, entScore:72, total:81.7, applied:'2026-05-12', status:'Applied',      docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:false, cc:false } },
    { id:'APP2026007', name:'Divya Reddy',      email:'divya.r@gmail.com',    phone:'9878901234', gender:'Female', category:'OBC',     course:'B.Com Honours',        score10:93.6, score12:90.2, entScore:79, total:87.5, applied:'2026-05-14', status:'Accepted',     docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:true,  cc:true  } },
    { id:'APP2026008', name:'Vikram Singh',     email:'vikram.s@gmail.com',   phone:'9889012345', gender:'Male',   category:'General', course:'B.Tech CSE',           score10:78.4, score12:75.2, entScore:59, total:70.5, applied:'2026-05-15', status:'Rejected',     docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:true,  cc:true  } },
    { id:'APP2026009', name:'Aisha Khan',       email:'aisha.k@gmail.com',    phone:'9890123456', gender:'Female', category:'General', course:'M.Sc Mathematics',     score10:96.8, score12:94.0, entScore:88, total:92.8, applied:'2026-05-01', status:'Accepted',     docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:true,  cc:true  } },
    { id:'APP2026010', name:'Ravi Teja',        email:'ravi.t@gmail.com',     phone:'9901234567', gender:'Male',   category:'SC',      course:'B.Tech ECE',           score10:84.2, score12:81.0, entScore:65, total:76.7, applied:'2026-05-18', status:'Under Review', docs:{photo:false, idProof:true,  marks10:true,  marks12:true,  tc:false, cc:false } },
    { id:'APP2026011', name:'Pooja Verma',      email:'pooja.v@gmail.com',    phone:'9912345678', gender:'Female', category:'General', course:'B.A History',          score10:86.4, score12:83.8, entScore:69, total:79.3, applied:'2026-05-20', status:'Applied',      docs:{photo:true,  idProof:false, marks10:true,  marks12:false, tc:false, cc:false } },
    { id:'APP2026012', name:'Nikhil Joshi',     email:'nikhil.j@gmail.com',   phone:'9923456789', gender:'Male',   category:'OBC',     course:'B.Sc Physics',         score10:90.0, score12:87.6, entScore:73, total:83.5, applied:'2026-05-22', status:'Merit Listed', docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:true,  cc:false } },
    { id:'APP2026013', name:'Sanya Gupta',      email:'sanya.g@gmail.com',    phone:'9934567890', gender:'Female', category:'ST',      course:'B.Com Honours',        score10:82.6, score12:79.4, entScore:63, total:74.7, applied:'2026-05-24', status:'Waitlisted',   docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:false, cc:true  } },
    { id:'APP2026014', name:'Akash Dubey',      email:'akash.d@gmail.com',    phone:'9945678901', gender:'Male',   category:'General', course:'M.Tech CSE',           score10:94.4, score12:92.0, entScore:85, total:90.5, applied:'2026-04-25', status:'Accepted',     docs:{photo:true,  idProof:true,  marks10:true,  marks12:true,  tc:true,  cc:true  } },
    { id:'APP2026015', name:'Tanya Bhatt',      email:'tanya.b@gmail.com',    phone:'9956789012', gender:'Female', category:'General', course:'B.Tech CSE',           score10:88.8, score12:85.0, entScore:71, total:81.5, applied:'2026-05-26', status:'Applied',      docs:{photo:true,  idProof:true,  marks10:false, marks12:false, tc:false, cc:false } },
];

const STATUS_CFG = {
    'Applied':      { color:'#64748b', bg:'rgba(100,116,139,0.09)', border:'rgba(100,116,139,0.25)', label:'Applied'       },
    'Under Review': { color:'#d97706', bg:'rgba(217,119,6,0.09)',   border:'rgba(217,119,6,0.3)',    label:'Under Review'  },
    'Merit Listed': { color:'#7c3aed', bg:'rgba(124,58,237,0.09)',  border:'rgba(124,58,237,0.3)',   label:'Merit Listed'  },
    'Accepted':     { color:'#059669', bg:'rgba(5,150,105,0.09)',   border:'rgba(5,150,105,0.3)',    label:'Accepted'      },
    'Rejected':     { color:'#dc2626', bg:'rgba(220,38,38,0.09)',   border:'rgba(220,38,38,0.3)',    label:'Rejected'      },
    'Waitlisted':   { color:'#0284c7', bg:'rgba(2,132,199,0.09)',   border:'rgba(2,132,199,0.3)',    label:'Waitlisted'    },
};

const DOCS = [
    { key:'photo',   label:'Photo'          },
    { key:'idProof', label:'ID Proof'       },
    { key:'marks10', label:'10th Marks'     },
    { key:'marks12', label:'12th Marks'     },
    { key:'tc',      label:'Transfer Cert.' },
    { key:'cc',      label:'Character Cert.'},
];

const CAT_COLOR = { General:'#1e40af', OBC:'#7c3aed', SC:'#d97706', ST:'#059669' };
const SCORE_GRAD = s => s>=85?'linear-gradient(90deg,#059669,#10b981)':s>=70?'linear-gradient(90deg,#d97706,#f59e0b)':'linear-gradient(90deg,#dc2626,#ef4444)';
const SCORE_COL  = s => s>=85?'#059669':s>=70?'#d97706':'#dc2626';
const MEDAL = ['🥇','🥈','🥉'];
const PER_PAGE = 6;

const StatusPill = ({ status }) => {
    const cfg = STATUS_CFG[status] || STATUS_CFG['Applied'];
    return (
        <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 11px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, whiteSpace:'nowrap' }}>
            {cfg.label}
        </span>
    );
};

/* ══════════════════════════════ COMPONENT ══════════════════════════════ */
export default function Admissions() {
    const [tab, setTab]           = useState('applications');
    const [q, setQ]               = useState('');
    const [courseFilter, setCF]   = useState('All');
    const [statusFilter, setSF]   = useState('All');
    const [page, setPage]         = useState(1);
    const [meritCourse, setMC]    = useState('All');
    const [docCourse, setDC]      = useState('All');
    const [statuses, setStatuses] = useState(Object.fromEntries(APPS.map(a=>[a.id,a.status])));

    const updateStatus = (id, next) => setStatuses(p=>({...p,[id]:next}));
    const uniqueCourses = [...new Set(APPS.map(a=>a.course))].sort();
    const cnt = s => APPS.filter(a=>statuses[a.id]===s).length;

    /* Applications tab */
    const filtered = APPS.filter(a=>{
        const mq = a.name.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase()) || a.course.toLowerCase().includes(q.toLowerCase());
        const mc = courseFilter==='All'||a.course===courseFilter;
        const ms = statusFilter==='All'||statuses[a.id]===statusFilter;
        return mq&&mc&&ms;
    });
    const pages   = Math.ceil(filtered.length/PER_PAGE);
    const visible = filtered.slice((page-1)*PER_PAGE, page*PER_PAGE);

    /* Merit list */
    const meritList = [...APPS]
        .filter(a=>!['Applied','Rejected'].includes(statuses[a.id]))
        .filter(a=>meritCourse==='All'||a.course===meritCourse)
        .sort((a,b)=>b.total-a.total)
        .map((a,i)=>({...a,rank:i+1,st:statuses[a.id]}));

    /* Doc verification */
    const docList = APPS
        .filter(a=>docCourse==='All'||a.course===docCourse)
        .map(a=>({...a,verified:DOCS.filter(d=>a.docs[d.key]).length}));

    return (
        <div className="erp-page">
            <Navbar title="Admissions & Onboarding" subtitle="Manage applications, merit list, and document verification" />

            {/* ── Hero KPI Cards ── */}
            <div style={S.heroGrid}>
                {[
                    { label:'Total Applications', value:APPS.length,           icon:FileText,  gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  sub:'This academic year' },
                    { label:'Under Review',        value:cnt('Under Review'),   icon:Clock,     gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', sub:'Awaiting decision' },
                    { label:'Merit Listed',        value:cnt('Merit Listed'),   icon:Award,     gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.28)', sub:'Qualified applicants' },
                    { label:'Accepted',            value:cnt('Accepted'),       icon:UserCheck, gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(5,150,105,0.28)',  sub:'Seats confirmed' },
                    { label:'Rejected',            value:cnt('Rejected'),       icon:Ban,       gradient:'linear-gradient(135deg,#7f1d1d,#dc2626)', glow:'rgba(220,38,38,0.28)',  sub:`${Math.round(cnt('Rejected')/APPS.length*100)}% rejection rate` },
                    { label:'Waitlisted',          value:cnt('Waitlisted'),     icon:Users,     gradient:'linear-gradient(135deg,#0c4a6e,#0284c7)', glow:'rgba(2,132,199,0.28)',  sub:'Pending seat availability' },
                ].map(({ label, value, icon:Icon, gradient, glow, sub })=>(
                    <div key={label} style={{ ...S.heroCard, background:gradient, boxShadow:`0 8px 24px ${glow}` }}>
                        <div style={S.heroTop}>
                            <div style={S.heroIconBox}><Icon size={18} strokeWidth={2} color="white"/></div>
                            <div style={S.heroVal}>{value}</div>
                        </div>
                        <div style={S.heroLbl}>{label}</div>
                        <div style={S.heroSub}>{sub}</div>
                        <div style={S.heroShine}/>
                    </div>
                ))}
            </div>

            {/* ── Tab Bar ── */}
            <div style={S.tabBar}>
                {[
                    { key:'applications', label:'Applications',          icon:FileText      },
                    { key:'merit',        label:'Merit List',            icon:Award         },
                    { key:'documents',    label:'Document Verification', icon:ClipboardList },
                ].map(t=>{
                    const active = tab===t.key;
                    return (
                        <button key={t.key} style={{ ...S.tab, ...(active?S.tabActive:{}) }} onClick={()=>setTab(t.key)}>
                            <t.icon size={15} strokeWidth={active?2.5:2}/>
                            {t.label}
                            {active && <span style={S.tabDot}/>}
                        </button>
                    );
                })}
                <div style={{ marginLeft:'auto' }}>
                    <Link to="/admissions/apply" className="btn btn-primary btn-sm">
                        <Plus size={14}/> New Application
                    </Link>
                </div>
            </div>

            {/* ════════════════════════════════════════
                TAB: APPLICATIONS
            ════════════════════════════════════════ */}
            {tab==='applications' && (
                <>
                    {/* Status filter chips */}
                    <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
                        {['All',...Object.keys(STATUS_CFG)].map(s=>{
                            const on  = statusFilter===s;
                            const cfg = s!=='All'?STATUS_CFG[s]:null;
                            const count = s==='All'?APPS.length:APPS.filter(a=>statuses[a.id]===s).length;
                            return (
                                <button key={s} onClick={()=>{ setSF(s); setPage(1); }} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:99, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:`1.5px solid ${on&&cfg?cfg.border:on?'rgba(37,99,235,0.4)':'var(--border)'}`, background:on&&cfg?cfg.bg:on?'rgba(37,99,235,0.08)':'white', color:on&&cfg?cfg.color:on?'#2563eb':'var(--text-muted)', transition:'all 0.15s' }}>
                                    {s!=='All'&&cfg&&<span style={{ width:7, height:7, borderRadius:'50%', background:cfg.color }}/>}
                                    {s}<span style={{ background:on&&cfg?cfg.color:on?'#2563eb':'#e2e8f0', color:'white', fontSize:'0.6rem', fontWeight:800, padding:'1px 6px', borderRadius:99 }}>{count}</span>
                                </button>
                            );
                        })}
                        <div style={{ flex:1 }}/>
                        {/* Search + course filter */}
                        <div style={S.searchWrap}>
                            <Search size={14} color="var(--text-muted)"/>
                            <input style={S.searchInput} placeholder="Search by name, ID or course…" value={q} onChange={e=>{ setQ(e.target.value); setPage(1); }}/>
                            {q && <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', padding:2 }} onClick={()=>setQ('')}><X size={12}/></button>}
                        </div>
                        <select style={S.sel} value={courseFilter} onChange={e=>{ setCF(e.target.value); setPage(1); }}>
                            <option value="All">All Courses</option>
                            {uniqueCourses.map(c=><option key={c}>{c}</option>)}
                        </select>
                        <ExportMenu title="Admissions" rows={filtered} columns={ADMISSION_COLUMNS} />
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Applications <span style={S.pill}>{filtered.length}</span></h2>
                                <p>Showing {visible.length} of {filtered.length} results</p>
                            </div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        <th>Course</th>
                                        <th>Category</th>
                                        <th>Composite Score</th>
                                        <th>Applied On</th>
                                        <th>Status</th>
                                        <th style={{ textAlign:'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visible.map(a=>{
                                        const st  = statuses[a.id];
                                        const cc  = CAT_COLOR[a.category]||'#475569';
                                        return (
                                            <tr key={a.id}>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ width:40, height:40, borderRadius:11, background:getAvatarColor(a.name), display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.9rem', flexShrink:0 }}>{a.name[0]}</div>
                                                        <div>
                                                            <div style={{ fontWeight:700, color:'var(--text-primary)', fontSize:'0.85rem' }}>{a.name}</div>
                                                            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:1 }}>{a.id} · {a.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize:'0.82rem', maxWidth:170 }}>{a.course}</td>
                                                <td>
                                                    <span style={{ padding:'4px 10px', borderRadius:99, fontSize:'0.71rem', fontWeight:700, background:`${cc}16`, color:cc, border:`1px solid ${cc}30` }}>{a.category}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                        <div style={{ width:60, height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden', flexShrink:0 }}>
                                                            <div style={{ height:'100%', width:`${a.total}%`, background:SCORE_GRAD(a.total), borderRadius:99 }}/>
                                                        </div>
                                                        <span style={{ fontWeight:800, fontSize:'0.84rem', color:SCORE_COL(a.total) }}>{a.total}%</span>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize:'0.82rem' }}>{new Date(a.applied).toLocaleDateString('en-IN')}</td>
                                                <td><StatusPill status={st}/></td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        <button style={S.tblBtn} title="View"><Eye size={13}/></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {visible.length===0&&(
                                <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' }}>
                                    <Search size={36} style={{ opacity:0.15, marginBottom:10 }}/>
                                    <p style={{ fontSize:'0.84rem' }}>No applications match your search.</p>
                                </div>
                            )}
                        </div>
                        {pages>1&&(
                            <div style={S.pagination}>
                                <span style={{ color:'var(--text-secondary)', fontSize:'0.82rem' }}>Page {page} of {pages} · {filtered.length} results</span>
                                <div style={{ display:'flex', gap:5 }}>
                                    <button style={{ ...S.pageBtn, opacity:page===1?0.4:1 }} disabled={page===1} onClick={()=>setPage(p=>p-1)}><ChevronLeft size={14}/> Prev</button>
                                    {Array.from({length:pages},(_,i)=>(
                                        <button key={i+1} style={{ ...S.pageBtn, ...(page===i+1?S.pageBtnActive:{}) }} onClick={()=>setPage(i+1)}>{i+1}</button>
                                    ))}
                                    <button style={{ ...S.pageBtn, opacity:page===pages?0.4:1 }} disabled={page===pages} onClick={()=>setPage(p=>p+1)}>Next <ChevronRight size={14}/></button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* ════════════════════════════════════════
                TAB: MERIT LIST
            ════════════════════════════════════════ */}
            {tab==='merit'&&(
                <>
                    {/* Score legend */}
                    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14, flexWrap:'wrap' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <label style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)' }}>Course</label>
                            <select style={S.sel} value={meritCourse} onChange={e=>setMC(e.target.value)}>
                                <option value="All">All Courses</option>
                                {uniqueCourses.map(c=><option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ display:'flex', gap:10 }}>
                            {[{ label:'≥ 85% Excellent', color:'#059669' },{ label:'70–85% Good', color:'#d97706' },{ label:'< 70% Average', color:'#dc2626' }].map(l=>(
                                <div key={l.label} style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.71rem', color:'var(--text-muted)' }}>
                                    <span style={{ width:10, height:10, borderRadius:3, background:l.color, display:'inline-block' }}/>{l.label}
                                </div>
                            ))}
                        </div>
                        <div style={{ flex:1 }}/>
                        <ExportMenu title="Merit_List" rows={meritList} columns={MERIT_COLUMNS} />
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Merit List <span style={S.pill}>{meritList.length}</span></h2>
                                <p>Ranked by composite score — 10th 30% + 12th 30% + Entrance 40%</p>
                            </div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width:64 }}>Rank</th>
                                        <th>Applicant</th>
                                        <th>Course</th>
                                        <th style={{ textAlign:'center' }}>10th %</th>
                                        <th style={{ textAlign:'center' }}>12th %</th>
                                        <th style={{ textAlign:'center' }}>Entrance</th>
                                        <th>Total Score</th>
                                        <th>Status</th>
                                        <th style={{ textAlign:'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {meritList.map(a=>{
                                        const rc = a.rank===1?'#f59e0b':a.rank===2?'#94a3b8':a.rank===3?'#b45309':'#94a3b8';
                                        return (
                                            <tr key={a.id} style={{ background:a.rank<=3?`rgba(${a.rank===1?'245,158,11':a.rank===2?'148,163,184':'180,83,9'},0.03)`:'white' }}>
                                                <td style={{ textAlign:'center' }}>
                                                    {a.rank<=3
                                                        ? <span style={{ fontSize:'1.35rem' }}>{MEDAL[a.rank-1]}</span>
                                                        : <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:30, height:30, borderRadius:8, background:'#f1f5f9', fontSize:'0.75rem', fontWeight:800, color:'var(--text-muted)' }}>#{a.rank}</span>
                                                    }
                                                </td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ width:38, height:38, borderRadius:10, background:getAvatarColor(a.name), display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.88rem', flexShrink:0 }}>{a.name[0]}</div>
                                                        <div>
                                                            <div style={{ fontWeight:700, fontSize:'0.84rem', color:'var(--text-primary)' }}>{a.name}</div>
                                                            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:1 }}>{a.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize:'0.82rem', maxWidth:160 }}>{a.course}</td>
                                                <td style={{ textAlign:'center', fontWeight:700, fontSize:'0.84rem' }}>{a.score10}%</td>
                                                <td style={{ textAlign:'center', fontWeight:700, fontSize:'0.84rem' }}>{a.score12}%</td>
                                                <td style={{ textAlign:'center', fontWeight:700, fontSize:'0.84rem' }}>{a.entScore}/100</td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                        <div style={{ width:60, height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                            <div style={{ height:'100%', width:`${a.total}%`, background:SCORE_GRAD(a.total), borderRadius:99 }}/>
                                                        </div>
                                                        <span style={{ fontFamily:'var(--font-display)', fontWeight:900, fontSize:'0.92rem', color:SCORE_COL(a.total) }}>{a.total}%</span>
                                                    </div>
                                                </td>
                                                <td><StatusPill status={a.st}/></td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        {a.st!=='Accepted'&&(
                                                            <button style={{ ...S.tblBtn, ...S.tblBtnSuccess }} title="Accept" onClick={()=>updateStatus(a.id,'Accepted')}><Check size={13}/></button>
                                                        )}
                                                        {a.st!=='Waitlisted'&&a.st!=='Accepted'&&(
                                                            <button style={S.tblBtn} title="Waitlist" onClick={()=>updateStatus(a.id,'Waitlisted')}><Clock size={13}/></button>
                                                        )}
                                                        {a.st!=='Rejected'&&(
                                                            <button style={{ ...S.tblBtn, ...S.tblBtnDanger }} title="Reject" onClick={()=>updateStatus(a.id,'Rejected')}><X size={13}/></button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {meritList.length===0&&(
                                <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' }}>
                                    <Award size={36} style={{ opacity:0.15, marginBottom:10 }}/>
                                    <p style={{ fontSize:'0.84rem' }}>No applicants in the merit list for the selected course.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* ════════════════════════════════════════
                TAB: DOCUMENT VERIFICATION
            ════════════════════════════════════════ */}
            {tab==='documents'&&(
                <>
                    {/* Doc stats chips */}
                    <div style={{ display:'flex', gap:10, marginBottom:14, alignItems:'center', flexWrap:'wrap' }}>
                        {[
                            { label:'All Docs Submitted', value:docList.filter(a=>a.verified===DOCS.length).length, color:'#059669', bg:'rgba(5,150,105,0.09)', border:'rgba(5,150,105,0.25)' },
                            { label:'Partially Submitted', value:docList.filter(a=>a.verified>0&&a.verified<DOCS.length).length, color:'#d97706', bg:'rgba(217,119,6,0.09)', border:'rgba(217,119,6,0.25)' },
                            { label:'No Docs',            value:docList.filter(a=>a.verified===0).length, color:'#dc2626', bg:'rgba(220,38,38,0.09)', border:'rgba(220,38,38,0.25)' },
                        ].map(c=>(
                            <div key={c.label} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 14px', borderRadius:99, background:c.bg, border:`1px solid ${c.border}`, fontSize:'0.78rem' }}>
                                <span style={{ fontWeight:900, color:c.color, fontSize:'1.05rem' }}>{c.value}</span>
                                <span style={{ color:c.color, fontWeight:600 }}>{c.label}</span>
                            </div>
                        ))}
                        <div style={{ flex:1 }}/>
                        <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:'0.74rem', color:'var(--text-muted)', padding:'8px 14px', background:'white', border:'1px solid var(--border)', borderRadius:10 }}>
                            <CheckCircle size={13} color="#059669"/> Submitted
                            <XCircle size={13} color="#dc2626"/> Missing
                        </div>
                        <select style={S.sel} value={docCourse} onChange={e=>setDC(e.target.value)}>
                            <option value="All">All Courses</option>
                            {uniqueCourses.map(c=><option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Document Verification <span style={S.pill}>{docList.length}</span></h2>
                                <p>Track submission status of required documents per applicant</p>
                            </div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Applicant</th>
                                        {DOCS.map(d=><th key={d.key} style={{ textAlign:'center', whiteSpace:'nowrap' }}>{d.label}</th>)}
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {docList.map(a=>{
                                        const pct = Math.round(a.verified/DOCS.length*100);
                                        const pc  = a.verified===DOCS.length?'#059669':a.verified>=4?'#d97706':'#dc2626';
                                        const grad = a.verified===DOCS.length?'linear-gradient(90deg,#059669,#10b981)':a.verified>=4?'linear-gradient(90deg,#d97706,#f59e0b)':'linear-gradient(90deg,#dc2626,#ef4444)';
                                        return (
                                            <tr key={a.id} style={{ background:a.verified===DOCS.length?'rgba(5,150,105,0.02)':'white' }}>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ width:38, height:38, borderRadius:10, background:getAvatarColor(a.name), display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.88rem', flexShrink:0 }}>{a.name[0]}</div>
                                                        <div>
                                                            <div style={{ fontWeight:700, fontSize:'0.84rem', color:'var(--text-primary)' }}>{a.name}</div>
                                                            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:1 }}>{a.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                {DOCS.map(d=>(
                                                    <td key={d.key} style={{ textAlign:'center' }}>
                                                        {a.docs[d.key]
                                                            ? <div style={{ width:26, height:26, borderRadius:7, background:'rgba(5,150,105,0.12)', display:'grid', placeItems:'center', margin:'0 auto' }}><CheckCircle size={14} color="#059669"/></div>
                                                            : <div style={{ width:26, height:26, borderRadius:7, background:'rgba(220,38,38,0.10)', display:'grid', placeItems:'center', margin:'0 auto' }}><XCircle size={14} color="#dc2626"/></div>
                                                        }
                                                    </td>
                                                ))}
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:110 }}>
                                                        <div style={{ flex:1, height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                            <div style={{ height:'100%', width:`${pct}%`, background:grad, borderRadius:99 }}/>
                                                        </div>
                                                        <span style={{ fontSize:'0.75rem', fontWeight:800, color:pc, flexShrink:0 }}>{a.verified}/{DOCS.length}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                tbody tr:hover td { background: rgba(37,99,235,0.025) !important; }
                @media(max-width:1100px){ .hero-6{ grid-template-columns:repeat(3,1fr)!important; } }
                @media(max-width:640px){  .hero-6{ grid-template-columns:repeat(2,1fr)!important; } }
            `}</style>
        </div>
    );
}

/* ══ STYLES ══ */
const S = {
    heroGrid:    { display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12, marginBottom:18 },
    heroCard:    { borderRadius:14, padding:'16px 18px 12px', position:'relative', overflow:'hidden', color:'white' },
    heroTop:     { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 },
    heroIconBox: { width:38, height:38, borderRadius:10, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
    heroVal:     { fontSize:'1.7rem', fontFamily:'var(--font-display)', fontWeight:900 },
    heroLbl:     { fontSize:'0.72rem', fontWeight:600, opacity:0.9, marginBottom:2 },
    heroSub:     { fontSize:'0.62rem', opacity:0.55, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
    heroShine:   { position:'absolute', top:0, right:0, width:'45%', height:'100%', background:'rgba(255,255,255,0.055)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' },

    tabBar:    { display:'flex', alignItems:'center', gap:2, background:'white', border:'1px solid var(--border)', borderRadius:12, padding:'6px 8px', marginBottom:18, boxShadow:'var(--shadow-sm)' },
    tab:       { display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:9, border:'none', background:'none', color:'var(--text-muted)', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', transition:'all 0.15s', position:'relative' },
    tabActive: { background:'rgba(37,99,235,0.08)', color:'#2563eb' },
    tabDot:    { position:'absolute', bottom:5, left:'50%', transform:'translateX(-50%)', width:4, height:4, borderRadius:'50%', background:'#2563eb' },

    searchWrap:  { display:'flex', alignItems:'center', gap:8, padding:'8px 12px', border:'1.5px solid var(--border)', borderRadius:9, background:'white', minWidth:240 },
    searchInput: { border:'none', outline:'none', background:'none', fontSize:'0.8rem', color:'var(--text-primary)', flex:1 },
    sel:         { padding:'8px 11px', border:'1.5px solid var(--border)', borderRadius:9, background:'white', fontSize:'0.8rem', color:'var(--text-primary)', outline:'none', cursor:'pointer' },
    pill:        { display:'inline-block', background:'#2563eb', color:'white', fontSize:'0.62rem', fontWeight:700, padding:'2px 7px', borderRadius:99, marginLeft:6, verticalAlign:'middle' },

    tblBtn:        { width:30, height:30, borderRadius:8, border:'1px solid var(--border)', background:'white', color:'var(--text-muted)', display:'inline-flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 0.15s' },
    tblBtnSuccess: { ':hover':{ background:'#d1fae5', color:'#059669', borderColor:'#059669' } },
    tblBtnDanger:  { ':hover':{ background:'#fee2e2', color:'#dc2626', borderColor:'#dc2626' } },

    pagination: { display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'14px 22px', borderTop:'1px solid var(--border)', background:'#fafbfc', flexWrap:'wrap' },
    pageBtn:    { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:4, padding:'6px 12px', borderRadius:99, border:'1px solid var(--border)', background:'white', color:'var(--text-primary)', cursor:'pointer', fontSize:'0.78rem', minWidth:36, transition:'all 0.15s', fontWeight:600 },
    pageBtnActive: { background:'#2563eb', color:'white', borderColor:'#2563eb' },
};
