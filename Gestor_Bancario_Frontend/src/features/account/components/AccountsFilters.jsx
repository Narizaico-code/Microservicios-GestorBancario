import { Search, Filter } from 'lucide-react'
import { CURRENCIES } from '../../../shared/constants/index.js'

const SELECT_CLASS =
  'w-full rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-[color:var(--theme-text)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200'

export const AccountsFilters = ({ filters }) => {
  const {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    currencyFilter,
    setCurrencyFilter,
    sortBy,
    setSortBy,
  } = filters

  return (
    <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Filter size={20} className="text-[color:var(--theme-text-muted)]" />
        <h2 className="text-lg font-semibold">Filtros y Búsqueda</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">
            Buscar por número de cuenta o usuario
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-[color:var(--theme-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ej: 1234567890 o usuario@email.com"
              className="w-full rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] py-2 pl-10 pr-4 text-[color:var(--theme-text)] placeholder:text-[color:var(--theme-text-muted)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">Estado</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={SELECT_CLASS}>
              <option value="ALL">Todos</option>
              <option value="ACTIVE">Activas</option>
              <option value="INACTIVE">Inactivas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">Tipo</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={SELECT_CLASS}>
              <option value="ALL">Todos</option>
              <option value="AHORRO">Ahorro</option>
              <option value="MONETARIA">Monetaria</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">Moneda</label>
            <select value={currencyFilter} onChange={(e) => setCurrencyFilter(e.target.value)} className={SELECT_CLASS}>
              <option value="ALL">Todas</option>
              {CURRENCIES.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">Ordenar</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={SELECT_CLASS}>
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="highest-balance">Mayor saldo</option>
              <option value="lowest-balance">Menor saldo</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
