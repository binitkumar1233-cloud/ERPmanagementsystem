import { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import ExportMenu from '../../components/common/ExportMenu.jsx';
import {
    Save, CheckCircle, XCircle, Clock,
    Fingerprint, CreditCard, Activity, Users,
    AlertTriangle, Trash2, Radio, UserCheck, WifiOff,
    Wifi, MapPin, Shield, BarChart3, TrendingUp,
} from 'lucide-react';
import { getAvatarColor } from '../../utils/helpers.js';

/* ══════════════════════════════ DATA ══════════════════════════════ */
const STUDENTS = [
    { id:'STU001', name:'Priya Sharma',  roll:'CS001', cardId:'RFID-4A2B1C' },
    { id:'STU002', name:'Rohan Das',     roll:'CS002', cardId:'RFID-5B3C2D' },
    { id:'STU003', name:'Ananya Patel',  roll:'CS003', cardId:'RFID-6C4D3E' },
    { id:'STU004', name:'Suresh Kumar',  roll:'CS004', cardId:'RFID-7D5E4F' },
    { id:'STU005', name:'Meena Nayak',   roll:'CS005', cardId:'RFID-8E6F5G' },
    { id:'STU006', name:'Amit Verma',    roll:'CS006', cardId:'BIO-11223'   },
    { id:'STU007', name:'Sita Rao',      roll:'CS007', cardId:'BIO-22334'   },
    { id:'STU008', name:'Arjun Mehta',   roll:'CS008', cardId:'RFID-9F7G6H' },
    { id:'STU009', name:'Deepa Iyer',    roll:'CS009', cardId:'BIO-33445'   },
    { id:'STU010', name:'Kiran Bhat',    roll:'CS010', cardId:'RFID-0G8H7I' },
];
const STAFF = [
    { id:'TCH001', name:'Dr. Anjali Singh',   dept:'Computer Science', role:'Head of Department',  cardId:'BIO-78901'   },
    { id:'TCH002', name:'Prof. Rajan Mehta',  dept:'Mathematics',      role:'Associate Professor', cardId:'RFID-A1B2C3' },
    { id:'TCH003', name:'Ms. Kavita Rao',     dept:'English',          role:'Lecturer',            cardId:'BIO-45678'   },
    { id:'TCH004', name:'Dr. Sunil Patel',    dept:'Physics',          role:'Professor',           cardId:'RFID-D4E5F6' },
    { id:'TCH005', name:'Mrs. Lakshmi Nair',  dept:'Commerce',         role:'Senior Lecturer',     cardId:'BIO-12345'   },
    { id:'TCH006', name:'Mr. Vivek Kumar',    dept:'Electronics',      role:'Assistant Professor', cardId:'RFID-G7H8I9' },
    { id:'TCH007', name:'Dr. Priya Sharma',   dept:'Chemistry',        role:'Professor',           cardId:'BIO-56789'   },
    { id:'TCH008', name:'Mr. Arjun Menon',    dept:'History',          role:'Lecturer',            cardId:'RFID-J1K2L3' },
];
const DEVICES = [
    { id:'D1', name:'Main Gate',   method:'RFID',      location:'Main Entrance',  online:true,  lastPing:'1s ago' },
    { id:'D2', name:'Library',     method:'RFID',      location:'Library Block',  online:true,  lastPing:'2s ago' },
    { id:'D3', name:'Lab Block',   method:'Biometric', location:'Lab Block B',    online:true,  lastPing:'3s ago' },
    { id:'D4', name:'Hostel',      method:'Biometric', location:'Hostel Block A', online:false, lastPing:'4m ago' },
    { id:'D5', name:'Admin Block', method:'RFID',      location:'Admin Building', online:true,  lastPing:'1s ago' },
];
const SCAN_POOL = [
    { personId:'STU001', name:'Priya Sharma',     ptype:'Student', cardId:'RFID-4A2B1C', method:'RFID',      status:'Verified'     },
    { personId:'TCH001', name:'Dr. Anjali Singh', ptype:'Staff',   cardId:'BIO-78901',   method:'Biometric', status:'Verified'     },
    { personId:'STU002', name:'Rohan Das',         ptype:'Student', cardId:'RFID-5B3C2D', method:'RFID',     status:'Late'         },
    { personId:'STU003', name:'Ananya Patel',      ptype:'Student', cardId:'RFID-6C4D3E', method:'RFID',     status:'Verified'     },
    { personId:'TCH002', name:'Prof. Rajan Mehta', ptype:'Staff',  cardId:'RFID-A1B2C3', method:'RFID',     status:'Verified'     },
    { personId:'STU005', name:'Meena Nayak',       ptype:'Student', cardId:'RFID-8E6F5G', method:'RFID',     status:'Verified'     },
    { personId:'UNKN1',  name:'Unknown Card',      ptype:'Unknown', cardId:'RFID-XX1234', method:'RFID',     status:'Unrecognized' },
    { personId:'STU006', name:'Amit Verma',         ptype:'Student', cardId:'BIO-11223',  method:'Biometric', status:'Verified'    },
    { personId:'TCH003', name:'Ms. Kavita Rao',   ptype:'Staff',   cardId:'BIO-45678',   method:'Biometric', status:'Late'        },
    { personId:'STU008', name:'Arjun Mehta',       ptype:'Student', cardId:'RFID-9F7G6H', method:'RFID',    status:'Verified'     },
    { personId:'TCH004', name:'Dr. Sunil Patel',  ptype:'Staff',   cardId:'RFID-D4E5F6', method:'RFID',     status:'Verified'     },
    { personId:'STU004', name:'Suresh Kumar',      ptype:'Student', cardId:'RFID-7D5E4F', method:'RFID',    status:'Verified'     },
    { personId:'UNKN2',  name:'Bio Scan Failed',  ptype:'Unknown', cardId:'BIO-FAILED',  method:'Biometric',status:'Unrecognized' },
    { personId:'STU009', name:'Deepa Iyer',        ptype:'Student', cardId:'BIO-33445',  method:'Biometric', status:'Verified'    },
    { personId:'TCH005', name:'Mrs. Lakshmi Nair', ptype:'Staff',  cardId:'BIO-12345',  method:'Biometric', status:'Verified'    },
    { personId:'STU010', name:'Kiran Bhat',        ptype:'Student', cardId:'RFID-0G8H7I', method:'RFID',    status:'Late'        },
    { personId:'TCH006', name:'Mr. Vivek Kumar',  ptype:'Staff',   cardId:'RFID-G7H8I9', method:'RFID',    status:'Verified'     },
    { personId:'STU007', name:'Sita Rao',          ptype:'Student', cardId:'BIO-22334',  method:'Biometric', status:'Verified'   },
    { personId:'TCH007', name:'Dr. Priya Sharma', ptype:'Staff',   cardId:'BIO-56789',   method:'Biometric',status:'Verified'    },
    { personId:'TCH008', name:'Mr. Arjun Menon',  ptype:'Staff',   cardId:'RFID-J1K2L3', method:'RFID',    status:'Verified'     },
];
const INITIAL_LOGS = [
    { ...SCAN_POOL[0],  logId:'L-001', deviceId:'D1', deviceName:'Main Gate',   time:'08:52:10' },
    { ...SCAN_POOL[1],  logId:'L-002', deviceId:'D5', deviceName:'Admin Block', time:'08:54:33' },
    { ...SCAN_POOL[4],  logId:'L-003', deviceId:'D1', deviceName:'Main Gate',   time:'08:57:01' },
    { ...SCAN_POOL[6],  logId:'L-004', deviceId:'D2', deviceName:'Library',     time:'08:59:45' },
    { ...SCAN_POOL[14], logId:'L-005', deviceId:'D3', deviceName:'Lab Block',   time:'09:01:22' },
];
const COURSES = ['B.Sc Computer Science','B.Com Honours','B.A English','B.Tech ECE','B.Tech CSE'];
const TODAY   = new Date().toISOString().split('T')[0];
const REPORT  = STUDENTS.map((s,i) => ({ ...s, present:18+(i%8), total:26 }));
const STAFF_REPORT = STAFF.map((s,i) => ({ ...s, present:20+(i%6), total:26 }));

const SC = {
    Present: { icon:CheckCircle, color:'#059669', bg:'rgba(5,150,105,0.10)', border:'rgba(5,150,105,0.35)'  },
    Absent:  { icon:XCircle,    color:'#dc2626', bg:'rgba(220,38,38,0.10)', border:'rgba(220,38,38,0.35)'  },
    Late:    { icon:Clock,      color:'#d97706', bg:'rgba(217,119,6,0.10)', border:'rgba(217,119,6,0.35)'  },
};

/* ══════════════════════════════ COMPONENT ══════════════════════════════ */
export default function Attendance() {
    const [tab, setTab]       = useState('scanner');
    const [active, setActive] = useState(false);
    const [deviceId, setDeviceId] = useState('D1');
    const [scanLog, setScanLog]   = useState(INITIAL_LOGS);
    const [flashId, setFlashId]   = useState(null);
    const poolIdx  = useRef(5);
    const timerRef = useRef(null);

    const [date,   setDate]   = useState(TODAY);
    const [course, setCourse] = useState(COURSES[0]);
    const [attn,   setAttn]   = useState(Object.fromEntries(STUDENTS.map(s=>[s.id,'Present'])));
    const [saved,  setSaved]  = useState(false);
    const [saving, setSaving] = useState(false);

    const [sDate,     setSDate]     = useState(TODAY);
    const [staffAttn, setStaffAttn] = useState(Object.fromEntries(STAFF.map(s=>[s.id,'Present'])));
    const [sSaved,    setSSaved]    = useState(false);
    const [sSaving,   setSSaving]   = useState(false);

    useEffect(() => {
        if (active) {
            timerRef.current = setInterval(() => {
                const dev  = DEVICES.find(d=>d.id===deviceId) || DEVICES[0];
                const src  = SCAN_POOL[poolIdx.current % SCAN_POOL.length];
                poolIdx.current += 1;
                const entry = { ...src, logId:`L-${Date.now()}`, deviceId:dev.id, deviceName:dev.name, time:new Date().toLocaleTimeString('en-IN') };
                setScanLog(prev=>[entry,...prev].slice(0,80));
                setFlashId(entry.logId);
                setTimeout(()=>setFlashId(null), 700);
            }, 2600);
        } else { clearInterval(timerRef.current); }
        return () => clearInterval(timerRef.current);
    }, [active, deviceId]);

    const setStatus  = (id,s) => { setAttn(a=>({...a,[id]:s})); setSaved(false); };
    const markAll    = s => { setAttn(Object.fromEntries(STUDENTS.map(st=>[st.id,s]))); setSaved(false); };
    const handleSave = async () => { setSaving(true); await new Promise(r=>setTimeout(r,600)); setSaving(false); setSaved(true); };
    const setStStatus = (id,s) => { setStaffAttn(a=>({...a,[id]:s})); setSSaved(false); };
    const markAllSt   = s => { setStaffAttn(Object.fromEntries(STAFF.map(st=>[st.id,s]))); setSSaved(false); };
    const handleSSave = async () => { setSSaving(true); await new Promise(r=>setTimeout(r,600)); setSSaving(false); setSSaved(true); };

    const counts  = { present:Object.values(attn).filter(v=>v==='Present').length, absent:Object.values(attn).filter(v=>v==='Absent').length, late:Object.values(attn).filter(v=>v==='Late').length };
    const sCounts = { present:Object.values(staffAttn).filter(v=>v==='Present').length, absent:Object.values(staffAttn).filter(v=>v==='Absent').length, late:Object.values(staffAttn).filter(v=>v==='Late').length };
    const scanStats = { total:scanLog.length, verified:scanLog.filter(l=>l.status==='Verified').length, late:scanLog.filter(l=>l.status==='Late').length, unrecognized:scanLog.filter(l=>l.status==='Unrecognized').length };
    const onlineDevices = DEVICES.filter(d=>d.online).length;
    const device = DEVICES.find(d=>d.id===deviceId)||DEVICES[0];

    return (
        <div className="erp-page">
            <Navbar title="Attendance" subtitle="Real-time biometric & RFID tracking, manual marking and monthly reports" />

            {/* ── Hero KPI Cards ── */}
            <div style={S.heroGrid}>
                {[
                    { label:'Students Present', value:counts.present,  icon:UserCheck,  gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(16,185,129,0.28)', sub:`${STUDENTS.length-counts.present} absent · ${counts.late} late` },
                    { label:'Staff Present',    value:sCounts.present, icon:Users,      gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  sub:`${STAFF.length-sCounts.present} absent today` },
                    { label:'Active Devices',   value:onlineDevices,   icon:Activity,   gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(139,92,246,0.28)', sub:`${DEVICES.length-onlineDevices} offline` },
                    { label:'Scans Today',      value:scanStats.total, icon:Radio,      gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', sub:`${scanStats.verified} verified · ${scanStats.unrecognized} unknown` },
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

            {/* ── Tab Bar ── */}
            <div style={S.tabBar}>
                {[
                    { key:'scanner', label:'Live Scanner',       icon:Radio    },
                    { key:'mark',    label:'Student Attendance', icon:UserCheck },
                    { key:'staff',   label:'Staff Attendance',   icon:Users    },
                    { key:'report',  label:'Reports',            icon:BarChart3 },
                ].map(t => {
                    const active = tab === t.key;
                    return (
                        <button key={t.key}
                            style={{ ...S.tab, ...(active ? S.tabActive : {}) }}
                            onClick={()=>setTab(t.key)}
                        >
                            <t.icon size={15} strokeWidth={active?2.5:2}/>
                            {t.label}
                            {active && <span style={S.tabDot}/>}
                        </button>
                    );
                })}
            </div>

            {/* ════════════════════════════════════════
                LIVE SCANNER
            ════════════════════════════════════════ */}
            {tab === 'scanner' && (
                <>
                    {/* Scan stats chips */}
                    <div style={S.scanChips}>
                        {[
                            { icon:CheckCircle,   label:'Verified',     val:scanStats.verified,     color:'#059669', bg:'rgba(5,150,105,0.10)',  border:'rgba(5,150,105,0.25)'  },
                            { icon:Clock,         label:'Late',         val:scanStats.late,         color:'#d97706', bg:'rgba(217,119,6,0.10)',  border:'rgba(217,119,6,0.25)'  },
                            { icon:AlertTriangle, label:'Unrecognized', val:scanStats.unrecognized, color:'#dc2626', bg:'rgba(220,38,38,0.10)',  border:'rgba(220,38,38,0.25)'  },
                            { icon:Activity,      label:'Total Scans',  val:scanStats.total,        color:'#2563eb', bg:'rgba(37,99,235,0.10)',  border:'rgba(37,99,235,0.25)'  },
                        ].map(c => (
                            <div key={c.label} style={{ ...S.scanChip, background:c.bg, border:`1px solid ${c.border}` }}>
                                <c.icon size={14} color={c.color}/>
                                <span style={{ color:c.color, fontWeight:700 }}>{c.val}</span>
                                <span style={{ fontSize:'0.7rem', color:c.color, opacity:0.8 }}>{c.label}</span>
                            </div>
                        ))}
                    </div>

                    <div style={S.scannerLayout}>
                        {/* ── Left: Device Panel ── */}
                        <div style={S.devicePanel}>

                            {/* Control card */}
                            <div className="card" style={{ marginBottom:14 }}>
                                <div style={S.controlHeader}>
                                    <div>
                                        <div style={S.controlTitle}>Scanner Control</div>
                                        <div style={S.controlSub}>Select device & start scanning</div>
                                    </div>
                                    <div style={{ ...S.livePill, background:active?'rgba(220,38,38,0.10)':'rgba(100,116,139,0.10)', color:active?'#dc2626':'#64748b', border:`1px solid ${active?'rgba(220,38,38,0.3)':'rgba(100,116,139,0.2)'}` }}>
                                        {active ? <><span style={S.livePulse}/>LIVE</> : '● IDLE'}
                                    </div>
                                </div>

                                <div style={{ padding:'14px 16px', display:'flex', flexDirection:'column', gap:12 }}>
                                    <div>
                                        <div style={S.fieldLbl}>Select Device</div>
                                        <select style={S.sel} value={deviceId} onChange={e=>setDeviceId(e.target.value)}>
                                            {DEVICES.map(d=>(
                                                <option key={d.id} value={d.id} disabled={!d.online}>
                                                    {d.name} — {d.method}{!d.online?' (Offline)':''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Device info */}
                                    <div style={{ ...S.deviceInfoCard, borderColor: device.online?'rgba(5,150,105,0.25)':'rgba(220,38,38,0.25)', background: device.online?'rgba(5,150,105,0.04)':'rgba(220,38,38,0.04)' }}>
                                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                                            {device.method==='RFID'
                                                ? <CreditCard size={15} color="#2563eb"/>
                                                : <Fingerprint size={15} color="#7c3aed"/>
                                            }
                                            <span style={{ fontWeight:700, fontSize:'0.83rem', color:'var(--text-primary)' }}>{device.method} Reader</span>
                                        </div>
                                        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:'0.7rem', color:'var(--text-muted)', marginBottom:8 }}>
                                            <MapPin size={10}/>{device.location}
                                        </div>
                                        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                                            <div style={{ width:8, height:8, borderRadius:'50%', background:device.online?'#059669':'#dc2626', boxShadow:device.online?'0 0 0 3px rgba(5,150,105,0.2)':'none' }}/>
                                            <span style={{ fontSize:'0.7rem', fontWeight:600, color:device.online?'#059669':'#dc2626' }}>
                                                {device.online?'Online':'Offline'} · Ping {device.lastPing}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        style={{ ...S.startBtn, background:active?'linear-gradient(135deg,#b91c1c,#dc2626)':'linear-gradient(135deg,#1e40af,#2563eb)', opacity:device.online?1:0.5 }}
                                        onClick={()=>setActive(v=>!v)}
                                        disabled={!device.online}
                                    >
                                        {active ? <><span style={S.pulseDot}/>Stop Scanning</> : <><Radio size={14}/>Start Scanning</>}
                                    </button>

                                    <button style={S.clearBtn} onClick={()=>setScanLog([])}>
                                        <Trash2 size={13}/> Clear Log
                                    </button>
                                </div>
                            </div>

                            {/* Devices list */}
                            <div className="card">
                                <div style={S.devicesHeader}>
                                    <span style={{ fontWeight:700, fontSize:'0.84rem' }}>All Devices</span>
                                    <span style={{ fontSize:'0.71rem', padding:'3px 9px', borderRadius:6, background:'rgba(5,150,105,0.09)', color:'#059669', fontWeight:700 }}>{onlineDevices}/{DEVICES.length} online</span>
                                </div>
                                {DEVICES.map(d => (
                                    <div key={d.id} style={{ ...S.deviceRow, background:deviceId===d.id?'rgba(37,99,235,0.04)':'transparent', cursor:'pointer' }} onClick={()=>d.online&&setDeviceId(d.id)}>
                                        <div style={{ width:9, height:9, borderRadius:'50%', background:d.online?'#059669':'#dc2626', flexShrink:0, boxShadow:d.online?'0 0 0 3px rgba(5,150,105,0.18)':'none' }}/>
                                        <div style={{ flex:1 }}>
                                            <div style={{ fontSize:'0.79rem', fontWeight:600, color:'var(--text-primary)' }}>{d.name}</div>
                                            <div style={{ fontSize:'0.67rem', color:'var(--text-muted)', marginTop:1 }}>{d.method} · {d.location}</div>
                                        </div>
                                        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
                                            <span style={{ fontSize:'0.62rem', fontWeight:700, padding:'2px 7px', borderRadius:5, background:d.online?'rgba(5,150,105,0.10)':'rgba(220,38,38,0.10)', color:d.online?'#059669':'#dc2626' }}>
                                                {d.online?'Online':'Offline'}
                                            </span>
                                            {d.method==='RFID' ? <CreditCard size={11} color="#2563eb"/> : <Fingerprint size={11} color="#7c3aed"/>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Right: Live Log ── */}
                        <div className="card" style={{ minHeight:500 }}>
                            <div style={S.logHeader}>
                                <div>
                                    <div style={{ fontWeight:800, fontSize:'0.92rem', color:'var(--text-primary)', display:'flex', alignItems:'center', gap:8 }}>
                                        Live Scan Feed
                                        <span style={{ background:'#2563eb', color:'white', fontSize:'0.6rem', fontWeight:700, padding:'2px 7px', borderRadius:99 }}>{scanLog.length}</span>
                                    </div>
                                    <div style={{ fontSize:'0.71rem', color:'var(--text-muted)', marginTop:3 }}>
                                        {active ? '● Scanning… entries appear automatically' : '○ Scanner idle — press Start to begin'}
                                    </div>
                                </div>
                                {active && (
                                    <div style={S.liveTag}>
                                        <span style={S.livePulse}/>LIVE
                                    </div>
                                )}
                            </div>

                            <div style={S.logFeed}>
                                {scanLog.length===0 && (
                                    <div style={{ textAlign:'center', padding:'60px 20px', color:'var(--text-muted)' }}>
                                        <Radio size={40} style={{ opacity:0.2, marginBottom:12 }}/>
                                        <p style={{ fontSize:'0.82rem' }}>No scans yet. Start the scanner to begin logging.</p>
                                    </div>
                                )}
                                {scanLog.map(entry => {
                                    const isFlash = flashId === entry.logId;
                                    const sColor  = entry.status==='Verified'?'#059669':entry.status==='Late'?'#d97706':'#dc2626';
                                    const sBg     = entry.status==='Verified'?'rgba(5,150,105,0.09)':entry.status==='Late'?'rgba(217,119,6,0.09)':'rgba(220,38,38,0.09)';
                                    const mColor  = entry.method==='RFID'?'#2563eb':'#7c3aed';
                                    return (
                                        <div key={entry.logId} style={{ ...S.logRow, ...(isFlash?S.logFlash:{}) }}>
                                            <div style={{ ...S.logAvatar, background:entry.ptype==='Unknown'?'#94a3b8':getAvatarColor(entry.name) }}>
                                                {entry.ptype==='Unknown'?'?':entry.name[0]}
                                            </div>
                                            <div style={{ flex:1, minWidth:0 }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:7, flexWrap:'wrap' }}>
                                                    <span style={{ fontWeight:700, fontSize:'0.84rem', color:'var(--text-primary)' }}>{entry.name}</span>
                                                    <span style={{ fontSize:'0.62rem', fontWeight:700, padding:'2px 8px', borderRadius:5, background:entry.ptype==='Student'?'rgba(37,99,235,0.10)':entry.ptype==='Staff'?'rgba(5,150,105,0.10)':'rgba(100,116,139,0.12)', color:entry.ptype==='Student'?'#2563eb':entry.ptype==='Staff'?'#059669':'#64748b' }}>
                                                        {entry.ptype}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:3, display:'flex', gap:8 }}>
                                                    <span style={{ fontFamily:'monospace' }}>{entry.cardId}</span>
                                                    <span>·</span>
                                                    <span>{entry.deviceName}</span>
                                                </div>
                                            </div>
                                            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5, flexShrink:0 }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.68rem', fontWeight:700, color:mColor }}>
                                                    {entry.method==='RFID'?<CreditCard size={11}/>:<Fingerprint size={11}/>}{entry.method}
                                                </div>
                                                <span style={{ fontSize:'0.66rem', fontWeight:700, padding:'2px 8px', borderRadius:5, background:sBg, color:sColor }}>{entry.status}</span>
                                            </div>
                                            <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'monospace', flexShrink:0, minWidth:64, textAlign:'right' }}>{entry.time}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ════════════════════════════════════════
                STUDENT ATTENDANCE
            ════════════════════════════════════════ */}
            {tab === 'mark' && (
                <>
                    {/* Filters */}
                    <div style={S.filterBar}>
                        <div style={S.filterGroup}>
                            <label style={S.fieldLbl}>Date</label>
                            <input type="date" style={S.sel} value={date} onChange={e=>setDate(e.target.value)}/>
                        </div>
                        <div style={{ ...S.filterGroup, flex:1, maxWidth:320 }}>
                            <label style={S.fieldLbl}>Course</label>
                            <select style={S.sel} value={course} onChange={e=>setCourse(e.target.value)}>
                                {COURSES.map(c=><option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div style={{ display:'flex', gap:8, alignSelf:'flex-end' }}>
                            <button style={{ ...S.markBtn, background:'rgba(5,150,105,0.10)', color:'#059669', border:'1px solid rgba(5,150,105,0.3)' }} onClick={()=>markAll('Present')}><CheckCircle size={13}/> All Present</button>
                            <button style={{ ...S.markBtn, background:'rgba(220,38,38,0.10)', color:'#dc2626', border:'1px solid rgba(220,38,38,0.3)' }} onClick={()=>markAll('Absent')}><XCircle size={13}/> All Absent</button>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div style={S.progressCard}>
                        <div style={S.progressRow}>
                            {[
                                { label:'Present', val:counts.present, total:STUDENTS.length, color:'#059669', bg:'rgba(5,150,105,0.10)' },
                                { label:'Absent',  val:counts.absent,  total:STUDENTS.length, color:'#dc2626', bg:'rgba(220,38,38,0.10)' },
                                { label:'Late',    val:counts.late,    total:STUDENTS.length, color:'#d97706', bg:'rgba(217,119,6,0.10)'  },
                            ].map(s=>(
                                <div key={s.label} style={{ ...S.progressStat, background:s.bg }}>
                                    <span style={{ fontSize:'1.4rem', fontWeight:900, fontFamily:'var(--font-display)', color:s.color }}>{s.val}</span>
                                    <span style={{ fontSize:'0.68rem', fontWeight:600, color:s.color }}>{s.label}</span>
                                    <span style={{ fontSize:'0.62rem', color:'var(--text-muted)' }}>{Math.round(s.val/STUDENTS.length*100)}%</span>
                                </div>
                            ))}
                            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                                <div style={{ display:'flex', height:10, borderRadius:99, overflow:'hidden', gap:2 }}>
                                    <div style={{ width:`${counts.present/STUDENTS.length*100}%`, background:'#059669', borderRadius:'99px 0 0 99px' }}/>
                                    <div style={{ width:`${counts.late/STUDENTS.length*100}%`, background:'#d97706' }}/>
                                    <div style={{ flex:1, background:'rgba(220,38,38,0.3)', borderRadius:'0 99px 99px 0' }}/>
                                </div>
                                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>
                                    {new Date(date).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · {course}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        <div style={{ overflowX:'auto' }}>
                            {STUDENTS.map((s,i) => {
                                const status = attn[s.id];
                                return (
                                    <div key={s.id} style={{ ...S.attRow, background:status==='Absent'?'rgba(220,38,38,0.025)':status==='Late'?'rgba(217,119,6,0.025)':'white' }}>
                                        <span style={S.attNum}>{String(i+1).padStart(2,'0')}</span>
                                        <div style={S.attAvatarWrap}>
                                            <div style={{ ...S.attAvatar, background:getAvatarColor(s.name) }}>{s.name[0]}</div>
                                            <div>
                                                <div style={{ fontWeight:700, fontSize:'0.84rem', color:'var(--text-primary)' }}>{s.name}</div>
                                                <div style={{ fontSize:'0.67rem', color:'var(--text-muted)', marginTop:2 }}>Roll: {s.roll} · <span style={{ fontFamily:'monospace' }}>{s.cardId}</span></div>
                                            </div>
                                        </div>
                                        <div style={S.attBtns}>
                                            {Object.entries(SC).map(([label,cfg]) => {
                                                const Icon = cfg.icon;
                                                const on = status===label;
                                                return (
                                                    <button key={label} onClick={()=>setStatus(s.id,label)}
                                                        style={{ ...S.attBtn, ...(on?{ background:cfg.bg, color:cfg.color, border:`1.5px solid ${cfg.border}`, fontWeight:700 }:{}) }}
                                                    >
                                                        <Icon size={12}/>{label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div style={S.saveFooter}>
                            {saved && <span style={{ fontSize:'0.8rem', color:'#059669', fontWeight:700 }}>✓ Attendance saved successfully</span>}
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving?<><span className="spinner"/> Saving…</>:<><Save size={14}/> Save Attendance</>}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ════════════════════════════════════════
                STAFF ATTENDANCE
            ════════════════════════════════════════ */}
            {tab === 'staff' && (
                <>
                    <div style={S.filterBar}>
                        <div style={S.filterGroup}>
                            <label style={S.fieldLbl}>Date</label>
                            <input type="date" style={S.sel} value={sDate} onChange={e=>setSDate(e.target.value)}/>
                        </div>
                        <div style={{ display:'flex', gap:8, alignSelf:'flex-end' }}>
                            <button style={{ ...S.markBtn, background:'rgba(5,150,105,0.10)', color:'#059669', border:'1px solid rgba(5,150,105,0.3)' }} onClick={()=>markAllSt('Present')}><CheckCircle size={13}/> All Present</button>
                            <button style={{ ...S.markBtn, background:'rgba(220,38,38,0.10)', color:'#dc2626', border:'1px solid rgba(220,38,38,0.3)' }} onClick={()=>markAllSt('Absent')}><XCircle size={13}/> All Absent</button>
                        </div>
                    </div>

                    <div style={S.progressCard}>
                        <div style={S.progressRow}>
                            {[
                                { label:'Present', val:sCounts.present, total:STAFF.length, color:'#059669', bg:'rgba(5,150,105,0.10)' },
                                { label:'Absent',  val:sCounts.absent,  total:STAFF.length, color:'#dc2626', bg:'rgba(220,38,38,0.10)' },
                                { label:'Late',    val:sCounts.late,    total:STAFF.length, color:'#d97706', bg:'rgba(217,119,6,0.10)'  },
                            ].map(s=>(
                                <div key={s.label} style={{ ...S.progressStat, background:s.bg }}>
                                    <span style={{ fontSize:'1.4rem', fontWeight:900, fontFamily:'var(--font-display)', color:s.color }}>{s.val}</span>
                                    <span style={{ fontSize:'0.68rem', fontWeight:600, color:s.color }}>{s.label}</span>
                                    <span style={{ fontSize:'0.62rem', color:'var(--text-muted)' }}>{Math.round(s.val/STAFF.length*100)}%</span>
                                </div>
                            ))}
                            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:6 }}>
                                <div style={{ display:'flex', height:10, borderRadius:99, overflow:'hidden', gap:2 }}>
                                    <div style={{ width:`${sCounts.present/STAFF.length*100}%`, background:'#059669', borderRadius:'99px 0 0 99px' }}/>
                                    <div style={{ width:`${sCounts.late/STAFF.length*100}%`, background:'#d97706' }}/>
                                    <div style={{ flex:1, background:'rgba(220,38,38,0.3)', borderRadius:'0 99px 99px 0' }}/>
                                </div>
                                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)' }}>
                                    {new Date(sDate).toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})} · Faculty & Staff
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card">
                        {STAFF.map((s,i) => {
                            const status = staffAttn[s.id];
                            return (
                                <div key={s.id} style={{ ...S.attRow, background:status==='Absent'?'rgba(220,38,38,0.025)':status==='Late'?'rgba(217,119,6,0.025)':'white' }}>
                                    <span style={S.attNum}>{String(i+1).padStart(2,'0')}</span>
                                    <div style={S.attAvatarWrap}>
                                        <div style={{ ...S.attAvatar, background:getAvatarColor(s.name) }}>{s.name[0]}</div>
                                        <div>
                                            <div style={{ fontWeight:700, fontSize:'0.84rem', color:'var(--text-primary)' }}>{s.name}</div>
                                            <div style={{ fontSize:'0.67rem', color:'var(--text-muted)', marginTop:2 }}>{s.role} · {s.dept}</div>
                                        </div>
                                    </div>
                                    <div style={S.attBtns}>
                                        {Object.entries(SC).map(([label,cfg]) => {
                                            const Icon = cfg.icon;
                                            const on = status===label;
                                            return (
                                                <button key={label} onClick={()=>setStStatus(s.id,label)}
                                                    style={{ ...S.attBtn, ...(on?{ background:cfg.bg, color:cfg.color, border:`1.5px solid ${cfg.border}`, fontWeight:700 }:{}) }}
                                                >
                                                    <Icon size={12}/>{label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                        <div style={S.saveFooter}>
                            {sSaved && <span style={{ fontSize:'0.8rem', color:'#059669', fontWeight:700 }}>✓ Staff attendance saved successfully</span>}
                            <button className="btn btn-primary" onClick={handleSSave} disabled={sSaving}>
                                {sSaving?<><span className="spinner"/> Saving…</>:<><Save size={14}/> Save Attendance</>}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* ════════════════════════════════════════
                REPORTS
            ════════════════════════════════════════ */}
            {tab === 'report' && (
                <>
                    <div className="card" style={{ marginBottom:18 }}>
                        <div className="card-header">
                            <div><h2>Student Monthly Report</h2><p>Student-wise attendance summary</p></div>
                            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                                <select style={S.sel} defaultValue={COURSES[0]}>{COURSES.map(c=><option key={c}>{c}</option>)}</select>
                                <input type="month" style={S.sel} defaultValue="2026-06"/>
                                <ExportMenu title="Student_Attendance" rows={REPORT} columns={[
                                    { label:'Student', key:'name' }, { label:'Roll No', key:'roll' },
                                    { label:'Present', key:'present' }, { label:'Absent', key:'total', value: r => r.total - r.present },
                                    { label:'Total', key:'total' }, { label:'Attendance %', key:'total', value: r => `${Math.round(r.present/r.total*100)}%` },
                                    { label:'Eligibility', key:'total', value: r => Math.round(r.present/r.total*100)>=75?'Eligible':'Not Eligible' },
                                ]} />
                            </div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead><tr><th>Student</th><th>Roll No</th><th>Present</th><th>Absent</th><th>Total</th><th>Attendance %</th><th>Eligibility</th></tr></thead>
                                <tbody>
                                    {REPORT.map(r => {
                                        const pct = Math.round(r.present/r.total*100);
                                        const ok  = pct>=75;
                                        return (
                                            <tr key={r.id}>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ ...S.reportAvatar, background:getAvatarColor(r.name) }}>{r.name[0]}</div>
                                                        <span style={{ fontWeight:600, fontSize:'0.84rem' }}>{r.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ fontFamily:'monospace', fontSize:'0.8rem' }}>{r.roll}</td>
                                                <td style={{ color:'#059669', fontWeight:700 }}>{r.present}</td>
                                                <td style={{ color:'#dc2626', fontWeight:700 }}>{r.total-r.present}</td>
                                                <td>{r.total}</td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                        <div style={{ width:80, height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                            <div style={{ height:'100%', width:`${pct}%`, background:ok?'#059669':'#dc2626', borderRadius:99 }}/>
                                                        </div>
                                                        <span style={{ fontWeight:700, color:ok?'#059669':'#dc2626', fontSize:'0.8rem' }}>{pct}%</span>
                                                    </div>
                                                </td>
                                                <td><span className={`badge ${ok?'badge-success':'badge-danger'}`}>{ok?'Eligible':'Shortage'}</span></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <div><h2>Staff Monthly Report</h2><p>Faculty & staff attendance summary</p></div>
                            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                                <input type="month" style={S.sel} defaultValue="2026-06"/>
                                <ExportMenu title="Staff_Attendance" rows={STAFF_REPORT} columns={[
                                    { label:'Staff Member', key:'name' }, { label:'Department', key:'dept' },
                                    { label:'Role', key:'role' }, { label:'Present', key:'present' },
                                    { label:'Absent', key:'total', value: r => r.total - r.present },
                                    { label:'Attendance %', key:'total', value: r => `${Math.round(r.present/r.total*100)}%` },
                                ]} />
                            </div>
                        </div>
                        <div style={{ overflowX:'auto' }}>
                            <table>
                                <thead><tr><th>Staff Member</th><th>Department</th><th>Role</th><th>Present</th><th>Absent</th><th>Attendance %</th></tr></thead>
                                <tbody>
                                    {STAFF_REPORT.map(r => {
                                        const pct = Math.round(r.present/r.total*100);
                                        return (
                                            <tr key={r.id}>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                                                        <div style={{ ...S.reportAvatar, background:getAvatarColor(r.name) }}>{r.name[0]}</div>
                                                        <span style={{ fontWeight:600, fontSize:'0.84rem' }}>{r.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ fontSize:'0.8rem' }}>{r.dept}</td>
                                                <td><span className="badge badge-neutral" style={{ fontSize:'0.66rem' }}>{r.role}</span></td>
                                                <td style={{ color:'#059669', fontWeight:700 }}>{r.present}</td>
                                                <td style={{ color:'#dc2626', fontWeight:700 }}>{r.total-r.present}</td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                        <div style={{ width:80, height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                            <div style={{ height:'100%', width:`${pct}%`, background:pct>=90?'#059669':'#d97706', borderRadius:99 }}/>
                                                        </div>
                                                        <span style={{ fontWeight:700, color:pct>=90?'#059669':'#d97706', fontSize:'0.8rem' }}>{pct}%</span>
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
                @keyframes scanFlash { 0%{background:#fefce8} 100%{background:white} }
                @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
                @media(max-width:900px){ .scanner-layout{grid-template-columns:1fr!important;} }
            `}</style>
        </div>
    );
}

/* ══ STYLES ══ */
const S = {
    /* Hero */
    heroGrid:   { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:18 },
    heroCard:   { borderRadius:14, padding:'18px 20px 14px', position:'relative', overflow:'hidden', color:'white' },
    heroTop:    { display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 },
    heroIconBox:{ width:40, height:40, borderRadius:11, background:'rgba(255,255,255,0.18)', display:'grid', placeItems:'center' },
    heroVal:    { fontSize:'1.9rem', fontFamily:'var(--font-display)', fontWeight:900 },
    heroLbl:    { fontSize:'0.76rem', fontWeight:600, opacity:0.9, marginBottom:2 },
    heroSub:    { fontSize:'0.64rem', opacity:0.55 },
    heroShine:  { position:'absolute', top:0, right:0, width:'45%', height:'100%', background:'rgba(255,255,255,0.055)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' },

    /* Tab bar */
    tabBar: { display:'flex', alignItems:'center', gap:2, background:'white', border:'1px solid var(--border)', borderRadius:12, padding:'6px 8px', marginBottom:18, boxShadow:'var(--shadow-sm)' },
    tab:    { display:'inline-flex', alignItems:'center', gap:7, padding:'9px 18px', borderRadius:9, border:'none', background:'none', color:'var(--text-muted)', fontSize:'0.82rem', fontWeight:600, cursor:'pointer', transition:'all 0.15s', position:'relative' },
    tabActive: { background:'rgba(37,99,235,0.08)', color:'#2563eb' },
    tabDot:    { position:'absolute', bottom:5, left:'50%', transform:'translateX(-50%)', width:4, height:4, borderRadius:'50%', background:'#2563eb' },

    /* Scan chips */
    scanChips: { display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' },
    scanChip:  { display:'flex', alignItems:'center', gap:7, padding:'8px 16px', borderRadius:99, fontSize:'0.78rem' },

    /* Scanner layout */
    scannerLayout: { display:'grid', gridTemplateColumns:'280px 1fr', gap:16, alignItems:'flex-start' },
    devicePanel:   { display:'flex', flexDirection:'column', gap:0 },

    /* Scanner control card */
    controlHeader: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'14px 16px 10px', borderBottom:'1px solid #f1f5f9' },
    controlTitle:  { fontWeight:800, fontSize:'0.88rem', color:'var(--text-primary)' },
    controlSub:    { fontSize:'0.67rem', color:'var(--text-muted)', marginTop:2 },
    livePill:      { display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20, fontSize:'0.68rem', fontWeight:800, letterSpacing:'0.06em', flexShrink:0 },
    livePulse:     { display:'inline-block', width:7, height:7, borderRadius:'50%', background:'currentColor', animation:'pulse 0.9s ease-in-out infinite' },

    /* Inputs */
    sel:      { padding:'8px 11px', border:'1.5px solid var(--border)', borderRadius:9, background:'white', fontSize:'0.8rem', color:'var(--text-primary)', outline:'none', cursor:'pointer', width:'100%' },
    fieldLbl: { fontSize:'0.7rem', fontWeight:600, color:'var(--text-secondary)', marginBottom:5 },

    deviceInfoCard: { border:'1.5px solid', borderRadius:10, padding:'10px 13px' },
    startBtn:       { display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', padding:'10px', borderRadius:10, border:'none', color:'white', fontSize:'0.82rem', fontWeight:700, cursor:'pointer', transition:'opacity 0.2s' },
    clearBtn:       { display:'flex', alignItems:'center', justifyContent:'center', gap:7, width:'100%', padding:'8px', borderRadius:10, border:'1px solid var(--border)', background:'white', color:'var(--text-muted)', fontSize:'0.78rem', fontWeight:600, cursor:'pointer' },
    pulseDot:       { width:8, height:8, borderRadius:'50%', background:'white', animation:'pulse 0.8s ease-in-out infinite' },

    devicesHeader: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid #f1f5f9' },
    deviceRow:     { display:'flex', alignItems:'center', gap:10, padding:'10px 16px', borderBottom:'1px solid #f8fafc', transition:'background 0.15s' },

    /* Log */
    logHeader: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'14px 18px', borderBottom:'1px solid #f1f5f9' },
    liveTag:   { display:'flex', alignItems:'center', gap:5, padding:'4px 10px', borderRadius:20, background:'rgba(220,38,38,0.09)', border:'1px solid rgba(220,38,38,0.25)', fontSize:'0.68rem', fontWeight:800, color:'#dc2626', letterSpacing:'0.06em' },
    logFeed:   { overflowY:'auto', maxHeight:520 },
    logRow:    { display:'flex', alignItems:'center', gap:12, padding:'11px 18px', borderBottom:'1px solid #f8fafc', transition:'background 0.3s' },
    logFlash:  { animation:'scanFlash 0.7s ease-out' },
    logAvatar: { width:36, height:36, borderRadius:10, display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.88rem', flexShrink:0 },

    /* Attendance */
    filterBar:   { display:'flex', gap:14, alignItems:'flex-end', marginBottom:14, flexWrap:'wrap' },
    filterGroup: { display:'flex', flexDirection:'column', gap:4 },
    markBtn:     { display:'inline-flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:9, fontSize:'0.78rem', fontWeight:700, cursor:'pointer' },

    progressCard: { background:'white', border:'1px solid var(--border)', borderRadius:12, padding:'16px 20px', marginBottom:14, boxShadow:'var(--shadow-sm)' },
    progressRow:  { display:'flex', alignItems:'center', gap:14 },
    progressStat: { display:'flex', flexDirection:'column', alignItems:'center', gap:2, padding:'10px 18px', borderRadius:10, minWidth:80 },

    attRow:       { display:'flex', alignItems:'center', gap:14, padding:'12px 20px', borderBottom:'1px solid #f8fafc', transition:'background 0.15s' },
    attNum:       { fontSize:'0.72rem', color:'var(--text-muted)', fontFamily:'monospace', width:22, flexShrink:0 },
    attAvatarWrap:{ display:'flex', alignItems:'center', gap:10, flex:1, minWidth:0 },
    attAvatar:    { width:36, height:36, borderRadius:10, display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.88rem', flexShrink:0 },
    attBtns:      { display:'flex', gap:6, flexShrink:0 },
    attBtn:       { display:'inline-flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:8, border:'1.5px solid var(--border)', background:'white', fontSize:'0.75rem', fontWeight:500, color:'var(--text-muted)', cursor:'pointer', transition:'all 0.12s' },

    saveFooter: { display:'flex', justifyContent:'flex-end', alignItems:'center', gap:14, padding:'14px 20px', borderTop:'1px solid var(--border)', background:'#fafbfc' },

    reportAvatar: { width:32, height:32, borderRadius:8, display:'grid', placeItems:'center', color:'white', fontWeight:800, fontSize:'0.82rem', flexShrink:0 },
};
