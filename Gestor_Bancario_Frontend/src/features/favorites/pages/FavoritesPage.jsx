import { Heart, Plus, Trash2, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

export const FavoritesPage = () => {
  const {
    filteredFavorites,
    loading,
    error,
    form,
    submitting,
    submitError,
    message,
    search,
    actionId,
    handleChange,
    handleSubmit,
    handleDelete,
    setSearch,
  } = useFavorites()

  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-[color:var(--theme-text)]">
      <div className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Heart className="h-7 w-7 text-rose-500" />
          <h1 className="text-2xl font-bold">Favoritos</h1>
        </div>
        <p className="mt-3 text-sm text-[color:var(--theme-text-muted)]">
          Administra tus cuentas favoritas para pagos rapidos.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-[color:var(--theme-accent)]" />
            <h2 className="text-lg font-semibold">Agregar favorito</h2>
          </div>
          <p className="mt-2 text-sm text-[color:var(--theme-text-muted)]">
            Guarda una cuenta para usarla mas rapido.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              name="cuenta"
              value={form.cuenta}
              onChange={handleChange}
              placeholder="Numero de cuenta"
              className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 placeholder:text-[color:var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]/50"
            />
            <input
              name="alias"
              value={form.alias}
              onChange={handleChange}
              placeholder="Alias"
              className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 placeholder:text-[color:var(--theme-text-muted)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]/50"
            />
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]/50"
            >
              <option value="AHORRO">Ahorro</option>
              <option value="MONETARIA">Monetaria</option>
            </select>

            {submitError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </div>
            ) : null}
            {message ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[color:var(--theme-accent)] px-4 py-3 text-white hover:bg-[color:var(--theme-accent-strong)] transition-colors"
            >
              {submitting ? 'Guardando...' : 'Guardar favorito'}
            </button>
          </form>
        </article>

        <article className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Tus favoritos</h2>
              <p className="text-sm text-[color:var(--theme-text-muted)]">Listado de cuentas guardadas</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-3 py-2">
              <Search className="h-4 w-4 text-[color:var(--theme-text-muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar"
                className="text-sm bg-transparent placeholder:text-[color:var(--theme-text-muted)] outline-none w-full"
              />
            </div>
          </div>

          {loading ? <p className="mt-4 text-sm text-[color:var(--theme-text-muted)]">Cargando favoritos...</p> : null}
          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {!loading && !error ? (
            <div className="mt-4 space-y-4">
              {filteredFavorites.map((item, index) => (
                <div
                  key={item._id || index}
                  className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4 transition hover:border-[color:var(--theme-accent)]"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{item.alias}</p>
                      <p className="text-xs text-[color:var(--theme-text-muted)] mt-1">Cuenta: {item.cuenta}</p>
                    </div>
                    <span className="rounded-full bg-[color:var(--theme-bg)] border border-[color:var(--theme-border)] px-3 py-1 text-xs font-semibold text-[color:var(--theme-text-muted)]">
                      {item.tipo}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-[color:var(--theme-text-muted)]">
                      Creado: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-GT') : 'N/D'}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          navigate('../transacciones', {
                            state: { cuentaDestino: item.cuenta },
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-xs font-semibold text-[color:var(--theme-text)] transition hover:bg-[color:var(--theme-surface-alt)]"
                      >
                        ↔ Transferir
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        disabled={actionId === item._id}
                        className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:opacity-70"
                      >
                        <Trash2 className="h-4 w-4" />
                        {actionId === item._id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {!filteredFavorites.length ? (
                <div className="rounded-2xl border border-dashed border-[color:var(--theme-border)] px-4 py-6 text-sm text-center text-[color:var(--theme-text-muted)]">
                  No hay favoritos registrados.
                </div>
              ) : null}
            </div>
          ) : null}
        </article>
      </section>
    </div>
  )
}
