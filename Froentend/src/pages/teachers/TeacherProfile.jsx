import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar.jsx';
import {
    ArrowLeft, Edit2, Phone, Mail, MapPin, Calendar, Award,
    Briefcase, BookOpen, GraduationCap, User, Heart, Linkedin,
    FileText, Star, Building, Clock,
} from 'lucide-react';
import { getAvatarColor } from '../../utils/helpers.js';

/* Mock detailed data — replace with API call when backend is ready */
const TEACHER_DATA = {
    TCH001: {
        id: 'TCH001', prefix: 'Dr.', firstName: 'Kavitha', lastName: 'Rao',
        dob: '1982-04-15', gender: 'Female', bloodGroup: 'B+', aadhaar: '****-****-1234',
        phone: '9876001001', altPhone: '9876001011', officialEmail: 'kavitha@school.edu',
        personalEmail: 'kavitha.rao@gmail.com',
        street: '12, MG Road, Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038',
        employeeId: 'TCH2012001', designation: 'Professor', department: 'Computer Science',
        subject: 'Data Structures, Algorithms', employmentType: 'Full-time',
        experience: 12, joinDate: '2012-07-01', salary: 85000, status: 'Active',
        highestQual: 'Ph.D', specialization: 'Computer Science & AI',
        institution: 'IIT Bangalore', yearOfPassing: '2010', percentage: '9.2 CGPA',
        additionalDegree: 'M.Tech', additionalInstitution: 'NIT Trichy', additionalYear: '2006',
        teachingCert: 'None', certInstitution: '', certYear: '',
        publications: 14, linkedIn: 'linkedin.com/in/kavitha-rao', expertise: 'Artificial Intelligence, Machine Learning, Data Structures, Python Programming',
        emergencyName: 'Rajesh Rao', emergencyRelation: 'Spouse', emergencyPhone: '9876002001', emergencyEmail: 'rajesh.rao@gmail.com',
    },
    TCH002: {
        id: 'TCH002', prefix: 'Prof.', firstName: 'Arun', lastName: 'Mishra',
        dob: '1985-09-20', gender: 'Male', bloodGroup: 'O+', aadhaar: '****-****-5678',
        phone: '9876001002', altPhone: '', officialEmail: 'arun@school.edu', personalEmail: '',
        street: '45, Sector 12', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301',
        employeeId: 'TCH2016002', designation: 'Associate Professor', department: 'Mathematics',
        subject: 'Calculus, Algebra, Statistics', employmentType: 'Full-time',
        experience: 8, joinDate: '2016-06-15', salary: 65000, status: 'Active',
        highestQual: 'Ph.D', specialization: 'Pure Mathematics',
        institution: 'Delhi University', yearOfPassing: '2014', percentage: '8.8 CGPA',
        additionalDegree: 'M.Sc', additionalInstitution: 'BHU', additionalYear: '2008',
        teachingCert: 'B.Ed', certInstitution: 'IGNOU', certYear: '2009',
        publications: 6, linkedIn: '', expertise: 'Number Theory, Calculus, Linear Algebra',
        emergencyName: 'Sunita Mishra', emergencyRelation: 'Spouse', emergencyPhone: '9876002002', emergencyEmail: '',
    },
};

const FALLBACK = {
    id: '', prefix: 'Mr.', firstName: 'Unknown', lastName: 'Teacher',
    dob: '', gender: '', bloodGroup: '', aadhaar: '',
    phone: '', altPhone: '', officialEmail: '', personalEmail: '',
    street: '', city: '', state: '', pincode: '',
    employeeId: '', designation: '', department: '', subject: '',
    employmentType: '', experience: 0, joinDate: '', salary: 0, status: 'Active',
    highestQual: '', specialization: '', institution: '', yearOfPassing: '', percentage: '',
    additionalDegree: '', additionalInstitution: '', additionalYear: '',
    teachingCert: 'None', certInstitution: '', certYear: '',
    publications: 0, linkedIn: '', expertise: '',
    emergencyName: '', emergencyRelation: '', emergencyPhone: '', emergencyEmail: '',
};

const TAB_LIST = [
    { key: 'personal',  label: 'Personal Info',       icon: User },
    { key: 'professional', label: 'Professional',     icon: Briefcase },
    { key: 'qualification', label: 'Qualifications',  icon: GraduationCap },
    { key: 'contact',   label: 'Contact & Emergency', icon: Phone },
];

