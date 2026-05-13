import { Outlet } from 'react-router-dom'
import { ClientDashboardContainer } from '../../shared/components/layout/ClientDashboardContainer'

export const ClientLayout = () => (
  <ClientDashboardContainer>
    <Outlet />
  </ClientDashboardContainer>
)
