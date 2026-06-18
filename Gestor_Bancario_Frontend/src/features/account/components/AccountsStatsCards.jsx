const StatCard = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
    <p className="text-sm font-semibold text-[color:var(--theme-text-muted)] uppercase">{label}</p>
    <p className="mt-2 text-4xl font-bold">{value}</p>
    {hint ? <p className="mt-1 text-xs text-[color:var(--theme-text-muted)]">{hint}</p> : null}
  </div>
)

export const AccountsStatsCards = ({ total, active, totalBalance }) => {
  const formatGTQ = (value) => value.toLocaleString('es-GT', { maximumFractionDigits: 2 })

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard label="Total de Cuentas" value={total} hint={`${active} activas`} />
      <StatCard label="Saldo Total (GTQ)" value={formatGTQ(totalBalance)} />
      <StatCard label="Promedio por Cuenta" value={total > 0 ? formatGTQ(totalBalance / total) : '0'} />
    </div>
  )
}
