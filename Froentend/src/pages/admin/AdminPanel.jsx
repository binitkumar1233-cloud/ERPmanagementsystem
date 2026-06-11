import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import { api } from '../../services/api.js';
import {
    Shield, Users, GraduationCap, BookOpen, CreditCard,
    Search, Plus, Edit2, Trash2, Eye, EyeOff, X, Download, Upload,
    Activity, Database, Key, CheckCircle, AlertCircle,
    UserCog, RefreshCw, Lock, FileText, BarChart2,
    Save, Cpu, Bell, Settings,
} from 'lucide-react';

/* ─────────────────────────────── NORMALIZERS ─────────────────────────────── */
const fmtDate = d => d ? new Date(d).toLocaleString('en-IN', { dateStyle:'short', timeStyle:'short' }) : 'Never';
const normUser = d => ({ id:d._id, shortId:d._id.slice(-6).toUpperCase(), name:d.name, email:d.email, role:d.role, dept:d.dept||'Management', status:d.status, lastLogin:fmtDate(d.lastLogin), created:d.createdAt?.slice(0,10)||'' });
const normStu  = d => ({ id:d._id, shortId:d.studentId||`S${d._id.slice(-5)}`, name:d.name, email:d.email||'', phone:d.phone||'', course:d.course, year:d.year, fees:d.fees, status:d.status });
const normTch  = d => ({ id:d._id, shortId:d.teacherId||`T${d._id.slice(-5)}`, name:d.name, email:d.email||'', phone:d.phone||'', dept:d.dept, designation:d.designation, status:d.status });
const normCrs  = d => ({ id:d._id, shortId:d.courseId||`C${d._id.slice(-5)}`, name:d.name, code:d.code, dept:d.dept, seats:d.seats, enrolled:d.enrolled||0, duration:d.duration||'3 years', fees:d.fees, status:d.status });
const normFee  = d => ({ id:d._id, course:d.course, tuition:d.tuition||0, lab:d.lab||0, library:d.library||0, sports:d.sports||0, total:d.total||0, year:d.year, status:d.status });
const normLog  = d => ({ id:d._id, user:d.userName||'System', action:d.action, module:d.module, time:fmtDate(d.createdAt), ip:d.ip||'—', severity:d.severity||'low' });

/* ─────────────────────────────── CONSTANTS ─────────────────────────────── */
const ROLES     = ['Super Admin','Admin','Editor','Viewer'];
const DEPTS     = ['Management','Academics','Finance','Library','Transport','HR','IT','Hostel'];
const COURSES   = ['B.Tech CS','MBA','B.Sc Physics','B.Com','M.Sc Mathematics','B.Tech EE','M.Tech CS'];
const YEARS     = ['1st','2nd','3rd','4th'];
const DEPT_LIST = ['CS','Mathematics','Physics','Electronics','Commerce','Management','English','Biology','Chemistry'];
const fmt = n => `₹${Number(n).toLocaleString('en-IN')}`;
const ADMIN_PASSWORD = 'Admin@123';

const STU_FEE_MAP = { Paid:{ bg:'#d1fae5',color:'#065f46' }, Pending:{ bg:'#fef3c7',color:'#92400e' }, Overdue:{ bg:'#fef2f2',color:'#991b1b' }, Partial:{ bg:'#dbeafe',color:'#1e3a8a' } };
const STATUS_MAP  = { Active:{ bg:'#dcfce7',color:'#15803d' }, Inactive:{ bg:'#f1f5f9',color:'#64748b' } };
const ROLE_MAP    = { 'Super Admin':{ bg:'#ede9fe',color:'#6d28d9' }, Admin:{ bg:'#dbeafe',color:'#1e40af' }, Editor:{ bg:'#fef3c7',color:'#b45309' }, Viewer:{ bg:'#f1f5f9',color:'#475569' } };
const SEV_MAP     = { high:{ bg:'#fef2f2',color:'#dc2626' }, medium:{ bg:'#fef3c7',color:'#d97706' }, low:{ bg:'#d1fae5',color:'#059669' } };

const inp = { border:'1.5px solid var(--border)', borderRadius:8, padding:'9px 12px', fontSize:'0.85rem', color:'var(--text-primary)', background:'var(--bg)', fontFamily:'inherit', outline:'none', width:'100%', boxSizing:'border-box', transition:'border 0.15s' };
const sel = { ...inp, cursor:'pointer' };

