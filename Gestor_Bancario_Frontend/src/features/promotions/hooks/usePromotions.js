import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getPromotions } from '../../../shared/api/promotions.js'
import { useAsync } from '../../../shared/hooks/useAsync.js'

export const usePromotions = (initialFilters = {}) => {
  const [filters, setFilters] = useState({ page: 1, limit: 10, ...initialFilters })

  const fetchPromotions = useCallback(async () => {
    try {
      const response = await getPromotions(filters)
      return response?.data || null
    } catch (err) {
      toast.error('Error al cargar promociones')
      throw err
    }
  }, [filters])

  const { data, loading, refetch } = useAsync(fetchPromotions, { initialData: null })

  const promotions = useMemo(() => data?.data || [], [data])
  const pagination = data?.pagination || null

  return {
    promotions,
    pagination,
    loading,
    filters,
    setFilters,
    refetch,
  }
}
