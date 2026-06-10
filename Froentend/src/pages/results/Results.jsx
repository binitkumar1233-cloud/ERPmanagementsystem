import { useState, useMemo } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import ExportMenu from '../../components/common/ExportMenu.jsx';
import {
    Search, Download, Award, TrendingUp, TrendingDown,
    Medal, Filter, X, ChevronDown, ChevronUp,
    BarChart2, Star, FileText, Calendar,
    User, Hash, Percent, BookOpen, Trophy, Printer,
} from 'lucide-react';
import { getGrade } from '../../utils/helpers.js';

const RESULT_COLUMNS = [
    { label: 'Student ID', key: 'id'     },
    { label: 'Name',       key: 'name'   },
    { label: 'Course',     key: 'course' },
    { label: 'Semester',   key: 'sem'    },
    { label: 'Average %',  key: 'subjects', value: r => {
        const avg = r.subjects ? Math.round(r.subjects.reduce((s,x)=>s+x.marks,0)/r.subjects.length) : '';
        return avg;
    }},
    { label: 'Grade',      key: 'subjects', value: r => {
        const avg = r.subjects ? Math.round(r.subjects.reduce((s,x)=>s+x.marks,0)/r.subjects.length) : 0;
        return avg>=90?'A+':avg>=80?'A':avg>=70?'B+':avg>=60?'B':avg>=50?'C':'F';
    }},
    { label: 'Status',     key: 'status'  },
];

/* ─────────────────────────── DATA ─────────────────────────── */
const DATA = [
    { id:'STU001', regNo:'REG/2022/00101', name:'Priya Sharma',  course:'B.Sc CSE',              sem:'Semester IV',  dob:'12/05/2003',
      subjects:[{n:'Data Structures & Algorithms',code:'CS401',m:88,max:100},{n:'Operating Systems',code:'CS402',m:82,max:100},{n:'Database Management',code:'CS403',m:90,max:100},{n:'Computer Networks',code:'CS404',m:79,max:100},{n:'Software Engineering',code:'CS405',m:85,max:100}] },
    { id:'STU002', regNo:'REG/2022/00102', name:'Rohan Das',      course:'B.Com Hons',             sem:'Semester IV',  dob:'08/11/2002',
      subjects:[{n:'Financial Accounting',code:'BC401',m:72,max:100},{n:'Corporate Finance',code:'BC402',m:68,max:100},{n:'Economics',code:'BC403',m:75,max:100},{n:'Business Statistics',code:'BC404',m:65,max:100},{n:'Management Principles',code:'BC405',m:70,max:100}] },
    { id:'STU003', regNo:'REG/2023/00103', name:'Ananya Patel',   course:'B.A English',            sem:'Semester II',  dob:'22/07/2004',
      subjects:[{n:'English Literature',code:'EN201',m:92,max:100},{n:'Grammar & Composition',code:'EN202',m:89,max:100},{n:'Phonetics & Linguistics',code:'EN203',m:95,max:100},{n:'Creative Writing',code:'EN204',m:87,max:100},{n:'World History',code:'EN205',m:91,max:100}] },
    { id:'STU004', regNo:'REG/2021/00104', name:'Suresh Kumar',   course:'B.Tech ECE',             sem:'Semester VI',  dob:'03/03/2002',
      subjects:[{n:'VLSI Design',code:'EC601',m:45,max:100},{n:'Signals & Systems',code:'EC602',m:52,max:100},{n:'Communication Systems',code:'EC603',m:38,max:100},{n:'Electromagnetic Fields',code:'EC604',m:41,max:100},{n:'Control Systems',code:'EC605',m:55,max:100}] },
    { id:'STU005', regNo:'REG/2023/00105', name:'Meena Nayak',    course:'M.Sc Maths',             sem:'Semester II',  dob:'18/09/2001',
      subjects:[{n:'Real Analysis',code:'MA201',m:96,max:100},{n:'Abstract Algebra',code:'MA202',m:94,max:100},{n:'Topology',code:'MA203',m:91,max:100},{n:'Advanced Statistics',code:'MA204',m:98,max:100},{n:'Differential Calculus',code:'MA205',m:93,max:100}] },
    { id:'STU006', regNo:'REG/2022/00106', name:'Amit Verma',     course:'B.Tech CSE',             sem:'Semester IV',  dob:'30/01/2003',
      subjects:[{n:'Design & Analysis of Algorithms',code:'CS401',m:78,max:100},{n:'Artificial Intelligence',code:'CS402',m:82,max:100},{n:'Machine Learning',code:'CS403',m:76,max:100},{n:'Web Technologies',code:'CS404',m:80,max:100},{n:'Cloud Computing',code:'CS405',m:74,max:100}] },
    { id:'STU007', regNo:'REG/2022/00107', name:'Kavya Reddy',    course:'B.Sc CSE',               sem:'Semester IV',  dob:'14/06/2003',
      subjects:[{n:'Data Structures & Algorithms',code:'CS401',m:73,max:100},{n:'Operating Systems',code:'CS402',m:69,max:100},{n:'Database Management',code:'CS403',m:77,max:100},{n:'Computer Networks',code:'CS404',m:71,max:100},{n:'Software Engineering',code:'CS405',m:65,max:100}] },
    { id:'STU008', regNo:'REG/2023/00108', name:'Riya Student',   course:'B.Sc Computer Science',  sem:'Semester II',  dob:'15/08/2005',
      subjects:[{n:'Programming in C',code:'CS201',m:84,max:100},{n:'Mathematics I',code:'MA201',m:78,max:100},{n:'Digital Electronics',code:'EC201',m:81,max:100},{n:'English Communication',code:'EN201',m:90,max:100},{n:'Environmental Science',code:'ES201',m:86,max:100}] },
];

