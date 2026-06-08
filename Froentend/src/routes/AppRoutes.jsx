import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

import Sidebar from '../components/layout/Sidebar.jsx';
import Login from '../pages/auth/Login.jsx';
import ForgotPassword from '../pages/auth/ForgotPassword.jsx';
import StudentLogin from '../pages/auth/StudentLogin.jsx';
import ForgotPasswordStudent from '../pages/auth/ForgotPasswordStudent.jsx';
import StudentRegister from '../pages/auth/StudentRegister.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import StudentDashboard from '../pages/dashboard/StudentDashboard.jsx';
import StudentInformationCheck from '../pages/students/StudentInformationCheck.jsx';
import Students from '../pages/students/Students.jsx';
import AddStudent from '../pages/students/AddStudent.jsx';
import Teachers from '../pages/teachers/Teachers.jsx';
import AddTeacher from '../pages/teachers/AddTeacher.jsx';
import TeacherProfile from '../pages/teachers/TeacherProfile.jsx';
import LMS from '../pages/lms/LMS.jsx';
import ExamManagement from '../pages/exams/ExamManagement.jsx';
import Transport from '../pages/transport/Transport.jsx';
import Hostel from '../pages/hostel/Hostel.jsx';
import Inventory from '../pages/inventory/Inventory.jsx';
import Courses from '../pages/courses/Courses.jsx';
import AddCourse from '../pages/courses/AddCourse.jsx';
import Attendance from '../pages/attendance/Attendance.jsx';
import Fees from '../pages/fees/Fees.jsx';
import Results from '../pages/results/Results.jsx';
import Settings from '../pages/settings/Settings.jsx';
import Support from '../pages/support/Support.jsx';
import AdminPanel from '../pages/admin/AdminPanel.jsx';
import Admissions from '../pages/admissions/Admissions.jsx';
import AdmissionForm from '../pages/admissions/AdmissionForm.jsx';

/* ── Protected wrapper ── */
function Protected({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />;
}

/* ── Layout wrapper with sidebar ── */
function AppLayout({ children }) {
    return (
        <>
            <Sidebar />
            {children}
        </>
    );
}

/* ── Helper: wrap page with protection + layout ── */
const Page = (Component) => (
    <Protected>
        <AppLayout>
            <Component />
        </AppLayout>
    </Protected>
);

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/student-login" element={<StudentLogin />} />
            <Route path="/student-forgot-password" element={<ForgotPasswordStudent />} />
            <Route path="/student-register" element={<StudentRegister />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Protected */}
            <Route path="/dashboard" element={Page(Dashboard)} />
            <Route path="/students" element={Page(Students)} />
            <Route path="/students/add" element={Page(AddStudent)} />
            <Route path="/teachers" element={Page(Teachers)} />
            <Route path="/teachers/add" element={Page(AddTeacher)} />
            <Route path="/teachers/:id" element={Page(TeacherProfile)} />
            <Route path="/courses" element={Page(Courses)} />
            <Route path="/courses/add" element={Page(AddCourse)} />
            <Route path="/attendance" element={Page(Attendance)} />
            <Route path="/fees" element={Page(Fees)} />
            <Route path="/results" element={Page(Results)} />
            <Route path="/lms" element={Page(LMS)} />
            <Route path="/exam-management" element={Page(ExamManagement)} />
            <Route path="/transport" element={Page(Transport)} />
            <Route path="/hostel" element={Page(Hostel)} />
            <Route path="/inventory" element={Page(Inventory)} />
            <Route path="/admissions"       element={Page(Admissions)}    />
            <Route path="/admissions/apply" element={Page(AdmissionForm)} />
            <Route path="/admin-panel" element={Page(AdminPanel)} />
            <Route path="/settings" element={Page(Settings)} />
            <Route path="/support" element={Page(Support)} />
            <Route path="/student-dashboard" element={Page(StudentDashboard)} />
            <Route path="/student-information" element={Page(StudentInformationCheck)} />
            <Route path="/student" element={<Navigate to="/student-dashboard" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}