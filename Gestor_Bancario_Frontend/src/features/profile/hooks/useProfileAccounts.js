import { useEffect, useState } from 'react'
import { getRecentAccounts } from '../../../shared/api/bank.js'

export const useProfileAccounts = (token) => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadAccounts = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getRecentAccounts(token)
        if (!isMounted) return
        setAccounts(Array.isArray(response?.data) ? response.data : [])
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'No fue posible cargar cuentas')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (token) {
      loadAccounts()
    } else {
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [token])

  return { accounts, loading, error }
}