/* ─────────────────────────── HELPERS ─────────────────────────── */
const avg   = s => Math.round(s.reduce((a,x)=>a+x.m,0)/s.length);
const total = s => s.reduce((a,x)=>a+x.m,0);
const maxT  = s => s.reduce((a,x)=>a+x.max,0);
const cgpa  = p => Math.min(10, p/9.5).toFixed(2);
const rank  = id => {
    const sorted = [...DATA].sort((a,b)=>avg(b.subjects)-avg(a.subjects));
    return sorted.findIndex(r=>r.id===id)+1;
};
const getColor = p => p>=80?'#059669':p>=60?'#d97706':'#dc2626';
const getBarGrad = p => p>=80?'linear-gradient(90deg,#059669,#10b981)':p>=60?'linear-gradient(90deg,#d97706,#f59e0b)':'linear-gradient(90deg,#dc2626,#ef4444)';

const GRADE_CFG = {
    O:    { bg:'rgba(5,150,105,0.12)',   color:'#065f46', border:'rgba(5,150,105,0.3)',   label:'Outstanding', min:90 },
    'A+': { bg:'rgba(37,99,235,0.11)',   color:'#1e40af', border:'rgba(37,99,235,0.3)',   label:'Excellent',   min:80 },
    A:    { bg:'rgba(124,58,237,0.11)',  color:'#5b21b6', border:'rgba(124,58,237,0.3)',  label:'Very Good',   min:70 },
    'B+': { bg:'rgba(217,119,6,0.11)',   color:'#92400e', border:'rgba(217,119,6,0.3)',   label:'Good',        min:60 },
    B:    { bg:'rgba(202,138,4,0.09)',   color:'#713f12', border:'rgba(202,138,4,0.25)',  label:'Above Avg',   min:50 },
    C:    { bg:'rgba(100,116,139,0.09)', color:'#475569', border:'rgba(100,116,139,0.2)', label:'Average',     min:40 },
    F:    { bg:'rgba(220,38,38,0.10)',   color:'#991b1b', border:'rgba(220,38,38,0.3)',   label:'Fail',        min:0  },
};
const GRADE_COLORS = { O:'#059669','A+':'#2563eb',A:'#7c3aed','B+':'#d97706',B:'#ca8a04',C:'#64748b',F:'#dc2626' };

const GradeBadge = ({ pct }) => {
    const g = getGrade(pct);
    const cfg = GRADE_CFG[g] || GRADE_CFG.C;
    return (
        <span style={{ background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:800, whiteSpace:'nowrap' }}>
            {g}
        </span>
    );
};

const COURSES   = ['All', ...new Set(DATA.map(r=>r.course))];
const SEMESTERS = ['All', ...new Set(DATA.map(r=>r.sem))];
const MEDAL_GRADIENT = [
    'linear-gradient(135deg,#92400e,#f59e0b)',
    'linear-gradient(135deg,#475569,#94a3b8)',
    'linear-gradient(135deg,#7c2d12,#b45309)',
];
const MEDAL_GLOW = ['rgba(245,158,11,0.35)','rgba(148,163,184,0.3)','rgba(180,83,9,0.3)'];
const MEDAL_LABEL = ['🥇','🥈','🥉'];

