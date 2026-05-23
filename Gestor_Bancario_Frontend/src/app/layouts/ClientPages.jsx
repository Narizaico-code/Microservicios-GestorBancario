import { Outlet } from 'react-router-dom'
import { ClientDashboardContainer } from '../../shared/components/layout/ClientDashboardContainer'
import ChatbotWidget from '../../features/chatbot/components/ChatbotWidget'

export const ClientLayout = () => (
  <ClientDashboardContainer>
    <Outlet />
    <ChatbotWidget />
  </ClientDashboardContainer>
)
