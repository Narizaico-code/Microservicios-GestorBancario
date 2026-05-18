import { useState } from 'react'
import toast from 'react-hot-toast'
import { usePromotions } from '../hooks/usePromotions.js'
import { getPromotionById } from '../../../shared/api/promotions.js'
import { PromotionFilters } from '../components/PromotionFilters.jsx'
import { PromotionList } from '../components/PromotionList.jsx'
import { PromotionDetailModal } from '../components/PromotionDetailModal.jsx'

export const ClientPromotionsPage = () => {
  const { promotions, pagination, loading, filters, setFilters } = usePromotions({ sortBy: 'newest' })
  const [selected, setSelected] = useState(null)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1,
    }))
  }

  const handleView = async (promotion) => {
    try {
      const response = await getPromotionById(promotion._id || promotion.id)
      setSelected(response.data.data || response.data)
    } catch (error) {
      const message = error?.response?.data?.message || 'No eres elegible para esta promocion'
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
          Promociones activas
        </h1>
        <p className="mt-2 text-sm text-[var(--theme-text-muted)]">
          Descubre beneficios vigentes y personalizados para ti.
        </p>
      </header>

      <PromotionFilters filters={filters} onChange={handleFilterChange} compact />

      <PromotionList promotions={promotions} onView={handleView} loading={loading} />

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
        <PromotionDetailModal promotion={selected} onClose={() => setSelected(null)} />
      ) : null}
    </section>
  )
}
