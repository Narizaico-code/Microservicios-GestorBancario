import { Modal } from '../../../shared/components/ui/Modal.jsx'
import { formatShortDate as formatDate } from '../../../shared/utils/format.js'

export const PromotionDetailModal = ({ promotion, onClose }) => {
  if (!promotion) return null

  return (
    <Modal title="Detalle de la promocion" onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="h-48 w-full overflow-hidden rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)]">
          {promotion.imageUrl && promotion.imageUrl.trim() !== '' && promotion.imageUrl !== 'null' ? (
            <img src={promotion.imageUrl} alt={promotion.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[var(--theme-text-muted)]">
              SIN IMAGEN
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Promocion</p>
            <h3 className="text-2xl font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
              {promotion.name}
            </h3>
            <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
              {promotion.type} · Segmento {promotion.targetSegment || 'ALL'}
            </p>
          </div>

          <p className="text-sm text-[var(--theme-text)]">{promotion.description}</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Estado</p>
              <p className="text-sm text-[var(--theme-text)]">{promotion.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Vigencia</p>
              <p className="text-sm text-[var(--theme-text)]">
                {formatDate(promotion.validFrom)} - {formatDate(promotion.validTo)}
              </p>
            </div>
          </div>

          {promotion.terms ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-[var(--theme-text)]">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Terminos</p>
              <p className="mt-2">{promotion.terms}</p>
            </div>
          ) : null}

          {Array.isArray(promotion.tags) && promotion.tags.length ? (
            <div className="flex flex-wrap gap-2">
              {promotion.tags.map((tag) => (
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