/* ─────────────────────────── CERTIFICATE ─────────────────────────── */
function Certificate({ student, onClose }) {
    const a    = avg(student.subjects);
    const tot  = total(student.subjects);
    const maxT_ = maxT(student.subjects);
    const gpa  = cgpa(a);
    const rnk  = rank(student.id);
    const pass = a >= 40;
    const g    = getGrade(a);
    const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });

    const printCert = () => window.print();

    return (
        <div style={CS.overlay} onClick={e => { if(e.target===e.currentTarget) onClose(); }}>
            <div style={CS.wrapper}>
                {/* toolbar */}
                <div style={CS.toolbar}>
                    <span style={{ fontSize:'0.82rem', color:'#94a3b8' }}>Certificate Preview</span>
                    <div style={{ display:'flex', gap:8 }}>
                        <button className="btn btn-primary btn-sm" onClick={printCert} style={{ display:'flex', alignItems:'center', gap:5 }}>
                            <Printer size={13}/> Print / Download PDF
                        </button>
                        <button className="btn btn-secondary btn-sm" onClick={onClose} style={{ display:'flex', alignItems:'center', gap:4 }}>
                            <X size={13}/> Close
                        </button>
                    </div>
                </div>

                {/* ── certificate sheet ── */}
                <div id="certificate-print" style={CS.sheet}>
                    {/* outer border */}
                    <div style={CS.outerBorder}>
                        <div style={CS.innerBorder}>

                            {/* header */}
                            <div style={CS.header}>
                                {/* emblem */}
                                <div style={CS.emblem}>
                                    <div style={CS.emblemInner}>
                                        <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#1e3a8a', lineHeight:1 }}>BIT</div>
                                        <div style={{ fontSize:'0.45rem', letterSpacing:'0.08em', color:'#3b82f6', marginTop:2 }}>EST. 2005</div>
                                    </div>
                                </div>
                                <div style={{ flex:1, textAlign:'center' }}>
                                    <div style={CS.instName}>Binit Institute of Technology</div>
                                    <div style={CS.instTag}>Affiliated to State Technical University &nbsp;|&nbsp; NAAC Accredited 'A' Grade</div>
                                    <div style={CS.instAddr}>Near City Center, Tech Park Road, Bihar — 800001 &nbsp;·&nbsp; www.bit.edu.in</div>
                                </div>
                                {/* right seal placeholder */}
                                <div style={{ ...CS.emblem, opacity:0.18 }}>
                                    <div style={CS.emblemInner}>
                                        <div style={{ fontSize:'1.5rem', fontWeight:900, color:'#1e3a8a', lineHeight:1 }}>BIT</div>
                                        <div style={{ fontSize:'0.45rem', letterSpacing:'0.08em', color:'#3b82f6', marginTop:2 }}>SEAL</div>
                                    </div>
                                </div>
                            </div>

                            {/* gold divider */}
                            <div style={CS.divider}/>

                            {/* certificate title */}
                            <div style={{ textAlign:'center', margin:'22px 0 8px' }}>
                                <div style={CS.certTitle}>ACADEMIC MARKSHEET CERTIFICATE</div>
                                <div style={CS.certSub}>
                                    {student.sem} &nbsp;·&nbsp; Academic Year 2023–24
                                </div>
                            </div>

                            {/* certified text */}
                            <div style={CS.certText}>
                                This is to certify that&nbsp;
                                <span style={CS.highlight}>{student.name}</span>,
                                bearing Registration No.&nbsp;
                                <span style={CS.highlight}>{student.regNo}</span>,
                                enrolled in&nbsp;
                                <span style={CS.highlight}>{student.course}</span>&nbsp;
                                has appeared in the&nbsp;
                                <span style={CS.highlight}>{student.sem}</span>&nbsp;
                                Examination and has&nbsp;
                                <span style={{ color: pass ? '#059669' : '#dc2626', fontWeight:700 }}>{pass ? 'PASSED' : 'FAILED'}</span>&nbsp;
                                with the following academic performance:
                            </div>

                            {/* student info strip */}
                            <div style={CS.infoStrip}>
                                {[
                                    { label:'Student Name',   value: student.name },
                                    { label:'Reg. No.',       value: student.regNo },
                                    { label:'Date of Birth',  value: student.dob },
                                    { label:'Programme',      value: student.course },
                                    { label:'Semester',       value: student.sem },
                                ].map(({ label, value }) => (
                                    <div key={label} style={CS.infoItem}>
                                        <span style={CS.infoLabel}>{label}</span>
                                        <span style={CS.infoValue}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* subject table */}
                            <table style={CS.table}>
                                <thead>
                                    <tr style={{ background:'linear-gradient(135deg,#1e3a8a,#2563eb)' }}>
                                        <th style={{ ...CS.th, textAlign:'left' }}>Subject</th>
                                        <th style={{ ...CS.th, width:80 }}>Code</th>
                                        <th style={{ ...CS.th, width:60 }}>Max</th>
                                        <th style={{ ...CS.th, width:70 }}>Obtained</th>
                                        <th style={{ ...CS.th, width:60 }}>%</th>
                                        <th style={{ ...CS.th, width:60 }}>Grade</th>
                                        <th style={{ ...CS.th, width:70 }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {student.subjects.map((s, i) => {
                                        const sp   = Math.round(s.m / s.max * 100);
                                        const spass = sp >= 40;
                                        return (
                                            <tr key={s.code} style={{ background: i%2===0?'#f8faff':'white' }}>
                                                <td style={CS.td}>{s.n}</td>
                                                <td style={{ ...CS.td, fontFamily:'monospace', fontSize:'0.72rem', color:'#64748b', textAlign:'center' }}>{s.code}</td>
                                                <td style={{ ...CS.td, textAlign:'center' }}>{s.max}</td>
                                                <td style={{ ...CS.td, textAlign:'center', fontWeight:800, color: getColor(sp) }}>{s.m}</td>
                                                <td style={{ ...CS.td, textAlign:'center' }}>{sp}%</td>
                                                <td style={{ ...CS.td, textAlign:'center', fontWeight:800, color: GRADE_COLORS[getGrade(sp)] || '#64748b' }}>{getGrade(sp)}</td>
                                                <td style={{ ...CS.td, textAlign:'center', fontWeight:700, color: spass?'#059669':'#dc2626' }}>{spass?'Pass':'Fail'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr style={{ background:'#1e3a8a' }}>
                                        <td style={{ ...CS.td, color:'white', fontWeight:800, padding:'10px 14px' }} colSpan={2}>TOTAL / OVERALL</td>
                                        <td style={{ ...CS.td, textAlign:'center', color:'white', fontWeight:700 }}>{maxT_}</td>
                                        <td style={{ ...CS.td, textAlign:'center', color:'#fbbf24', fontWeight:900, fontSize:'0.92rem' }}>{tot}</td>
                                        <td style={{ ...CS.td, textAlign:'center', color:'#fbbf24', fontWeight:900 }}>{a}%</td>
                                        <td style={{ ...CS.td, textAlign:'center', color:'#fbbf24', fontWeight:900 }}>{g}</td>
                                        <td style={{ ...CS.td, textAlign:'center', color: pass?'#4ade80':'#f87171', fontWeight:800 }}>{pass?'PASS':'FAIL'}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            {/* result summary strip */}
                            <div style={CS.summaryStrip}>
                                {[
                                    { label:'Total Marks', value:`${tot} / ${maxT_}`, color:'#1e40af' },
                                    { label:'Percentage',  value:`${a}%`,              color: getColor(a) },
                                    { label:'Grade',       value: g,                   color: GRADE_COLORS[g] || '#64748b' },
                                    { label:'CGPA',        value: gpa,                 color:'#7c3aed' },
                                    { label:'Class Rank',  value:`#${rnk}`,            color:'#92400e' },
                                    { label:'Result',      value: pass?'PASS':'FAIL',  color: pass?'#059669':'#dc2626' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} style={CS.summaryItem}>
                                        <div style={{ fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#94a3b8', marginBottom:4 }}>{label}</div>
                                        <div style={{ fontWeight:900, fontSize:'1.05rem', color }}>{value}</div>
                                    </div>
                                ))}
                            </div>

                            {/* gold divider */}
                            <div style={CS.divider}/>

                            {/* footer signatures */}
                            <div style={CS.sigRow}>
                                <div style={CS.sigBox}>
                                    <div style={CS.sigLine}/>
                                    <div style={CS.sigName}>Controller of Examinations</div>
                                    <div style={CS.sigInst}>Binit Institute of Technology</div>
                                </div>
                                <div style={{ textAlign:'center', color:'#94a3b8' }}>
                                    <div style={{ fontSize:'0.62rem', marginBottom:6 }}>Date of Issue</div>
                                    <div style={{ fontWeight:800, fontSize:'0.82rem', color:'#1e3a8a' }}>{today}</div>
                                    <div style={{ marginTop:10, padding:'6px 14px', border:'1.5px solid #1e3a8a', borderRadius:6, fontSize:'0.58rem', fontWeight:700, letterSpacing:'0.1em', color:'#1e3a8a' }}>OFFICIAL DOCUMENT</div>
                                </div>
                                <div style={CS.sigBox}>
                                    <div style={CS.sigLine}/>
                                    <div style={CS.sigName}>Principal</div>
                                    <div style={CS.sigInst}>Binit Institute of Technology</div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────── COMPONENT ─────────────────────────── */
export default function Results() {
    const [nameQ, setNameQ]   = useState('');
    const [regQ,  setRegQ]    = useState('');
    const [dobQ,  setDobQ]    = useState('');
    const [sf,    setSF]      = useState('All');
    const [cf,    setCF]      = useState('All');
    const [semF,  setSemF]    = useState('All');
    const [open,  setOpen]    = useState(null);
    const [showF, setShowF]   = useState(false);
    const [certStudent, setCertStudent] = useState(null);

    const passCount  = DATA.filter(r=>avg(r.subjects)>=40).length;
    const failCount  = DATA.length - passCount;
    const classAvg   = Math.round(DATA.reduce((s,r)=>s+avg(r.subjects),0)/DATA.length);
    const passRate   = Math.round(passCount/DATA.length*100);
    const toppers    = [...DATA].sort((a,b)=>avg(b.subjects)-avg(a.subjects)).slice(0,3);
    const highest    = Math.max(...DATA.map(r=>avg(r.subjects)));
    const lowest     = Math.min(...DATA.map(r=>avg(r.subjects)));

    const gradeDist = useMemo(()=>{
        const map = { O:0,'A+':0,A:0,'B+':0,B:0,C:0,F:0 };
        DATA.forEach(r=>{ const g=getGrade(avg(r.subjects)); if(map[g]!==undefined) map[g]++; });
        return map;
    },[]);

    const filtered = DATA.filter(r=>{
        const mn = r.name.toLowerCase().includes(nameQ.toLowerCase());
        const mr = r.regNo.toLowerCase().includes(regQ.toLowerCase());
        const md = dobQ==='' || r.dob.includes(dobQ);
        const ms = sf==='All'||(sf==='Pass'?avg(r.subjects)>=40:avg(r.subjects)<40);
        const mc = cf==='All'||r.course===cf;
        const msem = semF==='All'||r.sem===semF;
        return mn&&mr&&md&&ms&&mc&&msem;
    });

    const hasFilter = nameQ||regQ||dobQ||sf!=='All'||cf!=='All'||semF!=='All';
    const clearAll  = ()=>{ setNameQ(''); setRegQ(''); setDobQ(''); setSF('All'); setCF('All'); setSemF('All'); };

    return (
        <>
        {certStudent && <Certificate student={certStudent} onClose={() => setCertStudent(null)} />}
        <div className="erp-page">
            <Navbar title="Results & Analytics" subtitle="Academic performance and grade reports" />

            {/* ── Hero KPI Cards ── */}
            <div style={S.heroGrid}>
                {[
                    { label:'Students Appeared', value:DATA.length,     icon:User,        gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  sub:'Total examined this semester' },
                    { label:'Pass Count',         value:passCount,        icon:TrendingUp,  gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(5,150,105,0.28)',  sub:`${passRate}% pass rate` },
                    { label:'Fail Count',         value:failCount,        icon:TrendingDown,gradient:'linear-gradient(135deg,#7f1d1d,#dc2626)', glow:'rgba(220,38,38,0.28)',  sub:`${Math.round(failCount/DATA.length*100)}% of class` },
                    { label:'Pass Rate',          value:passRate+'%',     icon:Percent,     gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.28)', sub:'Overall performance' },
                    { label:'Class Average',      value:classAvg+'%',     icon:Medal,       gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', sub:`Range: ${lowest}% – ${highest}%` },
                    { label:'Highest Score',      value:highest+'%',      icon:Award,       gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(16,185,129,0.28)', sub:toppers[0]?.name },
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

            {/* ── Top Performers + Grade Distribution ── */}
            <div style={S.twoCol}>

                {/* Top Performers */}
                <div className="card" style={{ flex:'1.7' }}>
                    <div className="card-header">
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#92400e,#f59e0b)', display:'grid', placeItems:'center' }}>
                                <Trophy size={17} color="white"/>
                            </div>
                            <div>
                                <h2 style={{ margin:0 }}>Top Performers</h2>
                                <p style={{ margin:0 }}>Highest scoring students this semester</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, padding:'0 20px 20px' }}>
                        {toppers.map((r,i)=>{
                            const a = avg(r.subjects);
                            const g = getGrade(a);
                            return (
                                <div key={r.id} style={{ ...S.topCard, border:`1px solid ${i===0?'rgba(245,158,11,0.3)':i===1?'rgba(148,163,184,0.3)':'rgba(180,83,9,0.25)'}` }}>
                                    {/* Top accent */}
                                    <div style={{ height:5, background:MEDAL_GRADIENT[i], borderRadius:'12px 12px 0 0', margin:'-16px -16px 14px', boxShadow:`0 2px 10px ${MEDAL_GLOW[i]}` }}/>

                                    {/* Medal badge */}
                                    <div style={{ position:'absolute', top:18, right:14, fontSize:'1.1rem' }}>{MEDAL_LABEL[i]}</div>

                                    {/* Avatar */}
                                    <div style={{ width:54, height:54, borderRadius:14, background:MEDAL_GRADIENT[i], display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'1.2rem', margin:'0 auto 12px', boxShadow:`0 4px 14px ${MEDAL_GLOW[i]}` }}>
                                        {r.name[0]}
                                    </div>

                                    <div style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text-primary)', textAlign:'center', marginBottom:3 }}>{r.name}</div>
                                    <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', textAlign:'center', marginBottom:12 }}>{r.course}</div>

                                    {/* Score ring */}
                                    <div style={{ textAlign:'center', marginBottom:10 }}>
                                        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.7rem', fontWeight:900, background:MEDAL_GRADIENT[i], WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{a}%</div>
                                    </div>

                                    <div style={{ display:'flex', justifyContent:'center', marginBottom:10 }}>
                                        <GradeBadge pct={a}/>
                                    </div>

                                    {/* Mini progress */}
                                    <div style={{ height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden', marginBottom:10 }}>
                                        <div style={{ height:'100%', width:`${a}%`, background:MEDAL_GRADIENT[i], borderRadius:99 }}/>
                                    </div>

                                    <div style={{ fontSize:'0.66rem', color:'var(--text-muted)', textAlign:'center' }}>
                                        Rank #{i+1} · CGPA {cgpa(a)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Grade Distribution */}
                <div className="card" style={{ flex:'1' }}>
                    <div className="card-header">
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#1e3a8a,#2563eb)', display:'grid', placeItems:'center' }}>
                                <BarChart2 size={17} color="white"/>
                            </div>
                            <div>
                                <h2 style={{ margin:0 }}>Grade Distribution</h2>
                                <p style={{ margin:0 }}>Performance spread across all students</p>
                            </div>
                        </div>
                    </div>
                    <div style={{ padding:'4px 20px 20px', display:'flex', flexDirection:'column', gap:10 }}>
                        {Object.entries(GRADE_CFG).map(([g,cfg])=>{
                            const count = gradeDist[g]||0;
                            const pct   = Math.round(count/DATA.length*100);
                            const barC  = GRADE_COLORS[g]||'#64748b';
                            return (
                                <div key={g} style={{ display:'flex', alignItems:'center', gap:10 }}>
                                    <span style={{ width:34, padding:'3px 0', textAlign:'center', background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, borderRadius:7, fontSize:'0.72rem', fontWeight:800, flexShrink:0 }}>{g}</span>
                                    <div style={{ flex:1, height:10, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                        <div style={{ height:'100%', width:`${pct}%`, background:barC, borderRadius:99, transition:'width 0.5s ease', minWidth:pct>0?6:0 }}/>
                                    </div>
                                    <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', flexShrink:0, minWidth:70 }}>
                                        <span style={{ fontSize:'0.75rem', fontWeight:700, color:count>0?barC:'var(--text-muted)' }}>{count} student{count!==1?'s':''}</span>
                                        <span style={{ fontSize:'0.62rem', color:'var(--text-muted)' }}>{cfg.label}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── Search & Filter Panel ── */}
            <div style={S.searchPanel}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <Search size={16} color="#2563eb"/>
                        <span style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text-primary)' }}>Search Results</span>
                        <span style={{ fontSize:'0.74rem', color:'var(--text-muted)' }}>— by Name, Registration No or Date of Birth</span>
                        {hasFilter && <span style={{ background:'#2563eb', color:'white', fontSize:'0.6rem', fontWeight:700, padding:'2px 8px', borderRadius:99 }}>Filtered</span>}
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                        {hasFilter && <button className="btn btn-secondary btn-sm" onClick={clearAll}><X size={13}/> Clear All</button>}
                        <button className="btn btn-secondary btn-sm" onClick={()=>setShowF(v=>!v)}>
                            <Filter size={13}/> {showF?'Hide Filters':'Show Filters'}
                        </button>
                    </div>
                </div>

                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                    {[
                        { icon:User,     placeholder:'Search by student name…',            value:nameQ, onChange:e=>setNameQ(e.target.value), clear:()=>setNameQ(''),   flex:2   },
                        { icon:Hash,     placeholder:'Registration No (REG/2022/00101)',    value:regQ,  onChange:e=>setRegQ(e.target.value),  clear:()=>setRegQ(''),    flex:1.5 },
                        { icon:Calendar, placeholder:'Date of Birth (DD/MM/YYYY)',          value:dobQ,  onChange:e=>setDobQ(e.target.value),  clear:()=>setDobQ(''),    flex:1   },
                    ].map(({icon:Icon,placeholder,value,onChange,clear,flex})=>(
                        <div key={placeholder} style={{ flex, display:'flex', alignItems:'center', gap:8, padding:'9px 13px', border:'1.5px solid var(--border)', borderRadius:10, background:'white', minWidth:160 }}>
                            <Icon size={14} color="var(--text-muted)"/>
                            <input style={{ border:'none', outline:'none', background:'none', fontSize:'0.8rem', flex:1, color:'var(--text-primary)' }} placeholder={placeholder} value={value} onChange={onChange}/>
                            {value && <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', display:'flex', padding:2 }} onClick={clear}><X size={12}/></button>}
                        </div>
                    ))}
                </div>

                {showF && (
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginTop:12, paddingTop:12, borderTop:'1px solid var(--border)', flexWrap:'wrap' }}>
                        {[
                            { label:'Result', val:sf, set:setSF, opts:['All','Pass','Fail'] },
                            { label:'Course', val:cf, set:setCF, opts:COURSES },
                            { label:'Semester', val:semF, set:setSemF, opts:SEMESTERS },
                        ].map(({label,val,set,opts})=>(
                            <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                                <span style={{ fontSize:'0.73rem', fontWeight:700, color:'var(--text-muted)', whiteSpace:'nowrap' }}>{label}</span>
                                <select style={S.sel} value={val} onChange={e=>set(e.target.value)}>
                                    {opts.map(o=><option key={o}>{o}</option>)}
                                </select>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ── Result Sheet Table ── */}
            <div className="card">
                <div className="card-header">
                    <div>
                        <h2>Result Sheet <span style={S.pill}>{filtered.length}</span></h2>
                        <p>Click a row to view subject-wise marks and marksheet details</p>
                    </div>
                    <ExportMenu title="Results" rows={filtered} columns={RESULT_COLUMNS} />
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>
                        <Search size={40} style={{ opacity:0.15, marginBottom:12 }}/>
                        <p style={{ fontSize:'0.84rem' }}>No results match your search criteria.</p>
                        <button className="btn btn-secondary btn-sm" style={{ marginTop:10 }} onClick={clearAll}>Clear Search</button>
                    </div>
                ) : (
                    <div style={{ overflowX:'auto' }}>
                        <table style={{ minWidth:860 }}>
                            <thead>
                                <tr>
                                    <th style={{ width:58 }}>Rank</th>
                                    <th style={{ minWidth:180 }}>Student</th>
                                    <th style={{ minWidth:155 }}>Reg. No</th>
                                    <th style={{ minWidth:140 }}>Course</th>
                                    <th style={{ minWidth:125 }}>Semester</th>
                                    <th style={{ minWidth:120 }}>Average</th>
                                    <th style={{ width:82 }}>Grade</th>
                                    <th style={{ width:82 }}>Result</th>
                                    <th style={{ width:95, textAlign:'right' }}>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(r=>{
                                    const a      = avg(r.subjects);
                                    const tot    = total(r.subjects);
                                    const maxTot = maxT(r.subjects);
                                    const pass   = a >= 40;
                                    const isOpen = open === r.id;
                                    const rnk    = rank(r.id);
                                    const gpa    = cgpa(a);

                                    return (
                                        <>
                                            <tr key={r.id} style={{ cursor:'pointer', background:isOpen?'rgba(37,99,235,0.04)':'white', transition:'background 0.15s' }}
                                                onClick={()=>setOpen(isOpen?null:r.id)}>
                                                <td style={{ textAlign:'center' }}>
                                                    {rnk<=3
                                                        ? <span style={{ fontSize:'1.3rem' }}>{MEDAL_LABEL[rnk-1]}</span>
                                                        : <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'0.88rem', color:'var(--text-muted)' }}>#{rnk}</span>
                                                    }
                                                </td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ width:38, height:38, borderRadius:10, background:getBarGrad(a), display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.9rem', flexShrink:0 }}>{r.name[0]}</div>
                                                        <div>
                                                            <div style={{ fontWeight:700, fontSize:'0.85rem', color:'var(--text-primary)' }}>{r.name}</div>
                                                            <div style={{ fontSize:'0.67rem', color:'var(--text-muted)', marginTop:1 }}>DOB: {r.dob}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td><span style={{ fontSize:'0.74rem', fontFamily:'monospace', color:'var(--text-secondary)' }}>{r.regNo}</span></td>
                                                <td style={{ fontSize:'0.82rem' }}>{r.course}</td>
                                                <td>
                                                    <span style={{ fontSize:'0.7rem', fontWeight:600, padding:'4px 10px', borderRadius:7, background:'rgba(37,99,235,0.08)', color:'#1e40af' }}>{r.sem}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                        <div style={{ width:56, height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden', flexShrink:0 }}>
                                                            <div style={{ height:'100%', width:`${a}%`, background:getBarGrad(a), borderRadius:99 }}/>
                                                        </div>
                                                        <span style={{ fontWeight:800, fontSize:'0.88rem', color:getColor(a) }}>{a}%</span>
                                                    </div>
                                                </td>
                                                <td><GradeBadge pct={a}/></td>
                                                <td>
                                                    <span style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:99, fontSize:'0.71rem', fontWeight:700, background:pass?'rgba(5,150,105,0.10)':'rgba(220,38,38,0.10)', color:pass?'#059669':'#dc2626', border:`1px solid ${pass?'rgba(5,150,105,0.3)':'rgba(220,38,38,0.3)'}` }}>
                                                        {pass?'✓ Pass':'✗ Fail'}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign:'right' }}>
                                                    <button className="btn btn-secondary btn-sm" style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
                                                        {isOpen?<><ChevronUp size={13}/> Hide</>:<><ChevronDown size={13}/> Details</>}
                                                    </button>
                                                </td>
                                            </tr>

                                            {isOpen && (
                                                <tr key={r.id+'-det'}>
                                                    <td colSpan={9} style={{ padding:0, background:'#f8fafc' }}>
                                                        <div style={{ animation:'detIn 0.2s ease' }}>
                                                            {/* Marksheet header */}
                                                            <div style={S.msHead}>
                                                                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                                                                    <div style={{ width:54, height:54, borderRadius:14, background:getBarGrad(a), display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'1.2rem', flexShrink:0, boxShadow:`0 4px 14px ${a>=80?'rgba(5,150,105,0.3)':a>=60?'rgba(217,119,6,0.3)':'rgba(220,38,38,0.3)'}` }}>{r.name[0]}</div>
                                                                    <div>
                                                                        <div style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', fontWeight:800, color:'var(--text-primary)' }}>{r.name}</div>
                                                                        <div style={{ fontSize:'0.74rem', color:'var(--text-muted)', marginTop:3 }}>{r.regNo} · DOB: {r.dob}</div>
                                                                        <div style={{ fontSize:'0.74rem', color:'var(--text-muted)', marginTop:2 }}>{r.course} · {r.sem}</div>
                                                                    </div>
                                                                </div>
                                                                <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                                                                    {[
                                                                        { label:'Total',  value:`${tot}/${maxTot}`, color:null },
                                                                        { label:'Avg',    value:`${a}%`,           color:getColor(a) },
                                                                        { label:'CGPA',   value:gpa,               color:'#2563eb' },
                                                                        { label:'Rank',   value:`#${rnk}`,         color:null },
                                                                        { label:'Grade',  value:getGrade(a),       color:GRADE_COLORS[getGrade(a)] },
                                                                        { label:'Status', value:pass?'PASS':'FAIL',color:pass?'#059669':'#dc2626' },
                                                                    ].map(({label,value,color})=>(
                                                                        <div key={label} style={S.msStat}>
                                                                            <span style={{ fontSize:'0.61rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'var(--text-muted)', marginBottom:4 }}>{label}</span>
                                                                            <span style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:800, color:color||'var(--text-primary)' }}>{value}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            {/* Subject table */}
                                                            <div style={{ overflowX:'auto', borderTop:'1.5px solid var(--border)' }}>
                                                                <table style={{ minWidth:760 }}>
                                                                    <thead>
                                                                        <tr style={{ background:'#f1f5f9' }}>
                                                                            <th>Subject</th>
                                                                            <th>Code</th>
                                                                            <th style={{ textAlign:'center' }}>Max</th>
                                                                            <th style={{ textAlign:'center' }}>Obtained</th>
                                                                            <th style={{ textAlign:'center' }}>%</th>
                                                                            <th>Grade</th>
                                                                            <th>Status</th>
                                                                            <th style={{ minWidth:110 }}>Performance</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {r.subjects.map(s=>{
                                                                            const sp   = Math.round(s.m/s.max*100);
                                                                            const spass= sp>=40;
                                                                            return (
                                                                                <tr key={s.code}>
                                                                                    <td style={{ fontWeight:600, color:'var(--text-primary)', fontSize:'0.84rem' }}>{s.n}</td>
                                                                                    <td><span style={{ fontFamily:'monospace', fontSize:'0.73rem', color:'var(--text-muted)' }}>{s.code}</span></td>
                                                                                    <td style={{ textAlign:'center', fontSize:'0.83rem' }}>{s.max}</td>
                                                                                    <td style={{ textAlign:'center', fontWeight:800, color:getColor(sp), fontSize:'0.88rem' }}>{s.m}</td>
                                                                                    <td style={{ textAlign:'center', fontSize:'0.83rem' }}>{sp}%</td>
                                                                                    <td><GradeBadge pct={sp}/></td>
                                                                                    <td>
                                                                                        <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'3px 9px', borderRadius:99, background:spass?'rgba(5,150,105,0.10)':'rgba(220,38,38,0.10)', color:spass?'#059669':'#dc2626', border:`1px solid ${spass?'rgba(5,150,105,0.3)':'rgba(220,38,38,0.3)'}` }}>
                                                                                            {spass?'Pass':'Fail'}
                                                                                        </span>
                                                                                    </td>
                                                                                    <td>
                                                                                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                                                                                            <div style={{ flex:1, height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden', minWidth:80 }}>
                                                                                                <div style={{ height:'100%', width:`${sp}%`, background:getBarGrad(sp), borderRadius:99 }}/>
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr style={{ background:'rgba(37,99,235,0.05)', borderTop:'2px solid var(--border)' }}>
                                                                            <td colSpan={2} style={{ fontWeight:800 }}>Overall</td>
                                                                            <td style={{ textAlign:'center', fontWeight:700 }}>{maxTot}</td>
                                                                            <td style={{ textAlign:'center', fontWeight:900, color:getColor(a), fontSize:'0.92rem' }}>{tot}</td>
                                                                            <td style={{ textAlign:'center', fontWeight:900, color:getColor(a) }}>{a}%</td>
                                                                            <td><GradeBadge pct={a}/></td>
                                                                            <td>
                                                                                <span style={{ fontSize:'0.7rem', fontWeight:700, padding:'3px 9px', borderRadius:99, background:pass?'rgba(5,150,105,0.10)':'rgba(220,38,38,0.10)', color:pass?'#059669':'#dc2626', border:`1px solid ${pass?'rgba(5,150,105,0.3)':'rgba(220,38,38,0.3)'}` }}>
                                                                                    {pass?'Pass':'Fail'}
                                                                                </span>
                                                                            </td>
                                                                            <td/>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </div>

                                                            {/* Actions footer */}
                                                            <div style={S.detActions}>
                                                                <span style={{ fontSize:'0.77rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:5 }}>
                                                                    <Star size={12}/>Class Rank: <b style={{ color:'var(--text-primary)' }}>#{rnk}</b> of {DATA.length} students
                                                                </span>
                                                                <div style={{ display:'flex', gap:8 }}>
                                                                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); setCertStudent(r); }}><FileText size={13}/> View Marksheet</button>
                                                                    <button className="btn btn-primary btn-sm" onClick={e => { e.stopPropagation(); setCertStudent(r); }}><Download size={13}/> Download PDF</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes detIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:none} }
                tbody tr:hover td { background: rgba(37,99,235,0.025) !important; }
                @media(max-width:1100px){ .hero-6{ grid-template-columns:repeat(3,1fr)!important; } }
                @media(max-width:900px){  .res-two-col{ flex-direction:column!important; } }
                @media(max-width:640px){  .hero-6{ grid-template-columns:repeat(2,1fr)!important; } }
                @media print {
                    body > *:not(#certificate-print) { display: none !important; }
                    #certificate-print { position:fixed; top:0; left:0; width:100%; height:auto; z-index:99999; }
                    .cert-toolbar { display:none !important; }
                }
            `}</style>
        </div>
        </>
    );
}

/* ══ STYLES ══ */
const S = {
    heroGrid: { display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:12, marginBottom:18 },
    heroCard: { borderRadius:14, padding:'16px 18px 12px', position:'relative', overflow:'hidden', color:'white' },
    heroTop:  { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 },
    heroIconBox: { width:38, height:38, borderRadius:10, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
    heroVal:  { fontSize:'1.55rem', fontFamily:'var(--font-display)', fontWeight:900 },
    heroLbl:  { fontSize:'0.72rem', fontWeight:600, opacity:0.9, marginBottom:2 },
    heroSub:  { fontSize:'0.62rem', opacity:0.55, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' },
    heroShine:{ position:'absolute', top:0, right:0, width:'45%', height:'100%', background:'rgba(255,255,255,0.055)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' },

    twoCol: { display:'flex', gap:16, marginBottom:18, alignItems:'flex-start' },

    topCard: { background:'white', borderRadius:12, padding:16, textAlign:'center', position:'relative', boxShadow:'var(--shadow-sm)', transition:'transform 0.18s,box-shadow 0.18s' },

    searchPanel: { background:'white', border:'1.5px solid var(--border)', borderRadius:12, padding:'16px 20px', marginBottom:18, boxShadow:'var(--shadow-sm)' },

    pill: { display:'inline-block', background:'#2563eb', color:'white', fontSize:'0.62rem', fontWeight:700, padding:'2px 7px', borderRadius:99, marginLeft:6, verticalAlign:'middle' },
    sel:  { padding:'8px 11px', border:'1.5px solid var(--border)', borderRadius:9, background:'white', fontSize:'0.8rem', color:'var(--text-primary)', outline:'none', cursor:'pointer' },

    msHead:  { display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20, padding:'20px 24px', background:'linear-gradient(135deg,#f0f4ff,#e8f0fe)', borderBottom:'1.5px solid #c7d7fe', flexWrap:'wrap' },
    msStat:  { display:'flex', flexDirection:'column', alignItems:'center', background:'white', border:'1px solid #c7d7fe', borderRadius:10, padding:'10px 14px', minWidth:76, boxShadow:'0 1px 4px rgba(30,64,175,0.08)' },
    detActions: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 24px', background:'#fafbff', borderTop:'1px solid var(--border)', flexWrap:'wrap', gap:10 },
};

/* ══ CERTIFICATE STYLES ══ */
const CS = {
    overlay: { position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(15,23,42,0.72)', zIndex:99999, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', overflowY:'auto', padding:'24px 16px 40px' },
    wrapper: { width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:0 },
    toolbar: { display:'flex', alignItems:'center', justifyContent:'space-between', background:'#1e293b', borderRadius:'12px 12px 0 0', padding:'10px 18px', className:'cert-toolbar' },

    sheet: { background:'white', borderRadius:'0 0 12px 12px', overflow:'hidden' },
    outerBorder: { margin:20, border:'4px double #1e3a8a', borderRadius:8, padding:4 },
    innerBorder: { border:'1.5px solid #93c5fd', borderRadius:6, padding:'24px 28px', background:'linear-gradient(180deg,#f0f7ff 0%,#fff 60%)' },

    header: { display:'flex', alignItems:'center', gap:20, paddingBottom:16 },
    emblem: { width:72, height:72, borderRadius:'50%', border:'3px solid #1e3a8a', background:'linear-gradient(135deg,#e0eaff,#c7d7fe)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
    emblemInner: { textAlign:'center' },
    instName: { fontFamily:'Georgia, serif', fontSize:'1.35rem', fontWeight:700, color:'#1e3a8a', letterSpacing:'0.03em' },
    instTag:  { fontSize:'0.65rem', color:'#3b82f6', fontWeight:600, marginTop:4, letterSpacing:'0.04em' },
    instAddr: { fontSize:'0.6rem', color:'#64748b', marginTop:3 },

    divider: { height:4, background:'linear-gradient(90deg,transparent,#f59e0b,#d97706,#f59e0b,transparent)', margin:'0 -28px', borderRadius:0 },

    certTitle: { fontFamily:'Georgia, serif', fontSize:'1.25rem', fontWeight:700, color:'#1e3a8a', letterSpacing:'0.12em', textTransform:'uppercase' },
    certSub:   { fontSize:'0.72rem', color:'#64748b', marginTop:6, fontStyle:'italic' },

    certText: { margin:'14px 0 18px', fontSize:'0.82rem', lineHeight:1.8, color:'#334155', textAlign:'justify' },
    highlight: { fontWeight:700, color:'#1e3a8a' },

    infoStrip: { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:1, background:'#e2e8f0', border:'1px solid #e2e8f0', borderRadius:8, overflow:'hidden', marginBottom:18 },
    infoItem:  { background:'white', padding:'10px 12px', display:'flex', flexDirection:'column' },
    infoLabel: { fontSize:'0.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.07em', color:'#94a3b8', marginBottom:3 },
    infoValue: { fontSize:'0.78rem', fontWeight:700, color:'#1e3a8a' },

    table: { width:'100%', borderCollapse:'collapse', marginBottom:16, fontSize:'0.78rem' },
    th: { padding:'10px 12px', color:'white', fontWeight:700, fontSize:'0.68rem', letterSpacing:'0.06em', textTransform:'uppercase', textAlign:'center' },
    td: { padding:'8px 12px', borderBottom:'1px solid #e2e8f0', color:'#334155', fontSize:'0.78rem' },

    summaryStrip: { display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:1, background:'#1e3a8a', borderRadius:8, overflow:'hidden', padding:1, marginBottom:20 },
    summaryItem:  { background:'#f8faff', padding:'12px 8px', textAlign:'center' },

    sigRow: { display:'flex', alignItems:'flex-end', justifyContent:'space-between', paddingTop:8 },
    sigBox: { textAlign:'center', minWidth:180 },
    sigLine: { borderTop:'1.5px solid #334155', marginBottom:6, width:'80%', margin:'0 auto 6px' },
    sigName: { fontWeight:700, fontSize:'0.78rem', color:'#1e3a8a' },
    sigInst: { fontSize:'0.62rem', color:'#64748b' },
};