/* ─────────────────────────────── SHARED UI ─────────────────────────────── */
const Chip = ({ s, map }) => {
    const c = map[s] || { bg:'#f1f5f9', color:'#475569' };
    return <span style={{ background:c.bg, color:c.color, padding:'3px 10px', borderRadius:20, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.02em', whiteSpace:'nowrap' }}>{s}</span>;
};

const Avatar = ({ name, size=30, color='#1e40af' }) => {
    const initials = (name||'?').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    return (
        <div style={{ width:size, height:size, borderRadius:'50%', background:`${color}18`, color, display:'grid', placeItems:'center', fontSize:size*0.36+'px', fontWeight:700, flexShrink:0, border:`1.5px solid ${color}30` }}>
            {initials}
        </div>
    );
};

const SF = ({ label, error, children, span }) => (
    <div style={{ gridColumn:span?'span 2':undefined }}>
        <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-secondary)', marginBottom:5, textTransform:'uppercase', letterSpacing:'0.04em' }}>{label}</div>
        {children}
        {error && <div style={{ fontSize:'0.7rem', color:'#dc2626', marginTop:3 }}>{error}</div>}
    </div>
);

const Modal = ({ title, onClose, onSave, saveLabel='Save', children }) => (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1000, display:'grid', placeItems:'center', padding:20, backdropFilter:'blur(4px)' }} onClick={onClose}>
        <div style={{ background:'var(--bg-card,white)', borderRadius:20, boxShadow:'0 32px 80px rgba(0,0,0,0.25)', width:'100%', maxWidth:700, maxHeight:'90vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 28px 18px', borderBottom:'1px solid var(--border)' }}>
                <h3 style={{ margin:0, fontSize:'1.05rem', fontWeight:800, color:'var(--text-primary)' }}>{title}</h3>
                <button onClick={onClose} style={{ border:'none', background:'var(--bg,#f1f5f9)', borderRadius:8, width:32, height:32, display:'grid', placeItems:'center', cursor:'pointer', color:'var(--text-muted)' }}><X size={15}/></button>
            </div>
            <div style={{ padding:'24px 28px' }}>{children}</div>
            <div style={{ display:'flex', justifyContent:'flex-end', gap:10, padding:'16px 28px', borderTop:'1px solid var(--border)', background:'var(--bg,#f8fafc)', borderRadius:'0 0 20px 20px' }}>
                <button onClick={onClose} style={{ padding:'9px 20px', borderRadius:10, border:'1.5px solid var(--border)', background:'transparent', cursor:'pointer', fontSize:'0.85rem', color:'var(--text-secondary)', fontWeight:500 }}>Cancel</button>
                <button onClick={onSave} style={{ padding:'9px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#1e40af,#3b60d4)', color:'white', cursor:'pointer', fontSize:'0.85rem', fontWeight:700, display:'flex', alignItems:'center', gap:6, boxShadow:'0 2px 10px rgba(30,64,175,0.35)' }}><Save size={13}/>{saveLabel}</button>
            </div>
        </div>
    </div>
);

