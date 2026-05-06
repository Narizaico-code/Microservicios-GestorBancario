export default function Spinner({ label = 'Cargando...' }) {
  return (
    <div className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      <span>{label}</span>
    </div>
  )
}
