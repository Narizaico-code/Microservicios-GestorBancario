import { CURRENCIES } from '../../../shared/constants/index.js'

const FIELD_CLASS =
  'h-12 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-4 text-sm text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-accent)]'

export const TransactionForm = ({ isAdmin, accounts, formValues, savingTransaction, onChange, onSubmit, onReset }) => (
  <article className="rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow)]">
    <h2 className="text-3xl font-extrabold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
      {isAdmin ? 'Nuevo deposito' : 'Nueva transferencia'}
    </h2>
    <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
      {isAdmin
        ? 'Completa los datos para registrar un deposito en la cuenta indicada.'
        : 'Transfiere fondos desde tu cuenta hacia otra cuenta destino.'}
    </p>

    <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
      {!isAdmin && (
        <label className="space-y-2" title="Tu cuenta desde donde saldrá el dinero">
          <span className="text-sm font-semibold">Cuenta origen (Tu cuenta)</span>
          <select name="cuentaOrigen" value={formValues.cuentaOrigen} onChange={onChange} className={FIELD_CLASS}>
            <option value="" disabled>
              Selecciona tu cuenta
            </option>
            {accounts.map((account) => (
              <option key={account.numeroCuenta} value={account.numeroCuenta}>
                {account.numeroCuenta} - Q{account.saldo?.toFixed(2) || '0.00'}
              </option>
            ))}
          </select>
        </label>
      )}

      <label
        className="space-y-2"
        title={isAdmin ? 'Número de cuenta donde se realizará el depósito' : 'Número de cuenta a la que deseas transferir'}
      >
        <span className="text-sm font-semibold">Cuenta destino</span>
        <input
          type="text"
          placeholder="Ej. 1000000001"
          name="cuentaDestino"
          value={formValues.cuentaDestino}
          onChange={onChange}
          list="cuentas-destino"
          className={FIELD_CLASS}
        />
        {isAdmin && (
          <datalist id="cuentas-destino">
            {accounts.map((account) => (
              <option key={account.numeroCuenta} value={account.numeroCuenta} />
            ))}
          </datalist>
        )}
      </label>

      <label className="space-y-2" title="Cantidad de dinero a transferir o depositar">
        <span className="text-sm font-semibold">Monto</span>
        <input
          type="number"
          min="0"
          placeholder="Ej. 100.00"
          name="monto"
          value={formValues.monto}
          onChange={onChange}
          className={FIELD_CLASS}
        />
      </label>

      <label className="space-y-2" title="Divisa de la transacción">
        <span className="text-sm font-semibold">Moneda</span>
        <select name="moneda" value={formValues.moneda} onChange={onChange} className={FIELD_CLASS}>
          {CURRENCIES.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2" title="El tipo de transacción que se realizará">
        <span className="text-sm font-semibold">Tipo de transaccion</span>
        <div className="flex h-12 items-center justify-between rounded-xl border border-[var(--theme-accent)] bg-[var(--theme-accent)]/10 px-4 text-sm font-semibold text-[var(--theme-accent)]">
          <span>{isAdmin ? 'Deposito' : 'Transferencia'}</span>
          <span className="text-lg">⌄</span>
        </div>
      </label>

      <label className="space-y-2 md:col-span-2">
        <span className="text-sm font-semibold">Descripcion</span>
        <textarea
          rows="3"
          placeholder={isAdmin ? 'Motivo del deposito...' : 'Motivo de la transferencia...'}
          name="descripcion"
          value={formValues.descripcion}
          onChange={onChange}
          className="w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-4 py-3 text-sm text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-accent)]"
        />
      </label>

      <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
        <button
          type="submit"
          disabled={savingTransaction}
          className="h-11 rounded-xl bg-[var(--theme-accent)] px-7 text-sm font-bold text-white transition hover:bg-[var(--theme-accent-strong)] disabled:opacity-50"
        >
          {savingTransaction ? 'Procesando...' : isAdmin ? 'Guardar deposito' : 'Realizar transferencia'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="h-11 rounded-xl border border-[var(--status-rose-border)] px-7 text-sm font-bold text-[var(--status-rose-text)] transition hover:bg-[var(--status-rose-bg)]"
        >
          Limpiar
        </button>
      </div>
    </form>
  </article>
)
