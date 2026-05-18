import { Search } from 'lucide-react'

export const PromotionFilters = ({ filters, onChange, isAdmin, compact = false }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <section className="grid gap-4 rounded-[18px] border border-white/10 bg-[var(--theme-surface)] p-5 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
          Buscar
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
          <Search size={16} className="text-[var(--theme-text-muted)]" />
          <input
            name="q"
            value={filters.q || ''}
            onChange={handleChange}
            placeholder="Nombre o descripcion"
            className="w-full bg-transparent text-sm text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-text-muted)]"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
          Tipo
        </label>
        <select
          name="type"
          value={filters.type || ''}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--theme-text)]"
        >
          <option value="">Todos</option>
          <option value="CASHBACK">CASHBACK</option>
          <option value="RATE_REDUCTION">RATE_REDUCTION</option>
          <option value="FEE_WAIVER">FEE_WAIVER</option>
          <option value="BONUS_POINTS">BONUS_POINTS</option>
          <option value="GENERAL">GENERAL</option>
        </select>
      </div>

      {!compact ? (
        <>
          {isAdmin ? (
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
                Estado
              </label>
              <select
                name="status"
                value={filters.status || ''}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--theme-text)]"
              >
                <option value="">Todos</option>
                <option value="DRAFT">DRAFT</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="PAUSED">PAUSED</option>
                <option value="EXPIRED">EXPIRED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          ) : null}

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
              Segmento
            </label>
            <select
              name="targetSegment"
              value={filters.targetSegment || ''}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--theme-text)]"
            >
              <option value="">Todos</option>
              <option value="ALL">ALL</option>
              <option value="VIP">VIP</option>
              <option value="NEW">NEW</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
        </>
      ) : null}
    </section>
  )
}
