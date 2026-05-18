import { useState } from 'react'
import toast from 'react-hot-toast'
import { useServices } from '../hooks/useServices.js'
import { getServiceById } from '../../../shared/api/services.js'
import { ServiceFilters } from '../components/ServiceFilters.jsx'
import { ServiceList } from '../components/ServiceList.jsx'
import { ServiceDetailModal } from '../components/ServiceDetailModal.jsx'

export const ClientServicesPage = () => {
  const { services, pagination, loading, filters, setFilters } = useServices({ sortBy: 'newest' })
  const [selected, setSelected] = useState(null)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }

  const handleView = async (service) => {
    try {
      const response = await getServiceById(service._id || service.id)
      setSelected(response.data.data || response.data)
    } catch (error) {
      const message = error?.response?.data?.message || 'No eres elegible para este servicio'
      toast.error(message)
    }
  }

  const handlePageChange = (direction) => {
    const currentPage = pagination?.currentPage || 1
    const totalPages = pagination?.totalPages || 1

    if (direction === 'prev' && currentPage > 1) {
      setFilters((prev) => ({ ...prev, page: currentPage - 1 }))
    }
    if (direction === 'next' && currentPage < totalPages) {
      setFilters((prev) => ({ ...prev, page: currentPage + 1 }))
    }
  }

  return (
    <section className="space-y-6 animate-fadeIn">
      <header className="rounded-[24px] border border-white/10 bg-[var(--theme-surface)] p-6 shadow-[var(--theme-shadow)]">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--theme-text-muted)]">Cliente</p>
        <h1 className="text-3xl font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
          Servicios disponibles
        </h1>
        <p className="mt-2 text-sm text-[var(--theme-text-muted)]">
          Explora productos y servicios activos pensados para ti.
        </p>
      </header>

      <ServiceFilters filters={filters} onChange={handleFilterChange} compact />

      <ServiceList services={services} onView={handleView} loading={loading} />

      {pagination ? (
        <div className="flex items-center justify-between rounded-[18px] border border-white/10 bg-[var(--theme-surface)] px-5 py-3 text-sm">
          <span className="text-[var(--theme-text-muted)]">
            Pagina {pagination.currentPage} de {pagination.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange('prev')}
              className="rounded-xl border border-white/10 px-3 py-1 text-[var(--theme-text-muted)]"
            >
              Anterior
            </button>
            <button
              type="button"
              onClick={() => handlePageChange('next')}
              className="rounded-xl border border-white/10 px-3 py-1 text-[var(--theme-text-muted)]"
            >
              Siguiente
            </button>
          </div>
        </div>
      ) : null}

      {selected ? (
        <ServiceDetailModal service={selected} onClose={() => setSelected(null)} />
      ) : null}
    </section>
  )
}
