import { useState } from 'react'
import toast from 'react-hot-toast'
import { PlusCircle } from 'lucide-react'
import { usePromotions } from '../hooks/usePromotions.js'
import { getPromotionById, deletePromotion } from '../../../shared/api/promotions.js'
import { PromotionFilters } from '../components/PromotionFilters.jsx'
import { PromotionList } from '../components/PromotionList.jsx'
import { PromotionFormModal } from '../components/PromotionFormModal.jsx'
import { PromotionToggleModal } from '../components/PromotionToggleModal.jsx'
import { PromotionStatsModal } from '../components/PromotionStatsModal.jsx'
import { PromotionDetailModal } from '../components/PromotionDetailModal.jsx'

export const AdminPromotionsPage = () => {
  const { promotions, pagination, loading, filters, setFilters, refetch } = usePromotions({
    status: '',
    sortBy: 'newest',
  })
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showToggle, setShowToggle] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }

  const handleCreate = () => {
    setSelected(null)
    setShowForm(true)
  }

  const handleEdit = (promotion) => {
    setSelected(promotion)
    setShowForm(true)
  }

  const handleToggle = (promotion) => {
    setSelected(promotion)
    setShowToggle(true)
  }

  const handleStats = (promotion) => {
    setSelected(promotion)
    setShowStats(true)
  }

  const handleView = async (promotion) => {
    try {
      const response = await getPromotionById(promotion._id || promotion.id)
      setSelected(response.data.data || response.data)
      setShowDetail(true)
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo obtener el detalle'
      toast.error(message)
    }
  }

  const handleCancel = async (promotion) => {
    const confirmDelete = window.confirm('¿Cancelar esta promocion?')
    if (!confirmDelete) return

    try {
      await deletePromotion(promotion._id || promotion.id)
      toast.success('Promocion cancelada')
      refetch()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo cancelar la promocion'
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
              Promociones globales
            </h1>
            <p className="mt-2 text-sm text-[var(--theme-text-muted)]">
              Controla campañas, segmentos y presupuesto de promociones.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1a56db] px-4 py-2 text-sm font-semibold text-white"
          >
            <PlusCircle size={18} />
            Nueva promocion
          </button>
        </div>
      </header>

      <PromotionFilters filters={filters} onChange={handleFilterChange} isAdmin />

      <PromotionList
        promotions={promotions}
        isAdmin
        onEdit={handleEdit}
        onToggle={handleToggle}
        onStats={handleStats}
        onCancel={handleCancel}
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
        <PromotionFormModal
          promotion={selected}
          onClose={() => setShowForm(false)}
          onSuccess={() => refetch()}
        />
      ) : null}

      {showToggle ? (
        <PromotionToggleModal
          promotion={selected}
          onClose={() => setShowToggle(false)}
          onSuccess={() => refetch()}
        />
      ) : null}

      {showStats ? (
        <PromotionStatsModal
          promotion={selected}
          onClose={() => setShowStats(false)}
        />
      ) : null}

      {showDetail ? (
        <PromotionDetailModal
          promotion={selected}
          onClose={() => setShowDetail(false)}
        />
      ) : null}
    </section>
  )
}