function InfoRow({ icon: Icon, label, value }) {
    if (!value) return null;
    return (
        <div className="tp-info-row">
            <div className="tp-info-icon"><Icon size={14} /></div>
            <div className="tp-info-label">{label}</div>
            <div className="tp-info-value">{value}</div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="tp-section">
            <div className="tp-section-title">{title}</div>
            {children}
        </div>
    );
}

export default function TeacherProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState('personal');

    const t = TEACHER_DATA[id] ?? { ...FALLBACK, id };
    const fullName = `${t.prefix} ${t.firstName} ${t.lastName}`.trim();
    const initials = (t.firstName[0] ?? '') + (t.lastName[0] ?? '');

    const fmt = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    const currency = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '—';

    return (
        <div className="erp-page">
            <Navbar title="Teacher Profile" subtitle="Full faculty details" />

            <div className="tp-wrap">
                <div style={{ marginBottom: 18 }}>
                    <button className="back-btn" onClick={() => navigate('/teachers')}>
                        <ArrowLeft size={15} /> Back to Teachers
                    </button>
                </div>

                {/* ── Profile Header ── */}
                <div className="tp-header card">
                    <div className="tp-header-left">
                        <div className="avatar tp-avatar" style={{ background: getAvatarColor(fullName) }}>
                            {initials || '?'}
                        </div>
                        <div className="tp-header-info">
                            <h2>{fullName}</h2>
                            <div className="tp-sub">{t.designation || 'Faculty'} &bull; {t.department}</div>
                            <div className="tp-badges">
                                <span className={`badge ${t.status === 'Active' ? 'badge-success' : t.status === 'On Leave' ? 'badge-warning' : 'badge-neutral'}`}>
                                    {t.status}
                                </span>
                                {t.employmentType && (
                                    <span className="tp-emp-badge">{t.employmentType}</span>
                                )}
                                {t.highestQual && (
                                    <span className="tp-qual-badge"><GraduationCap size={11} /> {t.highestQual}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="tp-header-right">
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/teachers')}>
                            <Edit2 size={13} /> Edit Profile
                        </button>
                    </div>
                </div>

                {/* ── Quick Stats ── */}
                <div className="tp-stats">
                    {[
                        { icon: Clock,    label: 'Experience',   value: t.experience ? `${t.experience} Years` : '—', color: '#1e40af' },
                        { icon: Calendar, label: 'Joined',        value: fmt(t.joinDate),                              color: '#059669' },
                        { icon: BookOpen, label: 'Publications',  value: t.publications ?? 0,                          color: '#7c3aed' },
                        { icon: Award,    label: 'Salary / Month', value: currency(t.salary),                          color: '#d97706' },
                    ].map(s => (
                        <div className="tp-stat-card" key={s.label} style={{ borderTop: `3px solid ${s.color}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                <s.icon size={16} style={{ color: s.color }} />
                                <span className="tp-stat-label">{s.label}</span>
                            </div>
                            <div className="tp-stat-value" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                {/* ── Tab Navigation ── */}
                <div className="tp-tabs card">
                    {TAB_LIST.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            className={`tp-tab ${tab === key ? 'tp-tab--active' : ''}`}
                            onClick={() => setTab(key)}
                        >
                            <Icon size={14} /> {label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <div className="card tp-content">

                    {tab === 'personal' && (
                        <>
                            <Section title="Personal Details">
                                <InfoRow icon={User}     label="Full Name"    value={fullName} />
                                <InfoRow icon={Calendar} label="Date of Birth" value={fmt(t.dob)} />
                                <InfoRow icon={User}     label="Gender"        value={t.gender} />
                                <InfoRow icon={Heart}    label="Blood Group"   value={t.bloodGroup} />
                                <InfoRow icon={FileText} label="Aadhaar"       value={t.aadhaar} />
                            </Section>
                            <Section title="Address">
                                {(t.street || t.city) ? (
                                    <div className="tp-address-block">
                                        <MapPin size={14} style={{ flexShrink: 0, color: 'var(--text-muted)' }} />
                                        <div>
                                            {t.street && <div>{t.street}</div>}
                                            {(t.city || t.state) && (
                                                <div>{[t.city, t.state].filter(Boolean).join(', ')}{t.pincode ? ` – ${t.pincode}` : ''}</div>
                                            )}
                                        </div>
                                    </div>
                                ) : <div className="tp-empty">No address on record</div>}
                            </Section>
                        </>
                    )}

                    {tab === 'professional' && (
                        <>
                            <Section title="Employment Details">
                                <InfoRow icon={FileText}  label="Employee ID"      value={t.employeeId} />
                                <InfoRow icon={Briefcase} label="Designation"      value={t.designation} />
                                <InfoRow icon={Building}  label="Department"       value={t.department} />
                                <InfoRow icon={BookOpen}  label="Subjects Taught"  value={t.subject} />
                                <InfoRow icon={Briefcase} label="Employment Type"  value={t.employmentType} />
                                <InfoRow icon={Clock}     label="Experience"       value={t.experience ? `${t.experience} Years` : undefined} />
                                <InfoRow icon={Calendar}  label="Joining Date"     value={fmt(t.joinDate)} />
                                <InfoRow icon={Award}     label="Monthly Salary"   value={currency(t.salary)} />
                            </Section>
                            {t.expertise && (
                                <Section title="Areas of Expertise">
                                    <div className="tp-expertise">
                                        {t.expertise.split(',').map(e => (
                                            <span key={e} className="tp-skill-tag">{e.trim()}</span>
                                        ))}
                                    </div>
                                </Section>
                            )}
                        </>
                    )}

                    {tab === 'qualification' && (
                        <>
                            <Section title="Highest Qualification">
                                <InfoRow icon={GraduationCap} label="Degree"          value={t.highestQual} />
                                <InfoRow icon={BookOpen}       label="Specialization"  value={t.specialization} />
                                <InfoRow icon={Building}       label="Institution"     value={t.institution} />
                                <InfoRow icon={Calendar}       label="Year of Passing" value={t.yearOfPassing} />
                                <InfoRow icon={Star}           label="Percentage/CGPA" value={t.percentage} />
                            </Section>

                            {t.additionalDegree && (
                                <Section title="Additional Degree">
                                    <InfoRow icon={GraduationCap} label="Degree"      value={t.additionalDegree} />
                                    <InfoRow icon={Building}       label="Institution" value={t.additionalInstitution} />
                                    <InfoRow icon={Calendar}       label="Year"        value={t.additionalYear} />
                                </Section>
                            )}

                            <Section title="Teaching Certification">
                                {t.teachingCert && t.teachingCert !== 'None' ? (
                                    <>
                                        <InfoRow icon={Award}    label="Certification"  value={t.teachingCert} />
                                        <InfoRow icon={Building} label="Institution"    value={t.certInstitution} />
                                        <InfoRow icon={Calendar} label="Year"           value={t.certYear} />
                                    </>
                                ) : (
                                    <div className="tp-empty">No teaching certification on record</div>
                                )}
                            </Section>

                            <Section title="Research">
                                <InfoRow icon={FileText} label="Publications"  value={t.publications ? `${t.publications} Papers/Books` : undefined} />
                                <InfoRow icon={Linkedin} label="LinkedIn"      value={t.linkedIn} />
                            </Section>
                        </>
                    )}

                    {tab === 'contact' && (
                        <>
                            <Section title="Contact Details">
                                <InfoRow icon={Phone} label="Primary Phone"   value={t.phone} />
                                <InfoRow icon={Phone} label="Alternate Phone" value={t.altPhone} />
                                <InfoRow icon={Mail}  label="Official Email"  value={t.officialEmail} />
                                <InfoRow icon={Mail}  label="Personal Email"  value={t.personalEmail} />
                            </Section>

                            <Section title="Emergency Contact">
                                {t.emergencyName ? (
                                    <>
                                        <InfoRow icon={User}  label="Name"     value={t.emergencyName} />
                                        <InfoRow icon={Heart} label="Relation" value={t.emergencyRelation} />
                                        <InfoRow icon={Phone} label="Phone"    value={t.emergencyPhone} />
                                        <InfoRow icon={Mail}  label="Email"    value={t.emergencyEmail} />
                                    </>
                                ) : (
                                    <div className="tp-empty">No emergency contact on record</div>
                                )}
                            </Section>
                        </>
                    )}
                </div>
            </div>

            <style>{`
        .tp-wrap { max-width: 860px; }

        /* Header */
        .tp-header { display:flex; align-items:flex-start; justify-content:space-between; gap:16px; padding:24px; margin-bottom:16px; flex-wrap:wrap; }
        .tp-header-left { display:flex; align-items:center; gap:18px; }
        .tp-avatar { width:72px; height:72px; font-size:1.5rem; font-weight:700; border-radius:50%; color:#fff; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
        .tp-header-info h2 { font-size:1.25rem; font-weight:700; color:var(--text-primary); margin-bottom:3px; }
        .tp-sub { font-size:0.82rem; color:var(--text-muted); margin-bottom:8px; }
        .tp-badges { display:flex; flex-wrap:wrap; gap:6px; }
        .tp-emp-badge { background:#f0fdf4; color:#059669; border:1px solid #bbf7d0; padding:2px 9px; border-radius:4px; font-size:0.72rem; font-weight:600; }
        .tp-qual-badge { background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; padding:2px 9px; border-radius:4px; font-size:0.72rem; font-weight:600; display:flex; align-items:center; gap:4px; }
        .tp-header-right { display:flex; gap:8px; align-items:flex-start; }

        /* Stats */
        .tp-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:16px; }
        .tp-stat-card { background:white; border:1px solid var(--border); border-radius:var(--radius-md); padding:14px 18px; box-shadow:var(--shadow-sm); }
        .tp-stat-label { font-size:0.72rem; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.05em; }
        .tp-stat-value { font-family:var(--font-display); font-size:1.05rem; font-weight:700; margin-top:2px; }

        /* Tabs */
        .tp-tabs { display:flex; gap:4px; padding:8px; margin-bottom:16px; background:white; }
        .tp-tab { display:flex; align-items:center; gap:7px; padding:8px 14px; border:none; background:transparent; border-radius:var(--radius-sm); cursor:pointer; font-size:0.82rem; font-weight:500; color:var(--text-muted); transition:var(--transition); white-space:nowrap; }
        .tp-tab:hover { background:var(--bg-hover); color:var(--text-secondary); }
        .tp-tab--active { background:#eff6ff; color:var(--primary); font-weight:600; }

        /* Content */
        .tp-content { padding:24px; }
        .tp-section { margin-bottom:28px; }
        .tp-section:last-child { margin-bottom:0; }
        .tp-section-title { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); padding-bottom:10px; border-bottom:1px solid var(--border); margin-bottom:14px; }

        /* Info rows */
        .tp-info-row { display:grid; grid-template-columns:20px 160px 1fr; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid var(--bg-hover); }
        .tp-info-row:last-child { border-bottom:none; }
        .tp-info-icon { color:var(--text-muted); display:flex; align-items:center; }
        .tp-info-label { font-size:0.8rem; color:var(--text-muted); font-weight:500; }
        .tp-info-value { font-size:0.85rem; color:var(--text-primary); font-weight:500; }

        /* Address block */
        .tp-address-block { display:flex; gap:10px; align-items:flex-start; font-size:0.85rem; color:var(--text-primary); line-height:1.6; padding:4px 0; }

        /* Expertise tags */
        .tp-expertise { display:flex; flex-wrap:wrap; gap:8px; padding:4px 0; }
        .tp-skill-tag { background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; padding:4px 12px; border-radius:20px; font-size:0.78rem; font-weight:500; }

        .tp-empty { font-size:0.83rem; color:var(--text-muted); font-style:italic; padding:8px 0; }

        /* Dark mode */
        [data-theme="dark"] .tp-stat-card { background:var(--bg-card) !important; border-color:var(--border) !important; }
        [data-theme="dark"] .tp-tabs { background:var(--bg-card) !important; border-color:var(--border) !important; }
        [data-theme="dark"] .tp-tab:hover { background:#1c2128 !important; }
        [data-theme="dark"] .tp-tab--active { background:rgba(59,130,246,0.12) !important; }
        [data-theme="dark"] .tp-emp-badge { background:rgba(5,150,105,0.12) !important; border-color:rgba(5,150,105,0.3) !important; }
        [data-theme="dark"] .tp-qual-badge { background:rgba(30,64,175,0.12) !important; border-color:rgba(30,64,175,0.3) !important; }
        [data-theme="dark"] .tp-skill-tag { background:rgba(30,64,175,0.12) !important; border-color:rgba(30,64,175,0.3) !important; }
        [data-theme="dark"] .tp-info-row { border-bottom-color:var(--border) !important; }

        @media(max-width:900px) {
          .tp-stats { grid-template-columns:repeat(2,1fr); }
          .tp-tabs { flex-wrap:wrap; }
          .tp-info-row { grid-template-columns:20px 130px 1fr; }
        }
        @media(max-width:600px) {
          .tp-header-left { flex-direction:column; align-items:flex-start; }
          .tp-stats { grid-template-columns:repeat(2,1fr); }
          .tp-info-row { grid-template-columns:1fr; gap:2px; }
          .tp-info-icon { display:none; }
        }
      `}</style>
        </div>
    );
}
