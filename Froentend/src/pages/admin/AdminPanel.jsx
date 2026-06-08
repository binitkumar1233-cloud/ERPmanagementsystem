import { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import {
    Shield, Users, GraduationCap, BookOpen, CreditCard,
    Search, Plus, Edit2, Trash2, Eye, EyeOff, X, Download, Upload,
    Activity, Database, Key, CheckCircle, AlertCircle,
    UserCog, RefreshCw, Lock, Unlock, FileText, BarChart2,
    ChevronDown, Save, Clock, Cpu, HardDrive, Wifi,
    TrendingUp, TrendingDown, Zap, Bell, Settings,
} from 'lucide-react';

/* ─────────────────────────────── MOCK DATA ─────────────────────────────── */
const INIT_ADMINS = [
    { id:'ADM001', name:'Admin User',      email:'admin@edumanage.in',   role:'Super Admin', dept:'Management',  status:'Active',  lastLogin:'2026-06-06 09:30', created:'2024-01-01' },
    { id:'ADM002', name:'Priya Sharma',    email:'priya@edumanage.in',   role:'Admin',       dept:'Academics',   status:'Active',  lastLogin:'2026-06-05 14:20', created:'2024-03-15' },
    { id:'ADM003', name:'Ravi Kumar',      email:'ravi@edumanage.in',    role:'Editor',      dept:'Finance',     status:'Active',  lastLogin:'2026-06-04 11:05', created:'2024-06-01' },
    { id:'ADM004', name:'Sunita Patel',    email:'sunita@edumanage.in',  role:'Viewer',      dept:'Library',     status:'Inactive',lastLogin:'2026-05-20 08:45', created:'2025-01-10' },
    { id:'ADM005', name:'Arjun Mehta',     email:'arjun@edumanage.in',   role:'Editor',      dept:'Transport',   status:'Active',  lastLogin:'2026-06-06 07:15', created:'2025-03-22' },
];
const INIT_STUDENTS = [
    { id:'STU001', name:'Ananya Reddy',  course:'B.Tech CS',    year:'3rd', email:'ananya@student.in', phone:'9876543201', fees:'Paid',    status:'Active'   },
    { id:'STU002', name:'Vikram Singh',  course:'MBA',          year:'1st', email:'vikram@student.in', phone:'9876543202', fees:'Pending', status:'Active'   },
    { id:'STU003', name:'Meena Iyer',    course:'B.Sc Physics', year:'2nd', email:'meena@student.in',  phone:'9876543203', fees:'Paid',    status:'Active'   },
    { id:'STU004', name:'Rohit Gupta',   course:'B.Com',        year:'3rd', email:'rohit@student.in',  phone:'9876543204', fees:'Overdue', status:'Active'   },
    { id:'STU005', name:'Kavitha Nair',  course:'B.Tech CS',    year:'1st', email:'kavitha@student.in',phone:'9876543205', fees:'Paid',    status:'Active'   },
    { id:'STU006', name:'Arun Joshi',    course:'M.Sc Maths',   year:'2nd', email:'arun@student.in',   phone:'9876543206', fees:'Partial', status:'Inactive' },
];
const INIT_TEACHERS = [
    { id:'TCH001', name:'Dr. Kavitha Rao',   dept:'Electronics', designation:'Professor',    email:'kavitha.r@edu.in', phone:'9876500001', status:'Active'   },
    { id:'TCH002', name:'Prof. Suresh Babu', dept:'Mathematics', designation:'Assoc. Prof.', email:'suresh.b@edu.in',  phone:'9876500002', status:'Active'   },
    { id:'TCH003', name:'Ms. Deepa Menon',   dept:'Physics',     designation:'Asst. Prof.',  email:'deepa.m@edu.in',   phone:'9876500003', status:'Active'   },
    { id:'TCH004', name:'Dr. Aryan Shah',    dept:'CS',          designation:'HOD',          email:'aryan.s@edu.in',   phone:'9876500004', status:'Active'   },
    { id:'TCH005', name:'Mrs. Lakshmi Das',  dept:'Commerce',    designation:'Lecturer',     email:'lakshmi.d@edu.in', phone:'9876500005', status:'Inactive' },
];
const INIT_COURSES = [
    { id:'CRS001', name:'B.Tech Computer Science', code:'BTCS', dept:'CS',          seats:60, enrolled:54, duration:'4 years', fees:120000, status:'Active'   },
    { id:'CRS002', name:'MBA',                      code:'MBA',  dept:'Management',  seats:40, enrolled:38, duration:'2 years', fees:95000,  status:'Active'   },
    { id:'CRS003', name:'B.Sc Physics',             code:'BPHY', dept:'Physics',     seats:30, enrolled:22, duration:'3 years', fees:45000,  status:'Active'   },
    { id:'CRS004', name:'B.Com',                    code:'BCOM', dept:'Commerce',    seats:50, enrolled:48, duration:'3 years', fees:40000,  status:'Active'   },
    { id:'CRS005', name:'M.Sc Mathematics',         code:'MSMA', dept:'Mathematics', seats:20, enrolled:15, duration:'2 years', fees:55000,  status:'Inactive' },
];
const INIT_FEE_STRUCTS = [
    { id:'FS001', course:'B.Tech CS',        tuition:100000, lab:15000, library:3000, sports:2000, total:120000, year:'2026-27', status:'Active' },
    { id:'FS002', course:'MBA',              tuition:80000,  lab:5000,  library:4000, sports:3000, total:92000,  year:'2026-27', status:'Active' },
    { id:'FS003', course:'B.Sc Physics',     tuition:35000,  lab:7000,  library:2000, sports:1000, total:45000,  year:'2026-27', status:'Active' },
    { id:'FS004', course:'B.Com',            tuition:32000,  lab:3000,  library:3000, sports:2000, total:40000,  year:'2026-27', status:'Active' },
    { id:'FS005', course:'M.Sc Mathematics', tuition:48000,  lab:4000,  library:2000, sports:1000, total:55000,  year:'2026-27', status:'Active' },
];
const INIT_LOGS = [
    { id:1,  user:'Admin User',   action:'Deleted student record',  module:'Students',  time:'2026-06-06 09:45', ip:'192.168.1.10', severity:'high'   },
    { id:2,  user:'Priya Sharma', action:'Updated course seats',     module:'Courses',   time:'2026-06-06 09:30', ip:'192.168.1.15', severity:'medium' },
    { id:3,  user:'Ravi Kumar',   action:'Exported fees report',     module:'Fees',      time:'2026-06-06 09:10', ip:'192.168.1.22', severity:'low'    },
    { id:4,  user:'Admin User',   action:'Added new teacher',        module:'Teachers',  time:'2026-06-05 16:20', ip:'192.168.1.10', severity:'medium' },
    { id:5,  user:'Arjun Mehta',  action:'Updated transport route',  module:'Transport', time:'2026-06-05 15:00', ip:'192.168.1.30', severity:'low'    },
    { id:6,  user:'Priya Sharma', action:'Reset student password',   module:'Students',  time:'2026-06-05 14:30', ip:'192.168.1.15', severity:'high'   },
    { id:7,  user:'Admin User',   action:'Modified fee structure',   module:'Fees',      time:'2026-06-05 12:00', ip:'192.168.1.10', severity:'high'   },
    { id:8,  user:'Ravi Kumar',   action:'Viewed hostel records',    module:'Hostel',    time:'2026-06-05 11:20', ip:'192.168.1.22', severity:'low'    },
    { id:9,  user:'Admin User',   action:'System backup triggered',  module:'System',    time:'2026-06-05 08:00', ip:'192.168.1.10', severity:'medium' },
    { id:10, user:'Arjun Mehta',  action:'Added new inventory item', module:'Inventory', time:'2026-06-04 17:00', ip:'192.168.1.30', severity:'low'    },
];

const ROLES     = ['Super Admin','Admin','Editor','Viewer'];
const DEPTS     = ['Management','Academics','Finance','Library','Transport','HR','IT','Hostel'];
const COURSES   = ['B.Tech CS','MBA','B.Sc Physics','B.Com','M.Sc Mathematics','B.Tech EE','M.Tech CS'];
const YEARS     = ['1st','2nd','3rd','4th'];
const DEPT_LIST = ['CS','Mathematics','Physics','Electronics','Commerce','Management','English','Biology','Chemistry'];
const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;
const ADMIN_PASSWORD = 'Admin@123';

/* ─── Status chip maps ─── */
const STU_FEE_MAP = { Paid:{ bg:'#d1fae5',color:'#065f46' }, Pending:{ bg:'#fef3c7',color:'#92400e' }, Overdue:{ bg:'#fef2f2',color:'#991b1b' }, Partial:{ bg:'#dbeafe',color:'#1e3a8a' } };
const STATUS_MAP  = { Active:{ bg:'#dcfce7',color:'#15803d' }, Inactive:{ bg:'#f1f5f9',color:'#64748b' } };
const ROLE_MAP    = { 'Super Admin':{ bg:'#ede9fe',color:'#6d28d9' }, Admin:{ bg:'#dbeafe',color:'#1e40af' }, Editor:{ bg:'#fef3c7',color:'#b45309' }, Viewer:{ bg:'#f1f5f9',color:'#475569' } };
const SEV_MAP     = { high:{ bg:'#fef2f2',color:'#dc2626' }, medium:{ bg:'#fef3c7',color:'#d97706' }, low:{ bg:'#d1fae5',color:'#059669' } };

/* ─── Shared inline styles ─── */
const inp = { border:'1.5px solid var(--border)', borderRadius:8, padding:'9px 12px', fontSize:'0.85rem', color:'var(--text-primary)', background:'var(--bg)', fontFamily:'inherit', outline:'none', width:'100%', boxSizing:'border-box', transition:'border 0.15s' };
const sel = { ...inp, cursor:'pointer' };

/* ─── Chip ─── */
const Chip = ({ s, map }) => {
    const c = map[s] || { bg:'#f1f5f9', color:'#475569' };
    return <span style={{ background:c.bg, color:c.color, padding:'3px 10px', borderRadius:20, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.02em', whiteSpace:'nowrap' }}>{s}</span>;
};

/* ─── Avatar initials ─── */
const Avatar = ({ name, size=30, color='#1e40af' }) => {
    const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return (
        <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, color, display:'grid', placeItems:'center', fontSize:size*0.36+'px', fontWeight:700, flexShrink:0, border:`1.5px solid ${color}30` }}>
            {initials}
        </div>
    );
};

/* ─── Form field wrapper ─── */
const SF = ({ label, error, children, span }) => (
    <div style={{ gridColumn:span?'span 2':undefined }}>
        <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-secondary)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.04em' }}>{label}</div>
        {children}
        {error && <div style={{ fontSize:'0.7rem', color:'#dc2626', marginTop:3 }}>{error}</div>}
    </div>
);

