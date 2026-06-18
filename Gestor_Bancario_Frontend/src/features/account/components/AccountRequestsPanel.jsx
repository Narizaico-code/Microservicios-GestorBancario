import { Alert } from '../../../shared/components/ui/Alert.jsx'
import { formatDate } from '../../../shared/utils/format.js'
import { getAccountTypeLabel } from '../utils/accountFormat.js'

export const AccountRequestsPanel = ({ requests, loading, error, onReload, onViewDetails }) => (
  <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold">Solicitudes de creacion de cuenta</h2>
        <p className="text-sm text-[color:var(--theme-text-muted)]">
          Solicitudes enviadas por clientes pendientes de revision
        </p>
      </div>
      <button
        type="button"
        onClick={onReload}
        className="rounded-lg border border-[color:var(--theme-border)] px-3 py-2 text-sm font-semibold text-[color:var(--theme-text-muted)] hover:bg-[color:var(--theme-surface-alt)]"
        disabled={loading}
      >
        {loading ? 'Cargando...' : 'Recargar'}
      </button>
    </div>

    {error ? <Alert className="mt-4">{error}</Alert> : null}

    {!loading && !requests.length ? (
      <div className="mt-4 rounded-xl border border-dashed border-[color:var(--theme-border)] px-4 py-6 text-sm text-[color:var(--theme-text-muted)]">
        No hay solicitudes pendientes.
      </div>
    ) : null}

    <div className="mt-4 space-y-3">
      {requests.map((request) => (
        <div
          key={request._id}
          className="rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold">Usuario: {request.userId}</p>
              <p className="text-xs text-[color:var(--theme-text-muted)]">
                Tipo: {getAccountTypeLabel(request.tipoCuenta)} | Moneda: {request.moneda}
              </p>
              <p className="text-xs text-[color:var(--theme-text-muted)]">
                Solicitada: {formatDate(request.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onViewDetails(request)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
              >
                Ver detalles
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)
