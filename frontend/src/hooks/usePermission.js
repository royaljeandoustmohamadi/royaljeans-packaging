import { useMemo } from 'react';
import useAuthStore from '../store/authStore';

export function usePermission(resource, action) {
  const { user } = useAuthStore();

  return useMemo(() => {
    if (!user) return false;
    if (user.role?.slug === 'admin' || user.role === 'ADMIN') return true;

    return user.permissions?.some(
      (p) =>
        (p.resource === resource || p.resource === '*') &&
        (p.action === action || p.action === '*')
    ) ?? false;
  }, [user, resource, action]);
}

export function usePermissions(permissions) {
  const { user } = useAuthStore();

  return useMemo(() => {
    const result = {};

    permissions.forEach(({ resource, action }) => {
      const key = `${resource}_${action}`;

      if (!user) {
        result[key] = false;
        return;
      }

      if (user.role?.slug === 'admin' || user.role === 'ADMIN') {
        result[key] = true;
        return;
      }

      result[key] =
        user.permissions?.some(
          (p) =>
            (p.resource === resource || p.resource === '*') &&
            (p.action === action || p.action === '*')
        ) ?? false;
    });

    return result;
  }, [user, permissions]);
}

export default usePermission;
