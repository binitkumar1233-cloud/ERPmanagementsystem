import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import { ArrowLeft, Save } from 'lucide-react';
import {
    DEPARTMENTS, QUALIFICATIONS, TEACHING_CERTIFICATIONS,
    DESIGNATIONS, EMPLOYMENT_TYPES, BLOOD_GROUPS,
} from '../../utils/constants.js';

const STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const SECTION_COLORS = ['#1e40af', '#059669', '#7c3aed', '#d97706'];

export default function AddTeacher() {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        /* Personal */
        prefix: '', firstName: '', lastName: '', dob: '', gender: '',
        bloodGroup: '', aadhaar: '',
        phone: '', altPhone: '', officialEmail: '', personalEmail: '',
        street: '', city: '', state: '', pincode: '',

        /* Professional */
        employeeId: '', designation: '', department: '', subject: '',
        employmentType: 'Full-time', experience: '', joinDate: '',
        salary: '', status: 'Active',

        /* Qualifications */
        highestQual: '', specialization: '', institution: '', yearOfPassing: '', percentage: '',
        additionalDegree: '', additionalInstitution: '', additionalYear: '',
        teachingCert: 'None', certInstitution: '', certYear: '',
        publications: '', expertise: '', linkedIn: '',

        /* Emergency Contact */
        emergencyName: '', emergencyRelation: '', emergencyPhone: '', emergencyEmail: '',
    });

    const set = (k) => (e) => {
        setForm(f => ({ ...f, [k]: e.target.value }));
        if (errors[k]) setErrors(er => ({ ...er, [k]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'First name is required';
        if (!form.phone || form.phone.length !== 10) e.phone = 'Enter a valid 10-digit number';
        if (!form.officialEmail) e.officialEmail = 'Official email is required';
        if (!form.department) e.department = 'Please select a department';
        if (!form.subject.trim()) e.subject = 'Subject is required';
        if (!form.designation) e.designation = 'Please select a designation';
        if (form.altPhone && form.altPhone.length !== 10) e.altPhone = 'Must be 10 digits';
        if (form.pincode && form.pincode.length !== 6) e.pincode = 'Must be 6 digits';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSaving(true);
        await new Promise(r => setTimeout(r, 900));
        setSaving(false);
        navigate('/teachers');
    };

    const F = ({ label, req, error, className = '', children }) => (
        <div className={`field ${className}`}>
            <label>{label}{req && <span className="req"> *</span>}</label>
            {children}
            {error && <span className="field-error">{error}</span>}
        </div>
    );

    const SectionHeader = ({ num, title, subtitle }) => (
        <div className="form-section-title">
            <div className="form-step-num" style={{ background: SECTION_COLORS[num - 1] }}>{String(num).padStart(2, '0')}</div>
            <div>
                <h3>{title}</h3>
                <p>{subtitle}</p>
            </div>
        </div>
    );

    return (
        <div className="erp-page">
            <Navbar title="Add Teacher" subtitle="Register a new faculty member" />

            <div className="form-page-wrap">
                <div style={{ marginBottom: 18 }}>
                    <button className="back-btn" onClick={() => navigate('/teachers')}>
                        <ArrowLeft size={15} /> Back to Teachers
                    </button>
                </div>

                <form className="form-card" onSubmit={handleSubmit}>

                    {/* ── Section 1: Personal Information ── */}
                    <div className="form-section">
                        <SectionHeader num={1} title="Personal Information" subtitle="Basic personal details of the faculty member" />
                        <div className="form-grid">
                            <F label="Prefix">
                                <select value={form.prefix} onChange={set('prefix')}>
                                    <option value="">Select</option>
                                    <option>Dr.</option>
                                    <option>Prof.</option>
                                    <option>Mr.</option>
                                    <option>Mrs.</option>
                                    <option>Ms.</option>
                                </select>
                            </F>
                            <F label="First Name" req error={errors.firstName}>
                                <input
                                    placeholder="First name"
                                    value={form.firstName}
                                    onChange={set('firstName')}
                                    className={errors.firstName ? 'input-error' : ''}
                                />
                            </F>
                            <F label="Last Name">
                                <input placeholder="Last name" value={form.lastName} onChange={set('lastName')} />
                            </F>
                            <F label="Date of Birth">
                                <input type="date" value={form.dob} onChange={set('dob')} />
                            </F>
                            <F label="Gender">
                                <select value={form.gender} onChange={set('gender')}>
                                    <option value="">Select gender</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </F>
                            <F label="Blood Group">
                                <select value={form.bloodGroup} onChange={set('bloodGroup')}>
                                    <option value="">Select blood group</option>
                                    {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                                </select>
                            </F>
                            <F label="Aadhaar Number">
                                <input placeholder="12-digit Aadhaar" value={form.aadhaar} onChange={set('aadhaar')} maxLength={12} />
                            </F>
                        </div>

                        <div style={{ margin: '16px 0 10px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Contact Details
                        </div>
                        <div className="form-grid">
                            <F label="Primary Phone" req error={errors.phone}>
                                <input
                                    placeholder="10-digit mobile number"
                                    value={form.phone}
                                    onChange={set('phone')}
                                    maxLength={10}
                                    className={errors.phone ? 'input-error' : ''}
                                />
                            </F>
                            <F label="Alternate Phone" error={errors.altPhone}>
                                <input
                                    placeholder="Alternate contact number"
                                    value={form.altPhone}
                                    onChange={set('altPhone')}
                                    maxLength={10}
                                    className={errors.altPhone ? 'input-error' : ''}
                                />
                            </F>
                            <F label="Official Email" req error={errors.officialEmail}>
                                <input
                                    type="email"
                                    placeholder="teacher@school.edu"
                                    value={form.officialEmail}
                                    onChange={set('officialEmail')}
                                    className={errors.officialEmail ? 'input-error' : ''}
                                />
                            </F>
                            <F label="Personal Email">
                                <input type="email" placeholder="personal@gmail.com" value={form.personalEmail} onChange={set('personalEmail')} />
                            </F>
                        </div>

                        <div style={{ margin: '16px 0 10px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Address
                        </div>
                        <div className="form-grid">
                            <F label="Street / Locality" className="col-full">
                                <input placeholder="House no., street, locality" value={form.street} onChange={set('street')} />
                            </F>
                            <F label="City">
                                <input placeholder="City" value={form.city} onChange={set('city')} />
                            </F>
                            <F label="State">
                                <select value={form.state} onChange={set('state')}>
                                    <option value="">Select state</option>
                                    {STATES.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </F>
                            <F label="Pincode" error={errors.pincode}>
                                <input
                                    placeholder="6-digit pincode"
                                    value={form.pincode}
                                    onChange={set('pincode')}
                                    maxLength={6}
                                    className={errors.pincode ? 'input-error' : ''}
                                />
                            </F>
                        </div>
                    </div>

                    <div className="form-divider" />

                    {/* ── Section 2: Professional Details ── */}
                    <div className="form-section">
                        <SectionHeader num={2} title="Professional Details" subtitle="Designation, department and employment information" />
                        <div className="form-grid">
                            <F label="Employee ID">
                                <input placeholder="e.g. TCH2024001" value={form.employeeId} onChange={set('employeeId')} />
                            </F>
                            <F label="Designation" req error={errors.designation}>
                                <select
                                    value={form.designation}
                                    onChange={set('designation')}
                                    className={errors.designation ? 'input-error' : ''}
                                >
                                    <option value="">Select designation</option>
                                    {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </F>
                            <F label="Department" req error={errors.department}>
                                <select
                                    value={form.department}
                                    onChange={set('department')}
                                    className={errors.department ? 'input-error' : ''}
                                >
                                    <option value="">Select department</option>
                                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </F>
                            <F label="Subject(s) Taught" req error={errors.subject}>
                                <input
                                    placeholder="e.g. Data Structures, Algorithms"
                                    value={form.subject}
                                    onChange={set('subject')}
                                    className={errors.subject ? 'input-error' : ''}
                                />
                            </F>
                            <F label="Employment Type">
                                <select value={form.employmentType} onChange={set('employmentType')}>
                                    {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                                </select>
                            </F>
                            <F label="Teaching Experience (Years)">
                                <input type="number" min="0" max="60" placeholder="e.g. 5" value={form.experience} onChange={set('experience')} />
                            </F>
                            <F label="Joining Date">
                                <input type="date" value={form.joinDate} onChange={set('joinDate')} />
                            </F>
                            <F label="Monthly Salary (₹)">
                                <input type="number" placeholder="e.g. 45000" value={form.salary} onChange={set('salary')} />
                            </F>
                            <F label="Status">
                                <select value={form.status} onChange={set('status')}>
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>On Leave</option>
                                </select>
                            </F>
                        </div>
                    </div>

                    <div className="form-divider" />

                    {/* ── Section 3: Qualification Details ── */}
                    <div className="form-section">
                        <SectionHeader num={3} title="Qualification Details" subtitle="Academic qualifications, certifications and research" />

                        <div style={{ margin: '0 0 10px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Highest Qualification
                        </div>
                        <div className="form-grid">
                            <F label="Degree / Qualification">
                                <select value={form.highestQual} onChange={set('highestQual')}>
                                    <option value="">Select qualification</option>
                                    {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                                </select>
                            </F>
                            <F label="Specialization / Subject">
                                <input placeholder="e.g. Computer Science, Mathematics" value={form.specialization} onChange={set('specialization')} />
                            </F>
                            <F label="University / Institution" className="col-full">
                                <input placeholder="Name of university or institution" value={form.institution} onChange={set('institution')} />
                            </F>
                            <F label="Year of Passing">
                                <input
                                    type="number"
                                    min="1970"
                                    max={new Date().getFullYear()}
                                    placeholder={String(new Date().getFullYear())}
                                    value={form.yearOfPassing}
                                    onChange={set('yearOfPassing')}
                                />
                            </F>
                            <F label="Percentage / CGPA">
                                <input placeholder="e.g. 78% or 8.5 CGPA" value={form.percentage} onChange={set('percentage')} />
                            </F>
                        </div>

                        <div style={{ margin: '16px 0 10px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Additional Degree (Optional)
                        </div>
                        <div className="form-grid">
                            <F label="Additional Degree">
                                <select value={form.additionalDegree} onChange={set('additionalDegree')}>
                                    <option value="">Select (if any)</option>
                                    {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                                </select>
                            </F>
                            <F label="Institution">
                                <input placeholder="University / institution name" value={form.additionalInstitution} onChange={set('additionalInstitution')} />
                            </F>
                            <F label="Year of Passing">
                                <input
                                    type="number"
                                    min="1970"
                                    max={new Date().getFullYear()}
                                    placeholder={String(new Date().getFullYear())}
                                    value={form.additionalYear}
                                    onChange={set('additionalYear')}
                                />
                            </F>
                        </div>

                        <div style={{ margin: '16px 0 10px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Teaching Certification
                        </div>
                        <div className="form-grid">
                            <F label="Certification">
                                <select value={form.teachingCert} onChange={set('teachingCert')}>
                                    {TEACHING_CERTIFICATIONS.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </F>
                            <F label="Certifying Institution">
                                <input placeholder="Institution name" value={form.certInstitution} onChange={set('certInstitution')} />
                            </F>
                            <F label="Year of Certification">
                                <input
                                    type="number"
                                    min="1970"
                                    max={new Date().getFullYear()}
                                    placeholder={String(new Date().getFullYear())}
                                    value={form.certYear}
                                    onChange={set('certYear')}
                                />
                            </F>
                        </div>

                        <div style={{ margin: '16px 0 10px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            Research & Expertise
                        </div>
                        <div className="form-grid">
                            <F label="Research Publications (Count)">
                                <input type="number" min="0" placeholder="0" value={form.publications} onChange={set('publications')} />
                            </F>
                            <F label="LinkedIn Profile">
                                <input placeholder="linkedin.com/in/username" value={form.linkedIn} onChange={set('linkedIn')} />
                            </F>
                            <F label="Areas of Expertise" className="col-full">
                                <textarea rows={2} placeholder="e.g. Machine Learning, Data Science, Python Programming" value={form.expertise} onChange={set('expertise')} />
                            </F>
                        </div>
                    </div>

                    <div className="form-divider" />

                    {/* ── Section 4: Emergency Contact ── */}
                    <div className="form-section">
                        <SectionHeader num={4} title="Emergency Contact" subtitle="Person to contact in case of emergency" />
                        <div className="form-grid">
                            <F label="Contact Name">
                                <input placeholder="Full name" value={form.emergencyName} onChange={set('emergencyName')} />
                            </F>
                            <F label="Relation">
                                <select value={form.emergencyRelation} onChange={set('emergencyRelation')}>
                                    <option value="">Select relation</option>
                                    <option>Spouse</option>
                                    <option>Father</option>
                                    <option>Mother</option>
                                    <option>Sibling</option>
                                    <option>Son</option>
                                    <option>Daughter</option>
                                    <option>Friend</option>
                                    <option>Other</option>
                                </select>
                            </F>
                            <F label="Phone Number">
                                <input placeholder="10-digit mobile number" value={form.emergencyPhone} onChange={set('emergencyPhone')} maxLength={10} />
                            </F>
                            <F label="Email Address">
                                <input type="email" placeholder="emergency@example.com" value={form.emergencyEmail} onChange={set('emergencyEmail')} />
                            </F>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/teachers')}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? <><span className="spinner" /> Saving…</> : <><Save size={15} /> Save Teacher</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
