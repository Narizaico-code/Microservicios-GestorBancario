import { formatCurrency } from '../../../shared/utils/format.js'

export const AccountsSummaryCard = ({
  accounts,
  loading,
  error,
  selectedCurrency,
  availableCurrencies,
  onCurrencyChange,
  totalBalance,
  missingCurrencies,
  ratesLoading,
  ratesError,
}) => (
  <article className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm text-[color:var(--theme-text)]">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-lg font-semibold">Resumen de cuentas</h2>
        <p className="text-sm text-[color:var(--theme-text-muted)]">Informacion de tus productos activos</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-3 py-1 text-xs font-semibold text-[color:var(--theme-text-muted)]">
          {accounts.length} cuentas
        </span>
        <select
          value={selectedCurrency}
          onChange={(event) => onCurrencyChange(event.target.value)}
          className="rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-3 py-2 text-xs font-semibold text-[color:var(--theme-text)] outline-none"
        >
          {availableCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </div>
    </div>

    {loading ? (
      <p className="mt-4 text-sm text-[color:var(--theme-text-muted)]">Cargando cuentas...</p>
    ) : null}
    {error ? (
      <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
        {error}
      </div>
    ) : null}

    {!loading && !error ? (
      <>
        <div className="mt-4 rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-4">
          <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--theme-text-muted)]">
            Saldo total en {selectedCurrency}
          </p>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(totalBalance, selectedCurrency)}
          </p>
          {ratesLoading ? (
            <p className="mt-2 text-xs text-[color:var(--theme-text-muted)]">Actualizando tasas...</p>
          ) : null}
          {ratesError ? (
            <p className="mt-2 text-xs text-rose-600">{ratesError}</p>
          ) : null}
          {missingCurrencies.length ? (
            <p className="mt-2 text-xs text-amber-600">
              No hay tasas para: {missingCurrencies.join(', ')}
            </p>
          ) : null}
        </div>

        <div className="mt-4 space-y-3">
          {accounts.slice(0, 4).map((account, index) => (
            <div
              key={account._id || account.id || index}
              className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3"
            >
              <p className="text-sm font-semibold">
                {account.tipoCuenta || 'Cuenta'}
              </p>
              <p className="text-xs text-[color:var(--theme-text-muted)]">
                {account.numeroCuenta || 'Sin numero'}
              </p>
              <p className="mt-2 text-sm text-[color:var(--theme-text)]">
                {formatCurrency(account.saldo, account.moneda || selectedCurrency)}
              </p>
            </div>
          ))}
          {!accounts.length ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--theme-border)] px-4 py-6 text-sm text-[color:var(--theme-text-muted)]">
              No hay cuentas visibles todavia.
            </div>
          ) : null}
        </div>
      </>
    ) : null}
  </article>
)