const Confirm = ({ msg, onYes, onNo }) => (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1100, display:'grid', placeItems:'center' }} onClick={onNo}>
        <div style={{ background:'var(--bg-card,white)', borderRadius:18, padding:'30px 32px', maxWidth:380, width:'100%', boxShadow:'0 16px 48px rgba(0,0,0,0.2)', textAlign:'center' }} onClick={e=>e.stopPropagation()}>
            <div style={{ width:52, height:52, borderRadius:14, background:'linear-gradient(135deg,#fef2f2,#fee2e2)', display:'grid', placeItems:'center', margin:'0 auto 16px', boxShadow:'0 4px 14px rgba(220,38,38,0.2)' }}><AlertCircle size={24} color="#dc2626"/></div>
            <p style={{ fontWeight:800, color:'var(--text-primary)', marginBottom:6, fontSize:'1rem' }}>Confirm Delete</p>
            <p style={{ fontSize:'0.84rem', color:'var(--text-muted)', marginBottom:22, lineHeight:1.6 }}>{msg}</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
                <button onClick={onNo} style={{ padding:'9px 22px', borderRadius:10, border:'1.5px solid var(--border)', background:'transparent', cursor:'pointer', fontSize:'0.85rem', fontWeight:500 }}>Cancel</button>
                <button onClick={onYes} style={{ padding:'9px 22px', borderRadius:10, border:'none', background:'linear-gradient(135deg,#dc2626,#b91c1c)', color:'white', cursor:'pointer', fontSize:'0.85rem', fontWeight:700, boxShadow:'0 2px 10px rgba(220,38,38,0.3)' }}>Delete</button>
            </div>
        </div>
    </div>
);

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
                    <button onClick={verify} style={{ flex:1, padding:'11px 0', borderRadius:11, border:'none', background:'linear-gradient(135deg,#7c3aed,#6d28d9)', color:'white', cursor:'pointer', fontSize:'0.85rem', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:'0 4px 14px rgba(124,58,237,0.4)' }}>
                        <Shield size={14}/> Verify & Proceed
                    </button>
                </div>
            </div>
        </div>
    );
};

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

    const [admins,   setAdmins]   = useState([]);
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [courses,  setCourses]  = useState([]);
    const [fees,     setFees]     = useState([]);
    const [logs,     setLogs]     = useState([]);

    const [modal,   setModal]   = useState(null);
    const [form,    setForm]    = useState({});
    const [ferr,    setFerr]    = useState({});
    const [saveErr, setSaveErr] = useState('');
    const [confirm, setConfirm] = useState(null);
    const [pwGate,  setPwGate]  = useState(null);

    /* ── Fetch helpers ── */
    const fetchAdmins   = () => api.get('/admin/users').then(r => setAdmins((r.data||[]).map(normUser))).catch(()=>{});
    const fetchStudents = () => api.get('/students').then(r => setStudents((r.data||[]).map(normStu))).catch(()=>{});
    const fetchTeachers = () => api.get('/teachers').then(r => setTeachers((r.data||[]).map(normTch))).catch(()=>{});
    const fetchCourses  = () => api.get('/courses').then(r => setCourses((r.data||[]).map(normCrs))).catch(()=>{});
    const fetchFees     = () => api.get('/fees/structures').then(r => setFees((r.data||[]).map(normFee))).catch(()=>{});
    const fetchLogs     = () => api.get('/admin/logs').then(r => setLogs((r.data||[]).map(normLog))).catch(()=>{});

    useEffect(() => {
        fetchAdmins(); fetchStudents(); fetchTeachers(); fetchCourses(); fetchFees(); fetchLogs();
    }, []); // eslint-disable-line

    const requireAuth = fn => setPwGate({ pending: fn });
    const closePwGate = () => setPwGate(null);
    const openAdd     = type        => { setModal({ type, mode:'add' });  setForm(defaults(type)); setFerr({}); setSaveErr(''); };
    const openEdit    = (type, row) => { setModal({ type, mode:'edit' }); setForm({...row});       setFerr({}); setSaveErr(''); };
    const openView    = (type, row) => setModal({ type, mode:'view', data:row });
    const closeModal  = () => { setModal(null); setForm({}); setFerr({}); setSaveErr(''); };
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

    async function save() {
        if (!modal) return;
        const { type, mode } = modal;
        const e = {};
        if (!f.name?.trim() && type!=='fee')  e.name  = 'Required';
        if (!f.email?.trim() && (type==='admin'||type==='student'||type==='teacher')) e.email = 'Required';
        if (!f.code?.trim() && type==='course') e.code = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        setSaveErr('');
        try {
            if (type === 'admin') {
                const p = { name:f.name, email:f.email, role:f.role, dept:f.dept, status:f.status };
                if (mode==='add') { p.password = 'Admin@123'; await api.post('/admin/users', p); }
                else await api.put('/admin/users/'+f.id, p);
                await fetchAdmins();
            } else if (type === 'student') {
                const p = { name:f.name, email:f.email, course:f.course, year:f.year, phone:f.phone, fees:f.fees, status:f.status };
                if (mode==='add') await api.post('/students', p);
                else await api.put('/students/'+f.id, p);
                await fetchStudents();
            } else if (type === 'teacher') {
                const p = { name:f.name, email:f.email, dept:f.dept, designation:f.designation, phone:f.phone, status:f.status };
                if (mode==='add') await api.post('/teachers', p);
                else await api.put('/teachers/'+f.id, p);
                await fetchTeachers();
            } else if (type === 'course') {
                const p = { name:f.name, code:f.code, dept:f.dept, seats:Number(f.seats), fees:Number(f.fees), duration:f.duration, status:f.status };
                if (mode==='add') await api.post('/courses', p);
                else await api.put('/courses/'+f.id, p);
                await fetchCourses();
            } else if (type === 'fee') {
                const p = { course:f.course, tuition:Number(f.tuition)||0, lab:Number(f.lab)||0, library:Number(f.library)||0, sports:Number(f.sports)||0, year:f.year, status:f.status };
                if (mode==='add') await api.post('/fees/structures', p);
                else await api.put('/fees/structures/'+f.id, p);
                await fetchFees();
            }
            closeModal();
        } catch (err) {
            setSaveErr(err.message || 'Save failed. Please try again.');
        }
    }

    async function doDelete(type, id, localRemove) {
        const ep = { admin:'/admin/users', student:'/students', teacher:'/teachers', course:'/courses', fee:'/fees/structures' };
        try {
            await api.delete(ep[type]+'/'+id);
            localRemove();
        } catch (err) {
            alert('Delete failed: '+(err.message||'Unknown error'));
        }
        setConfirm(null);
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
        if (type==='admin')   return [['ID',d.shortId],['Name',d.name],['Email',d.email],['Role',d.role],['Department',d.dept],['Status',d.status],['Last Login',d.lastLogin],['Created',d.created]];
        if (type==='student') return [['ID',d.shortId],['Name',d.name],['Course',d.course],['Year',d.year],['Email',d.email],['Phone',d.phone],['Fee Status',d.fees],['Status',d.status]];
        if (type==='teacher') return [['ID',d.shortId],['Name',d.name],['Department',d.dept],['Designation',d.designation],['Email',d.email],['Phone',d.phone],['Status',d.status]];
        if (type==='course')  return [['ID',d.shortId],['Name',d.name],['Code',d.code],['Department',d.dept],['Seats',d.seats],['Enrolled',d.enrolled],['Duration',d.duration],['Annual Fee',fmt(d.fees)],['Status',d.status]];
        if (type==='fee')     return [['Course',d.course],['Tuition',fmt(d.tuition)],['Lab Fee',fmt(d.lab)],['Library',fmt(d.library)],['Sports',fmt(d.sports)],['Total',fmt(d.total)],['Year',d.year],['Status',d.status]];
        return [];
    };

    return (
        <div className="erp-page" style={{ background:'#f1f5f9', minHeight:'100vh' }}>
            <style>{`
                .ap-layout { display:flex; gap:22px; align-items:flex-start; }
                .ap-sidebar { display:flex !important; flex-direction:column; }
                .ap-mobile-tabs { display:none; }
                @media (max-width: 767px) {
                    .ap-layout { flex-direction:column; gap:12px; }
                    .ap-sidebar { display:none !important; }
                    .ap-mobile-tabs {
                        display:flex; overflow-x:auto; gap:6px;
                        padding:4px 2px 10px; scrollbar-width:none;
                        -ms-overflow-style:none; flex-shrink:0; width:100%;
                    }
                    .ap-mobile-tabs::-webkit-scrollbar { display:none; }
                    .ap-mobile-tab {
                        display:flex; align-items:center; gap:5px;
                        padding:7px 13px; border-radius:10px;
                        border:1.5px solid var(--border); font-size:0.75rem;
                        font-weight:600; cursor:pointer; white-space:nowrap;
                        flex-shrink:0; transition:all 0.15s;
                        background:#fff; color:#64748b;
                        font-family:var(--font-body);
                    }
                    /* Section header: stack on mobile */
                    .ap-sec-hdr { flex-direction:column !important; align-items:flex-start !important; gap:10px !important; }
                    .ap-sec-hdr-right { flex-wrap:wrap; width:100%; }
                    /* Modal form: single column on mobile */
                    .ap-modal-form { grid-template-columns:1fr !important; }
                }
            `}</style>

            <Navbar title="Admin Control Panel" subtitle="Full system data management — create, edit, delete, audit" />

            {/* ── Mobile tab bar (hidden on desktop) ── */}
            <div className="ap-mobile-tabs">
                {SECTIONS.map(s => {
                    const active = section === s.key;
                    return (
                        <button key={s.key} className="ap-mobile-tab"
                            onClick={() => { setSection(s.key); setQ(''); }}
                            style={{ background:active?`${s.color}15`:'#fff', color:active?s.color:'#64748b', borderColor:active?`${s.color}50`:'var(--border)' }}>
                            <s.icon size={12}/>
                            {s.label}
                        </button>
                    );
                })}
            </div>

            <div className="ap-layout">

                {/* ── Sidebar ── */}
                <aside className="ap-sidebar" style={{ width:220, flexShrink:0, background:'#0f172a', borderRadius:18, padding:'8px 8px 16px', boxShadow:'0 8px 32px rgba(0,0,0,0.18)', position:'sticky', top:20, overflow:'hidden' }}>
                    <div style={{ padding:'14px 12px 10px', marginBottom:4 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#1e40af,#7c3aed)', display:'grid', placeItems:'center' }}><Shield size={16} color="white"/></div>
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
                                style={{ display:'flex', alignItems:'center', gap:10, width:'100%', padding:'9px 12px', borderRadius:10, border:'none', background:active?`${s.color}22`:'transparent', color:active?s.color:'#94a3b8', fontSize:'0.82rem', fontWeight:active?700:500, cursor:'pointer', marginBottom:2, transition:'all 0.15s', textAlign:'left', position:'relative' }}>
                                {active && <div style={{ position:'absolute', left:0, top:'20%', bottom:'20%', width:3, background:s.color, borderRadius:'0 3px 3px 0' }}/>}
                                <div style={{ width:26, height:26, borderRadius:7, background:active?`${s.color}25`:'rgba(255,255,255,0.05)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                    <s.icon size={13} color={active?s.color:'#64748b'}/>
                                </div>
                                {s.label}
                            </button>
                        );
                    })}
                </aside>

                {/* ── Main Content ── */}
                <div style={{ flex:1, minWidth:0 }}>

                    {section==='overview' && <OverviewSection admins={admins} students={students} teachers={teachers} courses={courses} logs={logs} setSection={setSection} requireAuth={requireAuth} openAdd={openAdd}/>}

                    {/* ══ ADMIN USERS ══ */}
                    {section==='admins' && (
                        <SectionTable title="Admin Users" icon={<UserCog size={16}/>} color="#7c3aed"
                            q={q} setQ={setQ} onAdd={()=>requireAuth(()=>openAdd('admin'))} addLabel="Add Admin"
                            rows={filt(admins)} headers={['User','Role','Department','Status','Last Login','Actions']}
                            renderRow={row=>(
                                <tr key={row.id}>
                                    <Td>
                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                            <Avatar name={row.name} color="#7c3aed" size={32}/>
                                            <div>
                                                <div style={{ fontWeight:700, fontSize:'0.86rem' }}>{row.name}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{row.email} · {row.shortId}</div>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td><Chip s={row.role} map={ROLE_MAP}/></Td>
                                    <Td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{row.dept}</Td>
                                    <Td><Chip s={row.status} map={STATUS_MAP}/></Td>
                                    <Td style={{ fontSize:'0.77rem', color:'var(--text-muted)' }}>{row.lastLogin}</Td>
                                    <Td>
                                        <div style={{ display:'flex', gap:5 }}>
                                            <ActionBtn onClick={()=>openView('admin',row)}><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('admin',row))}><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete admin "${row.name}"?`,()=>doDelete('admin',row.id,()=>setAdmins(p=>p.filter(r=>r.id!==row.id)))))}><Trash2 size={12}/></ActionBtn>
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
                            rows={filt(students)} headers={['Student','Course','Year','Phone','Fee Status','Status','Actions']}
                            renderRow={row=>(
                                <tr key={row.id}>
                                    <Td>
                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                            <Avatar name={row.name} color="#1e40af" size={32}/>
                                            <div>
                                                <div style={{ fontWeight:700, fontSize:'0.86rem' }}>{row.name}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{row.email} · {row.shortId}</div>
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
                                            <ActionBtn onClick={()=>openView('student',row)}><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('student',row))}><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete student "${row.name}"?`,()=>doDelete('student',row.id,()=>setStudents(p=>p.filter(r=>r.id!==row.id)))))}><Trash2 size={12}/></ActionBtn>
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
                            rows={filt(teachers)} headers={['Teacher','Department','Designation','Phone','Status','Actions']}
                            renderRow={row=>(
                                <tr key={row.id}>
                                    <Td>
                                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                            <Avatar name={row.name} color="#059669" size={32}/>
                                            <div>
                                                <div style={{ fontWeight:700, fontSize:'0.86rem' }}>{row.name}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{row.email} · {row.shortId}</div>
                                            </div>
                                        </div>
                                    </Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{row.dept}</Td>
                                    <Td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{row.designation}</Td>
                                    <Td style={{ fontSize:'0.82rem', color:'var(--text-secondary)' }}>{row.phone}</Td>
                                    <Td><Chip s={row.status} map={STATUS_MAP}/></Td>
                                    <Td>
                                        <div style={{ display:'flex', gap:5 }}>
                                            <ActionBtn onClick={()=>openView('teacher',row)}><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('teacher',row))}><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete teacher "${row.name}"?`,()=>doDelete('teacher',row.id,()=>setTeachers(p=>p.filter(r=>r.id!==row.id)))))}><Trash2 size={12}/></ActionBtn>
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
                            rows={filt(courses)} headers={['Course','Code','Dept','Seats','Enrolled','Annual Fee','Status','Actions']}
                            renderRow={row=>(
                                <tr key={row.id}>
                                    <Td>
                                        <div style={{ fontWeight:700, fontSize:'0.86rem' }}>{row.name}</div>
                                        <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{row.shortId} · {row.duration}</div>
                                    </Td>
                                    <Td><span style={{ fontFamily:'monospace', fontSize:'0.82rem', fontWeight:800, color:'#d97706', background:'#fef3c7', padding:'2px 8px', borderRadius:6 }}>{row.code}</span></Td>
                                    <Td style={{ fontSize:'0.82rem' }}>{row.dept}</Td>
                                    <Td style={{ fontSize:'0.85rem', fontWeight:700 }}>{row.seats}</Td>
                                    <Td>
                                        <div style={{ fontSize:'0.85rem', fontWeight:700 }}>{row.enrolled}</div>
                                        <div style={{ height:4, background:'#e2e8f0', borderRadius:99, marginTop:4, width:56, overflow:'hidden' }}>
                                            <div style={{ width:`${Math.min((row.enrolled/Math.max(row.seats,1))*100,100)}%`, height:'100%', background:'linear-gradient(90deg,#1e40af,#3b60d4)', borderRadius:99 }}/>
                                        </div>
                                    </Td>
                                    <Td style={{ fontWeight:800, color:'#059669' }}>{fmt(row.fees)}</Td>
                                    <Td><Chip s={row.status} map={STATUS_MAP}/></Td>
                                    <Td>
                                        <div style={{ display:'flex', gap:5 }}>
                                            <ActionBtn onClick={()=>openView('course',row)}><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('course',row))}><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete course "${row.name}"?`,()=>doDelete('course',row.id,()=>setCourses(p=>p.filter(r=>r.id!==row.id)))))}><Trash2 size={12}/></ActionBtn>
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
                            rows={filt(fees)} headers={['Course','Tuition','Lab','Library','Sports','Total','Year','Actions']}
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
                                            <ActionBtn onClick={()=>openView('fee',row)}><Eye size={12}/> View</ActionBtn>
                                            <ActionBtn onClick={()=>requireAuth(()=>openEdit('fee',row))}><Edit2 size={12}/> Edit</ActionBtn>
                                            <ActionBtn danger onClick={()=>requireAuth(()=>askDelete(`Delete fee structure for "${row.course}"?`,()=>doDelete('fee',row.id,()=>setFees(p=>p.filter(r=>r.id!==row.id)))))}><Trash2 size={12}/></ActionBtn>
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
                                    <button onClick={fetchLogs} style={{ padding:'8px 16px', borderRadius:10, border:'1.5px solid var(--border)', background:'transparent', cursor:'pointer', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:6, color:'var(--text-secondary)', fontWeight:500 }}><Download size={13}/>Refresh</button>
                                </div>
                            </div>
                            <TblWrap empty={filt(logs).length===0}>
                                <thead><tr><Th>User</Th><Th>Action</Th><Th>Module</Th><Th>IP Address</Th><Th>Time</Th><Th>Severity</Th></tr></thead>
                                <tbody>
                                    {filt(logs).map(l=>(
                                        <tr key={l.id}>
                                            <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><Avatar name={l.user} color="#475569" size={28}/><span style={{ fontWeight:600, fontSize:'0.83rem' }}>{l.user}</span></div></Td>
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
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
                            {[
                                { title:'Database Backup', icon:Database, color:'#1e40af', desc:'Automated daily backups', items:[{ label:'Last Backup', value:'2026-06-06 02:00 AM' },{ label:'Backup Size', value:'142 MB' },{ label:'Auto Backup', value:'Enabled (Daily)' }], actions:[{ label:'Backup Now', icon:Save, fn:()=>alert('Backup triggered!') },{ label:'Restore', icon:RefreshCw, fn:()=>alert('Select a backup file to restore.') }] },
                                { title:'Data Export', icon:Download, color:'#059669', desc:'Export records to CSV/Excel', items:[{ label:'Students CSV', value:'Click Export' },{ label:'Teachers CSV', value:'Click Export' },{ label:'Courses CSV', value:'Click Export' }], actions:[{ label:'Export All', icon:Download, fn:()=>alert('Exporting all data...') }] },
                                { title:'Data Import', icon:Upload, color:'#d97706', desc:'Bulk import from CSV/Excel', items:[{ label:'Format', value:'CSV / Excel (.xlsx)' },{ label:'Max Size', value:'10 MB' },{ label:'Templates', value:'Available for download' }], actions:[{ label:'Import Data', icon:Upload, fn:()=>alert('Select a file to import.') }] },
                                { title:'Security', icon:Key, color:'#7c3aed', desc:'Access control & policies', items:[{ label:'2FA Status', value:'Enabled' },{ label:'Session Timeout', value:'30 minutes' },{ label:'Password Policy', value:'Min 8 chars, 1 symbol' }], actions:[{ label:'Security Audit', icon:Shield, fn:()=>alert('Running security audit...') }] },
                                { title:'System Info', icon:Cpu, color:'#0891b2', desc:'Runtime & version details', items:[{ label:'Version', value:'EduManage v2.0.0' },{ label:'Node.js', value:'20.x LTS' },{ label:'React', value:'18.x' },{ label:'Last Deploy', value:'2026-06-01' }], actions:[] },
                                { title:'Notifications', icon:Bell, color:'#dc2626', desc:'Alerts & messaging setup', items:[{ label:'Email Alerts', value:'Enabled' },{ label:'SMS Gateway', value:'Configured' },{ label:'Push Notif.', value:'Enabled' }], actions:[{ label:'Test Email', icon:FileText, fn:()=>alert('Test email sent!') }] },
                            ].map(card=>(
                                <div key={card.title} style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                                        <div style={{ width:38, height:38, borderRadius:11, background:`${card.color}15`, display:'grid', placeItems:'center', flexShrink:0 }}><card.icon size={17} color={card.color}/></div>
                                        <div><h3 style={{ margin:0, fontSize:'0.9rem', fontWeight:800, color:'var(--text-primary)' }}>{card.title}</h3><p style={{ margin:0, fontSize:'0.72rem', color:'var(--text-muted)' }}>{card.desc}</p></div>
                                    </div>
                                    <div style={{ borderRadius:10, overflow:'hidden', border:'1px solid var(--border)', marginBottom:card.actions.length?14:0 }}>
                                        {card.items.map((it,i)=>(
                                            <div key={it.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'9px 14px', background:i%2===0?'var(--bg,#f8fafc)':'transparent', borderBottom:i<card.items.length-1?'1px solid var(--border)':'none' }}>
                                                <span style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{it.label}</span>
                                                <span style={{ fontSize:'0.78rem', fontWeight:700, color:'var(--text-primary)' }}>{it.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {card.actions.length>0 && (
                                        <div style={{ display:'flex', gap:8 }}>
                                            {card.actions.map(a=>(
                                                <button key={a.label} onClick={a.fn} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, border:`1.5px solid ${card.color}30`, background:`${card.color}0d`, color:card.color, fontSize:'0.8rem', fontWeight:700, cursor:'pointer' }}>
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
                    <div className="ap-modal-form" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
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
                    {saveErr && (
                        <div style={{ marginTop:12, display:'flex', alignItems:'center', gap:8, background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:10, padding:'10px 14px' }}>
                            <AlertCircle size={14} color="#dc2626"/>
                            <span style={{ fontSize:'0.8rem', color:'#dc2626', fontWeight:600 }}>{saveErr}</span>
                        </div>
                    )}
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
        { label:'Admin Users',    value:admins.filter(a=>a.status==='Active').length,   total:Math.max(admins.length,1),    icon:UserCog,       color:'#7c3aed', gradient:'linear-gradient(135deg,#7c3aed,#9333ea)', bg:'#ede9fe', key:'admins'   },
        { label:'Total Students', value:students.length,                                 total:Math.max(students.length,1),  icon:GraduationCap, color:'#1e40af', gradient:'linear-gradient(135deg,#1e40af,#3b82f6)', bg:'#dbeafe', key:'students' },
        { label:'Total Teachers', value:teachers.filter(t=>t.status==='Active').length, total:Math.max(teachers.length,1),  icon:Users,         color:'#059669', gradient:'linear-gradient(135deg,#059669,#10b981)', bg:'#dcfce7', key:'teachers' },
        { label:'Active Courses', value:courses.filter(c=>c.status==='Active').length,  total:Math.max(courses.length,1),   icon:BookOpen,      color:'#d97706', gradient:'linear-gradient(135deg,#d97706,#f59e0b)', bg:'#fef3c7', key:'courses'  },
    ];
    const healthMetrics = [
        { label:'CPU Usage',  value:34, color:'#10b981', trackColor:'#d1fae5' },
        { label:'Memory',     value:62, color:'#f59e0b', trackColor:'#fef3c7' },
        { label:'Disk Space', value:48, color:'#3b82f6', trackColor:'#dbeafe' },
        { label:'DB Load',    value:21, color:'#10b981', trackColor:'#d1fae5' },
    ];
    const SEV = { high:{ bg:'#fef2f2',color:'#dc2626' }, medium:{ bg:'#fef3c7',color:'#d97706' }, low:{ bg:'#dcfce7',color:'#059669' } };
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
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:16, marginBottom:20 }}>
                {stats.map(s=>(
                    <div key={s.label} onClick={()=>setSection(s.key)}
                        style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 20px 16px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)', cursor:'pointer', transition:'all 0.2s', overflow:'hidden', position:'relative' }}>
                        <div style={{ position:'absolute', top:-12, right:-12, width:80, height:80, borderRadius:'50%', background:`${s.color}08` }}/>
                        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:14 }}>
                            <div style={{ width:42, height:42, borderRadius:12, background:s.gradient, display:'grid', placeItems:'center', boxShadow:`0 4px 14px ${s.color}40` }}><s.icon size={19} color="white"/></div>
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

            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:20 }}>
                <div style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:32, height:32, borderRadius:9, background:'#dbeafe', display:'grid', placeItems:'center' }}><Cpu size={15} color="#1e40af"/></div>
                            <div><h3 style={{ margin:0, fontSize:'0.88rem', fontWeight:800, color:'var(--text-primary)' }}>System Health</h3><p style={{ margin:0, fontSize:'0.7rem', color:'var(--text-muted)' }}>Live resource monitoring</p></div>
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
                                <div style={{ width:`${m.value}%`, height:'100%', background:m.color, borderRadius:99 }}/>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                            <div style={{ width:32, height:32, borderRadius:9, background:'#fef2f2', display:'grid', placeItems:'center' }}><Activity size={15} color="#dc2626"/></div>
                            <div><h3 style={{ margin:0, fontSize:'0.88rem', fontWeight:800, color:'var(--text-primary)' }}>Recent Activity</h3><p style={{ margin:0, fontSize:'0.7rem', color:'var(--text-muted)' }}>Latest admin actions</p></div>
                        </div>
                        <button onClick={()=>setSection('logs')} style={{ fontSize:'0.72rem', color:'#1e40af', fontWeight:700, background:'#dbeafe', border:'none', borderRadius:20, padding:'3px 10px', cursor:'pointer' }}>View All</button>
                    </div>
                    <div style={{ position:'relative' }}>
                        <div style={{ position:'absolute', left:11, top:0, bottom:0, width:1.5, background:'var(--border)', borderRadius:99 }}/>
                        {logs.slice(0,6).map((l,i)=>(
                            <div key={l.id} style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:i<5?14:0, position:'relative' }}>
                                <div style={{ width:24, height:24, borderRadius:'50%', background:SEV[l.severity]?.bg||'#f1f5f9', border:`2px solid ${SEV[l.severity]?.color||'#94a3b8'}`, display:'grid', placeItems:'center', flexShrink:0, zIndex:1 }}>
                                    <div style={{ width:6, height:6, borderRadius:'50%', background:SEV[l.severity]?.color||'#94a3b8' }}/>
                                </div>
                                <div style={{ flex:1, minWidth:0, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:8 }}>
                                    <div style={{ minWidth:0 }}>
                                        <div style={{ fontSize:'0.81rem', fontWeight:700, color:'var(--text-primary)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.action}</div>
                                        <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:1 }}>{l.user} · {l.time}</div>
                                    </div>
                                    <span style={{ background:SEV[l.severity]?.bg, color:SEV[l.severity]?.color, padding:'2px 8px', borderRadius:20, fontSize:'0.63rem', fontWeight:800, whiteSpace:'nowrap', textTransform:'capitalize', flexShrink:0 }}>{l.severity}</span>
                                </div>
                            </div>
                        ))}
                        {logs.length === 0 && <p style={{ margin:0, fontSize:'0.82rem', color:'var(--text-muted)', paddingLeft:38 }}>No activity logs yet.</p>}
                    </div>
                </div>
            </div>

            <div style={{ background:'var(--bg-card,white)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 22px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ marginBottom:16 }}>
                    <h3 style={{ margin:'0 0 3px', fontSize:'0.9rem', fontWeight:800, color:'var(--text-primary)' }}>Quick Actions</h3>
                    <p style={{ margin:0, fontSize:'0.74rem', color:'var(--text-muted)' }}>Common administrative tasks</p>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
                    {quickActions.map(a=>(
                        <button key={a.label} onClick={a.action}
                            style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', borderRadius:12, border:`1.5px solid ${a.color}20`, background:`${a.color}08`, color:'var(--text-primary)', cursor:'pointer', transition:'all 0.15s', textAlign:'left' }}>
                            <div style={{ width:34, height:34, borderRadius:9, background:a.color, display:'grid', placeItems:'center', flexShrink:0 }}><a.icon size={15} color="white"/></div>
                            <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontSize:'0.82rem', fontWeight:700 }}>{a.label}</div>
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
                        <div style={{ width:32, height:32, borderRadius:9, background:`${color}18`, display:'grid', placeItems:'center' }}><span style={{ color }}>{icon}</span></div>
                        {title}
                        <span style={{ background:'#f1f5f9', color:'#64748b', fontSize:'0.7rem', fontWeight:700, padding:'3px 9px', borderRadius:99, marginLeft:2 }}>{rows.length}</span>
                    </h2>
                </div>
                <div style={{ display:'flex', gap:9, alignItems:'center' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:7, border:'1.5px solid var(--border)', borderRadius:10, padding:'7px 14px', background:'var(--bg,#f8fafc)' }}>
                        <Search size={13} color="#94a3b8"/>
                        <input value={q} onChange={e=>setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} style={{ border:'none', outline:'none', fontSize:'0.83rem', background:'transparent', color:'var(--text-primary)', width:'clamp(80px,20vw,155px)' }}/>
                    </div>
                    <button onClick={onAdd} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:10, border:'none', background:`linear-gradient(135deg,${color},${color}dd)`, color:'white', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', boxShadow:`0 2px 10px ${color}50` }}>
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
