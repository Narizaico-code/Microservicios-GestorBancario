import { CheckCircle, XCircle } from 'lucide-react'
import { Modal } from '../../../shared/components/ui/index.js'

export const AdminRequestDetailsModal = ({
  isOpen,
  onClose,
  request,
  user,
  onApprove,
  onDeny,
  actionLoadingId,
}) => {
  if (!isOpen || !request) return null

  const isProcessing = actionLoadingId === request._id

  return (
    <Modal title="Detalles de Solicitud" onClose={onClose} maxWidth="max-w-2xl">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Detalles del Usuario */}
        <div className="space-y-4">
          <h3 className="border-b border-[color:var(--theme-border)] pb-2 text-lg font-semibold text-[color:var(--theme-accent)]">
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
          <h3 className="border-b border-[color:var(--theme-border)] pb-2 text-lg font-semibold text-[color:var(--theme-accent)]">
            Datos de la Cuenta Solicitada
          </h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Tipo:</span> {request.tipoCuenta}</p>
            <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Moneda:</span> {request.moneda}</p>
            <p><span className="font-semibold text-[color:var(--theme-text-muted)]">Fecha de solicitud:</span> {new Date(request.createdAt).toLocaleString('es-GT')}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3 border-t border-[color:var(--theme-border)] pt-4">
        <button
          onClick={() => onDeny(request._id)}
          disabled={isProcessing}
          className="flex items-center gap-2 rounded-lg bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-200 disabled:opacity-50"
        >
          <XCircle size={18} />
          {isProcessing ? 'Procesando...' : 'Denegar'}
        </button>
        <button
          onClick={() => onApprove(request._id)}
          disabled={isProcessing}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          <CheckCircle size={18} />
          {isProcessing ? 'Procesando...' : 'Aprobar Cuenta'}
        </button>
      </div>
    </Modal>
  )
}
