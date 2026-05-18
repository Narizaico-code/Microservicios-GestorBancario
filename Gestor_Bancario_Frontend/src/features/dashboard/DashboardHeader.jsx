export const DashboardHeader = ({ title, subtitle, onLogout, userRole }) => {
  return (
    <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
          Gestor Bancario
        </p>
        <h1 className="mt-1 text-lg font-semibold text-white">{title}</h1>
        <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
          {userRole}
        </span>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}