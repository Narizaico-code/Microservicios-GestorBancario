export const TransactionsHeader = ({ isAdmin }) => (
  <header className="flex flex-col gap-3 rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] p-4 md:flex-row md:items-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-accent)] text-white shadow-sm">
      <span className="text-3xl font-bold">↔</span>
    </div>
    <div>
      <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
        Transacciones
      </h1>
      <p className="mt-1 text-base text-[var(--theme-text-muted)]">
        {isAdmin
          ? 'Registro y creacion de depositos en cuentas de usuarios.'
          : 'Historial de tus movimientos y transferencias.'}
      </p>
    </div>
  </header>
)
