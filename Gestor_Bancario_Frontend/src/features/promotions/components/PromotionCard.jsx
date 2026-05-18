import { Edit3, PauseCircle, PlayCircle, BarChart3, Ban, Eye } from 'lucide-react'

const statusStyles = {
  ACTIVE: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  DRAFT: 'bg-slate-500/15 text-slate-300 border-slate-400/30',
  SCHEDULED: 'bg-sky-500/15 text-sky-300 border-sky-400/30',
  PAUSED: 'bg-amber-500/15 text-amber-300 border-amber-400/30',
  EXPIRED: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
  CANCELLED: 'bg-rose-500/20 text-rose-200 border-rose-400/30',
}

const formatDate = (value) => {
  if (!value) return 'N/D'
  return new Date(value).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const PromotionCard = ({ promotion, isAdmin, onEdit, onToggle, onStats, onCancel, onView }) => {
  const status = promotion?.status || 'DRAFT'
  const statusClass = statusStyles[status] || statusStyles.DRAFT

  return (
    <article className="relative overflow-hidden rounded-[18px] border border-white/10 bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow)]">
      <div className="absolute inset-0 opacity-0 transition duration-300 hover:opacity-100" aria-hidden>
        <div className="absolute -top-12 right-6 h-28 w-28 rounded-full bg-[#1a56db]/20 blur-2xl" />
        <div className="absolute -bottom-16 left-6 h-32 w-32 rounded-full bg-emerald-400/10 blur-2xl" />
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
              {promotion?.name || 'Promocion'}
            </h3>
            <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
              {promotion?.type || 'GENERAL'} · Segmento {promotion?.targetSegment || 'ALL'}
            </p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold ${statusClass}`}>
            {status}
          </span>
        </div>

        <p className="text-sm text-[var(--theme-text-muted)]">
          {promotion?.description || 'Sin descripcion'}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--theme-text-muted)]">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Vigencia: {formatDate(promotion?.validFrom)} - {formatDate(promotion?.validTo)}
          </span>
          {promotion?.stackable === false ? (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">No acumulable</span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onView?.(promotion)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[var(--theme-text)] transition hover:bg-white/10"
          >
            <Eye size={14} />
            Ver
          </button>

          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => onEdit?.(promotion)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1a56db]/20 px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1a56db]/35"
              >
                <Edit3 size={14} />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onToggle?.(promotion)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[var(--theme-text)]"
              >
                {status === 'ACTIVE' ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                Toggle
              </button>
              <button
                type="button"
                onClick={() => onStats?.(promotion)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[var(--theme-text)]"
              >
                <BarChart3 size={14} />
                Stats
              </button>
              <button
                type="button"
                onClick={() => onCancel?.(promotion)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200"
              >
                <Ban size={14} />
                Cancelar
              </button>
            </>
          ) : null}
        </div>
      </div>
    </article>
  )
}
