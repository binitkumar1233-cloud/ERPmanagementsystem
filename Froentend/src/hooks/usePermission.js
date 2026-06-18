import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { hasPermission, hasMinRole, normalizeRole, ROLES } from '../config/rbac.js';

export function usePermission() {
    const { user } = useContext(AuthContext);
    const rawRole = user?.role ?? null;
    const role    = normalizeRole(rawRole);

    return {
        role,
        rawRole,
        // Check a specific fine-grained permission
        can: (permission) => !!role && hasPermission(role, permission),
        // Check if user is at least a given tier
        isAtLeast: (minRole) => !!role && hasMinRole(role, minRole),
        // Convenience shortcuts
        isAdmin:      () => !!role && hasMinRole(role, ROLES.ADMINISTRATOR),
        isSuperAdmin: () => role === ROLES.SUPER_ADMIN,
        isTeacher:    () => !!role && hasMinRole(role, ROLES.TEACHER),
        isStudent:    () => role === ROLES.STUDENT,
    };
}
