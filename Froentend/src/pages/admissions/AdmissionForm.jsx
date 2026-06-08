import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft, ChevronRight, Check, User, BookOpen, GraduationCap,
    FileCheck, Phone, Mail, MapPin, Calendar, Droplets, Award,
    School, Hash, Layers, Clock, ArrowLeft,
} from 'lucide-react';
import { COURSES, BLOOD_GROUPS } from '../../utils/constants.js';
import Logo from '../../components/common/Logo.jsx';

/* ─── Constants ─────────────────────────────────────────────────────── */
const STEPS = [
    { num: 1, label: 'Personal Info',    Icon: User,          desc: 'Personal & contact details' },
    { num: 2, label: 'Academic Details', Icon: BookOpen,      desc: '10th, 12th & entrance exam' },
    { num: 3, label: 'Course Selection', Icon: GraduationCap, desc: 'Programme & category' },
    { num: 4, label: 'Review & Submit',  Icon: FileCheck,     desc: 'Verify and submit' },
];

const CATEGORIES = ['General', 'OBC', 'SC', 'ST', 'EWS'];
const QUOTAS     = ['None', 'Sports', 'NRI', 'Management', 'Differently Abled'];
const BOARDS     = ['CBSE', 'ICSE', 'State Board', 'NIOS', 'IB', 'Other'];
const YEARS      = Array.from({ length: 10 }, (_, i) => String(2025 - i));
const GENDERS    = ['Male', 'Female', 'Other'];
const SHIFTS     = ['Morning', 'Afternoon', 'Evening'];

const EMPTY = {
    firstName: '', lastName: '', dob: '', gender: '', bloodGroup: '',
    phone: '', email: '', address: '', city: '', state: '', pincode: '',
    board10: '', year10: '', score10: '',
    board12: '', year12: '', score12: '',
    entScore: '', entExam: '',
    course: '', category: '', quota: 'None', shiftPref: 'Morning',
};

/* ─── Reusable Field ─────────────────────────────────────────────────── */
function Field({ label, name, type = 'text', placeholder = '', options, required, full, icon: Icon, form, errors, onSet }) {
    const err = errors[name];
    const base = {
        width: '100%', padding: Icon ? '10px 13px 10px 38px' : '10px 13px',
        border: `1.5px solid ${err ? '#ef4444' : '#e2e8f0'}`,
        borderRadius: 10, background: err ? '#fff5f5' : 'white',
        fontSize: '0.875rem', color: '#0f172a', outline: 'none',
        boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s',
    };
    return (
        <div style={{ gridColumn: full ? '1 / -1' : undefined, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: '0.73rem', fontWeight: 600, color: err ? '#ef4444' : '#64748b', letterSpacing: '0.03em' }}>
                {label}{required && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <div style={{ position: 'relative' }}>
                {Icon && (
                    <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: err ? '#ef4444' : '#94a3b8', pointerEvents: 'none', display: 'flex' }}>
                        <Icon size={14} />
                    </span>
                )}
                {options ? (
                    <select style={{ ...base, cursor: 'pointer', appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 11px center',
                        paddingRight: 32,
                    }}
                        value={form[name]} onChange={e => onSet(name, e.target.value)}>
                        <option value="">Select…</option>
                        {options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                ) : (
                    <input style={base} type={type} value={form[name]} placeholder={placeholder} onChange={e => onSet(name, e.target.value)} />
                )}
            </div>
            {err && <span style={{ fontSize: '0.68rem', color: '#ef4444' }}>⚠ {err}</span>}
        </div>
    );
}

/* ─── Section heading inside form ───────────────────────────────────── */
function SectionHead({ icon: Icon, label, color }) {
    const c = color || '#3b82f6';
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: c + '1a', display: 'grid', placeItems: 'center' }}>
                <Icon size={15} color={c} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {label}
            </span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
        </div>
    );
}

