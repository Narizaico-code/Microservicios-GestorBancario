import { ServiceCard } from './ServiceCard.jsx'

export const ServiceList = ({ services = [], isAdmin, onEdit, onDelete, onView, loading }) => {
  if (loading) {
    return (
      <div className="rounded-[18px] border border-white/10 bg-[var(--theme-surface)] p-6 text-sm text-[var(--theme-text-muted)]">
        Cargando servicios...
      </div>
    )
  }

  if (!services.length) {
    return (
      <div className="rounded-[18px] border border-dashed border-white/15 bg-[var(--theme-surface)] p-6 text-sm text-[var(--theme-text-muted)]">
        No hay servicios disponibles.
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {services.map((service) => (
        <ServiceCard
          key={service._id || service.id}
          service={service}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  )
}
