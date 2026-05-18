import { Search } from 'lucide-react'

export const ServiceFilters = ({ filters, onChange, isAdmin, compact = false }) => {
  const handleChange = (event) => {
    const { name, value } = event.target
    onChange(name, value)
  }

  return (
    <section className="grid gap-4 rounded-[18px] border border-white/10 bg-[var(--theme-surface)] p-5 lg:grid-cols-6">
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
          <option value="SERVICE">Servicio</option>
          <option value="PRODUCT">Producto</option>
        </select>
      </div>

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
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </div>
      ) : null}

      <div>
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
          Categoria
        </label>
        <input
          name="category"
          value={filters.category || ''}
          onChange={handleChange}
          placeholder="Seguros, salud..."
          className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)]"
        />
      </div>

      {!compact ? (
        <>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
              Rango precio
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                name="minPrice"
                value={filters.minPrice || ''}
                onChange={handleChange}
                placeholder="Min"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)]"
              />
              <input
                name="maxPrice"
                value={filters.maxPrice || ''}
                onChange={handleChange}
                placeholder="Max"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
              Orden
            </label>
            <select
              name="sortBy"
              value={filters.sortBy || ''}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[var(--theme-text)]"
            >
              <option value="">Recientes</option>
              <option value="newest">Recientes</option>
              <option value="oldest">Antiguos</option>
              <option value="price_asc">Precio asc</option>
              <option value="price_desc">Precio desc</option>
              <option value="name_asc">Nombre asc</option>
            </select>
          </div>
        </>
      ) : null}
    </section>
  )
}
