import { useEffect, useState } from 'react'
import { getProfileWithAuthService } from '../../../shared/api/auth.js'

export const useProfileData = (token, updateUser) => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getProfileWithAuthService(token)
        if (!isMounted) return
        const userData = response?.data || response?.user || null
        setProfile(userData)
        if (userData) {
          updateUser({
            id: userData.id,
            name: userData.name,
            profilePicture: userData.profilePicture,
            role: userData.role,
            email: userData.email,
          })
        }
      } catch (err) {
        if (!isMounted) return
        setError(err.message || 'No fue posible cargar el perfil')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (token) {
      loadProfile()
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- carga de perfil + sync a store (updateUser); efecto de montaje
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  return { profile, setProfile, loading, error }
}
