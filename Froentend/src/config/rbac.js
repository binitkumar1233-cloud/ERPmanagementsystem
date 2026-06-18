// Role hierarchy: higher index = higher privilege
export const ROLES = {
    SUPER_ADMIN:   'SuperAdmin',
    ADMINISTRATOR: 'Administrator',
    TEACHER:       'Teacher',
    STAFF:         'Staff',
    STUDENT:       'Student',
};

const ROLE_HIERARCHY = [
    ROLES.STUDENT,
    ROLES.STAFF,
    ROLES.TEACHER,
    ROLES.ADMINISTRATOR,
    ROLES.SUPER_ADMIN,
];

export const PERMISSIONS = {
    VIEW_STUDENTS:      'view_students',
    MANAGE_STUDENTS:    'manage_students',
    VIEW_TEACHERS:      'view_teachers',
    MANAGE_TEACHERS:    'manage_teachers',
    VIEW_COURSES:       'view_courses',
    MANAGE_COURSES:     'manage_courses',
    VIEW_FEES:          'view_fees',
    MANAGE_FEES:        'manage_fees',
    VIEW_RESULTS:       'view_results',
    MANAGE_EXAMS:       'manage_exams',
    VIEW_ATTENDANCE:    'view_attendance',
    MANAGE_ATTENDANCE:  'manage_attendance',
    VIEW_ADMIN_PANEL:   'view_admin_panel',
    MANAGE_SETTINGS:    'manage_settings',
    VIEW_AUDIT_LOG:     'view_audit_log',
    MANAGE_ADMISSIONS:  'manage_admissions',
    VIEW_OWN_DATA:      'view_own_data',
};

const ROLE_PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

    [ROLES.ADMINISTRATOR]: [
        PERMISSIONS.VIEW_STUDENTS,    PERMISSIONS.MANAGE_STUDENTS,
        PERMISSIONS.VIEW_TEACHERS,    PERMISSIONS.MANAGE_TEACHERS,
        PERMISSIONS.VIEW_COURSES,     PERMISSIONS.MANAGE_COURSES,
        PERMISSIONS.VIEW_FEES,        PERMISSIONS.MANAGE_FEES,
        PERMISSIONS.VIEW_RESULTS,     PERMISSIONS.MANAGE_EXAMS,
        PERMISSIONS.VIEW_ATTENDANCE,  PERMISSIONS.MANAGE_ATTENDANCE,
        PERMISSIONS.MANAGE_SETTINGS,  PERMISSIONS.MANAGE_ADMISSIONS,
        PERMISSIONS.VIEW_OWN_DATA,
    ],

    [ROLES.TEACHER]: [
        PERMISSIONS.VIEW_STUDENTS,
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.VIEW_RESULTS,     PERMISSIONS.MANAGE_EXAMS,
        PERMISSIONS.VIEW_ATTENDANCE,  PERMISSIONS.MANAGE_ATTENDANCE,
        PERMISSIONS.VIEW_OWN_DATA,
    ],

    [ROLES.STAFF]: [
        PERMISSIONS.VIEW_STUDENTS,
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.VIEW_FEES,
        PERMISSIONS.VIEW_ATTENDANCE,
        PERMISSIONS.VIEW_OWN_DATA,
    ],

    [ROLES.STUDENT]: [
        PERMISSIONS.VIEW_OWN_DATA,
        PERMISSIONS.VIEW_COURSES,
        PERMISSIONS.VIEW_RESULTS,
    ],
};

// Normalize legacy role strings from the backend/Firebase fallback
const ROLE_ALIAS = {
    'super admin':     ROLES.SUPER_ADMIN,
    'superadmin':      ROLES.SUPER_ADMIN,
    'administrator':   ROLES.ADMINISTRATOR,
    'admin':           ROLES.ADMINISTRATOR,
    'teacher':         ROLES.TEACHER,
    'staff':           ROLES.STAFF,
    'editor':          ROLES.ADMINISTRATOR,  // legacy AdminPanel role
    'viewer':          ROLES.STAFF,          // legacy AdminPanel role
    'student':         ROLES.STUDENT,
};

export function normalizeRole(raw) {
    if (!raw) return null;
    return ROLE_ALIAS[raw.toLowerCase()] || raw;
}

export function hasPermission(userRole, permission) {
    const normalized = normalizeRole(userRole);
    return (ROLE_PERMISSIONS[normalized] || []).includes(permission);
}

// Returns true if userRole is at least as privileged as requiredRole
export function hasMinRole(userRole, requiredRole) {
    const normalized = normalizeRole(userRole);
    const userIdx     = ROLE_HIERARCHY.indexOf(normalized);
    const requiredIdx = ROLE_HIERARCHY.indexOf(requiredRole);
    if (userIdx === -1 || requiredIdx === -1) return false;
    return userIdx >= requiredIdx;
}

export function getRolePermissions(role) {
    return ROLE_PERMISSIONS[normalizeRole(role)] || [];
}

export const ROLE_LABELS = {
    [ROLES.SUPER_ADMIN]:   { label: 'Super Admin',   color: '#6d28d9', bg: '#ede9fe' },
    [ROLES.ADMINISTRATOR]: { label: 'Administrator', color: '#1e40af', bg: '#dbeafe' },
    [ROLES.TEACHER]:       { label: 'Teacher',       color: '#065f46', bg: '#d1fae5' },
    [ROLES.STAFF]:         { label: 'Staff',         color: '#92400e', bg: '#fef3c7' },
    [ROLES.STUDENT]:       { label: 'Student',       color: '#1e3a8a', bg: '#eff6ff' },
};
