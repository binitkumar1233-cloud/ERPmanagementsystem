import { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import {
    Home, Users, UtensilsCrossed, CreditCard,
    Bed, Search, Plus, Download, Eye, Edit2, Trash2,
    CheckCircle2, AlertCircle, Calendar, Leaf, Coffee,
    Sun, Moon, Cookie, X, ShieldCheck, Lock, UserCircle,
    KeyRound,
} from 'lucide-react';

/* ── Credentials ── */
const WARDEN_CREDENTIALS = {
    'WRD001': { password: 'wrd001', name: 'Mr. Sunil Kapoor', block: 'Block A & B', role: 'Chief Warden' },
    'WRD002': { password: 'wrd002', name: 'Mrs. Rekha Nair',  block: 'Block A',     role: 'Block A Warden' },
    'WRD003': { password: 'wrd003', name: 'Mr. Arun Pillai',  block: 'Block B',     role: 'Block B Warden' },
};

const STUDENT_CREDENTIALS = {
    'CS2024001': { password: 'stu001', name: 'Priya Sharma',  course: 'B.Sc CSE'   },
    'CS2024002': { password: 'stu002', name: 'Rohan Das',     course: 'B.Sc CSE'   },
    'CS2024003': { password: 'stu003', name: 'Ananya Patel',  course: 'B.Sc CSE'   },
    'EC2024001': { password: 'stu004', name: 'Suresh Kumar',  course: 'B.Tech ECE' },
    'CO2024001': { password: 'stu005', name: 'Meena Nayak',   course: 'B.Com Hons' },
    'MA2024001': { password: 'stu006', name: 'Deepa Singh',   course: 'M.Sc Maths' },
    'CS2024004': { password: 'stu007', name: 'Divya Pillai',  course: 'B.Sc CSE'   },
    'MA2024002': { password: 'stu008', name: 'Pooja Iyer',    course: 'M.Sc Maths' },
};

/* ── Empty forms ── */
const EMPTY_ROOM  = { roomNo:'', block:'A', floor:1, type:'Double', amenities:[] };
const EMPTY_ALLOC = { student:'', rollNo:'', roomId:'', joinDate:'', checkoutDate:'', messOpt:'Veg' };
const EMPTY_MENU  = { day:'Monday', breakfast:'', lunch:'', snacks:'', dinner:'', veg:true };
const EMPTY_FEE   = { student:'', rollNo:'', room:'', period:'', amount:'', paid:'' };

const ALL_AMENITIES = ['AC', 'WiFi', 'Attached Bath', 'Common Bath', 'Study Table', 'Wardrobe'];

/* ── Mock Data ── */
const INIT_ROOMS = [
    { id: 'RM001', roomNo: '101', floor: 1, block: 'A', type: 'Double',  capacity: 2, occupied: 2, amenities: ['AC', 'WiFi', 'Attached Bath'] },
    { id: 'RM002', roomNo: '102', floor: 1, block: 'A', type: 'Single',  capacity: 1, occupied: 1, amenities: ['WiFi', 'Attached Bath']        },
    { id: 'RM003', roomNo: '103', floor: 1, block: 'A', type: 'Triple',  capacity: 3, occupied: 2, amenities: ['WiFi', 'Common Bath']           },
    { id: 'RM004', roomNo: '201', floor: 2, block: 'A', type: 'Double',  capacity: 2, occupied: 0, amenities: ['AC', 'WiFi', 'Attached Bath']   },
    { id: 'RM005', roomNo: '202', floor: 2, block: 'A', type: 'Double',  capacity: 2, occupied: 2, amenities: ['WiFi', 'Common Bath']           },
    { id: 'RM006', roomNo: '203', floor: 2, block: 'A', type: 'Single',  capacity: 1, occupied: 0, amenities: ['AC', 'WiFi', 'Attached Bath']   },
    { id: 'RM007', roomNo: '101', floor: 1, block: 'B', type: 'Triple',  capacity: 3, occupied: 3, amenities: ['WiFi', 'Common Bath']           },
    { id: 'RM008', roomNo: '102', floor: 1, block: 'B', type: 'Double',  capacity: 2, occupied: 1, amenities: ['WiFi', 'Attached Bath']         },
    { id: 'RM009', roomNo: '103', floor: 1, block: 'B', type: 'Single',  capacity: 1, occupied: 0, amenities: ['AC', 'WiFi', 'Attached Bath']   },
    { id: 'RM010', roomNo: '201', floor: 2, block: 'B', type: 'Triple',  capacity: 3, occupied: 2, amenities: ['WiFi', 'Common Bath']           },
    { id: 'RM011', roomNo: '202', floor: 2, block: 'B', type: 'Double',  capacity: 2, occupied: 2, amenities: ['AC', 'WiFi', 'Attached Bath']   },
    { id: 'RM012', roomNo: '203', floor: 2, block: 'B', type: 'Single',  capacity: 1, occupied: 1, amenities: ['WiFi', 'Attached Bath']         },
];

const INIT_ALLOCATIONS = [
    { id: 'AL001', student: 'Priya Sharma',  rollNo: 'CS2024001', room: '101', block: 'A', floor: 1, joinDate: '2026-06-01', checkoutDate: '2027-05-31', messOpt: 'Veg',     status: 'Active'      },
    { id: 'AL002', student: 'Rohan Das',     rollNo: 'CS2024002', room: '101', block: 'A', floor: 1, joinDate: '2026-06-01', checkoutDate: '2027-05-31', messOpt: 'Non-Veg', status: 'Active'      },
    { id: 'AL003', student: 'Ananya Patel',  rollNo: 'CS2024003', room: '102', block: 'A', floor: 1, joinDate: '2026-06-15', checkoutDate: '2027-05-31', messOpt: 'Veg',     status: 'Active'      },
    { id: 'AL004', student: 'Suresh Kumar',  rollNo: 'EC2024001', room: '103', block: 'A', floor: 1, joinDate: '2026-06-01', checkoutDate: '2026-12-31', messOpt: 'Veg',     status: 'Active'      },
    { id: 'AL005', student: 'Meena Nayak',   rollNo: 'CO2024001', room: '103', block: 'A', floor: 1, joinDate: '2026-07-01', checkoutDate: '2027-05-31', messOpt: 'Non-Veg', status: 'Active'      },
    { id: 'AL006', student: 'Deepa Singh',   rollNo: 'MA2024001', room: '202', block: 'A', floor: 2, joinDate: '2026-06-01', checkoutDate: '2028-05-31', messOpt: 'Veg',     status: 'Active'      },
    { id: 'AL007', student: 'Kiran Reddy',   rollNo: 'EC2024002', room: '202', block: 'A', floor: 2, joinDate: '2026-06-10', checkoutDate: '2027-05-31', messOpt: 'Non-Veg', status: 'Active'      },
    { id: 'AL008', student: 'Divya Pillai',  rollNo: 'CS2024004', room: '101', block: 'B', floor: 1, joinDate: '2026-06-01', checkoutDate: '2027-05-31', messOpt: 'Veg',     status: 'Active'      },
    { id: 'AL009', student: 'Sanjay Verma',  rollNo: 'CS2024005', room: '101', block: 'B', floor: 1, joinDate: '2026-06-01', checkoutDate: '2026-11-30', messOpt: 'Non-Veg', status: 'Checked Out' },
    { id: 'AL010', student: 'Pooja Iyer',    rollNo: 'MA2024002', room: '102', block: 'B', floor: 1, joinDate: '2026-07-15', checkoutDate: '2027-05-31', messOpt: 'Veg',     status: 'Active'      },
];

const INIT_MENU = [
    { day: 'Monday',    breakfast: 'Idli · Sambar · Chutney',  lunch: 'Rice · Dal · Sabzi · Roti',  snacks: 'Tea & Biscuits',  dinner: 'Chapati · Paneer Curry · Rice',  veg: true  },
    { day: 'Tuesday',   breakfast: 'Poha · Chai',               lunch: 'Rajma Chawal · Salad',       snacks: 'Coffee & Pakoda', dinner: 'Roti · Dal Makhani · Rice',      veg: true  },
    { day: 'Wednesday', breakfast: 'Paratha · Curd',            lunch: 'Fried Rice · Egg Curry',     snacks: 'Tea & Samosa',    dinner: 'Chapati · Egg Curry · Rice',     veg: false },
    { day: 'Thursday',  breakfast: 'Dosa · Sambar',             lunch: 'Rice · Chhole · Roti',       snacks: 'Juice & Cake',    dinner: 'Chicken Biryani · Raita',        veg: false },
    { day: 'Friday',    breakfast: 'Bread Omelette · Tea',      lunch: 'Dal Rice · Papad',           snacks: 'Tea & Banana',    dinner: 'Chapati · Mix Veg · Rice',       veg: true  },
    { day: 'Saturday',  breakfast: 'Upma · Chai',               lunch: 'Veg Pulao · Curry',          snacks: 'Cold Coffee',     dinner: 'Roti · Mutton Curry · Rice',     veg: false },
    { day: 'Sunday',    breakfast: 'Puri · Aloo Bhaji',         lunch: 'Special Thali',              snacks: 'Ice Cream',       dinner: 'Chapati · Special Curry · Rice', veg: false },
];

const INIT_FEES = [
    { id: 'HF001', student: 'Priya Sharma',  rollNo: 'CS2024001', room: 'A-101', period: 'Jun–Nov 2026', amount: 18000, paid: 18000, due: 0,     status: 'Paid'    },
    { id: 'HF002', student: 'Rohan Das',     rollNo: 'CS2024002', room: 'A-101', period: 'Jun–Nov 2026', amount: 18000, paid: 9000,  due: 9000,  status: 'Partial' },
    { id: 'HF003', student: 'Ananya Patel',  rollNo: 'CS2024003', room: 'A-102', period: 'Jun–Nov 2026', amount: 15000, paid: 15000, due: 0,     status: 'Paid'    },
    { id: 'HF004', student: 'Suresh Kumar',  rollNo: 'EC2024001', room: 'A-103', period: 'Jun–Nov 2026', amount: 12000, paid: 0,     due: 12000, status: 'Pending' },
    { id: 'HF005', student: 'Meena Nayak',   rollNo: 'CO2024001', room: 'A-103', period: 'Jun–Nov 2026', amount: 12000, paid: 12000, due: 0,     status: 'Paid'    },
    { id: 'HF006', student: 'Deepa Singh',   rollNo: 'MA2024001', room: 'A-202', period: 'Jun–Nov 2026', amount: 18000, paid: 18000, due: 0,     status: 'Paid'    },
];

const TABS = [
    { key: 'rooms',       label: 'Room Allocation', icon: Bed,             color: '#1e40af' },
    { key: 'allocations', label: 'Allocations',     icon: Users,           color: '#059669' },
    { key: 'mess',        label: 'Mess Tracking',   icon: UtensilsCrossed, color: '#7c3aed' },
    { key: 'fees',        label: 'Hostel Fees',     icon: CreditCard,      color: '#d97706' },
];

const feeColor = s => ({ Paid: '#059669', Partial: '#d97706', Pending: '#dc2626' }[s] || '#475569');
const feeBg    = s => ({ Paid: '#d1fae5', Partial: '#fef3c7', Pending: '#fef2f2' }[s] || '#f1f5f9');
const ROOM_TYPE_COLOR = { Single: '#1e40af', Double: '#059669', Triple: '#7c3aed' };
const ROOM_TYPE_BG    = { Single: '#dbeafe', Double: '#d1fae5', Triple: '#ede9fe' };
const ROOM_CAPS       = { Single: 1, Double: 2, Triple: 3 };

const TODAY_IDX = new Date().getDay();

/* ── Small field helper ── */
const HF = ({ label, error, children }) => (
    <div className="sf-field">
        <label className="sf-label">{label}</label>
        {children}
        {error && <span className="sf-error">{error}</span>}
    </div>
);

const today = new Date().toISOString().split('T')[0];

export default function Hostel() {
    const [tab, setTab]               = useState('rooms');
    const [q, setQ]                   = useState('');
    const [blockFilter, setBlockFilter] = useState('All');

    /* ── Data lists ── */
    const [roomList,  setRoomList]  = useState(INIT_ROOMS);
    const [allocList, setAllocList] = useState(INIT_ALLOCATIONS);
    const [menuList,  setMenuList]  = useState(INIT_MENU);
    const [feeList,   setFeeList]   = useState(INIT_FEES);

    /* ── Auth modal flow ── */
    const [step,     setStep]     = useState(null); // null | 'role' | 'verify' | 'form'
    const [role,     setRole]     = useState(null); // 'warden' | 'student'
    const [action,   setAction]   = useState(null); // 'room' | 'alloc' | 'menu' | 'fee'
    const [verified, setVerified] = useState(null);
    const [showPass, setShowPass] = useState(false);

    /* verify inputs */
    const [wVerify, setWVerify] = useState({ id:'', password:'', error:'' });
    const [sVerify, setSVerify] = useState({ rollNo:'', password:'', error:'' });

    /* warden forms */
    const [roomForm, setRoomForm] = useState(EMPTY_ROOM);
    const [allocForm,setAllocForm]= useState(EMPTY_ALLOC);
    const [menuForm, setMenuForm] = useState(EMPTY_MENU);
    const [feeForm,  setFeeForm]  = useState(EMPTY_FEE);
    const [formErr,  setFormErr]  = useState({});

    const filt = (arr, keys) =>
        arr.filter(r => !q || keys.some(k => String(r[k]).toLowerCase().includes(q.toLowerCase())));

    /* ── Stats ── */
    const totalBeds     = roomList.reduce((s,r) => s + r.capacity, 0);
    const occupiedBeds  = roomList.reduce((s,r) => s + r.occupied, 0);
    const availBeds     = totalBeds - occupiedBeds;
    const activeStudents = allocList.filter(a => a.status === 'Active').length;
    const vegCount       = allocList.filter(a => a.status === 'Active' && a.messOpt === 'Veg').length;

    const todayMenu = menuList[TODAY_IDX === 0 ? 6 : TODAY_IDX - 1];

    /* ── Modal open / close ── */
    const openModal = act => {
        setAction(act); setStep('role'); setRole(null); setVerified(null);
        setShowPass(false); setWVerify({ id:'', password:'', error:'' });
        setSVerify({ rollNo:'', password:'', error:'' }); setFormErr({});
    };

    const closeModal = () => {
        setStep(null); setRole(null); setAction(null); setVerified(null); setShowPass(false);
        setWVerify({ id:'', password:'', error:'' }); setSVerify({ rollNo:'', password:'', error:'' });
        setRoomForm(EMPTY_ROOM); setAllocForm(EMPTY_ALLOC); setMenuForm(EMPTY_MENU); setFeeForm(EMPTY_FEE);
        setFormErr({});
    };

    const selectRole = r => { setRole(r); setStep('verify'); setShowPass(false); };

    /* ── Warden verify ── */
    const handleWardenVerify = () => {
        const key = wVerify.id.trim().toUpperCase();
        const w   = WARDEN_CREDENTIALS[key];
        if (!w || w.password !== wVerify.password) {
            setWVerify(f => ({ ...f, error: 'Invalid Warden ID or password. Please try again.' }));
            return;
        }
        setVerified({ ...w, id: key, role: 'warden' });
        setStep('form');
    };

    /* ── Student verify ── */
    const handleStudentVerify = () => {
        const key = sVerify.rollNo.trim().toUpperCase();
        const s   = STUDENT_CREDENTIALS[key];
        if (!s || s.password !== sVerify.password) {
            setSVerify(f => ({ ...f, error: 'Invalid roll number or password. Please try again.' }));
            return;
        }
        setVerified({ ...s, id: key, role: 'student' });
        setStep('form');
    };

    /* ── Submit: Add Room ── */
    const submitRoom = () => {
        const e = {};
        if (!roomForm.roomNo.trim()) e.roomNo = 'Required';
        if (roomList.some(r => r.roomNo === roomForm.roomNo.trim() && r.block === roomForm.block))
            e.roomNo = `Room ${roomForm.roomNo} already exists in Block ${roomForm.block}`;
        if (Object.keys(e).length) { setFormErr(e); return; }
        const cap = ROOM_CAPS[roomForm.type];
        setRoomList(prev => [...prev, {
            id: `RM${String(prev.length + 1).padStart(3,'0')}`,
            roomNo: roomForm.roomNo.trim(), floor: Number(roomForm.floor),
            block: roomForm.block, type: roomForm.type,
            capacity: cap, occupied: 0, amenities: roomForm.amenities,
        }]);
        closeModal();
    };

    /* ── Submit: Allocate Room ── */
    const submitAlloc = () => {
        const e = {};
        if (!allocForm.student.trim()) e.student = 'Required';
        if (!allocForm.rollNo.trim())  e.rollNo  = 'Required';
        if (!allocForm.roomId)         e.roomId  = 'Required';
        if (!allocForm.joinDate)       e.joinDate = 'Required';
        if (!allocForm.checkoutDate)   e.checkoutDate = 'Required';
        if (allocList.some(a => a.rollNo === allocForm.rollNo.trim().toUpperCase() && a.status === 'Active'))
            e.rollNo = 'Student already has an active allocation';
        if (Object.keys(e).length) { setFormErr(e); return; }
        const room = roomList.find(r => r.id === allocForm.roomId);
        setAllocList(prev => [{
            id: `AL${String(prev.length + 1).padStart(3,'0')}`,
            student: allocForm.student.trim(),
            rollNo: allocForm.rollNo.trim().toUpperCase(),
            room: room.roomNo, block: room.block, floor: room.floor,
            joinDate: allocForm.joinDate, checkoutDate: allocForm.checkoutDate,
            messOpt: allocForm.messOpt, status: 'Active',
        }, ...prev]);
        setRoomList(prev => prev.map(r => r.id === allocForm.roomId ? { ...r, occupied: r.occupied + 1 } : r));
        closeModal();
    };

    /* ── Submit: Update/Add Menu ── */
    const submitMenu = () => {
        const e = {};
        if (!menuForm.breakfast.trim()) e.breakfast = 'Required';
        if (!menuForm.lunch.trim())     e.lunch     = 'Required';
        if (!menuForm.dinner.trim())    e.dinner    = 'Required';
        if (Object.keys(e).length) { setFormErr(e); return; }
        setMenuList(prev => {
            const exists = prev.findIndex(m => m.day === menuForm.day);
            if (exists !== -1) {
                const updated = [...prev];
                updated[exists] = { ...menuForm };
                return updated;
            }
            return [...prev, { ...menuForm }];
        });
        closeModal();
    };

    /* ── Submit: Add Fee Record ── */
    const submitFee = () => {
        const e = {};
        if (!feeForm.student.trim()) e.student = 'Required';
        if (!feeForm.room.trim())    e.room    = 'Required';
        if (!feeForm.period.trim())  e.period  = 'Required';
        if (!feeForm.amount || Number(feeForm.amount) <= 0) e.amount = 'Enter valid amount';
        if (Object.keys(e).length) { setFormErr(e); return; }
        const paid  = Number(feeForm.paid) || 0;
        const total = Number(feeForm.amount);
        const due   = total - paid;
        setFeeList(prev => [{
            id: `HF${String(prev.length + 1).padStart(3,'0')}`,
            student: feeForm.student.trim(), rollNo: feeForm.rollNo.trim().toUpperCase(),
            room: feeForm.room.trim(), period: feeForm.period.trim(),
            amount: total, paid, due,
            status: due <= 0 ? 'Paid' : paid > 0 ? 'Partial' : 'Pending',
        }, ...prev]);
        closeModal();
    };

    /* ── Available rooms (for alloc) ── */
    const availRooms = roomList.filter(r => r.occupied < r.capacity);

    const HS = {
        heroGrid:   { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 },
        heroCard:   { borderRadius:16, padding:'20px 22px', position:'relative', overflow:'hidden', color:'white', minHeight:110 },
        heroTop:    { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
        heroIconBox:{ width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
        heroVal:    { fontSize:'2rem', fontWeight:800, fontFamily:'var(--font-display)', lineHeight:1 },
        heroLbl:    { fontSize:'0.78rem', fontWeight:600, opacity:0.88, marginBottom:4 },
        heroSub:    { fontSize:'0.68rem', opacity:0.72, lineHeight:1.4 },
        heroShine:  { position:'absolute', top:0, right:0, bottom:0, width:'55%', background:'rgba(255,255,255,0.055)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' },
        tabRow:     { display:'flex', alignItems:'center', gap:12, marginBottom:16, flexWrap:'wrap' },
        tabBar:     { display:'flex', gap:2, background:'white', border:'1px solid var(--border)', borderRadius:12, padding:'6px 8px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', overflow:'hidden', flex:1 },
        tab:        { display:'flex', alignItems:'center', gap:7, padding:'8px 16px', border:'none', background:'transparent', borderRadius:8, cursor:'pointer', fontSize:'0.83rem', fontWeight:500, color:'var(--text-muted)', transition:'all 0.15s', whiteSpace:'nowrap', fontFamily:'var(--font-body)', position:'relative' },
        tabActive:  { background:'rgba(37,99,235,0.08)', color:'#2563eb', fontWeight:700 },
        tabDot:     { position:'absolute', bottom:3, left:'50%', transform:'translateX(-50%)', width:5, height:5, borderRadius:99, background:'#2563eb' },
        searchWrap: { display:'flex', alignItems:'center', gap:8, background:'white', border:'1px solid var(--border)', borderRadius:9, padding:'7px 12px', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', minWidth:200 },
        searchInput:{ border:'none', outline:'none', fontSize:'0.83rem', color:'var(--text-primary)', background:'transparent', width:'100%', fontFamily:'var(--font-body)' },
    };

    return (
        <div className="erp-page">
            <Navbar title="Hostel Management" subtitle="Room allocation, mess tracking and hostel fees" />

            {/* ── Hero KPI Cards ── */}
            <div style={HS.heroGrid}>
                {[
                    { label:'Total Rooms',    value:roomList.length, sub:'Blocks A & B combined',                              grad:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.35)',   icon:Home            },
                    { label:'Beds Occupied',  value:occupiedBeds,    sub:`of ${totalBeds} total beds`,                         grad:'linear-gradient(135deg,#991b1b,#ef4444)', glow:'rgba(239,68,68,0.35)',   icon:Bed             },
                    { label:'Beds Available', value:availBeds,       sub:'ready for allocation',                               grad:'linear-gradient(135deg,#065f46,#10b981)', glow:'rgba(16,185,129,0.35)',  icon:CheckCircle2    },
                    { label:'Mess Students',  value:activeStudents,  sub:`${vegCount} veg · ${activeStudents-vegCount} non-veg`, grad:'linear-gradient(135deg,#92400e,#f59e0b)', glow:'rgba(245,158,11,0.35)', icon:UtensilsCrossed },
                ].map(c => (
                    <div key={c.label} style={{ ...HS.heroCard, background:c.grad, boxShadow:`0 8px 24px ${c.glow}` }}>
                        <div style={HS.heroTop}>
                            <div style={HS.heroIconBox}><c.icon size={20} color="white" /></div>
                        </div>
                        <div style={HS.heroVal}>{c.value}</div>
                        <div style={HS.heroLbl}>{c.label}</div>
                        <div style={HS.heroSub}>{c.sub}</div>
                        <div style={HS.heroShine} />
                    </div>
                ))}
            </div>

            {/* ── Unified Tab Row ── */}
            <div style={HS.tabRow}>
                <div style={HS.tabBar}>
                    {TABS.map(({ key, label, icon:Icon }) => {
                        const active = tab === key;
                        return (
                            <button key={key} style={{ ...HS.tab, ...(active ? HS.tabActive : {}) }}
                                onClick={() => { setTab(key); setQ(''); }}>
                                <Icon size={14} /> {label}
                                {active && <span style={HS.tabDot} />}
                            </button>
                        );
                    })}
                </div>
                <div style={HS.searchWrap}>
                    <Search size={14} color="var(--text-muted)" />
                    <input style={HS.searchInput} placeholder="Search…" value={q} onChange={e => setQ(e.target.value)} />
                    {q && <button onClick={() => setQ('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:0, display:'flex' }}><X size={12} /></button>}
                </div>
                {tab === 'rooms' && ['All','A','B'].map(b => (
                    <button key={b} onClick={() => setBlockFilter(b)}
                        style={{ padding:'7px 14px', borderRadius:99, border:`1.5px solid ${blockFilter===b?'#1e40af':'var(--border)'}`, background:blockFilter===b?'#dbeafe':'white', color:blockFilter===b?'#1e40af':'var(--text-muted)', fontSize:'0.78rem', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' }}>
                        {b==='All'?'All Blocks':`Block ${b}`}
                    </button>
                ))}
                <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
                <button className="btn btn-primary btn-sm" onClick={() => openModal(tab==='allocations'?'alloc':tab==='mess'?'menu':tab==='fees'?'fee':'room')}>
                    <Plus size={14} /> {tab==='rooms'?'Add Room':tab==='allocations'?'Allocate Room':tab==='mess'?'Update Menu':'Add Fee Record'}
                </button>
            </div>

            {/* ══════════ ROOMS TAB ══════════ */}
            {tab === 'rooms' && (() => {
                const data = roomList.filter(r =>
                    (blockFilter==='All' || r.block===blockFilter) &&
                    (!q || r.roomNo.includes(q) || r.type.toLowerCase().includes(q.toLowerCase()))
                );
                const fullRooms  = data.filter(r => r.occupied >= r.capacity).length;
                const availRooms = data.filter(r => r.occupied < r.capacity).length;
                return (
                    <>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                            {[
                                { label:'Full Rooms',      value:fullRooms,   grad:'linear-gradient(135deg,#991b1b,#ef4444)', glow:'rgba(239,68,68,0.28)'   },
                                { label:'Available Rooms', value:availRooms,  grad:'linear-gradient(135deg,#065f46,#10b981)', glow:'rgba(16,185,129,0.28)'  },
                                { label:'Rooms Shown',     value:data.length, grad:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)'   },
                            ].map(c => (
                                <div key={c.label} style={{ borderRadius:12, padding:'14px 18px', background:c.grad, boxShadow:`0 4px 16px ${c.glow}`, color:'white', position:'relative', overflow:'hidden' }}>
                                    <div style={{ fontSize:'1.6rem', fontWeight:800, fontFamily:'var(--font-display)', lineHeight:1 }}>{c.value}</div>
                                    <div style={{ fontSize:'0.72rem', fontWeight:600, opacity:0.85, marginTop:4 }}>{c.label}</div>
                                    <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'50%', background:'rgba(255,255,255,0.05)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' }} />
                                </div>
                            ))}
                        </div>
                        <div className="hs-room-grid">
                            {data.map(room => {
                                const isFull = room.occupied >= room.capacity;
                                const pct    = room.capacity > 0 ? (room.occupied / room.capacity * 100) : 0;
                                return (
                                    <div key={room.id} className="hs-room-card">
                                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                <div style={{ width:38, height:38, borderRadius:10, background:isFull?'linear-gradient(135deg,#991b1b,#ef4444)':'linear-gradient(135deg,#065f46,#10b981)', display:'grid', placeItems:'center', flexShrink:0, boxShadow:isFull?'0 4px 10px rgba(239,68,68,0.3)':'0 4px 10px rgba(16,185,129,0.3)' }}>
                                                    <Bed size={16} color="white" />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight:800, fontSize:'1rem', color:'var(--text-primary)', fontFamily:'var(--font-display)' }}>Block {room.block} – {room.roomNo}</div>
                                                    <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:2 }}>Floor {room.floor}</div>
                                                </div>
                                            </div>
                                            <span style={{ background:ROOM_TYPE_BG[room.type], color:ROOM_TYPE_COLOR[room.type], padding:'3px 10px', borderRadius:99, fontSize:'0.7rem', fontWeight:700, border:`1.5px solid ${ROOM_TYPE_COLOR[room.type]}40` }}>{room.type}</span>
                                        </div>
                                        <div style={{ marginBottom:10 }}>
                                            <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:5 }}>
                                                <span>{room.occupied} occupied</span><span>{room.capacity} beds</span>
                                            </div>
                                            <div style={{ height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                <div style={{ width:`${pct}%`, height:'100%', background:isFull?'linear-gradient(90deg,#dc2626,#ef4444)':'linear-gradient(90deg,#059669,#10b981)', borderRadius:99, transition:'width 0.3s' }} />
                                            </div>
                                        </div>
                                        <div style={{ display:'flex', gap:5, marginBottom:10 }}>
                                            {[...Array(room.capacity)].map((_,i) => (
                                                <div key={i} style={{ flex:1, height:30, borderRadius:8, background:i<room.occupied?(isFull?'linear-gradient(135deg,#fca5a5,#fecaca)':'linear-gradient(135deg,#6ee7b7,#a7f3d0)'):'#f8fafc', border:`1.5px solid ${i<room.occupied?(isFull?'#fca5a5':'#6ee7b7'):'#e2e8f0'}`, display:'grid', placeItems:'center' }}>
                                                    <Bed size={12} color={i<room.occupied?(isFull?'#dc2626':'#059669'):'#cbd5e1'} />
                                                </div>
                                            ))}
                                        </div>
                                        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                                            {room.amenities.map(a => <span key={a} style={{ background:'#f1f5f9', color:'#475569', padding:'2px 8px', borderRadius:99, fontSize:'0.63rem', fontWeight:600, border:'1px solid #e2e8f0' }}>{a}</span>)}
                                        </div>
                                        <div style={{ marginTop:10, paddingTop:8, borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                            <span style={{ fontSize:'0.72rem', fontWeight:700, color:isFull?'#dc2626':'#059669', background:isFull?'#fef2f2':'#d1fae5', padding:'3px 10px', borderRadius:99, border:`1.5px solid ${isFull?'#fca5a5':'#6ee7b7'}` }}>{isFull?'Full':`${room.capacity-room.occupied} bed${room.capacity-room.occupied!==1?'s':''} free`}</span>
                                            <div style={{ display:'flex', gap:5 }}>
                                                <button className="tbl-btn"><Eye size={12} /></button>
                                                <button className="tbl-btn"><Edit2 size={12} /></button>
                                                <button className="tbl-btn danger" onClick={() => setRoomList(p => p.filter(x => x.id !== room.id))}><Trash2 size={12} /></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {data.length === 0 && <div className="empty-state"><div className="empty-icon">🏠</div><p>No rooms found.</p></div>}
                    </>
                );
            })()}

            {/* ══════════ ALLOCATIONS TAB ══════════ */}
            {tab === 'allocations' && (() => {
                const data = filt(allocList, ['student','rollNo','room','block','messOpt','status']);
                return (
                    <div className="card">
                        <div className="card-header">
                            <div><h2>Room Allocations <span className="count-pill">{data.length}</span></h2><p>Student room assignments with mess preferences</p></div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead><tr>
                                    <th>Student</th><th>Room</th><th>Mess</th>
                                    <th>Join Date</th><th>Checkout</th><th>Status</th>
                                    <th style={{ textAlign:'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.map(a => (
                                        <tr key={a.id}>
                                            <td>
                                                <div style={{ fontWeight:700, fontSize:'0.875rem', color:'var(--text-primary)' }}>{a.student}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'monospace', marginTop:2 }}>{a.rollNo}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontWeight:600, fontSize:'0.83rem' }}>Block {a.block} – {a.room}</div>
                                                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>Floor {a.floor}</div>
                                            </td>
                                            <td>
                                                <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:a.messOpt==='Veg'?'#d1fae5':'#fef3c7', color:a.messOpt==='Veg'?'#059669':'#d97706', padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:`1.5px solid ${a.messOpt==='Veg'?'#6ee7b7':'#fcd34d'}` }}>
                                                    {a.messOpt==='Veg'?<Leaf size={11} />:<span>🍗</span>} {a.messOpt}
                                                </span>
                                            </td>
                                            <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{a.joinDate}</td>
                                            <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{a.checkoutDate}</td>
                                            <td><span style={{ background:a.status==='Active'?'#d1fae5':'#f1f5f9', color:a.status==='Active'?'#059669':'#64748b', padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:`1.5px solid ${a.status==='Active'?'#6ee7b7':'#cbd5e1'}` }}>{a.status}</span></td>
                                            <td>
                                                <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                    <button className="tbl-btn"><Eye size={13} /></button>
                                                    <button className="tbl-btn"><Edit2 size={13} /></button>
                                                    <button className="tbl-btn danger" onClick={() => setAllocList(p => p.filter(x => x.id !== a.id))}><Trash2 size={13} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {data.length === 0 && <div className="empty-state"><div className="empty-icon">🛏️</div><p>No allocations found.</p></div>}
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ MESS TAB ══════════ */}
            {tab === 'mess' && (() => {
                const nonVeg = activeStudents - vegCount;
                return (
                    <>
                        {todayMenu && (
                            <div style={{ background:'linear-gradient(135deg,#f5f3ff,#eff6ff)', border:'1px solid #c4b5fd', borderRadius:14, padding:'18px 22px', marginBottom:16 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                                    <div style={{ width:32, height:32, borderRadius:8, background:'#7c3aed', display:'grid', placeItems:'center' }}><UtensilsCrossed size={16} color="white" /></div>
                                    <div>
                                        <div style={{ fontWeight:700, fontSize:'0.9rem', color:'#4c1d95' }}>Today's Menu — {todayMenu.day}</div>
                                        <div style={{ fontSize:'0.72rem', color:'#7c3aed' }}>{todayMenu.veg?'🌿 Vegetarian Day':'🍗 Non-Vegetarian Day'}</div>
                                    </div>
                                </div>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
                                    {[{label:'Breakfast',icon:Coffee,meal:todayMenu.breakfast},{label:'Lunch',icon:Sun,meal:todayMenu.lunch},{label:'Snacks',icon:Cookie,meal:todayMenu.snacks},{label:'Dinner',icon:Moon,meal:todayMenu.dinner}].map(({label,icon:Icon,meal}) => (
                                        <div key={label} style={{ background:'rgba(255,255,255,0.7)', borderRadius:10, padding:'12px 14px' }}>
                                            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                                                <Icon size={13} style={{ color:'#7c3aed' }} />
                                                <span style={{ fontSize:'0.72rem', fontWeight:700, color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</span>
                                            </div>
                                            <div style={{ fontSize:'0.8rem', color:'#3b0764', lineHeight:1.4 }}>{meal}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                            {[
                                {label:'Mess Students',  value:activeStudents, grad:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.28)'},
                                {label:'Vegetarian',     value:vegCount,       grad:'linear-gradient(135deg,#065f46,#10b981)', glow:'rgba(16,185,129,0.28)'},
                                {label:'Non-Vegetarian', value:nonVeg,         grad:'linear-gradient(135deg,#92400e,#f59e0b)', glow:'rgba(245,158,11,0.28)'},
                            ].map(c => (
                                <div key={c.label} style={{ borderRadius:12, padding:'14px 18px', background:c.grad, boxShadow:`0 4px 16px ${c.glow}`, color:'white', position:'relative', overflow:'hidden' }}>
                                    <div style={{ fontSize:'1.6rem', fontWeight:800, fontFamily:'var(--font-display)', lineHeight:1 }}>{c.value}</div>
                                    <div style={{ fontSize:'0.72rem', fontWeight:600, opacity:0.85, marginTop:4 }}>{c.label}</div>
                                    <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'50%', background:'rgba(255,255,255,0.05)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' }} />
                                </div>
                            ))}
                        </div>
                        <div className="card">
                            <div className="card-header"><div><h2>Weekly Mess Menu</h2><p>Full week meal plan — click "Update Menu" to edit any day</p></div></div>
                            <div style={{ overflowX:'auto' }}>
                                <table>
                                    <thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Snacks</th><th>Dinner</th><th>Type</th><th style={{ textAlign:'right' }}>Actions</th></tr></thead>
                                    <tbody>
                                        {menuList.map((m,i) => (
                                            <tr key={m.day} style={{ background: i===(TODAY_IDX===0?6:TODAY_IDX-1)?'rgba(124,58,237,0.05)':undefined }}>
                                                <td>
                                                    <div style={{ fontWeight:700, fontSize:'0.875rem', color:i===(TODAY_IDX===0?6:TODAY_IDX-1)?'#7c3aed':'var(--text-primary)' }}>
                                                        {m.day}{i===(TODAY_IDX===0?6:TODAY_IDX-1)&&<span style={{ marginLeft:6, background:'#7c3aed', color:'white', fontSize:'0.6rem', padding:'1px 6px', borderRadius:3, fontWeight:700 }}>TODAY</span>}
                                                    </div>
                                                </td>
                                                <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{m.breakfast}</td>
                                                <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{m.lunch}</td>
                                                <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{m.snacks}</td>
                                                <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{m.dinner}</td>
                                                <td><span style={{ background:m.veg?'#d1fae5':'#fef3c7', color:m.veg?'#059669':'#d97706', padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${m.veg?'#6ee7b7':'#fcd34d'}` }}>{m.veg?'🌿 Veg':'🍗 Non-Veg'}</span></td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        <button className="tbl-btn" title="Edit Menu" onClick={() => { setMenuForm({ ...m }); openModal('menu'); }}><Edit2 size={13} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                );
            })()}

            {/* ══════════ FEES TAB ══════════ */}
            {tab === 'fees' && (() => {
                const data = filt(feeList, ['student','rollNo','room','status','period']);
                const totalAmt  = data.reduce((s,f) => s+f.amount, 0);
                const totalPaid = data.reduce((s,f) => s+f.paid,   0);
                const totalDue  = data.reduce((s,f) => s+f.due,    0);
                return (
                    <>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                            {[
                                {label:'Total Billed',  value:`₹${totalAmt.toLocaleString()}`,  grad:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)'},
                                {label:'Collected',     value:`₹${totalPaid.toLocaleString()}`, grad:'linear-gradient(135deg,#065f46,#10b981)', glow:'rgba(16,185,129,0.28)'},
                                {label:'Outstanding',   value:`₹${totalDue.toLocaleString()}`,  grad:'linear-gradient(135deg,#991b1b,#ef4444)', glow:'rgba(239,68,68,0.28)'},
                            ].map(c => (
                                <div key={c.label} style={{ borderRadius:12, padding:'14px 18px', background:c.grad, boxShadow:`0 4px 16px ${c.glow}`, color:'white', position:'relative', overflow:'hidden' }}>
                                    <div style={{ fontSize:'1.5rem', fontWeight:800, fontFamily:'var(--font-display)', lineHeight:1 }}>{c.value}</div>
                                    <div style={{ fontSize:'0.72rem', fontWeight:600, opacity:0.85, marginTop:4 }}>{c.label}</div>
                                    <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'50%', background:'rgba(255,255,255,0.05)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' }} />
                                </div>
                            ))}
                        </div>
                        <div className="card">
                            <div className="card-header"><div><h2>Hostel Fee Records <span className="count-pill">{data.length}</span></h2><p>Room rent, mess charges and outstanding dues</p></div></div>
                            <div style={{ overflowX:'auto' }}>
                                <table>
                                    <thead><tr><th>Student</th><th>Room</th><th>Period</th><th>Total</th><th>Paid</th><th>Due</th><th>Status</th><th style={{ textAlign:'right' }}>Actions</th></tr></thead>
                                    <tbody>
                                        {data.map(f => (
                                            <tr key={f.id}>
                                                <td>
                                                    <div style={{ fontWeight:700, fontSize:'0.875rem', color:'var(--text-primary)' }}>{f.student}</div>
                                                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'monospace', marginTop:2 }}>{f.rollNo}</div>
                                                </td>
                                                <td><span style={{ background:'linear-gradient(135deg,#1e3a8a,#2563eb)', color:'white', padding:'3px 10px', borderRadius:8, fontSize:'0.73rem', fontWeight:700, fontFamily:'monospace' }}>{f.room}</span></td>
                                                <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{f.period}</td>
                                                <td style={{ fontWeight:700, fontSize:'0.875rem' }}>₹{f.amount.toLocaleString()}</td>
                                                <td style={{ fontWeight:700, fontSize:'0.875rem', color:'#059669' }}>₹{f.paid.toLocaleString()}</td>
                                                <td><span style={{ fontWeight:700, fontSize:'0.875rem', color:f.due>0?'#dc2626':'#059669' }}>{f.due>0?`₹${f.due.toLocaleString()}`:'—'}</span></td>
                                                <td><span style={{ background:feeBg(f.status), color:feeColor(f.status), padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:`1.5px solid ${feeColor(f.status)}40` }}>{f.status}</span></td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        <button className="tbl-btn"><Eye size={13} /></button>
                                                        <button className="tbl-btn"><Edit2 size={13} /></button>
                                                        <button className="tbl-btn danger" onClick={() => setFeeList(p => p.filter(x => x.id !== f.id))}><Trash2 size={13} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {data.length === 0 && <div className="empty-state"><div className="empty-icon">💰</div><p>No fee records found.</p></div>}
                            </div>
                        </div>
                    </>
                );
            })()}

            {/* ══════════ MODAL FLOW ══════════ */}
            {step && (
                <div className="em-overlay" onClick={closeModal}>
                    <div className={`em-modal ${step !== 'role' ? 'em-modal-lg' : ''}`}
                        style={{ maxWidth: step==='role'?500:step==='verify'?420:600 }}
                        onClick={e => e.stopPropagation()}>

                        {/* ── STEP 1: Role Selector ── */}
                        {step === 'role' && (
                            <>
                                <div className="em-modal-head">
                                    <div>
                                        <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>Select Your Role</h3>
                                        <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>
                                            {action==='room'?'Add a new room to the hostel':action==='alloc'?'Allocate room to a student':action==='menu'?'Update mess menu':' Add hostel fee record'}
                                        </p>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16} /></button>
                                </div>
                                <div className="em-modal-body">
                                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                                        {/* Warden card */}
                                        <button type="button" className="hs-role-card" onClick={() => selectRole('warden')}
                                            style={{ borderColor:'#1e40af', background:'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                                            <div style={{ width:52, height:52, borderRadius:14, background:'#1e40af', display:'grid', placeItems:'center', margin:'0 auto 12px' }}>
                                                <KeyRound size={26} color="white" />
                                            </div>
                                            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1e3a8a', marginBottom:5 }}>Warden</div>
                                            <div style={{ fontSize:'0.75rem', color:'#1d4ed8', lineHeight:1.4 }}>Full access — add, edit & manage hostel records</div>
                                        </button>
                                        {/* Student card */}
                                        <button type="button" className="hs-role-card" onClick={() => selectRole('student')}
                                            style={{ borderColor:'#059669', background:'linear-gradient(135deg,#f0fdf4,#d1fae5)' }}>
                                            <div style={{ width:52, height:52, borderRadius:14, background:'#059669', display:'grid', placeItems:'center', margin:'0 auto 12px' }}>
                                                <UserCircle size={26} color="white" />
                                            </div>
                                            <div style={{ fontWeight:800, fontSize:'1rem', color:'#065f46', marginBottom:5 }}>Student</div>
                                            <div style={{ fontSize:'0.75rem', color:'#047857', lineHeight:1.4 }}>View your room, mess & fee details</div>
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
                                        <div style={{ width:44, height:44, borderRadius:12, background:role==='warden'?'linear-gradient(135deg,#1e40af,#3b82f6)':'linear-gradient(135deg,#059669,#34d399)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                            <ShieldCheck size={22} color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>{role==='warden'?'Warden':'Student'} Verification</h3>
                                            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>Enter your credentials to continue</p>
                                        </div>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16} /></button>
                                </div>
                                <div className="em-modal-body">
                                    {role === 'warden' ? (
                                        <>
                                            {wVerify.error && <div className="em-alert-error"><AlertCircle size={14} /> {wVerify.error}</div>}
                                            <div className="sf-field">
                                                <label className="sf-label">Warden ID</label>
                                                <input className="sf-input" placeholder="e.g. WRD001" value={wVerify.id} onChange={e => setWVerify(f=>({...f,id:e.target.value,error:''}))} onKeyDown={e=>e.key==='Enter'&&handleWardenVerify()} autoFocus style={{ textTransform:'uppercase', fontFamily:'monospace' }} />
                                            </div>
                                            <div className="sf-field" style={{ marginTop:14 }}>
                                                <label className="sf-label">Password</label>
                                                <div style={{ position:'relative' }}>
                                                    <input className="sf-input" type={showPass?'text':'password'} placeholder="Enter your password" value={wVerify.password} onChange={e => setWVerify(f=>({...f,password:e.target.value,error:''}))} onKeyDown={e=>e.key==='Enter'&&handleWardenVerify()} style={{ paddingRight:40 }} />
                                                    <button type="button" onClick={()=>setShowPass(v=>!v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><Lock size={14} /></button>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', alignItems:'flex-start', gap:9, background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:8, padding:'10px 14px', marginTop:16 }}>
                                                <AlertCircle size={14} style={{ color:'#0284c7', marginTop:1, flexShrink:0 }} />
                                                <p style={{ margin:0, fontSize:'0.75rem', color:'#0369a1', lineHeight:1.5 }}>Use your <strong>Warden ID</strong> (WRD001–WRD003) and assigned password (<strong>wrd</strong> + 3-digit ID, e.g. <strong>wrd001</strong>). Contact the Chief Warden if you need help.</p>
                                            </div>
                                            <button className="btn btn-primary" style={{ width:'100%', marginTop:20 }} onClick={handleWardenVerify}><ShieldCheck size={15} /> Verify & Continue</button>
                                        </>
                                    ) : (
                                        <>
                                            {sVerify.error && <div className="em-alert-error"><AlertCircle size={14} /> {sVerify.error}</div>}
                                            <div className="sf-field">
                                                <label className="sf-label">Roll Number</label>
                                                <input className="sf-input" placeholder="e.g. CS2024001" value={sVerify.rollNo} onChange={e => setSVerify(f=>({...f,rollNo:e.target.value,error:''}))} onKeyDown={e=>e.key==='Enter'&&handleStudentVerify()} autoFocus style={{ textTransform:'uppercase', fontFamily:'monospace' }} />
                                            </div>
                                            <div className="sf-field" style={{ marginTop:14 }}>
                                                <label className="sf-label">Password</label>
                                                <div style={{ position:'relative' }}>
                                                    <input className="sf-input" type={showPass?'text':'password'} placeholder="Enter your password" value={sVerify.password} onChange={e => setSVerify(f=>({...f,password:e.target.value,error:''}))} onKeyDown={e=>e.key==='Enter'&&handleStudentVerify()} style={{ paddingRight:40 }} />
                                                    <button type="button" onClick={()=>setShowPass(v=>!v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><Lock size={14} /></button>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', alignItems:'flex-start', gap:9, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:'10px 14px', marginTop:16 }}>
                                                <AlertCircle size={14} style={{ color:'#059669', marginTop:1, flexShrink:0 }} />
                                                <p style={{ margin:0, fontSize:'0.75rem', color:'#047857', lineHeight:1.5 }}>Use your <strong>Roll Number</strong> and password issued by the hostel office (format: <strong>stu</strong> + 3 digits, e.g. <strong>stu001</strong>).</p>
                                            </div>
                                            <button className="btn btn-primary" style={{ width:'100%', marginTop:20, background:'#059669', borderColor:'#059669' }} onClick={handleStudentVerify}><ShieldCheck size={15} /> Verify & View</button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ── STEP 3: Forms / Student View ── */}
                        {step === 'form' && verified && (
                            <>
                                <div className="em-modal-head">
                                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                                        <div style={{ width:44, height:44, borderRadius:12, background:verified.role==='warden'?'linear-gradient(135deg,#1e40af,#3b82f6)':'linear-gradient(135deg,#059669,#34d399)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                            {verified.role==='warden'?<KeyRound size={22} color="white" />:<UserCircle size={22} color="white" />}
                                        </div>
                                        <div>
                                            <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>
                                                {verified.role==='warden'
                                                    ? (action==='room'?'Add New Room':action==='alloc'?'Allocate Room':action==='menu'?'Update Mess Menu':'Add Fee Record')
                                                    : 'Your Hostel Details'}
                                            </h3>
                                            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>{verified.role==='warden'?`${verified.name} · ${verified.role}`:`${verified.name} · ${verified.id}`}</p>
                                        </div>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16} /></button>
                                </div>
                                <div className="em-modal-body">
                                    {/* Verified banner */}
                                    <div style={{ display:'flex', alignItems:'center', gap:10, background:verified.role==='warden'?'#dbeafe':'#d1fae5', border:`1px solid ${verified.role==='warden'?'#93c5fd':'#6ee7b7'}`, borderRadius:10, padding:'10px 16px', marginBottom:20 }}>
                                        <CheckCircle2 size={18} style={{ color:verified.role==='warden'?'#1e40af':'#059669', flexShrink:0 }} />
                                        <div>
                                            <div style={{ fontSize:'0.83rem', fontWeight:700, color:verified.role==='warden'?'#1e3a8a':'#065f46' }}>
                                                {verified.role==='warden'?`Warden: ${verified.name} (${verified.role})`:`Student: ${verified.name}`}
                                            </div>
                                            <div style={{ fontSize:'0.72rem', color:verified.role==='warden'?'#1d4ed8':'#047857' }}>
                                                {verified.role==='warden'?`${verified.id} · ${verified.block}`:`${verified.id} · ${verified.course}`}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ── WARDEN: Add Room ── */}
                                    {verified.role==='warden' && action==='room' && (
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <HF label={<>Room Number <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.roomNo}>
                                                    <input className={`sf-input ${formErr.roomNo?'sf-input-err':''}`} placeholder="e.g. 301" value={roomForm.roomNo} onChange={e=>{setRoomForm(f=>({...f,roomNo:e.target.value}));setFormErr(x=>({...x,roomNo:''}));}} />
                                                </HF>
                                                <HF label="Block">
                                                    <div style={{ display:'flex', gap:8, marginTop:6 }}>
                                                        {['A','B'].map(b => (
                                                            <button key={b} type="button" onClick={()=>setRoomForm(f=>({...f,block:b}))} style={{ flex:1, padding:'9px 0', borderRadius:8, border:`2px solid ${roomForm.block===b?'#1e40af':'var(--border)'}`, background:roomForm.block===b?'#dbeafe':'var(--bg)', color:roomForm.block===b?'#1e40af':'var(--text-muted)', fontWeight:700, fontSize:'0.83rem', cursor:'pointer' }}>Block {b}</button>
                                                        ))}
                                                    </div>
                                                </HF>
                                                <HF label="Floor">
                                                    <select className="sf-input" value={roomForm.floor} onChange={e=>setRoomForm(f=>({...f,floor:Number(e.target.value)}))}>
                                                        {[1,2,3,4].map(f => <option key={f} value={f}>Floor {f}</option>)}
                                                    </select>
                                                </HF>
                                                <HF label="Room Type">
                                                    <div style={{ display:'flex', gap:6, marginTop:6 }}>
                                                        {['Single','Double','Triple'].map(t => (
                                                            <button key={t} type="button" onClick={()=>setRoomForm(f=>({...f,type:t}))} style={{ flex:1, padding:'8px 0', borderRadius:8, border:`2px solid ${roomForm.type===t?ROOM_TYPE_COLOR[t]:'var(--border)'}`, background:roomForm.type===t?ROOM_TYPE_BG[t]:'var(--bg)', color:roomForm.type===t?ROOM_TYPE_COLOR[t]:'var(--text-muted)', fontWeight:700, fontSize:'0.72rem', cursor:'pointer' }}>{t}</button>
                                                        ))}
                                                    </div>
                                                </HF>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <HF label="Amenities">
                                                        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:6 }}>
                                                            {ALL_AMENITIES.map(a => {
                                                                const sel = roomForm.amenities.includes(a);
                                                                return (
                                                                    <button key={a} type="button" onClick={() => setRoomForm(f => ({ ...f, amenities: sel ? f.amenities.filter(x=>x!==a) : [...f.amenities, a] }))}
                                                                        style={{ padding:'6px 12px', borderRadius:8, border:`2px solid ${sel?'#1e40af':'var(--border)'}`, background:sel?'#dbeafe':'var(--bg)', color:sel?'#1e40af':'var(--text-muted)', fontWeight:sel?700:500, fontSize:'0.78rem', cursor:'pointer' }}>
                                                                        {a}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </HF>
                                                </div>
                                            </div>
                                            <div style={{ background:'#f8fafc', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', marginTop:12, display:'flex', gap:10, flexWrap:'wrap', alignItems:'center' }}>
                                                <span style={{ fontWeight:700, fontSize:'0.83rem' }}>Block {roomForm.block} – Room {roomForm.roomNo||'?'}</span>
                                                <span style={{ background:ROOM_TYPE_BG[roomForm.type], color:ROOM_TYPE_COLOR[roomForm.type], padding:'2px 9px', borderRadius:4, fontSize:'0.75rem', fontWeight:700 }}>{roomForm.type} · {ROOM_CAPS[roomForm.type]} bed{ROOM_CAPS[roomForm.type]>1?'s':''}</span>
                                                <span style={{ background:'#f1f5f9', color:'#475569', padding:'2px 9px', borderRadius:4, fontSize:'0.75rem' }}>Floor {roomForm.floor}</span>
                                            </div>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" onClick={submitRoom}><Home size={14} /> Add Room</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── WARDEN: Allocate Room ── */}
                                    {verified.role==='warden' && action==='alloc' && (
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <HF label={<>Student Name <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.student}>
                                                    <input className={`sf-input ${formErr.student?'sf-input-err':''}`} placeholder="Full name" value={allocForm.student} onChange={e=>{setAllocForm(f=>({...f,student:e.target.value}));setFormErr(x=>({...x,student:''}));}} />
                                                </HF>
                                                <HF label={<>Roll Number <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.rollNo}>
                                                    <input className={`sf-input ${formErr.rollNo?'sf-input-err':''}`} placeholder="e.g. CS2024010" value={allocForm.rollNo} onChange={e=>{setAllocForm(f=>({...f,rollNo:e.target.value}));setFormErr(x=>({...x,rollNo:''}));}} style={{ textTransform:'uppercase', fontFamily:'monospace' }} />
                                                </HF>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <HF label={<>Assign Room <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.roomId}>
                                                        <select className={`sf-input ${formErr.roomId?'sf-input-err':''}`} value={allocForm.roomId} onChange={e=>{setAllocForm(f=>({...f,roomId:e.target.value}));setFormErr(x=>({...x,roomId:''}));}}>
                                                            <option value="">Select available room…</option>
                                                            {availRooms.map(r => <option key={r.id} value={r.id}>Block {r.block} – Room {r.roomNo} ({r.type}, {r.capacity-r.occupied} bed{r.capacity-r.occupied!==1?'s':''} free)</option>)}
                                                        </select>
                                                    </HF>
                                                </div>
                                                <HF label={<>Join Date <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.joinDate}>
                                                    <input type="date" className={`sf-input ${formErr.joinDate?'sf-input-err':''}`} value={allocForm.joinDate} onChange={e=>{setAllocForm(f=>({...f,joinDate:e.target.value}));setFormErr(x=>({...x,joinDate:''}));}} />
                                                </HF>
                                                <HF label={<>Checkout Date <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.checkoutDate}>
                                                    <input type="date" className={`sf-input ${formErr.checkoutDate?'sf-input-err':''}`} value={allocForm.checkoutDate} onChange={e=>{setAllocForm(f=>({...f,checkoutDate:e.target.value}));setFormErr(x=>({...x,checkoutDate:''}));}} />
                                                </HF>
                                                <HF label="Mess Preference">
                                                    <div style={{ display:'flex', gap:10, marginTop:6 }}>
                                                        {['Veg','Non-Veg'].map(m => (
                                                            <button key={m} type="button" onClick={()=>setAllocForm(f=>({...f,messOpt:m}))} style={{ flex:1, padding:'9px 0', borderRadius:8, border:`2px solid ${allocForm.messOpt===m?(m==='Veg'?'#059669':'#d97706'):'var(--border)'}`, background:allocForm.messOpt===m?(m==='Veg'?'#d1fae5':'#fef3c7'):'var(--bg)', color:allocForm.messOpt===m?(m==='Veg'?'#059669':'#d97706'):'var(--text-muted)', fontWeight:700, fontSize:'0.83rem', cursor:'pointer' }}>{m==='Veg'?'🌿':''} {m}</button>
                                                        ))}
                                                    </div>
                                                </HF>
                                            </div>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" onClick={submitAlloc}><Bed size={14} /> Allocate Room</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── WARDEN: Update Mess Menu ── */}
                                    {verified.role==='warden' && action==='menu' && (
                                        <>
                                            <HF label="Day">
                                                <select className="sf-input" value={menuForm.day} onChange={e=>setMenuForm(f=>({...f,day:e.target.value}))}>
                                                    {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d=><option key={d} value={d}>{d}</option>)}
                                                </select>
                                            </HF>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <HF label={<>Breakfast <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.breakfast}>
                                                    <input className={`sf-input ${formErr.breakfast?'sf-input-err':''}`} placeholder="e.g. Idli · Sambar" value={menuForm.breakfast} onChange={e=>{setMenuForm(f=>({...f,breakfast:e.target.value}));setFormErr(x=>({...x,breakfast:''}));}} />
                                                </HF>
                                                <HF label={<>Lunch <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.lunch}>
                                                    <input className={`sf-input ${formErr.lunch?'sf-input-err':''}`} placeholder="e.g. Rice · Dal · Sabzi" value={menuForm.lunch} onChange={e=>{setMenuForm(f=>({...f,lunch:e.target.value}));setFormErr(x=>({...x,lunch:''}));}} />
                                                </HF>
                                                <HF label="Snacks">
                                                    <input className="sf-input" placeholder="e.g. Tea & Biscuits" value={menuForm.snacks} onChange={e=>setMenuForm(f=>({...f,snacks:e.target.value}))} />
                                                </HF>
                                                <HF label={<>Dinner <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.dinner}>
                                                    <input className={`sf-input ${formErr.dinner?'sf-input-err':''}`} placeholder="e.g. Chapati · Dal · Rice" value={menuForm.dinner} onChange={e=>{setMenuForm(f=>({...f,dinner:e.target.value}));setFormErr(x=>({...x,dinner:''}));}} />
                                                </HF>
                                            </div>
                                            <HF label="Meal Type">
                                                <div style={{ display:'flex', gap:10, marginTop:6 }}>
                                                    {[{v:true,l:'🌿 Vegetarian'},{v:false,l:'🍗 Non-Vegetarian'}].map(o=>(
                                                        <button key={String(o.v)} type="button" onClick={()=>setMenuForm(f=>({...f,veg:o.v}))} style={{ flex:1, padding:'9px 0', borderRadius:8, border:`2px solid ${menuForm.veg===o.v?(o.v?'#059669':'#d97706'):'var(--border)'}`, background:menuForm.veg===o.v?(o.v?'#d1fae5':'#fef3c7'):'var(--bg)', color:menuForm.veg===o.v?(o.v?'#059669':'#d97706'):'var(--text-muted)', fontWeight:700, fontSize:'0.83rem', cursor:'pointer' }}>{o.l}</button>
                                                    ))}
                                                </div>
                                            </HF>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" style={{ background:'#7c3aed', borderColor:'#7c3aed' }} onClick={submitMenu}><UtensilsCrossed size={14} /> Update Menu</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── WARDEN: Add Fee Record ── */}
                                    {verified.role==='warden' && action==='fee' && (
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <HF label={<>Student Name <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.student}>
                                                    <input className={`sf-input ${formErr.student?'sf-input-err':''}`} placeholder="Full name" value={feeForm.student} onChange={e=>{setFeeForm(f=>({...f,student:e.target.value}));setFormErr(x=>({...x,student:''}));}} />
                                                </HF>
                                                <HF label="Roll Number">
                                                    <input className="sf-input" placeholder="e.g. CS2024001" value={feeForm.rollNo} onChange={e=>setFeeForm(f=>({...f,rollNo:e.target.value}))} style={{ textTransform:'uppercase', fontFamily:'monospace' }} />
                                                </HF>
                                                <HF label={<>Room <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.room}>
                                                    <input className={`sf-input ${formErr.room?'sf-input-err':''}`} placeholder="e.g. A-101" value={feeForm.room} onChange={e=>{setFeeForm(f=>({...f,room:e.target.value}));setFormErr(x=>({...x,room:''}));}} />
                                                </HF>
                                                <HF label={<>Period <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.period}>
                                                    <input className={`sf-input ${formErr.period?'sf-input-err':''}`} placeholder="e.g. Jun–Nov 2026" value={feeForm.period} onChange={e=>{setFeeForm(f=>({...f,period:e.target.value}));setFormErr(x=>({...x,period:''}));}} />
                                                </HF>
                                                <HF label={<>Total Amount (₹) <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.amount}>
                                                    <input type="number" className={`sf-input ${formErr.amount?'sf-input-err':''}`} placeholder="e.g. 18000" value={feeForm.amount} onChange={e=>{setFeeForm(f=>({...f,amount:e.target.value}));setFormErr(x=>({...x,amount:''}));}} />
                                                </HF>
                                                <HF label="Amount Paid (₹)">
                                                    <input type="number" className="sf-input" placeholder="e.g. 9000 (0 if unpaid)" value={feeForm.paid} onChange={e=>setFeeForm(f=>({...f,paid:e.target.value}))} />
                                                </HF>
                                            </div>
                                            {feeForm.amount && (
                                                <div style={{ background:'#f8fafc', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', marginTop:4, display:'flex', gap:12, flexWrap:'wrap' }}>
                                                    <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Due: <strong style={{ color: Number(feeForm.amount)-(Number(feeForm.paid)||0)>0?'#dc2626':'#059669' }}>₹{Math.max(0,Number(feeForm.amount)-(Number(feeForm.paid)||0)).toLocaleString()}</strong></span>
                                                    <span style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Status: <strong>{Number(feeForm.amount)-(Number(feeForm.paid)||0)<=0?'Paid':(Number(feeForm.paid)||0)>0?'Partial':'Pending'}</strong></span>
                                                </div>
                                            )}
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" style={{ background:'#d97706', borderColor:'#d97706' }} onClick={submitFee}><CreditCard size={14} /> Add Fee Record</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── STUDENT: View Details ── */}
                                    {verified.role === 'student' && (() => {
                                        const myAlloc = allocList.find(a => a.rollNo === verified.id && a.status === 'Active');
                                        const myFee   = feeList.find(f => f.rollNo === verified.id);
                                        const myRoom  = myAlloc ? roomList.find(r => r.roomNo === myAlloc.room && r.block === myAlloc.block) : null;
                                        return (
                                            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                                                {/* Room */}
                                                <div style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1px solid #bfdbfe', borderRadius:12, padding:'16px 18px' }}>
                                                    <div style={{ fontWeight:700, fontSize:'0.78rem', color:'#1e40af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>🏠 Room Details</div>
                                                    {myAlloc ? (
                                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                                                            {[['Room','Block '+myAlloc.block+' – '+myAlloc.room],['Floor','Floor '+myAlloc.floor],['Join Date',myAlloc.joinDate],['Checkout',myAlloc.checkoutDate],['Mess',myAlloc.messOpt],['Amenities',myRoom?myRoom.amenities.join(', '):'—']].map(([k,v])=>(
                                                                <div key={k}>
                                                                    <div style={{ fontSize:'0.7rem', color:'#60a5fa', fontWeight:600 }}>{k}</div>
                                                                    <div style={{ fontSize:'0.83rem', fontWeight:600, color:'#1e3a8a', marginTop:2 }}>{v}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : <div style={{ fontSize:'0.83rem', color:'#3b82f6' }}>No active room allocation found for your roll number.</div>}
                                                </div>
                                                {/* Fees */}
                                                <div style={{ background:'linear-gradient(135deg,#fefce8,#fef3c7)', border:'1px solid #fde68a', borderRadius:12, padding:'16px 18px' }}>
                                                    <div style={{ fontWeight:700, fontSize:'0.78rem', color:'#d97706', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>💰 Fee Status</div>
                                                    {myFee ? (
                                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                                                            {[['Period',myFee.period],['Total','₹'+myFee.amount.toLocaleString()],['Paid','₹'+myFee.paid.toLocaleString()],['Due',myFee.due>0?'₹'+myFee.due.toLocaleString():'—']].map(([k,v])=>(
                                                                <div key={k}>
                                                                    <div style={{ fontSize:'0.7rem', color:'#f59e0b', fontWeight:600 }}>{k}</div>
                                                                    <div style={{ fontSize:'0.83rem', fontWeight:600, color:'#92400e', marginTop:2 }}>{v}</div>
                                                                </div>
                                                            ))}
                                                            <div style={{ gridColumn:'1/-1' }}>
                                                                <span style={{ background:feeBg(myFee.status), color:feeColor(myFee.status), padding:'3px 12px', borderRadius:4, fontSize:'0.78rem', fontWeight:700 }}>{myFee.status}</span>
                                                            </div>
                                                        </div>
                                                    ) : <div style={{ fontSize:'0.83rem', color:'#d97706' }}>No fee records found for your roll number.</div>}
                                                </div>
                                                {/* Today's Mess */}
                                                {todayMenu && (
                                                    <div style={{ background:'linear-gradient(135deg,#f5f3ff,#ede9fe)', border:'1px solid #c4b5fd', borderRadius:12, padding:'16px 18px' }}>
                                                        <div style={{ fontWeight:700, fontSize:'0.78rem', color:'#7c3aed', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>🍽️ Today's Menu — {todayMenu.day}</div>
                                                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                                                            {[['Breakfast',todayMenu.breakfast],['Lunch',todayMenu.lunch],['Snacks',todayMenu.snacks],['Dinner',todayMenu.dinner]].map(([k,v])=>(
                                                                <div key={k}>
                                                                    <div style={{ fontSize:'0.7rem', color:'#a78bfa', fontWeight:600 }}>{k}</div>
                                                                    <div style={{ fontSize:'0.8rem', color:'#3b0764', marginTop:2, lineHeight:1.4 }}>{v}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                <div style={{ textAlign:'center', padding:'8px 0' }}>
                                                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Read-only view · Contact the hostel warden to make changes</span>
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        .hs-room-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:14px; }
        .hs-room-card { background:white; border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; box-shadow:var(--shadow-sm); transition:box-shadow 0.15s; }
        .hs-room-card:hover { box-shadow:var(--shadow-md); }

        /* Role cards */
        .hs-role-card { width:100%; padding:20px 16px; border-radius:14px; border:2px solid; cursor:pointer; text-align:center; transition:all 0.18s; font-family:var(--font-body); }
        .hs-role-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.1); }

        /* Modal */
        .em-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(3px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; }
        .em-modal { background:var(--bg-card,white); border:1px solid var(--border); border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.18); width:100%; overflow:hidden; animation:hsSlide 0.22s ease; }
        .em-modal-lg { max-height:90vh; overflow-y:auto; }
        @keyframes hsSlide { from{ opacity:0; transform:translateY(20px); } to{ opacity:1; transform:translateY(0); } }
        .em-modal-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--border); background:var(--bg-hover,#f8fafc); }
        .em-modal-body { padding:24px; }
        .em-close-btn { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--bg,white); cursor:pointer; color:var(--text-muted); display:flex; align-items:center; justify-content:center; transition:all 0.15s; flex-shrink:0; }
        .em-close-btn:hover { background:var(--bg-hover); color:var(--text-primary); }
        .em-alert-error { display:flex; align-items:center; gap:8px; background:#fef2f2; border:1px solid #fca5a5; color:#dc2626; border-radius:8px; padding:10px 14px; font-size:0.83rem; font-weight:500; margin-bottom:14px; }
        .sf-field { display:flex; flex-direction:column; margin-bottom:14px; }
        .sf-label { font-size:0.78rem; font-weight:600; color:var(--text-secondary); margin-bottom:5px; }
        .sf-input { padding:9px 12px; border:1.5px solid var(--border); border-radius:8px; font-size:0.875rem; color:var(--text-primary); background:var(--bg,white); font-family:var(--font-body); transition:border-color 0.15s; outline:none; width:100%; box-sizing:border-box; }
        .sf-input:focus { border-color:var(--primary,#1e40af); box-shadow:0 0 0 3px rgba(30,64,175,0.08); }
        .sf-input-err { border-color:#dc2626 !important; }
        .sf-error { font-size:0.72rem; color:#dc2626; margin-top:4px; font-weight:500; }

        [data-theme="dark"] .hs-sum-card,[data-theme="dark"] .hs-tabs,[data-theme="dark"] .hs-room-card { background:var(--bg-card) !important; }
        [data-theme="dark"] .em-modal { background:var(--bg-card) !important; }
        [data-theme="dark"] .em-modal-head { background:var(--bg-sidebar) !important; }
        [data-theme="dark"] .sf-input { background:var(--bg-card) !important; }
        @media(max-width:1100px){ .hs-room-grid{ grid-template-columns:repeat(3,1fr); } }
        @media(max-width:900px){ .hs-summary{ grid-template-columns:repeat(2,1fr); } .hs-room-grid{ grid-template-columns:repeat(2,1fr); } }
      `}</style>
        </div>
    );
}
