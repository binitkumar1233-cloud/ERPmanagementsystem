import { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import ExportMenu from '../../components/common/ExportMenu.jsx';
import {
    Search, Download, CreditCard, CheckCircle, AlertTriangle, Clock, X,
    Bell, Send, Zap, Smartphone, Building2, Wallet, Shield,
    ToggleLeft, ToggleRight, RefreshCw, FileText, Calendar,
    TrendingUp, IndianRupee, ChevronRight, BarChart3,
} from 'lucide-react';
import { getAvatarColor } from '../../utils/helpers.js';
import { openRazorpay } from '../../utils/razorpay.js';

const FEE_COLUMNS = [
    { label: 'Fee ID',      key: 'id'      },
    { label: 'Student ID',  key: 'sid'     },
    { label: 'Name',        key: 'name'    },
    { label: 'Course',      key: 'course'  },
    { label: 'Annual Fee',  key: 'annual', value: r => `₹${r.annual.toLocaleString('en-IN')}` },
    { label: 'Paid',        key: 'paid',   value: r => `₹${r.paid.toLocaleString('en-IN')}`   },
    { label: 'Due',         key: 'due',    value: r => `₹${r.due.toLocaleString('en-IN')}`    },
    { label: 'Due Date',    key: 'dueDate' },
    { label: 'Status',      key: 'status'  },
    { label: 'Method',      key: 'method'  },
];

/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
const fmt     = n  => '₹' + Number(n).toLocaleString('en-IN');
const nowStr  = () => new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const RECORDS = [
    { id:'FEE001', sid:'STU001', name:'Priya Sharma',  course:'B.Tech CSE',            annual:90000,  paid:90000, due:0,     dueDate:'2026-07-15', status:'Paid',    method:'UPI'         },
    { id:'FEE002', sid:'STU002', name:'Rohan Das',      course:'B.Com Honours',          annual:30000,  paid:15000, due:15000, dueDate:'2026-07-15', status:'Partial', method:'—'           },
    { id:'FEE003', sid:'STU003', name:'Ananya Patel',   course:'B.A English',            annual:25000,  paid:25000, due:0,     dueDate:'2026-07-15', status:'Paid',    method:'Card'        },
    { id:'FEE004', sid:'STU004', name:'Suresh Kumar',   course:'B.Tech ECE',             annual:90000,  paid:0,     due:90000, dueDate:'2026-04-15', status:'Overdue', method:'—'           },
    { id:'FEE005', sid:'STU005', name:'Meena Nayak',    course:'M.Sc Mathematics',       annual:35000,  paid:35000, due:0,     dueDate:'2026-07-15', status:'Paid',    method:'UPI'         },
    { id:'FEE006', sid:'STU006', name:'Amit Verma',     course:'B.Tech CSE',             annual:90000,  paid:45000, due:45000, dueDate:'2026-05-28', status:'Partial', method:'Cheque'      },
    { id:'FEE007', sid:'STU007', name:'Sita Rao',       course:'B.A History',            annual:22000,  paid:0,     due:22000, dueDate:'2026-07-15', status:'Pending', method:'—'           },
    { id:'FEE008', sid:'STU008', name:'Arjun Mehta',    course:'B.Tech CSE',             annual:90000,  paid:90000, due:0,     dueDate:'2026-07-15', status:'Paid',    method:'Net Banking' },
    { id:'FEE009', sid:'STU009', name:'Divya Reddy',    course:'B.Com Honours',          annual:30000,  paid:0,     due:30000, dueDate:'2026-04-01', status:'Overdue', method:'—'           },
    { id:'FEE010', sid:'STU010', name:'Nikhil Joshi',   course:'B.Sc Computer Science',  annual:45000,  paid:22500, due:22500, dueDate:'2026-07-15', status:'Partial', method:'UPI'         },
    { id:'FEE011', sid:'STU011', name:'Aisha Khan',     course:'M.Sc Mathematics',       annual:35000,  paid:35000, due:0,     dueDate:'2026-07-15', status:'Paid',    method:'Card'        },
    { id:'FEE012', sid:'STU012', name:'Akash Dubey',    course:'M.Tech CSE',             annual:120000, paid:60000, due:60000, dueDate:'2026-05-01', status:'Overdue', method:'—'           },
];

const FEE_STRUCTURES = [
    { id:'FS001', course:'B.Tech CSE', annual:90000, schedule:'Semester',
      components:[{head:'Tuition',amount:65000,color:'#1e40af'},{head:'Lab',amount:8000,color:'#7c3aed'},{head:'Library',amount:3000,color:'#0284c7'},{head:'Sports',amount:2000,color:'#059669'},{head:'Exam',amount:5000,color:'#d97706'},{head:'Misc',amount:7000,color:'#94a3b8'}],
      installments:[{no:1,label:'Semester 1',amount:45000,due:'15 Jul 2026',status:'Active'},{no:2,label:'Semester 2',amount:45000,due:'15 Jan 2027',status:'Upcoming'}],
      autoBillDefault:true },
    { id:'FS002', course:'B.Sc Computer Science', annual:45000, schedule:'Annual',
      components:[{head:'Tuition',amount:32000,color:'#1e40af'},{head:'Lab',amount:5000,color:'#7c3aed'},{head:'Library',amount:2000,color:'#0284c7'},{head:'Exam',amount:4000,color:'#d97706'},{head:'Misc',amount:2000,color:'#94a3b8'}],
      installments:[{no:1,label:'Annual',amount:45000,due:'15 Jul 2026',status:'Active'}],
      autoBillDefault:true },
    { id:'FS003', course:'M.Tech CSE', annual:120000, schedule:'Semester',
      components:[{head:'Tuition',amount:90000,color:'#1e40af'},{head:'Lab',amount:12000,color:'#7c3aed'},{head:'Library',amount:4000,color:'#0284c7'},{head:'Exam',amount:8000,color:'#d97706'},{head:'Misc',amount:6000,color:'#94a3b8'}],
      installments:[{no:1,label:'Semester 1',amount:60000,due:'15 Jul 2026',status:'Active'},{no:2,label:'Semester 2',amount:60000,due:'15 Jan 2027',status:'Upcoming'}],
      autoBillDefault:false },
    { id:'FS004', course:'MBA', annual:150000, schedule:'Quarterly',
      components:[{head:'Tuition',amount:110000,color:'#1e40af'},{head:'Library',amount:5000,color:'#0284c7'},{head:'Sports',amount:5000,color:'#059669'},{head:'Exam',amount:15000,color:'#d97706'},{head:'Misc',amount:15000,color:'#94a3b8'}],
      installments:[{no:1,label:'Q1 (Apr–Jun)',amount:37500,due:'15 Apr 2026',status:'Paid'},{no:2,label:'Q2 (Jul–Sep)',amount:37500,due:'15 Jul 2026',status:'Active'},{no:3,label:'Q3 (Oct–Dec)',amount:37500,due:'15 Oct 2026',status:'Upcoming'},{no:4,label:'Q4 (Jan–Mar)',amount:37500,due:'15 Jan 2027',status:'Upcoming'}],
      autoBillDefault:true },
    { id:'FS005', course:'B.Com Honours', annual:30000, schedule:'Annual',
      components:[{head:'Tuition',amount:22000,color:'#1e40af'},{head:'Library',amount:2000,color:'#0284c7'},{head:'Sports',amount:1000,color:'#059669'},{head:'Exam',amount:3000,color:'#d97706'},{head:'Misc',amount:2000,color:'#94a3b8'}],
      installments:[{no:1,label:'Annual',amount:30000,due:'15 Jul 2026',status:'Active'}],
      autoBillDefault:true },
];

const MANUAL_METHODS = ['Cash','Cheque','DD','Bank Transfer'];

const STATUS_CFG = {
    Paid:    { badge:'badge-success', icon:CheckCircle,   color:'#059669', bg:'rgba(5,150,105,0.10)',  border:'rgba(5,150,105,0.3)'  },
    Partial: { badge:'badge-warning', icon:Clock,         color:'#d97706', bg:'rgba(217,119,6,0.10)', border:'rgba(217,119,6,0.3)'  },
    Pending: { badge:'badge-info',    icon:Clock,         color:'#0284c7', bg:'rgba(2,132,199,0.10)', border:'rgba(2,132,199,0.3)'  },
    Overdue: { badge:'badge-danger',  icon:AlertTriangle, color:'#dc2626', bg:'rgba(220,38,38,0.10)', border:'rgba(220,38,38,0.3)'  },
};

const SEED_NOTIFS = [
    { id:'N001', sid:'STU004', name:'Suresh Kumar', course:'B.Tech ECE',           due:90000, channel:'SMS & Email', sentAt:'04 Jun, 09:30 AM', status:'Delivered', type:'Overdue Reminder'    },
    { id:'N002', sid:'STU009', name:'Divya Reddy',  course:'B.Com Honours',         due:30000, channel:'SMS',         sentAt:'04 Jun, 09:30 AM', status:'Delivered', type:'Overdue Reminder'    },
    { id:'N003', sid:'STU012', name:'Akash Dubey',  course:'M.Tech CSE',            due:60000, channel:'SMS & Email', sentAt:'04 Jun, 09:30 AM', status:'Delivered', type:'Overdue Reminder'    },
    { id:'N004', sid:'STU002', name:'Rohan Das',    course:'B.Com Honours',         due:15000, channel:'Email',       sentAt:'02 Jun, 10:15 AM', status:'Read',      type:'Payment Due Reminder' },
    { id:'N005', sid:'STU006', name:'Amit Verma',   course:'B.Tech CSE',            due:45000, channel:'SMS',         sentAt:'02 Jun, 10:15 AM', status:'Delivered', type:'Payment Due Reminder' },
];

const GW0 = { open:false, fee:null, step:'idle', txnId:'', orderId:'', verified:false, errMsg:'' };

/* ══════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════ */
export default function Fees() {
    const [tab, setTab]     = useState('records');
    const [q, setQ]         = useState('');
    const [sf, setSF]       = useState('All');

    const [man, setMan]         = useState(null);
    const [manAmt, setManAmt]   = useState('');
    const [manMeth, setManMeth] = useState('Cash');
    const [manBusy, setManBusy] = useState(false);
    const [manDone, setManDone] = useState(false);

    const [gw, setGw]   = useState(GW0);

    const [notifs, setNotifs]     = useState(SEED_NOTIFS);
    const [sendId, setSendId]     = useState(null);
    const [sendAll, setSendAll]   = useState(false);
    const [nFilter, setNF]        = useState('All');
    const [lastRun, setLastRun]   = useState('04 Jun, 09:30 AM');

    const [autoBill, setAB] = useState(Object.fromEntries(FEE_STRUCTURES.map(f => [f.id, f.autoBillDefault])));
    const [expanded, setExp] = useState(null);

    /* Add Structure modal */
    const [addOpen, setAddOpen]   = useState(false);
    const [addBusy, setAddBusy]   = useState(false);
    const [addDone, setAddDone]   = useState(false);
    const [newFs, setNewFs]       = useState({ course:'', annual:'', schedule:'Semester', autoBill:true });
    const setNF2 = (k, v) => setNewFs(p => ({ ...p, [k]: v }));
    const openAdd  = () => { setNewFs({ course:'', annual:'', schedule:'Semester', autoBill:true }); setAddDone(false); setAddOpen(true); };
    const closeAdd = () => { setAddOpen(false); setAddDone(false); };
    const doAddStructure = async () => {
        if (!newFs.course.trim() || !newFs.annual || isNaN(newFs.annual) || Number(newFs.annual) <= 0) return;
        setAddBusy(true);
        await new Promise(r => setTimeout(r, 800));
        setAddBusy(false);
        setAddDone(true);
        setTimeout(() => closeAdd(), 1800);
    };

    /* Derived stats */
    const totalAnnual    = RECORDS.reduce((s,r) => s+r.annual, 0);
    const totalCollected = RECORDS.reduce((s,r) => s+r.paid,   0);
    const totalDue       = RECORDS.reduce((s,r) => s+r.due,    0);
    const overdueAmt     = RECORDS.filter(r=>r.status==='Overdue').reduce((s,r)=>s+r.due,0);
    const collPct        = Math.round(totalCollected/totalAnnual*100);
    const paidCount      = RECORDS.filter(r=>r.status==='Paid').length;
    const overdueCount   = RECORDS.filter(r=>r.status==='Overdue').length;

    const filtered = RECORDS.filter(r => {
        const mq = r.name.toLowerCase().includes(q.toLowerCase()) || r.sid.toLowerCase().includes(q.toLowerCase());
        const ms = sf==='All' || r.status===sf;
        return mq && ms;
    });

    /* Manual pay */
    const openMan  = r => { setMan(r); setManAmt(''); setManMeth('Cash'); setManDone(false); };
    const doManPay = async () => {
        if (!manAmt || isNaN(manAmt) || Number(manAmt)<=0) return;
        setManBusy(true);
        await new Promise(r=>setTimeout(r,700));
        setManBusy(false); setManDone(true);
        setTimeout(()=>{ setMan(null); setManDone(false); }, 1800);
    };

    /* Gateway – real Razorpay */
    const closeGw = () => setGw(GW0);
    const openGw  = async r => {
        setGw({ ...GW0, open: true, fee: r, step: 'processing' });
        try {
            const { paymentId, orderId, verified } = await openRazorpay({
                feeId:       r.id,
                studentId:   r.sid,
                studentName: r.name,
                course:      r.course,
                amount:      r.due,
            });
            setGw(p => ({ ...p, step: 'success', txnId: paymentId, orderId: orderId || '', verified: !!verified }));
        } catch (err) {
            const msg = err.message || 'Payment failed.';
            if (msg.includes('cancelled')) {
                setGw(GW0); // user dismissed – just close silently
            } else {
                setGw(p => ({ ...p, step: 'error', errMsg: msg }));
            }
        }
    };

    /* Notifications */
    const addNotif = (r, type) => ({ id:'N'+Date.now()+r.sid, sid:r.sid, name:r.name, course:r.course, due:r.due, channel:'SMS & Email', sentAt:nowStr(), status:'Delivered', type });
    const sendReminder = async r => {
        setSendId(r.sid);
        await new Promise(x=>setTimeout(x,900));
        setNotifs(p=>[addNotif(r,r.status==='Overdue'?'Overdue Reminder':'Payment Due Reminder'),...p]);
        setSendId(null);
    };
    const runAutoNotifs = async () => {
        setSendAll(true);
        const targets = RECORDS.filter(r=>['Overdue','Pending','Partial'].includes(r.status));
        await new Promise(x=>setTimeout(x,1600));
        const fresh = targets.map(r=>addNotif(r,r.status==='Overdue'?'Overdue Reminder':'Payment Due Reminder'));
        setNotifs(p=>[...fresh,...p]);
        setLastRun(nowStr());
        setSendAll(false);
    };
    const dueStu = RECORDS.filter(r=>r.status!=='Paid'&&(nFilter==='All'||r.status===nFilter));

    return (
        <div className="erp-page">
            <Navbar title="Fee Management" subtitle="Recurring structures, online payments, and automated dues notifications" />

            {/* ── Hero KPI Cards ── */}
            <div style={S.heroGrid}>
                {[
                    { label:'Total Annual Fees', value:fmt(totalAnnual),    icon:IndianRupee,   gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  sub:`${RECORDS.length} enrolled students` },
                    { label:'Collected',          value:fmt(totalCollected), icon:CheckCircle,   gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(5,150,105,0.28)',  sub:`${paidCount} fully paid · ${collPct}% of target` },
                    { label:'Outstanding',        value:fmt(totalDue),       icon:Clock,         gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', sub:`Across ${RECORDS.filter(r=>r.due>0).length} students` },
                    { label:'Overdue',            value:fmt(overdueAmt),     icon:AlertTriangle, gradient:'linear-gradient(135deg,#7f1d1d,#dc2626)', glow:'rgba(220,38,38,0.28)',  sub:`${overdueCount} students · urgent action` },
                ].map(({ label, value, icon:Icon, gradient, glow, sub }) => (
                    <div key={label} style={{ ...S.heroCard, background:gradient, boxShadow:`0 8px 24px ${glow}` }}>
                        <div style={S.heroTop}>
                            <div style={S.heroIconBox}><Icon size={20} strokeWidth={2} color="white"/></div>
                            <div style={S.heroVal}>{value}</div>
                        </div>
                        <div style={S.heroLbl}>{label}</div>
                        <div style={S.heroSub}>{sub}</div>
                        <div style={S.heroShine}/>
                    </div>
                ))}
            </div>

            {/* ── Collection Progress ── */}
            <div style={S.progressWrap}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <BarChart3 size={16} color="#2563eb"/>
                        <span style={{ fontWeight:800, fontSize:'0.88rem', color:'var(--text-primary)' }}>Overall Collection Progress</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <TrendingUp size={14} color="#059669"/>
                        <span style={{ fontWeight:800, color:'#059669', fontSize:'0.88rem' }}>{collPct}% collected</span>
                    </div>
                </div>
                <div style={{ height:12, background:'#f1f5f9', borderRadius:99, overflow:'hidden', position:'relative' }}>
                    <div style={{ height:'100%', width:`${collPct}%`, background:'linear-gradient(90deg,#1e40af,#2563eb,#3b82f6)', borderRadius:99, transition:'width 0.8s ease', position:'relative' }}>
                        <div style={{ position:'absolute', right:0, top:0, height:'100%', width:4, background:'rgba(255,255,255,0.6)', borderRadius:99 }}/>
                    </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.76rem', color:'var(--text-muted)', marginTop:9 }}>
                    <div style={{ display:'flex', gap:18 }}>
                        <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:8, height:8, borderRadius:'50%', background:'#2563eb', display:'inline-block' }}/> Collected: <strong style={{ color:'var(--text-primary)' }}>{fmt(totalCollected)}</strong></span>
                        <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:8, height:8, borderRadius:'50%', background:'#d97706', display:'inline-block' }}/> Outstanding: <strong style={{ color:'var(--text-primary)' }}>{fmt(totalDue)}</strong></span>
                    </div>
                    <span>Target: <strong style={{ color:'var(--text-primary)' }}>{fmt(totalAnnual)}</strong></span>
                </div>
            </div>

            {/* ── Tab Bar ── */}
            <div style={S.tabBar}>
                {[
                    { key:'records',    label:'Fee Records',          icon:CreditCard  },
                    { key:'structures', label:'Fee Structures',       icon:Calendar    },
                    { key:'notifs',     label:'Dues & Notifications', icon:Bell        },
                ].map(t => {
                    const isActive = tab === t.key;
                    return (
                        <button key={t.key}
                            style={{ ...S.tab, ...(isActive ? S.tabActive : {}) }}
                            onClick={() => setTab(t.key)}
                        >
                            <t.icon size={15} strokeWidth={isActive?2.5:2}/>
                            {t.label}
                            {isActive && <span style={S.tabDot}/>}
                        </button>
                    );
                })}
            </div>

            {/* ════════════════════════════════════════
                TAB: FEE RECORDS
            ════════════════════════════════════════ */}
            {tab === 'records' && (
                <>
                    {/* Status filter chips */}
                    <div style={{ display:'flex', gap:8, marginBottom:14, flexWrap:'wrap', alignItems:'center' }}>
                        {['All','Paid','Partial','Pending','Overdue'].map(s => {
                            const on = sf === s;
                            const cfg = s !== 'All' ? STATUS_CFG[s] : null;
                            const count = s === 'All' ? RECORDS.length : RECORDS.filter(r=>r.status===s).length;
                            return (
                                <button key={s} onClick={()=>setSF(s)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:99, fontSize:'0.78rem', fontWeight:700, cursor:'pointer', border:`1.5px solid ${on&&cfg?cfg.border:on?'rgba(37,99,235,0.4)':'var(--border)'}`, background:on&&cfg?cfg.bg:on?'rgba(37,99,235,0.08)':'white', color:on&&cfg?cfg.color:on?'#2563eb':'var(--text-muted)', transition:'all 0.15s' }}>
                                    {s !== 'All' && cfg && <span style={{ width:7, height:7, borderRadius:'50%', background:cfg.color }}/>}
                                    {s}
                                    <span style={{ background:on&&cfg?cfg.color:on?'#2563eb':'#e2e8f0', color:'white', fontSize:'0.6rem', fontWeight:800, padding:'1px 6px', borderRadius:99 }}>{count}</span>
                                </button>
                            );
                        })}
                        <div style={{ flex:1 }}/>
                        <div style={S.searchWrap}>
                            <Search size={14} color="var(--text-muted)"/>
                            <input style={S.searchInput} placeholder="Search student or ID…" value={q} onChange={e=>setQ(e.target.value)}/>
                        </div>
                        <ExportMenu title="Fee_Records" rows={filtered} columns={FEE_COLUMNS} />
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Fee Records <span style={S.pill}>{filtered.length}</span></h2>
                                <p>Annual fee collection status for all enrolled students</p>
                            </div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Student</th><th>Course</th><th>Annual Fee</th>
                                        <th>Paid</th><th>Balance</th><th>Due Date</th>
                                        <th>Method</th><th>Status</th>
                                        <th style={{ textAlign:'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map(r => {
                                        const cfg  = STATUS_CFG[r.status];
                                        const Icon = cfg.icon;
                                        const paidPct = Math.round(r.paid/r.annual*100);
                                        return (
                                            <tr key={r.id}>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ width:38, height:38, borderRadius:10, background:getAvatarColor(r.name), display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.9rem', flexShrink:0 }}>{r.name[0]}</div>
                                                        <div>
                                                            <div style={{ fontWeight:700, fontSize:'0.84rem', color:'var(--text-primary)' }}>{r.name}</div>
                                                            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'monospace', marginTop:1 }}>{r.sid}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize:'0.82rem', maxWidth:160 }}>{r.course}</td>
                                                <td style={{ fontWeight:700 }}>{fmt(r.annual)}</td>
                                                <td>
                                                    <div>
                                                        <div style={{ color:'#059669', fontWeight:700, fontSize:'0.84rem' }}>{fmt(r.paid)}</div>
                                                        <div style={{ width:60, height:4, background:'#f1f5f9', borderRadius:99, marginTop:4, overflow:'hidden' }}>
                                                            <div style={{ height:'100%', width:`${paidPct}%`, background:r.status==='Paid'?'#059669':'#d97706', borderRadius:99 }}/>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ color:r.due>0?'#dc2626':'var(--text-muted)', fontWeight:700 }}>{fmt(r.due)}</td>
                                                <td style={{ fontSize:'0.82rem', whiteSpace:'nowrap' }}>{r.dueDate}</td>
                                                <td>
                                                    {r.method !== '—'
                                                        ? <span style={{ background:'#f1f5f9', color:'var(--text-secondary)', padding:'3px 9px', borderRadius:6, fontSize:'0.71rem', fontWeight:600 }}>{r.method}</span>
                                                        : <span style={{ color:'var(--text-muted)' }}>—</span>
                                                    }
                                                </td>
                                                <td>
                                                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>
                                                        <Icon size={10}/>{r.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div style={{ display:'flex', gap:6, justifyContent:'flex-end' }}>
                                                        {r.status !== 'Paid' ? (
                                                            <>
                                                                <button className="btn btn-primary btn-sm" onClick={()=>openGw(r)}><CreditCard size={12}/> Online</button>
                                                                <button className="btn btn-secondary btn-sm" onClick={()=>openMan(r)}>Manual</button>
                                                            </>
                                                        ) : (
                                                            <button className="btn btn-secondary btn-sm"><Download size={12}/> Receipt</button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filtered.length === 0 && (
                                <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' }}>
                                    <Search size={36} style={{ opacity:0.15, marginBottom:10 }}/>
                                    <p style={{ fontSize:'0.84rem' }}>No students match your filter.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* ════════════════════════════════════════
                TAB: FEE STRUCTURES
            ════════════════════════════════════════ */}
            {tab === 'structures' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                        <p style={{ fontSize:'0.83rem', color:'var(--text-muted)' }}>
                            Define recurring fee plans per course. Auto-billing sends invoices automatically on due dates.
                        </p>
                        <button className="btn btn-primary btn-sm" onClick={openAdd}><Zap size={13}/> Add Structure</button>
                    </div>

                    {FEE_STRUCTURES.map(fs => {
                        const isExp = expanded === fs.id;
                        const paidInsts = fs.installments.filter(i=>i.status==='Paid').length;
                        return (
                            <div className="card" key={fs.id} style={{ overflow:'hidden' }}>
                                {/* Accent bar */}
                                <div style={{ height:4, background:'linear-gradient(90deg,#1e40af,#2563eb,#7c3aed)', width:'100%' }}/>

                                <div style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 20px', cursor:'pointer' }} onClick={()=>setExp(isExp?null:fs.id)}>
                                    <div style={{ flex:1 }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                                            <span style={{ fontWeight:800, fontSize:'0.95rem', color:'var(--text-primary)' }}>{fs.course}</span>
                                            <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'3px 10px', borderRadius:6, background:'rgba(37,99,235,0.09)', color:'#2563eb' }}>{fs.schedule}</span>
                                            <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'3px 10px', borderRadius:6, background:'rgba(5,150,105,0.09)', color:'#059669' }}>{fs.installments.length} installment{fs.installments.length>1?'s':''}</span>
                                            {paidInsts > 0 && <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'3px 10px', borderRadius:6, background:'rgba(5,150,105,0.09)', color:'#059669' }}>{paidInsts} paid</span>}
                                        </div>
                                        <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:5 }}>
                                            Annual fee: <strong style={{ color:'var(--text-primary)', fontFamily:'var(--font-display)' }}>{fmt(fs.annual)}</strong>
                                        </div>
                                    </div>

                                    <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }} onClick={e=>e.stopPropagation()}>
                                        <span style={{ fontSize:'0.72rem', color:'var(--text-muted)', fontWeight:500 }}>Auto-billing</span>
                                        <button style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', padding:0 }}
                                            onClick={()=>setAB(p=>({...p,[fs.id]:!p[fs.id]}))}>
                                            {autoBill[fs.id]
                                                ? <ToggleRight size={28} color="#059669"/>
                                                : <ToggleLeft  size={28} color="#94a3b8"/>
                                            }
                                        </button>
                                    </div>

                                    <ChevronRight size={16} color="var(--text-muted)" style={{ transition:'transform 0.2s', transform:isExp?'rotate(90deg)':'none', flexShrink:0 }}/>
                                </div>

                                {/* Component bar */}
                                <div style={{ padding:'0 20px 16px' }}>
                                    <div style={{ display:'flex', height:8, borderRadius:99, overflow:'hidden', gap:2 }}>
                                        {fs.components.map(c=>(
                                            <div key={c.head} style={{ flex:c.amount, background:c.color, borderRadius:99 }} title={`${c.head}: ${fmt(c.amount)}`}/>
                                        ))}
                                    </div>
                                    <div style={{ display:'flex', gap:12, marginTop:9, flexWrap:'wrap' }}>
                                        {fs.components.map(c=>(
                                            <div key={c.head} style={{ display:'flex', alignItems:'center', gap:5 }}>
                                                <div style={{ width:8, height:8, borderRadius:'50%', background:c.color }}/>
                                                <span style={{ fontSize:'0.69rem', color:'var(--text-muted)' }}>{c.head}: <strong style={{ color:'var(--text-secondary)' }}>{fmt(c.amount)}</strong></span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Expanded installments */}
                                {isExp && (
                                    <div style={{ borderTop:'1px solid var(--border)', padding:'16px 20px', background:'#fafbfc' }}>
                                        <div style={{ fontSize:'0.72rem', fontWeight:700, color:'var(--text-secondary)', marginBottom:12, textTransform:'uppercase', letterSpacing:'0.06em' }}>Installment Schedule</div>
                                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                                            {fs.installments.map(inst => {
                                                const ic = inst.status==='Paid'?{bg:'rgba(5,150,105,0.08)',c:'#059669',border:'rgba(5,150,105,0.2)'}:inst.status==='Active'?{bg:'rgba(37,99,235,0.08)',c:'#1e40af',border:'rgba(37,99,235,0.2)'}:{bg:'rgba(100,116,139,0.06)',c:'#475569',border:'rgba(100,116,139,0.15)'};
                                                return (
                                                    <div key={inst.no} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 16px', background:ic.bg, borderRadius:10, border:`1px solid ${ic.border}` }}>
                                                        <div style={{ width:30, height:30, borderRadius:'50%', background:ic.c, color:'white', display:'grid', placeItems:'center', fontSize:'0.72rem', fontWeight:800, flexShrink:0 }}>{inst.no}</div>
                                                        <div style={{ flex:1 }}>
                                                            <div style={{ fontWeight:700, fontSize:'0.84rem', color:'var(--text-primary)' }}>{inst.label}</div>
                                                            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>Due: {inst.due}</div>
                                                        </div>
                                                        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'1rem', color:ic.c }}>{fmt(inst.amount)}</div>
                                                        <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'3px 10px', borderRadius:6, background:ic.bg, color:ic.c, border:`1px solid ${ic.border}` }}>{inst.status}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div style={{ marginTop:12, padding:'10px 14px', background:'#fffbeb', border:'1px solid #fde68a', borderRadius:9, fontSize:'0.76rem', color:'var(--text-secondary)', display:'flex', alignItems:'center', gap:8 }}>
                                            <Zap size={13} color="#d97706"/>
                                            {autoBill[fs.id]
                                                ? 'Auto-billing is ON — invoices will be sent automatically 7 days before each due date.'
                                                : 'Auto-billing is OFF — invoices must be sent manually.'}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ════════════════════════════════════════
                TAB: DUES & NOTIFICATIONS
            ════════════════════════════════════════ */}
            {tab === 'notifs' && (
                <>
                    {/* Auto-run banner */}
                    <div style={S.autoRunBanner}>
                        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                            <div style={{ width:46, height:46, borderRadius:12, background:'linear-gradient(135deg,#1e3a8a,#2563eb)', display:'grid', placeItems:'center', flexShrink:0 }}>
                                <Zap size={20} color="white"/>
                            </div>
                            <div>
                                <div style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text-primary)' }}>Automated Notification Engine</div>
                                <div style={{ fontSize:'0.74rem', color:'var(--text-muted)', marginTop:3 }}>Last auto-run: {lastRun} · Next scheduled: Daily at 09:00 AM</div>
                            </div>
                        </div>
                        <button className="btn btn-primary" onClick={runAutoNotifs} disabled={sendAll}>
                            {sendAll ? <><span className="spinner"/> Sending…</> : <><RefreshCw size={14}/> Run Auto-Notifications</>}
                        </button>
                    </div>

                    {/* Stats chips */}
                    <div style={{ display:'flex', gap:10, marginBottom:18, flexWrap:'wrap' }}>
                        {[
                            { label:'Overdue Students',   value:RECORDS.filter(r=>r.status==='Overdue').length,  color:'#dc2626', bg:'rgba(220,38,38,0.09)',  border:'rgba(220,38,38,0.25)'  },
                            { label:'Pending Payments',   value:RECORDS.filter(r=>r.status==='Pending').length,  color:'#0284c7', bg:'rgba(2,132,199,0.09)',  border:'rgba(2,132,199,0.25)'  },
                            { label:'Partial Payments',   value:RECORDS.filter(r=>r.status==='Partial').length,  color:'#d97706', bg:'rgba(217,119,6,0.09)',  border:'rgba(217,119,6,0.25)'  },
                            { label:'Notifications Sent', value:notifs.length, color:'#7c3aed', bg:'rgba(124,58,237,0.09)', border:'rgba(124,58,237,0.25)'  },
                        ].map(c => (
                            <div key={c.label} style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 16px', borderRadius:99, background:c.bg, border:`1px solid ${c.border}`, fontSize:'0.78rem' }}>
                                <span style={{ fontSize:'1.1rem', fontWeight:900, color:c.color }}>{c.value}</span>
                                <span style={{ color:c.color, fontWeight:600 }}>{c.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Due students */}
                    <div className="card" style={{ marginBottom:18 }}>
                        <div className="card-header">
                            <div>
                                <h2>Students with Pending Dues <span style={S.pill}>{dueStu.length}</span></h2>
                                <p>Send individual or batch reminders via SMS & Email</p>
                            </div>
                            <div style={{ display:'flex', gap:6 }}>
                                {['All','Overdue','Partial','Pending'].map(f => (
                                    <button key={f} className={`btn btn-sm ${nFilter===f?'btn-primary':'btn-secondary'}`} onClick={()=>setNF(f)}>{f}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead>
                                    <tr><th>Student</th><th>Course</th><th>Balance Due</th><th>Status</th><th>Due Date</th><th style={{ textAlign:'right' }}>Notify</th></tr>
                                </thead>
                                <tbody>
                                    {dueStu.map(r => {
                                        const cfg = STATUS_CFG[r.status];
                                        const Icon = cfg.icon;
                                        const isSending = sendId === r.sid;
                                        return (
                                            <tr key={r.id}>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ width:36, height:36, borderRadius:10, background:getAvatarColor(r.name), display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.88rem', flexShrink:0 }}>{r.name[0]}</div>
                                                        <div>
                                                            <div style={{ fontWeight:700, fontSize:'0.84rem', color:'var(--text-primary)' }}>{r.name}</div>
                                                            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'monospace', marginTop:1 }}>{r.sid}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize:'0.82rem' }}>{r.course}</td>
                                                <td style={{ fontFamily:'var(--font-display)', fontWeight:800, color:'#dc2626', fontSize:'0.95rem' }}>{fmt(r.due)}</td>
                                                <td>
                                                    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:99, fontSize:'0.71rem', fontWeight:700, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}` }}>
                                                        <Icon size={10}/>{r.status}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize:'0.82rem' }}>{r.dueDate}</td>
                                                <td style={{ textAlign:'right' }}>
                                                    <button className="btn btn-secondary btn-sm" onClick={()=>sendReminder(r)} disabled={isSending||sendAll}>
                                                        {isSending ? <><span className="spinner" style={{ borderTopColor:'var(--primary)' }}/> Sending…</> : <><Send size={12}/> Send Reminder</>}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {dueStu.length === 0 && (
                                <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-muted)' }}>
                                    <div style={{ fontSize:'2.5rem', marginBottom:8 }}>🎉</div>
                                    <p style={{ fontSize:'0.84rem' }}>No pending dues for this filter.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notification log */}
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Notification Log <span style={S.pill}>{notifs.length}</span></h2>
                                <p>History of all sent reminders and automated alerts</p>
                            </div>
                            <ExportMenu title="Fee_Notifications" rows={notifs} columns={[
                                { label:'Name', key:'name' }, { label:'Course', key:'course' },
                                { label:'Type', key:'type' }, { label:'Channel', key:'channel' },
                                { label:'Amount Due', key:'due', value: r => `₹${r.due}` },
                                { label:'Sent At', key:'sentAt' }, { label:'Status', key:'status' },
                            ]} />
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead>
                                    <tr><th>Student</th><th>Type</th><th>Channel</th><th>Amount Due</th><th>Sent At</th><th>Status</th></tr>
                                </thead>
                                <tbody>
                                    {notifs.map(n => (
                                        <tr key={n.id}>
                                            <td>
                                                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                    <div style={{ width:32, height:32, borderRadius:8, background:getAvatarColor(n.name), display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.82rem', flexShrink:0 }}>{n.name[0]}</div>
                                                    <div>
                                                        <div style={{ fontWeight:700, fontSize:'0.83rem', color:'var(--text-primary)' }}>{n.name}</div>
                                                        <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>{n.course}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'3px 9px', borderRadius:6, background:'rgba(124,58,237,0.09)', color:'#7c3aed' }}>{n.type}</span>
                                            </td>
                                            <td>
                                                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.78rem' }}>
                                                    {n.channel.includes('SMS')   && <Smartphone size={12} color="#7c3aed"/>}
                                                    {n.channel.includes('Email') && <FileText   size={12} color="#1e40af"/>}
                                                    {n.channel}
                                                </div>
                                            </td>
                                            <td style={{ color:'#dc2626', fontWeight:700 }}>{fmt(n.due)}</td>
                                            <td style={{ fontSize:'0.76rem', color:'var(--text-muted)', fontFamily:'monospace' }}>{n.sentAt}</td>
                                            <td>
                                                <span className={`badge ${n.status==='Delivered'?'badge-success':n.status==='Read'?'badge-info':'badge-warning'}`}>{n.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            {/* ════════════════════════════════════════
                MANUAL PAYMENT MODAL
            ════════════════════════════════════════ */}
            {man && (
                <div className="modal-backdrop" onClick={()=>setMan(null)}>
                    <div className="modal-box" onClick={e=>e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Record Manual Payment</h3>
                            <button className="modal-close" onClick={()=>setMan(null)}><X size={18}/></button>
                        </div>
                        {manDone ? (
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:40 }}>
                                <div style={{ width:60, height:60, borderRadius:'50%', background:'#059669', display:'grid', placeItems:'center', boxShadow:'0 4px 20px rgba(5,150,105,0.35)' }}>
                                    <CheckCircle size={32} color="white"/>
                                </div>
                                <p style={{ fontWeight:700, color:'#059669', fontSize:'1rem' }}>Payment recorded successfully!</p>
                            </div>
                        ) : (
                            <div className="modal-body">
                                <div className="modal-info">
                                    <div><span>Student</span><strong>{man.name}</strong></div>
                                    <div><span>Course</span><strong>{man.course}</strong></div>
                                    <div><span>Balance</span><strong style={{ color:'var(--danger)' }}>{fmt(man.due)}</strong></div>
                                </div>
                                <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:16 }}>
                                    <div className="field">
                                        <label>Amount (₹) <span style={{ color:'#dc2626' }}>*</span></label>
                                        <input type="number" placeholder={`Max ${fmt(man.due)}`} value={manAmt} onChange={e=>setManAmt(e.target.value)} min="1" max={man.due}/>
                                    </div>
                                    <div className="field">
                                        <label>Payment Method</label>
                                        <select value={manMeth} onChange={e=>setManMeth(e.target.value)}>
                                            {MANUAL_METHODS.map(m=><option key={m}>{m}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={()=>setMan(null)}>Cancel</button>
                                    <button className="btn btn-success" disabled={manBusy} onClick={doManPay}>
                                        {manBusy ? <><span className="spinner"/> Processing…</> : <>✓ Confirm Payment</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
                RAZORPAY STATUS MODAL
                (Razorpay's own checkout UI handles payment method selection)
            ════════════════════════════════════════ */}
            {gw.open && (
                <div className="modal-backdrop" onClick={gw.step==='processing'?undefined:closeGw}>
                    <div className="gw-modal" onClick={e=>e.stopPropagation()}>

                        {/* Header */}
                        <div style={S.gwHeader}>
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={S.gwLogo}><Shield size={16} color="white"/></div>
                                <div>
                                    <div style={{ fontWeight:700, fontSize:'0.85rem', color:'white' }}>Razorpay Secure Payment</div>
                                    <div style={{ fontSize:'0.65rem', color:'rgba(255,255,255,0.6)' }}>Powered by Razorpay · 256-bit SSL</div>
                                </div>
                            </div>
                            {gw.step !== 'processing' && (
                                <button style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.7)' }} onClick={closeGw}><X size={18}/></button>
                            )}
                        </div>

                        {/* Amount box */}
                        {gw.fee && (
                            <div style={S.gwAmtBox}>
                                <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:4 }}>Amount to Pay</div>
                                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'2rem', color:'var(--primary)' }}>{fmt(gw.fee.due)}</div>
                                <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:4 }}>{gw.fee.name} · {gw.fee.sid}</div>
                            </div>
                        )}

                        {/* Processing */}
                        {gw.step === 'processing' && (
                            <div style={{ padding:'40px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:18 }}>
                                <div style={S.gwSpinner}/>
                                <div style={{ fontWeight:700, fontSize:'0.95rem' }}>Opening Razorpay Checkout…</div>
                                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', textAlign:'center' }}>
                                    Complete your payment in the Razorpay window.<br/>Do not close this tab.
                                </div>
                                <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center', fontSize:'0.7rem', color:'var(--text-muted)' }}>
                                    {['UPI', 'Card', 'Net Banking', 'Wallet'].map(m=>(
                                        <span key={m} style={{ background:'#f1f5f9', padding:'3px 9px', borderRadius:6 }}>{m}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Success */}
                        {gw.step === 'success' && (
                            <div style={{ padding:'32px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
                                <div style={S.gwSuccessIcon}><CheckCircle size={40} color="white"/></div>
                                <div style={{ fontWeight:700, fontSize:'1.1rem', color:'var(--text-primary)' }}>Payment Successful!</div>
                                <div style={{ fontSize:'0.82rem', color:'var(--text-muted)' }}>Fee paid for <strong>{gw.fee?.name}</strong></div>

                                {/* Signature verification badge */}
                                <div style={{
                                    display:'inline-flex', alignItems:'center', gap:6,
                                    padding:'5px 12px', borderRadius:99, fontSize:'0.72rem', fontWeight:700,
                                    background: gw.verified ? 'rgba(5,150,105,0.1)' : 'rgba(245,158,11,0.1)',
                                    color:      gw.verified ? '#059669'              : '#b45309',
                                    border:     `1px solid ${gw.verified ? 'rgba(5,150,105,0.3)' : 'rgba(245,158,11,0.3)'}`,
                                }}>
                                    {gw.verified
                                        ? <><CheckCircle size={12}/> Signature Verified</>
                                        : <><Shield size={12}/> Unverified (backend offline)</>
                                    }
                                </div>

                                <div style={S.txnBox}>
                                    <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginBottom:4 }}>Razorpay Payment ID</div>
                                    <div style={{ fontFamily:'monospace', fontWeight:800, fontSize:'0.9rem', color:'var(--primary)', letterSpacing:'0.06em', wordBreak:'break-all' }}>{gw.txnId}</div>
                                    {gw.orderId && (
                                        <>
                                            <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginTop:8, marginBottom:4 }}>Order ID</div>
                                            <div style={{ fontFamily:'monospace', fontSize:'0.75rem', color:'var(--text-secondary)', wordBreak:'break-all' }}>{gw.orderId}</div>
                                        </>
                                    )}
                                    <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginTop:6 }}>{nowStr()}</div>
                                </div>
                                <div style={{ display:'flex', gap:10, marginTop:4, flexWrap:'wrap', justifyContent:'center' }}>
                                    <button className="btn btn-secondary btn-sm"><Download size={12}/> Download Receipt</button>
                                    <button className="btn btn-primary btn-sm" onClick={closeGw}>Done</button>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {gw.step === 'error' && (
                            <div style={{ padding:'32px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
                                <div style={{ width:72, height:72, borderRadius:'50%', background:'#dc2626', display:'grid', placeItems:'center', boxShadow:'0 4px 20px rgba(220,38,38,0.35)' }}>
                                    <AlertTriangle size={36} color="white"/>
                                </div>
                                <div style={{ fontWeight:700, fontSize:'1rem', color:'var(--text-primary)' }}>Payment Failed</div>
                                <div style={{ fontSize:'0.82rem', color:'var(--text-muted)', textAlign:'center' }}>{gw.errMsg}</div>
                                <div style={{ display:'flex', gap:10, marginTop:4 }}>
                                    <button className="btn btn-secondary btn-sm" onClick={closeGw}>Cancel</button>
                                    <button className="btn btn-primary btn-sm" onClick={()=>openGw(gw.fee)}>Try Again</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ════════════════════════════════════════
                ADD STRUCTURE MODAL
            ════════════════════════════════════════ */}
            {addOpen && (
                <div className="modal-backdrop" onClick={closeAdd}>
                    <div className="modal-box" style={{ maxWidth:500 }} onClick={e=>e.stopPropagation()}>
                        <div className="modal-header">
                            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                <div style={{ width:34, height:34, borderRadius:9, background:'linear-gradient(135deg,#1e3a8a,#2563eb)', display:'grid', placeItems:'center' }}>
                                    <Zap size={16} color="white"/>
                                </div>
                                <div>
                                    <h3 style={{ margin:0 }}>Add Fee Structure</h3>
                                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:1 }}>Define a new recurring fee plan for a course</div>
                                </div>
                            </div>
                            <button className="modal-close" onClick={closeAdd}><X size={18}/></button>
                        </div>

                        {addDone ? (
                            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, padding:40 }}>
                                <div style={{ width:60, height:60, borderRadius:'50%', background:'#059669', display:'grid', placeItems:'center', boxShadow:'0 4px 20px rgba(5,150,105,0.3)' }}>
                                    <CheckCircle size={30} color="white"/>
                                </div>
                                <p style={{ fontWeight:700, color:'#059669', fontSize:'1rem' }}>Fee structure added successfully!</p>
                            </div>
                        ) : (
                            <div className="modal-body">
                                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                                    <div className="field">
                                        <label>Course Name <span style={{ color:'#dc2626' }}>*</span></label>
                                        <input
                                            placeholder="e.g. B.Tech Mechanical Engineering"
                                            value={newFs.course}
                                            onChange={e=>setNF2('course',e.target.value)}
                                        />
                                    </div>
                                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                                        <div className="field">
                                            <label>Annual Fee (₹) <span style={{ color:'#dc2626' }}>*</span></label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 90000"
                                                value={newFs.annual}
                                                onChange={e=>setNF2('annual',e.target.value)}
                                                min="1"
                                            />
                                        </div>
                                        <div className="field">
                                            <label>Payment Schedule</label>
                                            <select value={newFs.schedule} onChange={e=>setNF2('schedule',e.target.value)}>
                                                {['Annual','Semester','Quarterly','Monthly'].map(s=><option key={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'#f8fafc', borderRadius:10, border:'1px solid var(--border)' }}>
                                        <div>
                                            <div style={{ fontWeight:600, fontSize:'0.84rem', color:'var(--text-primary)' }}>Enable Auto-billing</div>
                                            <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>Invoices sent automatically 7 days before due date</div>
                                        </div>
                                        <button style={{ background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', padding:0 }}
                                            onClick={()=>setNF2('autoBill',!newFs.autoBill)}>
                                            {newFs.autoBill
                                                ? <ToggleRight size={32} color="#059669"/>
                                                : <ToggleLeft  size={32} color="#94a3b8"/>
                                            }
                                        </button>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={closeAdd}>Cancel</button>
                                    <button className="btn btn-primary" disabled={addBusy || !newFs.course.trim() || !newFs.annual} onClick={doAddStructure}>
                                        {addBusy ? <><span className="spinner"/> Creating…</> : <><Zap size={13}/> Create Structure</>}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .modal-backdrop { position:fixed;inset:0;background:rgba(15,23,42,0.55);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(3px); }
                .modal-box { background:white;border-radius:var(--radius-lg);width:100%;max-width:460px;box-shadow:var(--shadow-lg);overflow:hidden; }
                .modal-header { display:flex;align-items:center;justify-content:space-between;padding:18px 22px;border-bottom:1px solid var(--border); }
                .modal-header h3 { font-size:0.95rem;font-weight:700; }
                .modal-close { background:none;border:none;cursor:pointer;color:var(--text-muted);display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;transition:var(--transition); }
                .modal-close:hover { background:var(--bg-hover);color:var(--text-primary); }
                .modal-body { padding:22px; }
                .modal-info { display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#f8fafc;border-radius:var(--radius-sm);padding:14px; }
                .modal-info div span { font-size:0.7rem;color:var(--text-muted);display:block;margin-bottom:3px; }
                .modal-info div strong { font-size:0.85rem;color:var(--text-primary); }
                .modal-footer { display:flex;justify-content:flex-end;gap:10px;margin-top:20px;padding-top:16px;border-top:1px solid var(--border); }
                .gw-modal { background:white;border-radius:var(--radius-lg);width:100%;max-width:420px;box-shadow:var(--shadow-lg);overflow:hidden; }
                @keyframes gwSpin { to { transform:rotate(360deg); } }
                @keyframes gwPop  { from{transform:scale(0.7);opacity:0} to{transform:scale(1);opacity:1} }
                @media(max-width:900px){ .hero-grid-4{ grid-template-columns:repeat(2,1fr)!important; } }
            `}</style>
        </div>
    );
}

/* ══ STYLES ══ */
const S = {
    /* Hero */
    heroGrid:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:16 },
    heroCard:  { borderRadius:14, padding:'18px 20px 14px', position:'relative', overflow:'hidden', color:'white' },
    heroTop:   { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
    heroIconBox: { width:42, height:42, borderRadius:11, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
    heroVal:   { fontSize:'1.5rem', fontFamily:'var(--font-display)', fontWeight:900 },
    heroLbl:   { fontSize:'0.76rem', fontWeight:600, opacity:0.9, marginBottom:2 },
    heroSub:   { fontSize:'0.64rem', opacity:0.55 },
    heroShine: { position:'absolute', top:0, right:0, width:'45%', height:'100%', background:'rgba(255,255,255,0.055)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' },

    /* Progress */
    progressWrap: { background:'white', border:'1px solid var(--border)', borderRadius:12, padding:'16px 20px', marginBottom:18, boxShadow:'var(--shadow-sm)' },

    /* Tabs */
    tabBar:    { display:'flex', alignItems:'center', gap:2, background:'white', border:'1px solid var(--border)', borderRadius:12, padding:'6px 8px', marginBottom:18, boxShadow:'var(--shadow-sm)' },
    tab:       { display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:9, border:'none', background:'none', color:'var(--text-muted)', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', transition:'all 0.15s', position:'relative' },
    tabActive: { background:'rgba(37,99,235,0.08)', color:'#2563eb' },
    tabDot:    { position:'absolute', bottom:5, left:'50%', transform:'translateX(-50%)', width:4, height:4, borderRadius:'50%', background:'#2563eb' },

    /* Search */
    searchWrap:  { display:'flex', alignItems:'center', gap:8, padding:'8px 12px', border:'1.5px solid var(--border)', borderRadius:9, background:'white', minWidth:220 },
    searchInput: { border:'none', outline:'none', background:'none', fontSize:'0.8rem', color:'var(--text-primary)', width:'100%' },

    /* Pill */
    pill: { display:'inline-block', background:'#2563eb', color:'white', fontSize:'0.62rem', fontWeight:700, padding:'2px 7px', borderRadius:99, marginLeft:6, verticalAlign:'middle' },

    /* Misc */
    sel:          { padding:'8px 12px', border:'1.5px solid var(--border)', borderRadius:'var(--radius-sm)', background:'white', fontSize:'0.83rem', color:'var(--text-primary)', outline:'none', cursor:'pointer' },
    autoRunBanner:{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, background:'white', border:'1px solid var(--border)', borderRadius:12, padding:'16px 20px', marginBottom:18, boxShadow:'var(--shadow-sm)', flexWrap:'wrap' },

    /* Gateway */
    gwHeader:       { background:'linear-gradient(135deg,#1e3a8a,#1e40af)', padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' },
    gwLogo:         { width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.15)', display:'grid', placeItems:'center' },
    gwAmtBox:       { padding:'18px 24px 6px', textAlign:'center', borderBottom:'1px solid var(--border)' },
gwSpinner:      { width:48, height:48, borderRadius:'50%', border:'4px solid #e2e8f0', borderTopColor:'var(--primary)', animation:'gwSpin 0.7s linear infinite' },
    gwSuccessIcon:  { width:72, height:72, borderRadius:'50%', background:'#059669', display:'grid', placeItems:'center', animation:'gwPop 0.35s ease-out', boxShadow:'0 4px 20px rgba(5,150,105,0.35)' },
    txnBox:         { background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:'var(--radius-sm)', padding:'12px 24px', textAlign:'center' },
};
