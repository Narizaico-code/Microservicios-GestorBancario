import { X, CheckCircle, XCircle } from "lucide-react"

export const AdminRequestDetailsModal = ({ 
  isOpen, 
  onClose, 
  request, 
  user, 
  onApprove, 
  onDeny, 
  actionLoadingId 
}) => {
  if (!isOpen || !request) return null

  const isProcessing = actionLoadingId === request._id

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-[color:var(--theme-surface)] p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-[color:var(--theme-text-muted)] hover:bg-[color:var(--theme-surface-alt)] rounded-full transition"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-[color:var(--theme-text)]">Detalles de Solicitud</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detalles del Usuario */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[color:var(--theme-accent)] border-b border-[color:var(--theme-border)] pb-2">
              Información del Cliente
            </h3>
            {user ? (
              <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Nombre:</span> {user.name}</p>
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Correo:</span> {user.email}</p>
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Teléfono:</span> {user.phone}</p>
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">DPI:</span> {user.dpi}</p>
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Dirección:</span> {user.address}</p>
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Ocupación:</span> {user.occupation}</p>
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Ingresos Mensuales:</span> GTQ {user.monthlyIncome}</p>
              </div>
            ) : (
              <p className="text-sm text-[color:var(--theme-text-muted)]">Cargando datos del cliente o usuario no encontrado...</p>
            )}
          </div>

          {/* Detalles de la Solicitud */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[color:var(--theme-accent)] border-b border-[color:var(--theme-border)] pb-2">
              Datos de la Cuenta Solicitada
            </h3>
            <div className="space-y-2 text-sm">
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Tipo:</span> {request.tipoCuenta}</p>
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Moneda:</span> {request.moneda}</p>
                <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Fecha de solicitud:</span> {new Date(request.createdAt).toLocaleString("es-GT")}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-[color:var(--theme-border)] pt-4">
          <button
            onClick={() => onDeny(request._id)}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-lg bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-200 disabled:opacity-50 transition"
          >
            <XCircle size={18} />
            {isProcessing ? "Procesando..." : "Denegar"}
          </button>
          <button
            onClick={() => onApprove(request._id)}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            <CheckCircle size={18} />
            {isProcessing ? "Procesando..." : "Aprobar Cuenta"}
          </button>
        </div>
      </div>
    </div>
  )
}
