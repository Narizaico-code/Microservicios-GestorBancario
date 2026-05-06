import {DashboardContainer} from "../../shared/components/layout/DashboardContainer.jsx"
import { useAuthStore } from '../../features/auth/store/authStore.js'
import { Outlet } from "react-router-dom"

export const DashboardPage = () => {
  const { session } = useAuthStore()

  return (
    
    <DashboardContainer>
      <Outlet />
    </DashboardContainer>
  )
}

