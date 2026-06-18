import { ClipboardCheck, Loader2 } from 'lucide-react'
import { Alert } from '../../../shared/components/ui/Alert.jsx'
import { formatDate } from '../../../shared/utils/format.js'

const getRequestedFields = (request) => {
  const fields = []
  if (request.Email) fields.push('Correo')
  if (request.Phone) fields.push('Telefono')
  if (request.ProfilePicture) fields.push('Foto')
  return fields.length ? fields : ['Sin cambios detectados']
}

const RequestCard = ({ request, actionId, onAction }) => {
  const status = request.Status || 'PENDING'
  const isProcessing = actionId === request.Id

  return (
    <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold">Solicitud #{request.Id}</p>
          <p className="text-xs text-[color:var(--theme-text-muted)]">Correo: {request.Email}</p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
            status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
          }`}
        >
          <Loader2 className="h-4 w-4" />
          {status}
        </span>
      </div>

      <div className="mt-3 grid gap-3 text-sm text-[color:var(--theme-text-muted)] sm:grid-cols-2">
        <div>
          <p className="font-semibold text-[color:var(--theme-text)]">Solicitante</p>
          <p>{request.Name}</p>
        </div>
        <div>
          <p className="font-semibold text-[color:var(--theme-text)]">Campos enviados</p>
          <p>{getRequestedFields(request).join(', ')}</p>
        </div>
        <div>
          <p className="font-semibold text-[color:var(--theme-text)]">Fecha de solicitud</p>
          <p>{formatDate(request.created_at || request.createdAt)}</p>
        </div>
        <div>
          <p className="font-semibold text-[color:var(--theme-text)]">Estado</p>
          <p>{status}</p>
        </div>
      </div>

      {status === 'PENDING' ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onAction(request.Id, 'approve')}
            disabled={isProcessing}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
          >
            {isProcessing ? 'Procesando...' : 'Aprobar'}
          </button>
          <button
            type="button"
            onClick={() => onAction(request.Id, 'reject')}
            disabled={isProcessing}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-70"
          >
            {isProcessing ? 'Procesando...' : 'Rechazar'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export const AccessRequestsSection = ({ requests, loading, error, actionError, actionId, onAction }) => (
  <section className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2 text-[color:var(--theme-text)]">
        <ClipboardCheck className="h-5 w-5 text-emerald-600" />
        <div>
          <h2 className="text-lg font-semibold">Solicitudes de acceso</h2>
          <p className="text-sm text-[color:var(--theme-text-muted)]">Solicitudes pendientes para aprobar o rechazar</p>
        </div>
      </div>
    </div>

    {loading ? <p className="mt-4 text-sm text-[color:var(--theme-text-muted)]">Cargando solicitudes...</p> : null}
    {error ? <Alert className="mt-4">{error}</Alert> : null}
    {actionError ? <Alert className="mt-4">{actionError}</Alert> : null}

    {!loading && !error ? (
      <div className="mt-6 space-y-4">
        {requests.map((request) => (
          <RequestCard key={request.Id} request={request} actionId={actionId} onAction={onAction} />
        ))}

        {!requests.length ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--theme-border)] px-4 py-6 text-sm text-[color:var(--theme-text-muted)]">
            No hay solicitudes para mostrar.
          </div>
        ) : null}
      </div>
    ) : null}
  </section>
)
