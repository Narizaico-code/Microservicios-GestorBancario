import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { getServices } from '../../../shared/api/services.js'
import { useAsync } from '../../../shared/hooks/useAsync.js'

export const useServices = (initialFilters = {}) => {
  const [filters, setFilters] = useState({ page: 1, limit: 10, ...initialFilters })

  const fetchServices = useCallback(async () => {
    try {
      const response = await getServices(filters)
      return response?.data || null
    } catch (err) {
      toast.error('Error al cargar servicios')
      throw err
    }
  }, [filters])

  const { data, loading, refetch } = useAsync(fetchServices, { initialData: null })

  const services = useMemo(() => data?.data || [], [data])
  const pagination = data?.pagination || null

  return {
    services,
    pagination,
    loading,
    filters,
    setFilters,
    refetch,
  }
}
