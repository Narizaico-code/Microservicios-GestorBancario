import { Link } from 'react-router-dom'
import { Download, PlusCircle, Package, Tag } from 'lucide-react'

export const AccountsToolbar = ({ onCreate, onDownloadReport }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-3xl font-bold">Gestión de Cuentas</h1>
      <p className="mt-2 text-sm text-[color:var(--theme-text-muted)]">
        Administra el estado, saldo y solicitudes de cuentas.
      </p>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <Link
        to="/dashboard/promociones"
        className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--theme-text)] transition hover:bg-[color:var(--theme-surface-alt)]"
      >
        <Tag size={16} />
        Promociones
      </Link>
      <Link
        to="/dashboard/servicios"
        className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--theme-text)] transition hover:bg-[color:var(--theme-surface-alt)]"
      >
        <Package size={16} />
        Servicios
      </Link>
      <button
        onClick={onCreate}
        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 transition"
      >
        <PlusCircle size={20} />
        Crear cuenta
      </button>
      <button
        onClick={onDownloadReport}
        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition"
      >
        <Download size={20} />
        Descargar Reporte
      </button>
    </div>
  </div>
)
