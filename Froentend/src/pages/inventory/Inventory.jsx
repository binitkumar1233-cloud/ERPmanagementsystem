import { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import {
    Package, FlaskConical, BookOpen, Pencil, LayoutDashboard,
    Search, Plus, Download, Eye, Edit2, Trash2, CheckCircle2,
    AlertTriangle, ShoppingCart, Wrench, TrendingDown, Archive,
    IndianRupee, Calendar, RefreshCw, ClipboardCheck, X,
} from 'lucide-react';

const CATS = [
    { key: 'All',        label: 'All Assets',   icon: Package,        color: '#475569', bg: '#f1f5f9' },
    { key: 'Laboratory', label: 'Laboratory',   icon: FlaskConical,   color: '#7c3aed', bg: '#ede9fe' },
    { key: 'Books',      label: 'Books',        icon: BookOpen,       color: '#1e40af', bg: '#dbeafe' },
    { key: 'Stationery', label: 'Stationery',   icon: Pencil,         color: '#059669', bg: '#d1fae5' },
    { key: 'Furniture',  label: 'Furniture',    icon: LayoutDashboard,color: '#d97706', bg: '#fef3c7' },
];

const INIT_ASSETS = [
    { id:'AST001', name:'Digital Oscilloscope',           category:'Laboratory', dept:'Electronics', qty:8,   minQty:5,  unit:'units',  condition:'Good', location:'Electronics Lab',    valuePerUnit:45000, purchaseDate:'2024-03-15', status:'Active'    },
    { id:'AST002', name:'Microscope (40x–1000x)',          category:'Laboratory', dept:'Biology',     qty:12,  minQty:8,  unit:'units',  condition:'Good', location:'Biology Lab',        valuePerUnit:18000, purchaseDate:'2023-08-20', status:'Active'    },
    { id:'AST003', name:'Bunsen Burner',                   category:'Laboratory', dept:'Chemistry',   qty:24,  minQty:10, unit:'units',  condition:'Fair', location:'Chemistry Lab',      valuePerUnit:1500,  purchaseDate:'2022-06-10', status:'Active'    },
    { id:'AST004', name:'Graduated Cylinder Set',          category:'Laboratory', dept:'Chemistry',   qty:3,   minQty:6,  unit:'sets',   condition:'Fair', location:'Chemistry Lab',      valuePerUnit:800,   purchaseDate:'2021-03-20', status:'Low Stock' },
    { id:'AST005', name:'Projector Screen (100 inch)',     category:'Laboratory', dept:'Admin',       qty:12,  minQty:5,  unit:'units',  condition:'Good', location:'Classrooms',         valuePerUnit:8500,  purchaseDate:'2023-09-15', status:'Active'    },
    { id:'AST006', name:'Data Structures & Algorithms',   category:'Books',      dept:'Library',     qty:45,  minQty:20, unit:'copies', condition:'Good', location:'CS Section',          valuePerUnit:650,   purchaseDate:'2025-01-12', status:'Active'    },
    { id:'AST007', name:'Engineering Mathematics Vol 1',  category:'Books',      dept:'Library',     qty:60,  minQty:25, unit:'copies', condition:'Good', location:'Mathematics Section', valuePerUnit:580,   purchaseDate:'2024-11-20', status:'Active'    },
    { id:'AST008', name:'Financial Accounting Principles',category:'Books',      dept:'Library',     qty:30,  minQty:15, unit:'copies', condition:'Fair', location:'Commerce Section',    valuePerUnit:520,   purchaseDate:'2023-03-08', status:'Active'    },
    { id:'AST009', name:'NCERT Reference Books Set',      category:'Books',      dept:'Library',     qty:8,   minQty:15, unit:'sets',   condition:'Good', location:'Reference Section',   valuePerUnit:2200,  purchaseDate:'2025-06-01', status:'Low Stock' },
    { id:'AST010', name:'A4 Copy Paper (500 sheets)',     category:'Stationery', dept:'Admin',       qty:120, minQty:30, unit:'reams',  condition:'New',  location:'Store Room',          valuePerUnit:320,   purchaseDate:'2026-04-01', status:'Active'    },
    { id:'AST011', name:'Whiteboard Marker Set',          category:'Stationery', dept:'Admin',       qty:8,   minQty:10, unit:'boxes',  condition:'Good', location:'Store Room',          valuePerUnit:450,   purchaseDate:'2026-03-15', status:'Low Stock' },
    { id:'AST012', name:'Printer Ink Cartridge (Black)',  category:'Stationery', dept:'Admin',       qty:4,   minQty:10, unit:'units',  condition:'New',  location:'Store Room',          valuePerUnit:1200,  purchaseDate:'2026-04-10', status:'Low Stock' },
    { id:'AST013', name:'Chalk Box (White)',              category:'Stationery', dept:'Admin',       qty:60,  minQty:20, unit:'boxes',  condition:'New',  location:'Store Room',          valuePerUnit:45,    purchaseDate:'2026-05-01', status:'Active'    },
    { id:'AST014', name:'Student Desk & Chair Set',       category:'Furniture',  dept:'Admin',       qty:320, minQty:50, unit:'sets',   condition:'Good', location:'Classrooms',          valuePerUnit:3500,  purchaseDate:'2022-07-15', status:'Active'    },
    { id:'AST015', name:'Faculty Chair (Revolving)',      category:'Furniture',  dept:'Admin',       qty:45,  minQty:10, unit:'units',  condition:'Good', location:'Staff Rooms',         valuePerUnit:4200,  purchaseDate:'2023-01-20', status:'Active'    },
    { id:'AST016', name:'Lab Bench (6-seater)',           category:'Furniture',  dept:'Admin',       qty:28,  minQty:10, unit:'units',  condition:'Good', location:'Laboratories',        valuePerUnit:12000, purchaseDate:'2021-08-10', status:'Active'    },
    { id:'AST017', name:'Bookshelf (5-shelf)',            category:'Furniture',  dept:'Library',     qty:40,  minQty:10, unit:'units',  condition:'Good', location:'Library',             valuePerUnit:6500,  purchaseDate:'2022-04-25', status:'Active'    },
    { id:'AST018', name:'Whiteboard (6×4 ft)',            category:'Furniture',  dept:'Admin',       qty:22,  minQty:10, unit:'units',  condition:'Good', location:'Classrooms',          valuePerUnit:3500,  purchaseDate:'2023-05-10', status:'Active'    },
];

const INIT_PROCUREMENT = [
    { id:'PO001', item:'Digital Multimeter',        category:'Laboratory', qty:10, unitPrice:2500,  total:25000, supplier:'TechEquip Pvt Ltd',     requestedBy:'Dr. Kavitha Rao', requestDate:'2026-05-10', expectedDate:'2026-06-15', status:'Approved'  },
    { id:'PO002', item:'A4 Copy Paper (Case)',       category:'Stationery', qty:50, unitPrice:320,   total:16000, supplier:'OfficeMax Supplies',    requestedBy:'Admin Office',    requestDate:'2026-05-20', expectedDate:'2026-05-28', status:'Delivered' },
    { id:'PO003', item:'NCERT Reference Books Set', category:'Books',      qty:100,unitPrice:450,   total:45000, supplier:'National Book Trust',   requestedBy:'Library',         requestDate:'2026-05-25', expectedDate:'2026-06-30', status:'Pending'   },
    { id:'PO004', item:'Classroom Chairs',          category:'Furniture',  qty:40, unitPrice:1800,  total:72000, supplier:'FurniCraft Industries', requestedBy:'Admin Office',    requestDate:'2026-04-15', expectedDate:'2026-05-30', status:'Delivered' },
    { id:'PO005', item:'Whiteboard (6×4 ft)',        category:'Furniture',  qty:5,  unitPrice:3500,  total:17500, supplier:'BoardMart',             requestedBy:'Admin Office',    requestDate:'2026-05-30', expectedDate:'2026-06-20', status:'Approved'  },
    { id:'PO006', item:'Whiteboard Marker Set',     category:'Stationery', qty:20, unitPrice:450,   total:9000,  supplier:'OfficeMax Supplies',    requestedBy:'Admin Office',    requestDate:'2026-06-01', expectedDate:'2026-06-10', status:'Pending'   },
];

const INIT_MAINTENANCE = [
    { id:'MNT001', asset:'Digital Oscilloscope',   category:'Laboratory', type:'Preventive', schedDate:'2026-06-15', doneBy:'TechEquip Pvt Ltd',    cost:2500, notes:'Calibration and cleaning',   status:'Scheduled' },
    { id:'MNT002', asset:'Lab Projectors',         category:'Laboratory', type:'Corrective', schedDate:'2026-05-28', doneBy:'AudioVision Services', cost:1800, notes:'Bulb replacement',            status:'Completed' },
    { id:'MNT003', asset:'Student Desks & Chairs', category:'Furniture',  type:'Preventive', schedDate:'2026-07-01', doneBy:'FurniCraft Industries', cost:5000, notes:'Repair & polish 20 sets',    status:'Scheduled' },
    { id:'MNT004', asset:'Microscopes',            category:'Laboratory', type:'Preventive', schedDate:'2026-06-01', doneBy:'BioEquip Services',    cost:3200, notes:'Lens cleaning & calibration', status:'Completed' },
    { id:'MNT005', asset:'Bookshelves',            category:'Furniture',  type:'Corrective', schedDate:'2026-06-20', doneBy:'FurniCraft Industries', cost:1200, notes:'Shelf board replacement',     status:'Scheduled' },
];

const TABS = [
    { key:'assets',      label:'Assets',       icon:Package,      color:'#1e40af' },
    { key:'stock',       label:'Stock Status', icon:Archive,      color:'#dc2626' },
    { key:'procurement', label:'Procurement',  icon:ShoppingCart, color:'#059669' },
    { key:'maintenance', label:'Maintenance',  icon:Wrench,       color:'#d97706' },
];

const condColor = c => ({ Good:'#059669', Fair:'#d97706', Poor:'#dc2626', New:'#1e40af' }[c]||'#475569');
const condBg    = c => ({ Good:'#d1fae5', Fair:'#fef3c7', Poor:'#fef2f2', New:'#dbeafe' }[c]||'#f1f5f9');
const poColor   = s => ({ Delivered:'#059669', Approved:'#1e40af', Pending:'#d97706', Cancelled:'#dc2626' }[s]||'#475569');
const poBg      = s => ({ Delivered:'#d1fae5', Approved:'#dbeafe', Pending:'#fef3c7', Cancelled:'#fef2f2' }[s]||'#f1f5f9');
const mntColor  = s => ({ Completed:'#059669', Scheduled:'#1e40af', Overdue:'#dc2626' }[s]||'#475569');
const mntBg     = s => ({ Completed:'#d1fae5', Scheduled:'#dbeafe', Overdue:'#fef2f2' }[s]||'#f1f5f9');
const catColor  = k => CATS.find(c=>c.key===k)?.color||'#475569';
const catBg     = k => CATS.find(c=>c.key===k)?.bg||'#f1f5f9';
const fmt       = n => `₹${Number(n).toLocaleString('en-IN')}`;

const DEPTS     = ['Admin','Library','Electronics','Biology','Chemistry','Physics','Mathematics','Computer Science','Commerce','English','Management'];
const UNITS     = ['units','sets','copies','boxes','reams','pieces','rolls','packets','bottles','kits'];
const SUPPLIERS = ['TechEquip Pvt Ltd','OfficeMax Supplies','National Book Trust','FurniCraft Industries','BoardMart','BioEquip Services','AudioVision Services','EduSupply Co.'];

const EMPTY_ASSET   = { name:'', category:'Laboratory', dept:'', qty:'', minQty:'', unit:'units', condition:'New', location:'', valuePerUnit:'', purchaseDate:'' };
const EMPTY_REORDER = { assetId:'', qty:'', supplier:'', expectedDate:'' };
const EMPTY_PO      = { item:'', category:'Laboratory', qty:'', unitPrice:'', supplier:'', requestedBy:'', expectedDate:'' };
const EMPTY_MNT     = { assetName:'', category:'Laboratory', type:'Preventive', schedDate:'', doneBy:'', cost:'', notes:'' };

const IF = ({ label, error, children }) => (
    <div className="sf-field">
        <label className="sf-label">{label}</label>
        {children}
        {error && <span className="sf-error">{error}</span>}
    </div>
);

export default function Inventory() {
    const [tab,     setTab]     = useState('assets');
    const [q,       setQ]       = useState('');
    const [catFilt, setCatFilt] = useState('All');

    const [assetList, setAssetList] = useState(INIT_ASSETS);
    const [poList,    setPoList]    = useState(INIT_PROCUREMENT);
    const [mntList,   setMntList]   = useState(INIT_MAINTENANCE);

    const [modal,       setModal]       = useState(null);
    const [assetForm,   setAssetForm]   = useState(EMPTY_ASSET);
    const [reorderForm, setReorderForm] = useState(EMPTY_REORDER);
    const [poForm,      setPoForm]      = useState(EMPTY_PO);
    const [mntForm,     setMntForm]     = useState(EMPTY_MNT);
    const [ferr,        setFerr]        = useState({});
    const [editMode,    setEditMode]    = useState(false);
    const [editId,      setEditId]      = useState(null);
    const [viewItem,    setViewItem]    = useState(null);

    const openModal = (m, item = null) => {
        setModal(m); setFerr({});
        if (item) {
            setEditMode(true); setEditId(item.id);
            if (m === 'asset')       setAssetForm({ name:item.name, category:item.category, dept:item.dept, qty:String(item.qty), minQty:String(item.minQty), unit:item.unit, condition:item.condition, location:item.location, valuePerUnit:String(item.valuePerUnit), purchaseDate:item.purchaseDate });
            if (m === 'po')          setPoForm({ item:item.item||item.name||'', category:item.category, qty:String(item.qty), unitPrice:String(item.unitPrice), supplier:item.supplier, requestedBy:item.requestedBy||'', expectedDate:item.expectedDate });
            if (m === 'maintenance') setMntForm({ assetName:item.asset, category:item.category, type:item.type, schedDate:item.schedDate, doneBy:item.doneBy, cost:String(item.cost), notes:item.notes==='—'?'':item.notes });
        } else {
            setEditMode(false); setEditId(null);
        }
    };

    const closeModal = () => {
        setModal(null); setFerr({});
        setEditMode(false); setEditId(null);
        setAssetForm(EMPTY_ASSET); setReorderForm(EMPTY_REORDER);
        setPoForm(EMPTY_PO); setMntForm(EMPTY_MNT);
    };

    const today = new Date().toISOString().split('T')[0];

    const submitAsset = () => {
        const e = {};
        if (!assetForm.name.trim())     e.name         = 'Required';
        if (!assetForm.dept)            e.dept         = 'Required';
        if (!assetForm.qty || Number(assetForm.qty) <= 0) e.qty = 'Enter valid quantity';
        if (!assetForm.location.trim()) e.location     = 'Required';
        if (!assetForm.valuePerUnit || Number(assetForm.valuePerUnit) <= 0) e.valuePerUnit = 'Enter valid value';
        if (!assetForm.purchaseDate)    e.purchaseDate = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        const qty = Number(assetForm.qty);
        const min = Number(assetForm.minQty) || Math.ceil(qty * 0.3);
        const patch = { name:assetForm.name.trim(), category:assetForm.category, dept:assetForm.dept, qty, minQty:min, unit:assetForm.unit, condition:assetForm.condition, location:assetForm.location.trim(), valuePerUnit:Number(assetForm.valuePerUnit), purchaseDate:assetForm.purchaseDate, status:qty<=min?'Low Stock':'Active' };
        if (editMode) {
            setAssetList(prev => prev.map(a => a.id === editId ? { ...a, ...patch } : a));
        } else {
            setAssetList(prev => [{ id:`AST${String(prev.length+1).padStart(3,'0')}`, ...patch }, ...prev]);
        }
        closeModal();
    };

    const submitReorder = () => {
        const e = {};
        if (!reorderForm.assetId)        e.assetId      = 'Select an asset';
        if (!reorderForm.qty || Number(reorderForm.qty) <= 0) e.qty = 'Enter valid quantity';
        if (!reorderForm.supplier.trim()) e.supplier    = 'Required';
        if (!reorderForm.expectedDate)   e.expectedDate = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        const asset = assetList.find(a => a.id === reorderForm.assetId);
        setPoList(prev => [{ id:`PO${String(prev.length+1).padStart(3,'0')}`, item:asset?.name||'—', category:asset?.category||'—', qty:Number(reorderForm.qty), unitPrice:asset?.valuePerUnit||0, total:Number(reorderForm.qty)*(asset?.valuePerUnit||0), supplier:reorderForm.supplier.trim(), requestedBy:'Store Manager', requestDate:today, expectedDate:reorderForm.expectedDate, status:'Pending' }, ...prev]);
        closeModal();
    };

    const submitPO = () => {
        const e = {};
        if (!poForm.item.trim())       e.item        = 'Required';
        if (!poForm.qty || Number(poForm.qty) <= 0)           e.qty         = 'Enter valid quantity';
        if (!poForm.unitPrice || Number(poForm.unitPrice) <= 0) e.unitPrice = 'Enter valid price';
        if (!poForm.supplier.trim())   e.supplier    = 'Required';
        if (!poForm.expectedDate)      e.expectedDate= 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        const qty = Number(poForm.qty), up = Number(poForm.unitPrice);
        const patch = { item:poForm.item.trim(), category:poForm.category, qty, unitPrice:up, total:qty*up, supplier:poForm.supplier.trim(), requestedBy:poForm.requestedBy.trim()||'Admin Office', expectedDate:poForm.expectedDate };
        if (editMode) {
            setPoList(prev => prev.map(p => p.id === editId ? { ...p, ...patch } : p));
        } else {
            setPoList(prev => [{ id:`PO${String(prev.length+1).padStart(3,'0')}`, ...patch, requestDate:today, status:'Pending' }, ...prev]);
        }
        closeModal();
    };

    const submitMnt = () => {
        const e = {};
        if (!mntForm.assetName.trim()) e.assetName = 'Required';
        if (!mntForm.schedDate)        e.schedDate = 'Required';
        if (!mntForm.doneBy.trim())    e.doneBy    = 'Required';
        if (Object.keys(e).length) { setFerr(e); return; }
        const patch = { asset:mntForm.assetName.trim(), category:mntForm.category, type:mntForm.type, schedDate:mntForm.schedDate, doneBy:mntForm.doneBy.trim(), cost:Number(mntForm.cost)||0, notes:mntForm.notes.trim()||'—' };
        if (editMode) {
            setMntList(prev => prev.map(m => m.id === editId ? { ...m, ...patch } : m));
        } else {
            setMntList(prev => [{ id:`MNT${String(prev.length+1).padStart(3,'0')}`, ...patch, status:'Scheduled' }, ...prev]);
        }
        closeModal();
    };

    const exportData = () => {
        let headers, rows, filename;
        if (tab === 'assets') {
            headers = ['ID','Name','Category','Dept','Qty','Unit','Condition','Location','Unit Value','Total Value','Status'];
            rows    = assetList.map(a=>[a.id,a.name,a.category,a.dept,a.qty,a.unit,a.condition,a.location,a.valuePerUnit,a.qty*a.valuePerUnit,a.status]);
            filename= 'assets.csv';
        } else if (tab === 'stock') {
            headers = ['ID','Name','Category','Current Qty','Min Qty','Unit','Unit Value','Last Purchase','Status'];
            rows    = assetList.map(a=>[a.id,a.name,a.category,a.qty,a.minQty,a.unit,a.valuePerUnit,a.purchaseDate,a.status]);
            filename= 'stock_status.csv';
        } else if (tab === 'procurement') {
            headers = ['ID','Item','Category','Qty','Unit Price','Total','Supplier','Requested By','Request Date','Expected Date','Status'];
            rows    = poList.map(p=>[p.id,p.item,p.category,p.qty,p.unitPrice,p.total,p.supplier,p.requestedBy,p.requestDate,p.expectedDate,p.status]);
            filename= 'purchase_orders.csv';
        } else {
            headers = ['ID','Asset','Category','Type','Scheduled Date','Done By','Cost','Notes','Status'];
            rows    = mntList.map(m=>[m.id,m.asset,m.category,m.type,m.schedDate,m.doneBy,m.cost,m.notes,m.status]);
            filename= 'maintenance.csv';
        }
        const csv  = [headers,...rows].map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
        const blob = new Blob([csv],{type:'text/csv'});
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href=url; a.download=filename; a.click();
        URL.revokeObjectURL(url);
    };

    const approvePO   = id => setPoList(prev  => prev.map(p => p.id===id ? {...p, status:'Approved'}  : p));
    const completeMnt = id => setMntList(prev => prev.map(m => m.id===id ? {...m, status:'Completed'} : m));

    const filt = (arr, keys) => arr.filter(r => !q || keys.some(k => String(r[k]).toLowerCase().includes(q.toLowerCase())));

    const totalAssets   = assetList.length;
    const totalValue    = assetList.reduce((s,a)=>s+a.qty*a.valuePerUnit,0);
    const lowStockItems = assetList.filter(a=>a.status==='Low Stock').length;
    const pendingPO     = poList.filter(p=>p.status==='Pending'||p.status==='Approved').length;

    const statCards = [
        { label:'Total Assets',      value:totalAssets,    sub:'across all categories',         color:'#1e40af', bg:'#dbeafe', icon:Package,      navTab:'assets'      },
        { label:'Total Asset Value', value:fmt(totalValue),sub:'current book value',            color:'#059669', bg:'#d1fae5', icon:IndianRupee,  navTab:'assets'      },
        { label:'Low Stock Items',   value:lowStockItems,  sub:'need immediate reorder',        color:'#dc2626', bg:'#fef2f2', icon:TrendingDown,  navTab:'stock'       },
        { label:'Pending Orders',    value:pendingPO,      sub:'awaiting approval or delivery', color:'#d97706', bg:'#fef3c7', icon:ShoppingCart,  navTab:'procurement' },
    ];

    const renderViewModal = () => {
        if (!viewItem) return null;
        const { type, data } = viewItem;
        let fields = [];
        if (type === 'asset') {
            fields = [['Asset ID',data.id],['Name',data.name],['Category',data.category],['Department',data.dept],['Quantity',`${data.qty} ${data.unit}`],['Min Qty',`${data.minQty} ${data.unit}`],['Condition',data.condition],['Location',data.location],['Unit Value',fmt(data.valuePerUnit)],['Total Value',fmt(data.qty*data.valuePerUnit)],['Purchase Date',data.purchaseDate],['Status',data.status]];
        } else if (type === 'po') {
            fields = [['PO ID',data.id],['Item',data.item||data.name],['Category',data.category],['Quantity',data.qty],['Unit Price',fmt(data.unitPrice)],['Total',fmt(data.total)],['Supplier',data.supplier],['Requested By',data.requestedBy],['Request Date',data.requestDate],['Expected Date',data.expectedDate],['Status',data.status]];
        } else {
            fields = [['ID',data.id],['Asset',data.asset],['Category',data.category],['Type',data.type],['Scheduled Date',data.schedDate],['Performed By',data.doneBy],['Cost',fmt(data.cost)],['Notes',data.notes],['Status',data.status]];
        }
        const title = type==='asset'?'Asset Details':type==='po'?'Purchase Order Details':'Maintenance Details';
        return (
            <div className="modal-overlay" onClick={()=>setViewItem(null)}>
                <div className="modal-box" onClick={e=>e.stopPropagation()} style={{maxWidth:520}}>
                    <div className="modal-head">
                        <h3>{title}</h3>
                        <button className="modal-close" onClick={()=>setViewItem(null)}><X size={16}/></button>
                    </div>
                    <div className="sf-body">
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px 24px'}}>
                            {fields.map(([label,val])=>(
                                <div key={label}>
                                    <div style={{fontSize:'0.68rem',color:'var(--text-muted)',fontWeight:600,textTransform:'uppercase',letterSpacing:0.4,marginBottom:3}}>{label}</div>
                                    <div style={{fontSize:'0.87rem',color:'var(--text-primary)',fontWeight:600}}>{val}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="modal-foot">
                        <button className="btn btn-secondary btn-sm" onClick={()=>setViewItem(null)}>Close</button>
                    </div>
                </div>
            </div>
        );
    };

    const IS = {
        heroGrid:   { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 },
        heroCard:   { borderRadius:16, padding:'20px 22px', position:'relative', overflow:'hidden', color:'white', minHeight:110, cursor:'pointer' },
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

    const HERO_GRADS = [
        'linear-gradient(135deg,#1e3a8a,#2563eb)',
        'linear-gradient(135deg,#065f46,#10b981)',
        'linear-gradient(135deg,#991b1b,#ef4444)',
        'linear-gradient(135deg,#92400e,#f59e0b)',
    ];
    const HERO_GLOWS = [
        'rgba(37,99,235,0.35)',
        'rgba(16,185,129,0.35)',
        'rgba(239,68,68,0.35)',
        'rgba(245,158,11,0.35)',
    ];

    return (
        <div className="erp-page">
            <Navbar title="Inventory & Procurement" subtitle="Track assets, stock levels and purchase orders" />

            {/* ── Hero KPI Cards ── */}
            <div style={IS.heroGrid}>
                {statCards.map((s,i)=>(
                    <div key={s.label} style={{ ...IS.heroCard, background:HERO_GRADS[i], boxShadow:`0 8px 24px ${HERO_GLOWS[i]}` }}
                        onClick={()=>{ setTab(s.navTab); setQ(''); setCatFilt('All'); }}>
                        <div style={IS.heroTop}>
                            <div style={IS.heroIconBox}><s.icon size={20} color="white"/></div>
                        </div>
                        <div style={IS.heroVal}>{s.value}</div>
                        <div style={IS.heroLbl}>{s.label}</div>
                        <div style={IS.heroSub}>{s.sub}</div>
                        <div style={IS.heroShine}/>
                    </div>
                ))}
            </div>

            {/* ── Unified Tab Row ── */}
            <div style={IS.tabRow}>
                <div style={IS.tabBar}>
                    {TABS.map(({key,label,icon:Icon})=>{
                        const active = tab===key;
                        return (
                            <button key={key} style={{ ...IS.tab, ...(active?IS.tabActive:{}) }}
                                onClick={()=>{ setTab(key); setQ(''); setCatFilt('All'); }}>
                                <Icon size={14}/> {label}
                                {key==='stock'&&lowStockItems>0&&<span style={{ background:'#dc2626', color:'white', fontSize:'0.6rem', fontWeight:800, padding:'1px 5px', borderRadius:99, marginLeft:2 }}>{lowStockItems}</span>}
                                {active&&<span style={IS.tabDot}/>}
                            </button>
                        );
                    })}
                </div>
                <div style={IS.searchWrap}>
                    <Search size={14} color="var(--text-muted)"/>
                    <input style={IS.searchInput} placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/>
                    {q&&<button onClick={()=>setQ('')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:0, display:'flex' }}><X size={12}/></button>}
                </div>
                {tab==='assets'&&CATS.map(c=>(
                    <button key={c.key} onClick={()=>setCatFilt(c.key)}
                        style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 13px', borderRadius:99, border:`1.5px solid ${catFilt===c.key?c.color:'var(--border)'}`, background:catFilt===c.key?c.bg:'white', color:catFilt===c.key?c.color:'var(--text-muted)', fontSize:'0.78rem', fontWeight:catFilt===c.key?700:500, cursor:'pointer', whiteSpace:'nowrap' }}>
                        <c.icon size={12}/> {c.label}
                    </button>
                ))}
                <button className="btn btn-secondary btn-sm" onClick={exportData}><Download size={14}/> Export</button>
                <button className="btn btn-primary btn-sm"
                    onClick={()=>openModal(tab==='assets'?'asset':tab==='stock'?'reorder':tab==='procurement'?'po':'maintenance')}>
                    <Plus size={14}/> {tab==='assets'?'Add Asset':tab==='stock'?'Reorder':tab==='procurement'?'New PO':'Add Record'}
                </button>
            </div>

            {/* ══════════ ASSETS TAB ══════════ */}
            {tab==='assets'&&(()=>{
                const data     = filt(assetList,['name','category','dept','location','status']).filter(a=>catFilt==='All'||a.category===catFilt);
                const totalVal = data.reduce((s,a)=>s+a.qty*a.valuePerUnit,0);
                return (
                    <>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
                            {CATS.slice(1).map(c=>{
                                const items  = assetList.filter(a=>a.category===c.key);
                                const lowStk = items.filter(a=>a.status==='Low Stock').length;
                                const catGrads = { Laboratory:'linear-gradient(135deg,#4c1d95,#7c3aed)', Books:'linear-gradient(135deg,#1e3a8a,#2563eb)', Stationery:'linear-gradient(135deg,#065f46,#10b981)', Furniture:'linear-gradient(135deg,#92400e,#f59e0b)' };
                                const catGlows = { Laboratory:'rgba(124,58,237,0.3)', Books:'rgba(37,99,235,0.3)', Stationery:'rgba(16,185,129,0.3)', Furniture:'rgba(245,158,11,0.3)' };
                                return (
                                    <div key={c.key} style={{ borderRadius:14, padding:'14px 18px', background:catFilt===c.key?catGrads[c.key]:`${catGrads[c.key]}cc`, boxShadow:`0 4px 16px ${catGlows[c.key]}`, color:'white', position:'relative', overflow:'hidden', cursor:'pointer', transition:'transform 0.15s', border:catFilt===c.key?'2px solid rgba(255,255,255,0.3)':'2px solid transparent' }}
                                        onClick={()=>setCatFilt(catFilt===c.key?'All':c.key)}>
                                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                                            <div style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.2)', display:'grid', placeItems:'center' }}><c.icon size={15} color="white"/></div>
                                            {lowStk>0&&<span style={{ background:'rgba(220,38,38,0.85)', color:'white', fontSize:'0.63rem', fontWeight:700, padding:'2px 7px', borderRadius:99 }}>⚠ {lowStk} low</span>}
                                        </div>
                                        <div style={{ fontSize:'1.5rem', fontWeight:800, fontFamily:'var(--font-display)', lineHeight:1 }}>{items.length}</div>
                                        <div style={{ fontSize:'0.72rem', fontWeight:600, opacity:0.85, marginTop:4 }}>{c.label} items</div>
                                        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'45%', background:'rgba(255,255,255,0.05)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' }}/>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <h2>Asset Register <span className="count-pill">{data.length}</span></h2>
                                    <p>Total value of listed assets: <strong style={{ color:'#059669' }}>{fmt(totalVal)}</strong></p>
                                </div>
                            </div>
                            <div style={{ overflowX:'auto' }}>
                                <table>
                                    <thead><tr>
                                        <th>Asset Name</th><th>Category</th><th>Dept</th>
                                        <th>Qty</th><th>Condition</th><th>Location</th>
                                        <th>Unit Value</th><th>Total Value</th><th>Status</th>
                                        <th style={{ textAlign:'right' }}>Actions</th>
                                    </tr></thead>
                                    <tbody>
                                        {data.map(a=>{
                                            const CatIcon = CATS.find(c=>c.key===a.category)?.icon||Package;
                                            return (
                                                <tr key={a.id}>
                                                    <td>
                                                        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                                                            <div style={{ width:32, height:32, borderRadius:7, background:catBg(a.category), color:catColor(a.category), display:'grid', placeItems:'center', flexShrink:0 }}><CatIcon size={14}/></div>
                                                            <div>
                                                                <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{a.name}</div>
                                                                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'monospace' }}>{a.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><span style={{ background:catBg(a.category), color:catColor(a.category), padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${catColor(a.category)}30` }}>{a.category}</span></td>
                                                    <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{a.dept}</td>
                                                    <td>
                                                        <div style={{ fontWeight:700, fontSize:'0.875rem' }}>{a.qty} <span style={{ color:'var(--text-muted)', fontWeight:400, fontSize:'0.72rem' }}>{a.unit}</span></div>
                                                        {a.qty<=a.minQty&&<div style={{ fontSize:'0.65rem', color:'#dc2626', fontWeight:600, marginTop:2 }}>⚠ Min: {a.minQty}</div>}
                                                    </td>
                                                    <td><span style={{ background:condBg(a.condition), color:condColor(a.condition), padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${condColor(a.condition)}30` }}>{a.condition}</span></td>
                                                    <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{a.location}</td>
                                                    <td style={{ fontSize:'0.83rem', fontWeight:600 }}>{fmt(a.valuePerUnit)}</td>
                                                    <td style={{ fontSize:'0.83rem', fontWeight:700, color:'#059669' }}>{fmt(a.qty*a.valuePerUnit)}</td>
                                                    <td>
                                                        <span style={{ background:a.status==='Low Stock'?'#fef2f2':'#d1fae5', color:a.status==='Low Stock'?'#dc2626':'#059669', padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${a.status==='Low Stock'?'#fca5a5':'#6ee7b7'}` }}>
                                                            {a.status==='Low Stock'&&'⚠ '}{a.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                            <button className="tbl-btn" title="View"   onClick={()=>setViewItem({type:'asset',data:a})}><Eye size={13}/></button>
                                                            <button className="tbl-btn" title="Edit"   onClick={()=>openModal('asset',a)}><Edit2 size={13}/></button>
                                                            <button className="tbl-btn danger" title="Delete" onClick={()=>setAssetList(p=>p.filter(x=>x.id!==a.id))}><Trash2 size={13}/></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {data.length===0&&<div className="empty-state"><div className="empty-icon">📦</div><p>No assets found.</p></div>}
                            </div>
                        </div>
                    </>
                );
            })()}

            {/* ══════════ STOCK STATUS TAB ══════════ */}
            {tab==='stock'&&(()=>{
                const lowStock = assetList.filter(a=>a.status==='Low Stock');
                return (
                    <>
                        {lowStock.length>0&&(
                            <div style={{ background:'linear-gradient(135deg,#fef2f2,#fff7ed)', border:'2px solid #fca5a5', borderRadius:14, padding:'18px 22px', marginBottom:16 }}>
                                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                                    <div style={{ width:36, height:36, borderRadius:9, background:'#dc2626', display:'grid', placeItems:'center', flexShrink:0 }}><AlertTriangle size={18} color="white"/></div>
                                    <div>
                                        <div style={{ fontWeight:800, fontSize:'0.9rem', color:'#7f1d1d' }}>{lowStock.length} Items Below Minimum Stock Level</div>
                                        <div style={{ fontSize:'0.75rem', color:'#b91c1c', marginTop:2 }}>Immediate reorder recommended to avoid shortage</div>
                                    </div>
                                </div>
                                <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
                                    {lowStock.map(a=>{
                                        const CatIcon = CATS.find(c=>c.key===a.category)?.icon||Package;
                                        return (
                                            <div key={a.id} style={{ background:'white', border:'1px solid #fca5a5', borderRadius:10, padding:'12px 14px' }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                                                    <div style={{ width:28, height:28, borderRadius:6, background:catBg(a.category), color:catColor(a.category), display:'grid', placeItems:'center', flexShrink:0 }}><CatIcon size={13}/></div>
                                                    <div style={{ fontWeight:700, fontSize:'0.8rem', color:'#7f1d1d', lineHeight:1.2 }}>{a.name}</div>
                                                </div>
                                                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
                                                    <div>
                                                        <div style={{ fontSize:'0.65rem', color:'#b91c1c', fontWeight:600 }}>CURRENT</div>
                                                        <div style={{ fontWeight:800, fontSize:'1rem', color:'#dc2626' }}>{a.qty} {a.unit}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize:'0.65rem', color:'#b91c1c', fontWeight:600 }}>MINIMUM</div>
                                                        <div style={{ fontWeight:800, fontSize:'1rem', color:'#92400e' }}>{a.minQty} {a.unit}</div>
                                                    </div>
                                                </div>
                                                <div style={{ height:5, background:'#fee2e2', borderRadius:99, marginTop:8, overflow:'hidden' }}>
                                                    <div style={{ width:`${Math.min(a.qty/a.minQty*100,100)}%`, height:'100%', background:'#dc2626', borderRadius:99 }}/>
                                                </div>
                                                <button style={{ width:'100%', marginTop:8, padding:'5px 0', borderRadius:6, border:'1px solid #fca5a5', background:'#fef2f2', color:'#dc2626', fontSize:'0.72rem', fontWeight:700, cursor:'pointer' }}
                                                    onClick={()=>{ setReorderForm({...EMPTY_REORDER, assetId:a.id}); openModal('reorder'); }}>
                                                    <RefreshCw size={10} style={{ display:'inline', marginRight:4 }}/>Request Reorder
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        <div className="card">
                            <div className="card-header">
                                <div><h2>Stock Levels <span className="count-pill">{assetList.length}</span></h2><p>Current quantity vs minimum required stock for all assets</p></div>
                            </div>
                            <div style={{ overflowX:'auto' }}>
                                <table>
                                    <thead><tr>
                                        <th>Asset</th><th>Category</th><th>Current Stock</th>
                                        <th>Min Level</th><th style={{ minWidth:180 }}>Stock Bar</th>
                                        <th>Unit Value</th><th>Last Purchase</th><th style={{ textAlign:'right' }}>Action</th>
                                    </tr></thead>
                                    <tbody>
                                        {assetList.map(a=>{
                                            const pct    = Math.min((a.qty/Math.max(a.minQty*2,1))*100,100);
                                            const isLow  = a.qty<=a.minQty;
                                            const barClr = isLow?'#dc2626':pct<60?'#d97706':'#059669';
                                            const CatIcon= CATS.find(c=>c.key===a.category)?.icon||Package;
                                            return (
                                                <tr key={a.id} style={{ background:isLow?'rgba(220,38,38,0.03)':undefined }}>
                                                    <td>
                                                        <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{a.name}</div>
                                                        <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{a.location}</div>
                                                    </td>
                                                    <td>
                                                        <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:catBg(a.category), color:catColor(a.category), padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${catColor(a.category)}30` }}>
                                                            <CatIcon size={10}/>{a.category}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span style={{ fontWeight:800, fontSize:'1rem', color:isLow?'#dc2626':'var(--text-primary)' }}>{a.qty}</span>
                                                        <span style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginLeft:4 }}>{a.unit}</span>
                                                    </td>
                                                    <td style={{ fontSize:'0.83rem', fontWeight:600, color:'var(--text-muted)' }}>{a.minQty} {a.unit}</td>
                                                    <td style={{ minWidth:180 }}>
                                                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                            <div style={{ flex:1, height:7, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}>
                                                                <div style={{ width:`${pct}%`, height:'100%', background:isLow?'linear-gradient(90deg,#dc2626,#ef4444)':pct<60?'linear-gradient(90deg,#d97706,#f59e0b)':'linear-gradient(90deg,#059669,#10b981)', borderRadius:99, transition:'width 0.3s' }}/>
                                                            </div>
                                                            <span style={{ fontSize:'0.7rem', fontWeight:700, color:barClr, minWidth:32 }}>{Math.round(pct)}%</span>
                                                        </div>
                                                        {isLow&&<div style={{ fontSize:'0.65rem', color:'#dc2626', fontWeight:600, marginTop:3 }}>⚠ Below minimum</div>}
                                                    </td>
                                                    <td style={{ fontSize:'0.83rem' }}>{fmt(a.valuePerUnit)}</td>
                                                    <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{a.purchaseDate}</td>
                                                    <td>
                                                        <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                            <button className={`tbl-btn ${isLow?'inv-reorder-btn':''}`} title="Request Reorder"
                                                                onClick={()=>{ setReorderForm({...EMPTY_REORDER, assetId:a.id}); openModal('reorder'); }}>
                                                                <RefreshCw size={13}/>
                                                            </button>
                                                            <button className="tbl-btn" title="Edit" onClick={()=>openModal('asset',a)}><Edit2 size={13}/></button>
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
                );
            })()}

            {/* ══════════ PROCUREMENT TAB ══════════ */}
            {tab==='procurement'&&(()=>{
                const data   = filt(poList,['item','category','supplier','requestedBy','status']);
                const totVal = data.reduce((s,p)=>s+p.total,0);
                const counts = { Delivered:data.filter(p=>p.status==='Delivered').length, Approved:data.filter(p=>p.status==='Approved').length, Pending:data.filter(p=>p.status==='Pending').length };
                return (
                    <>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:16 }}>
                            {[
                                { label:'Total PO Value',   value:fmt(totVal),      grad:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)'   },
                                { label:'Delivered',        value:counts.Delivered, grad:'linear-gradient(135deg,#065f46,#10b981)', glow:'rgba(16,185,129,0.28)'  },
                                { label:'Approved',         value:counts.Approved,  grad:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.28)'  },
                                { label:'Pending Approval', value:counts.Pending,   grad:'linear-gradient(135deg,#92400e,#f59e0b)', glow:'rgba(245,158,11,0.28)'  },
                            ].map(c=>(
                                <div key={c.label} style={{ borderRadius:12, padding:'14px 18px', background:c.grad, boxShadow:`0 4px 16px ${c.glow}`, color:'white', position:'relative', overflow:'hidden' }}>
                                    <div style={{ fontSize:'1.4rem', fontWeight:800, fontFamily:'var(--font-display)', lineHeight:1 }}>{c.value}</div>
                                    <div style={{ fontSize:'0.72rem', fontWeight:600, opacity:0.85, marginTop:4 }}>{c.label}</div>
                                    <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'50%', background:'rgba(255,255,255,0.05)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' }}/>
                                </div>
                            ))}
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div><h2>Purchase Orders <span className="count-pill">{data.length}</span></h2><p>Track procurement requests, approvals and deliveries</p></div>
                                <button className="btn btn-primary btn-sm" onClick={()=>openModal('po')}><ClipboardCheck size={13}/> New PO</button>
                            </div>
                            <div style={{ overflowX:'auto' }}>
                                <table>
                                    <thead><tr>
                                        <th>Item</th><th>Category</th><th>Qty</th>
                                        <th>Unit Price</th><th>Total</th><th>Supplier</th>
                                        <th>Requested By</th><th>Expected Date</th><th>Status</th>
                                        <th style={{ textAlign:'right' }}>Actions</th>
                                    </tr></thead>
                                    <tbody>
                                        {data.map(p=>{
                                            const CatIcon = CATS.find(c=>c.key===p.category)?.icon||Package;
                                            return (
                                                <tr key={p.id}>
                                                    <td>
                                                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                            <div style={{ width:28, height:28, borderRadius:6, background:catBg(p.category), color:catColor(p.category), display:'grid', placeItems:'center', flexShrink:0 }}><CatIcon size={12}/></div>
                                                            <div>
                                                                <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{p.item||p.name}</div>
                                                                <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', fontFamily:'monospace' }}>{p.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td><span style={{ background:catBg(p.category), color:catColor(p.category), padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${catColor(p.category)}30` }}>{p.category}</span></td>
                                                    <td style={{ fontWeight:700, fontSize:'0.875rem' }}>{p.qty}</td>
                                                    <td style={{ fontSize:'0.83rem' }}>{fmt(p.unitPrice)}</td>
                                                    <td style={{ fontWeight:700, fontSize:'0.875rem', color:'#059669' }}>{fmt(p.total)}</td>
                                                    <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{p.supplier}</td>
                                                    <td style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>{p.requestedBy}</td>
                                                    <td>
                                                        <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.78rem' }}>
                                                            <Calendar size={12} style={{ color:'var(--text-muted)' }}/> {p.expectedDate}
                                                        </div>
                                                    </td>
                                                    <td><span style={{ background:poBg(p.status), color:poColor(p.status), padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${poColor(p.status)}40` }}>{p.status}</span></td>
                                                    <td>
                                                        <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                            <button className="tbl-btn" title="View"   onClick={()=>setViewItem({type:'po',data:p})}><Eye size={13}/></button>
                                                            <button className="tbl-btn" title="Edit"   onClick={()=>openModal('po',p)}><Edit2 size={13}/></button>
                                                            {p.status==='Pending'&&<button className="tbl-btn" style={{ color:'#059669', borderColor:'#6ee7b7' }} title="Approve" onClick={()=>approvePO(p.id)}><CheckCircle2 size={13}/></button>}
                                                            <button className="tbl-btn danger" title="Delete" onClick={()=>setPoList(prev=>prev.filter(x=>x.id!==p.id))}><Trash2 size={13}/></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {data.length===0&&<div className="empty-state"><div className="empty-icon">🛒</div><p>No purchase orders found.</p></div>}
                            </div>
                        </div>
                    </>
                );
            })()}

            {/* ══════════ MAINTENANCE TAB ══════════ */}
            {tab==='maintenance'&&(()=>{
                const data      = filt(mntList,['asset','category','type','doneBy','status']);
                const scheduled = mntList.filter(m=>m.status==='Scheduled').length;
                const completed = mntList.filter(m=>m.status==='Completed').length;
                const totalCost = mntList.reduce((s,m)=>s+m.cost,0);
                return (
                    <>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:16 }}>
                            {[
                                { label:'Scheduled',  value:scheduled,      grad:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)'  },
                                { label:'Completed',  value:completed,      grad:'linear-gradient(135deg,#065f46,#10b981)', glow:'rgba(16,185,129,0.28)' },
                                { label:'Total Cost', value:fmt(totalCost), grad:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.28)' },
                            ].map(c=>(
                                <div key={c.label} style={{ borderRadius:12, padding:'14px 18px', background:c.grad, boxShadow:`0 4px 16px ${c.glow}`, color:'white', position:'relative', overflow:'hidden' }}>
                                    <div style={{ fontSize:'1.4rem', fontWeight:800, fontFamily:'var(--font-display)', lineHeight:1 }}>{c.value}</div>
                                    <div style={{ fontSize:'0.72rem', fontWeight:600, opacity:0.85, marginTop:4 }}>{c.label}</div>
                                    <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'50%', background:'rgba(255,255,255,0.05)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' }}/>
                                </div>
                            ))}
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div><h2>Maintenance Records <span className="count-pill">{data.length}</span></h2><p>Asset maintenance schedule, history and cost tracking</p></div>
                            </div>
                            <div style={{ overflowX:'auto' }}>
                                <table>
                                    <thead><tr>
                                        <th>Asset</th><th>Category</th><th>Type</th>
                                        <th>Scheduled Date</th><th>Performed By</th>
                                        <th>Cost</th><th>Notes</th><th>Status</th>
                                        <th style={{ textAlign:'right' }}>Actions</th>
                                    </tr></thead>
                                    <tbody>
                                        {data.map(m=>{
                                            const CatIcon = CATS.find(c=>c.key===m.category)?.icon||Package;
                                            return (
                                                <tr key={m.id}>
                                                    <td>
                                                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                                                            <div style={{ width:28, height:28, borderRadius:6, background:catBg(m.category), color:catColor(m.category), display:'grid', placeItems:'center', flexShrink:0 }}><CatIcon size={12}/></div>
                                                            <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{m.asset}</div>
                                                        </div>
                                                    </td>
                                                    <td><span style={{ background:catBg(m.category), color:catColor(m.category), padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${catColor(m.category)}30` }}>{m.category}</span></td>
                                                    <td>
                                                        <span style={{ background:m.type==='Preventive'?'#dbeafe':'#fef3c7', color:m.type==='Preventive'?'#1e40af':'#d97706', padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${m.type==='Preventive'?'#93c5fd':'#fcd34d'}` }}>{m.type}</span>
                                                    </td>
                                                    <td>
                                                        <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:'0.78rem' }}>
                                                            <Calendar size={12} style={{ color:'var(--text-muted)' }}/> {m.schedDate}
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{m.doneBy}</td>
                                                    <td style={{ fontWeight:700, fontSize:'0.875rem', color:'#7c3aed' }}>{fmt(m.cost)}</td>
                                                    <td style={{ fontSize:'0.78rem', color:'var(--text-muted)', maxWidth:180 }}>{m.notes}</td>
                                                    <td><span style={{ background:mntBg(m.status), color:mntColor(m.status), padding:'3px 10px', borderRadius:99, fontSize:'0.72rem', fontWeight:700, border:`1.5px solid ${mntColor(m.status)}40` }}>{m.status}</span></td>
                                                    <td>
                                                        <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                            <button className="tbl-btn" title="View"   onClick={()=>setViewItem({type:'maintenance',data:m})}><Eye size={13}/></button>
                                                            <button className="tbl-btn" title="Edit"   onClick={()=>openModal('maintenance',m)}><Edit2 size={13}/></button>
                                                            {m.status==='Scheduled'&&<button className="tbl-btn" style={{ color:'#059669', borderColor:'#6ee7b7' }} title="Mark Complete" onClick={()=>completeMnt(m.id)}><CheckCircle2 size={13}/></button>}
                                                            <button className="tbl-btn danger" title="Delete" onClick={()=>setMntList(p=>p.filter(x=>x.id!==m.id))}><Trash2 size={13}/></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                {data.length===0&&<div className="empty-state"><div className="empty-icon">🔧</div><p>No maintenance records found.</p></div>}
                            </div>
                        </div>
                    </>
                );
            })()}

            {/* ── View Modal ── */}
            {renderViewModal()}

            {/* ── Add / Edit Modal ── */}
            {modal&&(
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={e=>e.stopPropagation()}>
                        <div className="modal-head">
                            <h3>
                                {modal==='asset'       ?(editMode?'Edit Asset':'Add Asset')
                                :modal==='reorder'     ?'Request Reorder'
                                :modal==='po'          ?(editMode?'Edit Purchase Order':'New Purchase Order')
                                                       :(editMode?'Edit Maintenance Record':'Add Maintenance Record')}
                            </h3>
                            <button className="modal-close" onClick={closeModal}><X size={16}/></button>
                        </div>

                        <div className="sf-body">
                            {/* ASSET FORM */}
                            {modal==='asset'&&(
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                                    <IF label="Asset Name *" error={ferr.name}>
                                        <input className="sf-inp" value={assetForm.name} onChange={e=>setAssetForm(p=>({...p,name:e.target.value}))} placeholder="e.g. Digital Oscilloscope"/>
                                    </IF>
                                    <IF label="Category">
                                        <select className="sf-inp" value={assetForm.category} onChange={e=>setAssetForm(p=>({...p,category:e.target.value}))}>
                                            {CATS.slice(1).map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Department *" error={ferr.dept}>
                                        <select className="sf-inp" value={assetForm.dept} onChange={e=>setAssetForm(p=>({...p,dept:e.target.value}))}>
                                            <option value="">Select dept</option>
                                            {DEPTS.map(d=><option key={d} value={d}>{d}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Condition">
                                        <select className="sf-inp" value={assetForm.condition} onChange={e=>setAssetForm(p=>({...p,condition:e.target.value}))}>
                                            {['New','Good','Fair','Poor'].map(c=><option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Quantity *" error={ferr.qty}>
                                        <input className="sf-inp" type="number" min="1" value={assetForm.qty} onChange={e=>setAssetForm(p=>({...p,qty:e.target.value}))} placeholder="0"/>
                                    </IF>
                                    <IF label="Minimum Qty">
                                        <input className="sf-inp" type="number" min="0" value={assetForm.minQty} onChange={e=>setAssetForm(p=>({...p,minQty:e.target.value}))} placeholder="Auto (30% of qty)"/>
                                    </IF>
                                    <IF label="Unit">
                                        <select className="sf-inp" value={assetForm.unit} onChange={e=>setAssetForm(p=>({...p,unit:e.target.value}))}>
                                            {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Unit Value (₹) *" error={ferr.valuePerUnit}>
                                        <input className="sf-inp" type="number" min="1" value={assetForm.valuePerUnit} onChange={e=>setAssetForm(p=>({...p,valuePerUnit:e.target.value}))} placeholder="0"/>
                                    </IF>
                                    <IF label="Location *" error={ferr.location}>
                                        <input className="sf-inp" value={assetForm.location} onChange={e=>setAssetForm(p=>({...p,location:e.target.value}))} placeholder="e.g. Electronics Lab"/>
                                    </IF>
                                    <IF label="Purchase Date *" error={ferr.purchaseDate}>
                                        <input className="sf-inp" type="date" value={assetForm.purchaseDate} onChange={e=>setAssetForm(p=>({...p,purchaseDate:e.target.value}))}/>
                                    </IF>
                                </div>
                            )}

                            {/* REORDER FORM */}
                            {modal==='reorder'&&(
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                                    <IF label="Asset *" error={ferr.assetId}>
                                        <select className="sf-inp" value={reorderForm.assetId} onChange={e=>setReorderForm(p=>({...p,assetId:e.target.value}))}>
                                            <option value="">Select asset</option>
                                            {assetList.map(a=><option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Quantity *" error={ferr.qty}>
                                        <input className="sf-inp" type="number" min="1" value={reorderForm.qty} onChange={e=>setReorderForm(p=>({...p,qty:e.target.value}))} placeholder="0"/>
                                    </IF>
                                    <IF label="Supplier *" error={ferr.supplier}>
                                        <select className="sf-inp" value={reorderForm.supplier} onChange={e=>setReorderForm(p=>({...p,supplier:e.target.value}))}>
                                            <option value="">Select supplier</option>
                                            {SUPPLIERS.map(s=><option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Expected Date *" error={ferr.expectedDate}>
                                        <input className="sf-inp" type="date" value={reorderForm.expectedDate} onChange={e=>setReorderForm(p=>({...p,expectedDate:e.target.value}))} min={today}/>
                                    </IF>
                                </div>
                            )}

                            {/* PO FORM */}
                            {modal==='po'&&(
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                                    <IF label="Item Name *" error={ferr.item}>
                                        <input className="sf-inp" value={poForm.item} onChange={e=>setPoForm(p=>({...p,item:e.target.value}))} placeholder="e.g. Digital Multimeter"/>
                                    </IF>
                                    <IF label="Category">
                                        <select className="sf-inp" value={poForm.category} onChange={e=>setPoForm(p=>({...p,category:e.target.value}))}>
                                            {CATS.slice(1).map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Quantity *" error={ferr.qty}>
                                        <input className="sf-inp" type="number" min="1" value={poForm.qty} onChange={e=>setPoForm(p=>({...p,qty:e.target.value}))} placeholder="0"/>
                                    </IF>
                                    <IF label="Unit Price (₹) *" error={ferr.unitPrice}>
                                        <input className="sf-inp" type="number" min="1" value={poForm.unitPrice} onChange={e=>setPoForm(p=>({...p,unitPrice:e.target.value}))} placeholder="0"/>
                                    </IF>
                                    <IF label="Supplier *" error={ferr.supplier}>
                                        <select className="sf-inp" value={poForm.supplier} onChange={e=>setPoForm(p=>({...p,supplier:e.target.value}))}>
                                            <option value="">Select supplier</option>
                                            {SUPPLIERS.map(s=><option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Requested By">
                                        <input className="sf-inp" value={poForm.requestedBy} onChange={e=>setPoForm(p=>({...p,requestedBy:e.target.value}))} placeholder="e.g. Admin Office"/>
                                    </IF>
                                    <IF label="Expected Date *" error={ferr.expectedDate}>
                                        <input className="sf-inp" type="date" value={poForm.expectedDate} onChange={e=>setPoForm(p=>({...p,expectedDate:e.target.value}))} min={today}/>
                                    </IF>
                                </div>
                            )}

                            {/* MAINTENANCE FORM */}
                            {modal==='maintenance'&&(
                                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                                    <IF label="Asset Name *" error={ferr.assetName}>
                                        <input className="sf-inp" value={mntForm.assetName} onChange={e=>setMntForm(p=>({...p,assetName:e.target.value}))} placeholder="e.g. Digital Oscilloscope"/>
                                    </IF>
                                    <IF label="Category">
                                        <select className="sf-inp" value={mntForm.category} onChange={e=>setMntForm(p=>({...p,category:e.target.value}))}>
                                            {CATS.slice(1).map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Maintenance Type">
                                        <select className="sf-inp" value={mntForm.type} onChange={e=>setMntForm(p=>({...p,type:e.target.value}))}>
                                            <option value="Preventive">Preventive</option>
                                            <option value="Corrective">Corrective</option>
                                        </select>
                                    </IF>
                                    <IF label="Scheduled Date *" error={ferr.schedDate}>
                                        <input className="sf-inp" type="date" value={mntForm.schedDate} onChange={e=>setMntForm(p=>({...p,schedDate:e.target.value}))}/>
                                    </IF>
                                    <IF label="Performed By *" error={ferr.doneBy}>
                                        <select className="sf-inp" value={mntForm.doneBy} onChange={e=>setMntForm(p=>({...p,doneBy:e.target.value}))}>
                                            <option value="">Select vendor</option>
                                            {SUPPLIERS.map(s=><option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </IF>
                                    <IF label="Estimated Cost (₹)">
                                        <input className="sf-inp" type="number" min="0" value={mntForm.cost} onChange={e=>setMntForm(p=>({...p,cost:e.target.value}))} placeholder="0"/>
                                    </IF>
                                    <div style={{gridColumn:'span 2'}}>
                                        <IF label="Notes">
                                            <textarea className="sf-inp" rows={2} value={mntForm.notes} onChange={e=>setMntForm(p=>({...p,notes:e.target.value}))} placeholder="Describe the maintenance work…" style={{resize:'vertical'}}/>
                                        </IF>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-foot">
                            <button className="btn btn-secondary btn-sm" onClick={closeModal}>Cancel</button>
                            <button className="btn btn-primary btn-sm"
                                onClick={modal==='asset'?submitAsset:modal==='reorder'?submitReorder:modal==='po'?submitPO:submitMnt}>
                                {editMode?'Save Changes':modal==='reorder'?'Submit Reorder':'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .inv-reorder-btn { background:#fef2f2 !important; color:#dc2626 !important; border-color:#fca5a5 !important; }
        /* Modal */
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:1000; display:grid; place-items:center; padding:20px; backdrop-filter:blur(2px); }
        .modal-box { background:white; border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.2); width:100%; max-width:660px; max-height:90vh; overflow-y:auto; }
        .modal-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 16px; border-bottom:1px solid var(--border); }
        .modal-head h3 { font-size:1rem; font-weight:700; color:var(--text-primary); margin:0; }
        .modal-close { border:none; background:var(--bg-hover); border-radius:7px; width:28px; height:28px; display:grid; place-items:center; cursor:pointer; color:var(--text-muted); }
        .modal-close:hover { background:#fef2f2; color:#dc2626; }
        .sf-body { padding:20px 24px; }
        .sf-field { display:flex; flex-direction:column; gap:5px; }
        .sf-label { font-size:0.78rem; font-weight:600; color:var(--text-secondary); }
        .sf-inp { border:1.5px solid var(--border); border-radius:8px; padding:8px 12px; font-size:0.85rem; color:var(--text-primary); background:var(--bg); font-family:var(--font-body); outline:none; transition:border 0.15s; width:100%; box-sizing:border-box; }
        .sf-inp:focus { border-color:#6366f1; }
        .sf-error { font-size:0.72rem; color:#dc2626; }
        .modal-foot { display:flex; justify-content:flex-end; gap:10px; padding:16px 24px; border-top:1px solid var(--border); }
        [data-theme="dark"] .modal-box { background:var(--bg-card); }
        @media(max-width:900px){ .inv-summary{ grid-template-columns:repeat(2,1fr); } }
      `}</style>
        </div>
    );
}
