import { useEffect, useMemo, useState } from 'react'
import { Heart, Plus, Trash2, Search } from 'lucide-react'
import { addFavorite, deleteFavorite, getFavorites } from '../../../shared/api/favorites.js'

const initialForm = {
  cuenta: '',
  alias: '',
  tipo: 'AHORRO',
}

export const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')
  const [actionId, setActionId] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadFavorites = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getFavorites()
        if (!isMounted) return
        const favs = response?.data?.favorites || response?.favorites
        setFavorites(Array.isArray(favs) ? favs : [])
      } catch (err) {
        if (!isMounted) return
        const apiError = err.response?.data?.message || err.response?.data?.error || err.message
        setError(apiError || 'No fue posible cargar favoritos')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadFavorites()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredFavorites = useMemo(() => {
    const normalized = search.trim().toLowerCase()
    if (!normalized) return favorites

    return favorites.filter((item) => {
      return (
        String(item.cuenta || '').toLowerCase().includes(normalized) ||
        String(item.alias || '').toLowerCase().includes(normalized) ||
        String(item.tipo || '').toLowerCase().includes(normalized)
      )
    })
  }, [favorites, search])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setMessage('')

    if (!form.cuenta.trim() || !form.alias.trim()) {
      setSubmitError('Completa cuenta y alias para guardar')
      return
    }

    try {
      setSubmitting(true)
      const response = await addFavorite({
        cuenta: form.cuenta.trim(),
        alias: form.alias.trim(),
        tipo: form.tipo,
      })

      const favorite = response?.data?.favorite || response?.favorite
      if (favorite) {
        setFavorites((current) => [favorite, ...current])
      }

      setForm(initialForm)
      setMessage('Favorito agregado')
    } catch (err) {
      const apiError = err.response?.data?.message || err.response?.data?.error || err.message
      setSubmitError(apiError || 'No fue posible agregar el favorito')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (favoriteId) => {
    try {
      setActionId(favoriteId)
      setError('')
      await deleteFavorite(favoriteId)
      setFavorites((current) => current.filter((item) => item._id !== favoriteId))
    } catch (err) {
      const apiError = err.response?.data?.message || err.response?.data?.error || err.message
      setError(apiError || 'No fue posible eliminar el favorito')
    } finally {
      setActionId('')
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <Heart className="h-7 w-7 text-rose-200" />
          <h1 className="text-2xl font-bold">Favoritos</h1>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Administra tus cuentas favoritas para pagos rapidos.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Plus className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Agregar favorito</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Guarda una cuenta para usarla mas rapido.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <input
              name="cuenta"
              value={form.cuenta}
              onChange={handleChange}
              placeholder="Numero de cuenta"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
            />
            <input
              name="alias"
              value={form.alias}
              onChange={handleChange}
              placeholder="Alias"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
            />
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900"
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
              className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-white"
            >
              {submitting ? 'Guardando...' : 'Guardar favorito'}
            </button>
          </form>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Tus favoritos</h2>
              <p className="text-sm text-slate-500">Listado de cuentas guardadas</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar"
                className="text-sm text-slate-900 placeholder-slate-400 outline-none"
              />
            </div>
          </div>

          {loading ? <p className="mt-4 text-sm text-slate-500">Cargando favoritos...</p> : null}
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
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.alias}</p>
                      <p className="text-xs text-slate-500">Cuenta: {item.cuenta}</p>
                    </div>
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {item.tipo}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Creado: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-GT') : 'N/D'}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id)}
                      disabled={actionId === item._id}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-70"
                    >
                      <Trash2 className="h-4 w-4" />
                      {actionId === item._id ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </div>
                </div>
              ))}

              {!filteredFavorites.length ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
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
