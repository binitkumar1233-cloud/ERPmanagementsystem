import { useState } from 'react';
import Navbar from '../../components/layout/Navbar.jsx';
import {
    ClipboardList, FileText, Star, Calendar,
    Search, Plus, Download, Edit2, Trash2, Eye,
    BarChart2, Printer, AlertCircle, TrendingUp,
    GraduationCap, X, ShieldCheck, Lock, CheckCircle2,
    FlaskConical, MessageSquare, BookOpen, Clock,
} from 'lucide-react';

/* ── Mock Data ── */
const ASSESSMENTS = [
    { id: 'IA001', course: 'B.Sc Computer Science', subject: 'Data Structures', dept: 'Computer Science', type: 'Internal Assessment 1', maxMarks: 20, weightage: 20, syllabus: 'Units 1–2', date: '2026-04-10', studentsAppeared: 34, avgScore: 15.2, passRate: 91, status: 'Completed' },
    { id: 'IA002', course: 'B.Sc Computer Science', subject: 'Algorithms', dept: 'Computer Science', type: 'Internal Assessment 2', maxMarks: 20, weightage: 20, syllabus: 'Units 3–4', date: '2026-05-15', studentsAppeared: 38, avgScore: 14.8, passRate: 87, status: 'Completed' },
    { id: 'IA003', course: 'B.Tech ECE', subject: 'Digital Circuits', dept: 'Electronics', type: 'Internal Assessment 1', maxMarks: 25, weightage: 25, syllabus: 'Units 1–3', date: '2026-06-12', studentsAppeared: 0, avgScore: 0, passRate: 0, status: 'Scheduled' },
    { id: 'IA004', course: 'B.Com Honours', subject: 'Financial Accounting', dept: 'Commerce', type: 'Assignment-Based Assessment', maxMarks: 30, weightage: 30, syllabus: 'All Units', date: '2026-05-28', studentsAppeared: 36, avgScore: 22.4, passRate: 94, status: 'Completed' },
    { id: 'IA005', course: 'M.Sc Mathematics', subject: 'Real Analysis', dept: 'Mathematics', type: 'Mid-Semester Test', maxMarks: 50, weightage: 40, syllabus: 'Units 1–2', date: '2026-06-20', studentsAppeared: 0, avgScore: 0, passRate: 0, status: 'Upcoming' },
];

const REPORT_CARDS = [
    { id: 'RC001', rollNo: 'CS2024001', name: 'Priya Sharma',  course: 'B.Sc CSE',     year: 2, semester: 3, sgpa: 8.7, cgpa: 8.4, credits: 22, status: 'Published', grade: 'A'  },
    { id: 'RC002', rollNo: 'CS2024002', name: 'Rohan Das',     course: 'B.Sc CSE',     year: 2, semester: 3, sgpa: 7.2, cgpa: 7.5, credits: 22, status: 'Published', grade: 'B+' },
    { id: 'RC003', rollNo: 'CS2024003', name: 'Ananya Patel',  course: 'B.Sc CSE',     year: 2, semester: 3, sgpa: 9.1, cgpa: 8.9, credits: 22, status: 'Draft',     grade: 'O'  },
    { id: 'RC004', rollNo: 'EC2024001', name: 'Suresh Kumar',  course: 'B.Tech ECE',   year: 1, semester: 2, sgpa: 6.4, cgpa: 6.8, credits: 20, status: 'Published', grade: 'B'  },
    { id: 'RC005', rollNo: 'CO2024001', name: 'Meena Nayak',   course: 'B.Com Hons',   year: 1, semester: 2, sgpa: 8.2, cgpa: 8.0, credits: 20, status: 'Published', grade: 'A'  },
    { id: 'RC006', rollNo: 'MA2024001', name: 'Deepa Singh',   course: 'M.Sc Maths',   year: 1, semester: 1, sgpa: 9.4, cgpa: 9.4, credits: 18, status: 'Draft',     grade: 'O'  },
];

const CREDIT_COURSES = [
    { id: 'CC001', course: 'B.Sc Computer Science', subject: 'Data Structures',    code: 'CS301',  credits: 4, type: 'Core',     ia: 40, se: 60, minPass: 40 },
    { id: 'CC002', course: 'B.Sc Computer Science', subject: 'Algorithms',          code: 'CS302',  credits: 4, type: 'Core',     ia: 40, se: 60, minPass: 40 },
    { id: 'CC003', course: 'B.Sc Computer Science', subject: 'Operating Systems',   code: 'CS303',  credits: 3, type: 'Core',     ia: 30, se: 70, minPass: 40 },
    { id: 'CC004', course: 'B.Sc Computer Science', subject: 'Elective: AI',        code: 'CS3E1',  credits: 3, type: 'Elective', ia: 50, se: 50, minPass: 40 },
    { id: 'CC005', course: 'B.Tech ECE',             subject: 'Digital Circuits',   code: 'EC201',  credits: 4, type: 'Core',     ia: 30, se: 70, minPass: 40 },
    { id: 'CC006', course: 'B.Com Honours',          subject: 'Financial Accounting',code: 'CO201', credits: 4, type: 'Core',     ia: 40, se: 60, minPass: 40 },
];

const INIT_EXAM_SCHEDULE = [
    { id: 'EX001', title: 'End Semester Examination — B.Sc CSE Sem 3', course: 'B.Sc CSE',   dept: 'Computer Science', startDate: '2026-11-01', endDate: '2026-11-15', type: 'End Semester', rooms: '101, 102', invigilator: 'Dr. Kavitha Rao',  status: 'Scheduled', subject: 'All Subjects',   time: '09:00', duration: '3 hrs' },
    { id: 'EX002', title: 'Internal Assessment 2 — B.Tech ECE',        course: 'B.Tech ECE', dept: 'Electronics',      startDate: '2026-10-10', endDate: '2026-10-12', type: 'Internal',    rooms: '203',       invigilator: 'Mr. Rajan Pillai', status: 'Scheduled', subject: 'Digital Circuits', time: '10:00', duration: '2 hrs' },
    { id: 'EX003', title: 'Mid-Semester Test — M.Sc Mathematics',       course: 'M.Sc Maths', dept: 'Mathematics',     startDate: '2026-06-20', endDate: '2026-06-22', type: 'Mid-Semester',rooms: '301',       invigilator: 'Prof. Arun Mishra',status: 'Upcoming',  subject: 'Real Analysis',   time: '09:30', duration: '2 hrs' },
    { id: 'EX004', title: 'End Semester — B.Com Honours Sem 2',         course: 'B.Com Hons', dept: 'Commerce',         startDate: '2026-05-05', endDate: '2026-05-18', type: 'End Semester',rooms: '102, 104',  invigilator: 'Mr. Deepak Sharma',status: 'Completed', subject: 'All Subjects',   time: '09:00', duration: '3 hrs' },
];

/* ── Teacher credentials — synced with Teachers.jsx mock data ── */
const TEACHER_CREDENTIALS = {
    'TCH001': { password: 'pass001', name: 'Dr. Kavitha Rao',   dept: 'Computer Science'   },
    'TCH002': { password: 'pass002', name: 'Prof. Arun Mishra', dept: 'Mathematics'         },
    'TCH003': { password: 'pass003', name: 'Mrs. Sunita Devi',  dept: 'English'             },
    'TCH004': { password: 'pass004', name: 'Mr. Rajan Pillai',  dept: 'Electronics'         },
    'TCH005': { password: 'pass005', name: 'Dr. Priti Saxena',  dept: 'Chemistry'           },
    'TCH006': { password: 'pass006', name: 'Mr. Deepak Sharma', dept: 'Commerce'            },
    'TCH007': { password: 'pass007', name: 'Mrs. Lata Nayak',   dept: 'History'             },
    'TCH008': { password: 'pass008', name: 'Ms. Meera Iyer',    dept: 'Biology'             },
    'TCH009': { password: 'pass009', name: 'Mr. Rohit Verma',   dept: 'Physical Education'  },
    'TCH010': { password: 'pass010', name: 'Dr. Neha Joshi',    dept: 'Psychology'          },
};

const EXAM_TYPE_OPTIONS = [
    { value: 'Internal',  label: 'Internal Exam',  icon: BookOpen,      color: '#1e40af', bg: '#dbeafe', desc: 'Written internal test' },
    { value: 'Practical', label: 'Practical Exam', icon: FlaskConical,  color: '#059669', bg: '#d1fae5', desc: 'Lab / hands-on exam'   },
    { value: 'Viva',      label: 'Viva Exam',      icon: MessageSquare, color: '#7c3aed', bg: '#ede9fe', desc: 'Oral examination'       },
];

const EMPTY_SFORM = {
    examTitle: '', subject: '', course: '', department: '',
    examType: 'Internal', startDate: '', endDate: '', startTime: '', duration: '', room: '',
};

const EMPTY_CFORM = {
    subject: '', course: '', code: '', type: 'Core', credits: 3, ia: 40, minPass: 40,
};

const EMPTY_IAFORM = {
    course: '', subject: '', dept: '', type: 'Internal Assessment 1',
    maxMarks: 20, weightage: 20, syllabus: '', date: '', status: 'Scheduled',
};

const ASSESSMENT_TYPES = [
    'Internal Assessment 1', 'Internal Assessment 2', 'Internal Assessment 3',
    'Mid-Semester Test', 'Assignment-Based Assessment', 'Quiz / Class Test', 'Practical Record',
];

const DEPARTMENTS = [
    'Computer Science', 'Electronics', 'Mathematics', 'Commerce',
    'Physics', 'Chemistry', 'English', 'Management', 'Biology', 'Economics',
];

const PROGRAMMES = [
    'B.Sc Computer Science', 'B.Sc CSE', 'B.Tech ECE', 'B.Com Honours', 'B.Com Hons',
    'M.Sc Mathematics', 'M.Sc Maths', 'B.A English', 'M.Tech CSE', 'MBA', 'BCA', 'MCA',
];

const EMPTY_RCFORM = {
    name: '', rollNo: '', course: '', year: 1, semester: 1,
    credits: 20, sgpa: '', cgpa: '', status: 'Draft',
};

