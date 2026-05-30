import { useEffect, useMemo, useState } from 'react'
import { addFavorite, deleteFavorite, getFavorites } from '../../../shared/api/favorites'
import { getAllAccountsAdmin } from '../../../shared/api/account'

const initialForm = {
  cuenta: '',
  alias: '',
  tipo: 'AHORRO',
}

const ALLOWED_TYPES = ['AHORRO', 'MONETARIA']

async function validateAccountExists(cuenta, tipo) {
  const normalizedCuenta = String(cuenta || '').trim()
  const normalizedTipo = String(tipo || '').trim().toUpperCase()

  if (!normalizedCuenta) {
    throw new Error('El numero de cuenta es requerido')
  }

  if (!ALLOWED_TYPES.includes(normalizedTipo)) {
    throw new Error('El tipo de cuenta es invalido')
  }

  // Traemos un lote amplio para validar la cuenta; el backend filtrara por rol
  const response = await getAllAccountsAdmin(1, 5000, 'all')
  const accounts = response?.data?.data || []

  const match = accounts.find(
    (account) =>
      String(account?.numeroCuenta || '').trim() === normalizedCuenta &&
      String(account?.tipoCuenta || '').trim().toUpperCase() === normalizedTipo &&
      account?.estado !== false
  )

  if (!match) {
    throw new Error('La cuenta no existe o no coincide con el tipo seleccionado')
  }

  return match
}

export const useFavorites = () => {
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

      await validateAccountExists(form.cuenta, form.tipo)

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

  return {
    favorites,
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
  }
}
