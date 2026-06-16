import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { api } from '../../services/api.js';
import { db } from '../../config/firebase.js';
import Navbar from '../../components/layout/Navbar.jsx';
import {
    ArrowLeft, UserPlus, User, Phone, Mail, MapPin, Calendar,
    Droplets, BookOpen, Hash, Clock, Shield, Users, Check,
    GraduationCap, Building2, BadgeCheck,
} from 'lucide-react';
import { COURSES, BLOOD_GROUPS, YEARS } from '../../utils/constants.js';

/* ─── Reusable Field ─────────────────────────────────────────────────── */
function Field({ label, req, error, icon: Icon, full, children }) {
    return (
        <div style={{ gridColumn: full ? '1 / -1' : undefined, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <label style={{ fontSize: '0.73rem', fontWeight: 600, color: error ? '#ef4444' : '#64748b', letterSpacing: '0.03em' }}>
                {label}{req && <span style={{ color: '#ef4444' }}> *</span>}
            </label>
            <div style={{ position: 'relative' }}>
                {Icon && (
                    <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: error ? '#ef4444' : '#94a3b8', pointerEvents: 'none', display: 'flex', zIndex: 1 }}>
                        <Icon size={14} />
                    </span>
                )}
                {children}
            </div>
            {error && <span style={{ fontSize: '0.68rem', color: '#ef4444' }}>⚠ {error}</span>}
        </div>
    );
}

const iStyle = (err, hasIcon) => ({
    width: '100%', padding: hasIcon ? '10px 13px 10px 36px' : '10px 13px',
    border: `1.5px solid ${err ? '#ef4444' : '#e2e8f0'}`,
    borderRadius: 10, background: err ? '#fff5f5' : '#fafafa',
    fontSize: '0.875rem', color: '#0f172a', outline: 'none',
    boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s',
    appearance: 'none',
});

const selStyle = (err, hasIcon) => ({
    ...iStyle(err, hasIcon),
    cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 32,
});

/* ─── Section card ───────────────────────────────────────────────────── */
function SectionCard({ num, title, subtitle, accent, icon: Icon, children }) {
    return (
        <div style={{
            background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(15,23,42,0.05)', overflow: 'hidden', marginBottom: 20,
        }}>
            {/* Colored top accent bar */}
            <div style={{ height: 3, background: accent }} />
            <div style={{ padding: '22px 28px 26px' }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        background: accent + '18',
                        display: 'grid', placeItems: 'center',
                    }}>
                        <Icon size={20} color={accent} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: '0.6rem', fontWeight: 700, color: accent, background: accent + '18', borderRadius: 5, padding: '2px 6px', letterSpacing: '0.06em' }}>
                                {num}
                            </span>
                            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h3>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '3px 0 0', fontWeight: 500 }}>{subtitle}</p>
                    </div>
                </div>
                {/* Divider */}
                <div style={{ height: 1, background: '#f1f5f9', marginBottom: 22 }} />
                {children}
            </div>
        </div>
    );
}

/* ─── Avatar preview ─────────────────────────────────────────────────── */
function StudentPreview({ form }) {
    const initials = [form.firstName, form.lastName].filter(Boolean).map(s => s[0].toUpperCase()).join('') || '?';
    const filled = [form.firstName, form.phone, form.email, form.course, form.guardianName].filter(Boolean).length;
    const pct = Math.round((filled / 5) * 100);

    return (
        <div style={{
            background: 'white', borderRadius: 16, border: '1px solid #e2e8f0',
            boxShadow: '0 2px 12px rgba(15,23,42,0.05)', overflow: 'hidden', position: 'sticky', top: 20,
        }}>
            <div style={{ height: 3, background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)' }} />
            <div style={{ padding: '24px 22px' }}>
                {/* Avatar */}
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: '50%', margin: '0 auto 12px',
                        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
                        display: 'grid', placeItems: 'center',
                        fontSize: '1.4rem', fontWeight: 800, color: 'white',
                        boxShadow: '0 4px 16px rgba(30,58,138,0.3)',
                        fontFamily: '-apple-system, sans-serif',
                    }}>
                        {initials}
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                        {[form.firstName, form.lastName].filter(Boolean).join(' ') || 'New Student'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 3 }}>
                        {form.course || 'No course selected'}
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#f1f5f9', marginBottom: 16 }} />

                {/* Quick details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {[
                        { icon: Phone, label: form.phone || 'Phone not set', filled: !!form.phone },
                        { icon: Mail, label: form.email || 'Email not set', filled: !!form.email },
                        { icon: GraduationCap, label: form.course || 'Course not set', filled: !!form.course },
                        { icon: BadgeCheck, label: form.rollNo || 'Roll no. not set', filled: !!form.rollNo },
                    ].map(({ icon: Icon, label, filled }) => (
                        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <div style={{
                                width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                                background: filled ? '#dbeafe' : '#f1f5f9',
                                display: 'grid', placeItems: 'center',
                            }}>
                                <Icon size={13} color={filled ? '#1d4ed8' : '#94a3b8'} />
                            </div>
                            <span style={{
                                fontSize: '0.75rem', color: filled ? '#334155' : '#94a3b8',
                                fontWeight: filled ? 500 : 400,
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                            }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Progress */}
                <div style={{ height: 1, background: '#f1f5f9', marginBottom: 14 }} />
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Form Completion</span>
                    <span style={{ color: pct >= 80 ? '#059669' : pct >= 40 ? '#d97706' : '#94a3b8' }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: '#f1f5f9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', borderRadius: 99, transition: 'width 0.4s ease',
                        width: `${pct}%`,
                        background: pct >= 80 ? 'linear-gradient(90deg,#059669,#10b981)' : pct >= 40 ? 'linear-gradient(90deg,#d97706,#f59e0b)' : 'linear-gradient(90deg,#1e3a8a,#3b82f6)',
                    }} />
                </div>
            </div>
        </div>
    );
}