/* Auto-calculate letter grade from SGPA */
const sgpaToGrade = sgpa => {
    const s = parseFloat(sgpa);
    if (isNaN(s)) return '—';
    if (s >= 9.0) return 'O';
    if (s >= 8.5) return 'A+';
    if (s >= 7.5) return 'A';
    if (s >= 6.5) return 'B+';
    if (s >= 5.5) return 'B';
    if (s >= 4.5) return 'C';
    return 'F';
};

const TABS = [
    { key: 'assessments', label: 'Internal Assessments', icon: ClipboardList, color: '#1e40af' },
    { key: 'reportcards', label: 'Report Cards',         icon: FileText,      color: '#059669' },
    { key: 'credits',     label: 'Credit System',        icon: Star,          color: '#7c3aed' },
    { key: 'schedule',    label: 'Exam Schedule',        icon: Calendar,      color: '#d97706' },
];

const statusBadge = s => ({
    Completed: 'badge-success', Scheduled: 'badge-info',
    Upcoming: 'badge-warning',  Published: 'badge-success', Draft: 'badge-neutral',
}[s] || 'badge-neutral');

const gradeColor = g => ({ O: '#059669', 'A+': '#1e40af', A: '#1e40af', 'B+': '#7c3aed', B: '#7c3aed', C: '#d97706', F: '#dc2626' }[g] || '#475569');
const gradeBg    = g => ({ O: '#d1fae5', 'A+': '#dbeafe', A: '#dbeafe', 'B+': '#ede9fe', B: '#ede9fe', C: '#fef3c7', F: '#fef2f2' }[g] || '#f1f5f9');

const TYPE_COLOR = { Core: '#1e40af', Elective: '#7c3aed' };
const TYPE_BG    = { Core: '#dbeafe', Elective: '#ede9fe' };
const EXAM_TYPE_COLOR = { 'End Semester': '#1e40af', Internal: '#1e40af', 'Mid-Semester': '#d97706', Practical: '#059669', Viva: '#7c3aed' };
const EXAM_TYPE_BG    = { 'End Semester': '#dbeafe', Internal: '#dbeafe', 'Mid-Semester': '#fef3c7', Practical: '#d1fae5', Viva: '#ede9fe' };

/* ── Field helper ── */
const Field = ({ label, error, children }) => (
    <div className="sf-field">
        <label className="sf-label">{label}</label>
        {children}
        {error && <span className="sf-error">{error}</span>}
    </div>
);

