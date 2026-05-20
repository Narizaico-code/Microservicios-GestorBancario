import { Link } from 'react-router-dom'
import { FavoritesPage } from './FavoritesPage.jsx'

export const ClientFavoritesPage = () => {
  return (
    <div className="w-full text-[color:var(--theme-text)]">
      <div className="mx-auto mb-6 flex w-full max-w-6xl justify-end">
        <Link
          to="/client"
          className="rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-5 py-2 text-sm font-semibold hover:bg-[color:var(--theme-surface-alt)] transition"
        >
          Volver al panel
        </Link>
      </div>
      <FavoritesPage />
    </div>
  )
}