/* ─── Modal ─── */
const Modal = ({ title, onClose, onSave, saveLabel='Save', children }) => (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'grid', placeItems:'center', padding:20, backdropFilter:'blur(4px)' }}
        onClick={onClose}>
        <div style={{ background:'var(--bg-card,white)', borderRadius:20, boxShadow:'0 32px 80px rgba(0,0,0,0.25)', width:'100%', maxWidth:700, maxHeight:'90vh', overflowY:'auto' }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 28px 18px', borderBottom:'1px solid var(--border)' }}>
                <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, color:'var(--text-primary)' }}>{title}</h3>
                <button onClick={onClose} style={{ border:'none', background:'var(--bg,#f1f5f9)', borderRadius:8, width:32, height:32, display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-muted)' }}><X size={15}/></button>
            </div>
            <div style={{ padding:'24px 28px' }}>{children}</div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'16px 28px', borderTop:'1px solid var(--border)', background:'var(--bg,#f8fafc)', borderRadius:'0 0 20px 20px' }}>
                <button onClick={onClose} style={{ padding:'9px 20px', borderRadius:10, border:'1.5px solid var(--border)', background:'transparent', cursor:'pointer', fontSize:'0.85rem', color:'var(--text-secondary)', fontWeight:500 }}>Cancel</button>
                <button onClick={onSave}  style={{ padding:'9px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#1e40af,#3b60d4)', color:'white', cursor:'pointer', fontSize:'0.85rem', fontWeight:700, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 10px rgba(30,64,175,0.35)' }}><Save size={13}/>{saveLabel}</button>
            </div>
        </div>
    </div>
);

/* ─── Confirm dialog ─── */
const Confirm = ({ msg, onYes, onNo }) => (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1100, display:'grid', placeItems:'center' }} onClick={onNo}>
        <div style={{ background:'var(--bg-card,white)', borderRadius:18, padding:'30px 32px', maxWidth:380, width:'100%', boxShadow:'0 16px 48px rgba(0,0,0,0.2)', textAlign:'center' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#fef2f2,#fee2e2)', display:'grid', placeItems:'center', margin:'0 auto 16px', boxShadow:'0 4px 14px rgba(220,38,38,0.2)' }}><AlertCircle size={24} color="#dc2626"/></div>
            <p style={{ fontWeight:800, color:'var(--text-primary)', marginBottom:6, fontSize:'1rem' }}>Confirm Delete</p>
            <p style={{ fontSize:'0.84rem', color:'var(--text-muted)', marginBottom:22, lineHeight:1.6 }}>{msg}</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                <button onClick={onNo}  style={{ padding:'9px 22px', borderRadius:10, border:'1.5px solid var(--border)', background:'transparent', cursor:'pointer', fontSize:'0.85rem', fontWeight:500 }}>Cancel</button>
                <button onClick={onYes} style={{ padding:'9px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#dc2626,#b91c1c)', color:'white', cursor:'pointer', fontSize:'0.85rem', fontWeight:700, boxShadow:'0 2px 10px rgba(220,38,38,0.3)' }}>Delete</button>
            </div>
        </div>
    </div>
);

/* ─── Password Gate ─── */
const PasswordGate = ({ pending, onClose }) => {
    const [pw, setPw] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [err, setErr] = useState('');
    const verify = () => {
        if (pw === ADMIN_PASSWORD) { onClose(); pending(); }
        else { setErr('Incorrect password. Please try again.'); setPw(''); }
    };
    return (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:1200, display:'grid', placeItems:'center', backdropFilter:'blur(6px)' }} onClick={onClose}>
            <div style={{ background:'white', borderRadius:20, padding:'36px 32px', maxWidth:400, width:'100%', boxShadow:'0 32px 80px rgba(0,0,0,0.3)', textAlign:'center' }} onClick={e=>e.stopPropagation()}>
                <div style={{ width:60, height:60, borderRadius:16, background:'linear-gradient(135deg,#7c3aed,#6d28d9)', display:'grid', placeItems:'center', margin:'0 auto 20px', boxShadow:'0 8px 24px rgba(124,58,237,0.4)' }}>
                    <Lock size={26} color="white"/>
                </div>
                <h3 style={{ margin:'0 0 6px', fontSize:'1.1rem', fontWeight:800, color:'#1e1b4b' }}>Admin Verification</h3>
                <p style={{ margin:'0 0 24px', fontSize:'0.83rem', color:'#64748b', lineHeight:1.6 }}>Enter the admin password to proceed with this protected action.</p>
                <div style={{ position:'relative', marginBottom:err?10:20 }}>
                    <input autoFocus type={showPw?'text':'password'} value={pw}
                        onChange={e=>{ setPw(e.target.value); setErr(''); }}
                        onKeyDown={e=>e.key==='Enter'&&verify()}
                        placeholder="Enter admin password"
                        style={{ width:'100%', padding:'12px 46px 12px 16px', borderRadius:12, border:`2px solid ${err?'#fca5a5':'#e2e8f0'}`, fontSize:'0.9rem', outline:'none', boxSizing:'border-box', fontFamily:'inherit', letterSpacing:showPw?'normal':'0.12em', transition:'border 0.15s', background:'#f8fafc' }}/>
                    <button onClick={()=>setShowPw(p=>!p)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', border:'none', background:'transparent', cursor:'pointer', color:'#94a3b8', display:'grid', placeItems:'center', padding:0 }}>
                        {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                    </button>
                </div>
                {err && (
                    <div style={{ display:'flex', alignItems:'center', gap:6, background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:10, padding:'9px 13px', marginBottom:14, textAlign:'left' }}>
                        <AlertCircle size={14} color="#dc2626"/>
                        <span style={{ fontSize:'0.78rem', color:'#dc2626', fontWeight:600 }}>{err}</span>
                    </div>
                )}
                <div style={{ background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:10, padding:'9px 14px', marginBottom:20, display:'flex', alignItems:'center', gap:6, justifyContent:'center' }}>
                    <Key size={12} color="#94a3b8"/>
                    <span style={{ fontSize:'0.73rem', color:'#64748b' }}>Default: <strong style={{ color:'#475569', fontFamily:'monospace' }}>Admin@123</strong></span>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                    <button onClick={onClose} style={{ flex:1, padding:'11px 0', borderRadius:11, border:'1.5px solid #e2e8f0', background:'transparent', cursor:'pointer', fontSize:'0.85rem', color:'#64748b', fontWeight:500 }}>Cancel</button>
                    <button onClick={verify}  style={{ flex:1, padding:'11px 0', borderRadius:11, border:'none', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'white', cursor:'pointer', fontSize:'0.85rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:'0 4px 14px rgba(124,58,237,0.4)' }}>
                        <Shield size={14}/> Verify & Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ─── Table helpers ─── */
const TblWrap = ({ children, empty }) => (
    <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>{children}</table>
        {empty && <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:10 }}>🗃️</div>
            <p style={{ margin:0, fontSize:'0.88rem', fontWeight:500 }}>No records found</p>
        </div>}
    </div>
);
const Th = ({ children, right }) => (
    <th style={{ padding:'11px 16px', textAlign:right?'right':'left', fontSize:'0.68rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.07em', color:'var(--text-muted)', borderBottom:'1px solid var(--border)', whiteSpace:'nowrap', background:'var(--bg,#f8fafc)' }}>{children}</th>
);
const Td = ({ children, style:s }) => (
    <td style={{ padding:'13px 16px', fontSize:'0.84rem', borderBottom:'1px solid var(--border)', verticalAlign:'middle', color:'var(--text-primary)', ...s }}>{children}</td>
);
const ActionBtn = ({ onClick, title, danger, children }) => (
    <button onClick={onClick} title={title}
        style={{ border:`1.5px solid ${danger?'#fca5a5':'var(--border)'}`, background:danger?'#fef2f2':'var(--bg,#f8fafc)', color:danger?'#dc2626':'var(--text-secondary)', borderRadius:8, padding:'5px 9px', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4, fontSize:'0.72rem', fontWeight:600, transition:'all 0.14s' }}>
        {children}
    </button>
);

/* ═══════════════════════════════ MAIN COMPONENT ═══════════════════════════════ */
export default function AdminPanel() {
    const [section, setSection] = useState('overview');
    const [q, setQ] = useState('');

    const [admins,   setAdmins]   = useState(INIT_ADMINS);
    const [students, setStudents] = useState(INIT_STUDENTS);
    const [teachers, setTeachers] = useState(INIT_TEACHERS);
    const [courses,  setCourses]  = useState(INIT_COURSES);
    const [fees,     setFees]     = useState(INIT_FEE_STRUCTS);
    const [logs]                  = useState(INIT_LOGS);

    const [modal,   setModal]   = useState(null);
    const [form,    setForm]    = useState({});
    const [ferr,    setFerr]    = useState({});
    const [confirm, setConfirm] = useState(null);
    const [pwGate,  setPwGate]  = useState(null);

    const requireAuth = fn => setPwGate({ pending: fn });
    const closePwGate = () => setPwGate(null);
    const openAdd     = type        => { setModal({ type, mode:'add' });  setForm(defaults(type)); setFerr({}); };
    const openEdit    = (type, row) => { setModal({ type, mode:'edit' }); setForm({...row});       setFerr({}); };
    const openView    = (type, row) => setModal({ type, mode:'view', data:row });
    const closeModal  = () => { setModal(null); setForm({}); setFerr({}); };
    const askDelete   = (msg, onYes) => setConfirm({ msg, onYes });
    const fld = k => e => setForm(p => ({ ...p, [k]: e.target.value }));
    const f = form;

    function defaults(type) {
        if (type==='admin')   return { name:'', email:'', role:'Viewer', dept:'Management', status:'Active' };
        if (type==='student') return { name:'', course:'B.Tech CS', year:'1st', email:'', phone:'', fees:'Pending', status:'Active' };
        if (type==='teacher') return { name:'', dept:'CS', designation:'Lecturer', email:'', phone:'', status:'Active' };
        if (type==='course')  return { name:'', code:'', dept:'CS', seats:'', enrolled:0, duration:'3 years', fees:'', status:'Active' };
        if (type==='fee')     return { course:'B.Tech CS', tuition:'', lab:'', library:'', sports:'', year:'2026-27', status:'Active' };
        return {};
    }

    function save() {
        if (!modal) return;
        const { type, mode } = modal;
        const e = {};
        if (!f.name?.trim() && type!=='fee')  e.name  = 'Required';
        if (!f.email?.trim() && (type==='admin'||type==='student'||type==='teacher')) e.email = 'Required';
        if (!f.code?.trim() && type==='course') e.code = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }

        const now = new Date().toISOString().split('T')[0];
        if (type==='admin') {
            const row = { ...f };
            if (mode==='add') { row.id=`ADM${String(admins.length+1).padStart(3,'0')}`; row.lastLogin='Never'; row.created=now; setAdmins(p=>[row,...p]); }
            else setAdmins(p=>p.map(r=>r.id===row.id?row:r));
        }
        if (type==='student') {
            const row = { ...f };
            if (mode==='add') { row.id=`STU${String(students.length+1).padStart(3,'0')}`; setStudents(p=>[row,...p]); }
            else setStudents(p=>p.map(r=>r.id===row.id?row:r));
        }
        if (type==='teacher') {
            const row = { ...f };
            if (mode==='add') { row.id=`TCH${String(teachers.length+1).padStart(3,'0')}`; setTeachers(p=>[row,...p]); }
            else setTeachers(p=>p.map(r=>r.id===row.id?row:r));
        }
        if (type==='course') {
            const row = { ...f, seats:Number(f.seats), fees:Number(f.fees), enrolled:Number(f.enrolled)||0 };
            if (mode==='add') { row.id=`CRS${String(courses.length+1).padStart(3,'0')}`; setCourses(p=>[row,...p]); }
            else setCourses(p=>p.map(r=>r.id===row.id?row:r));
        }
        if (type==='fee') {
            const row = { ...f, tuition:Number(f.tuition)||0, lab:Number(f.lab)||0, library:Number(f.library)||0, sports:Number(f.sports)||0 };
            row.total = row.tuition + row.lab + row.library + row.sports;
            if (mode==='add') { row.id=`FS${String(fees.length+1).padStart(3,'0')}`; setFees(p=>[row,...p]); }
            else setFees(p=>p.map(r=>r.id===row.id?row:r));
        }
        closeModal();
    }

    const filt = arr => arr.filter(r => !q || Object.values(r).some(v => String(v).toLowerCase().includes(q.toLowerCase())));

    const SECTIONS = [
        { key:'overview',  label:'Overview',      icon:BarChart2,     color:'#1e40af' },
        { key:'admins',    label:'Admin Users',    icon:UserCog,       color:'#7c3aed' },
        { key:'students',  label:'Students',       icon:GraduationCap, color:'#1e40af' },
        { key:'teachers',  label:'Teachers',       icon:Users,         color:'#059669' },
        { key:'courses',   label:'Courses',        icon:BookOpen,      color:'#d97706' },
        { key:'fees',      label:'Fee Structure',  icon:CreditCard,    color:'#0891b2' },
        { key:'logs',      label:'Activity Logs',  icon:Activity,      color:'#dc2626' },
        { key:'system',    label:'System',         icon:Database,      color:'#475569' },
    ];

    const viewFields = (type, d) => {
        if (!d) return [];
        if (type==='admin')   return [['ID',d.id],['Name',d.name],['Email',d.email],['Role',d.role],['Department',d.dept],['Status',d.status],['Last Login',d.lastLogin],['Created',d.created]];
        if (type==='student') return [['ID',d.id],['Name',d.name],['Course',d.course],['Year',d.year],['Email',d.email],['Phone',d.phone],['Fee Status',d.fees],['Status',d.status]];
        if (type==='teacher') return [['ID',d.id],['Name',d.name],['Department',d.dept],['Designation',d.designation],['Email',d.email],['Phone',d.phone],['Status',d.status]];
        if (type==='course')  return [['ID',d.id],['Name',d.name],['Code',d.code],['Department',d.dept],['Seats',d.seats],['Enrolled',d.enrolled],['Duration',d.duration],['Annual Fee',fmt(d.fees)],['Status',d.status]];
        if (type==='fee')     return [['ID',d.id],['Course',d.course],['Tuition',fmt(d.tuition)],['Lab Fee',fmt(d.lab)],['Library',fmt(d.library)],['Sports',fmt(d.sports)],['Total',fmt(d.total)],['Year',d.year],['Status',d.status]];
        return [];
    };

    /* ═══════════════ RENDER ═══════════════ */
    return (
        <div className="erp-page" style={{ background:'#f1f5f9', minHeight:'100vh' }}>
            <Navbar title="Admin Control Panel" subtitle="Full system data management — create, edit, delete, audit" />

            <div style={{ display:'flex', gap:22, alignItems:'flex-start' }}>

                {/* ── Sidebar ── */}
                <aside style={{
                    width:220, flexShrink:0, background:'#0f172a',
                    borderRadius:18, padding:'8px 8px 16px',
                    boxShadow:'0 8px 32px rgba(0,0,0,0.18)',
                    position:'sticky', top:20, overflow:'hidden',
                }}>
                    <div style={{ padding:'14px 12px 10px', marginBottom:4 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#1e40af,#7c3aed)', display:'grid', placeItems:'center' }}>
                                <Shield size={16} color="white"/>
                            </div>
                            <div>
                                <div style={{ fontSize:'0.75rem', fontWeight:800, color:'white', letterSpacing:'0.01em' }}>Admin Panel</div>
                                <div style={{ fontSize:'0.62rem', color:'#64748b', marginTop:1 }}>System Control</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ height:1, background:'rgba(255,255,255,0.07)', margin:'8px 4px 10px' }}/>

                    {SECTIONS.map(s => {
                        const active = section === s.key;
                        return (
                            <button key={s.key} onClick={() => { setSection(s.key); setQ(''); }}
                                style={{
                                    display:'flex', alignItems:'center', gap:10, width:'100%',
                                    padding:'9px 12px', borderRadius:10, border:'none',
                                    background: active ? `${s.color}22` : 'transparent',
                                    color: active ? s.color : '#94a3b8',
                                    fontSize:'0.82rem', fontWeight: active ? 700 : 500,
                                    cursor:'pointer', marginBottom:2, transition:'all 0.15s', textAlign:'left',
                                    position:'relative',
                                }}>
                                {active && <div style={{ position:'absolute', left:0, top:'20%', bottom:'20%', width:3, background:s.color, borderRadius:'0 3px 3px 0' }}/>}
                                <div style={{ width:26, height:26, borderRadius:7, background: active ? `${s.color}25` : 'rgba(255,255,255,0.05)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                    <s.icon size={13} color={active ? s.color : '#64748b'}/>
                                </div>
                                {s.label}
                            </button>
                        );
                    })}
                </aside>

                {/* ── Main Content ── */}
                <div style={{ flex:1, minWidth:0 }}>

                    {/* ══ OVERVIEW ══ */}
                    {section==='overview' && <OverviewSection
                        admins={admins} students={students} teachers={teachers} courses={courses} logs={logs}
                        setSection={setSection} requireAuth={requireAuth} openAdd={openAdd}
                    />}

                    {/* ══ ADMIN USERS ══ */}
                    {section==='admins' && (
                        <SectionTable title="Admin Users" icon={<UserCog size={16}/>} color="#7c3aed"
                            q={q} setQ={setQ} onAdd={()=>requireAuth(()=>openAdd('admin'))} addLabel="Add Admin"
                            rows={filt(admins)}
                            headers={['User','Role','Department','Status','Last Login','Actions']}
                            renderRow={row=>(
                                <tr key={row.id} style={{ transition:'background 0.12s' }}>
                                    <Td>
                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                            <Avatar name={row.name} color="#7c3aed" size={32}/>
                                            <div>
                                                <div style={{ fontWeight:700, fontSize:'0.86rem' }}>{row.name}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{row.email} · {row.id}</div>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td><Chip s={row.role} map={ROLE_MAP}/></Td>
                                    <Td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{row.dept}</Td>
                                    <Td><Chip s={row.status} map={STATUS_MAP}/></Td>
                                    <Td style={{ fontSize:'0.77rem', color:'var(--text-muted)' }}>{row.lastLogin}</Td>
                                    <Td>
                                        <div style={{ display:'flex', gap:5 }}>
                                            <ActionBtn onClick={()=>openView('admin',row)} title="View"><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('admin',row))} title="Edit"><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete admin "${row.name}"?`,()=>{ setAdmins(p=>p.filter(r=>r.id!==row.id)); setConfirm(null); }))} title="Delete"><Trash2 size={12}/></ActionBtn>
                                        </div>
                                    </Td>
                                </tr>
                            )}
                        />
                    )}

                    {/* ══ STUDENTS ══ */}
                    {section==='students' && (
                        <SectionTable title="Students" icon={<GraduationCap size={16}/>} color="#1e40af"
                            q={q} setQ={setQ} onAdd={()=>requireAuth(()=>openAdd('student'))} addLabel="Add Student"
                            rows={filt(students)}
                            headers={['Student','Course','Year','Phone','Fee Status','Status','Actions']}
                            renderRow={row=>(
                                <tr key={row.id}>
                                    <Td>
                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                            <Avatar name={row.name} color="#1e40af" size={32}/>
                                            <div>
                                                <div style={{ fontWeight:700, fontSize:'0.86rem' }}>{row.name}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{row.email} · {row.id}</div>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{row.course}</Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{row.year} Year</Td>
                                    <Td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{row.phone}</Td>
                                    <Td><Chip s={row.fees} map={STU_FEE_MAP}/></Td>
                                    <Td><Chip s={row.status} map={STATUS_MAP}/></Td>
                                    <Td>
                                        <div style={{ display:'flex', gap:5 }}>
                                            <ActionBtn onClick={()=>openView('student',row)} title="View"><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('student',row))} title="Edit"><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete student "${row.name}"?`,()=>{ setStudents(p=>p.filter(r=>r.id!==row.id)); setConfirm(null); }))} title="Delete"><Trash2 size={12}/></ActionBtn>
                                        </div>
                                    </Td>
                                </tr>
                            )}
                        />
                    )}

                    {/* ══ TEACHERS ══ */}
                    {section==='teachers' && (
                        <SectionTable title="Teachers" icon={<Users size={16}/>} color="#059669"
                            q={q} setQ={setQ} onAdd={()=>requireAuth(()=>openAdd('teacher'))} addLabel="Add Teacher"
                            rows={filt(teachers)}
                            headers={['Teacher','Department','Designation','Phone','Status','Actions']}
                            renderRow={row=>(
                                <tr key={row.id}>
                                    <Td>
                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                            <Avatar name={row.name} color="#059669" size={32}/>
                                            <div>
                                                <div style={{ fontWeight:700, fontSize:'0.86rem' }}>{row.name}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{row.email} · {row.id}</div>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{row.dept}</Td>
                                    <Td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{row.designation}</Td>
                                    <Td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{row.phone}</Td>
                                    <Td><Chip s={row.status} map={STATUS_MAP}/></Td>
                                    <Td>
                                        <div style={{ display:'flex', gap:5 }}>
                                            <ActionBtn onClick={()=>openView('teacher',row)} title="View"><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('teacher',row))} title="Edit"><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete teacher "${row.name}"?`,()=>{ setTeachers(p=>p.filter(r=>r.id!==row.id)); setConfirm(null); }))} title="Delete"><Trash2 size={12}/></ActionBtn>
                                        </div>
                                    </Td>
                                </tr>
                            )}
                        />
                    )}

                    {/* ══ COURSES ══ */}
                    {section==='courses' && (
                        <SectionTable title="Courses" icon={<BookOpen size={16}/>} color="#d97706"
                            q={q} setQ={setQ} onAdd={()=>requireAuth(()=>openAdd('course'))} addLabel="Add Course"
                            rows={filt(courses)}
                            headers={['Course','Code','Dept','Seats','Enrolled','Annual Fee','Status','Actions']}
                            renderRow={row=>(
                                <tr key={row.id}>
                                    <Td>
                                        <div style={{ fontWeight:700, fontSize:'0.86rem' }}>{row.name}</div>
                                        <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{row.id} · {row.duration}</div>
                                    </Td>
                                    <Td><span style={{ fontFamily:'monospace', fontSize:'0.82rem', fontWeight:800, color:'#d97706', background:'#fef3c7', padding:'2px 8px', borderRadius:6 }}>{row.code}</span></Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{row.dept}</Td>
                                    <Td style={{ fontSize:'0.85rem', fontWeight:700 }}>{row.seats}</Td>
                                    <Td>
                                        <div style={{ fontSize:'0.85rem', fontWeight:700 }}>{row.enrolled}</div>
                                        <div style={{ height:4, background:'#e2e8f0', borderRadius:99, marginTop:4, width:56, overflow:'hidden' }}>
                                            <div style={{ width:`${Math.min((row.enrolled/row.seats)*100,100)}%`, height:'100%', background:'linear-gradient(90deg,#1e40af,#3b60d4)', borderRadius:99 }}/>
                                        </div>
                                    </Td>
                                    <Td style={{ fontWeight:800, color:'#059669' }}>{fmt(row.fees)}</Td>
                                    <Td><Chip s={row.status} map={STATUS_MAP}/></Td>
                                    <Td>
                                        <div style={{ display:'flex', gap:5 }}>
                                            <ActionBtn onClick={()=>openView('course',row)} title="View"><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('course',row))} title="Edit"><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete course "${row.name}"?`,()=>{ setCourses(p=>p.filter(r=>r.id!==row.id)); setConfirm(null); }))} title="Delete"><Trash2 size={12}/></ActionBtn>
                                        </div>
                                    </Td>
                                </tr>
                            )}
                        />
                    )}

                    {/* ══ FEE STRUCTURE ══ */}
                    {section==='fees' && (
                        <SectionTable title="Fee Structure" icon={<CreditCard size={16}/>} color="#0891b2"
                            q={q} setQ={setQ} onAdd={()=>requireAuth(()=>openAdd('fee'))} addLabel="Add Fee Structure"
                            rows={filt(fees)}
                            headers={['Course','Tuition','Lab','Library','Sports','Total','Year','Actions']}
                            renderRow={row=>(
                                <tr key={row.id}>
                                    <Td style={{ fontWeight:700 }}>{row.course}</Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{fmt(row.tuition)}</Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{fmt(row.lab)}</Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{fmt(row.library)}</Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{fmt(row.sports)}</Td>
                                    <Td style={{ fontWeight:800, color:'#059669', fontSize:'0.88rem' }}>{fmt(row.total)}</Td>
                                    <Td><span style={{ background:'#dbeafe', color:'#1e40af', padding:'2px 8px', borderRadius:6, fontSize:'0.72rem', fontWeight:700 }}>{row.year}</span></Td>
                                    <Td>
                                        <div style={{ display:'flex', gap:5 }}>
                                            <ActionBtn onClick={()=>openView('fee',row)} title="View"><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('fee',row))} title="Edit"><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete fee structure for "${row.course}"?`,()=>{ setFees(p=>p.filter(r=>r.id!==row.id)); setConfirm(null); }))} title="Delete"><Trash2 size={12}/></ActionBtn>
                                        </div>
                                    </Td>
                                </tr>
                            )}
                        />
                    )}

                    {/* ══ ACTIVITY LOGS ══ */}
                    {section==='logs' && (
                        <div style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--border)', flexWrap:'wrap', gap:10 }}>
                                <div>
                                    <h2 style={{ margin:0, fontSize:'1rem', fontWeight:800, display:'flex', alignItems:'center', gap:8, color:'var(--text-primary)' }}>
                                        <div style={{ width:32, height:32, borderRadius:9, background:'#fef2f2', display:'grid', placeItems:'center' }}><Activity size={15} color="#dc2626"/></div>
                                        Activity Logs
                                        <span style={{ background:'#f1f5f9', color:'#475569', fontSize:'0.7rem', fontWeight:700, padding:'2px 9px', borderRadius:99 }}>{logs.length}</span>
                                    </h2>
                                    <p style={{ margin:'2px 0 0 40px', fontSize:'0.75rem', color:'var(--text-muted)' }}>All admin actions tracked and audited</p>
                                </div>
                                <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:7, border:'1.5px solid var(--border)', borderRadius:10, padding:'7px 14px', background:'var(--bg,#f8fafc)' }}>
                                        <Search size={13} color="#94a3b8"/>
                                        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search logs…" style={{ border:'none', outline:'none', fontSize:'0.83rem', background:'transparent', color:'var(--text-primary)', width:160 }}/>
                                    </div>
                                    <button style={{ padding:'8px 16px', borderRadius:10, border:'1.5px solid var(--border)', background:'transparent', cursor:'pointer', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:6, color:'var(--text-secondary)', fontWeight:500 }}><Download size={13}/>Export</button>
                                </div>
                            </div>
                            <TblWrap empty={filt(logs).length===0}>
                                <thead><tr><Th>User</Th><Th>Action</Th><Th>Module</Th><Th>IP Address</Th><Th>Time</Th><Th>Severity</Th></tr></thead>
                                <tbody>
                                    {filt(logs).map(l=>(
                                        <tr key={l.id}>
                                            <Td>
                                                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                    <Avatar name={l.user} color="#475569" size={28}/>
                                                    <span style={{ fontWeight:600, fontSize:'0.83rem' }}>{l.user}</span>
                                                </div>
                                            </Td>
                                            <Td style={{ fontSize:'0.83rem' }}>{l.action}</Td>
                                            <Td><span style={{ background:'#f1f5f9', color:'#475569', padding:'3px 10px', borderRadius:6, fontSize:'0.7rem', fontWeight:700 }}>{l.module}</span></Td>
                                            <Td style={{ fontFamily:'monospace', fontSize:'0.78rem', color:'var(--text-muted)' }}>{l.ip}</Td>
                                            <Td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{l.time}</Td>
                                            <Td><Chip s={l.severity} map={SEV_MAP}/></Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </TblWrap>
                        </div>
                    )}

                    {/* ══ SYSTEM ══ */}
                    {section==='system' && (
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                            {[
                                { title:'Database Backup', icon:Database, color:'#1e40af', desc:'Automated daily backups', items:[
                                    { label:'Last Backup', value:'2026-06-06 02:00 AM' },
                                    { label:'Backup Size', value:'142 MB' },
                                    { label:'Auto Backup', value:'Enabled (Daily)' },
                                ], actions:[{ label:'Backup Now', icon:Save, fn:()=>alert('Backup triggered!') },{ label:'Restore', icon:RefreshCw, fn:()=>alert('Select a backup file to restore.') }] },
                                { title:'Data Export', icon:Download, color:'#059669', desc:'Export records to CSV/Excel', items:[
                                    { label:'Students CSV', value:'Click Export' },
                                    { label:'Teachers CSV', value:'Click Export' },
                                    { label:'Courses CSV',  value:'Click Export' },
                                ], actions:[{ label:'Export All', icon:Download, fn:()=>alert('Exporting all data...') }] },
                                { title:'Data Import', icon:Upload, color:'#d97706', desc:'Bulk import from CSV/Excel', items:[
                                    { label:'Format',    value:'CSV / Excel (.xlsx)' },
                                    { label:'Max Size',  value:'10 MB' },
                                    { label:'Templates', value:'Available for download' },
                                ], actions:[{ label:'Import Data', icon:Upload, fn:()=>alert('Select a file to import.') }] },
                                { title:'Security', icon:Key, color:'#7c3aed', desc:'Access control & policies', items:[
                                    { label:'2FA Status',      value:'Enabled' },
                                    { label:'Session Timeout', value:'30 minutes' },
                                    { label:'Password Policy', value:'Min 8 chars, 1 symbol' },
                                ], actions:[{ label:'Security Audit', icon:Shield, fn:()=>alert('Running security audit...') }] },
                                { title:'System Info', icon:Cpu, color:'#0891b2', desc:'Runtime & version details', items:[
                                    { label:'Version',     value:'EduManage v2.0.0' },
                                    { label:'Node.js',     value:'20.x LTS' },
                                    { label:'React',       value:'18.x' },
                                    { label:'Last Deploy', value:'2026-06-01' },
                                ], actions:[] },
                                { title:'Notifications', icon:Bell, color:'#dc2626', desc:'Alerts & messaging setup', items:[
                                    { label:'Email Alerts', value:'Enabled' },
                                    { label:'SMS Gateway',  value:'Configured' },
                                    { label:'Push Notif.',  value:'Enabled' },
                                ], actions:[{ label:'Test Email', icon:FileText, fn:()=>alert('Test email sent!') }] },
                            ].map(card=>(
                                <div key={card.title} style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)', transition:'box-shadow 0.2s' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                                        <div style={{ width:38, height:38, borderRadius:11, background:`${card.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}>
                                            <card.icon size={17} color={card.color}/>
                                        </div>
                                        <div>
                                            <h3 style={{ margin:0, fontSize:'0.9rem', fontWeight:800, color:'var(--text-primary)' }}>{card.title}</h3>
                                            <p style={{ margin:0, fontSize:'0.72rem', color:'var(--text-muted)' }}>{card.desc}</p>
                                        </div>
                                    </div>
                                    <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--border)', marginBottom:card.actions.length?14:0 }}>
                                        {card.items.map((it, i)=>(
                                            <div key={it.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', background: i%2===0 ? 'var(--bg,#f8fafc)' : 'transparent', borderBottom: i<card.items.length-1 ? '1px solid var(--border)' : 'none' }}>
                                                <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{it.label}</span>
                                                <span style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-primary)' }}>{it.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {card.actions.length>0 && (
                                        <div style={{ display:'flex', gap:8 }}>
                                            {card.actions.map(a=>(
                                                <button key={a.label} onClick={a.fn}
                                                    style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, border:`1.5px solid ${card.color}30`, background:`${card.color}0d`, color:card.color, fontSize:'0.8rem', fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}>
                                                    <a.icon size={13}/>{a.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {/* ══ MODALS ══ */}
            {modal && modal.mode==='view' && (
                <Modal title="Record Details" onClose={closeModal} onSave={closeModal} saveLabel="Close">
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px 28px' }}>
                        {viewFields(modal.type, modal.data).map(([label, val])=>(
                            <div key={label} style={{ padding:'12px 14px', background:'var(--bg,#f8fafc)', borderRadius:10, border:'1px solid var(--border)' }}>
                                <div style={{ fontSize:'0.66rem', fontWeight:800, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:5 }}>{label}</div>
                                <div style={{ fontSize:'0.88rem', fontWeight:700, color:'var(--text-primary)' }}>{val}</div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}

            {modal && modal.mode!=='view' && (
                <Modal title={`${modal.mode==='add'?'Add':'Edit'} ${modal.type.charAt(0).toUpperCase()+modal.type.slice(1)}`} onClose={closeModal} onSave={save} saveLabel={modal.mode==='add'?'Save':'Save Changes'}>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>

                        {modal.type==='admin' && <>
                            <SF label="Full Name *" error={ferr.name}><input style={inp} value={f.name||''} onChange={fld('name')} placeholder="e.g. Priya Sharma"/></SF>
                            <SF label="Email *" error={ferr.email}><input style={inp} type="email" value={f.email||''} onChange={fld('email')} placeholder="user@edumanage.in"/></SF>
                            <SF label="Role"><select style={sel} value={f.role||'Viewer'} onChange={fld('role')}>{ROLES.map(r=><option key={r}>{r}</option>)}</select></SF>
                            <SF label="Department"><select style={sel} value={f.dept||'Management'} onChange={fld('dept')}>{DEPTS.map(d=><option key={d}>{d}</option>)}</select></SF>
                            <SF label="Status"><select style={sel} value={f.status||'Active'} onChange={fld('status')}><option>Active</option><option>Inactive</option></select></SF>
                        </>}

                        {modal.type==='student' && <>
                            <SF label="Full Name *" error={ferr.name}><input style={inp} value={f.name||''} onChange={fld('name')} placeholder="e.g. Ananya Reddy"/></SF>
                            <SF label="Email *" error={ferr.email}><input style={inp} type="email" value={f.email||''} onChange={fld('email')} placeholder="student@student.in"/></SF>
                            <SF label="Course"><select style={sel} value={f.course||'B.Tech CS'} onChange={fld('course')}>{COURSES.map(c=><option key={c}>{c}</option>)}</select></SF>
                            <SF label="Year"><select style={sel} value={f.year||'1st'} onChange={fld('year')}>{YEARS.map(y=><option key={y}>{y}</option>)}</select></SF>
                            <SF label="Phone"><input style={inp} value={f.phone||''} onChange={fld('phone')} placeholder="9876543210"/></SF>
                            <SF label="Fee Status"><select style={sel} value={f.fees||'Pending'} onChange={fld('fees')}><option>Paid</option><option>Pending</option><option>Partial</option><option>Overdue</option></select></SF>
                            <SF label="Status"><select style={sel} value={f.status||'Active'} onChange={fld('status')}><option>Active</option><option>Inactive</option></select></SF>
                        </>}

                        {modal.type==='teacher' && <>
                            <SF label="Full Name *" error={ferr.name}><input style={inp} value={f.name||''} onChange={fld('name')} placeholder="e.g. Dr. Kavitha Rao"/></SF>
                            <SF label="Email *" error={ferr.email}><input style={inp} type="email" value={f.email||''} onChange={fld('email')} placeholder="name@edu.in"/></SF>
                            <SF label="Department"><select style={sel} value={f.dept||'CS'} onChange={fld('dept')}>{DEPT_LIST.map(d=><option key={d}>{d}</option>)}</select></SF>
                            <SF label="Designation"><select style={sel} value={f.designation||'Lecturer'} onChange={fld('designation')}>{['Lecturer','Asst. Prof.','Assoc. Prof.','Professor','HOD'].map(d=><option key={d}>{d}</option>)}</select></SF>
                            <SF label="Phone"><input style={inp} value={f.phone||''} onChange={fld('phone')} placeholder="9876500001"/></SF>
                            <SF label="Status"><select style={sel} value={f.status||'Active'} onChange={fld('status')}><option>Active</option><option>Inactive</option></select></SF>
                        </>}

                        {modal.type==='course' && <>
                            <SF label="Course Name *" error={ferr.name}><input style={inp} value={f.name||''} onChange={fld('name')} placeholder="e.g. B.Tech Computer Science"/></SF>
                            <SF label="Code *" error={ferr.code}><input style={inp} value={f.code||''} onChange={fld('code')} placeholder="e.g. BTCS"/></SF>
                            <SF label="Department"><select style={sel} value={f.dept||'CS'} onChange={fld('dept')}>{DEPT_LIST.map(d=><option key={d}>{d}</option>)}</select></SF>
                            <SF label="Duration"><select style={sel} value={f.duration||'3 years'} onChange={fld('duration')}>{['1 year','2 years','3 years','4 years','5 years'].map(d=><option key={d}>{d}</option>)}</select></SF>
                            <SF label="Total Seats"><input style={inp} type="number" min="1" value={f.seats||''} onChange={fld('seats')} placeholder="60"/></SF>
                            <SF label="Annual Fee (₹)"><input style={inp} type="number" min="0" value={f.fees||''} onChange={fld('fees')} placeholder="120000"/></SF>
                            <SF label="Status"><select style={sel} value={f.status||'Active'} onChange={fld('status')}><option>Active</option><option>Inactive</option></select></SF>
                        </>}

                        {modal.type==='fee' && <>
                            <SF label="Course"><select style={sel} value={f.course||'B.Tech CS'} onChange={fld('course')}>{COURSES.map(c=><option key={c}>{c}</option>)}</select></SF>
                            <SF label="Academic Year"><input style={inp} value={f.year||'2026-27'} onChange={fld('year')} placeholder="2026-27"/></SF>
                            <SF label="Tuition Fee (₹)"><input style={inp} type="number" min="0" value={f.tuition||''} onChange={fld('tuition')} placeholder="0"/></SF>
                            <SF label="Lab Fee (₹)"><input style={inp} type="number" min="0" value={f.lab||''} onChange={fld('lab')} placeholder="0"/></SF>
                            <SF label="Library Fee (₹)"><input style={inp} type="number" min="0" value={f.library||''} onChange={fld('library')} placeholder="0"/></SF>
                            <SF label="Sports Fee (₹)"><input style={inp} type="number" min="0" value={f.sports||''} onChange={fld('sports')} placeholder="0"/></SF>
                            <SF label="Status"><select style={sel} value={f.status||'Active'} onChange={fld('status')}><option>Active</option><option>Inactive</option></select></SF>
                        </>}

                    </div>
                </Modal>
            )}

            {confirm && <Confirm msg={confirm.msg} onYes={confirm.onYes} onNo={()=>setConfirm(null)}/>}
            {pwGate  && <PasswordGate pending={pwGate.pending} onClose={closePwGate}/>}
        </div>
    );
}

/* ─────────────────────────────── OVERVIEW SECTION ─────────────────────────────── */
function OverviewSection({ admins, students, teachers, courses, logs, setSection, requireAuth, openAdd }) {
    const stats = [
        { label:'Admin Users',   value:admins.filter(a=>a.status==='Active').length,   total:admins.length,   icon:UserCog,       color:'#7c3aed', gradient:'linear-gradient(135deg,#7c3aed,#9333ea)', bg:'#ede9fe', key:'admins'   },
        { label:'Total Students',value:students.length,                                 total:students.length, icon:GraduationCap, color:'#1e40af', gradient:'linear-gradient(135deg,#1e40af,#3b82f6)', bg:'#dbeafe', key:'students' },
        { label:'Total Teachers',value:teachers.filter(t=>t.status==='Active').length, total:teachers.length, icon:Users,         color:'#059669', gradient:'linear-gradient(135deg,#059669,#10b981)', bg:'#dcfce7', key:'teachers' },
        { label:'Active Courses',value:courses.filter(c=>c.status==='Active').length,  total:courses.length,  icon:BookOpen,      color:'#d97706', gradient:'linear-gradient(135deg,#d97706,#f59e0b)', bg:'#fef3c7', key:'courses'  },
    ];

    const healthMetrics = [
        { label:'CPU Usage',  value:34, color:'#10b981', trackColor:'#d1fae5' },
        { label:'Memory',     value:62, color:'#f59e0b', trackColor:'#fef3c7' },
        { label:'Disk Space', value:48, color:'#3b82f6', trackColor:'#dbeafe' },
        { label:'DB Load',    value:21, color:'#10b981', trackColor:'#d1fae5' },
    ];

    const SEV_MAP = { high:{ bg:'#fef2f2',color:'#dc2626' }, medium:{ bg:'#fef3c7',color:'#d97706' }, low:{ bg:'#dcfce7',color:'#059669' } };

    const quickActions = [
        { label:'Add Admin User', action:()=>requireAuth(()=>{ setSection('admins');   openAdd('admin');   }), color:'#7c3aed', icon:UserCog,       lock:true  },
        { label:'Add Student',    action:()=>requireAuth(()=>{ setSection('students'); openAdd('student'); }), color:'#1e40af', icon:GraduationCap, lock:true  },
        { label:'Add Teacher',    action:()=>requireAuth(()=>{ setSection('teachers'); openAdd('teacher'); }), color:'#059669', icon:Users,         lock:true  },
        { label:'Add Course',     action:()=>requireAuth(()=>{ setSection('courses');  openAdd('course');  }), color:'#d97706', icon:BookOpen,      lock:true  },
        { label:'View Logs',      action:()=>setSection('logs'),                                               color:'#dc2626', icon:Activity,      lock:false },
        { label:'System Tools',   action:()=>setSection('system'),                                             color:'#0891b2', icon:Database,      lock:false },
    ];

    return (
        <>
            {/* Stat Cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 }}>
                {stats.map(s=>(
                    <div key={s.label} onClick={()=>setSection(s.key)}
                        style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 20px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', cursor:'pointer', transition:'all 0.2s', overflow:'hidden', position:'relative' }}>
                        <div style={{ position:'absolute', top:-12, right:-12, width:80, height:80, borderRadius:'50%', background:`${s.color}08` }}/>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                            <div style={{ width:42, height:42, borderRadius:12, background:s.gradient, display:'grid', placeItems:'center', boxShadow:`0 4px 14px ${s.color}40` }}>
                                <s.icon size={19} color="white"/>
                            </div>
                            <span style={{ fontSize:'0.68rem', fontWeight:700, color:s.color, background:s.bg, padding:'3px 8px', borderRadius:20 }}>Active</span>
                        </div>
                        <div style={{ fontSize:'2rem', fontWeight:900, color:'var(--text-primary)', lineHeight:1, marginBottom:4 }}>{s.value}</div>
                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', fontWeight:500 }}>{s.label}</div>
                        <div style={{ height:3, background:'var(--border)', borderRadius:99, marginTop:12, overflow:'hidden' }}>
                            <div style={{ width:`${(s.value/s.total)*100}%`, height:'100%', background:s.gradient, borderRadius:99 }}/>
                        </div>
                    </div>
                ))}
            </div>

            {/* System Health + Recent Activity */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:16, marginBottom:20 }}>

                {/* System Health */}
                <div style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:32, height:32, borderRadius:9, background:'#dbeafe', display:'grid', placeItems:'center' }}><Cpu size={15} color="#1e40af"/></div>
                            <div>
                                <h3 style={{ margin:0, fontSize:'0.88rem', fontWeight:800, color:'var(--text-primary)' }}>System Health</h3>
                                <p style={{ margin:0, fontSize:'0.7rem', color:'var(--text-muted)' }}>Live resource monitoring</p>
                            </div>
                        </div>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:'#10b981', display:'block', boxShadow:'0 0 0 3px #d1fae5' }}/>
                    </div>
                    {healthMetrics.map(m=>(
                        <div key={m.label} style={{ marginBottom:16 }}>
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                                <span style={{ fontSize:'0.8rem', color:'var(--text-secondary)', fontWeight:500 }}>{m.label}</span>
                                <span style={{ fontSize:'0.82rem', fontWeight:800, color:m.color }}>{m.value}%</span>
                            </div>
                            <div style={{ height:7, background:m.trackColor, borderRadius:99, overflow:'hidden' }}>
                                <div style={{ width:`${m.value}%`, height:'100%', background:m.color, borderRadius:99, transition:'width 0.6s ease' }}/>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recent Activity — timeline style */}
                <div style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:32, height:32, borderRadius:9, background:'#fef2f2', display:'grid', placeItems:'center' }}><Activity size={15} color="#dc2626"/></div>
                            <div>
                                <h3 style={{ margin:0, fontSize:'0.88rem', fontWeight:800, color:'var(--text-primary)' }}>Recent Activity</h3>
                                <p style={{ margin:0, fontSize:'0.7rem', color:'var(--text-muted)' }}>Latest admin actions</p>
                            </div>
                        </div>
                        <button onClick={()=>{}} style={{ fontSize:'0.72rem', color:'#1e40af', fontWeight:700, background:'#dbeafe', border:'none', borderRadius:20, padding:'3px 10px', cursor:'pointer' }}>View All</button>
                    </div>
                    <div style={{ position:'relative' }}>
                        <div style={{ position:'absolute', left:11, top:0, bottom:0, width:1.5, background:'var(--border)', borderRadius:99 }}/>
                        {logs.slice(0,6).map((l, i)=>(
                            <div key={l.id} style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom: i<5 ? 14 : 0, position:'relative' }}>
                                <div style={{ width:24, height:24, borderRadius:'50%', background:SEV_MAP[l.severity]?.bg||'#f1f5f9', border:`2px solid ${SEV_MAP[l.severity]?.color||'#94a3b8'}`, display:'grid', placeItems:'center', flexShrink:0, zIndex:1 }}>
                                    <div style={{ width:6, height:6, borderRadius:'50%', background:SEV_MAP[l.severity]?.color||'#94a3b8' }}/>
                                </div>
                                <div style={{ flex:1, minWidth:0, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                                    <div style={{ minWidth:0 }}>
                                        <div style={{ fontSize:'0.81rem', fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.action}</div>
                                        <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:1 }}>{l.user} · {l.time.split(' ')[1]}</div>
                                    </div>
                                    <span style={{ background:SEV_MAP[l.severity]?.bg, color:SEV_MAP[l.severity]?.color, padding:'2px 8px', borderRadius:20, fontSize:'0.63rem', fontWeight:800, whiteSpace:'nowrap', textTransform:'capitalize', flexShrink:0 }}>{l.severity}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ marginBottom:16 }}>
                    <h3 style={{ margin:'0 0 3px', fontSize:'0.9rem', fontWeight:800, color:'var(--text-primary)' }}>Quick Actions</h3>
                    <p style={{ margin:0, fontSize:'0.74rem', color:'var(--text-muted)' }}>Common administrative tasks</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                    {quickActions.map(a=>(
                        <button key={a.label} onClick={a.action}
                            style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', borderRadius:12, border:`1.5px solid ${a.color}20`, background:`${a.color}08`, color:'var(--text-primary)', cursor:'pointer', transition:'all 0.15s', textAlign:'left' }}>
                            <div style={{ width:34, height:34, borderRadius:9, background:a.color, display:'grid', placeItems:'center', flexShrink:0 }}>
                                <a.icon size={15} color="white"/>
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--text-primary)' }}>{a.label}</div>
                                {a.lock && <div style={{ fontSize:'0.67rem', color:'var(--text-muted)', display:'flex', alignItems:'center', gap:3, marginTop:1 }}><Lock size={9}/>Auth required</div>}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}

/* ─────────────────────────────── SECTION TABLE ─────────────────────────────── */
function SectionTable({ title, icon, color, q, setQ, onAdd, addLabel, rows, headers, renderRow }) {
    return (
        <div style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--border)', flexWrap:'wrap', gap:10 }}>
                <div>
                    <h2 style={{ margin:0, fontSize:'1rem', fontWeight:800, display:'flex', alignItems:'center', gap:9, color:'var(--text-primary)' }}>
                        <div style={{ width:32, height:32, borderRadius:9, background:`${color}18`, display:'grid', placeItems:'center' }}>
                            <span style={{ color }}>{icon}</span>
                        </div>
                        {title}
                        <span style={{ background:'#f1f5f9', color:'#64748b', fontSize:'0.7rem', fontWeight:700, padding:'3px 9px', borderRadius:99, marginLeft:2 }}>{rows.length}</span>
                    </h2>
                </div>
                <div style={{ display:'flex', gap:9, alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, border:'1.5px solid var(--border)', borderRadius:10, padding:'7px 14px', background:'var(--bg,#f8fafc)' }}>
                        <Search size={13} color="#94a3b8"/>
                        <input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} style={{ border:'none', outline:'none', fontSize:'0.83rem', background:'transparent', color:'var(--text-primary)', width:155 }}/>
                    </div>
                    <button onClick={onAdd}
                        style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${color},${color}dd)`, color:'white', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', boxShadow:`0 2px 10px ${color}50` }}>
                        <Plus size={14}/>{addLabel}
                    </button>
                </div>
            </div>
            <TblWrap empty={rows.length===0}>
                <thead><tr>{headers.map(h=><Th key={h} right={h==='Actions'}>{h}</Th>)}</tr></thead>
                <tbody>{rows.map(renderRow)}</tbody>
            </TblWrap>
        </div>
    );
}
