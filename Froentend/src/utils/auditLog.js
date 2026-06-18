import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase.js';

export const AUDIT_ACTIONS = {
    // Auth
    LOGIN:            'auth.login',
    LOGOUT:           'auth.logout',
    LOGIN_FAILED:     'auth.login_failed',
    PASSWORD_CHANGE:  'auth.password_change',
    PASSWORD_RESET:   'auth.password_reset',
    // Students
    STUDENT_VIEW:     'students.view',
    STUDENT_CREATE:   'students.create',
    STUDENT_UPDATE:   'students.update',
    STUDENT_DELETE:   'students.delete',
    STUDENT_EXPORT:   'students.export',
    // Teachers
    TEACHER_CREATE:   'teachers.create',
    TEACHER_DELETE:   'teachers.delete',
    // Courses
    COURSE_CREATE:    'courses.create',
    COURSE_DELETE:    'courses.delete',
    // Fees
    FEE_UPDATE:       'fees.update',
    // Settings
    SETTINGS_CHANGE:  'settings.change',
    // Data
    DATA_EXPORT:      'data.export',
};

// Severity by action prefix
function deriveSeverity(action) {
    if (action.includes('delete') || action.includes('failed')) return 'high';
    if (action.includes('create') || action.includes('update') || action.includes('change')) return 'medium';
    return 'low';
}

export async function logAuditEvent(action, details = {}) {
    try {
        const storedUser = (() => {
            try { return JSON.parse(localStorage.getItem('erp_user') || '{}'); }
            catch { return {}; }
        })();

        await addDoc(collection(db, 'auditLogs'), {
            action,
            module:    action.split('.')[0],
            userId:    storedUser.id    || null,
            userName:  storedUser.name  || 'Unknown',
            userEmail: storedUser.email || null,
            userRole:  storedUser.role  || 'Unknown',
            severity:  deriveSeverity(action),
            details,
            timestamp: serverTimestamp(),
        });
    } catch {
        // Audit failure must never break the calling flow
    }
}

// Fetch recent audit logs for the admin panel
export async function getAuditLogs(maxRows = 100) {
    try {
        const snap = await getDocs(
            query(collection(db, 'auditLogs'), orderBy('timestamp', 'desc'), limit(maxRows))
        );
        return snap.docs.map(d => {
            const data = d.data();
            const ts   = data.timestamp?.toDate?.() ?? null;
            return {
                id:        d.id,
                action:    data.action    || '—',
                module:    data.module    || '—',
                userName:  data.userName  || '—',
                userEmail: data.userEmail || '—',
                userRole:  data.userRole  || '—',
                severity:  data.severity  || 'low',
                details:   data.details   || {},
                time:      ts ? ts.toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' }) : '—',
            };
        });
    } catch {
        return [];
    }
}
