import { useCallback, useEffect, useState } from 'react'
import {
  getAccountCreationRequests,
  approveAccountCreationRequest,
  denyAccountCreationRequest,
} from '../../../shared/api/account.js'

/**
 * Solicitudes de creación de cuenta (pendientes) + aprobar/rechazar.
 * @param {object} options
 * @param {() => void} [options.onApproved] callback tras aprobar (p. ej. recargar cuentas).
 */
export const useAccountRequests = ({ onApproved } = {}) => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [requestActionId, setRequestActionId] = useState('')

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const response = await getAccountCreationRequests('PENDING')
      setRequests(Array.isArray(response?.data?.data) ? response.data.data : [])
    } catch (err) {
      setError(err.message || 'No fue posible cargar las solicitudes de cuenta')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-en-montaje; loadRequests es estable (useCallback)
    loadRequests()
  }, [loadRequests])

  const handleRequestAction = useCallback(
    async (requestId, action) => {
      try {
        setRequestActionId(requestId)
        setActionError('')

        if (action === 'approve') {
          await approveAccountCreationRequest(requestId)
          onApproved?.()
        } else {
          await denyAccountCreationRequest(requestId)
        }

        setRequests((current) => current.filter((item) => item._id !== requestId))
        return true
      } catch (err) {
        setActionError(err.message || 'No fue posible procesar la solicitud')
        return false
      } finally {
        setRequestActionId('')
      }
    },
    [onApproved]
  )

  return {
    requests,
    loading,
    error,
    actionError,
    requestActionId,
    loadRequests,
    handleRequestAction,
  }
}
