import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import {
    Mail, Phone, MapPin, FileText, User, Home,
    Heart, BookOpen, Award, Activity, Globe, Layers,
    Calendar, ShieldCheck, Star, Dumbbell, Music,
    ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* ── Blood-group colour map ── */
const BG_COLORS = {
    'A+': '#e53e3e', 'A-': '#c53030',
    'B+': '#dd6b20', 'B-': '#c05621',
    'O+': '#2b6cb0', 'O-': '#2c5282',
    'AB+': '#6b46c1', 'AB-': '#553c9a',
};

export default function StudentInformationCheck() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('personal');

    const studentData = {
        /* ── Identity ── */
        rollNumber:          'STU2024001',
        registrationNumber:  'REG/2022/00145',
        name:                user?.name  || 'Riya Kumar',
        email:               user?.email || 'riya.kumar@yourschool.edu',
        phone:               '98765 43210',
        course:              user?.course || 'B.Sc Computer Science',
        year:                user?.year   || '2nd Year',
        section:             user?.section || 'A',
        admissionDate:       '14 July 2022',
        dateOfBirth:         '15 August 2005',
        age:                 '20',
        gender:              'Female',
        bloodGroup:          'O+',
        nationality:         'Indian',
        religion:            'Hindu',
        category:            'General',
        caste:               'Not Provided',
        motherTongue:        'Hindi',
        aadharNumber:        '****-****-3456',
        panNumber:           'Not Available',

        /* ── Medical ── */
        medicalConditions:   'None',
        allergies:           'None',
        disabilities:        'None',
        vaccinations:        'Up to Date',

        /* ── Academics ── */
        rollNumber10th:      'MH2021050234',
        percentage10th:      '91.6 %',
        board10th:           'CBSE',
        rollNumber12th:      'MH2023060456',
        percentage12th:      '87.4 %',
        board12th:           'CBSE',
        cgpa:                '8.7 / 10',
        backlogs:            'None',

        /* ── Extracurricular ── */
        hobbies:             ['Reading', 'Photography', 'Sketching'],
        sports:              ['Badminton', 'Chess'],
        ncc:                 'No',
        nss:                 'Yes — 2023 Camp',
        achievements:        'State-level Science Olympiad Silver Medal (2023)',

        /* ── Contact ── */
        personalEmail:       'riya.kumar@yourschool.edu',
        personalPhone:       '98765 43210',
        emergencyContact:    '98765 43211',
        emergencyContactName:'Rajesh Kumar (Father)',

        /* ── Addresses ── */
        presentAddress: {
            street:     '123 Green Avenue, Apartment 4B',
            city:       'Mumbai',
            state:      'Maharashtra',
            postalCode: '400001',
            phone:      '98765 43210',
            fullAddress:'123 Green Avenue, Apartment 4B, Mumbai, Maharashtra 400001',
        },
        permanentAddress: {
            street:     '456 Oak Street, House No. 12',
            city:       'Pune',
            state:      'Maharashtra',
            postalCode: '411001',
            phone:      '02025 555666',
            fullAddress:'456 Oak Street, House No. 12, Pune, Maharashtra 411001',
        },

        /* ── Guardian ── */
        guardianName:        'Rajesh Kumar',
        guardianRelation:    'Father',
        guardianPhone:       '98765 43211',
        guardianEmail:       'rajesh.kumar@email.com',
        guardianOccupation:  'Software Engineer',
        motherName:          'Sunita Kumar',
        motherPhone:         '98765 43212',
        motherOccupation:    'Teacher',
        annualIncome:        '₹ 8,00,000',
    };

    const bgColor = BG_COLORS[studentData.bloodGroup] || '#2b6cb0';

    const TABS = [
        { key: 'personal',  label: 'Personal',     icon: User },
        { key: 'medical',   label: 'Medical',       icon: Heart },
        { key: 'academic',  label: 'Academics',     icon: BookOpen },
        { key: 'extra',     label: 'Extracurricular', icon: Star },
        { key: 'contact',   label: 'Contact',       icon: Phone },
        { key: 'present',   label: 'Present Addr',  icon: MapPin },
        { key: 'permanent', label: 'Permanent Addr',icon: Home },
        { key: 'guardian',  label: 'Guardian',      icon: ShieldCheck },
    ];

    /* ── Helpers ── */
    const Field = ({ label, value, highlight }) => (
        <div className="sic-field">
            <span className="sic-label">{label}</span>
            <span className={`sic-value${highlight ? ' sic-value--hl' : ''}`}>{value || 'Not Provided'}</span>
        </div>
    );

    const SectionTitle = ({ icon: Icon, text }) => (
        <div className="sic-sec-title">
            <span className="sic-sec-icon"><Icon size={15} /></span>
            {text}
        </div>
    );

    return (
        <div className="sic-page erp-page">

            {/* ── Page header ── */}
            <div className="sic-header">
                <button className="back-btn" onClick={() => navigate('/student-dashboard')}>
                    <ArrowLeft size={15} /> Back to Dashboard
                </button>
                <div className="sic-title-wrap">
                    <h1>Student Information</h1>
                    <p>Complete profile and academic record</p>
                </div>
            </div>

            {/* ── Hero / Quick cards ── */}
            <div className="sic-hero">
                {/* Avatar + name */}
                <div className="sic-profile-card">
                    <div className="sic-avatar">
                        {studentData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                        <p className="sic-profile-name">{studentData.name}</p>
                        <p className="sic-profile-sub">{studentData.course} · {studentData.year}</p>
                        <p className="sic-profile-sub" style={{ marginTop: 2 }}>
                            Section {studentData.section} · Admitted {studentData.admissionDate}
                        </p>
                    </div>
                    {/* Blood group badge */}
                    <div className="sic-blood" style={{ background: bgColor }}>
                        <Activity size={13} />
                        {studentData.bloodGroup}
                    </div>
                </div>

                {/* Quick info tiles */}
                <div className="sic-quick-grid">
                    {[
                        { icon: FileText, label: 'Roll No',       value: studentData.rollNumber,         color: '#1e40af' },
                        { icon: FileText, label: 'Reg No',        value: studentData.registrationNumber, color: '#0891b2' },
                        { icon: Award,    label: 'CGPA',          value: studentData.cgpa,               color: '#7c3aed' },
                        { icon: Globe,    label: 'Nationality',   value: studentData.nationality,        color: '#059669' },
                        { icon: Layers,   label: 'Category',      value: studentData.category,           color: '#d97706' },
                        { icon: Calendar, label: 'Date of Birth', value: studentData.dateOfBirth,        color: '#db2777' },
                    ].map(({ icon: Icon, label, value, color }) => (
                        <div key={label} className="sic-quick-card">
                            <div className="sic-quick-icon" style={{ background: color }}>
                                <Icon size={16} />
                            </div>
                            <div>
                                <p className="sic-qlabel">{label}</p>
                                <p className="sic-qvalue">{value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="sic-tabs">
                {TABS.map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        className={`sic-tab${activeTab === key ? ' sic-tab--active' : ''}`}
                        onClick={() => setActiveTab(key)}
                    >
                        <Icon size={15} /> {label}
                    </button>
                ))}
            </div>

            {/* ── Tab content ── */}
            <div className="sic-content" key={activeTab}>

                {/* PERSONAL */}
                {activeTab === 'personal' && (
                    <div className="sic-card">
                        <SectionTitle icon={User} text="Personal Details" />
                        <div className="sic-grid">
                            <Field label="Full Name"      value={studentData.name} />
                            <Field label="Date of Birth"  value={studentData.dateOfBirth} />
                            <Field label="Age"            value={`${studentData.age} years`} />
                            <Field label="Gender"         value={studentData.gender} />
                            <Field label="Blood Group"    value={studentData.bloodGroup} highlight />
                            <Field label="Nationality"    value={studentData.nationality} />
                            <Field label="Religion"       value={studentData.religion} />
                            <Field label="Category"       value={studentData.category} />
                            <Field label="Caste"          value={studentData.caste} />
                            <Field label="Mother Tongue"  value={studentData.motherTongue} />
                            <Field label="Aadhar Number"  value={studentData.aadharNumber} />
                            <Field label="PAN Number"     value={studentData.panNumber} />
                        </div>
                    </div>
                )}

                {/* MEDICAL */}
                {activeTab === 'medical' && (
                    <div className="sic-card">
                        <SectionTitle icon={Heart} text="Medical Information" />
                        <div className="sic-blood-banner" style={{ borderColor: bgColor }}>
                            <div className="sic-blood-big" style={{ background: bgColor }}>
                                <Activity size={24} />
                                <span>{studentData.bloodGroup}</span>
                            </div>
                            <div>
                                <p className="sic-blood-heading">Blood Group</p>
                                <p className="sic-blood-sub">Always carry your ID card for emergencies</p>
                            </div>
                        </div>
                        <div className="sic-grid" style={{ marginTop: 24 }}>
                            <Field label="Medical Conditions" value={studentData.medicalConditions} />
                            <Field label="Known Allergies"    value={studentData.allergies} />
                            <Field label="Disabilities"       value={studentData.disabilities} />
                            <Field label="Vaccinations"       value={studentData.vaccinations} />
                        </div>
                    </div>
                )}

                {/* ACADEMICS */}
                {activeTab === 'academic' && (
                    <div className="sic-card">
                        <SectionTitle icon={BookOpen} text="Academic Record" />

                        <p className="sic-sub-head">Current Enrollment</p>
                        <div className="sic-grid">
                            <Field label="Course"           value={studentData.course} />
                            <Field label="Year of Study"    value={studentData.year} />
                            <Field label="Section"          value={studentData.section} />
                            <Field label="CGPA"             value={studentData.cgpa} highlight />
                            <Field label="Active Backlogs"  value={studentData.backlogs} />
                            <Field label="Admission Date"   value={studentData.admissionDate} />
                        </div>

                        <div className="sic-divider" />

                        <p className="sic-sub-head">Class 10th</p>
                        <div className="sic-grid">
                            <Field label="Board"        value={studentData.board10th} />
                            <Field label="Roll Number"  value={studentData.rollNumber10th} />
                            <Field label="Percentage"   value={studentData.percentage10th} highlight />
                        </div>

                        <div className="sic-divider" />

                        <p className="sic-sub-head">Class 12th</p>
                        <div className="sic-grid">
                            <Field label="Board"        value={studentData.board12th} />
                            <Field label="Roll Number"  value={studentData.rollNumber12th} />
                            <Field label="Percentage"   value={studentData.percentage12th} highlight />
                        </div>
                    </div>
                )}

                {/* EXTRACURRICULAR */}
                {activeTab === 'extra' && (
                    <div className="sic-card">
                        <SectionTitle icon={Star} text="Extracurricular Activities" />
                        <div className="sic-grid">
                            <div className="sic-field">
                                <span className="sic-label">Hobbies</span>
                                <div className="sic-tag-row">
                                    {studentData.hobbies.map(h => (
                                        <span key={h} className="sic-tag sic-tag--blue">
                                            <Music size={11} /> {h}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="sic-field">
                                <span className="sic-label">Sports</span>
                                <div className="sic-tag-row">
                                    {studentData.sports.map(s => (
                                        <span key={s} className="sic-tag sic-tag--green">
                                            <Dumbbell size={11} /> {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <Field label="NCC"          value={studentData.ncc} />
                            <Field label="NSS"          value={studentData.nss} />
                            <Field label="Achievements" value={studentData.achievements} highlight />
                        </div>
                    </div>
                )}

                {/* CONTACT */}
                {activeTab === 'contact' && (
                    <div className="sic-card">
                        <SectionTitle icon={Phone} text="Contact Information" />
                        <div className="sic-contact-list">
                            {[
                                { icon: Mail,  label: 'Email Address',    value: studentData.personalEmail },
                                { icon: Phone, label: 'Phone Number',     value: studentData.personalPhone },
                                { icon: Phone, label: 'Emergency Contact', value: `${studentData.emergencyContactName} — ${studentData.emergencyContact}` },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="sic-contact-item">
                                    <div className="sic-contact-icon"><Icon size={18} /></div>
                                    <div>
                                        <p className="sic-label">{label}</p>
                                        <p className="sic-cvalue">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* PRESENT ADDRESS */}
                {activeTab === 'present' && (
                    <div className="sic-card">
                        <SectionTitle icon={MapPin} text="Present / Residential Address" />
                        <div className="sic-address-banner">
                            <div className="sic-addr-icon" style={{ background: '#1e40af' }}>
                                <MapPin size={28} />
                            </div>
                            <p className="sic-full-addr">{studentData.presentAddress.fullAddress}</p>
                        </div>
                        <div className="sic-grid" style={{ marginTop: 20 }}>
                            <Field label="Street"      value={studentData.presentAddress.street} />
                            <Field label="City"        value={studentData.presentAddress.city} />
                            <Field label="State"       value={studentData.presentAddress.state} />
                            <Field label="Postal Code" value={studentData.presentAddress.postalCode} />
                            <Field label="Phone"       value={studentData.presentAddress.phone} />
                        </div>
                    </div>
                )}

                {/* PERMANENT ADDRESS */}
                {activeTab === 'permanent' && (
                    <div className="sic-card">
                        <SectionTitle icon={Home} text="Permanent / Home Address" />
                        <div className="sic-address-banner">
                            <div className="sic-addr-icon" style={{ background: '#059669' }}>
                                <Home size={28} />
                            </div>
                            <p className="sic-full-addr">{studentData.permanentAddress.fullAddress}</p>
                        </div>
                        <div className="sic-grid" style={{ marginTop: 20 }}>
                            <Field label="Street"      value={studentData.permanentAddress.street} />
                            <Field label="City"        value={studentData.permanentAddress.city} />
                            <Field label="State"       value={studentData.permanentAddress.state} />
                            <Field label="Postal Code" value={studentData.permanentAddress.postalCode} />
                            <Field label="Phone"       value={studentData.permanentAddress.phone} />
                        </div>
                    </div>
                )}

                {/* GUARDIAN */}
                {activeTab === 'guardian' && (
                    <div className="sic-card">
                        <SectionTitle icon={ShieldCheck} text="Guardian / Parent Details" />

                        <p className="sic-sub-head">Father / Guardian</p>
                        <div className="sic-grid">
                            <Field label="Name"         value={studentData.guardianName} />
                            <Field label="Relation"     value={studentData.guardianRelation} />
                            <Field label="Phone"        value={studentData.guardianPhone} />
                            <Field label="Email"        value={studentData.guardianEmail} />
                            <Field label="Occupation"   value={studentData.guardianOccupation} />
                            <Field label="Annual Income" value={studentData.annualIncome} />
                        </div>

                        <div className="sic-divider" />

                        <p className="sic-sub-head">Mother</p>
                        <div className="sic-grid">
                            <Field label="Name"       value={studentData.motherName} />
                            <Field label="Phone"      value={studentData.motherPhone} />
                            <Field label="Occupation" value={studentData.motherOccupation} />
                        </div>
                    </div>
                )}
            </div>

            {/* ── Styles ── */}
            <style>{`
                /* Layout fix — sidebar + navbar offset via erp-page class */
                .sic-page { padding-bottom: 40px; }

                /* ── Header ── */
                .sic-header {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    margin-bottom: 24px;
                }
                .sic-title-wrap h1 {
                    font-size: 1.6rem;
                    font-weight: 800;
                    margin-bottom: 2px;
                }
                .sic-title-wrap p { color: var(--text-muted); font-size: 0.88rem; }

                /* ── Hero ── */
                .sic-hero {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    gap: 20px;
                    margin-bottom: 22px;
                    align-items: start;
                }
                .sic-profile-card {
                    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    border-radius: 16px;
                    padding: 24px 28px;
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    position: relative;
                    min-width: 360px;
                    box-shadow: 0 8px 32px rgba(15,23,42,0.18);
                }
                .sic-avatar {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    display: grid;
                    place-items: center;
                    font-family: var(--font-display);
                    font-size: 1.4rem;
                    font-weight: 800;
                    flex-shrink: 0;
                    box-shadow: 0 0 0 3px rgba(30,64,175,0.5);
                }
                .sic-profile-name {
                    font-family: var(--font-display);
                    font-size: 1.15rem;
                    font-weight: 800;
                    color: white;
                }
                .sic-profile-sub {
                    font-size: 0.78rem;
                    color: rgba(255,255,255,0.5);
                    margin-top: 3px;
                }
                .sic-blood {
                    position: absolute;
                    top: 14px;
                    right: 16px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 12px;
                    border-radius: 99px;
                    color: white;
                    font-size: 0.8rem;
                    font-weight: 800;
                    letter-spacing: 0.04em;
                    font-family: var(--font-display);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                }

                /* ── Quick grid ── */
                .sic-quick-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                }
                .sic-quick-card {
                    background: white;
                    border: 1.5px solid var(--border);
                    border-radius: 12px;
                    padding: 14px 16px;
                    display: flex;
                    gap: 14px;
                    align-items: center;
                    box-shadow: var(--shadow-xs);
                    transition: all 0.2s ease;
                }
                .sic-quick-card:hover {
                    box-shadow: var(--shadow-md);
                    transform: translateY(-2px);
                    border-color: var(--border-dark);
                }
                .sic-quick-icon {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    display: grid;
                    place-items: center;
                    color: white;
                    flex-shrink: 0;
                }
                .sic-qlabel {
                    font-size: 0.72rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--text-muted);
                    margin-bottom: 2px;
                }
                .sic-qvalue {
                    font-size: 0.93rem;
                    font-weight: 700;
                    color: var(--text-primary);
                }

                /* ── Tabs ── */
                .sic-tabs {
                    display: flex;
                    gap: 6px;
                    background: white;
                    border: 1.5px solid var(--border);
                    border-radius: 12px;
                    padding: 8px;
                    margin-bottom: 20px;
                    overflow-x: auto;
                    flex-wrap: nowrap;
                    box-shadow: var(--shadow-xs);
                }
                .sic-tab {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 9px 16px;
                    border: none;
                    background: transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.83rem;
                    color: var(--text-muted);
                    white-space: nowrap;
                    transition: all 0.18s ease;
                    font-family: var(--font-body);
                }
                .sic-tab:hover { background: var(--bg); color: var(--primary); }
                .sic-tab--active {
                    background: var(--primary);
                    color: white;
                    box-shadow: 0 2px 10px rgba(30,64,175,0.25);
                }

                /* ── Card ── */
                .sic-card {
                    background: white;
                    border: 1.5px solid var(--border);
                    border-radius: 16px;
                    padding: 28px 32px 32px;
                    box-shadow: var(--shadow-sm);
                    animation: sicFadeIn 0.25s ease;
                }
                @keyframes sicFadeIn {
                    from { opacity:0; transform: translateY(8px); }
                    to   { opacity:1; transform: none; }
                }

                /* ── Section title ── */
                .sic-sec-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: var(--font-display);
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: var(--text-primary);
                    margin-bottom: 22px;
                    padding-bottom: 14px;
                    border-bottom: 2px solid var(--border);
                }
                .sic-sec-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 8px;
                    background: rgba(30,64,175,0.1);
                    color: var(--primary);
                    display: grid;
                    place-items: center;
                    flex-shrink: 0;
                }

                /* ── Field grid ── */
                .sic-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 20px 28px;
                }
                .sic-field { display: flex; flex-direction: column; gap: 5px; }
                .sic-label {
                    font-size: 0.72rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: var(--text-muted);
                }
                .sic-value {
                    font-size: 0.97rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .sic-value--hl {
                    color: var(--primary);
                    background: rgba(30,64,175,0.07);
                    padding: 3px 10px;
                    border-radius: 6px;
                    display: inline-block;
                }

                /* ── Divider & sub-head ── */
                .sic-divider { height: 1.5px; background: var(--border); margin: 24px 0; }
                .sic-sub-head {
                    font-family: var(--font-display);
                    font-size: 0.82rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: var(--text-muted);
                    margin-bottom: 16px;
                }

                /* ── Blood banner ── */
                .sic-blood-banner {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 20px 24px;
                    border-radius: 12px;
                    border: 2px solid;
                    background: rgba(0,0,0,0.02);
                }
                .sic-blood-big {
                    width: 80px;
                    height: 80px;
                    border-radius: 16px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    color: white;
                    font-family: var(--font-display);
                    font-size: 1.4rem;
                    font-weight: 900;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.2);
                    flex-shrink: 0;
                }
                .sic-blood-heading {
                    font-family: var(--font-display);
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: var(--text-primary);
                    margin-bottom: 4px;
                }
                .sic-blood-sub { color: var(--text-muted); font-size: 0.85rem; }

                /* ── Tags ── */
                .sic-tag-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 2px; }
                .sic-tag {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 4px 12px;
                    border-radius: 99px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .sic-tag--blue { background: #dbeafe; color: #1e40af; }
                .sic-tag--green { background: #d1fae5; color: #065f46; }

                /* ── Contact ── */
                .sic-contact-list { display: flex; flex-direction: column; gap: 14px; }
                .sic-contact-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 16px;
                    background: var(--bg);
                    border-radius: 10px;
                    border: 1px solid var(--border);
                }
                .sic-contact-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    background: rgba(30,64,175,0.1);
                    color: var(--primary);
                    display: grid;
                    place-items: center;
                    flex-shrink: 0;
                }
                .sic-cvalue {
                    font-size: 0.97rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-top: 3px;
                }

                /* ── Address ── */
                .sic-address-banner {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    padding: 20px;
                    background: var(--bg);
                    border-radius: 12px;
                    border: 1.5px solid var(--border);
                }
                .sic-addr-icon {
                    width: 70px;
                    height: 70px;
                    border-radius: 14px;
                    display: grid;
                    place-items: center;
                    color: white;
                    flex-shrink: 0;
                    box-shadow: 0 4px 14px rgba(0,0,0,0.18);
                }
                .sic-full-addr {
                    font-size: 0.97rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    line-height: 1.6;
                }

                /* ── Responsive ── */
                @media (max-width: 1100px) {
                    .sic-hero { grid-template-columns: 1fr; }
                    .sic-profile-card { min-width: unset; }
                    .sic-quick-grid { grid-template-columns: repeat(3, 1fr); }
                }
                @media (max-width: 760px) {
                    .sic-quick-grid { grid-template-columns: repeat(2, 1fr); }
                    .sic-grid { grid-template-columns: 1fr 1fr; }
                    .sic-card { padding: 20px; }
                }
                @media (max-width: 480px) {
                    .sic-quick-grid { grid-template-columns: 1fr 1fr; }
                    .sic-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
