import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllUsersWithAuthService } from '../../../shared/api/auth.js'
import { resolveUser } from '../../../shared/utils/resolveUser.js'
import { useAuthStore } from '../../auth/store/authStore.js'

export const useUsersDirectory = () => {
  const { session } = useAuthStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const loadUsers = useCallback(async () => {
    if (!session?.token) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError('')
      const response = await getAllUsersWithAuthService(session.token)
      setUsers(Array.isArray(response?.users) ? response.users : [])
    } catch (err) {
      setError(err.message || 'No fue posible cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-en-montaje; loadUsers es estable (useCallback)
    loadUsers()
  }, [loadUsers])

  const filteredUsers = useMemo(() => {
    const resolved = users.map(resolveUser)
    const normalized = search.trim().toLowerCase()
    if (!normalized) return resolved
    return resolved.filter(
      (user) =>
        user.name.toLowerCase().includes(normalized) ||
        user.email.toLowerCase().includes(normalized) ||
        String(user.id).toLowerCase().includes(normalized)
    )
  }, [users, search])

  return { filteredUsers, loading, error, search, setSearch, refreshUsers: loadUsers }
}
