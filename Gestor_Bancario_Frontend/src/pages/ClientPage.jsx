import { ClientDashboard } from '../features/dashboard/ClientDashboard.jsx'
import { useAuthStore } from '../features/auth/store/authStore.js'

export const ClientPage = () => {
  const { session } = useAuthStore()
  return <ClientDashboard session={session} />
}