import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, ClipboardCheck, Clock } from 'lucide-react'
import {
  approveUpdateRequestWithAuthService,
  getUpdateRequestsWithAuthService,
  rejectUpdateRequestWithAuthService,
} from '../../../shared/api/auth.js'
import { formatDate, getStatusBadge } from '../../../shared/utils/format.js'

export const AdminUpdateRequests = ({ token }) => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [actionId, setActionId] = useState('')

  const statusOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Todas' },
      { value: 'PENDING', label: 'Pendientes' },
      { value: 'APPROVED', label: 'Aprobadas' },
      { value: 'REJECTED', label: 'Rechazadas' },
    ],
    []
  )

  const statusBadgeOptions = useMemo(
    () => [
      { value: 'PENDING', label: 'Pendiente' },
      { value: 'APPROVED', label: 'Aprobada' },
      { value: 'REJECTED', label: 'Rechazada' },
    ],
    []
  )

  useEffect(() => {
    let isMounted = true

    const loadRequests = async () => {
      try {
        setLoading(true)
        setError('')
        const normalizedStatus = statusFilter === 'ALL' ? null : statusFilter
        const response = await getUpdateRequestsWithAuthService(token, normalizedStatus)
        if (!isMounted) return
        setRequests(Array.isArray(response?.data) ? response.data : [])
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'No fue posible cargar las solicitudes')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (token) {
      loadRequests()
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-en-montaje con guard isMounted
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [statusFilter, token])

  const handleAction = async (requestId, action) => {
    try {
      setActionId(requestId)
      setActionError('')
      if (action === 'approve') {
        await approveUpdateRequestWithAuthService(token, requestId)
      } else {
        await rejectUpdateRequestWithAuthService(token, requestId)
      }

      setRequests((current) => {
        if (statusFilter === 'PENDING') {
          return current.filter((item) => item.Id !== requestId)
        }
        return current.map((item) =>
          item.Id === requestId
            ? {
                ...item,
                Status: action === 'approve' ? 'APPROVED' : 'REJECTED',
                ApprovedAt: new Date().toISOString(),
              }
            : item
        )
      })
    } catch (err) {
      setActionError(err.message || 'No fue posible procesar la solicitud')
    } finally {
      setActionId('')
    }
  }

  const getRequestedFields = (request) => {
    const fields = []
    if (request.Email) fields.push('Correo')
    if (request.Phone) fields.push('Telefono')
    if (request.ProfilePicture) fields.push('Foto')
    if (request.PasswordHash) fields.push('Contrasena')
    return fields.length ? fields : ['Sin cambios detectados']
  }

  return (
    <section className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm text-[color:var(--theme-text)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-emerald-500" />
          <div>
            <h2 className="text-lg font-semibold">Solicitudes de edicion de perfil</h2>
            <p className="text-sm text-[color:var(--theme-text-muted)]">Aprobaciones pendientes del sistema</p>
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-3 py-2 text-sm text-[color:var(--theme-text)] outline-none"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p className="mt-4 text-sm text-[color:var(--theme-text-muted)]">Cargando solicitudes...</p> : null}
      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      {actionError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="mt-6 space-y-4">
          {requests.map((request, index) => (
            <div
              key={request.Id || index}
              className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold">Solicitud #{request.Id}</p>
                  <p className="text-xs text-[color:var(--theme-text-muted)]">Usuario: {request.UserId}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    request.Status === 'APPROVED'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : request.Status === 'REJECTED'
                      ? 'bg-rose-500/10 text-rose-600'
                      : 'bg-amber-500/10 text-amber-700'
                  }`}
                >
                  {request.Status === 'APPROVED' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {getStatusBadge(request.Status, statusBadgeOptions)}
                </span>
              </div>

              <div className="mt-3 grid gap-3 text-sm text-[color:var(--theme-text-muted)] sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-[color:var(--theme-text)]">Campos solicitados</p>
                  <p>{getRequestedFields(request).join(', ')}</p>
                </div>
                <div>
                  <p className="font-semibold text-[color:var(--theme-text)]">Fecha de solicitud</p>
                  <p>{formatDate(request.created_at || request.createdAt)}</p>
                </div>
              </div>

              {request.Status === 'PENDING' ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleAction(request.Id, 'approve')}
                    disabled={actionId === request.Id}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                  >
                    {actionId === request.Id ? 'Procesando...' : 'Aprobar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(request.Id, 'reject')}
                    disabled={actionId === request.Id}
                    className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-70"
                  >
                    Rechazar
                  </button>
                </div>
              ) : null}
            </div>
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
}
