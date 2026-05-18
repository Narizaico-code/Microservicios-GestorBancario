import { useState } from 'react'
import toast from 'react-hot-toast'
import { PlusCircle } from 'lucide-react'
import { useServices } from '../hooks/useServices.js'
import { getServiceById, deleteService } from '../../../shared/api/services.js'
import { ServiceFilters } from '../components/ServiceFilters.jsx'
import { ServiceList } from '../components/ServiceList.jsx'
import { ServiceFormModal } from '../components/ServiceFormModal.jsx'
import { ServiceDetailModal } from '../components/ServiceDetailModal.jsx'

export const AdminServicesPage = () => {
  const { services, pagination, loading, filters, setFilters, refetch } = useServices({
    status: '',
    sortBy: 'newest',
  })
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }

  const handleEdit = (service) => {
    setSelected(service)
    setShowForm(true)
  }

  const handleCreate = () => {
    setSelected(null)
    setShowForm(true)
  }

  const handleView = async (service) => {
    try {
      const response = await getServiceById(service._id || service.id)
      setSelected(response.data.data || response.data)
      setShowDetail(true)
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo obtener el detalle'
      toast.error(message)
    }
  }

  const handleDelete = async (service) => {
    const confirmDelete = window.confirm('¿Archivar este servicio?')
    if (!confirmDelete) return

    try {
      await deleteService(service._id || service.id)
      toast.success('Servicio archivado')
      refetch()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo archivar'
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--theme-text-muted)]">Admin</p>
            <h1 className="text-3xl font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
              Servicios & Productos
            </h1>
            <p className="mt-2 text-sm text-[var(--theme-text-muted)]">
              Gestiona el catalogo completo, precios y campañas vigentes.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1a56db] px-4 py-2 text-sm font-semibold text-white"
          >
            <PlusCircle size={18} />
            Nuevo servicio
          </button>
        </div>
      </header>

      <ServiceFilters filters={filters} onChange={handleFilterChange} isAdmin />

      <ServiceList
        services={services}
        isAdmin
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        loading={loading}
      />

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

      {showForm ? (
        <ServiceFormModal
          service={selected}
          onClose={() => setShowForm(false)}
          onSuccess={() => refetch()}
        />
      ) : null}

      {showDetail ? (
        <ServiceDetailModal
          service={selected}
          onClose={() => setShowDetail(false)}
        />
      ) : null}
    </section>
  )
}
