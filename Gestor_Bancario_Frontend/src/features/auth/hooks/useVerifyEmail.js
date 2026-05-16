import { useCallback, useState } from 'react'
import { verifyEmailLinkWithAuthService, verifyEmailWithAuthService } from '../../../shared/api/auth.js'

export const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const verify = useCallback(async (token, fromLink = false) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const result = fromLink
        ? await verifyEmailLinkWithAuthService(token)
        : await verifyEmailWithAuthService(token)

      setSuccess(result.message || 'Correo verificado')
      return result
    } catch (requestError) {
      setError(requestError.message || 'No se pudo verificar el correo')
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, success, verify }
}