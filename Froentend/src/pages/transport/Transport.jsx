import { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import {
    Bus, MapPin, Navigation, Clock, Users, Fuel,
    AlertTriangle, CheckCircle2, Search, Download,
    Eye, Edit2, Trash2, Zap, Calendar, Plus,
    X, ShieldCheck, Lock, UserCircle, KeyRound,
} from 'lucide-react';

/* ── Credentials ── */
const MANAGER_CREDENTIALS = {
    'TM001': { password: 'mgr001', name: 'Mr. Vijay Kumar',  designation: 'Transport Manager'           },
    'TM002': { password: 'mgr002', name: 'Mrs. Sunita Rao',  designation: 'Asst. Transport Manager'     },
    'TM003': { password: 'mgr003', name: 'Mr. Prakash Nair', designation: 'Fleet Supervisor'            },
};

const STUDENT_CREDENTIALS = {
    'CS2024001': { password: 'stu001', name: 'Priya Sharma',  course: 'B.Sc CSE'   },
    'CS2024002': { password: 'stu002', name: 'Rohan Das',     course: 'B.Sc CSE'   },
    'CS2024003': { password: 'stu003', name: 'Ananya Patel',  course: 'B.Sc CSE'   },
    'EC2024001': { password: 'stu004', name: 'Suresh Kumar',  course: 'B.Tech ECE' },
    'CO2024001': { password: 'stu005', name: 'Meena Nayak',   course: 'B.Com Hons' },
    'MA2024001': { password: 'stu006', name: 'Deepa Singh',   course: 'M.Sc Maths' },
};

/* ── Empty forms ── */
const EMPTY_BUS  = { name:'', routeId:'', driver:'', phone:'', plate:'', capacity:45 };
const EMPTY_RT   = { name:'', stopsStr:'', distance:'', duration:'', status:'Active' };
const EMPTY_SCH  = { busId:'', routeId:'', departure:'', arrival:'', days:'Mon – Sat', type:'Morning' };

/* ── Initial Mock Data ── */
const INIT_BUSES = [
    { id:'BUS001', name:'Bus 01', routeId:'R001', route:'City Center Route', driver:'Ramesh Kumar',  phone:'9876543210', plate:'KA-01-AB-1234', capacity:45, passengers:32, status:'En Route',    speed:42, eta:'8 min',  fuel:78, lastUpdate:'2 min ago',  x:18, y:25 },
    { id:'BUS002', name:'Bus 02', routeId:'R002', route:'East Campus Route', driver:'Suresh Pillai', phone:'9876543211', plate:'KA-01-CD-5678', capacity:45, passengers:28, status:'At Stop',     speed:0,  eta:'At Stop', fuel:55, lastUpdate:'1 min ago',  x:65, y:27 },
    { id:'BUS003', name:'Bus 03', routeId:'R003', route:'South Township',    driver:'Mohan Das',     phone:'9876543212', plate:'KA-01-EF-9012', capacity:50, passengers:41, status:'En Route',    speed:38, eta:'15 min', fuel:62, lastUpdate:'3 min ago',  x:10, y:58 },
    { id:'BUS004', name:'Bus 04', routeId:'—',    route:'—',                driver:'Vijay Nair',    phone:'9876543213', plate:'KA-01-GH-3456', capacity:45, passengers:0,  status:'Parked',      speed:0,  eta:'—',     fuel:91, lastUpdate:'10 min ago', x:85, y:68 },
    { id:'BUS005', name:'Bus 05', routeId:'R001', route:'City Center Route', driver:'Anil Sharma',   phone:'9876543214', plate:'KA-01-IJ-7890', capacity:40, passengers:35, status:'En Route',    speed:45, eta:'5 min',  fuel:44, lastUpdate:'1 min ago',  x:46, y:56 },
    { id:'BUS006', name:'Bus 06', routeId:'—',    route:'—',                driver:'Prakash Rao',   phone:'9876543215', plate:'KA-01-KL-2345', capacity:45, passengers:0,  status:'Maintenance', speed:0,  eta:'—',     fuel:15, lastUpdate:'—',          x:25, y:60 },
];

const INIT_ROUTES = [
    { id:'R001', name:'City Center Route', stops:['City Center','Market Square','Hospital Gate','Railway Station','College Main Gate'],                                   distance:'12.4 km', duration:'35 min', buses:2, status:'Active'   },
    { id:'R002', name:'East Campus Route', stops:['East Colony','Sector 5','Park Gate','North Block','College Back Gate'],                                                distance:'8.7 km',  duration:'25 min', buses:1, status:'Active'   },
    { id:'R003', name:'South Township',    stops:['South Market','Gandhi Nagar','Civil Hospital','Sub-Registrar Office','Vishwanagar','College Main Gate'],               distance:'15.2 km', duration:'45 min', buses:1, status:'Active'   },
    { id:'R004', name:'North Hills Route', stops:['North Hills','Hilltop Colony','Deer Park','College North Gate'],                                                       distance:'10.1 km', duration:'30 min', buses:0, status:'Inactive' },
];

const INIT_SCHEDULE = [
    { id:'SC001', bus:'Bus 01', busId:'BUS001', routeId:'R001', route:'City Center Route', departure:'07:30', arrival:'08:05', days:'Mon – Sat', type:'Morning', status:'Active' },
    { id:'SC002', bus:'Bus 01', busId:'BUS001', routeId:'R001', route:'City Center Route', departure:'17:00', arrival:'17:35', days:'Mon – Sat', type:'Evening', status:'Active' },
    { id:'SC003', bus:'Bus 02', busId:'BUS002', routeId:'R002', route:'East Campus Route', departure:'07:45', arrival:'08:10', days:'Mon – Sat', type:'Morning', status:'Active' },
    { id:'SC004', bus:'Bus 02', busId:'BUS002', routeId:'R002', route:'East Campus Route', departure:'17:15', arrival:'17:40', days:'Mon – Sat', type:'Evening', status:'Active' },
    { id:'SC005', bus:'Bus 03', busId:'BUS003', routeId:'R003', route:'South Township',    departure:'07:00', arrival:'07:45', days:'Mon – Sat', type:'Morning', status:'Active' },
    { id:'SC006', bus:'Bus 03', busId:'BUS003', routeId:'R003', route:'South Township',    departure:'17:30', arrival:'18:15', days:'Mon – Sat', type:'Evening', status:'Active' },
    { id:'SC007', bus:'Bus 05', busId:'BUS005', routeId:'R001', route:'City Center Route', departure:'08:00', arrival:'08:35', days:'Mon – Sat', type:'Morning', status:'Active' },
    { id:'SC008', bus:'Bus 05', busId:'BUS005', routeId:'R001', route:'City Center Route', departure:'17:45', arrival:'18:20', days:'Mon – Sat', type:'Evening', status:'Active' },
];

const TABS = [
    { key:'tracking', label:'Live Tracking', icon:Navigation, color:'#1e40af' },
    { key:'routes',   label:'Routes',        icon:MapPin,     color:'#059669' },
    { key:'fleet',    label:'Bus Fleet',     icon:Bus,        color:'#7c3aed' },
    { key:'schedule', label:'Schedule',      icon:Calendar,   color:'#d97706' },
];

const statusColor = s => ({ 'En Route':'#1e40af','At Stop':'#059669','Parked':'#475569','Maintenance':'#dc2626' }[s]||'#475569');
const statusBg    = s => ({ 'En Route':'#dbeafe','At Stop':'#d1fae5','Parked':'#f1f5f9','Maintenance':'#fef2f2' }[s]||'#f1f5f9');

/* ── Form field helper ── */
const TF = ({ label, error, children }) => (
    <div className="sf-field">
        <label className="sf-label">{label}</label>
        {children}
        {error && <span className="sf-error">{error}</span>}
    </div>
);

export default function Transport() {
    const [tab,       setTab]       = useState('tracking');
    const [q,         setQ]         = useState('');
    const [activeBus, setActiveBus] = useState(null);

    /* ── Data lists ── */
    const [busList,  setBusList]  = useState(INIT_BUSES);
    const [routeList,setRouteList]= useState(INIT_ROUTES);
    const [schList,  setSchList]  = useState(INIT_SCHEDULE);

    /* ── Auth modal flow ── */
    const [step,     setStep]     = useState(null); // null|'role'|'verify'|'form'
    const [role,     setRole]     = useState(null); // 'manager'|'student'
    const [action,   setAction]   = useState(null); // 'bus'|'route'|'schedule'
    const [verified, setVerified] = useState(null);
    const [showPass, setShowPass] = useState(false);

    /* verify inputs */
    const [mVerify, setMVerify] = useState({ id:'', password:'', error:'' });
    const [sVerify, setSVerify] = useState({ rollNo:'', password:'', error:'' });

    /* forms */
    const [busForm, setBusForm]   = useState(EMPTY_BUS);
    const [rtForm,  setRtForm]    = useState(EMPTY_RT);
    const [schForm, setSchForm]   = useState(EMPTY_SCH);
    const [formErr, setFormErr]   = useState({});

    const filt = (arr, keys) =>
        arr.filter(r => !q || keys.some(k => String(r[k]).toLowerCase().includes(q.toLowerCase())));

    const activeCount = busList.filter(b => b.status==='En Route'||b.status==='At Stop').length;
    const totalPass   = busList.reduce((s,b) => s+b.passengers, 0);

    /* ── Modal helpers ── */
    const openModal = act => {
        setAction(act); setStep('role'); setRole(null); setVerified(null);
        setShowPass(false); setMVerify({id:'',password:'',error:''});
        setSVerify({rollNo:'',password:'',error:''}); setFormErr({});
    };
    const closeModal = () => {
        setStep(null); setRole(null); setAction(null); setVerified(null); setShowPass(false);
        setMVerify({id:'',password:'',error:''}); setSVerify({rollNo:'',password:'',error:''});
        setBusForm(EMPTY_BUS); setRtForm(EMPTY_RT); setSchForm(EMPTY_SCH); setFormErr({});
    };
    const selectRole = r => { setRole(r); setStep('verify'); setShowPass(false); };

    /* ── Manager verify ── */
    const handleManagerVerify = () => {
        const key = mVerify.id.trim().toUpperCase();
        const m   = MANAGER_CREDENTIALS[key];
        if (!m || m.password !== mVerify.password) {
            setMVerify(f=>({...f, error:'Invalid Manager ID or password. Please try again.'}));
            return;
        }
        setVerified({...m, id:key, role:'manager'});
        setStep('form');
    };

    /* ── Student verify ── */
    const handleStudentVerify = () => {
        const key = sVerify.rollNo.trim().toUpperCase();
        const s   = STUDENT_CREDENTIALS[key];
        if (!s || s.password !== sVerify.password) {
            setSVerify(f=>({...f, error:'Invalid roll number or password. Please try again.'}));
            return;
        }
        setVerified({...s, id:key, role:'student'});
        setStep('form');
    };

    /* ── Submit: Add Bus ── */
    const submitBus = () => {
        const e = {};
        if (!busForm.name.trim())   e.name   = 'Required';
        if (!busForm.driver.trim()) e.driver = 'Required';
        if (!busForm.plate.trim())  e.plate  = 'Required';
        if (busList.some(b=>b.plate===busForm.plate.trim().toUpperCase())) e.plate='Plate number already exists';
        if (Object.keys(e).length) { setFormErr(e); return; }
        const route = routeList.find(r=>r.id===busForm.routeId);
        setBusList(prev=>[...prev, {
            id: `BUS${String(prev.length+1).padStart(3,'0')}`,
            name: busForm.name.trim(),
            routeId: busForm.routeId||'—', route: route?.name||'—',
            driver: busForm.driver.trim(), phone: busForm.phone.trim(),
            plate: busForm.plate.trim().toUpperCase(),
            capacity: Number(busForm.capacity), passengers:0,
            status:'Parked', speed:0, eta:'—', fuel:100,
            lastUpdate:'Just added', x:50+Math.random()*30, y:50+Math.random()*30,
        }]);
        closeModal();
    };

    /* ── Submit: Add Route ── */
    const submitRoute = () => {
        const e = {};
        if (!rtForm.name.trim())     e.name     = 'Required';
        if (!rtForm.stopsStr.trim()) e.stopsStr = 'Add at least 2 stops';
        if (!rtForm.distance.trim()) e.distance = 'Required';
        if (!rtForm.duration.trim()) e.duration = 'Required';
        if (Object.keys(e).length) { setFormErr(e); return; }
        const stops = rtForm.stopsStr.split(',').map(s=>s.trim()).filter(Boolean);
        if (stops.length < 2) { setFormErr({stopsStr:'Minimum 2 stops required'}); return; }
        setRouteList(prev=>[...prev, {
            id: `R${String(prev.length+1).padStart(3,'0')}`,
            name: rtForm.name.trim(), stops,
            distance: rtForm.distance.trim(), duration: rtForm.duration.trim(),
            buses:0, status: rtForm.status,
        }]);
        closeModal();
    };

    /* ── Submit: Add Schedule ── */
    const submitSchedule = () => {
        const e = {};
        if (!schForm.busId)      e.busId    = 'Required';
        if (!schForm.routeId)    e.routeId  = 'Required';
        if (!schForm.departure)  e.departure= 'Required';
        if (!schForm.arrival)    e.arrival  = 'Required';
        if (Object.keys(e).length) { setFormErr(e); return; }
        const bus   = busList.find(b=>b.id===schForm.busId);
        const route = routeList.find(r=>r.id===schForm.routeId);
        setSchList(prev=>[...prev, {
            id: `SC${String(prev.length+1).padStart(3,'0')}`,
            bus: bus?.name||'—', busId: schForm.busId,
            routeId: schForm.routeId, route: route?.name||'—',
            departure: schForm.departure, arrival: schForm.arrival,
            days: schForm.days, type: schForm.type, status:'Active',
        }]);
        closeModal();
    };

    /* ── Btn label ── */
    const btnLabel = t => t==='tracking'?'Add Bus':t==='routes'?'Add Route':t==='fleet'?'Add Vehicle':'Add Schedule';

    const TS = {
        heroGrid:   { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 },
        heroCard:   { borderRadius:16, padding:'20px 22px', position:'relative', overflow:'hidden', color:'white', minHeight:110 },
        heroTop:    { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 },
        heroIcon:   { width:40, height:40, borderRadius:10, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
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
            <Navbar title="Transport Management" subtitle="Real-time bus tracking and route management" />

            {/* ── Hero KPI Cards ── */}
            <div style={TS.heroGrid}>
                {[
                    { label:'Total Buses',       value:busList.length,  gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  icon:Bus,       sub:`${activeCount} currently active` },
                    { label:'Active Buses',      value:activeCount,     gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(5,150,105,0.28)',  icon:Navigation,sub:'En route or at stop' },
                    { label:'Total Routes',      value:routeList.length,gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.28)', icon:MapPin,    sub:`${routeList.filter(r=>r.status==='Active').length} active routes` },
                    { label:'Students On Board', value:totalPass,       gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', icon:Users,     sub:'across all active buses' },
                ].map(({ label, value, gradient, glow, icon:Icon, sub })=>(
                    <div key={label} style={{ ...TS.heroCard, background:gradient, boxShadow:`0 8px 24px ${glow}` }}>
                        <div style={TS.heroTop}>
                            <div style={TS.heroIcon}><Icon size={20} strokeWidth={2} color="white"/></div>
                            <div style={TS.heroVal}>{value}</div>
                        </div>
                        <div style={TS.heroLbl}>{label}</div>
                        <div style={TS.heroSub}>{sub}</div>
                        <div style={TS.heroShine}/>
                    </div>
                ))}
            </div>

            {/* ── Tab Bar + Toolbar ── */}
            <div style={TS.tabRow}>
                <div style={TS.tabBar}>
                    {TABS.map(({ key, label, icon:Icon })=>{
                        const active = tab===key;
                        return (
                            <button key={key} style={{ ...TS.tab, ...(active?TS.tabActive:{}) }}
                                onClick={()=>{ setTab(key); setQ(''); setActiveBus(null); }}>
                                <Icon size={15} strokeWidth={active?2.5:2}/>{label}
                                {active && <span style={TS.tabDot}/>}
                            </button>
                        );
                    })}
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <div style={TS.searchWrap}>
                        <Search size={14} color="var(--text-muted)"/>
                        <input style={TS.searchInput} placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/>
                        {q && <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2, display:'flex' }} onClick={()=>setQ('')}><X size={12}/></button>}
                    </div>
                    <button className="btn btn-secondary btn-sm"><Download size={13}/> Export</button>
                    <button className="btn btn-primary btn-sm" onClick={()=>openModal(tab==='routes'?'route':tab==='schedule'?'schedule':'bus')}>
                        <Plus size={13}/> {btnLabel(tab)}
                    </button>
                </div>
            </div>

            {/* ══════════ LIVE TRACKING TAB ══════════ */}
            {tab==='tracking' && (()=>{
                const buses = filt(busList, ['name','driver','route','status','plate']);
                return (
                    <>
                        <div className="card" style={{ marginBottom:16, padding:0, overflow:'hidden' }}>
                            <div className="tr-map-header">
                                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                    <div className="tr-live-dot"/>
                                    <span style={{ fontSize:'0.83rem', fontWeight:700, color:'var(--text-primary)' }}>Live GPS Tracking</span>
                                </div>
                                <div style={{ display:'flex', gap:12 }}>
                                    {[['En Route','#1e40af'],['At Stop','#059669'],['Parked','#475569'],['Maintenance','#dc2626']].map(([s,c])=>(
                                        <div key={s} style={{ display:'flex', alignItems:'center', gap:5 }}>
                                            <div style={{ width:8, height:8, borderRadius:'50%', background:c }}/><span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{s}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="tr-map">
                                <div className="tr-road tr-road-h" style={{ top:'30%' }}/>
                                <div className="tr-road tr-road-h" style={{ top:'62%' }}/>
                                <div className="tr-road tr-road-v" style={{ left:'28%' }}/>
                                <div className="tr-road tr-road-v" style={{ left:'68%' }}/>
                                <div style={{ position:'absolute', left:'68%', top:'30%', transform:'translate(-50%,-50%)', zIndex:3 }}>
                                    <div style={{ background:'#1e40af', color:'white', borderRadius:6, padding:'3px 8px', fontSize:'0.62rem', fontWeight:700, whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(30,64,175,0.35)' }}>🏫 College</div>
                                </div>
                                <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
                                    <polyline points="5,95 18,72 28,62 46,56 68,30" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="6,3" strokeOpacity="0.6"/>
                                    <polyline points="95,15 65,27 68,50 68,30" fill="none" stroke="#059669" strokeWidth="2.5" strokeDasharray="6,3" strokeOpacity="0.6"/>
                                    <polyline points="5,98 10,58 28,62 45,70 68,80 68,30" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeDasharray="6,3" strokeOpacity="0.6"/>
                                </svg>
                                {busList.map(bus=>(
                                    <div key={bus.id} className={`tr-bus-marker ${activeBus===bus.id?'tr-bus-marker--active':''}`}
                                        style={{ left:`${bus.x}%`, top:`${bus.y}%` }}
                                        onClick={()=>setActiveBus(activeBus===bus.id?null:bus.id)}>
                                        <div className="tr-bus-ping" style={{ background:statusColor(bus.status) }}/>
                                        <div className="tr-bus-icon" style={{ background:statusColor(bus.status) }}><Bus size={11} color="white"/></div>
                                        <div className="tr-bus-label">{bus.name}</div>
                                        {activeBus===bus.id&&(
                                            <div className="tr-bus-popup">
                                                <div style={{ fontWeight:700, fontSize:'0.78rem', color:'var(--text-primary)', marginBottom:4 }}>{bus.name} · {bus.plate}</div>
                                                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', lineHeight:1.6 }}>
                                                    <div>👤 {bus.driver}</div>
                                                    <div>🚦 {bus.status} · {bus.speed>0?`${bus.speed} km/h`:'Stopped'}</div>
                                                    <div>👥 {bus.passengers}/{bus.capacity} passengers</div>
                                                    <div>⏱ ETA: {bus.eta}</div>
                                                    <div>⛽ Fuel: {bus.fuel}%</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="tr-bus-grid">
                            {buses.map(bus=>{
                                const sCol = statusColor(bus.status);
                                const sBg  = statusBg(bus.status);
                                const passPct = bus.capacity>0 ? Math.round((bus.passengers/bus.capacity)*100) : 0;
                                const STATUS_BDR = { 'En Route':'#93c5fd','At Stop':'#6ee7b7','Parked':'#cbd5e1','Maintenance':'#fca5a5' };
                                const sBdr = STATUS_BDR[bus.status]||'#cbd5e1';
                                return (
                                <div key={bus.id} className={`tr-bus-card ${activeBus===bus.id?'tr-bus-card--sel':''}`}
                                    onClick={()=>setActiveBus(activeBus===bus.id?null:bus.id)}
                                    style={{ borderLeft:`4px solid ${sCol}` }}>
                                    {/* Card header */}
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                                            <div style={{ width:36, height:36, borderRadius:9, background:`linear-gradient(135deg,${sCol}cc,${sCol})`, display:'grid', placeItems:'center', boxShadow:`0 3px 10px ${sCol}44` }}>
                                                <Bus size={17} color="white"/>
                                            </div>
                                            <div>
                                                <div style={{ fontWeight:800, fontSize:'0.875rem', color:'var(--text-primary)' }}>{bus.name}</div>
                                                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'monospace', marginTop:1 }}>{bus.plate}</div>
                                            </div>
                                        </div>
                                        <span style={{ background:sBg, color:sCol, border:`1px solid ${sBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.71rem', fontWeight:700 }}>{bus.status}</span>
                                    </div>
                                    {/* Stats grid */}
                                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
                                        {/* Passengers */}
                                        <div style={{ background:'var(--bg-hover)', borderRadius:8, padding:'7px 10px' }}>
                                            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}><Users size={11} color="var(--text-muted)"/><span style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:600 }}>Passengers</span></div>
                                            <div style={{ fontWeight:800, fontSize:'0.85rem', color:'var(--text-primary)' }}>{bus.passengers}<span style={{ fontWeight:400, color:'var(--text-muted)', fontSize:'0.75rem' }}>/{bus.capacity}</span></div>
                                            <div style={{ height:4, background:'#e2e8f0', borderRadius:99, overflow:'hidden', marginTop:4 }}><div style={{ width:`${passPct}%`, height:'100%', background:'linear-gradient(90deg,#1e3a8a,#2563eb)', borderRadius:99 }}/></div>
                                        </div>
                                        {/* Speed */}
                                        <div style={{ background:'var(--bg-hover)', borderRadius:8, padding:'7px 10px' }}>
                                            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}><Zap size={11} color="var(--text-muted)"/><span style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:600 }}>Speed</span></div>
                                            <div style={{ fontWeight:800, fontSize:'0.85rem', color:bus.speed>0?'#1e40af':'var(--text-muted)' }}>{bus.speed>0?`${bus.speed} km/h`:'Stopped'}</div>
                                        </div>
                                        {/* ETA */}
                                        <div style={{ background:'var(--bg-hover)', borderRadius:8, padding:'7px 10px' }}>
                                            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}><Clock size={11} color="var(--text-muted)"/><span style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontWeight:600 }}>ETA</span></div>
                                            <div style={{ fontWeight:800, fontSize:'0.85rem', color:'var(--text-primary)' }}>{bus.eta}</div>
                                        </div>
                                        {/* Fuel */}
                                        <div style={{ background:bus.fuel<25?'#fef2f2':'var(--bg-hover)', borderRadius:8, padding:'7px 10px', border:bus.fuel<25?'1px solid #fca5a5':'none' }}>
                                            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:3 }}><Fuel size={11} color={bus.fuel<25?'#dc2626':'var(--text-muted)'}/><span style={{ fontSize:'0.68rem', color:bus.fuel<25?'#dc2626':'var(--text-muted)', fontWeight:600 }}>Fuel</span></div>
                                            <div style={{ fontWeight:800, fontSize:'0.85rem', color:bus.fuel<25?'#dc2626':bus.fuel<50?'#d97706':'#059669' }}>{bus.fuel}%</div>
                                            <div style={{ height:4, background:'#e2e8f0', borderRadius:99, overflow:'hidden', marginTop:4 }}><div style={{ width:`${bus.fuel}%`, height:'100%', background:bus.fuel<25?'#dc2626':bus.fuel<50?'linear-gradient(90deg,#92400e,#d97706)':'linear-gradient(90deg,#065f46,#059669)', borderRadius:99 }}/></div>
                                        </div>
                                    </div>
                                    {/* Footer */}
                                    <div style={{ marginTop:10, paddingTop:8, borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                                            <div style={{ width:22, height:22, borderRadius:'50%', background:'#f1f5f9', display:'grid', placeItems:'center' }}><UserCircle size={13} color="#64748b"/></div>
                                            <span style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontWeight:500 }}>{bus.driver}</span>
                                        </div>
                                        <span style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{bus.lastUpdate}</span>
                                    </div>
                                    {bus.fuel<25&&<div style={{ display:'flex', alignItems:'center', gap:6, background:'#fef2f2', border:'1px solid #fca5a5', borderRadius:7, padding:'6px 10px', marginTop:8 }}><AlertTriangle size={12} color="#dc2626"/><span style={{ fontSize:'0.72rem', color:'#dc2626', fontWeight:700 }}>Low fuel — refuel needed</span></div>}
                                </div>
                                );
                            })}
                        </div>
                    </>
                );
            })()}

            {/* ══════════ ROUTES TAB ══════════ */}
            {tab==='routes'&&(()=>{
                const data = filt(routeList, ['name','status']);
                return (
                    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                        {data.map(route=>{
                            const isActive = route.status==='Active';
                            const rtGrad = isActive?'linear-gradient(135deg,#065f46,#059669)':'linear-gradient(135deg,#475569,#64748b)';
                            const rtGlow = isActive?'rgba(5,150,105,0.2)':'rgba(71,85,105,0.1)';
                            return (
                            <div key={route.id} className="card" style={{ padding:0, overflow:'hidden', borderTop:`3px solid ${isActive?'#059669':'#94a3b8'}` }}>
                                {/* Header */}
                                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 22px', borderBottom:'1px solid var(--border)', background:'var(--bg-hover)' }}>
                                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                                        <div style={{ width:40, height:40, borderRadius:10, background:rtGrad, display:'grid', placeItems:'center', boxShadow:`0 4px 12px ${rtGlow}` }}>
                                            <MapPin size={18} color="white"/>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text-primary)' }}>{route.name}</div>
                                            <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:3, display:'flex', gap:8 }}>
                                                <span style={{ background:'#f1f5f9', padding:'1px 7px', borderRadius:4, fontFamily:'monospace' }}>{route.id}</span>
                                                <span>📏 {route.distance}</span>
                                                <span>⏱ {route.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                        <span style={{ background:'#dbeafe', color:'#1e40af', border:'1px solid #93c5fd', padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700 }}>
                                            {route.buses} bus{route.buses!==1?'es':''}
                                        </span>
                                        <span style={{ background:isActive?'#d1fae5':'#f1f5f9', color:isActive?'#065f46':'#94a3b8', border:`1px solid ${isActive?'#6ee7b7':'#cbd5e1'}`, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700 }}>
                                            {route.status}
                                        </span>
                                        <button className="tbl-btn"><Edit2 size={13}/></button>
                                        <button className="tbl-btn danger" onClick={()=>setRouteList(p=>p.filter(x=>x.id!==route.id))}><Trash2 size={13}/></button>
                                    </div>
                                </div>
                                {/* Stops */}
                                <div style={{ padding:'16px 22px', display:'flex', alignItems:'flex-start', gap:0, flexWrap:'wrap' }}>
                                    {route.stops.map((stop,i)=>(
                                        <div key={i} style={{ display:'flex', alignItems:'center' }}>
                                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                                                <div style={{ width:28, height:28, borderRadius:'50%', background:i===0?'linear-gradient(135deg,#1e3a8a,#2563eb)':i===route.stops.length-1?'linear-gradient(135deg,#065f46,#059669)':'white', color:i===0||i===route.stops.length-1?'white':'#64748b', display:'grid', placeItems:'center', fontSize:'0.63rem', fontWeight:800, border:i>0&&i<route.stops.length-1?'2px solid #cbd5e1':'none', boxShadow:i===0||i===route.stops.length-1?'0 2px 8px rgba(0,0,0,0.15)':'none' }}>
                                                    {i===0?'S':i===route.stops.length-1?'E':i}
                                                </div>
                                                <span style={{ fontSize:'0.65rem', color:'var(--text-muted)', textAlign:'center', maxWidth:72, lineHeight:1.3 }}>{stop}</span>
                                            </div>
                                            {i<route.stops.length-1&&<div style={{ width:30, height:2, background:'linear-gradient(90deg,#cbd5e1,#94a3b8)', margin:'0 3px', marginBottom:22, flexShrink:0, borderRadius:99 }}/>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            );
                        })}
                        {data.length===0&&<div className="empty-state"><div className="empty-icon">🗺️</div><p>No routes found.</p></div>}
                    </div>
                );
            })()}

            {/* ══════════ FLEET TAB ══════════ */}
            {tab==='fleet'&&(()=>{
                const data = filt(busList, ['name','driver','plate','route','status']);
                return (
                    <div className="card">
                        <div className="card-header"><div><h2>Bus Fleet <span className="count-pill">{data.length}</span></h2><p>All registered vehicles, drivers and operational status</p></div></div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead><tr><th>Bus</th><th>Driver</th><th>Route</th><th>Capacity</th><th>Fuel</th><th>Status</th><th style={{ textAlign:'right' }}>Actions</th></tr></thead>
                                <tbody>
                                    {data.map(bus=>{
                                        const sCol = statusColor(bus.status);
                                        const sBg  = statusBg(bus.status);
                                        const STATUS_BDR = { 'En Route':'#93c5fd','At Stop':'#6ee7b7','Parked':'#cbd5e1','Maintenance':'#fca5a5' };
                                        const sBdr = STATUS_BDR[bus.status]||'#cbd5e1';
                                        const passPct = bus.capacity>0 ? Math.round((bus.passengers/bus.capacity)*100) : 0;
                                        const fuelCol = bus.fuel<25?'#dc2626':bus.fuel<50?'#d97706':'#059669';
                                        const fuelGrad = bus.fuel<25?'linear-gradient(90deg,#991b1b,#dc2626)':bus.fuel<50?'linear-gradient(90deg,#92400e,#d97706)':'linear-gradient(90deg,#065f46,#059669)';
                                        return (
                                        <tr key={bus.id}>
                                            <td>
                                                <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                                                    <div style={{ width:34, height:34, borderRadius:8, background:`linear-gradient(135deg,${sCol}cc,${sCol})`, display:'grid', placeItems:'center', flexShrink:0 }}>
                                                        <Bus size={15} color="white"/>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight:700, fontSize:'0.875rem', color:'var(--text-primary)' }}>{bus.name}</div>
                                                        <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'monospace', marginTop:1 }}>{bus.plate}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize:'0.83rem', fontWeight:600, color:'var(--text-primary)' }}>{bus.driver}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{bus.phone}</div>
                                            </td>
                                            <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{bus.route}</td>
                                            <td style={{ minWidth:100 }}>
                                                <div style={{ fontSize:'0.83rem', fontWeight:700, marginBottom:4 }}>{bus.passengers}<span style={{ fontWeight:400, color:'var(--text-muted)', fontSize:'0.75rem' }}>/{bus.capacity}</span></div>
                                                <div style={{ width:68, height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                    <div style={{ width:`${passPct}%`, height:'100%', background:'linear-gradient(90deg,#1e3a8a,#2563eb)', borderRadius:99 }}/>
                                                </div>
                                            </td>
                                            <td style={{ minWidth:100 }}>
                                                <div style={{ fontSize:'0.83rem', fontWeight:700, color:fuelCol, marginBottom:4 }}>{bus.fuel}%</div>
                                                <div style={{ width:68, height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                    <div style={{ width:`${bus.fuel}%`, height:'100%', background:fuelGrad, borderRadius:99 }}/>
                                                </div>
                                            </td>
                                            <td><span style={{ background:sBg, color:sCol, border:`1px solid ${sBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700 }}>{bus.status}</span></td>
                                            <td>
                                                <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                    <button className="tbl-btn"><Eye size={13}/></button>
                                                    <button className="tbl-btn"><Edit2 size={13}/></button>
                                                    <button className="tbl-btn danger" onClick={()=>setBusList(p=>p.filter(x=>x.id!==bus.id))}><Trash2 size={13}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ SCHEDULE TAB ══════════ */}
            {tab==='schedule'&&(()=>{
                const data  = filt(schList, ['bus','route','type']);
                const morn  = data.filter(s=>s.type==='Morning');
                const eve   = data.filter(s=>s.type==='Evening');
                return (
                    <>
                        {[
                            { label:'Morning', rows:morn, gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.22)', color:'#1e40af', bg:'#dbeafe', bdr:'#93c5fd', desc:'Departure from pick-up points to college', emoji:'🌅' },
                            { label:'Evening', rows:eve,  gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.22)', color:'#d97706', bg:'#fef3c7', bdr:'#fbbf24', desc:'Return trips from college to pick-up points', emoji:'🌆' },
                        ].map(({ label, rows, gradient, glow, color, bg, bdr, desc, emoji })=>(
                            <div key={label} className="card" style={{ marginBottom:16 }}>
                                <div className="card-header">
                                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                                        <div style={{ width:40, height:40, borderRadius:10, background:gradient, display:'grid', placeItems:'center', boxShadow:`0 4px 12px ${glow}` }}>
                                            <Clock size={18} color="white"/>
                                        </div>
                                        <div>
                                            <h2>{emoji} {label} Schedule <span className="count-pill">{rows.length}</span></h2>
                                            <p>{desc}</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ overflowX:'auto' }}>
                                    <table>
                                        <thead><tr><th>Bus</th><th>Route</th><th>Departure</th><th>Arrival</th><th>Days</th><th>Status</th><th style={{ textAlign:'right' }}>Actions</th></tr></thead>
                                        <tbody>
                                            {rows.map(s=>(
                                                <tr key={s.id}>
                                                    <td>
                                                        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                                                            <div style={{ width:28, height:28, borderRadius:7, background:gradient, display:'grid', placeItems:'center' }}><Bus size={13} color="white"/></div>
                                                            <span style={{ fontWeight:700, fontSize:'0.83rem', color:'var(--text-primary)' }}>{s.bus}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize:'0.83rem', color:'var(--text-secondary)' }}>{s.route}</td>
                                                    <td>
                                                        <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:bg, color, border:`1px solid ${bdr}`, padding:'4px 11px', borderRadius:8, fontWeight:800, fontFamily:'monospace', fontSize:'0.88rem' }}>
                                                            {s.departure}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontWeight:800, fontFamily:'monospace', fontSize:'0.88rem', color:'var(--text-primary)' }}>{s.arrival}</span>
                                                    </td>
                                                    <td><span style={{ background:'#f1f5f9', color:'var(--text-secondary)', padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:600, border:'1px solid var(--border)' }}>{s.days}</span></td>
                                                    <td><span style={{ background:'#d1fae5', color:'#065f46', border:'1px solid #6ee7b7', padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700 }}>{s.status}</span></td>
                                                    <td>
                                                        <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                            <button className="tbl-btn"><Edit2 size={13}/></button>
                                                            <button className="tbl-btn danger" onClick={()=>setSchList(p=>p.filter(x=>x.id!==s.id))}><Trash2 size={13}/></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {rows.length===0&&<div className="empty-state"><div className="empty-icon">🕐</div><p>No {label.toLowerCase()} schedules found.</p></div>}
                                </div>
                            </div>
                        ))}
                    </>
                );
            })()}

            {/* ══════════ MODAL FLOW ══════════ */}
            {step&&(
                <div className="em-overlay" onClick={closeModal}>
                    <div className={`em-modal ${step!=='role'?'em-modal-lg':''}`}
                        style={{ maxWidth:step==='role'?500:step==='verify'?420:580 }}
                        onClick={e=>e.stopPropagation()}>

                        {/* ── STEP 1: Role Selector ── */}
                        {step==='role'&&(
                            <>
                                <div className="em-modal-head">
                                    <div>
                                        <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>Select Your Role</h3>
                                        <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>
                                            {action==='bus'?'Add a new bus to the fleet':action==='route'?'Add a new bus route':action==='schedule'?'Add bus timing / schedule':'Manage transport'}
                                        </p>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16}/></button>
                                </div>
                                <div className="em-modal-body">
                                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                                        <button type="button" className="tr-role-card" onClick={()=>selectRole('manager')}
                                            style={{ borderColor:'#1e40af', background:'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                                            <div style={{ width:52, height:52, borderRadius:14, background:'#1e40af', display:'grid', placeItems:'center', margin:'0 auto 12px' }}>
                                                <KeyRound size={26} color="white"/>
                                            </div>
                                            <div style={{ fontWeight:800, fontSize:'1rem', color:'#1e3a8a', marginBottom:5 }}>Transport Manager</div>
                                            <div style={{ fontSize:'0.75rem', color:'#1d4ed8', lineHeight:1.4 }}>Add & edit buses, routes and timings</div>
                                        </button>
                                        <button type="button" className="tr-role-card" onClick={()=>selectRole('student')}
                                            style={{ borderColor:'#059669', background:'linear-gradient(135deg,#f0fdf4,#d1fae5)' }}>
                                            <div style={{ width:52, height:52, borderRadius:14, background:'#059669', display:'grid', placeItems:'center', margin:'0 auto 12px' }}>
                                                <UserCircle size={26} color="white"/>
                                            </div>
                                            <div style={{ fontWeight:800, fontSize:'1rem', color:'#065f46', marginBottom:5 }}>Student</div>
                                            <div style={{ fontSize:'0.75rem', color:'#047857', lineHeight:1.4 }}>View bus routes, timings & schedules</div>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── STEP 2: Verify ── */}
                        {step==='verify'&&(
                            <>
                                <div className="em-modal-head">
                                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                                        <div style={{ width:44, height:44, borderRadius:12, background:role==='manager'?'linear-gradient(135deg,#1e40af,#3b82f6)':'linear-gradient(135deg,#059669,#34d399)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                            <ShieldCheck size={22} color="white"/>
                                        </div>
                                        <div>
                                            <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>{role==='manager'?'Manager':'Student'} Verification</h3>
                                            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>Enter your credentials to continue</p>
                                        </div>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16}/></button>
                                </div>
                                <div className="em-modal-body">
                                    {role==='manager'?(
                                        <>
                                            {mVerify.error&&<div className="em-alert-error"><AlertTriangle size={14}/> {mVerify.error}</div>}
                                            <div className="sf-field">
                                                <label className="sf-label">Transport Manager ID</label>
                                                <input className="sf-input" placeholder="e.g. TM001" value={mVerify.id} onChange={e=>setMVerify(f=>({...f,id:e.target.value,error:''}))} onKeyDown={e=>e.key==='Enter'&&handleManagerVerify()} autoFocus style={{ textTransform:'uppercase', fontFamily:'monospace' }}/>
                                            </div>
                                            <div className="sf-field" style={{ marginTop:14 }}>
                                                <label className="sf-label">Password</label>
                                                <div style={{ position:'relative' }}>
                                                    <input className="sf-input" type={showPass?'text':'password'} placeholder="Enter your password" value={mVerify.password} onChange={e=>setMVerify(f=>({...f,password:e.target.value,error:''}))} onKeyDown={e=>e.key==='Enter'&&handleManagerVerify()} style={{ paddingRight:40 }}/>
                                                    <button type="button" onClick={()=>setShowPass(v=>!v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><Lock size={14}/></button>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', alignItems:'flex-start', gap:9, background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:8, padding:'10px 14px', marginTop:16 }}>
                                                <Bus size={14} style={{ color:'#0284c7', marginTop:1, flexShrink:0 }}/>
                                                <p style={{ margin:0, fontSize:'0.75rem', color:'#0369a1', lineHeight:1.5 }}>Use your <strong>Manager ID</strong> (TM001–TM003) and assigned password (<strong>mgr</strong> + 3-digit ID, e.g. <strong>mgr001</strong>). Contact the administration if you need help.</p>
                                            </div>
                                            <button className="btn btn-primary" style={{ width:'100%', marginTop:20 }} onClick={handleManagerVerify}><ShieldCheck size={15}/> Verify & Continue</button>
                                        </>
                                    ):(
                                        <>
                                            {sVerify.error&&<div className="em-alert-error"><AlertTriangle size={14}/> {sVerify.error}</div>}
                                            <div className="sf-field">
                                                <label className="sf-label">Roll Number</label>
                                                <input className="sf-input" placeholder="e.g. CS2024001" value={sVerify.rollNo} onChange={e=>setSVerify(f=>({...f,rollNo:e.target.value,error:''}))} onKeyDown={e=>e.key==='Enter'&&handleStudentVerify()} autoFocus style={{ textTransform:'uppercase', fontFamily:'monospace' }}/>
                                            </div>
                                            <div className="sf-field" style={{ marginTop:14 }}>
                                                <label className="sf-label">Password</label>
                                                <div style={{ position:'relative' }}>
                                                    <input className="sf-input" type={showPass?'text':'password'} placeholder="Enter your password" value={sVerify.password} onChange={e=>setSVerify(f=>({...f,password:e.target.value,error:''}))} onKeyDown={e=>e.key==='Enter'&&handleStudentVerify()} style={{ paddingRight:40 }}/>
                                                    <button type="button" onClick={()=>setShowPass(v=>!v)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:4 }}><Lock size={14}/></button>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', alignItems:'flex-start', gap:9, background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:8, padding:'10px 14px', marginTop:16 }}>
                                                <Bus size={14} style={{ color:'#059669', marginTop:1, flexShrink:0 }}/>
                                                <p style={{ margin:0, fontSize:'0.75rem', color:'#047857', lineHeight:1.5 }}>Use your <strong>Roll Number</strong> and password issued by the institution (format: <strong>stu</strong> + 3 digits, e.g. <strong>stu001</strong>).</p>
                                            </div>
                                            <button className="btn btn-primary" style={{ width:'100%', marginTop:20, background:'#059669', borderColor:'#059669' }} onClick={handleStudentVerify}><ShieldCheck size={15}/> Verify & View</button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {/* ── STEP 3: Forms / Student View ── */}
                        {step==='form'&&verified&&(
                            <>
                                <div className="em-modal-head">
                                    <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                                        <div style={{ width:44, height:44, borderRadius:12, background:verified.role==='manager'?'linear-gradient(135deg,#1e40af,#3b82f6)':'linear-gradient(135deg,#059669,#34d399)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                            {verified.role==='manager'?<KeyRound size={22} color="white"/>:<Bus size={22} color="white"/>}
                                        </div>
                                        <div>
                                            <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'var(--text-primary)' }}>
                                                {verified.role==='manager'
                                                    ?(action==='bus'?'Add New Bus':action==='route'?'Add New Route':'Add Schedule')
                                                    :'Bus Routes & Schedule'}
                                            </h3>
                                            <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)', marginTop:2 }}>{verified.name} · {verified.role==='manager'?verified.designation:verified.course}</p>
                                        </div>
                                    </div>
                                    <button className="em-close-btn" onClick={closeModal}><X size={16}/></button>
                                </div>
                                <div className="em-modal-body">
                                    {/* Verified banner */}
                                    <div style={{ display:'flex', alignItems:'center', gap:10, background:verified.role==='manager'?'#dbeafe':'#d1fae5', border:`1px solid ${verified.role==='manager'?'#93c5fd':'#6ee7b7'}`, borderRadius:10, padding:'10px 16px', marginBottom:20 }}>
                                        <CheckCircle2 size={18} style={{ color:verified.role==='manager'?'#1e40af':'#059669', flexShrink:0 }}/>
                                        <div>
                                            <div style={{ fontSize:'0.83rem', fontWeight:700, color:verified.role==='manager'?'#1e3a8a':'#065f46' }}>{verified.name}</div>
                                            <div style={{ fontSize:'0.72rem', color:verified.role==='manager'?'#1d4ed8':'#047857' }}>{verified.id} · {verified.role==='manager'?verified.designation:verified.course}</div>
                                        </div>
                                    </div>

                                    {/* ── MANAGER: Add Bus ── */}
                                    {verified.role==='manager'&&action==='bus'&&(
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <TF label={<>Bus Name <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.name}>
                                                    <input className={`sf-input ${formErr.name?'sf-input-err':''}`} placeholder="e.g. Bus 07" value={busForm.name} onChange={e=>{setBusForm(f=>({...f,name:e.target.value}));setFormErr(x=>({...x,name:''}));}}/>
                                                </TF>
                                                <TF label="Assign Route">
                                                    <select className="sf-input" value={busForm.routeId} onChange={e=>setBusForm(f=>({...f,routeId:e.target.value}))}>
                                                        <option value="">No route (Parked)</option>
                                                        {routeList.filter(r=>r.status==='Active').map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                                                    </select>
                                                </TF>
                                                <TF label={<>Driver Name <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.driver}>
                                                    <input className={`sf-input ${formErr.driver?'sf-input-err':''}`} placeholder="e.g. Suresh Kumar" value={busForm.driver} onChange={e=>{setBusForm(f=>({...f,driver:e.target.value}));setFormErr(x=>({...x,driver:''}));}}/>
                                                </TF>
                                                <TF label="Driver Phone">
                                                    <input className="sf-input" placeholder="10-digit number" value={busForm.phone} onChange={e=>setBusForm(f=>({...f,phone:e.target.value}))} type="tel"/>
                                                </TF>
                                                <TF label={<>Number Plate <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.plate}>
                                                    <input className={`sf-input ${formErr.plate?'sf-input-err':''}`} placeholder="e.g. KA-01-MN-1234" value={busForm.plate} onChange={e=>{setBusForm(f=>({...f,plate:e.target.value}));setFormErr(x=>({...x,plate:''}));}} style={{ textTransform:'uppercase' }}/>
                                                </TF>
                                                <TF label="Seating Capacity">
                                                    <input type="number" min="10" max="60" className="sf-input" value={busForm.capacity} onChange={e=>setBusForm(f=>({...f,capacity:e.target.value}))}/>
                                                </TF>
                                            </div>
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" onClick={submitBus}><Bus size={14}/> Add Bus</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── MANAGER: Add Route ── */}
                                    {verified.role==='manager'&&action==='route'&&(
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <TF label={<>Route Name <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.name}>
                                                        <input className={`sf-input ${formErr.name?'sf-input-err':''}`} placeholder="e.g. West Colony Route" value={rtForm.name} onChange={e=>{setRtForm(f=>({...f,name:e.target.value}));setFormErr(x=>({...x,name:''}));}}/>
                                                    </TF>
                                                </div>
                                                <div style={{ gridColumn:'1/-1' }}>
                                                    <TF label={<>Stops (comma-separated) <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.stopsStr}>
                                                        <textarea className={`sf-input ${formErr.stopsStr?'sf-input-err':''}`} rows={2} placeholder="e.g. West Colony, Bus Stand, Hospital, Park Gate, College Main Gate" value={rtForm.stopsStr} onChange={e=>{setRtForm(f=>({...f,stopsStr:e.target.value}));setFormErr(x=>({...x,stopsStr:''}));}} style={{ resize:'vertical' }}/>
                                                    </TF>
                                                </div>
                                                <TF label={<>Distance <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.distance}>
                                                    <input className={`sf-input ${formErr.distance?'sf-input-err':''}`} placeholder="e.g. 11.2 km" value={rtForm.distance} onChange={e=>{setRtForm(f=>({...f,distance:e.target.value}));setFormErr(x=>({...x,distance:''}));}}/>
                                                </TF>
                                                <TF label={<>Duration <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.duration}>
                                                    <input className={`sf-input ${formErr.duration?'sf-input-err':''}`} placeholder="e.g. 30 min" value={rtForm.duration} onChange={e=>{setRtForm(f=>({...f,duration:e.target.value}));setFormErr(x=>({...x,duration:''}));}}/>
                                                </TF>
                                                <TF label="Status">
                                                    <div style={{ display:'flex', gap:10, marginTop:6 }}>
                                                        {['Active','Inactive'].map(s=>(
                                                            <button key={s} type="button" onClick={()=>setRtForm(f=>({...f,status:s}))} style={{ flex:1, padding:'9px 0', borderRadius:8, border:`2px solid ${rtForm.status===s?(s==='Active'?'#059669':'#94a3b8'):'var(--border)'}`, background:rtForm.status===s?(s==='Active'?'#d1fae5':'#f1f5f9'):'var(--bg)', color:rtForm.status===s?(s==='Active'?'#059669':'#64748b'):'var(--text-muted)', fontWeight:700, fontSize:'0.83rem', cursor:'pointer' }}>{s}</button>
                                                        ))}
                                                    </div>
                                                </TF>
                                            </div>
                                            {rtForm.stopsStr && (
                                                <div style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:10, padding:'12px 16px', marginTop:4 }}>
                                                    <div style={{ fontSize:'0.72rem', color:'#059669', fontWeight:700, marginBottom:6 }}>STOP PREVIEW</div>
                                                    <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                                                        {rtForm.stopsStr.split(',').map((s,i)=>s.trim()&&<span key={i} style={{ background:'white', border:'1px solid #6ee7b7', color:'#065f46', padding:'3px 10px', borderRadius:4, fontSize:'0.75rem', fontWeight:600 }}>{i===0?'Start: ':''}{s.trim()}</span>)}
                                                    </div>
                                                </div>
                                            )}
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" style={{ background:'#059669', borderColor:'#059669' }} onClick={submitRoute}><MapPin size={14}/> Add Route</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── MANAGER: Add Schedule ── */}
                                    {verified.role==='manager'&&action==='schedule'&&(
                                        <>
                                            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                                                <TF label={<>Bus <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.busId}>
                                                    <select className={`sf-input ${formErr.busId?'sf-input-err':''}`} value={schForm.busId} onChange={e=>{setSchForm(f=>({...f,busId:e.target.value}));setFormErr(x=>({...x,busId:''}));}}>
                                                        <option value="">Select bus…</option>
                                                        {busList.map(b=><option key={b.id} value={b.id}>{b.name} ({b.plate})</option>)}
                                                    </select>
                                                </TF>
                                                <TF label={<>Route <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.routeId}>
                                                    <select className={`sf-input ${formErr.routeId?'sf-input-err':''}`} value={schForm.routeId} onChange={e=>{setSchForm(f=>({...f,routeId:e.target.value}));setFormErr(x=>({...x,routeId:''}));}}>
                                                        <option value="">Select route…</option>
                                                        {routeList.filter(r=>r.status==='Active').map(r=><option key={r.id} value={r.id}>{r.name}</option>)}
                                                    </select>
                                                </TF>
                                                <TF label={<>Departure Time <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.departure}>
                                                    <input type="time" className={`sf-input ${formErr.departure?'sf-input-err':''}`} value={schForm.departure} onChange={e=>{setSchForm(f=>({...f,departure:e.target.value}));setFormErr(x=>({...x,departure:''}));}}/>
                                                </TF>
                                                <TF label={<>Arrival Time <span style={{ color:'#dc2626' }}>*</span></>} error={formErr.arrival}>
                                                    <input type="time" className={`sf-input ${formErr.arrival?'sf-input-err':''}`} value={schForm.arrival} onChange={e=>{setSchForm(f=>({...f,arrival:e.target.value}));setFormErr(x=>({...x,arrival:''}));}}/>
                                                </TF>
                                                <TF label="Operating Days">
                                                    <select className="sf-input" value={schForm.days} onChange={e=>setSchForm(f=>({...f,days:e.target.value}))}>
                                                        {['Mon – Sat','Mon – Fri','Mon – Sun','Sat – Sun'].map(d=><option key={d} value={d}>{d}</option>)}
                                                    </select>
                                                </TF>
                                                <TF label="Trip Type">
                                                    <div style={{ display:'flex', gap:10, marginTop:6 }}>
                                                        {['Morning','Evening'].map(t=>(
                                                            <button key={t} type="button" onClick={()=>setSchForm(f=>({...f,type:t}))} style={{ flex:1, padding:'9px 0', borderRadius:8, border:`2px solid ${schForm.type===t?(t==='Morning'?'#1e40af':'#d97706'):'var(--border)'}`, background:schForm.type===t?(t==='Morning'?'#dbeafe':'#fef3c7'):'var(--bg)', color:schForm.type===t?(t==='Morning'?'#1e40af':'#d97706'):'var(--text-muted)', fontWeight:700, fontSize:'0.83rem', cursor:'pointer' }}>{t==='Morning'?'🌅':'🌆'} {t}</button>
                                                        ))}
                                                    </div>
                                                </TF>
                                            </div>
                                            {schForm.busId&&schForm.departure&&schForm.arrival&&(
                                                <div style={{ background:'#fef9eb', border:'1px solid #fde68a', borderRadius:10, padding:'12px 16px', marginTop:4, display:'flex', gap:12, alignItems:'center', flexWrap:'wrap' }}>
                                                    <span style={{ fontWeight:700, fontSize:'0.83rem', color:'#92400e' }}>{busList.find(b=>b.id===schForm.busId)?.name||'Bus'}</span>
                                                    <span style={{ fontSize:'0.83rem', color:'#78350f' }}>{routeList.find(r=>r.id===schForm.routeId)?.name||'—'}</span>
                                                    <span style={{ background:'#fef3c7', color:'#d97706', padding:'2px 10px', borderRadius:4, fontSize:'0.78rem', fontWeight:700 }}>{schForm.departure} → {schForm.arrival}</span>
                                                    <span style={{ background:'#dbeafe', color:'#1e40af', padding:'2px 10px', borderRadius:4, fontSize:'0.78rem', fontWeight:700 }}>{schForm.days}</span>
                                                </div>
                                            )}
                                            <div style={{ display:'flex', gap:10, marginTop:20, justifyContent:'flex-end' }}>
                                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                                <button className="btn btn-primary" style={{ background:'#d97706', borderColor:'#d97706' }} onClick={submitSchedule}><Calendar size={14}/> Add Schedule</button>
                                            </div>
                                        </>
                                    )}

                                    {/* ── STUDENT: View Routes & Schedule ── */}
                                    {verified.role==='student'&&(
                                        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                                            {/* Active routes */}
                                            <div style={{ background:'linear-gradient(135deg,#eff6ff,#dbeafe)', border:'1px solid #bfdbfe', borderRadius:12, padding:'16px 18px' }}>
                                                <div style={{ fontWeight:700, fontSize:'0.78rem', color:'#1e40af', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:12 }}>🚌 Active Bus Routes</div>
                                                {routeList.filter(r=>r.status==='Active').map(r=>(
                                                    <div key={r.id} style={{ marginBottom:10, paddingBottom:10, borderBottom:'1px solid #bfdbfe' }}>
                                                        <div style={{ fontWeight:700, fontSize:'0.875rem', color:'#1e3a8a', marginBottom:4 }}>{r.name} <span style={{ fontWeight:400, fontSize:'0.75rem', color:'#60a5fa' }}>· {r.distance} · {r.duration}</span></div>
                                                        <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                                                            {r.stops.map((s,i)=>(
                                                                <span key={i} style={{ background:i===0||i===r.stops.length-1?'#1e40af':'white', color:i===0||i===r.stops.length-1?'white':'#1d4ed8', border:'1px solid #93c5fd', padding:'2px 8px', borderRadius:4, fontSize:'0.7rem', fontWeight:600 }}>{s}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* Today's schedule */}
                                            <div style={{ background:'linear-gradient(135deg,#fefce8,#fef3c7)', border:'1px solid #fde68a', borderRadius:12, padding:'16px 18px' }}>
                                                <div style={{ fontWeight:700, fontSize:'0.78rem', color:'#d97706', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:10 }}>⏰ Today's Bus Timings</div>
                                                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                                                    {[['🌅 Morning',schList.filter(s=>s.type==='Morning')],['🌆 Evening',schList.filter(s=>s.type==='Evening')]].map(([label,rows])=>(
                                                        <div key={label}>
                                                            <div style={{ fontSize:'0.75rem', fontWeight:700, color:'#92400e', marginBottom:6 }}>{label}</div>
                                                            {rows.map(s=>(
                                                                <div key={s.id} style={{ background:'rgba(255,255,255,0.7)', borderRadius:6, padding:'6px 10px', marginBottom:4 }}>
                                                                    <div style={{ fontSize:'0.83rem', fontWeight:700, color:'#78350f' }}>{s.departure} → {s.arrival}</div>
                                                                    <div style={{ fontSize:'0.7rem', color:'#92400e' }}>{s.bus} · {s.route}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Contact */}
                                            <div style={{ background:'#f8fafc', border:'1px solid var(--border)', borderRadius:10, padding:'12px 16px', textAlign:'center' }}>
                                                <div style={{ fontSize:'0.78rem', color:'var(--text-secondary)', fontWeight:600 }}>📞 Transport Office: +91 98765 43200</div>
                                                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginTop:3 }}>Read-only view · Contact transport manager to make changes</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style>{`
        /* Map */
        .tr-map-header { display:flex; align-items:center; justify-content:space-between; padding:12px 18px; border-bottom:1px solid var(--border); background:var(--bg-hover); }
        .tr-live-dot { width:8px; height:8px; border-radius:50%; background:#22c55e; box-shadow:0 0 0 3px rgba(34,197,94,0.25); animation:livePulse 1.5s ease-in-out infinite; }
        @keyframes livePulse { 0%,100%{ box-shadow:0 0 0 3px rgba(34,197,94,0.25); } 50%{ box-shadow:0 0 0 7px rgba(34,197,94,0.1); } }
        .tr-map { position:relative; width:100%; height:360px; background:linear-gradient(135deg,#e8f0fe 0%,#e2f4ea 50%,#e8f0fe 100%); overflow:hidden; }
        .tr-road { position:absolute; background:rgba(255,255,255,0.65); }
        .tr-road-h { width:100%; height:10px; }
        .tr-road-v { height:100%; width:10px; }
        .tr-bus-marker { position:absolute; transform:translate(-50%,-50%); cursor:pointer; z-index:10; }
        .tr-bus-ping { position:absolute; width:24px; height:24px; border-radius:50%; opacity:0.25; top:50%; left:50%; transform:translate(-50%,-50%); animation:busPing 2s ease-out infinite; }
        @keyframes busPing { 0%{ transform:translate(-50%,-50%) scale(1); opacity:0.3; } 100%{ transform:translate(-50%,-50%) scale(2.5); opacity:0; } }
        .tr-bus-icon { width:24px; height:24px; border-radius:50%; position:relative; z-index:2; box-shadow:0 2px 8px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center; }
        .tr-bus-label { position:absolute; top:28px; left:50%; transform:translateX(-50%); background:rgba(15,23,42,0.85); color:white; font-size:0.6rem; font-weight:700; padding:1px 6px; border-radius:3px; white-space:nowrap; }
        .tr-bus-marker--active .tr-bus-icon { box-shadow:0 0 0 3px white,0 2px 12px rgba(0,0,0,0.3); transform:scale(1.2); }
        .tr-bus-popup { position:absolute; top:44px; left:50%; transform:translateX(-50%); background:white; border:1px solid var(--border); border-radius:10px; padding:10px 12px; min-width:180px; box-shadow:0 8px 24px rgba(0,0,0,0.15); z-index:20; }
        .tr-bus-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; }
        .tr-bus-card { background:white; border:1px solid var(--border); border-radius:var(--radius-md); padding:16px; box-shadow:var(--shadow-sm); cursor:pointer; transition:all 0.15s; }
        .tr-bus-card:hover { box-shadow:var(--shadow-md); transform:translateY(-1px); }
        .tr-bus-card--sel { box-shadow:0 0 0 2px #1e40af,var(--shadow-md); }

        /* Role cards */
        .tr-role-card { width:100%; padding:20px 16px; border-radius:14px; border:2px solid; cursor:pointer; text-align:center; transition:all 0.18s; font-family:var(--font-body); }
        .tr-role-card:hover { transform:translateY(-2px); box-shadow:0 6px 20px rgba(0,0,0,0.1); }

        /* Modal */
        .em-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(3px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; }
        .em-modal { background:var(--bg-card,white); border:1px solid var(--border); border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.18); width:100%; overflow:hidden; animation:trSlide 0.22s ease; }
        .em-modal-lg { max-height:90vh; overflow-y:auto; }
        @keyframes trSlide { from{ opacity:0; transform:translateY(20px); } to{ opacity:1; transform:translateY(0); } }
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

        [data-theme="dark"] .tr-bus-card { background:var(--bg-card) !important; }
        [data-theme="dark"] .tr-map { background:linear-gradient(135deg,#1e293b,#1a2e1e,#1e293b) !important; }
        [data-theme="dark"] .tr-bus-popup { background:var(--bg-card) !important; }
        [data-theme="dark"] .em-modal { background:var(--bg-card) !important; }
        [data-theme="dark"] .em-modal-head { background:var(--bg-sidebar) !important; }
        [data-theme="dark"] .sf-input { background:var(--bg-card) !important; }
        @media(max-width:900px){ .tr-summary{ grid-template-columns:repeat(2,1fr); } .tr-bus-grid{ grid-template-columns:1fr 1fr; } }
        @media(max-width:600px){ .tr-bus-grid{ grid-template-columns:1fr; } }
      `}</style>
        </div>
    );
}
