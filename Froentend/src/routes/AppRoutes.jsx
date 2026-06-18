import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { normalizeRole, hasPermission, hasMinRole, ROLES, PERMISSIONS } from '../config/rbac.js';

import Sidebar from '../components/layout/Sidebar.jsx';
import Footer from '../components/layout/Footer.jsx';
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

/* ── Helpers ─────────────────────────────────────────────────── */
function getStoredRole() {
    try { return JSON.parse(localStorage.getItem('erp_user') || '{}').role || null; }
    catch { return null; }
}

function resolveRole(ctxUser) {
    return normalizeRole(ctxUser?.role || getStoredRole());
}

/* ── Guards ──────────────────────────────────────────────────── */

// Any authenticated non-student user
function Protected({ children }) {
    const { isAuthenticated, user } = useContext(AuthContext);
    if (!isAuthenticated && !localStorage.getItem('erp_user')) return <Navigate to="/login" replace />;
    const role = resolveRole(user);
    if (role === ROLES.STUDENT) return <Navigate to="/student-dashboard" replace />;
    return children;
}

// Student-only
function StudentProtected({ children }) {
    const { isAuthenticated, user } = useContext(AuthContext);
    if (!isAuthenticated && !localStorage.getItem('erp_user')) return <Navigate to="/student-login" replace />;
    const role = resolveRole(user);
    if (role !== ROLES.STUDENT) return <Navigate to="/dashboard" replace />;
    return children;
}

// Require a minimum role — redirects to dashboard with a 403 message if denied
function RequireRole({ minRole, permission, children }) {
    const { user } = useContext(AuthContext);
    const role = resolveRole(user);

    const allowed = permission
        ? hasPermission(role, permission)
        : hasMinRole(role, minRole || ROLES.ADMINISTRATOR);

    if (!allowed) return <Navigate to="/dashboard" replace state={{ accessDenied: true }} />;
    return children;
}

/* ── Layout ──────────────────────────────────────────────────── */
function AppLayout({ children }) {
    return (
        <>
            <Sidebar />
            <div style={{
                marginLeft:  'var(--sidebar-width)',
                transition:  'margin-left 0.24s cubic-bezier(0.4,0,0.2,1)',
                display:     'flex',
                flexDirection: 'column',
                minHeight:   '100vh',
            }}>
                <div style={{ flex: 1 }}>{children}</div>
                <Footer />
            </div>
        </>
    );
}

/* ── Page wrappers ───────────────────────────────────────────── */
const Page = (Component) => (
    <Protected>
        <AppLayout><Component /></AppLayout>
    </Protected>
);

const StudentPage = (Component) => (
    <StudentProtected>
        <AppLayout><Component /></AppLayout>
    </StudentProtected>
);

// Admin-only page (Administrator+)
const AdminPage = (Component) => (
    <Protected>
        <RequireRole minRole={ROLES.ADMINISTRATOR}>
            <AppLayout><Component /></AppLayout>
        </RequireRole>
    </Protected>
);

// Super-admin-only page
const SuperAdminPage = (Component) => (
    <Protected>
        <RequireRole minRole={ROLES.SUPER_ADMIN}>
            <AppLayout><Component /></AppLayout>
        </RequireRole>
    </Protected>
);

/* ── Routes ──────────────────────────────────────────────────── */
export default function AppRoutes() {
    return (
        <Routes>
            {/* Public */}
            <Route path="/login"                    element={<Login />} />
            <Route path="/forgot-password"          element={<ForgotPassword />} />
            <Route path="/student-login"            element={<StudentLogin />} />
            <Route path="/student-forgot-password"  element={<ForgotPasswordStudent />} />
            <Route path="/student-register"         element={<StudentRegister />} />
            <Route path="/"                         element={<Navigate to="/login" replace />} />

            {/* Staff+ (any authenticated non-student) */}
            <Route path="/dashboard"            element={Page(Dashboard)} />
            <Route path="/courses"              element={Page(Courses)} />
            <Route path="/attendance"           element={Page(Attendance)} />
            <Route path="/results"              element={Page(Results)} />
            <Route path="/lms"                  element={Page(LMS)} />
            <Route path="/exam-management"      element={Page(ExamManagement)} />
            <Route path="/transport"            element={Page(Transport)} />
            <Route path="/hostel"               element={Page(Hostel)} />
            <Route path="/support"              element={Page(Support)} />

            {/* Administrator+ */}
            <Route path="/students"             element={AdminPage(Students)} />
            <Route path="/students/add"         element={AdminPage(AddStudent)} />
            <Route path="/teachers"             element={AdminPage(Teachers)} />
            <Route path="/teachers/add"         element={AdminPage(AddTeacher)} />
            <Route path="/teachers/:id"         element={AdminPage(TeacherProfile)} />
            <Route path="/courses/add"          element={AdminPage(AddCourse)} />
            <Route path="/fees"                 element={AdminPage(Fees)} />
            <Route path="/inventory"            element={AdminPage(Inventory)} />
            <Route path="/admissions"           element={AdminPage(Admissions)} />
            <Route path="/admissions/apply"     element={AdminPage(AdmissionForm)} />
            <Route path="/settings"             element={AdminPage(Settings)} />

            {/* Super Admin only */}
            <Route path="/admin-panel"          element={SuperAdminPage(AdminPanel)} />

            {/* Student portal */}
            <Route path="/student-dashboard"    element={StudentPage(StudentDashboard)} />
            <Route path="/student-information"  element={StudentPage(StudentInformationCheck)} />
            <Route path="/student"              element={<Navigate to="/student-dashboard" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}
