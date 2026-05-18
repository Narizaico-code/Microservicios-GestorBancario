import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getPromotions } from '../../../shared/api/promotions.js'

export const usePromotions = (initialFilters = {}) => {
  const [promotions, setPromotions] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ page: 1, limit: 10, ...initialFilters })

  const fetchPromotions = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getPromotions(filters)
      setPromotions(response?.data?.data || [])
      setPagination(response?.data?.pagination || null)
    } catch (error) {
      toast.error('Error al cargar promociones')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchPromotions()
  }, [fetchPromotions])

  return {
    promotions,
    pagination,
    loading,
    filters,
    setFilters,
    refetch: fetchPromotions,
  }
}
