import { ClientNavbar } from './ClientNavbar'

export const ClientDashboardContainer = ({ children }) => (
  <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#030b1c_100%)] text-white px-5 py-5">
    <div className="max-w-7xl mx-auto">
      <ClientNavbar />
      {children}
    </div>
  </main>
)
