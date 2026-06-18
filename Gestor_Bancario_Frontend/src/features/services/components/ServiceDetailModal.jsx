import { Modal } from '../../../shared/components/ui/Modal.jsx'
import { formatShortDate as formatDate } from '../../../shared/utils/format.js'

export const ServiceDetailModal = ({ service, onClose }) => {
  if (!service) return null

  return (
    <Modal title="Detalle del servicio" onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="h-48 w-full overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)]">
          {service.imageUrl && service.imageUrl.trim() !== '' && service.imageUrl !== 'null' ? (
            <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[var(--theme-text-muted)]">
              SIN IMAGEN
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Nombre</p>
            <h3 className="text-2xl font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
              {service.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
              {service.category || 'Sin categoria'} · {service.type}
            </p>
          </div>

          <p className="text-sm text-[var(--theme-text)]">{service.description}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Precio</p>
              <p className="text-lg font-semibold text-[var(--theme-text)]">
                {service.price} {service.currency || 'GTQ'}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Estado</p>
              <p className="text-lg font-semibold text-[var(--theme-text)]">{service.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Vigencia</p>
              <p className="text-sm text-[var(--theme-text)]">
                {formatDate(service.validFrom)} - {formatDate(service.validTo)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Min balance</p>
              <p className="text-sm text-[var(--theme-text)]">{service.minBalance ?? 0}</p>
            </div>
          </div>

          {service.terms ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[var(--theme-text)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Terminos</p>
              <p className="mt-2">{service.terms}</p>
            </div>
          ) : null}

          {Array.isArray(service.tags) && service.tags.length ? (
            <div className="flex flex-wrap gap-2">
              {service.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--theme-text-muted)]">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Modal>
  )
}
