import { Link } from 'react-router-dom'
import { ProfilePage } from './ProfilePage.jsx'

export const ClientProfilePage = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] px-4 py-8">
      <ProfilePage />
    </main>
  )
}
