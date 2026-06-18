import { useCallback } from 'react'
import { getRecentAccounts } from '../../../shared/api/bank.js'
import { useAsync } from '../../../shared/hooks/useAsync.js'

export const useProfileAccounts = (token) => {
  const fetchAccounts = useCallback(async () => {
    try {
      const response = await getRecentAccounts(token)
      return Array.isArray(response?.data) ? response.data : []
    } catch (err) {
      throw new Error(err.message || 'No fue posible cargar cuentas', { cause: err })
    }
  }, [token])

  const { data, loading, error } = useAsync(fetchAccounts, { enabled: !!token, initialData: [] })

  return { accounts: data, loading, error }
}
