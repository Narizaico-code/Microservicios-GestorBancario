import { ClientNavbar } from './ClientNavbar'

export const ClientDashboardContainer = ({ children }) => (
  <main style={{ minHeight: '100vh', backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text)' }}>
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px 32px' }}>
      <ClientNavbar />
      {children}
    </div>
  </main>
)
