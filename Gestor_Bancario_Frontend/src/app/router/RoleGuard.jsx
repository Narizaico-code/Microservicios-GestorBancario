import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore.js'

export const RoleGuard = ({ allowedRoles = [] }) => {
  const { session } = useAuthStore()

  if (!session?.token) {
    return <Navigate to="/auth" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(session.user?.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <Outlet />
}