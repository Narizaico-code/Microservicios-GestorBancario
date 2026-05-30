import { Heart } from 'lucide-react'

export const FavoritesSummaryCard = ({ favorites, loading, error, onSeeAll }) => (
  <article className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm text-[color:var(--theme-text)]">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <Heart className="h-5 w-5 text-rose-500" />
        <div>
          <h2 className="text-lg font-semibold">Favoritos</h2>
          <p className="text-sm text-[color:var(--theme-text-muted)]">Cuentas favoritas recientes</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSeeAll}
        className="rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-3 py-2 text-xs font-semibold text-[color:var(--theme-text)] transition hover:opacity-80"
      >
        Ver todos
      </button>
    </div>

    {loading ? <p className="mt-4 text-sm text-[color:var(--theme-text-muted)]">Cargando favoritos...</p> : null}
    {error ? (
      <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    ) : null}

    {!loading && !error ? (
      <div className="mt-4 space-y-3">
        {favorites.slice(0, 4).map((favorite, index) => (
          <div
            key={favorite._id || index}
            className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">{favorite.alias || 'Favorito'}</p>
                <p className="text-xs text-[color:var(--theme-text-muted)]">Cuenta: {favorite.cuenta}</p>
              </div>
              <span className="rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-bg)] px-3 py-1 text-xs font-semibold text-[color:var(--theme-text-muted)]">
                {favorite.tipo || 'Ahorro'}
              </span>
            </div>
          </div>
        ))}

        {!favorites.length ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--theme-border)] px-4 py-6 text-sm text-[color:var(--theme-text-muted)]">
            No hay favoritos registrados.
          </div>
        ) : null}
      </div>
    ) : null}
  </article>
)
