import { useEffect, useState } from 'react'
import { getFavorites } from '../../../shared/api/favorites.js'

export const useProfileFavorites = (token) => {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

    if (token) {
      loadFavorites()
    } else {
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [token])

  return { favorites, loading, error }
}
