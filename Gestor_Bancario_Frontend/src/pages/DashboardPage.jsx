import AdminDashboard from '../features/dashboard/AdminDashboard.jsx'
import { useAuthStore } from '../features/auth/store/authStore.js'

export default function DashboardPage() {
  const { session, logout } = useAuthStore()
  return <AdminDashboard session={session} onLogout={logout} />
}