const YEAR_LABELS = { '1': '1st', '2': '2nd', '3': '3rd', '4': '4th', '5': '4th' };

/* ─── Main component ─────────────────────────────────────────────────── */
export default function AddStudent() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        firstName: '', lastName: '', dob: '', gender: '',
        bloodGroup: '', phone: '', email: '', city: '', address: '',
        course: '', year: '1', rollNo: '', admissionDate: '', status: 'Active',
        guardianName: '', guardianRelation: '', guardianPhone: '',
    });

    const set = (k) => (e) => {
        setForm(f => ({ ...f, [k]: e.target.value }));
        if (errors[k]) setErrors(er => ({ ...er, [k]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'First name is required';
        if (!form.phone || form.phone.length !== 10) e.phone = '10-digit number required';
        if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required';
        if (!form.course) e.course = 'Please select a course';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);

        const studentPayload = {
            name: `${form.firstName} ${form.lastName}`.trim(),
            email: form.email,
            phone: form.phone,
            course: form.course,
            year: YEAR_LABELS[String(form.year)] || '1st',
            status: form.status,
            ...(form.dob           && { dob: form.dob }),
            ...(form.gender        && { gender: form.gender }),
            ...(form.city          && { city: form.city }),
            ...(form.address       && { address: form.address }),
            ...(form.rollNo        && { rollNumber: form.rollNo }),
            ...(form.admissionDate && { admissionDate: form.admissionDate }),
            ...(form.guardianName  && { parentName: form.guardianName }),
            ...(form.guardianPhone && { parentPhone: form.guardianPhone }),
        };

        try {
            try {
                // Try MongoDB backend first
                await api.post('/students', studentPayload);
            } catch {
                // Backend unavailable — save to Firebase Firestore
                await addDoc(collection(db, 'students'), {
                    ...studentPayload,
                    createdAt: serverTimestamp(),
                });
            }
            setDone(true);
            setTimeout(() => navigate('/students'), 1800);
        } catch (err) {
            setErrors(er => ({ ...er, submit: 'Failed to save student. Please try again.' }));
        } finally {
            setSaving(false);
        }
    };

    /* ── Success overlay ── */
    if (done) {
        return (
            <div className="erp-page">
                <Navbar title="Add Student" subtitle="Register a new student record" />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#059669,#10b981)', display: 'grid', placeItems: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(5,150,105,0.35)' }}>
                            <Check size={32} color="white" strokeWidth={2.5} />
                        </div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>Student Registered!</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Redirecting to students list…</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="erp-page">
            <Navbar title="Add Student" subtitle="Register a new student record" />

            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Back */}
                <button
                    type="button"
                    onClick={() => navigate('/students')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 22, background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer', padding: '4px 0', fontWeight: 500, fontFamily: 'inherit' }}
                >
                    <ArrowLeft size={15} /> Back to Students
                </button>

                {/* Page heading */}
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Register New Student</h1>
                    <p style={{ fontSize: '0.83rem', color: '#64748b', marginTop: 4 }}>Fill in all required fields to add the student to the system.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>

                        {/* ── Left: form sections ── */}
                        <div>

                            {/* Section 1: Personal Info */}
                            <SectionCard num="01" title="Personal Information" subtitle="Basic personal details of the student" accent="#3b82f6" icon={User}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>
                                    <Field label="First Name" req error={errors.firstName} icon={User}>
                                        <input style={iStyle(errors.firstName, true)} placeholder="e.g. Rahul" value={form.firstName} onChange={set('firstName')} />
                                    </Field>
                                    <Field label="Last Name" icon={User}>
                                        <input style={iStyle(false, true)} placeholder="e.g. Sharma" value={form.lastName} onChange={set('lastName')} />
                                    </Field>
                                    <Field label="Date of Birth" icon={Calendar}>
                                        <input type="date" style={iStyle(false, true)} value={form.dob} onChange={set('dob')} />
                                    </Field>
                                    <Field label="Gender" icon={User}>
                                        <select style={selStyle(false, true)} value={form.gender} onChange={set('gender')}>
                                            <option value="">Select gender</option>
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </Field>
                                    <Field label="Blood Group" icon={Droplets}>
                                        <select style={selStyle(false, true)} value={form.bloodGroup} onChange={set('bloodGroup')}>
                                            <option value="">Select blood group</option>
                                            {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Phone Number" req error={errors.phone} icon={Phone}>
                                        <input style={iStyle(errors.phone, true)} placeholder="10-digit mobile" value={form.phone} onChange={set('phone')} maxLength={10} />
                                    </Field>
                                    <Field label="Email Address" req error={errors.email} icon={Mail} full>
                                        <input type="email" style={iStyle(errors.email, true)} placeholder="student@example.com" value={form.email} onChange={set('email')} />
                                    </Field>
                                    <Field label="City" icon={MapPin}>
                                        <input style={iStyle(false, true)} placeholder="e.g. Mumbai" value={form.city} onChange={set('city')} />
                                    </Field>
                                    <Field label="Full Address" icon={MapPin} full>
                                        <textarea
                                            rows={2}
                                            style={{ ...iStyle(false, true), resize: 'vertical', lineHeight: 1.5 }}
                                            placeholder="Street address, locality, pincode…"
                                            value={form.address}
                                            onChange={set('address')}
                                        />
                                    </Field>
                                </div>
                            </SectionCard>

                            {/* Section 2: Academic */}
                            <SectionCard num="02" title="Academic Details" subtitle="Course enrollment and academic information" accent="#059669" icon={GraduationCap}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>
                                    <Field label="Course" req error={errors.course} icon={BookOpen} full>
                                        <select style={selStyle(errors.course, true)} value={form.course} onChange={set('course')}>
                                            <option value="">Select course</option>
                                            {COURSES.map(c => <option key={c}>{c}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Year of Study" icon={Clock}>
                                        <select style={selStyle(false, true)} value={form.year} onChange={set('year')}>
                                            {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                                        </select>
                                    </Field>
                                    <Field label="Roll Number" icon={Hash}>
                                        <input style={iStyle(false, true)} placeholder="e.g. CS2024001" value={form.rollNo} onChange={set('rollNo')} />
                                    </Field>
                                    <Field label="Admission Date" icon={Calendar}>
                                        <input type="date" style={iStyle(false, true)} value={form.admissionDate} onChange={set('admissionDate')} />
                                    </Field>
                                    <Field label="Status" icon={BadgeCheck}>
                                        <select style={selStyle(false, true)} value={form.status} onChange={set('status')}>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
                                    </Field>
                                </div>
                            </SectionCard>

                            {/* Section 3: Guardian */}
                            <SectionCard num="03" title="Guardian Details" subtitle="Parent or guardian contact information" accent="#7c3aed" icon={Users}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 18px' }}>
                                    <Field label="Guardian Full Name" icon={User}>
                                        <input style={iStyle(false, true)} placeholder="Full name" value={form.guardianName} onChange={set('guardianName')} />
                                    </Field>
                                    <Field label="Relation" icon={Users}>
                                        <select style={selStyle(false, true)} value={form.guardianRelation} onChange={set('guardianRelation')}>
                                            <option value="">Select relation</option>
                                            <option>Father</option>
                                            <option>Mother</option>
                                            <option>Sibling</option>
                                            <option>Guardian</option>
                                        </select>
                                    </Field>
                                    <Field label="Guardian Phone" icon={Phone}>
                                        <input style={iStyle(false, true)} placeholder="10-digit mobile" value={form.guardianPhone} onChange={set('guardianPhone')} maxLength={10} />
                                    </Field>
                                </div>
                            </SectionCard>

                            {/* Actions */}
                            {errors.submit && (
                                <div style={{ marginBottom: 12, padding: '10px 14px', background: '#fff5f5', border: '1.5px solid #fecaca', borderRadius: 10, color: '#dc2626', fontSize: '0.82rem', fontWeight: 600 }}>
                                    ⚠ {errors.submit}
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4 }}>
                                <button
                                    type="button"
                                    onClick={() => navigate('/students')}
                                    style={{ padding: '11px 24px', borderRadius: 10, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', fontFamily: 'inherit' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 28px', borderRadius: 10, border: 'none', background: saving ? '#94a3b8' : 'linear-gradient(135deg,#1e3a8a 0%,#3b82f6 100%)', color: 'white', fontWeight: 700, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: saving ? 'none' : '0 4px 14px rgba(30,58,138,0.3)', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                >
                                    {saving ? (
                                        <><span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Saving…</>
                                    ) : (
                                        <><UserPlus size={16} /> Register Student</>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* ── Right: live preview ── */}
                        <StudentPreview form={form} />
                    </div>
                </form>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