/* ─── Review group ───────────────────────────────────────────────────── */
function ReviewGroup({ title, rows }) {
    return (
        <div style={{ marginBottom: 16, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '10px 18px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.73rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {title}
            </div>
            {rows.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', padding: '9px 18px', borderBottom: '1px solid #f1f5f9', gap: 12 }}>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 500, minWidth: 148, flexShrink: 0 }}>{k}</span>
                    <span style={{ fontSize: '0.83rem', color: '#0f172a', fontWeight: 600, flex: 1, wordBreak: 'break-word' }}>{v || '—'}</span>
                </div>
            ))}
        </div>
    );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function AdmissionForm() {
    const navigate = useNavigate();
    const [step, setStep]           = useState(1);
    const [form, setForm]           = useState(EMPTY);
    const [errors, setErrors]       = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [appId, setAppId]         = useState('');

    const set = (k, v) => {
        setForm(p => ({ ...p, [k]: v }));
        if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n; });
    };

    const validate = () => {
        const e = {};
        if (step === 1) {
            if (!form.firstName.trim()) e.firstName = 'Required';
            if (!form.lastName.trim())  e.lastName  = 'Required';
            if (!form.dob)              e.dob       = 'Required';
            if (!form.gender)           e.gender    = 'Required';
            if (!form.phone.match(/^\d{10}$/))                    e.phone = '10-digit number required';
            if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
            if (!form.address.trim()) e.address = 'Required';
            if (!form.city.trim())    e.city    = 'Required';
            if (!form.state.trim())   e.state   = 'Required';
            if (!form.pincode.match(/^\d{6}$/)) e.pincode = '6-digit pincode required';
        }
        if (step === 2) {
            if (!form.board10) e.board10 = 'Required';
            if (!form.year10)  e.year10  = 'Required';
            const s10 = parseFloat(form.score10);
            if (!form.score10 || isNaN(s10) || s10 < 0 || s10 > 100) e.score10 = '0–100 required';
            if (!form.board12) e.board12 = 'Required';
            if (!form.year12)  e.year12  = 'Required';
            const s12 = parseFloat(form.score12);
            if (!form.score12 || isNaN(s12) || s12 < 0 || s12 > 100) e.score12 = '0–100 required';
            const ent = parseFloat(form.entScore);
            if (!form.entScore || isNaN(ent) || ent < 0 || ent > 100) e.entScore = '0–100 required';
        }
        if (step === 3) {
            if (!form.course)   e.course   = 'Required';
            if (!form.category) e.category = 'Required';
        }
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const next         = () => { if (validate()) setStep(s => s + 1); };
    const back         = () => setStep(s => s - 1);
    const handleSubmit = () => {
        setAppId('APP' + Date.now().toString().slice(-7));
        setSubmitted(true);
    };

    const s10  = parseFloat(form.score10)  || 0;
    const s12  = parseFloat(form.score12)  || 0;
    const ent  = parseFloat(form.entScore) || 0;
    const comp = +(s10 * 0.3 + s12 * 0.3 + ent * 0.4).toFixed(2);
    const fp   = { form, errors, onSet: set };

    /* ── Success screen ── */
    if (submitted) {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ background: 'white', borderRadius: 20, padding: '52px 44px', textAlign: 'center', maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(30,58,138,0.12)', border: '1px solid #e0f2fe' }}>
                    <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, #059669, #10b981)', display: 'grid', placeItems: 'center', margin: '0 auto 24px', boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}>
                        <Check size={34} color="white" strokeWidth={2.5} />
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px' }}>
                        Application Submitted!
                    </h2>
                    <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: 28, lineHeight: 1.6 }}>
                        Your application has been received and is under review.<br />
                        We&apos;ll notify you at <strong style={{ color: '#0f172a' }}>{form.email}</strong>.
                    </p>
                    <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', borderRadius: 14, padding: '18px 28px', marginBottom: 28, display: 'inline-block', minWidth: 220 }}>
                        <div style={{ fontSize: '0.66rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Application ID</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '0.08em', fontFamily: 'monospace' }}>{appId}</div>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: 32 }}>
                        Save this ID for status tracking and future correspondence.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => navigate('/admissions')} style={{ padding: '10px 22px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', color: '#334155', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                            View Applications
                        </button>
                        <button onClick={() => { setForm(EMPTY); setStep(1); setSubmitted(false); }} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                            New Application
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const cur = STEPS[step - 1];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

            {/* ══ LEFT PANEL ══════════════════════════════════════════════ */}
            <div style={{
                width: 300, flexShrink: 0,
                background: 'linear-gradient(170deg, #0f172a 0%, #1e3a8a 45%, #1d4ed8 100%)',
                display: 'flex', flexDirection: 'column',
                padding: '36px 28px',
                position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
            }}>
                {/* Branding */}
                <div style={{ marginBottom: 44 }}>
                    <Logo variant="icon" size="sm" />
                    <div style={{ marginTop: 10 }}>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>EduManage</div>
                        <div style={{ fontSize: '0.64rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500, marginTop: 2 }}>Admission Portal</div>
                    </div>
                </div>

                {/* Step list */}
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.38)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 22 }}>
                        Application Progress
                    </div>
                    {STEPS.map((st, i) => {
                        const done   = step > st.num;
                        const active = step === st.num;
                        const StIcon = st.Icon;
                        return (
                            <div key={st.num} style={{ display: 'flex', gap: 14 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{
                                        width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                                        background: done ? '#10b981' : active ? 'white' : 'rgba(255,255,255,0.1)',
                                        border: active ? '3px solid rgba(255,255,255,0.3)' : 'none',
                                        display: 'grid', placeItems: 'center',
                                        transition: 'all 0.3s ease',
                                        boxShadow: active ? '0 0 0 6px rgba(255,255,255,0.07)' : 'none',
                                    }}>
                                        {done
                                            ? <Check size={16} color="white" strokeWidth={2.5} />
                                            : <StIcon size={16} color={active ? '#1e3a8a' : 'rgba(255,255,255,0.4)'} />
                                        }
                                    </div>
                                    {i < STEPS.length - 1 && (
                                        <div style={{ width: 2, flex: 1, minHeight: 22, background: done ? '#10b981' : 'rgba(255,255,255,0.1)', margin: '6px 0', borderRadius: 2, transition: 'background 0.3s' }} />
                                    )}
                                </div>
                                <div style={{ paddingTop: 10, paddingBottom: i < STEPS.length - 1 ? 6 : 0 }}>
                                    <div style={{ fontSize: '0.84rem', fontWeight: active ? 700 : 500, color: active ? 'white' : done ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.35)', transition: 'color 0.2s', lineHeight: 1 }}>
                                        {st.label}
                                    </div>
                                    <div style={{ fontSize: '0.67rem', color: active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.28)', marginTop: 3, lineHeight: 1.4 }}>
                                        {st.desc}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom info */}
                <div style={{ marginTop: 36, borderRadius: 14, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>Academic Year</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>2026 – 27</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.38)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 3 }}>Deadline</div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fbbf24' }}>31 Jul 2026</div>
                        </div>
                    </div>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>
                        Need help? Contact admissions@school.edu
                    </div>
                </div>
            </div>

            {/* ══ RIGHT PANEL ═════════════════════════════════════════════ */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc' }}>
                <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 40px 64px' }}>

                    {/* Top back link */}
                    <button onClick={() => step > 1 ? back() : navigate('/admissions')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24, background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', padding: '4px 0', fontWeight: 500, fontFamily: 'inherit' }}>
                        <ArrowLeft size={14} /> {step > 1 ? 'Previous step' : 'Back to Admissions'}
                    </button>

                    {/* Page title */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#3b82f6', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                            Step {step} of {STEPS.length}
                        </div>
                        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                            {cur.label}
                        </h1>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 6, marginBottom: 0 }}>
                            {cur.desc}
                        </p>
                    </div>

                    {/* Progress strip */}
                    <div style={{ height: 5, background: '#e2e8f0', borderRadius: 99, marginBottom: 32, overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)', width: `${(step / 4) * 100}%`, transition: 'width 0.45s cubic-bezier(.4,0,.2,1)' }} />
                    </div>

                    {/* ── Form card ── */}
                    <div style={{ background: 'white', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(15,23,42,0.06)', overflow: 'hidden' }}>
                        <div style={{ padding: '32px 36px' }}>

                            {/* STEP 1 ─ Personal Info */}
                            {step === 1 && (
                                <>
                                    <SectionHead icon={User}   label="Personal Details"      color="#3b82f6" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 28 }}>
                                        <Field {...fp} label="First Name"    name="firstName"  icon={User}     placeholder="e.g. Rahul"   required />
                                        <Field {...fp} label="Last Name"     name="lastName"   icon={User}     placeholder="e.g. Sharma"  required />
                                        <Field {...fp} label="Date of Birth" name="dob"        icon={Calendar} type="date"                required />
                                        <Field {...fp} label="Gender"        name="gender"     icon={User}     options={GENDERS}           required />
                                        <Field {...fp} label="Blood Group"   name="bloodGroup" icon={Droplets} options={BLOOD_GROUPS} />
                                    </div>

                                    <SectionHead icon={Phone} label="Contact Information" color="#8b5cf6" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 28 }}>
                                        <Field {...fp} label="Phone Number"  name="phone" icon={Phone} type="tel"   placeholder="10-digit mobile"   required />
                                        <Field {...fp} label="Email Address" name="email" icon={Mail}  type="email" placeholder="you@example.com"    required />
                                    </div>

                                    <SectionHead icon={MapPin} label="Address" color="#ef4444" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px' }}>
                                        <Field {...fp} label="Street Address" name="address" icon={MapPin} placeholder="House No., Street, Area" required full />
                                        <Field {...fp} label="City"    name="city"    icon={MapPin} placeholder="e.g. Mumbai"      required />
                                        <Field {...fp} label="State"   name="state"   icon={MapPin} placeholder="e.g. Maharashtra" required />
                                        <Field {...fp} label="Pincode" name="pincode" icon={Hash}   placeholder="6-digit pincode"  required />
                                    </div>
                                </>
                            )}

                            {/* STEP 2 ─ Academic Details */}
                            {step === 2 && (
                                <>
                                    <SectionHead icon={School} label="10th Standard" color="#0891b2" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 28 }}>
                                        <Field {...fp} label="Board"             name="board10" icon={Award}    options={BOARDS} required />
                                        <Field {...fp} label="Year of Passing"   name="year10"  icon={Calendar} options={YEARS}  required />
                                        <Field {...fp} label="Percentage / CGPA" name="score10" icon={Award}    type="number" placeholder="e.g. 88.5" required full />
                                    </div>

                                    <SectionHead icon={School} label="12th Standard" color="#7c3aed" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 28 }}>
                                        <Field {...fp} label="Board"             name="board12" icon={Award}    options={BOARDS} required />
                                        <Field {...fp} label="Year of Passing"   name="year12"  icon={Calendar} options={YEARS}  required />
                                        <Field {...fp} label="Percentage / CGPA" name="score12" icon={Award}    type="number" placeholder="e.g. 91.0" required full />
                                    </div>

                                    <SectionHead icon={FileCheck} label="Entrance Examination" color="#d97706" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 8 }}>
                                        <Field {...fp} label="Exam Name (optional)"            name="entExam"  icon={FileCheck} placeholder="e.g. JEE, CUET" />
                                        <Field {...fp} label="Score / Percentile (out of 100)" name="entScore" icon={Award}     type="number" placeholder="e.g. 76" required />
                                    </div>

                                    {form.score10 && form.score12 && form.entScore && (
                                        <div style={{ marginTop: 24, padding: '20px 24px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', borderRadius: 14 }}>
                                            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.09em', textTransform: 'uppercase', marginBottom: 14 }}>
                                                Composite Score Preview
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
                                                {[
                                                    ['10th  ×30%', (s10 * 0.3).toFixed(1), '#0891b2'],
                                                    ['12th  ×30%', (s12 * 0.3).toFixed(1), '#7c3aed'],
                                                    ['Entrance ×40%', (ent * 0.4).toFixed(1), '#d97706'],
                                                ].map(([k, v, c]) => (
                                                    <div key={k}>
                                                        <div style={{ fontSize: '0.67rem', color: '#64748b', marginBottom: 4 }}>{k}</div>
                                                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: c }}>{v}</div>
                                                    </div>
                                                ))}
                                                <div style={{ marginLeft: 'auto', borderLeft: '1px solid #bfdbfe', paddingLeft: 24 }}>
                                                    <div style={{ fontSize: '0.67rem', color: '#64748b', marginBottom: 4 }}>Total Score</div>
                                                    <div style={{ fontSize: '1.7rem', fontWeight: 800, color: comp >= 75 ? '#059669' : comp >= 60 ? '#d97706' : '#dc2626' }}>
                                                        {comp}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* STEP 3 ─ Course Selection */}
                            {step === 3 && (
                                <>
                                    <SectionHead icon={GraduationCap} label="Programme Selection" color="#1d4ed8" />
                                    <div style={{ marginBottom: 28 }}>
                                        <Field {...fp} label="Preferred Course" name="course" icon={BookOpen} options={COURSES} required full />
                                    </div>

                                    <SectionHead icon={Layers} label="Category & Quota" color="#059669" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 28 }}>
                                        <Field {...fp} label="Admission Category" name="category"  icon={Layers} options={CATEGORIES} required />
                                        <Field {...fp} label="Quota"              name="quota"     icon={Award}  options={QUOTAS} />
                                    </div>

                                    <SectionHead icon={Clock} label="Schedule Preference" color="#d97706" />
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 20px', marginBottom: 24 }}>
                                        <Field {...fp} label="Shift Preference" name="shiftPref" icon={Clock} options={SHIFTS} />
                                    </div>

                                    <div style={{ padding: '14px 18px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, fontSize: '0.78rem', color: '#92400e', lineHeight: 1.6 }}>
                                        <strong>Note:</strong> Seat allocation is subject to merit ranking, category reservation, and institutional rules.
                                    </div>
                                </>
                            )}

                            {/* STEP 4 ─ Review & Submit */}
                            {step === 4 && (
                                <>
                                    <ReviewGroup title="Personal Information" rows={[
                                        ['Full Name',     `${form.firstName} ${form.lastName}`],
                                        ['Date of Birth',  form.dob ? new Date(form.dob + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''],
                                        ['Gender',         form.gender],
                                        ['Blood Group',    form.bloodGroup],
                                        ['Phone',          form.phone],
                                        ['Email',          form.email],
                                        ['Address',       [form.address, form.city, form.state, form.pincode].filter(Boolean).join(', ')],
                                    ]} />
                                    <ReviewGroup title="Academic Details" rows={[
                                        ['10th Board / Year', `${form.board10 || '—'} / ${form.year10 || '—'}`],
                                        ['10th Score',        form.score10 ? `${form.score10}%` : ''],
                                        ['12th Board / Year', `${form.board12 || '—'} / ${form.year12 || '—'}`],
                                        ['12th Score',        form.score12 ? `${form.score12}%` : ''],
                                        ['Entrance Exam',      form.entExam || 'N/A'],
                                        ['Entrance Score',    form.entScore ? `${form.entScore}%` : ''],
                                        ['Composite Score',   `${comp}%`],
                                    ]} />
                                    <ReviewGroup title="Course & Category" rows={[
                                        ['Course',      form.course],
                                        ['Category',    form.category],
                                        ['Quota',       form.quota],
                                        ['Shift Pref.', form.shiftPref],
                                    ]} />

                                    <div style={{ padding: '14px 18px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, fontSize: '0.8rem', color: '#78350f', lineHeight: 1.6, marginTop: 8 }}>
                                        <strong>Declaration:</strong> I hereby declare that all information provided is true, correct and complete. Any false information may result in cancellation of admission.
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Footer nav ── */}
                        <div style={{ padding: '18px 36px', borderTop: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            {step > 1 ? (
                                <button onClick={back} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    <ChevronLeft size={16} /> Back
                                </button>
                            ) : (
                                <button onClick={() => navigate('/admissions')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Cancel
                                </button>
                            )}

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ fontSize: '0.73rem', color: '#94a3b8', fontWeight: 500 }}>
                                    {step} / {STEPS.length} completed
                                </span>
                                {step < 4 ? (
                                    <button onClick={next} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(30,58,138,0.3)', fontFamily: 'inherit' }}>
                                        {step === 3 ? 'Review Application' : 'Continue'} <ChevronRight size={16} />
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.35)', fontFamily: 'inherit' }}>
                                        <Check size={16} /> Submit Application
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
