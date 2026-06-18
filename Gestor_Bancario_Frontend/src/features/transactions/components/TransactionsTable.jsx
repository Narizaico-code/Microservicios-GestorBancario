import { formatTxnDate, formatAmount, normalizeTypeLabel } from '../utils/transactionFormat.js'

const COLUMNS = ['Fecha', 'Tipo', 'Cuenta destino', 'Descripcion', 'Monto', 'Usuario', 'Acciones']

const TransactionRow = ({ transaction, userName }) => {
  const isDeposit = transaction.tipoTransaccion === 'DEPOSITO'
  return (
    <tr className="border-t border-[var(--theme-border)]">
      <td className="px-4 py-3">{formatTxnDate(transaction.createdAt)}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            isDeposit
              ? 'bg-[var(--status-emerald-bg)] text-[var(--status-emerald-text)] border border-[var(--status-emerald-border)]'
              : 'bg-[var(--status-rose-bg)] text-[var(--status-rose-text)] border border-[var(--status-rose-border)]'
          }`}
        >
          {normalizeTypeLabel(transaction.tipoTransaccion)}
        </span>
      </td>
      <td className="px-4 py-3">{transaction.cuentaDestino || transaction.cuentaOrigen || '-'}</td>
      <td className="px-4 py-3">{transaction.descripcion || 'Sin descripcion'}</td>
      <td
        className={`px-4 py-3 font-bold ${
          isDeposit ? 'text-[var(--status-emerald-text)]' : 'text-[var(--status-rose-text)]'
        }`}
      >
        {formatAmount(transaction.monto, transaction.tipoTransaccion)}
      </td>
      <td className="px-4 py-3">{userName}</td>
      <td className="px-4 py-3 text-sm">{transaction.estado || 'COMPLETADA'}</td>
    </tr>
  )
}

export const TransactionsTable = ({ transactions, loading, onRefresh, userName }) => (
  <article className="overflow-hidden rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow)]">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border)] px-4 py-4">
      <h3 className="text-2xl font-extrabold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
        Transacciones recientes
      </h3>
      <button type="button" onClick={onRefresh} className="text-sm font-bold text-[var(--theme-accent)] transition hover:opacity-80">
        {loading ? 'Cargando...' : 'Actualizar'}
      </button>
    </header>

    <div className="overflow-x-auto">
      <table className="min-w-[940px] w-full text-left text-sm">
        <thead className="bg-[var(--theme-surface-alt)] text-xs uppercase tracking-wide text-[var(--theme-text-muted)]">
          <tr>
            {COLUMNS.map((column) => (
              <th key={column} className="px-4 py-3">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 && (
            <tr>
              <td colSpan="7" className="px-4 py-8 text-center text-[var(--theme-text-muted)]">
                No hay transacciones registradas.
              </td>
            </tr>
          )}

          {transactions.map((transaction, index) => (
            <TransactionRow
              key={transaction.id || transaction._id || `${transaction.createdAt}-${transaction.cuentaDestino}` || index}
              transaction={transaction}
              userName={userName}
            />
          ))}
        </tbody>
      </table>
    </div>
  </article>
)