export default function ExamManagement() {
    const [tab, setTab]   = useState('assessments');
    const [q, setQ]       = useState('');

    /* Schedule exam flow */
    const [scheduleStep, setScheduleStep]         = useState(null); // null | 'verify' | 'form'
    const [verifyForm, setVerifyForm]             = useState({ regNo: '', password: '', error: '' });
    const [verifiedTeacher, setVerifiedTeacher]   = useState(null);
    const [sForm, setSForm]                       = useState(EMPTY_SFORM);
    const [sErrors, setSErrors]                   = useState({});
    const [showPass, setShowPass]                 = useState(false);
    const [examList, setExamList]                 = useState(INIT_EXAM_SCHEDULE);

    /* New Assessment flow */
    const [iaStep, setIaStep]                         = useState(null); // null | 'verify' | 'form'
    const [iaVerify, setIaVerify]                     = useState({ regNo: '', password: '', error: '' });
    const [iaVerifiedTeacher, setIaVerifiedTeacher]   = useState(null);
    const [iaShowPass, setIaShowPass]                 = useState(false);
    const [iaForm, setIaForm]                         = useState(EMPTY_IAFORM);
    const [iaErrors, setIaErrors]                     = useState({});
    const [assessmentList, setAssessmentList]         = useState(ASSESSMENTS);

    /* Add Course flow */
    const [courseModal, setCourseModal]           = useState(false);
    const [cForm, setCForm]                       = useState(EMPTY_CFORM);
    const [cErrors, setCErrors]                   = useState({});
    const [creditList, setCreditList]             = useState(CREDIT_COURSES);

    /* Generate Report Card flow */
    const [rcStep, setRcStep]                     = useState(null); // null | 'verify' | 'form'
    const [rcVerify, setRcVerify]                 = useState({ regNo: '', password: '', error: '' });
    const [rcVerifiedTeacher, setRcVerifiedTeacher] = useState(null);
    const [rcShowPass, setRcShowPass]             = useState(false);
    const [rcForm, setRcForm]                     = useState(EMPTY_RCFORM);
    const [rcErrors, setRcErrors]                 = useState({});
    const [reportList, setReportList]             = useState(REPORT_CARDS);

    const filt = (arr, keys) =>
        arr.filter(r => !q || keys.some(k => String(r[k]).toLowerCase().includes(q.toLowerCase())));

    const totalIA       = assessmentList.length;
    const completedIA   = assessmentList.filter(a => a.status === 'Completed').length;
    const publishedRC   = reportList.filter(r => r.status === 'Published').length;
    const avgCGPA       = reportList.length
        ? (reportList.reduce((s, r) => s + r.cgpa, 0) / reportList.length).toFixed(1)
        : '0.0';

    /* ── Verify teacher for assessment ── */
    const handleIaVerify = () => {
        const key = iaVerify.regNo.trim().toUpperCase();
        const teacher = TEACHER_CREDENTIALS[key];
        if (!teacher || teacher.password !== iaVerify.password) {
            setIaVerify(f => ({ ...f, error: 'Invalid registration number or password. Please try again.' }));
            return;
        }
        setIaVerifiedTeacher({ ...teacher, regNo: key });
        setIaStep('form');
        setIaVerify({ regNo: '', password: '', error: '' });
        setIaShowPass(false);
    };

    /* ── Add Assessment submit ── */
    const handleAddAssessment = () => {
        const errs = {};
        if (!iaForm.subject.trim()) errs.subject = 'Subject is required';
        if (!iaForm.course.trim())  errs.course  = 'Course is required';
        if (!iaForm.dept.trim())    errs.dept    = 'Department is required';
        if (!iaForm.date)           errs.date    = 'Date is required';
        if (!iaForm.maxMarks || Number(iaForm.maxMarks) <= 0) errs.maxMarks = 'Enter valid max marks';
        if (Object.keys(errs).length) { setIaErrors(errs); return; }

        const newIA = {
            id:              `IA${String(assessmentList.length + 1).padStart(3, '0')}`,
            course:          iaForm.course.trim(),
            subject:         iaForm.subject.trim(),
            dept:            iaForm.dept,
            type:            iaForm.type,
            maxMarks:        Number(iaForm.maxMarks),
            weightage:       Number(iaForm.weightage),
            syllabus:        iaForm.syllabus.trim() || '—',
            date:            iaForm.date,
            studentsAppeared: 0,
            avgScore:        0,
            passRate:        0,
            status:          iaForm.status,
        };
        setAssessmentList(prev => [newIA, ...prev]);
        closeIaModal();
    };

    const closeIaModal = () => {
        setIaStep(null);
        setIaVerifiedTeacher(null);
        setIaVerify({ regNo: '', password: '', error: '' });
        setIaShowPass(false);
        setIaForm(EMPTY_IAFORM);
        setIaErrors({});
    };

    /* ── Verify teacher ── */
    const handleVerify = () => {
        const key = verifyForm.regNo.trim().toUpperCase();
        const teacher = TEACHER_CREDENTIALS[key];
        if (!teacher || teacher.password !== verifyForm.password) {
            setVerifyForm(f => ({ ...f, error: 'Invalid registration number or password. Please try again.' }));
            return;
        }
        setVerifiedTeacher({ ...teacher, regNo: key });
        setSForm({ ...EMPTY_SFORM, department: teacher.dept });
        setScheduleStep('form');
        setVerifyForm({ regNo: '', password: '', error: '' });
        setShowPass(false);
    };

    /* ── Submit new exam ── */
    const handleScheduleSubmit = () => {
        const errs = {};
        if (!sForm.examTitle.trim()) errs.examTitle = 'Exam title is required';
        if (!sForm.course.trim())    errs.course    = 'Course name is required';
        if (!sForm.startDate)        errs.startDate = 'Start date is required';
        if (!sForm.endDate)          errs.endDate   = 'End date is required';
        if (!sForm.room.trim())      errs.room      = 'Room / venue is required';
        if (Object.keys(errs).length) { setSErrors(errs); return; }

        const newExam = {
            id:          `EX${String(examList.length + 1).padStart(3, '0')}`,
            title:       sForm.examTitle,
            course:      sForm.course,
            dept:        sForm.department || verifiedTeacher.dept,
            startDate:   sForm.startDate,
            endDate:     sForm.endDate,
            type:        sForm.examType,
            rooms:       sForm.room,
            invigilator: verifiedTeacher.name,
            status:      'Scheduled',
            subject:     sForm.subject,
            time:        sForm.startTime,
            duration:    sForm.duration,
        };
        setExamList(prev => [newExam, ...prev]);
        closeModal();
    };

    const closeModal = () => {
        setScheduleStep(null);
        setVerifiedTeacher(null);
        setSForm(EMPTY_SFORM);
        setSErrors({});
        setVerifyForm({ regNo: '', password: '', error: '' });
        setShowPass(false);
    };

    /* ── Add Course submit ── */
    const handleAddCourse = () => {
        const errs = {};
        if (!cForm.subject.trim()) errs.subject = 'Subject name is required';
        if (!cForm.course.trim())  errs.course  = 'Programme / course is required';
        if (!cForm.code.trim())    errs.code    = 'Subject code is required';
        if (creditList.some(c => c.code.toLowerCase() === cForm.code.trim().toLowerCase()))
            errs.code = 'Subject code already exists';
        if (Object.keys(errs).length) { setCErrors(errs); return; }

        const se = 100 - Number(cForm.ia);
        const newCourse = {
            id:      `CC${String(creditList.length + 1).padStart(3, '0')}`,
            course:  cForm.course.trim(),
            subject: cForm.subject.trim(),
            code:    cForm.code.trim().toUpperCase(),
            credits: Number(cForm.credits),
            type:    cForm.type,
            ia:      Number(cForm.ia),
            se,
            minPass: Number(cForm.minPass),
        };
        setCreditList(prev => [...prev, newCourse]);
        setCourseModal(false);
        setCForm(EMPTY_CFORM);
        setCErrors({});
    };

    const closeCourseModal = () => {
        setCourseModal(false);
        setCForm(EMPTY_CFORM);
        setCErrors({});
    };

    /* ── Verify teacher for report card ── */
    const handleRcVerify = () => {
        const key = rcVerify.regNo.trim().toUpperCase();
        const teacher = TEACHER_CREDENTIALS[key];
        if (!teacher || teacher.password !== rcVerify.password) {
            setRcVerify(f => ({ ...f, error: 'Invalid registration number or password. Please try again.' }));
            return;
        }
        setRcVerifiedTeacher({ ...teacher, regNo: key });
        setRcStep('form');
        setRcVerify({ regNo: '', password: '', error: '' });
        setRcShowPass(false);
    };

    /* ── Generate Report Card submit ── */
    const handleGenerateRC = () => {
        const errs = {};
        if (!rcForm.name.trim())   errs.name   = 'Student name is required';
        if (!rcForm.rollNo.trim()) errs.rollNo = 'Roll number is required';
        if (!rcForm.course)        errs.course = 'Course is required';
        if (reportList.some(r => r.rollNo.toLowerCase() === rcForm.rollNo.trim().toLowerCase()))
            errs.rollNo = 'Roll number already has a report card';
        const sgpaVal = parseFloat(rcForm.sgpa);
        const cgpaVal = parseFloat(rcForm.cgpa);
        if (isNaN(sgpaVal) || sgpaVal < 0 || sgpaVal > 10) errs.sgpa = 'Enter a value between 0 and 10';
        if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) errs.cgpa = 'Enter a value between 0 and 10';
        if (Object.keys(errs).length) { setRcErrors(errs); return; }

        const newRC = {
            id:          `RC${String(reportList.length + 1).padStart(3, '0')}`,
            rollNo:      rcForm.rollNo.trim().toUpperCase(),
            name:        rcForm.name.trim(),
            course:      rcForm.course,
            year:        Number(rcForm.year),
            semester:    Number(rcForm.semester),
            sgpa:        sgpaVal,
            cgpa:        cgpaVal,
            credits:     Number(rcForm.credits),
            status:      rcForm.status,
            grade:       sgpaToGrade(sgpaVal),
            generatedBy: rcVerifiedTeacher.name,
        };
        setReportList(prev => [newRC, ...prev]);
        closeRcModal();
    };

    const closeRcModal = () => {
        setRcStep(null);
        setRcVerifiedTeacher(null);
        setRcVerify({ regNo: '', password: '', error: '' });
        setRcShowPass(false);
        setRcForm(EMPTY_RCFORM);
        setRcErrors({});
    };

    const ES = {
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
            <Navbar title="Examination Management" subtitle="Assessments, report cards and credit-based evaluation" />

            {/* ── Hero KPI Cards ── */}
            <div style={ES.heroGrid}>
                {[
                    { label:'Internal Assessments', value:totalIA,            gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.28)',  icon:ClipboardList, sub:`${completedIA} completed · ${totalIA - completedIA} pending` },
                    { label:'Report Cards',          value:reportList.length,  gradient:'linear-gradient(135deg,#065f46,#059669)', glow:'rgba(5,150,105,0.28)',  icon:FileText,      sub:`${publishedRC} published · ${reportList.length - publishedRC} draft` },
                    { label:'Credit Courses',        value:creditList.length,  gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.28)', icon:Star,          sub:'across all programmes' },
                    { label:'Average CGPA',          value:avgCGPA,            gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.28)', icon:TrendingUp,    sub:'institution average' },
                ].map(({ label, value, gradient, glow, icon:Icon, sub }) => (
                    <div key={label} style={{ ...ES.heroCard, background:gradient, boxShadow:`0 8px 24px ${glow}` }}>
                        <div style={ES.heroTop}>
                            <div style={ES.heroIcon}><Icon size={20} strokeWidth={2} color="white"/></div>
                            <div style={ES.heroVal}>{value}</div>
                        </div>
                        <div style={ES.heroLbl}>{label}</div>
                        <div style={ES.heroSub}>{sub}</div>
                        <div style={ES.heroShine}/>
                    </div>
                ))}
            </div>

            {/* ── Tab Bar + Toolbar ── */}
            <div style={ES.tabRow}>
                <div style={ES.tabBar}>
                    {TABS.map(({ key, label, icon:Icon }) => {
                        const active = tab === key;
                        return (
                            <button key={key} style={{ ...ES.tab, ...(active ? ES.tabActive : {}) }} onClick={() => { setTab(key); setQ(''); }}>
                                <Icon size={15} strokeWidth={active ? 2.5 : 2}/>{label}
                                {active && <span style={ES.tabDot}/>}
                            </button>
                        );
                    })}
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                    <div style={ES.searchWrap}>
                        <Search size={14} color="var(--text-muted)"/>
                        <input style={ES.searchInput} placeholder="Search…" value={q} onChange={e => setQ(e.target.value)}/>
                        {q && <button style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', padding:2, display:'flex' }} onClick={() => setQ('')}><X size={12}/></button>}
                    </div>
                    <button className="btn btn-secondary btn-sm"><Download size={13}/> Export</button>
                    <button className="btn btn-primary btn-sm" onClick={() => {
                        if (tab === 'assessments') setIaStep('verify');
                        if (tab === 'schedule')    setScheduleStep('verify');
                        if (tab === 'credits')     setCourseModal(true);
                        if (tab === 'reportcards') setRcStep('verify');
                    }}>
                        <Plus size={13}/>
                        {tab === 'assessments' ? 'New Assessment' : tab === 'reportcards' ? 'Generate Report Card' : tab === 'credits' ? 'Add Course' : 'Schedule Exam'}
                    </button>
                </div>
            </div>

            {/* ══════════ ASSESSMENTS TAB ══════════ */}
            {tab === 'assessments' && (() => {
                const data = filt(assessmentList, ['course', 'subject', 'dept', 'type']);
                return (
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Internal Assessment Records <span className="count-pill">{data.length}</span></h2>
                                <p>Configure and track internal assessment marks and results</p>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead><tr>
                                    <th>Assessment</th><th>Department</th><th>Type</th>
                                    <th>Max Marks</th><th>Weightage</th><th>Date</th>
                                    <th>Avg Score</th><th>Pass Rate</th><th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.map(a => {
                                        const DEPT_COLORS = { 'Computer Science':['#dbeafe','#1e40af'], Electronics:['#fce7f3','#be185d'], Mathematics:['#ede9fe','#7c3aed'], Commerce:['#fef3c7','#d97706'], Physics:['#f0f9ff','#0284c7'], Chemistry:['#d1fae5','#059669'] };
                                        const [dBg,dCol] = DEPT_COLORS[a.dept] ?? ['#f1f5f9','#475569'];
                                        const STAT_PILL = { Completed:['#d1fae5','#065f46','#6ee7b7'], Scheduled:['#dbeafe','#1d4ed8','#93c5fd'], Upcoming:['#fef3c7','#92400e','#fbbf24'] };
                                        const [sBg,sCol,sBdr] = STAT_PILL[a.status] ?? ['#f1f5f9','#475569','#cbd5e1'];
                                        const prBg = a.passRate>=90?'#d1fae5':a.passRate>=75?'#fef3c7':'#fef2f2';
                                        const prCol = a.passRate>=90?'#065f46':a.passRate>=75?'#92400e':'#dc2626';
                                        const prBdr = a.passRate>=90?'#6ee7b7':a.passRate>=75?'#fbbf24':'#fca5a5';
                                        return (
                                        <tr key={a.id}>
                                            <td>
                                                <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{a.subject}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>{a.course} · {a.syllabus}</div>
                                            </td>
                                            <td><span style={{ background:dBg, color:dCol, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:`1px solid ${dCol}33` }}>{a.dept}</span></td>
                                            <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{a.type}</td>
                                            <td>
                                                <span style={{ display:'inline-flex', alignItems:'center', gap:3, background:'linear-gradient(135deg,#fef3c7,#fde68a)', color:'#92400e', padding:'3px 10px', borderRadius:99, fontSize:'0.76rem', fontWeight:800, border:'1px solid #fbbf24' }}>
                                                    {a.maxMarks}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
                                                    <span style={{ fontSize:'0.83rem', fontWeight:700, color:'var(--text-primary)' }}>{a.weightage}%</span>
                                                    <div style={{ width:48, height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}><div style={{ width:`${a.weightage}%`, height:'100%', background:'linear-gradient(90deg,#1e3a8a,#2563eb)', borderRadius:99 }}/></div>
                                                </div>
                                            </td>
                                            <td style={{ fontSize:'0.78rem', color:'var(--text-muted)' }}>{a.date}</td>
                                            <td>
                                                {a.studentsAppeared > 0
                                                    ? <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                                                        <span><span style={{ fontWeight:800, fontSize:'0.9rem', color:'var(--text-primary)' }}>{a.avgScore}</span><span style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>/{a.maxMarks}</span></span>
                                                        <div style={{ width:56, height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}><div style={{ width:`${(a.avgScore/a.maxMarks)*100}%`, height:'100%', background:'linear-gradient(90deg,#4c1d95,#7c3aed)', borderRadius:99 }}/></div>
                                                      </div>
                                                    : <span style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>—</span>}
                                            </td>
                                            <td>
                                                {a.passRate > 0
                                                    ? <span style={{ background:prBg, color:prCol, border:`1px solid ${prBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.76rem', fontWeight:700 }}>{a.passRate}%</span>
                                                    : <span style={{ color:'var(--text-muted)', fontSize:'0.78rem' }}>—</span>}
                                            </td>
                                            <td><span style={{ background:sBg, color:sCol, border:`1px solid ${sBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:600 }}>{a.status}</span></td>
                                            <td>
                                                <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                    <button className="tbl-btn" title="View Results"><BarChart2 size={13}/></button>
                                                    <button className="tbl-btn" title="Edit"><Edit2 size={13}/></button>
                                                    <button className="tbl-btn danger" title="Delete" onClick={() => setAssessmentList(prev => prev.filter(x => x.id !== a.id))}><Trash2 size={13}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {data.length === 0 && <div className="empty-state"><div className="empty-icon">📊</div><p>No assessments found.</p></div>}
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ REPORT CARDS TAB ══════════ */}
            {tab === 'reportcards' && (() => {
                const data = filt(reportList, ['name', 'rollNo', 'course', 'grade']);
                return (
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Student Report Cards <span className="count-pill">{data.length}</span></h2>
                                <p>Generated report cards with SGPA, CGPA and grade records</p>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button className="btn btn-secondary btn-sm"><Printer size={13} /> Print All</button>
                                <button className="btn btn-primary btn-sm"><GraduationCap size={13} /> Bulk Generate</button>
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead><tr>
                                    <th>Student</th><th>Course</th><th>Year / Sem</th>
                                    <th>Credits</th><th>SGPA</th><th>CGPA</th>
                                    <th>Grade</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.map(r => {
                                        const sgpaCol = r.sgpa>=9?'#059669':r.sgpa>=7?'#1e40af':'#d97706';
                                        const cgpaCol = r.cgpa>=9?'#059669':r.cgpa>=7?'#1e40af':'#d97706';
                                        const sgpaGrad = r.sgpa>=9?'linear-gradient(90deg,#065f46,#059669)':r.sgpa>=7?'linear-gradient(90deg,#1e3a8a,#2563eb)':'linear-gradient(90deg,#92400e,#d97706)';
                                        const cgpaGrad = r.cgpa>=9?'linear-gradient(90deg,#065f46,#059669)':r.cgpa>=7?'linear-gradient(90deg,#1e3a8a,#2563eb)':'linear-gradient(90deg,#92400e,#d97706)';
                                        const RC_STATUS = { Published:['#d1fae5','#065f46','#6ee7b7'], Draft:['#f1f5f9','#475569','#cbd5e1'] };
                                        const [stBg,stCol,stBdr] = RC_STATUS[r.status] ?? ['#f1f5f9','#475569','#cbd5e1'];
                                        return (
                                        <tr key={r.id}>
                                            <td>
                                                <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{r.name}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', fontFamily:'monospace', marginTop:2 }}>{r.rollNo}</div>
                                            </td>
                                            <td><span style={{ background:'#dbeafe', color:'#1e40af', padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:'1px solid #93c5fd' }}>{r.course}</span></td>
                                            <td style={{ fontSize:'0.83rem', color:'var(--text-secondary)' }}>Year {r.year} · Sem {r.semester}</td>
                                            <td>
                                                <span style={{ fontWeight:800, fontSize:'0.9rem', color:'#7c3aed' }}>{r.credits}</span>
                                                <span style={{ color:'var(--text-muted)', fontSize:'0.72rem', marginLeft:3 }}>cr</span>
                                            </td>
                                            <td style={{ minWidth:90 }}>
                                                <div style={{ fontWeight:800, fontSize:'0.9rem', color:sgpaCol }}>{r.sgpa.toFixed(1)}</div>
                                                <div style={{ width:52, height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden', marginTop:3 }}><div style={{ width:`${(r.sgpa/10)*100}%`, height:'100%', background:sgpaGrad, borderRadius:99 }}/></div>
                                            </td>
                                            <td style={{ minWidth:90 }}>
                                                <div style={{ fontWeight:800, fontSize:'0.9rem', color:cgpaCol }}>{r.cgpa.toFixed(1)}</div>
                                                <div style={{ width:52, height:5, background:'#f1f5f9', borderRadius:99, overflow:'hidden', marginTop:3 }}><div style={{ width:`${(r.cgpa/10)*100}%`, height:'100%', background:cgpaGrad, borderRadius:99 }}/></div>
                                            </td>
                                            <td>
                                                <span style={{ background:gradeBg(r.grade), color:gradeColor(r.grade), padding:'4px 12px', borderRadius:99, fontSize:'0.83rem', fontWeight:900, border:`1px solid ${gradeColor(r.grade)}44` }}>{r.grade}</span>
                                            </td>
                                            <td><span style={{ background:stBg, color:stCol, border:`1px solid ${stBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:600 }}>{r.status}</span></td>
                                            <td>
                                                <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                    <button className="tbl-btn" title="View Report Card"><Eye size={13}/></button>
                                                    <button className="tbl-btn" title="Print"><Printer size={13}/></button>
                                                    <button className="tbl-btn" title="Edit"><Edit2 size={13}/></button>
                                                    <button className="tbl-btn danger" title="Delete" onClick={() => setReportList(prev => prev.filter(x => x.id !== r.id))}><Trash2 size={13}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {data.length === 0 && <div className="empty-state"><div className="empty-icon">📄</div><p>No report cards found.</p></div>}
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ CREDIT SYSTEM TAB ══════════ */}
            {tab === 'credits' && (() => {
                const data = filt(creditList, ['course', 'subject', 'code', 'type']);
                const totalCredits  = data.reduce((s, c) => s + c.credits, 0);
                const coreCount     = data.filter(c => c.type === 'Core').length;
                const electiveCount = data.filter(c => c.type === 'Elective').length;
                return (
                    <>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:16 }}>
                            {[
                                { label:'Total Credit Courses', value:data.length,   gradient:'linear-gradient(135deg,#4c1d95,#7c3aed)', glow:'rgba(124,58,237,0.24)' },
                                { label:'Core Subjects',        value:coreCount,     gradient:'linear-gradient(135deg,#1e3a8a,#2563eb)', glow:'rgba(37,99,235,0.24)'  },
                                { label:'Elective Subjects',    value:electiveCount, gradient:'linear-gradient(135deg,#92400e,#d97706)', glow:'rgba(245,158,11,0.24)' },
                            ].map(c => (
                                <div key={c.label} style={{ borderRadius:14, padding:'18px 22px', position:'relative', overflow:'hidden', background:c.gradient, boxShadow:`0 6px 20px ${c.glow}`, color:'white' }}>
                                    <div style={{ fontSize:'1.8rem', fontWeight:900, fontFamily:'var(--font-display)', lineHeight:1 }}>{c.value}</div>
                                    <div style={{ fontSize:'0.76rem', fontWeight:600, opacity:0.85, marginTop:5 }}>{c.label}</div>
                                    <div style={{ position:'absolute', top:0, right:0, bottom:0, width:'50%', background:'rgba(255,255,255,0.05)', clipPath:'polygon(30% 0,100% 0,100% 100%,60% 100%)', pointerEvents:'none' }}/>
                                </div>
                            ))}
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #eff6ff, #f5f3ff)', border: '1px solid #bfdbfe', borderRadius: 12, padding: '16px 20px', marginBottom: 16, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <AlertCircle size={18} style={{ color: '#1e40af', flexShrink: 0, marginTop: 2 }} />
                            <div style={{ fontSize: '0.83rem', color: '#1e40af', lineHeight: 1.6 }}>
                                <strong>Credit-Based Evaluation System (CBCS):</strong> Each subject carries a credit value. The Grade Point (GP) is calculated as Marks Obtained × Credit Weight. SGPA = ΣGP / ΣCredits. Minimum 40% required to pass each subject. <span style={{ fontWeight: 600 }}>Total Credit Load: {totalCredits} credits</span>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <div>
                                    <h2>Credit Course Configuration <span className="count-pill">{data.length}</span></h2>
                                    <p>Internal assessment (IA) vs semester exam (SE) weightage per subject</p>
                                </div>
                            </div>
                            <div style={{ overflowX: 'auto' }}>
                                <table>
                                    <thead><tr>
                                        <th>Subject</th><th>Course</th><th>Code</th><th>Type</th>
                                        <th>Credits</th><th>IA Marks</th><th>SE Marks</th>
                                        <th>Min Pass %</th><th style={{ textAlign: 'right' }}>Actions</th>
                                    </tr></thead>
                                    <tbody>
                                        {data.map(c => (
                                            <tr key={c.id}>
                                                <td><div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{c.subject}</div></td>
                                                <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{c.course}</td>
                                                <td><code style={{ background:'linear-gradient(135deg,#f8fafc,#f1f5f9)', padding:'3px 9px', borderRadius:6, fontSize:'0.75rem', color:'#475569', fontFamily:'monospace', border:'1px solid var(--border)' }}>{c.code}</code></td>
                                                <td><span style={{ background:TYPE_BG[c.type], color:TYPE_COLOR[c.type], padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:`1px solid ${TYPE_COLOR[c.type]}33` }}>{c.type}</span></td>
                                                <td>
                                                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                                                        <div style={{ display:'flex', gap:3 }}>{[...Array(Math.min(c.credits,6))].map((_,i) => <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:i<c.credits?'#7c3aed':'#e2e8f0' }}/>)}</div>
                                                        <span style={{ fontWeight:800, fontSize:'0.83rem', color:'#7c3aed' }}>{c.credits}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize:'0.83rem', fontWeight:700, color:'#1e40af', marginBottom:3 }}>{c.ia}%</div>
                                                    <div style={{ width:64, height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}><div style={{ width:`${c.ia}%`, height:'100%', background:'linear-gradient(90deg,#1e3a8a,#2563eb)', borderRadius:99 }}/></div>
                                                </td>
                                                <td>
                                                    <div style={{ fontSize:'0.83rem', fontWeight:700, color:'#059669', marginBottom:3 }}>{c.se}%</div>
                                                    <div style={{ width:64, height:6, background:'#f1f5f9', borderRadius:99, overflow:'hidden' }}><div style={{ width:`${c.se}%`, height:'100%', background:'linear-gradient(90deg,#065f46,#059669)', borderRadius:99 }}/></div>
                                                </td>
                                                <td><span style={{ background:'#fef2f2', color:'#dc2626', padding:'3px 10px', borderRadius:99, fontSize:'0.75rem', fontWeight:700, border:'1px solid #fca5a5' }}>{c.minPass}%</span></td>
                                                <td>
                                                    <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                        <button className="tbl-btn" title="Edit"><Edit2 size={13}/></button>
                                                        <button className="tbl-btn danger" title="Delete" onClick={() => setCreditList(prev => prev.filter(x => x.id !== c.id))}><Trash2 size={13}/></button>
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

            {/* ══════════ EXAM SCHEDULE TAB ══════════ */}
            {tab === 'schedule' && (() => {
                const data = filt(examList, ['title', 'course', 'dept', 'type', 'subject', 'invigilator']);
                return (
                    <div className="card">
                        <div className="card-header">
                            <div>
                                <h2>Examination Schedule <span className="count-pill">{data.length}</span></h2>
                                <p>Exam timetable, rooms and invigilator assignments — visible to all students</p>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {[
                                    { label: 'Internal', color: '#1e40af', bg: '#dbeafe' },
                                    { label: 'Practical', color: '#059669', bg: '#d1fae5' },
                                    { label: 'Viva', color: '#7c3aed', bg: '#ede9fe' },
                                ].map(b => (
                                    <span key={b.label} style={{ background: b.bg, color: b.color, padding: '3px 11px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${b.color}30` }}>{b.label}</span>
                                ))}
                            </div>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead><tr>
                                    <th>Examination</th><th>Department</th><th>Type</th>
                                    <th>Date</th><th>Time</th><th>Duration</th>
                                    <th>Room</th><th>Invigilator</th><th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr></thead>
                                <tbody>
                                    {data.map(e => {
                                        const SCH_STATUS = { Scheduled:['#dbeafe','#1d4ed8','#93c5fd'], Upcoming:['#fef3c7','#92400e','#fbbf24'], Completed:['#d1fae5','#065f46','#6ee7b7'] };
                                        const [eBg,eCol,eBdr] = SCH_STATUS[e.status] ?? ['#f1f5f9','#475569','#cbd5e1'];
                                        const etBg = EXAM_TYPE_BG[e.type] ?? '#f1f5f9';
                                        const etCol = EXAM_TYPE_COLOR[e.type] ?? '#475569';
                                        const DEPT_COLORS = { 'Computer Science':['#dbeafe','#1e40af'], Electronics:['#fce7f3','#be185d'], Mathematics:['#ede9fe','#7c3aed'], Commerce:['#fef3c7','#d97706'] };
                                        const [dBg,dCol] = DEPT_COLORS[e.dept] ?? ['#f1f5f9','#475569'];
                                        return (
                                        <tr key={e.id}>
                                            <td>
                                                <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)' }}>{e.title}</div>
                                                <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>{e.course}{e.subject?` · ${e.subject}`:''}</div>
                                            </td>
                                            <td><span style={{ background:dBg, color:dCol, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:`1px solid ${dCol}33` }}>{e.dept}</span></td>
                                            <td><span style={{ background:etBg, color:etCol, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:700, border:`1px solid ${etCol}33` }}>{e.type}</span></td>
                                            <td style={{ fontSize:'0.8rem' }}>
                                                <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                                                    <Calendar size={12} color="var(--text-muted)"/>
                                                    <span style={{ fontWeight:600 }}>{e.startDate}</span>
                                                </div>
                                                {e.endDate && e.endDate !== e.startDate && <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>to {e.endDate}</div>}
                                            </td>
                                            <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>
                                                {e.time ? <div style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={12} color="var(--text-muted)"/> {e.time}</div> : '—'}
                                            </td>
                                            <td style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>{e.duration||'—'}</td>
                                            <td><code style={{ background:'linear-gradient(135deg,#f8fafc,#f1f5f9)', padding:'3px 9px', borderRadius:6, fontSize:'0.75rem', color:'#475569', fontFamily:'monospace', border:'1px solid var(--border)' }}>Room {e.rooms}</code></td>
                                            <td style={{ fontSize:'0.83rem', color:'var(--text-secondary)' }}>{e.invigilator}</td>
                                            <td><span style={{ background:eBg, color:eCol, border:`1px solid ${eBdr}`, padding:'3px 10px', borderRadius:99, fontSize:'0.73rem', fontWeight:600 }}>{e.status}</span></td>
                                            <td>
                                                <div style={{ display:'flex', gap:5, justifyContent:'flex-end' }}>
                                                    <button className="tbl-btn" title="View Details"><Eye size={13}/></button>
                                                    <button className="tbl-btn" title="Edit"><Edit2 size={13}/></button>
                                                    <button className="tbl-btn danger" title="Delete"><Trash2 size={13}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {data.length === 0 && <div className="empty-state"><div className="empty-icon">🗓️</div><p>No exam schedules found.</p></div>}
                        </div>
                    </div>
                );
            })()}

            {/* ══════════ MODAL: Teacher Verification ══════════ */}
            {scheduleStep === 'verify' && (
                <div className="em-overlay" onClick={closeModal}>
                    <div className="em-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                        {/* Header */}
                        <div className="em-modal-head">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    <ShieldCheck size={22} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Teacher Verification</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Only authorized teachers can schedule exams</p>
                                </div>
                            </div>
                            <button className="em-close-btn" onClick={closeModal}><X size={16} /></button>
                        </div>

                        {/* Body */}
                        <div className="em-modal-body">
                            {verifyForm.error && (
                                <div className="em-alert-error">
                                    <AlertCircle size={14} /> {verifyForm.error}
                                </div>
                            )}

                            <div className="sf-field">
                                <label className="sf-label">Teacher Registration Number</label>
                                <input
                                    className="sf-input"
                                    placeholder="e.g. TCH001"
                                    value={verifyForm.regNo}
                                    onChange={e => setVerifyForm(f => ({ ...f, regNo: e.target.value, error: '' }))}
                                    onKeyDown={e => e.key === 'Enter' && handleVerify()}
                                    autoFocus
                                />
                            </div>

                            <div className="sf-field" style={{ marginTop: 14 }}>
                                <label className="sf-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="sf-input"
                                        type={showPass ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={verifyForm.password}
                                        onChange={e => setVerifyForm(f => ({ ...f, password: e.target.value, error: '' }))}
                                        onKeyDown={e => e.key === 'Enter' && handleVerify()}
                                        style={{ paddingRight: 40 }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(v => !v)}
                                        style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}
                                    >
                                        <Lock size={14} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', marginTop: 16 }}>
                                <AlertCircle size={14} style={{ color: '#0284c7', marginTop: 1, flexShrink: 0 }} />
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#0369a1', lineHeight: 1.5 }}>
                                    Use your <strong>Teacher ID</strong> (TCH001 – TCH010) and your assigned password (<strong>pass</strong> + your 3-digit ID number, e.g. <strong>pass006</strong> for TCH006). Contact the <strong>ERP Administrator</strong> if you need help.
                                </p>
                            </div>

                            <button className="btn btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={handleVerify}>
                                <ShieldCheck size={15} /> Verify & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: Schedule Exam Form ══════════ */}
            {scheduleStep === 'form' && verifiedTeacher && (
                <div className="em-overlay" onClick={closeModal}>
                    <div className="em-modal em-modal-lg" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="em-modal-head">
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Schedule New Exam</h3>
                                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Fill in the details to publish the exam to students</p>
                            </div>
                            <button className="em-close-btn" onClick={closeModal}><X size={16} /></button>
                        </div>

                        {/* Verified teacher banner */}
                        <div className="em-modal-body">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '10px 16px', marginBottom: 20 }}>
                                <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#065f46' }}>Verified: {verifiedTeacher.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#047857' }}>Reg. No: {verifiedTeacher.regNo} · {verifiedTeacher.dept}</div>
                                </div>
                            </div>

                            {/* Exam type selector */}
                            <div className="sf-field" style={{ marginBottom: 18 }}>
                                <label className="sf-label">Exam Type <span style={{ color: '#dc2626' }}>*</span></label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 6 }}>
                                    {EXAM_TYPE_OPTIONS.map(opt => {
                                        const active = sForm.examType === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setSForm(f => ({ ...f, examType: opt.value }))}
                                                style={{
                                                    padding: '12px 10px',
                                                    borderRadius: 10,
                                                    border: `2px solid ${active ? opt.color : 'var(--border)'}`,
                                                    background: active ? opt.bg : 'var(--bg)',
                                                    cursor: 'pointer',
                                                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <div style={{ width: 34, height: 34, borderRadius: 8, background: active ? opt.color : '#f1f5f9', display: 'grid', placeItems: 'center' }}>
                                                    <opt.icon size={16} color={active ? 'white' : '#94a3b8'} />
                                                </div>
                                                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: active ? opt.color : 'var(--text-muted)' }}>{opt.label}</span>
                                                <span style={{ fontSize: '0.68rem', color: active ? opt.color : 'var(--text-muted)', textAlign: 'center', lineHeight: 1.3 }}>{opt.desc}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Form grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label={<>Exam Title <span style={{ color: '#dc2626' }}>*</span></>} error={sErrors.examTitle}>
                                        <input className={`sf-input ${sErrors.examTitle ? 'sf-input-err' : ''}`} placeholder="e.g. Internal Assessment 2 — B.Sc CSE" value={sForm.examTitle} onChange={e => { setSForm(f => ({ ...f, examTitle: e.target.value })); setSErrors(x => ({ ...x, examTitle: '' })); }} />
                                    </Field>
                                </div>

                                <Field label="Subject / Paper">
                                    <input className="sf-input" placeholder="e.g. Data Structures" value={sForm.subject} onChange={e => setSForm(f => ({ ...f, subject: e.target.value }))} />
                                </Field>

                                <Field label={<>Course <span style={{ color: '#dc2626' }}>*</span></>} error={sErrors.course}>
                                    <input className={`sf-input ${sErrors.course ? 'sf-input-err' : ''}`} placeholder="e.g. B.Sc Computer Science" value={sForm.course} onChange={e => { setSForm(f => ({ ...f, course: e.target.value })); setSErrors(x => ({ ...x, course: '' })); }} />
                                </Field>

                                <Field label="Department">
                                    <input className="sf-input" value={sForm.department} onChange={e => setSForm(f => ({ ...f, department: e.target.value }))} placeholder={verifiedTeacher.dept} />
                                </Field>

                                <Field label={<>Start Date <span style={{ color: '#dc2626' }}>*</span></>} error={sErrors.startDate}>
                                    <input type="date" className={`sf-input ${sErrors.startDate ? 'sf-input-err' : ''}`} value={sForm.startDate} onChange={e => { setSForm(f => ({ ...f, startDate: e.target.value })); setSErrors(x => ({ ...x, startDate: '' })); }} />
                                </Field>

                                <Field label={<>End Date <span style={{ color: '#dc2626' }}>*</span></>} error={sErrors.endDate}>
                                    <input type="date" className={`sf-input ${sErrors.endDate ? 'sf-input-err' : ''}`} value={sForm.endDate} onChange={e => { setSForm(f => ({ ...f, endDate: e.target.value })); setSErrors(x => ({ ...x, endDate: '' })); }} />
                                </Field>

                                <Field label="Start Time">
                                    <input type="time" className="sf-input" value={sForm.startTime} onChange={e => setSForm(f => ({ ...f, startTime: e.target.value }))} />
                                </Field>

                                <Field label="Duration">
                                    <input className="sf-input" placeholder="e.g. 3 hours" value={sForm.duration} onChange={e => setSForm(f => ({ ...f, duration: e.target.value }))} />
                                </Field>

                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label={<>Room / Venue <span style={{ color: '#dc2626' }}>*</span></>} error={sErrors.room}>
                                        <input className={`sf-input ${sErrors.room ? 'sf-input-err' : ''}`} placeholder="e.g. 101, 102 or Lab Block A" value={sForm.room} onChange={e => { setSForm(f => ({ ...f, room: e.target.value })); setSErrors(x => ({ ...x, room: '' })); }} />
                                    </Field>
                                </div>

                                {/* Invigilator (read-only) */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label="Invigilator (auto-filled from verification)">
                                        <input className="sf-input" value={verifiedTeacher.name} readOnly style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)', cursor: 'not-allowed' }} />
                                    </Field>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleScheduleSubmit}>
                                    <Calendar size={14} /> Publish Exam Schedule
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: IA — Teacher Verification ══════════ */}
            {iaStep === 'verify' && (
                <div className="em-overlay" onClick={closeIaModal}>
                    <div className="em-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                        <div className="em-modal-head">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    <ShieldCheck size={22} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Teacher Verification</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Only authorised teachers can add assessments</p>
                                </div>
                            </div>
                            <button className="em-close-btn" onClick={closeIaModal}><X size={16} /></button>
                        </div>
                        <div className="em-modal-body">
                            {iaVerify.error && (
                                <div className="em-alert-error"><AlertCircle size={14} /> {iaVerify.error}</div>
                            )}
                            <div className="sf-field">
                                <label className="sf-label">Teacher Registration Number</label>
                                <input className="sf-input" placeholder="e.g. TCH001" value={iaVerify.regNo} onChange={e => setIaVerify(f => ({ ...f, regNo: e.target.value, error: '' }))} onKeyDown={e => e.key === 'Enter' && handleIaVerify()} autoFocus />
                            </div>
                            <div className="sf-field" style={{ marginTop: 14 }}>
                                <label className="sf-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input className="sf-input" type={iaShowPass ? 'text' : 'password'} placeholder="Enter your password" value={iaVerify.password} onChange={e => setIaVerify(f => ({ ...f, password: e.target.value, error: '' }))} onKeyDown={e => e.key === 'Enter' && handleIaVerify()} style={{ paddingRight: 40 }} />
                                    <button type="button" onClick={() => setIaShowPass(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                                        <Lock size={14} />
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', marginTop: 16 }}>
                                <AlertCircle size={14} style={{ color: '#0284c7', marginTop: 1, flexShrink: 0 }} />
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#0369a1', lineHeight: 1.5 }}>
                                    Use your <strong>Teacher ID</strong> (TCH001 – TCH010) and your assigned password (<strong>pass</strong> + your 3-digit ID number, e.g. <strong>pass006</strong> for TCH006). Contact the <strong>ERP Administrator</strong> if you need help.
                                </p>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={handleIaVerify}>
                                <ShieldCheck size={15} /> Verify & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: New Internal Assessment (Form) ══════════ */}
            {iaStep === 'form' && iaVerifiedTeacher && (
                <div className="em-overlay" onClick={closeIaModal}>
                    <div className="em-modal em-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="em-modal-head">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    <ClipboardList size={22} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>New Internal Assessment</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Configure a new assessment record for a subject</p>
                                </div>
                            </div>
                            <button className="em-close-btn" onClick={closeIaModal}><X size={16} /></button>
                        </div>

                        <div className="em-modal-body">
                            {/* Verified teacher banner */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 10, padding: '10px 16px', marginBottom: 20 }}>
                                <CheckCircle2 size={18} style={{ color: '#1e40af', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#1e3a8a' }}>Verified: {iaVerifiedTeacher.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#1d4ed8' }}>Reg. No: {iaVerifiedTeacher.regNo} · {iaVerifiedTeacher.dept}</div>
                                </div>
                            </div>
                            {/* Assessment type selector */}
                            <div className="sf-field" style={{ marginBottom: 18 }}>
                                <label className="sf-label">Assessment Type <span style={{ color: '#dc2626' }}>*</span></label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                                    {ASSESSMENT_TYPES.map(t => (
                                        <button
                                            key={t} type="button"
                                            onClick={() => setIaForm(f => ({ ...f, type: t }))}
                                            style={{ padding: '7px 14px', borderRadius: 8, border: `2px solid ${iaForm.type === t ? '#1e40af' : 'var(--border)'}`, background: iaForm.type === t ? '#dbeafe' : 'var(--bg)', color: iaForm.type === t ? '#1e40af' : 'var(--text-muted)', fontWeight: iaForm.type === t ? 700 : 500, fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.14s' }}
                                        >{t}</button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                                {/* Subject */}
                                <Field label={<>Subject <span style={{ color: '#dc2626' }}>*</span></>} error={iaErrors.subject}>
                                    <input className={`sf-input ${iaErrors.subject ? 'sf-input-err' : ''}`} placeholder="e.g. Data Structures" value={iaForm.subject} onChange={e => { setIaForm(f => ({ ...f, subject: e.target.value })); setIaErrors(x => ({ ...x, subject: '' })); }} />
                                </Field>

                                {/* Course */}
                                <Field label={<>Course / Programme <span style={{ color: '#dc2626' }}>*</span></>} error={iaErrors.course}>
                                    <select className={`sf-input ${iaErrors.course ? 'sf-input-err' : ''}`} value={iaForm.course} onChange={e => { setIaForm(f => ({ ...f, course: e.target.value })); setIaErrors(x => ({ ...x, course: '' })); }}>
                                        <option value="">Select programme…</option>
                                        {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </Field>

                                {/* Department */}
                                <Field label={<>Department <span style={{ color: '#dc2626' }}>*</span></>} error={iaErrors.dept}>
                                    <select className={`sf-input ${iaErrors.dept ? 'sf-input-err' : ''}`} value={iaForm.dept} onChange={e => { setIaForm(f => ({ ...f, dept: e.target.value })); setIaErrors(x => ({ ...x, dept: '' })); }}>
                                        <option value="">Select department…</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </Field>

                                {/* Max Marks */}
                                <Field label={<>Max Marks <span style={{ color: '#dc2626' }}>*</span></>} error={iaErrors.maxMarks}>
                                    <input type="number" min="1" max="200" className={`sf-input ${iaErrors.maxMarks ? 'sf-input-err' : ''}`} placeholder="e.g. 20" value={iaForm.maxMarks} onChange={e => { setIaForm(f => ({ ...f, maxMarks: e.target.value })); setIaErrors(x => ({ ...x, maxMarks: '' })); }} />
                                </Field>

                                {/* Weightage */}
                                <Field label="Weightage %">
                                    <div>
                                        <input type="range" min="5" max="100" step="5" value={iaForm.weightage} onChange={e => setIaForm(f => ({ ...f, weightage: Number(e.target.value) }))} style={{ width: '100%', accentColor: '#1e40af' }} />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>5%</span>
                                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af', background: '#dbeafe', padding: '1px 10px', borderRadius: 4 }}>{iaForm.weightage}%</span>
                                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>100%</span>
                                        </div>
                                    </div>
                                </Field>

                                {/* Syllabus */}
                                <Field label="Syllabus Coverage">
                                    <input className="sf-input" placeholder="e.g. Units 1–2" value={iaForm.syllabus} onChange={e => setIaForm(f => ({ ...f, syllabus: e.target.value }))} />
                                </Field>

                                {/* Date */}
                                <Field label={<>Assessment Date <span style={{ color: '#dc2626' }}>*</span></>} error={iaErrors.date}>
                                    <input type="date" className={`sf-input ${iaErrors.date ? 'sf-input-err' : ''}`} value={iaForm.date} onChange={e => { setIaForm(f => ({ ...f, date: e.target.value })); setIaErrors(x => ({ ...x, date: '' })); }} />
                                </Field>

                                {/* Status */}
                                <Field label="Initial Status">
                                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                        {['Scheduled', 'Upcoming'].map(s => (
                                            <button key={s} type="button"
                                                onClick={() => setIaForm(f => ({ ...f, status: s }))}
                                                style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `2px solid ${iaForm.status === s ? '#1e40af' : 'var(--border)'}`, background: iaForm.status === s ? '#dbeafe' : 'var(--bg)', color: iaForm.status === s ? '#1e40af' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.15s' }}
                                            >{s}</button>
                                        ))}
                                    </div>
                                </Field>
                            </div>

                            {/* Preview strip */}
                            {iaForm.subject && (
                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, background: 'linear-gradient(135deg,#eff6ff,#f0f9ff)', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', marginTop: 14 }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1e40af', flex: 1, minWidth: 120 }}>{iaForm.subject || '—'}</span>
                                    {iaForm.course && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 600 }}>{iaForm.course}</span>}
                                    <span style={{ background: '#fef3c7', color: '#d97706', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>{iaForm.maxMarks} Marks</span>
                                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>{iaForm.weightage}% Weightage</span>
                                    <span style={{ background: iaForm.status === 'Scheduled' ? '#dbeafe' : '#fef3c7', color: iaForm.status === 'Scheduled' ? '#1e40af' : '#d97706', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>{iaForm.status}</span>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={closeIaModal}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddAssessment}>
                                    <ClipboardList size={14} /> Add Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: RC — Teacher Verification ══════════ */}
            {rcStep === 'verify' && (
                <div className="em-overlay" onClick={closeRcModal}>
                    <div className="em-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
                        <div className="em-modal-head">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#059669,#34d399)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    <ShieldCheck size={22} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Teacher Verification</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Only authorised teachers can generate report cards</p>
                                </div>
                            </div>
                            <button className="em-close-btn" onClick={closeRcModal}><X size={16} /></button>
                        </div>

                        <div className="em-modal-body">
                            {rcVerify.error && (
                                <div className="em-alert-error">
                                    <AlertCircle size={14} /> {rcVerify.error}
                                </div>
                            )}

                            <div className="sf-field">
                                <label className="sf-label">Teacher Registration Number</label>
                                <input
                                    className="sf-input"
                                    placeholder="e.g. TCH001"
                                    value={rcVerify.regNo}
                                    onChange={e => setRcVerify(f => ({ ...f, regNo: e.target.value, error: '' }))}
                                    onKeyDown={e => e.key === 'Enter' && handleRcVerify()}
                                    autoFocus
                                />
                            </div>

                            <div className="sf-field" style={{ marginTop: 14 }}>
                                <label className="sf-label">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        className="sf-input"
                                        type={rcShowPass ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={rcVerify.password}
                                        onChange={e => setRcVerify(f => ({ ...f, password: e.target.value, error: '' }))}
                                        onKeyDown={e => e.key === 'Enter' && handleRcVerify()}
                                        style={{ paddingRight: 40 }}
                                    />
                                    <button type="button" onClick={() => setRcShowPass(v => !v)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                                        <Lock size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Hint */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 8, padding: '10px 14px', marginTop: 16 }}>
                                <AlertCircle size={14} style={{ color: '#0284c7', marginTop: 1, flexShrink: 0 }} />
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#0369a1', lineHeight: 1.5 }}>
                                    Use your <strong>Teacher ID</strong> (TCH001 – TCH010) and your assigned password (<strong>pass</strong> + your 3-digit ID number, e.g. <strong>pass006</strong> for TCH006). Contact the <strong>ERP Administrator</strong> if you need help.
                                </p>
                            </div>
                            <button className="btn btn-primary" style={{ width: '100%', marginTop: 20 }} onClick={handleRcVerify}>
                                <ShieldCheck size={15} /> Verify & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: RC — Generate Form ══════════ */}
            {rcStep === 'form' && rcVerifiedTeacher && (
                <div className="em-overlay" onClick={closeRcModal}>
                    <div className="em-modal em-modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="em-modal-head">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#059669,#34d399)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    <FileText size={22} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Generate Report Card</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Enter student academic performance</p>
                                </div>
                            </div>
                            <button className="em-close-btn" onClick={closeRcModal}><X size={16} /></button>
                        </div>

                        <div className="em-modal-body">
                            {/* Verified teacher banner */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '10px 16px', marginBottom: 20 }}>
                                <CheckCircle2 size={18} style={{ color: '#059669', flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '0.83rem', fontWeight: 700, color: '#065f46' }}>Verified: {rcVerifiedTeacher.name}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#047857' }}>Reg. No: {rcVerifiedTeacher.regNo} · {rcVerifiedTeacher.dept}</div>
                                </div>
                            </div>

                            {/* Section: Student Info */}
                            <div className="rc-section-title">Student Information</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                                <Field label={<>Full Name <span style={{ color: '#dc2626' }}>*</span></>} error={rcErrors.name}>
                                    <input className={`sf-input ${rcErrors.name ? 'sf-input-err' : ''}`} placeholder="e.g. Priya Sharma" value={rcForm.name} onChange={e => { setRcForm(f => ({ ...f, name: e.target.value })); setRcErrors(x => ({ ...x, name: '' })); }} />
                                </Field>
                                <Field label={<>Roll Number <span style={{ color: '#dc2626' }}>*</span></>} error={rcErrors.rollNo}>
                                    <input className={`sf-input ${rcErrors.rollNo ? 'sf-input-err' : ''}`} placeholder="e.g. CS2024007" value={rcForm.rollNo} onChange={e => { setRcForm(f => ({ ...f, rollNo: e.target.value })); setRcErrors(x => ({ ...x, rollNo: '' })); }} style={{ fontFamily: 'monospace', textTransform: 'uppercase' }} />
                                </Field>
                            </div>

                            {/* Section: Academic Info */}
                            <div className="rc-section-title" style={{ marginTop: 10 }}>Academic Details</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label={<>Programme / Course <span style={{ color: '#dc2626' }}>*</span></>} error={rcErrors.course}>
                                        <select className={`sf-input ${rcErrors.course ? 'sf-input-err' : ''}`} value={rcForm.course} onChange={e => { setRcForm(f => ({ ...f, course: e.target.value })); setRcErrors(x => ({ ...x, course: '' })); }}>
                                            <option value="">Select programme…</option>
                                            {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                                        </select>
                                    </Field>
                                </div>
                                <Field label="Year">
                                    <select className="sf-input" value={rcForm.year} onChange={e => setRcForm(f => ({ ...f, year: Number(e.target.value) }))}>
                                        {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
                                    </select>
                                </Field>
                                <Field label="Semester">
                                    <select className="sf-input" value={rcForm.semester} onChange={e => setRcForm(f => ({ ...f, semester: Number(e.target.value) }))}>
                                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                                    </select>
                                </Field>
                                <Field label="Total Credits Earned">
                                    <input type="number" className="sf-input" min="0" max="50" placeholder="e.g. 22" value={rcForm.credits} onChange={e => setRcForm(f => ({ ...f, credits: e.target.value }))} />
                                </Field>
                                <Field label="Status">
                                    <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                        {['Draft', 'Published'].map(s => (
                                            <button key={s} type="button"
                                                onClick={() => setRcForm(f => ({ ...f, status: s }))}
                                                style={{ flex: 1, padding: '9px 0', borderRadius: 8, border: `2px solid ${rcForm.status === s ? (s === 'Published' ? '#059669' : '#475569') : 'var(--border)'}`, background: rcForm.status === s ? (s === 'Published' ? '#d1fae5' : '#f1f5f9') : 'var(--bg)', color: rcForm.status === s ? (s === 'Published' ? '#059669' : '#475569') : 'var(--text-muted)', fontWeight: 700, fontSize: '0.83rem', cursor: 'pointer', transition: 'all 0.15s' }}
                                            >{s}</button>
                                        ))}
                                    </div>
                                </Field>
                            </div>

                            {/* Section: Performance */}
                            <div className="rc-section-title" style={{ marginTop: 10 }}>Performance Scores</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                                <Field label={<>SGPA (Semester GPA) <span style={{ color: '#dc2626' }}>*</span></>} error={rcErrors.sgpa}>
                                    <div>
                                        <input type="number" min="0" max="10" step="0.1" className={`sf-input ${rcErrors.sgpa ? 'sf-input-err' : ''}`} placeholder="0.0 – 10.0" value={rcForm.sgpa} onChange={e => { setRcForm(f => ({ ...f, sgpa: e.target.value })); setRcErrors(x => ({ ...x, sgpa: '' })); }} />
                                        {rcForm.sgpa !== '' && (
                                            <div style={{ height: 5, background: '#e2e8f0', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(parseFloat(rcForm.sgpa) / 10 * 100, 100)}%`, height: '100%', background: parseFloat(rcForm.sgpa) >= 8 ? '#059669' : parseFloat(rcForm.sgpa) >= 6 ? '#1e40af' : '#d97706', borderRadius: 99, transition: 'width 0.2s' }} />
                                            </div>
                                        )}
                                    </div>
                                </Field>
                                <Field label={<>CGPA (Cumulative GPA) <span style={{ color: '#dc2626' }}>*</span></>} error={rcErrors.cgpa}>
                                    <div>
                                        <input type="number" min="0" max="10" step="0.1" className={`sf-input ${rcErrors.cgpa ? 'sf-input-err' : ''}`} placeholder="0.0 – 10.0" value={rcForm.cgpa} onChange={e => { setRcForm(f => ({ ...f, cgpa: e.target.value })); setRcErrors(x => ({ ...x, cgpa: '' })); }} />
                                        {rcForm.cgpa !== '' && (
                                            <div style={{ height: 5, background: '#e2e8f0', borderRadius: 99, marginTop: 6, overflow: 'hidden' }}>
                                                <div style={{ width: `${Math.min(parseFloat(rcForm.cgpa) / 10 * 100, 100)}%`, height: '100%', background: parseFloat(rcForm.cgpa) >= 8 ? '#059669' : parseFloat(rcForm.cgpa) >= 6 ? '#1e40af' : '#d97706', borderRadius: 99, transition: 'width 0.2s' }} />
                                            </div>
                                        )}
                                    </div>
                                </Field>
                            </div>

                            {/* Grade preview */}
                            {rcForm.sgpa !== '' && !isNaN(parseFloat(rcForm.sgpa)) && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'linear-gradient(135deg,#f0fdf4,#eff6ff)', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 18px', marginTop: 12 }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 12, background: gradeBg(sgpaToGrade(rcForm.sgpa)), display: 'grid', placeItems: 'center', flexShrink: 0, border: `2px solid ${gradeColor(sgpaToGrade(rcForm.sgpa))}30` }}>
                                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: gradeColor(sgpaToGrade(rcForm.sgpa)) }}>{sgpaToGrade(rcForm.sgpa)}</span>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Auto-Calculated Grade</div>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 3 }}>{rcForm.name || 'Student'} · SGPA {parseFloat(rcForm.sgpa).toFixed(1)}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{rcForm.course || 'Programme'} · Year {rcForm.year} · Sem {rcForm.semester}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                        <span style={{ background: rcForm.status === 'Published' ? '#d1fae5' : '#f1f5f9', color: rcForm.status === 'Published' ? '#059669' : '#475569', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>{rcForm.status}</span>
                                        {rcForm.credits && <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>{rcForm.credits} Credits</span>}
                                    </div>
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={closeRcModal}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleGenerateRC}>
                                    <FileText size={14} /> Generate Report Card
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════ MODAL: Add Course ══════════ */}
            {courseModal && (
                <div className="em-overlay" onClick={closeCourseModal}>
                    <div className="em-modal em-modal-lg" onClick={e => e.stopPropagation()}>
                        {/* Header */}
                        <div className="em-modal-head">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#7c3aed,#a78bfa)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                                    <Star size={22} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Add Credit Course</h3>
                                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>Configure CBCS credit weightage for a new subject</p>
                                </div>
                            </div>
                            <button className="em-close-btn" onClick={closeCourseModal}><X size={16} /></button>
                        </div>

                        <div className="em-modal-body">
                            {/* Course Type toggle */}
                            <div className="sf-field" style={{ marginBottom: 18 }}>
                                <label className="sf-label">Course Type <span style={{ color: '#dc2626' }}>*</span></label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
                                    {[
                                        { value: 'Core',     label: 'Core Subject',    desc: 'Mandatory for all students',  color: '#1e40af', bg: '#dbeafe' },
                                        { value: 'Elective', label: 'Elective Subject', desc: 'Optional / specialisation',   color: '#7c3aed', bg: '#ede9fe' },
                                    ].map(opt => {
                                        const active = cForm.type === opt.value;
                                        return (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setCForm(f => ({ ...f, type: opt.value }))}
                                                style={{ padding: '12px 16px', borderRadius: 10, border: `2px solid ${active ? opt.color : 'var(--border)'}`, background: active ? opt.bg : 'var(--bg)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}
                                            >
                                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: active ? opt.color : 'var(--text-secondary)' }}>{opt.label}</div>
                                                <div style={{ fontSize: '0.72rem', color: active ? opt.color : 'var(--text-muted)', marginTop: 3 }}>{opt.desc}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                                {/* Subject Name */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <Field label={<>Subject Name <span style={{ color: '#dc2626' }}>*</span></>} error={cErrors.subject}>
                                        <input className={`sf-input ${cErrors.subject ? 'sf-input-err' : ''}`} placeholder="e.g. Data Structures" value={cForm.subject} onChange={e => { setCForm(f => ({ ...f, subject: e.target.value })); setCErrors(x => ({ ...x, subject: '' })); }} />
                                    </Field>
                                </div>

                                {/* Programme / Course */}
                                <Field label={<>Programme / Course <span style={{ color: '#dc2626' }}>*</span></>} error={cErrors.course}>
                                    <select
                                        className={`sf-input ${cErrors.course ? 'sf-input-err' : ''}`}
                                        value={cForm.course}
                                        onChange={e => { setCForm(f => ({ ...f, course: e.target.value })); setCErrors(x => ({ ...x, course: '' })); }}
                                    >
                                        <option value="">Select programme…</option>
                                        {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </Field>

                                {/* Subject Code */}
                                <Field label={<>Subject Code <span style={{ color: '#dc2626' }}>*</span></>} error={cErrors.code}>
                                    <input className={`sf-input ${cErrors.code ? 'sf-input-err' : ''}`} placeholder="e.g. CS301" value={cForm.code} onChange={e => { setCForm(f => ({ ...f, code: e.target.value })); setCErrors(x => ({ ...x, code: '' })); }} style={{ fontFamily: 'monospace', textTransform: 'uppercase' }} />
                                </Field>

                                {/* Credits */}
                                <Field label="Credit Units">
                                    <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                                        {[1, 2, 3, 4, 5, 6].map(n => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setCForm(f => ({ ...f, credits: n }))}
                                                style={{ width: 38, height: 38, borderRadius: 8, border: `2px solid ${cForm.credits === n ? '#7c3aed' : 'var(--border)'}`, background: cForm.credits === n ? '#7c3aed' : 'var(--bg)', color: cForm.credits === n ? 'white' : 'var(--text-muted)', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.14s', flexShrink: 0 }}
                                            >{n}</button>
                                        ))}
                                    </div>
                                </Field>

                                {/* IA % */}
                                <Field label="Internal Assessment (IA) %">
                                    <div>
                                        <input
                                            type="range" min="10" max="90" step="10"
                                            value={cForm.ia}
                                            onChange={e => setCForm(f => ({ ...f, ia: Number(e.target.value) }))}
                                            style={{ width: '100%', accentColor: '#1e40af' }}
                                        />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                                            <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1e40af', padding: '2px 10px', borderRadius: 4, fontWeight: 700 }}>IA: {cForm.ia}%</span>
                                            <span style={{ fontSize: '0.72rem', background: '#d1fae5', color: '#059669', padding: '2px 10px', borderRadius: 4, fontWeight: 700 }}>SE: {100 - cForm.ia}%</span>
                                        </div>
                                        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 99, marginTop: 8, overflow: 'hidden', display: 'flex' }}>
                                            <div style={{ width: `${cForm.ia}%`, background: '#1e40af', borderRadius: '99px 0 0 99px', transition: 'width 0.2s' }} />
                                            <div style={{ flex: 1, background: '#059669', borderRadius: '0 99px 99px 0' }} />
                                        </div>
                                    </div>
                                </Field>

                                {/* Min Pass % */}
                                <Field label="Minimum Pass %">
                                    <select className="sf-input" value={cForm.minPass} onChange={e => setCForm(f => ({ ...f, minPass: Number(e.target.value) }))}>
                                        {[35, 40, 45, 50].map(v => <option key={v} value={v}>{v}%</option>)}
                                    </select>
                                </Field>
                            </div>

                            {/* Preview card */}
                            <div style={{ background: 'linear-gradient(135deg,#f5f3ff,#eff6ff)', border: '1px solid #c4b5fd', borderRadius: 10, padding: '14px 18px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 120 }}>
                                    <div style={{ fontSize: '0.7rem', color: '#7c3aed', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preview</div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginTop: 3 }}>{cForm.subject || 'Subject Name'}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{cForm.course || 'Programme'}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{ background: TYPE_BG[cForm.type], color: TYPE_COLOR[cForm.type], padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>{cForm.type}</span>
                                    <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>{cForm.credits} Credits</span>
                                    <span style={{ background: '#dbeafe', color: '#1e40af', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>IA {cForm.ia}%</span>
                                    <span style={{ background: '#d1fae5', color: '#059669', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>SE {100 - cForm.ia}%</span>
                                    <span style={{ background: '#fef2f2', color: '#dc2626', padding: '3px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>Pass {cForm.minPass}%</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 10, marginTop: 22, justifyContent: 'flex-end' }}>
                                <button className="btn btn-secondary" onClick={closeCourseModal}>Cancel</button>
                                <button className="btn btn-primary" onClick={handleAddCourse}>
                                    <Plus size={14} /> Add to Credit System
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        /* ── Modal overlay & box ── */
        .em-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter:blur(3px); z-index:1000; display:flex; align-items:center; justify-content:center; padding:24px; }
        .em-modal { background:var(--bg-card,white); border:1px solid var(--border); border-radius:16px; box-shadow:0 20px 60px rgba(0,0,0,0.18); width:100%; overflow:hidden; animation:slideUp 0.22s ease; }
        .em-modal-lg { max-width:640px; max-height:90vh; overflow-y:auto; }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

        /* ── Modal header & body ── */
        .em-modal-head { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--border); background:var(--bg-hover,#f8fafc); }
        .em-modal-body { padding:24px; }
        .em-close-btn { width:30px; height:30px; border-radius:8px; border:1px solid var(--border); background:var(--bg,white); cursor:pointer; color:var(--text-muted); display:flex; align-items:center; justify-content:center; transition:all 0.15s; flex-shrink:0; }
        .em-close-btn:hover { background:var(--bg-hover); color:var(--text-primary); }

        /* ── Alert ── */
        .em-alert-error { display:flex; align-items:center; gap:8px; background:#fef2f2; border:1px solid #fca5a5; color:#dc2626; border-radius:8px; padding:10px 14px; font-size:0.83rem; font-weight:500; margin-bottom:14px; }

        /* ── Report card section title ── */
        .rc-section-title { font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; color:var(--text-muted); padding-bottom:8px; border-bottom:1px solid var(--border); margin-bottom:12px; }

        /* ── Form fields ── */
        .sf-field { display:flex; flex-direction:column; margin-bottom:14px; }
        .sf-label { font-size:0.78rem; font-weight:600; color:var(--text-secondary); margin-bottom:5px; }
        .sf-input { padding:9px 12px; border:1.5px solid var(--border); border-radius:8px; font-size:0.875rem; color:var(--text-primary); background:var(--bg,white); font-family:var(--font-body); transition:border-color 0.15s; outline:none; width:100%; box-sizing:border-box; }
        .sf-input:focus { border-color:var(--primary,#1e40af); box-shadow:0 0 0 3px rgba(30,64,175,0.08); }
        .sf-input-err { border-color:#dc2626 !important; }
        .sf-input-err:focus { box-shadow:0 0 0 3px rgba(220,38,38,0.08) !important; }
        .sf-error { font-size:0.72rem; color:#dc2626; margin-top:4px; font-weight:500; }

        /* ── Dark mode ── */
        [data-theme="dark"] .em-modal { background:var(--bg-card) !important; }
        [data-theme="dark"] .em-modal-head { background:var(--bg-sidebar) !important; }
        [data-theme="dark"] .sf-input { background:var(--bg-card) !important; }
      `}</style>
        </div>
    );
}
