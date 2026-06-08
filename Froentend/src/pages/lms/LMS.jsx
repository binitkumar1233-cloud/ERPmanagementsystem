import { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import {
    BookOpen, FileText, Video, Link2, Upload, Download,
    Search, Plus, CheckCircle2, Clock, AlertCircle,
    Eye, Edit2, Trash2, Users, Calendar, Star,
    Layers, ClipboardList, FolderOpen, Send,
    X, ShieldCheck, Lock, GraduationCap, UserCircle,
} from 'lucide-react';

/* ── Credentials ── */
const TEACHER_CREDENTIALS = {
    'TCH001': { password: 'pass001', name: 'Dr. Kavitha Rao',   dept: 'Computer Science'  },
    'TCH002': { password: 'pass002', name: 'Prof. Arun Mishra', dept: 'Mathematics'        },
    'TCH003': { password: 'pass003', name: 'Mrs. Sunita Devi',  dept: 'English'            },
    'TCH004': { password: 'pass004', name: 'Mr. Rajan Pillai',  dept: 'Electronics'        },
    'TCH005': { password: 'pass005', name: 'Dr. Priti Saxena',  dept: 'Chemistry'          },
    'TCH006': { password: 'pass006', name: 'Mr. Deepak Sharma', dept: 'Commerce'           },
    'TCH007': { password: 'pass007', name: 'Mrs. Lata Nayak',   dept: 'History'            },
    'TCH008': { password: 'pass008', name: 'Ms. Meera Iyer',    dept: 'Biology'            },
    'TCH009': { password: 'pass009', name: 'Mr. Rohit Verma',   dept: 'Physical Education' },
    'TCH010': { password: 'pass010', name: 'Dr. Neha Joshi',    dept: 'Psychology'         },
};

const STUDENT_CREDENTIALS = {
    'CS2024001': { password: 'stu001', name: 'Priya Sharma',  course: 'B.Sc CSE'   },
    'CS2024002': { password: 'stu002', name: 'Rohan Das',     course: 'B.Sc CSE'   },
    'CS2024003': { password: 'stu003', name: 'Ananya Patel',  course: 'B.Sc CSE'   },
    'EC2024001': { password: 'stu004', name: 'Suresh Kumar',  course: 'B.Tech ECE' },
    'CO2024001': { password: 'stu005', name: 'Meena Nayak',   course: 'B.Com Hons' },
    'MA2024001': { password: 'stu006', name: 'Deepa Singh',   course: 'M.Sc Maths' },
};

/* ── Mock Data ── */
const INIT_SYLLABUS = [
    { id: 'SYL001', course: 'B.Sc Computer Science', subject: 'Data Structures',     dept: 'Computer Science', year: 2, semester: 3, units: 5, covered: 3, faculty: 'Dr. Kavitha Rao',   lastUpdated: '2026-05-20', status: 'In Progress' },
    { id: 'SYL002', course: 'B.Sc Computer Science', subject: 'Algorithms',           dept: 'Computer Science', year: 2, semester: 4, units: 6, covered: 6, faculty: 'Dr. Kavitha Rao',   lastUpdated: '2026-05-18', status: 'Completed'   },
    { id: 'SYL003', course: 'B.Tech ECE',             subject: 'Digital Circuits',    dept: 'Electronics',      year: 1, semester: 2, units: 5, covered: 2, faculty: 'Mr. Rajan Pillai',  lastUpdated: '2026-05-22', status: 'In Progress' },
    { id: 'SYL004', course: 'M.Sc Mathematics',       subject: 'Real Analysis',       dept: 'Mathematics',      year: 1, semester: 1, units: 4, covered: 0, faculty: 'Prof. Arun Mishra', lastUpdated: '2026-05-15', status: 'Not Started' },
    { id: 'SYL005', course: 'B.Com Honours',          subject: 'Financial Accounting',dept: 'Commerce',         year: 1, semester: 2, units: 6, covered: 5, faculty: 'Mr. Deepak Sharma', lastUpdated: '2026-05-21', status: 'In Progress' },
    { id: 'SYL006', course: 'B.A English',            subject: 'Modern Literature',   dept: 'English',          year: 2, semester: 3, units: 4, covered: 4, faculty: 'Mrs. Sunita Devi',  lastUpdated: '2026-05-19', status: 'Completed'   },
];

const INIT_MATERIALS = [
    { id: 'MAT001', title: 'Introduction to Data Structures — Lecture Notes', subject: 'Data Structures',      type: 'PDF',   size: '2.4 MB',  uploadedBy: 'Dr. Kavitha Rao',   date: '2026-05-20', downloads: 142, course: 'B.Sc CSE'   },
    { id: 'MAT002', title: 'Sorting Algorithms — Video Tutorial (Unit 3)',     subject: 'Algorithms',          type: 'Video', size: '180 MB',  uploadedBy: 'Dr. Kavitha Rao',   date: '2026-05-18', downloads: 98,  course: 'B.Sc CSE'   },
    { id: 'MAT003', title: 'Boolean Algebra Reference Sheet',                  subject: 'Digital Circuits',    type: 'PDF',   size: '0.8 MB',  uploadedBy: 'Mr. Rajan Pillai',  date: '2026-05-22', downloads: 76,  course: 'B.Tech ECE' },
    { id: 'MAT004', title: 'Financial Statements — Practice Problems',         subject: 'Financial Accounting',type: 'PDF',   size: '1.2 MB',  uploadedBy: 'Mr. Deepak Sharma', date: '2026-05-21', downloads: 54,  course: 'B.Com Hons' },
    { id: 'MAT005', title: 'Modernism in English Literature',                  subject: 'Modern Literature',   type: 'Link',  size: '—',       uploadedBy: 'Mrs. Sunita Devi',  date: '2026-05-19', downloads: 89,  course: 'B.A English'},
    { id: 'MAT006', title: 'Calculus Problem Set — Week 6',                    subject: 'Real Analysis',       type: 'PDF',   size: '3.1 MB',  uploadedBy: 'Prof. Arun Mishra', date: '2026-05-15', downloads: 33,  course: 'M.Sc Maths' },
];

const INIT_HOMEWORK = [
    { id: 'HW001', title: 'Implement a Binary Search Tree',          subject: 'Data Structures',     course: 'B.Sc CSE',   assignedTo: 'Year 2, Sem 3', postedBy: 'Dr. Kavitha Rao',   assignedDate: '2026-05-22', dueDate: '2026-05-29', submitted: 28, total: 35, status: 'Active'  },
    { id: 'HW002', title: 'Prove the Time Complexity of Merge Sort', subject: 'Algorithms',          course: 'B.Sc CSE',   assignedTo: 'Year 2, Sem 4', postedBy: 'Dr. Kavitha Rao',   assignedDate: '2026-05-20', dueDate: '2026-05-26', submitted: 40, total: 40, status: 'Closed'  },
    { id: 'HW003', title: 'K-Map Simplification Exercises',          subject: 'Digital Circuits',    course: 'B.Tech ECE', assignedTo: 'Year 1, Sem 2', postedBy: 'Mr. Rajan Pillai',  assignedDate: '2026-05-21', dueDate: '2026-05-28', submitted: 12, total: 42, status: 'Active'  },
    { id: 'HW004', title: 'Balance Sheet Preparation',               subject: 'Financial Accounting',course: 'B.Com Hons', assignedTo: 'Year 1, Sem 2', postedBy: 'Mr. Deepak Sharma', assignedDate: '2026-05-19', dueDate: '2026-05-25', submitted: 6,  total: 38, status: 'Overdue' },
    { id: 'HW005', title: "Essay on Virginia Woolf's Narrative Style",subject: 'Modern Literature',  course: 'B.A English', assignedTo: 'Year 2, Sem 3',postedBy: 'Mrs. Sunita Devi',  assignedDate: '2026-05-23', dueDate: '2026-06-02', submitted: 0,  total: 30, status: 'Active'  },
];

const INIT_ASSIGNMENTS = [
    { id: 'ASN001', title: 'Mini Project: Library Management System', subject: 'Data Structures',     course: 'B.Sc CSE',   marks: 20, dueDate: '2026-06-10', submitted: 22, total: 35, graded: 10, status: 'Active'  },
    { id: 'ASN002', title: 'Algorithm Analysis Report',               subject: 'Algorithms',          course: 'B.Sc CSE',   marks: 15, dueDate: '2026-05-30', submitted: 38, total: 40, graded: 38, status: 'Graded'  },
    { id: 'ASN003', title: 'Digital Circuit Design (Adder)',          subject: 'Digital Circuits',    course: 'B.Tech ECE', marks: 25, dueDate: '2026-06-05', submitted: 5,  total: 42, graded: 0,  status: 'Active'  },
    { id: 'ASN004', title: 'Company Financial Analysis',              subject: 'Financial Accounting',course: 'B.Com Hons', marks: 30, dueDate: '2026-05-28', submitted: 2,  total: 38, graded: 0,  status: 'Overdue' },
    { id: 'ASN005', title: 'Research Paper on Post-Modern Fiction',   subject: 'Modern Literature',   course: 'B.A English',marks: 25, dueDate: '2026-06-15', submitted: 0,  total: 30, graded: 0,  status: 'Active'  },
];

const PROGRAMMES = ['B.Sc Computer Science','B.Sc CSE','B.Tech ECE','B.Com Honours','B.Com Hons','M.Sc Mathematics','M.Sc Maths','B.A English','M.Tech CSE','MBA','BCA','MCA'];
const DEPARTMENTS = ['Computer Science','Electronics','Mathematics','Commerce','Physics','Chemistry','English','Management','Biology','Economics'];

const EMPTY_SYL  = { course:'', subject:'', dept:'', year:1, semester:1, units:5, status:'Not Started' };
const EMPTY_MAT  = { title:'', subject:'', course:'', type:'PDF', size:'', url:'' };
const EMPTY_HW   = { title:'', subject:'', course:'', assignedTo:'', dueDate:'', description:'' };
const EMPTY_ASN  = { title:'', subject:'', course:'', marks:20, dueDate:'', description:'' };
const EMPTY_STUHW  = { hwId:'', notes:'', fileName:'' };
const EMPTY_STUASN = { asnId:'', notes:'', fileName:'' };

const TABS = [
    { key: 'syllabus',    label: 'Syllabus',    icon: Layers,        color: '#1e40af' },
    { key: 'materials',   label: 'Materials',   icon: FolderOpen,    color: '#7c3aed' },
    { key: 'homework',    label: 'Homework',    icon: ClipboardList, color: '#059669' },
    { key: 'assignments', label: 'Assignments', icon: Send,          color: '#d97706' },
];

const TYPE_ICON  = { PDF: FileText, Video, Link: Link2 };
const TYPE_COLOR = { PDF: '#dc2626', Video: '#7c3aed', Link: '#0284c7' };
const TYPE_BG    = { PDF: '#fef2f2', Video: '#f5f3ff', Link: '#e0f2fe' };

const statusBadge = s => ({
    Completed: 'badge-success', 'In Progress': 'badge-info', 'Not Started': 'badge-neutral',
    Active: 'badge-success', Closed: 'badge-neutral', Overdue: 'badge-danger', Graded: 'badge-info',
}[s] || 'badge-neutral');

/* ── Tiny form-field helper ── */
const LF = ({ label, error, children }) => (
    <div className="sf-field">
        <label className="sf-label">{label}</label>
        {children}
        {error && <span className="sf-error">{error}</span>}
    </div>
);

const today = new Date().toISOString().split('T')[0];

export default function LMS() {
    const [tab, setTab] = useState('syllabus');
    const [q, setQ]     = useState('');

    /* ── Data lists ── */
    const [sylList, setSylList]   = useState(INIT_SYLLABUS);
    const [matList, setMatList]   = useState(INIT_MATERIALS);
    const [hwList,  setHwList]    = useState(INIT_HOMEWORK);
    const [asnList, setAsnList]   = useState(INIT_ASSIGNMENTS);

    /* ── Auth modal flow ── */
    // step: null | 'role' | 'verify' | 'form'
    const [step,   setStep]   = useState(null);
    const [role,   setRole]   = useState(null);   // 'teacher' | 'student'
    const [action, setAction] = useState(null);   // 'syllabus'|'material'|'homework'|'assignment'
    const [verified, setVerified] = useState(null);
    const [showPass, setShowPass] = useState(false);

    /* verify inputs */
    const [tVerify, setTVerify] = useState({ regNo:'', password:'', error:'' });
    const [sVerify, setSVerify] = useState({ rollNo:'', password:'', error:'' });

    /* teacher forms */
    const [sylForm,  setSylForm]  = useState(EMPTY_SYL);
    const [matForm,  setMatForm]  = useState(EMPTY_MAT);
    const [hwForm,   setHwForm]   = useState(EMPTY_HW);
    const [asnForm,  setAsnForm]  = useState(EMPTY_ASN);

    /* student forms */
    const [stuHw,  setStuHw]  = useState(EMPTY_STUHW);
    const [stuAsn, setStuAsn] = useState(EMPTY_STUASN);

    /* errors */
    const [ferr, setFerr] = useState({});

    const filt = (arr, keys) =>
        arr.filter(r => !q || keys.some(k => String(r[k]).toLowerCase().includes(q.toLowerCase())));

    /* ── Open ── */
    const openModal = (act) => {
        setAction(act);
        setStep('role');
        setRole(null);
        setVerified(null);
        setShowPass(false);
        setTVerify({ regNo:'', password:'', error:'' });
        setSVerify({ rollNo:'', password:'', error:'' });
        setFerr({});
    };

    const closeModal = () => {
        setStep(null); setRole(null); setAction(null); setVerified(null); setShowPass(false);
        setTVerify({ regNo:'', password:'', error:'' });
        setSVerify({ rollNo:'', password:'', error:'' });
        setSylForm(EMPTY_SYL); setMatForm(EMPTY_MAT); setHwForm(EMPTY_HW); setAsnForm(EMPTY_ASN);
        setStuHw(EMPTY_STUHW); setStuAsn(EMPTY_STUASN); setFerr({});
    };

    const selectRole = r => { setRole(r); setStep('verify'); setShowPass(false); };

    /* ── Teacher verify ── */
    const handleTeacherVerify = () => {
        const key = tVerify.regNo.trim().toUpperCase();
        const t   = TEACHER_CREDENTIALS[key];
        if (!t || t.password !== tVerify.password) {
            setTVerify(f => ({ ...f, error: 'Invalid registration number or password.' }));
            return;
        }
        setVerified({ ...t, id: key, role: 'teacher' });
        setStep('form');
    };

    /* ── Student verify ── */
    const handleStudentVerify = () => {
        const key = sVerify.rollNo.trim().toUpperCase();
        const s   = STUDENT_CREDENTIALS[key];
        if (!s || s.password !== sVerify.password) {
            setSVerify(f => ({ ...f, error: 'Invalid roll number or password.' }));
            return;
        }
        setVerified({ ...s, id: key, role: 'student' });
        setStep('form');
    };

    /* ── Submit: New Syllabus ── */
    const submitSyllabus = () => {
        const e = {};
        if (!sylForm.subject.trim()) e.subject = 'Required';
        if (!sylForm.course)         e.course  = 'Required';
        if (!sylForm.dept)           e.dept    = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        setSylList(prev => [{
            id: `SYL${String(prev.length + 1).padStart(3,'0')}`,
            course: sylForm.course, subject: sylForm.subject.trim(),
            dept: sylForm.dept, year: Number(sylForm.year),
            semester: Number(sylForm.semester), units: Number(sylForm.units),
            covered: 0, faculty: verified.name, lastUpdated: today, status: sylForm.status,
        }, ...prev]);
        closeModal();
    };

    /* ── Submit: Upload Material ── */
    const submitMaterial = () => {
        const e = {};
        if (!matForm.title.trim())   e.title   = 'Required';
        if (!matForm.subject.trim()) e.subject = 'Required';
        if (!matForm.course)         e.course  = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        setMatList(prev => [{
            id: `MAT${String(prev.length + 1).padStart(3,'0')}`,
            title: matForm.title.trim(), subject: matForm.subject.trim(),
            type: matForm.type, size: matForm.size || '—',
            uploadedBy: verified.name, date: today, downloads: 0,
            course: matForm.course,
        }, ...prev]);
        closeModal();
    };

    /* ── Submit: Post Homework ── */
    const submitHomework = () => {
        const e = {};
        if (!hwForm.title.trim())   e.title   = 'Required';
        if (!hwForm.subject.trim()) e.subject = 'Required';
        if (!hwForm.course)         e.course  = 'Required';
        if (!hwForm.dueDate)        e.dueDate = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        setHwList(prev => [{
            id: `HW${String(prev.length + 1).padStart(3,'0')}`,
            title: hwForm.title.trim(), subject: hwForm.subject.trim(),
            course: hwForm.course, assignedTo: hwForm.assignedTo || 'All Students',
            postedBy: verified.name, assignedDate: today, dueDate: hwForm.dueDate,
            submitted: 0, total: 40, status: 'Active',
        }, ...prev]);
        closeModal();
    };

    /* ── Submit: New Assignment ── */
    const submitAssignment = () => {
        const e = {};
        if (!asnForm.title.trim())   e.title   = 'Required';
        if (!asnForm.subject.trim()) e.subject = 'Required';
        if (!asnForm.course)         e.course  = 'Required';
        if (!asnForm.dueDate)        e.dueDate = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        setAsnList(prev => [{
            id: `ASN${String(prev.length + 1).padStart(3,'0')}`,
            title: asnForm.title.trim(), subject: asnForm.subject.trim(),
            course: asnForm.course, marks: Number(asnForm.marks),
            dueDate: asnForm.dueDate, submitted: 0, total: 40, graded: 0, status: 'Active',
        }, ...prev]);
        closeModal();
    };

    /* ── Submit: Student Homework ── */
    const submitStuHomework = () => {
        if (!stuHw.hwId) { setFerr({ hwId: 'Select a homework' }); return; }
        setHwList(prev => prev.map(h => h.id === stuHw.hwId ? { ...h, submitted: h.submitted + 1 } : h));
        closeModal();
    };

    /* ── Submit: Student Assignment ── */
    const submitStuAssignment = () => {
        if (!stuAsn.asnId) { setFerr({ asnId: 'Select an assignment' }); return; }
        setAsnList(prev => prev.map(a => a.id === stuAsn.asnId ? { ...a, submitted: a.submitted + 1 } : a));
        closeModal();
    };

    /* ── Button label ── */
    const btnLabel = t => t === 'syllabus' ? 'Add Syllabus' : t === 'materials' ? 'Upload Material' : t === 'homework' ? 'Post Homework' : 'New Assignment';

    const HS = {
        heroGrid:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 },
        heroCard:  { borderRadius:16, padding:'20px 22px', position:'relative', overflow:'hidden', color:'white', minHeight:110 },
        heroTop:   { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
        heroIconBox:{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
        heroVal:   { fontSize:'2rem', fontWeight:800, fontFamily:'var(--font-display)', lineHeight:1 },
        heroLbl:   { fontSize:'0.78rem', fontWeight:600, opacity:0.88, marginBottom:4 },
        heroSub:   { fontSize:'0.68rem', opacity:0.72, lineHeight:1.4 },
        heroShine: { position:'absolute', top:0, right:0, bottom:0, width:'55%', background:'rgba(255,255,255,0.055)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' },
        tabRow:    { display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' },
        tabBar:    { display:'flex', gap:2, background:'white', border:'1px solid var(--border)', borderRadius:12, padding:'6px 8px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', overflow:'hidden', flex:1 },
        tab:       { display:'flex', alignItems:'center', gap:7, padding:'8px 16px', border:'none', background:'transparent', borderRadius:8, cursor:'pointer', fontSize:'0.83rem', fontWeight:500, color:'var(--text-muted)', transition:'all 0.15s', whiteSpace:'nowrap', fontFamily:'var(--font-body)', position:'relative' },
        tabActive: { background:'rgba(37,99,235,0.08)', color:'#2563eb', fontWeight:700 },
        tabDot:    { position:'absolute', bottom:3, left:'50%', transform:'translateX(-50%)', width:5, height:5, borderRadius:99, background:'#2563eb' },
        searchWrap:{ display:'flex', alignItems:'center', gap:8, background:'white', border:'1px solid var(--border)', borderRadius:9, padding:'7px 12px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', minWidth:200 },
        searchInput:{ border:'none', outline:'none', fontSize:'0.83rem', color:'var(--text-primary)', background:'transparent', width:'100%', fontFamily:'var(--font-body)' },
    };

    return (
        <div className="erp-page">
            <Navbar title="Learning Management System" subtitle="Syllabus, materials, homework and assignments" />

            {/* ── Hero KPI Cards ── */}
            <div style={HS.heroGrid}>
                {[
                    { label:'Syllabi Tracked', value:sylList.length,                               icon:Layers,       gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  sub:`${sylList.filter(s=>s.status==='Completed').length} completed · ${sylList.filter(s=>s.status==='In Progress').length} in progress` },
                    { label:'Study Materials', value:matList.length,                               icon:FolderOpen,   gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.28)', sub:`${matList.reduce((a,m)=>a+m.downloads,0)} total downloads` },
                    { label:'Active Homework', value:hwList.filter(h=>h.status==='Active').length, icon:ClipboardList,gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(5,150,105,0.28)',  sub:`${hwList.filter(h=>h.status==='Overdue').length} overdue · ${hwList.filter(h=>h.status==='Closed').length} closed` },
                    { label:'Assignments',     value:asnList.length,                               icon:Send,         gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', sub:`${asnList.filter(a=>a.status==='Active').length} active · ${asnList.filter(a=>a.status==='Graded').length} graded` },
                ].map(({ label, value, icon:Icon, gradient, glow, sub })=>(
                    <div key={label} style={{ ...HS.heroCard, background:gradient, boxShadow:`0 8px 24px ${glow}` }}>
                        <div style={HS.heroTop}>
                            <div style={HS.heroIconBox}><Icon size={20} strokeWidth={2} color="white"/></div>
                            <div style={HS.heroVal}>{value}</div>
                        </div>
                        <div style={HS.heroLbl}>{label}</div>
                        <div style={HS.heroSub}>{sub}</div>
                        <div style={HS.heroShine}/>
                    </div>
                ))}
            </div>

            {/* ── Tab Bar + Toolbar ── */}
            <div style={HS.tabRow}>
                <div style={HS.tabBar}>
                    {TABS.map(({ key, label, icon:Icon })=>{
                        const active = tab===key;
                        return (
                            <button key={key} style={{ ...HS.tab, ...(active?HS.tabActive:{}) }} onClick={()=>{ setTab(key); setQ(''); }}>
                                <Icon size={15} strokeWidth={active?2.5:2}/>
                                {label}
                                {active && <span style={HS.tabDot}/>}
                            </button>
                        );
                    })}
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <div style={HS.searchWrap}>
                        <Search size={14} color="var(--text-muted)"/>
                        <input style={HS.searchInput} placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/>
                        {q && <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2, display:'flex' }} onClick={()=>setQ('')}><X size={12}/></button>}
                    </div>
                    <button className="btn btn-secondary btn-sm"><Download size={13}/> Export</button>
                    <button className="btn btn-primary btn-sm" onClick={()=>openModal(tab==='materials'?'material':tab==='homework'?'homework':tab==='assignments'?'assignment':'syllabus')}>
                        <Plus size={13}/> {btnLabel(tab)}
                    </button>
                </div>
            </div>

            {/* ══════════ SYLLABUS TAB ══════════ */}
            {tab === 'syllabus' && (() => {
                const data = filt(sylList, ['course','subject','dept','faculty']);
                return (
                    <div className="card">
                        <div className="card-header">
                            <div><h2>Syllabus Tracker <span className="count-pill">{data.length}</span></h2><p>Course-wise syllabus coverage and progress</p></div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead><tr>
                                    <th>Course & Subject</th><th>Department</th><th>Year / Sem</th>
                                    <th>Progress</th><th>Faculty</th><th>Last Updated</th>
                                    <th>Status</th><th style={{ textAlign:'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.map(s => {
                                        const pct = Math.round((s.covered / s.units) * 100);
                                        const barGrad = pct===100 ? 'linear-gradient(90deg,#065f46,#059669)' : pct>=60 ? 'linear-gradient(90deg,#1e3a8a,#2563eb)' : 'linear-gradient(90deg,#92400e,#d97706)';
                                        const barCol  = pct===100 ? '#059669' : pct>=60 ? '#2563eb' : '#d97706';
                                        const DEPT_COLORS = { CS:['#dbeafe','#1e40af'], IT:['#e0e7ff','#4338ca'], ME:['#fef3c7','#d97706'], EC:['#fce7f3','#be185d'], CE:['#d1fae5','#065f46'] };
                                        const [dBg, dCol] = DEPT_COLORS[s.dept] ?? ['#f1f5f9','#475569'];
                                        const STATUS_PILL = { 'Completed':['#d1fae5','#065f46','#6ee7b7'], 'In Progress':['#dbeafe','#1d4ed8','#93c5fd'], 'Not Started':['#f1f5f9','#475569','#cbd5e1'] };
                                        const [sBg, sCol, sBdr] = STATUS_PILL[s.status] ?? ['#f1f5f9','#475569','#cbd5e1'];
                                        return (
                                            <tr key={s.id}>
                                                <td>
                                                    <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{s.subject}</div>
                                                    <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:2 }}>{s.course}</div>
                                                </td>
                                                <td><span style={{ background:dBg, color:dCol, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:`1px solid ${dCol}33` }}>{s.dept}</span></td>
                                                <td style={{ fontSize:'0.83rem', color:'var(--text-secondary)' }}>Year {s.year} · Sem {s.semester}</td>
                                                <td style={{ minWidth:170 }}>
                                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                        <div style={{ flex:1, height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                            <div style={{ width:`${pct}%`, height:'100%', background:barGrad, borderRadius:99, transition:'width 0.4s' }} />
                                                        </div>
                                                        <span style={{ fontSize:'0.72rem', fontWeight:700, color:barCol, minWidth:52, textAlign:'right' }}>{s.covered}/{s.units}</span>
                                                    </div>
                                                    <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:2 }}>{pct}% complete</div>
                                                </td>
                                                <td style={{ fontSize:'0.83rem', color:'var(--text-secondary)' }}>{s.faculty}</td>
                                                <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{s.lastUpdated}</td>
                                                <td><span style={{ background:sBg, color:sCol, border:`1px solid ${sBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:600 }}>{s.status}</span></td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        <button className="tbl-btn"><Eye size={13} /></button>
                                                        <button className="tbl-btn"><Edit2 size={13} /></button>
                                                        <button className="tbl-btn danger" onClick={() => setSylList(p => p.filter(x => x.id !== s.id))}><Trash2 size={13} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {data.length === 0 && <div className="empty-state"><div className="empty-icon">📚</div><p>No syllabus records found.</p></div>}
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ MATERIALS TAB ══════════ */}
            {tab === 'materials' && (() => {
                const data = filt(matList, ['title','subject','course','uploadedBy']);
                return (
                    <div className="card">
                        <div className="card-header">
                            <div><h2>Digital Study Materials <span className="count-pill">{data.length}</span></h2><p>PDFs, videos and reference links shared by faculty</p></div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead><tr>
                                    <th>Material</th><th>Type</th><th>Subject / Course</th>
                                    <th>Uploaded By</th><th>Date</th><th>Size</th>
                                    <th>Downloads</th><th style={{ textAlign:'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.map(m => {
                                        const TIcon = TYPE_ICON[m.type] ?? FileText;
                                        const tColor = TYPE_COLOR[m.type] ?? '#475569';
                                        const tBg    = TYPE_BG[m.type]   ?? '#f1f5f9';
                                        const TYPE_GRAD = { PDF:'linear-gradient(135deg,#dc2626,#ef4444)', Video:'linear-gradient(135deg,#7c3aed,#8b5cf6)', Link:'linear-gradient(135deg,#0284c7,#0ea5e9)' };
                                        const iconGrad = TYPE_GRAD[m.type] ?? 'linear-gradient(135deg,#475569,#64748b)';
                                        return (
                                            <tr key={m.id}>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ width:36, height:36, borderRadius:9, background:iconGrad, color:'white', display:'grid', placeItems:'center', flexShrink:0, boxShadow:`0 2px 8px ${tColor}44` }}>
                                                            <TIcon size={16} />
                                                        </div>
                                                        <div style={{ fontWeight:600, fontSize:'0.83rem', color:'var(--text-primary)', maxWidth:220 }}>{m.title}</div>
                                                    </div>
                                                </td>
                                                <td><span style={{ background:tBg, color:tColor, padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1px solid ${tColor}33` }}>{m.type}</span></td>
                                                <td><div style={{ fontSize:'0.83rem', fontWeight:600 }}>{m.subject}</div><div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{m.course}</div></td>
                                                <td style={{ fontSize:'0.83rem', color:'var(--text-secondary)' }}>{m.uploadedBy}</td>
                                                <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{m.date}</td>
                                                <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{m.size}</td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                                                        <div style={{ width:32, height:32, borderRadius:8, background:'#eff6ff', display:'grid', placeItems:'center' }}><Download size={13} color="#2563eb"/></div>
                                                        <span style={{ fontSize:'0.83rem', fontWeight:700, color:'#2563eb' }}>{m.downloads}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        <button className="tbl-btn" onClick={() => setMatList(p => p.map(x => x.id === m.id ? { ...x, downloads: x.downloads + 1 } : x))}><Download size={13} /></button>
                                                        <button className="tbl-btn danger" onClick={() => setMatList(p => p.filter(x => x.id !== m.id))}><Trash2 size={13} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {data.length === 0 && <div className="empty-state"><div className="empty-icon">📂</div><p>No materials found.</p></div>}
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ HOMEWORK TAB ══════════ */}
            {tab === 'homework' && (() => {
                const data = filt(hwList, ['title','subject','course','postedBy']);
                return (
                    <div className="card">
                        <div className="card-header">
                            <div><h2>Homework Portal <span className="count-pill">{data.length}</span></h2><p>Faculty-posted homework with submission tracking</p></div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead><tr>
                                    <th>Homework Title</th><th>Subject / Course</th><th>Posted By</th>
                                    <th>Assigned To</th><th>Due Date</th><th>Submissions</th>
                                    <th>Status</th><th style={{ textAlign:'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.map(h => {
                                        const pct = Math.round((h.submitted / h.total) * 100);
                                        const subGrad = pct===100 ? 'linear-gradient(90deg,#065f46,#059669)' : 'linear-gradient(90deg,#1e3a8a,#2563eb)';
                                        const HW_STATUS = { Active:['#dbeafe','#1d4ed8','#93c5fd'], Overdue:['#fef2f2','#dc2626','#fca5a5'], Closed:['#f1f5f9','#475569','#cbd5e1'] };
                                        const [hBg, hCol, hBdr] = HW_STATUS[h.status] ?? ['#f1f5f9','#475569','#cbd5e1'];
                                        return (
                                            <tr key={h.id}>
                                                <td>
                                                    <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{h.title}</div>
                                                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>Assigned: {h.assignedDate}</div>
                                                </td>
                                                <td><div style={{ fontSize:'0.83rem', fontWeight:600 }}>{h.subject}</div><div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{h.course}</div></td>
                                                <td style={{ fontSize:'0.83rem', color:'var(--text-secondary)' }}>{h.postedBy}</td>
                                                <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{h.assignedTo}</td>
                                                <td>
                                                    <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:'0.78rem', padding:'3px 8px', borderRadius:6, background: h.status==='Overdue'?'#fef2f2':'#f8fafc', border:`1px solid ${h.status==='Overdue'?'#fca5a5':'var(--border)'}` }}>
                                                        <Calendar size={11} color={h.status==='Overdue'?'#dc2626':'var(--text-muted)'} />
                                                        <span style={{ color:h.status==='Overdue'?'#dc2626':'var(--text-secondary)', fontWeight:h.status==='Overdue'?700:400 }}>{h.dueDate}</span>
                                                    </div>
                                                </td>
                                                <td style={{ minWidth:150 }}>
                                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                        <div style={{ flex:1, height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                            <div style={{ width:`${pct}%`, height:'100%', background:subGrad, borderRadius:99, transition:'width 0.4s' }} />
                                                        </div>
                                                        <span style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-secondary)', minWidth:40, textAlign:'right' }}>{h.submitted}/{h.total}</span>
                                                    </div>
                                                    <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:2 }}>{pct}% submitted</div>
                                                </td>
                                                <td><span style={{ background:hBg, color:hCol, border:`1px solid ${hBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:600 }}>{h.status}</span></td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        <button className="tbl-btn lms-submit-btn" title="Submit Homework" onClick={() => { setStuHw({ ...EMPTY_STUHW, hwId: h.id }); openModal('homework'); }}><Upload size={13} /></button>
                                                        <button className="tbl-btn"><Users size={13} /></button>
                                                        <button className="tbl-btn danger" onClick={() => setHwList(p => p.filter(x => x.id !== h.id))}><Trash2 size={13} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {data.length === 0 && <div className="empty-state"><div className="empty-icon">📝</div><p>No homework records found.</p></div>}
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ ASSIGNMENTS TAB ══════════ */}
            {tab === 'assignments' && (() => {
                const data = filt(asnList, ['title','subject','course']);
                return (
                    <div className="card">
                        <div className="card-header">
                            <div><h2>Assignment Portal <span className="count-pill">{data.length}</span></h2><p>Graded assignments with submission and evaluation tracking</p></div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead><tr>
                                    <th>Assignment</th><th>Subject / Course</th><th>Max Marks</th>
                                    <th>Due Date</th><th>Submitted</th><th>Graded</th>
                                    <th>Status</th><th style={{ textAlign:'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.map(a => {
                                        const subPct   = Math.round((a.submitted / a.total) * 100);
                                        const gradePct = a.submitted > 0 ? Math.round((a.graded / a.submitted) * 100) : 0;
                                        const subGrad  = subPct===100 ? 'linear-gradient(90deg,#065f46,#059669)' : 'linear-gradient(90deg,#1e3a8a,#2563eb)';
                                        const grdGrad  = gradePct===100 ? 'linear-gradient(90deg,#065f46,#059669)' : 'linear-gradient(90deg,#7c3aed,#8b5cf6)';
                                        const ASN_STATUS = { Active:['#dbeafe','#1d4ed8','#93c5fd'], Overdue:['#fef2f2','#dc2626','#fca5a5'], Graded:['#d1fae5','#065f46','#6ee7b7'], Closed:['#f1f5f9','#475569','#cbd5e1'] };
                                        const [aBg, aCol, aBdr] = ASN_STATUS[a.status] ?? ['#f1f5f9','#475569','#cbd5e1'];
                                        return (
                                            <tr key={a.id}>
                                                <td>
                                                    <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{a.title}</div>
                                                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>ID: {a.id}</div>
                                                </td>
                                                <td><div style={{ fontSize:'0.83rem', fontWeight:600 }}>{a.subject}</div><div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{a.course}</div></td>
                                                <td>
                                                    <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:'linear-gradient(135deg,#fef3c7,#fde68a)', color:'#92400e', padding:'4px 10px', borderRadius:99, fontSize:'0.76rem', fontWeight:700, border:'1px solid #fbbf24' }}>
                                                        <Star size={11} fill="#d97706" strokeWidth={0}/> {a.marks} marks
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:'0.78rem', padding:'3px 8px', borderRadius:6, background:a.status==='Overdue'?'#fef2f2':'#f8fafc', border:`1px solid ${a.status==='Overdue'?'#fca5a5':'var(--border)'}` }}>
                                                        <Calendar size={11} color={a.status==='Overdue'?'#dc2626':'var(--text-muted)'} />
                                                        <span style={{ color:a.status==='Overdue'?'#dc2626':'var(--text-secondary)', fontWeight:a.status==='Overdue'?700:400 }}>{a.dueDate}</span>
                                                    </div>
                                                </td>
                                                <td style={{ minWidth:110 }}>
                                                    <div style={{ fontSize:'0.78rem', fontWeight:600, color:'var(--text-secondary)', marginBottom:4 }}>{a.submitted}<span style={{ color:'var(--text-muted)', fontWeight:400 }}>/{a.total}</span></div>
                                                    <div style={{ height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden', width:80 }}>
                                                        <div style={{ width:`${subPct}%`, height:'100%', background:subGrad, borderRadius:99 }} />
                                                    </div>
                                                </td>
                                                <td style={{ minWidth:100 }}>
                                                    <div style={{ fontSize:'0.78rem', fontWeight:600, color:gradePct===100?'#059669':'var(--text-secondary)', marginBottom:4 }}>
                                                        {a.graded}<span style={{ color:'var(--text-muted)', fontWeight:400 }}>/{a.submitted||'—'}</span>
                                                    </div>
                                                    <div style={{ height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden', width:70 }}>
                                                        <div style={{ width:`${gradePct}%`, height:'100%', background:grdGrad, borderRadius:99 }} />
                                                    </div>
                                                </td>
                                                <td><span style={{ background:aBg, color:aCol, border:`1px solid ${aBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:600 }}>{a.status}</span></td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        <button className="tbl-btn lms-submit-btn" title="Submit Assignment" onClick={() => { setStuAsn({ ...EMPTY_STUASN, asnId: a.id }); openModal('assignment'); }}><Upload size={13} /></button>
                                                        <button className="tbl-btn"><Eye size={13} /></button>
                                                        <button className="tbl-btn danger" onClick={() => setAsnList(p => p.filter(x => x.id !== a.id))}><Trash2 size={13} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {data.length === 0 && <div className="empty-state"><div className="empty-icon">📋</div><p>No assignments found.</p></div>}
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ MODAL FLOW ══════════ */}
            {step && (
                <div className="em-overlay" onClick={closeModal}>
                    <div className={`em-modal ${step !== 'role' ? 'em-modal-lg' : ''}`}
                        style={{ maxWidth: step === 'role' ? 480 : step === 'verify' ? 420 : 600 }}
                        onClick={e => e.stopPropagation()}>

                        {/* ── STEP 1: Role Selector ── */}
                        {step === 'role' && (
                            <>
                                <div className="em-modal-head">
                                    <div>
                                        <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>Who are you?</h3>
                                        <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>
                                            {action === 'syllabus' ? 'Add new syllabus' : action === 'material' ? 'Upload study material' : action === 'homework' ? 'Post or submit homework' : 'Create or submit assignment'}
                                        </p>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16} /></button>
                                </div>
                                <div className="em-modal-body">
                                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                                        {/* Teacher card */}
                                        <button type="button" className="lms-role-card" onClick={() => selectRole('teacher')}
                                            style={{ borderColor:'#1e40af', background:'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                                            <div style={{ width:52, height:52, borderRadius:14, background:'#1e40af', display:'grid', placeItems:'center', margin:'0 auto 12px' }}>
                                                <GraduationCap size={26} color="white" />
                                            </div>
                                            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1e3a8a', marginBottom:5 }}>Teacher</div>
                                            <div style={{ fontSize:'0.75rem', color:'#1d4ed8', lineHeight:1.4 }}>
                                                {action === 'syllabus' ? 'Add & manage syllabus' : action === 'material' ? 'Upload PDFs, videos & links' : action === 'homework' ? 'Post new homework for students' : 'Create graded assignments'}
                                            </div>
                                        </button>
                                        {/* Student card */}
                                        <button type="button" className="lms-role-card"
                                            onClick={() => (action === 'syllabus' || action === 'material') ? null : selectRole('student')}
                                            style={{
                                                borderColor: (action === 'syllabus' || action === 'material') ? '#e2e8f0' : '#059669',
                                                background: (action === 'syllabus' || action === 'material') ? '#f8fafc' : 'linear-gradient(135deg,#f0fdf4,#d1fae5)',
                                                opacity: (action === 'syllabus' || action === 'material') ? 0.5 : 1,
                                                cursor: (action === 'syllabus' || action === 'material') ? 'not-allowed' : 'pointer',
                                            }}>
                                            <div style={{ width:52, height:52, borderRadius:14, background: (action === 'syllabus' || action === 'material') ? '#94a3b8' : '#059669', display:'grid', placeItems:'center', margin:'0 auto 12px' }}>
                                                <UserCircle size={26} color="white" />
                                            </div>
                                            <div style={{ fontWeight:800, fontSize:'1rem', color: (action === 'syllabus' || action === 'material') ? '#94a3b8' : '#065f46', marginBottom:5 }}>Student</div>
                                            <div style={{ fontSize:'0.75rem', color: (action === 'syllabus' || action === 'material') ? '#94a3b8' : '#047857', lineHeight:1.4 }}>
                                                {action === 'syllabus' || action === 'material' ? 'View only — cannot upload' : action === 'homework' ? 'Submit your homework' : 'Submit your assignment'}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── STEP 2: Verify ── */}
                        {step === 'verify' && (
                            <>
                                <div className="em-modal-head">
                                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                                        <div style={{ width:44, height:44, borderRadius:12, background: role === 'teacher' ? 'linear-gradient(135deg,#1e40af,#3b82f6)' : 'linear-gradient(135deg,#059669,#34d399)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                            <ShieldCheck size={22} color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>{role === 'teacher' ? 'Teacher' : 'Student'} Verification</h3>
                                            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>Enter your credentials to continue</p>
                                        </div>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16} /></button>
                                </div>
                                <div className="em-modal-body">
                                    {role === 'teacher' ? (
                                        <>
                                            {tVerify.error && <div className="em-alert-error"><AlertCircle size={14} /> {tVerify.error}</div>}
                                            <div className="sf-field">
                                                <label className="sf-label">Teacher Registration Number</label>
                                                <input className="sf-input" placeholder="e.g. TCH001" value={tVerify.regNo} onChange={e => setTVerify(f => ({ ...f, regNo:e.target.value, error:'' }))} onKeyDown={e => e.key==='Enter' && handleTeacherVerify()} autoFocus />
                                            </div>
                                            <div className="sf-field" style={{ marginTop:14 }}>
                                                <label className="sf-label">Password</label>
                                                <div style={{ position:'relative' }}>
                                                    <input className="sf-input" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={tVerify.password} onChange={e => setTVerify(f => ({ ...f, password:e.target.value, error:'' }))} onKeyDown={e => e.key==='Enter' && handleTeacherVerify()} style={{ paddingRight:40 }} />
                                                    <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><Lock size={14} /></button>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', alignItems:'flex-start', gap:9, background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:8, padding:'10px 14px', marginTop:16 }}>
                                                <AlertCircle size={14} style={{ color:'#0284c7', marginTop:1, flexShrink:0 }} />
                                                <p style={{ margin:0, fontSize:'0.75rem', color:'#0369a1', lineHeight:1.5 }}>Use your <strong>Teacher ID</strong> (TCH001–TCH010) and your assigned password (<strong>pass</strong> + 3-digit ID, e.g. <strong>pass006</strong> for TCH006).</p>
                                            </div>
                                            <button className="btn btn-primary" style={{ width:'100%', marginTop:20 }} onClick={handleTeacherVerify}><ShieldCheck size={15} /> Verify & Continue</button>
                                        </>
                                    ) : (
                                        <>
                                            {sVerify.error && <div className="em-alert-error"><AlertCircle size={14} /> {sVerify.error}</div>}
                                            <div className="sf-field">
                                                <label className="sf-label">Roll Number</label>
                                                <input className="sf-input" placeholder="e.g. CS2024001" value={sVerify.rollNo} onChange={e => setSVerify(f => ({ ...f, rollNo:e.target.value, error:'' }))} onKeyDown={e => e.key==='Enter' && handleStudentVerify()} autoFocus style={{ textTransform:'uppercase', fontFamily:'monospace' }} />
                                            </div>
                                            <div className="sf-field" style={{ marginTop:14 }}>
                                                <label className="sf-label">Password</label>
                                                <div style={{ position:'relative' }}>
                                                    <input className="sf-input" type={showPass ? 'text' : 'password'} placeholder="Enter your password" value={sVerify.password} onChange={e => setSVerify(f => ({ ...f, password:e.target.value, error:'' }))} onKeyDown={e => e.key==='Enter' && handleStudentVerify()} style={{ paddingRight:40 }} />
                                                    <button type="button" onClick={() => setShowPass(v => !v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><Lock size={14} /></button>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', alignItems:'flex-start', gap:9, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:'10px 14px', marginTop:16 }}>
                                                <AlertCircle size={14} style={{ color:'#059669', marginTop:1, flexShrink:0 }} />
                                                <p style={{ margin:0, fontSize:'0.75rem', color:'#047857', lineHeight:1.5 }}>Use your <strong>Roll Number</strong> and the password issued by your institution (format: <strong>stu</strong> + 3 digits, e.g. <strong>stu001</strong>).</p>
                                            </div>
                                            <button className="btn btn-primary" style={{ width:'100%', marginTop:20, background:'#059669', borderColor:'#059669' }} onClick={handleStudentVerify}><ShieldCheck size={15} /> Verify & Continue</button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ── STEP 3: Forms ── */}
                        {step === 'form' && verified && (
                            <>
                                <div className="em-modal-head">
                                    <div>
                                        <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>
                                            {verified.role === 'teacher'
                                                ? (action === 'syllabus' ? 'Add New Syllabus' : action === 'material' ? 'Upload Study Material' : action === 'homework' ? 'Post Homework' : 'New Assignment')
                                                : (action === 'homework' ? 'Submit Homework' : 'Submit Assignment')}
                                        </h3>
                                        <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>Logged in as {verified.name}</p>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16} /></button>
                                </div>
                                <div className="em-modal-body">
                                    {/* Verified banner */}
                                    <div style={{ display:'flex', alignItems:'center', gap:10, background: verified.role === 'teacher' ? '#dbeafe' : '#d1fae5', border:`1px solid ${verified.role === 'teacher' ? '#93c5fd' : '#6ee7b7'}`, borderRadius:10, padding:'10px 16px', marginBottom:20 }}>
                                        <CheckCircle2 size={18} style={{ color: verified.role === 'teacher' ? '#1e40af' : '#059669', flexShrink:0 }} />
                                        <div>
                                            <div style={{ fontSize:'0.83rem', fontWeight:700, color: verified.role === 'teacher' ? '#1e3a8a' : '#065f46' }}>
                                                {verified.role === 'teacher' ? `Teacher: ${verified.name}` : `Student: ${verified.name}`}
                                            </div>
                                            <div style={{ fontSize:'0.72rem', color: verified.role === 'teacher' ? '#1d4ed8' : '#047857' }}>
                                                {verified.role === 'teacher' ? `${verified.id} · ${verified.dept}` : `${verified.id} · ${verified.course}`}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── TEACHER: Add Syllabus ── */}
                                    {verified.role === 'teacher' && action === 'syllabus' && (
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <LF label={<>Subject Name <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.subject}>
                                                        <input className={`sf-input ${ferr.subject?'sf-input-err':''}`} placeholder="e.g. Data Structures" value={sylForm.subject} onChange={e => { setSylForm(f=>({...f,subject:e.target.value})); setFerr(x=>({...x,subject:''})); }} />
                                                    </LF>
                                                </div>
                                                <LF label={<>Course <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.course}>
                                                    <select className={`sf-input ${ferr.course?'sf-input-err':''}`} value={sylForm.course} onChange={e => { setSylForm(f=>({...f,course:e.target.value})); setFerr(x=>({...x,course:''})); }}>
                                                        <option value="">Select programme…</option>
                                                        {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                </LF>
                                                <LF label={<>Department <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.dept}>
                                                    <select className={`sf-input ${ferr.dept?'sf-input-err':''}`} value={sylForm.dept} onChange={e => { setSylForm(f=>({...f,dept:e.target.value})); setFerr(x=>({...x,dept:''})); }}>
                                                        <option value="">Select department…</option>
                                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                                    </select>
                                                </LF>
                                                <LF label="Year">
                                                    <select className="sf-input" value={sylForm.year} onChange={e => setSylForm(f=>({...f,year:e.target.value}))}>
                                                        {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
                                                    </select>
                                                </LF>
                                                <LF label="Semester">
                                                    <select className="sf-input" value={sylForm.semester} onChange={e => setSylForm(f=>({...f,semester:e.target.value}))}>
                                                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                                    </select>
                                                </LF>
                                                <LF label="Total Units">
                                                    <input type="number" min="1" max="20" className="sf-input" value={sylForm.units} onChange={e => setSylForm(f=>({...f,units:e.target.value}))} />
                                                </LF>
                                                <LF label="Status">
                                                    <select className="sf-input" value={sylForm.status} onChange={e => setSylForm(f=>({...f,status:e.target.value}))}>
                                                        <option>Not Started</option><option>In Progress</option>
                                                    </select>
                                                </LF>
                                            </div>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" onClick={submitSyllabus}><Layers size={14} /> Add Syllabus</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── TEACHER: Upload Material ── */}
                                    {verified.role === 'teacher' && action === 'material' && (
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <LF label={<>Title <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.title}>
                                                        <input className={`sf-input ${ferr.title?'sf-input-err':''}`} placeholder="e.g. Lecture Notes — Unit 3" value={matForm.title} onChange={e => { setMatForm(f=>({...f,title:e.target.value})); setFerr(x=>({...x,title:''})); }} />
                                                    </LF>
                                                </div>
                                                <LF label={<>Subject <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.subject}>
                                                    <input className={`sf-input ${ferr.subject?'sf-input-err':''}`} placeholder="e.g. Data Structures" value={matForm.subject} onChange={e => { setMatForm(f=>({...f,subject:e.target.value})); setFerr(x=>({...x,subject:''})); }} />
                                                </LF>
                                                <LF label={<>Course <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.course}>
                                                    <select className={`sf-input ${ferr.course?'sf-input-err':''}`} value={matForm.course} onChange={e => { setMatForm(f=>({...f,course:e.target.value})); setFerr(x=>({...x,course:''})); }}>
                                                        <option value="">Select programme…</option>
                                                        {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                </LF>
                                                <LF label="Material Type">
                                                    <div style={{ display:'flex', gap:8, marginTop:6 }}>
                                                        {['PDF','Video','Link'].map(t => (
                                                            <button key={t} type="button" onClick={() => setMatForm(f=>({...f,type:t}))} style={{ flex:1, padding:'8px 0', borderRadius:8, border:`2px solid ${matForm.type===t ? TYPE_COLOR[t] : 'var(--border)'}`, background: matForm.type===t ? TYPE_BG[t] : 'var(--bg)', color: matForm.type===t ? TYPE_COLOR[t] : 'var(--text-muted)', fontWeight:700, fontSize:'0.78rem', cursor:'pointer' }}>{t}</button>
                                                        ))}
                                                    </div>
                                                </LF>
                                                <LF label={matForm.type === 'Link' ? 'URL / Link' : 'File Size'}>
                                                    <input className="sf-input" placeholder={matForm.type === 'Link' ? 'https://...' : 'e.g. 2.4 MB'} value={matForm.type === 'Link' ? matForm.url : matForm.size} onChange={e => setMatForm(f => matForm.type === 'Link' ? ({...f,url:e.target.value}) : ({...f,size:e.target.value}))} />
                                                </LF>
                                            </div>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" onClick={submitMaterial}><Upload size={14} /> Upload Material</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── TEACHER: Post Homework ── */}
                                    {verified.role === 'teacher' && action === 'homework' && (
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <LF label={<>Homework Title <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.title}>
                                                        <input className={`sf-input ${ferr.title?'sf-input-err':''}`} placeholder="e.g. Implement a Binary Search Tree" value={hwForm.title} onChange={e => { setHwForm(f=>({...f,title:e.target.value})); setFerr(x=>({...x,title:''})); }} />
                                                    </LF>
                                                </div>
                                                <LF label={<>Subject <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.subject}>
                                                    <input className={`sf-input ${ferr.subject?'sf-input-err':''}`} placeholder="e.g. Data Structures" value={hwForm.subject} onChange={e => { setHwForm(f=>({...f,subject:e.target.value})); setFerr(x=>({...x,subject:''})); }} />
                                                </LF>
                                                <LF label={<>Course <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.course}>
                                                    <select className={`sf-input ${ferr.course?'sf-input-err':''}`} value={hwForm.course} onChange={e => { setHwForm(f=>({...f,course:e.target.value})); setFerr(x=>({...x,course:''})); }}>
                                                        <option value="">Select programme…</option>
                                                        {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                </LF>
                                                <LF label="Assigned To">
                                                    <input className="sf-input" placeholder="e.g. Year 2, Sem 3" value={hwForm.assignedTo} onChange={e => setHwForm(f=>({...f,assignedTo:e.target.value}))} />
                                                </LF>
                                                <LF label={<>Due Date <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.dueDate}>
                                                    <input type="date" className={`sf-input ${ferr.dueDate?'sf-input-err':''}`} value={hwForm.dueDate} min={today} onChange={e => { setHwForm(f=>({...f,dueDate:e.target.value})); setFerr(x=>({...x,dueDate:''})); }} />
                                                </LF>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <LF label="Description / Instructions">
                                                        <textarea className="sf-input" rows={3} placeholder="Describe the homework task…" value={hwForm.description} onChange={e => setHwForm(f=>({...f,description:e.target.value}))} style={{ resize:'vertical' }} />
                                                    </LF>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" onClick={submitHomework}><ClipboardList size={14} /> Post Homework</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── TEACHER: New Assignment ── */}
                                    {verified.role === 'teacher' && action === 'assignment' && (
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <LF label={<>Assignment Title <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.title}>
                                                        <input className={`sf-input ${ferr.title?'sf-input-err':''}`} placeholder="e.g. Mini Project: Library System" value={asnForm.title} onChange={e => { setAsnForm(f=>({...f,title:e.target.value})); setFerr(x=>({...x,title:''})); }} />
                                                    </LF>
                                                </div>
                                                <LF label={<>Subject <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.subject}>
                                                    <input className={`sf-input ${ferr.subject?'sf-input-err':''}`} placeholder="e.g. Data Structures" value={asnForm.subject} onChange={e => { setAsnForm(f=>({...f,subject:e.target.value})); setFerr(x=>({...x,subject:''})); }} />
                                                </LF>
                                                <LF label={<>Course <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.course}>
                                                    <select className={`sf-input ${ferr.course?'sf-input-err':''}`} value={asnForm.course} onChange={e => { setAsnForm(f=>({...f,course:e.target.value})); setFerr(x=>({...x,course:''})); }}>
                                                        <option value="">Select programme…</option>
                                                        {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                                                    </select>
                                                </LF>
                                                <LF label="Max Marks">
                                                    <input type="number" min="1" max="100" className="sf-input" value={asnForm.marks} onChange={e => setAsnForm(f=>({...f,marks:e.target.value}))} />
                                                </LF>
                                                <LF label={<>Due Date <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.dueDate}>
                                                    <input type="date" className={`sf-input ${ferr.dueDate?'sf-input-err':''}`} value={asnForm.dueDate} min={today} onChange={e => { setAsnForm(f=>({...f,dueDate:e.target.value})); setFerr(x=>({...x,dueDate:''})); }} />
                                                </LF>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <LF label="Description / Guidelines">
                                                        <textarea className="sf-input" rows={3} placeholder="Describe the assignment requirements…" value={asnForm.description} onChange={e => setAsnForm(f=>({...f,description:e.target.value}))} style={{ resize:'vertical' }} />
                                                    </LF>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" onClick={submitAssignment}><Send size={14} /> Create Assignment</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── STUDENT: Submit Homework ── */}
                                    {verified.role === 'student' && action === 'homework' && (
                                        <>
                                            <LF label={<>Select Homework <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.hwId}>
                                                <select className={`sf-input ${ferr.hwId?'sf-input-err':''}`} value={stuHw.hwId} onChange={e => { setStuHw(f=>({...f,hwId:e.target.value})); setFerr(x=>({...x,hwId:''})); }}>
                                                    <option value="">Select homework to submit…</option>
                                                    {hwList.filter(h => h.status === 'Active').map(h => (
                                                        <option key={h.id} value={h.id}>{h.title} ({h.subject})</option>
                                                    ))}
                                                </select>
                                            </LF>
                                            <LF label="File Name / Attachment (simulated)">
                                                <input className="sf-input" placeholder="e.g. BST_Implementation_CS2024001.pdf" value={stuHw.fileName} onChange={e => setStuHw(f=>({...f,fileName:e.target.value}))} />
                                            </LF>
                                            <LF label="Notes to Teacher">
                                                <textarea className="sf-input" rows={3} placeholder="Any notes or remarks for your teacher…" value={stuHw.notes} onChange={e => setStuHw(f=>({...f,notes:e.target.value}))} style={{ resize:'vertical' }} />
                                            </LF>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" style={{ background:'#059669', borderColor:'#059669' }} onClick={submitStuHomework}><Upload size={14} /> Submit Homework</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── STUDENT: Submit Assignment ── */}
                                    {verified.role === 'student' && action === 'assignment' && (
                                        <>
                                            <LF label={<>Select Assignment <span style={{ color:'#dc2626' }}>*</span></>} error={ferr.asnId}>
                                                <select className={`sf-input ${ferr.asnId?'sf-input-err':''}`} value={stuAsn.asnId} onChange={e => { setStuAsn(f=>({...f,asnId:e.target.value})); setFerr(x=>({...x,asnId:''})); }}>
                                                    <option value="">Select assignment to submit…</option>
                                                    {asnList.filter(a => a.status === 'Active' || a.status === 'Overdue').map(a => (
                                                        <option key={a.id} value={a.id}>{a.title} ({a.subject} · {a.marks} marks)</option>
                                                    ))}
                                                </select>
                                            </LF>
                                            <LF label="File Name / Attachment (simulated)">
                                                <input className="sf-input" placeholder="e.g. Assignment1_CS2024001.pdf" value={stuAsn.fileName} onChange={e => setStuAsn(f=>({...f,fileName:e.target.value}))} />
                                            </LF>
                                            <LF label="Notes to Teacher">
                                                <textarea className="sf-input" rows={3} placeholder="Any notes or remarks for your teacher…" value={stuAsn.notes} onChange={e => setStuAsn(f=>({...f,notes:e.target.value}))} style={{ resize:'vertical' }} />
                                            </LF>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" style={{ background:'#059669', borderColor:'#059669' }} onClick={submitStuAssignment}><Upload size={14} /> Submit Assignment</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        /* ── Role selector cards ── */
        .lms-role-card { width:100%; padding:20px 16px; border-radius:14px; border:2px solid; cursor:pointer; text-align:center; transition:all 0.18s; font-family:var(--font-body); }
        .lms-role-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.1); }

        /* ── Submit button ── */
        .lms-submit-btn { background:#f0fdf4 !important; color:#059669 !important; border:1px solid #bbf7d0 !important; }
        .lms-submit-btn:hover { background:#d1fae5 !important; }

        /* ── Modal overlay & box ── */
        .em-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(3px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; }
        .em-modal { background:var(--bg-card,white); border:1px solid var(--border); border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.18); width:100%; overflow:hidden; animation:lmsSlideUp 0.22s ease; }
        .em-modal-lg { max-height:90vh; overflow-y:auto; }
        @keyframes lmsSlideUp { from{ opacity:0; transform:translateY(20px); } to{ opacity:1; transform:translateY(0); } }

        /* ── Modal header & body ── */
        .em-modal-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--border); background:var(--bg-hover,#f8fafc); }
        .em-modal-body { padding:24px; }
        .em-close-btn { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--bg,white); cursor:pointer; color:var(--text-muted); display:flex; align-items:center; justify-content:center; transition:all 0.15s; flex-shrink:0; }
        .em-close-btn:hover { background:var(--bg-hover); color:var(--text-primary); }

        /* ── Alert error ── */
        .em-alert-error { display:flex; align-items:center; gap:8px; background:#fef2f2; border:1px solid #fca5a5; color:#dc2626; border-radius:8px; padding:10px 14px; font-size:0.83rem; font-weight:500; margin-bottom:14px; }

        /* ── Form fields ── */
        .sf-field { display:flex; flex-direction:column; margin-bottom:14px; }
        .sf-label { font-size:0.78rem; font-weight:600; color:var(--text-secondary); margin-bottom:5px; }
        .sf-input { padding:9px 12px; border:1.5px solid var(--border); border-radius:8px; font-size:0.875rem; color:var(--text-primary); background:var(--bg,white); font-family:var(--font-body); transition:border-color 0.15s; outline:none; width:100%; box-sizing:border-box; }
        .sf-input:focus { border-color:var(--primary,#1e40af); box-shadow:0 0 0 3px rgba(30,64,175,0.08); }
        .sf-input-err { border-color:#dc2626 !important; }
        .sf-input-err:focus { box-shadow:0 0 0 3px rgba(220,38,38,0.08) !important; }
        .sf-error { font-size:0.72rem; color:#dc2626; margin-top:4px; font-weight:500; }

        /* ── Dark mode ── */
        [data-theme="dark"] .em-modal { background:var(--bg-card) !important; }
        [data-theme="dark"] .em-modal-head { background:var(--bg-sidebar) !important; }
        [data-theme="dark"] .sf-input { background:var(--bg-card) !important; }

        @media(max-width:1100px){ .lms-hero-grid{ grid-template-columns:repeat(2,1fr) !important; } }
        @media(max-width:600px){ .lms-hero-grid{ grid-template-columns:1fr !important; } }
      `}</style>
        </div>
    );
}
