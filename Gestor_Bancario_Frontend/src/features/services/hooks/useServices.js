import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getServices } from '../../../shared/api/services.js'

export const useServices = (initialFilters = {}) => {
  const [services, setServices] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ page: 1, limit: 10, ...initialFilters })

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const response = await getServices(filters)
      setServices(response?.data?.data || [])
      setPagination(response?.data?.pagination || null)
    } catch (error) {
      toast.error('Error al cargar servicios')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return {
    services,
    pagination,
    loading,
    filters,
    setFilters,
    refetch: fetchServices,
  }
}
