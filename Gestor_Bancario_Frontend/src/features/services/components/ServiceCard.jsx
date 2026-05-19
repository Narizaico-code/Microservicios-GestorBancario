import { Edit3, Eye, Archive } from 'lucide-react'

const statusStyles = {
  ACTIVE: 'bg-[var(--status-emerald-bg)] text-[var(--status-emerald-text)] border-[var(--status-emerald-border)]',
  DRAFT: 'bg-[var(--status-slate-bg)] text-[var(--status-slate-text)] border-[var(--status-slate-border)]',
  INACTIVE: 'bg-[var(--status-amber-bg)] text-[var(--status-amber-text)] border-[var(--status-amber-border)]',
  ARCHIVED: 'bg-[var(--status-rose-bg)] text-[var(--status-rose-text)] border-[var(--status-rose-border)]',
}

export const ServiceCard = ({ service, isAdmin, onEdit, onDelete, onView }) => {
  const status = service?.status || 'DRAFT'
  let statusClass = statusStyles[status] || statusStyles.DRAFT

  const priceLabel = service?.price !== undefined
    ? `${service.price} ${service?.currency || 'GTQ'}`
    : 'Precio no definido'

  const hasImage = Boolean(service?.imageUrl && service.imageUrl.trim() !== '' && service.imageUrl !== 'null')

  // Si hay imagen, forzamos que el badge de estado sea más visible (modo oscuro forzado para el badge)
  if (hasImage) {
    const statusDarkOverrides = {
      ACTIVE: 'bg-emerald-500/30 text-emerald-100 border-emerald-400/50',
      DRAFT: 'bg-slate-500/30 text-slate-100 border-slate-400/50',
      INACTIVE: 'bg-amber-500/30 text-amber-100 border-amber-400/50',
      ARCHIVED: 'bg-rose-500/30 text-rose-100 border-rose-400/50',
    }
    statusClass = statusDarkOverrides[status] || statusDarkOverrides.DRAFT
  }

  return (
    <article 
      className={`group relative overflow-hidden rounded-[18px] border ${hasImage ? 'border-white/10' : 'border-[var(--theme-border)]'} p-5 shadow-[var(--theme-shadow)] min-h-[220px] flex flex-col`}
      style={{ backgroundColor: hasImage ? '#000' : 'var(--theme-surface)' }}
    >
      {/* IMAGEN DE FONDO Y OVERLAY OSCURO */}
      {hasImage ? (
        <>
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${service.imageUrl})` }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/95 via-black/60 to-black/70" />
        </>
      ) : (
        <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" aria-hidden>
          <div className="absolute -left-12 -top-10 h-28 w-28 rounded-full bg-[#1a56db]/20 blur-2xl" />
          <div className="absolute -bottom-16 right-10 h-32 w-32 rounded-full bg-emerald-400/15 blur-2xl" />
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div 
        className="relative z-10 flex h-full flex-col gap-4 justify-between"
        // Si hay imagen, anulamos las variables de texto para que todo sea blanco por encima del overlay oscuro
        style={hasImage ? { '--theme-text': '#ffffff', '--theme-text-muted': 'rgba(255, 255, 255, 0.75)' } : {}}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-xl font-bold text-[var(--theme-text)] drop-shadow-sm" style={{ fontFamily: 'var(--font-display)' }}>
              {service?.name || 'Servicio sin nombre'}
            </h3>
            <span className={`rounded-full border px-3 py-1 text-[11px] font-bold shadow-sm backdrop-blur-md ${statusClass}`}>
              {status}
            </span>
          </div>
          <p className="mt-1 text-sm font-medium text-[var(--theme-text-muted)] drop-shadow-sm">
            {service?.category || 'Sin categoria'} · {service?.type || 'SERVICE'}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--theme-text-muted)] font-bold drop-shadow-sm">
              Precio
            </p>
            <p className="text-2xl font-bold text-[var(--theme-text)] drop-shadow-md">{priceLabel}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onView?.(service)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold text-[var(--theme-text)] backdrop-blur-sm transition hover:opacity-80 ${
                hasImage 
                  ? 'border-white/20 bg-white/10 hover:bg-white/20' 
                  : 'border-[var(--theme-border)] bg-[var(--theme-surface-alt)]'
              }`}
            >
              <Eye size={14} />
              Ver
            </button>

            {isAdmin ? (
              <>
                <button
                  type="button"
                  onClick={() => onEdit?.(service)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition hover:opacity-80 backdrop-blur-sm ${
                    hasImage 
                      ? 'border-white/20 bg-[#1a56db]/40 text-white' 
                      : 'border-[var(--btn-edit-border)] bg-[var(--btn-edit-bg)] text-[var(--btn-edit-text)]'
                  }`}
                >
                  <Edit3 size={14} />
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(service)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition hover:opacity-80 backdrop-blur-sm ${
                    hasImage 
                      ? 'border-rose-500/50 bg-rose-500/40 text-rose-100' 
                      : 'border-[var(--btn-delete-border)] bg-[var(--btn-delete-bg)] text-[var(--btn-delete-text)]'
                  }`}
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
