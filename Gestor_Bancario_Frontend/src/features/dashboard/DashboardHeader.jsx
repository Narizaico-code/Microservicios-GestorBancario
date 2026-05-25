export const DashboardHeader = ({ title, subtitle, onLogout, userRole }) => {
  return (
    <header className="flex items-center justify-between rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-5 py-4 shadow-sm backdrop-blur-xl transition-colors">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--theme-accent)]">
          Gestor Bancario
        </p>
        <h1 className="mt-1 text-lg font-bold text-[var(--theme-text)]">{title}</h1>
        <p className="mt-1 text-sm text-[var(--theme-text-muted)]">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-[var(--theme-accent)]/30 bg-[var(--theme-accent)]/10 px-4 py-2 text-sm font-semibold text-[var(--theme-accent)]">
          {userRole}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-4 py-2 text-sm font-bold text-[var(--theme-text)] transition hover:opacity-80"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}