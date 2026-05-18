import { PromotionCard } from './PromotionCard.jsx'

export const PromotionList = ({ promotions = [], isAdmin, onEdit, onToggle, onStats, onCancel, onView, loading }) => {
  if (loading) {
    return (
      <div className="rounded-[18px] border border-white/10 bg-[var(--theme-surface)] p-6 text-sm text-[var(--theme-text-muted)]">
        Cargando promociones...
      </div>
    )
  }

  if (!promotions.length) {
    return (
      <div className="rounded-[18px] border border-dashed border-white/15 bg-[var(--theme-surface)] p-6 text-sm text-[var(--theme-text-muted)]">
        No hay promociones disponibles.
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {promotions.map((promo) => (
        <PromotionCard
          key={promo._id || promo.id}
          promotion={promo}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onToggle={onToggle}
          onStats={onStats}
          onCancel={onCancel}
          onView={onView}
        />
      ))}
    </div>
  )
}
