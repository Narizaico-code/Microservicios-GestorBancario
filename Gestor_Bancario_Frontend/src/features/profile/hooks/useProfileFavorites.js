import { useCallback } from 'react'
import { getFavorites } from '../../../shared/api/favorites.js'
import { useAsync } from '../../../shared/hooks/useAsync.js'

export const useProfileFavorites = (token) => {
  const fetchFavorites = useCallback(async () => {
    try {
      const response = await getFavorites()
      const favs = response?.data?.favorites || response?.favorites
      return Array.isArray(favs) ? favs : []
    } catch (err) {
      const apiError = err.response?.data?.message || err.response?.data?.error || err.message
      throw new Error(apiError || 'No fue posible cargar favoritos', { cause: err })
    }
    // token solo controla `enabled`; getFavorites() no lo recibe
  }, [])

  const { data, loading, error } = useAsync(fetchFavorites, { enabled: !!token, initialData: [] })

  return { favorites: data, loading, error }
}
