export const TodaySummaryCard = ({ summary, onRefresh }) => (
  <div className="rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 shadow-[var(--theme-shadow)]">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-extrabold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
        Resumen del dia
      </h3>
      <div className="rounded-xl border border-[var(--theme-border)] p-2">📅</div>
    </div>
    <p className="mt-1 text-xs text-[var(--theme-text-muted)]">{new Date().toLocaleDateString('es-GT')}</p>

    <div className="mt-4 grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-[var(--theme-surface-alt)] p-3">
        <p className="text-xs text-[var(--theme-text-muted)]">Depositos</p>
        <p className="mt-1 text-2xl font-bold text-[var(--status-emerald-text)]">Q{summary.deposits.toFixed(2)}</p>
        <p className="text-xs text-[var(--theme-text-muted)]">{summary.depositsCount} transacciones</p>
      </div>
      <div className="rounded-xl bg-[var(--theme-surface-alt)] p-3">
        <p className="text-xs text-[var(--theme-text-muted)]">Retiros / Pagos</p>
        <p className="mt-1 text-2xl font-bold text-[var(--status-rose-text)]">Q{summary.withdrawals.toFixed(2)}</p>
        <p className="text-xs text-[var(--theme-text-muted)]">{summary.withdrawalsCount} transacciones</p>
      </div>
    </div>

    <button
      type="button"
      onClick={onRefresh}
      className="mt-4 h-11 w-full rounded-xl bg-[var(--theme-accent)] px-4 text-left text-sm font-bold text-white transition hover:bg-[var(--theme-accent-strong)]"
    >
      Actualizar resumen
    </button>
  </div>
)
