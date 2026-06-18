import { useCallback, useState } from 'react'
import { getAllUsersWithAuthService } from '../../../shared/api/auth.js'
import { resolveUser } from '../../../shared/utils/resolveUser.js'
import { useAuthStore } from '../../auth/store/authStore.js'

export const useAdminUsers = () => {
  const { session } = useAuthStore()
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState('')

  const loadUsers = useCallback(async () => {
    if (!session?.token) {
      setUsersError('No hay sesion activa para cargar usuarios')
      return
    }

    try {
      setUsersLoading(true)
      setUsersError('')
      const response = await getAllUsersWithAuthService(session.token)
      const rawUsers = Array.isArray(response?.users) ? response.users : []
      setUsers(rawUsers.map(resolveUser).filter((user) => user.id))
    } catch (err) {
      setUsersError(err.message || 'No fue posible cargar los usuarios')
    } finally {
      setUsersLoading(false)
    }
  }, [session])

  return { users, usersLoading, usersError, loadUsers }
}
