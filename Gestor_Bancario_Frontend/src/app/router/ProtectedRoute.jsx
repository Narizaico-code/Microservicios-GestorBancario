import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore.js'

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}