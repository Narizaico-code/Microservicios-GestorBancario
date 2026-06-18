import { Edit3, PauseCircle, PlayCircle, BarChart3, Ban, Eye } from 'lucide-react'
import { formatShortDate as formatDate } from '../../../shared/utils/format.js'

const statusStyles = {
  ACTIVE: 'bg-[var(--status-emerald-bg)] text-[var(--status-emerald-text)] border-[var(--status-emerald-border)]',
  DRAFT: 'bg-[var(--status-slate-bg)] text-[var(--status-slate-text)] border-[var(--status-slate-border)]',
  SCHEDULED: 'bg-[var(--status-sky-bg)] text-[var(--status-sky-text)] border-[var(--status-sky-border)]',
  PAUSED: 'bg-[var(--status-amber-bg)] text-[var(--status-amber-text)] border-[var(--status-amber-border)]',
  EXPIRED: 'bg-[var(--status-rose-bg)] text-[var(--status-rose-text)] border-[var(--status-rose-border)]',
  CANCELLED: 'bg-[var(--status-rose-bg)] text-[var(--status-rose-text)] border-[var(--status-rose-border)]',
}

export const PromotionCard = ({ promotion, isAdmin, onEdit, onToggle, onStats, onCancel, onView }) => {
  const status = promotion?.status || 'DRAFT'
  const statusClass = statusStyles[status] || statusStyles.DRAFT

  return (
    <article className="relative overflow-hidden rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow)]">
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
          <span className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-3 py-1">
            Vigencia: {formatDate(promotion?.validFrom)} - {formatDate(promotion?.validTo)}
          </span>
          {promotion?.stackable === false ? (
            <span className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-3 py-1">No acumulable</span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onView?.(promotion)}
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-3 py-2 text-xs font-semibold text-[var(--theme-text)] transition hover:opacity-80"
          >
            <Eye size={14} />
            Ver
          </button>

          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={() => onEdit?.(promotion)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--btn-edit-border)] bg-[var(--btn-edit-bg)] px-3 py-2 text-xs font-bold text-[var(--btn-edit-text)] transition hover:opacity-80"
              >
                <Edit3 size={14} />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onToggle?.(promotion)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-3 py-2 text-xs font-semibold text-[var(--theme-text)] transition hover:opacity-80"
              >
                {status === 'ACTIVE' ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                Toggle
              </button>
              <button
                type="button"
                onClick={() => onStats?.(promotion)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-3 py-2 text-xs font-semibold text-[var(--theme-text)] transition hover:opacity-80"
              >
                <BarChart3 size={14} />
                Stats
              </button>
              <button
                type="button"
                onClick={() => onCancel?.(promotion)}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--btn-cancel-border)] bg-[var(--btn-cancel-bg)] px-3 py-2 text-xs font-bold text-[var(--btn-cancel-text)] transition hover:opacity-80"
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
