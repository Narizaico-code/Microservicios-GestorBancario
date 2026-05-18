import { Edit3, Eye, Archive } from 'lucide-react'

const statusStyles = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  DRAFT: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
  INACTIVE: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  ARCHIVED: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
}

export const ServiceCard = ({ service, isAdmin, onEdit, onDelete, onView }) => {
  const status = service?.status || 'DRAFT'
  const statusClass = statusStyles[status] || statusStyles.DRAFT

  const priceLabel = service?.price !== undefined
    ? `${service.price} ${service?.currency || 'GTQ'}`
    : 'Precio no definido'

  return (
    <article className="group relative overflow-hidden rounded-[18px] border border-white/10 bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow)]">
      <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden>
        <div className="absolute -left-12 -top-10 h-28 w-28 rounded-full bg-[#1a56db]/20 blur-2xl" />
        <div className="absolute -bottom-16 right-10 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-2xl border border-white/10 bg-[#0f172a]">
            {service?.imageUrl ? (
              <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-white/50">
                SIN IMAGEN
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
                {service?.name || 'Servicio sin nombre'}
              </h3>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusClass}`}>
                {status}
              </span>
            </div>
            <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
              {service?.category || 'Sin categoria'} · {service?.type || 'SERVICE'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
              Precio
            </p>
            <p className="text-xl font-bold text-[var(--theme-text)]">{priceLabel}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onView?.(service)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[var(--theme-text)] transition hover:bg-white/10"
            >
              <Eye size={14} />
              Ver
            </button>

            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => onEdit?.(service)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a56db]/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1a56db]/35"
                >
                  <Edit3 size={14} />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(service)}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/20"
                >
                  <Archive size={14} />
                  Archivar
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}
