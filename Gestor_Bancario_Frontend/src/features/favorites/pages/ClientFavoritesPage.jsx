import { Link } from 'react-router-dom'
import { FavoritesPage } from './FavoritesPage.jsx'

export const ClientFavoritesPage = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] px-4 py-8">
      <div className="mx-auto mb-6 flex w-full max-w-6xl justify-end">
        <Link
          to="/client"
          className="rounded-full border border-cyan-200/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          Volver al panel
        </Link>
      </div>
      <FavoritesPage />
    </main>
  )
}
