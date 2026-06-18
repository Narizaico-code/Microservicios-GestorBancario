import { useState } from 'react'
import { getProfileByIdWithAuthService } from '../../../shared/api/auth.js'
import { useAuthStore } from '../../auth/store/authStore.js'

export const useProfileLookup = () => {
  const { session } = useAuthStore()
  const [profileId, setProfileId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const handleSearch = async (event) => {
    event.preventDefault()
    if (!profileId.trim()) {
      setError('Ingresa un ID valido')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await getProfileByIdWithAuthService(session?.token, profileId.trim())
      setResult(response?.data || null)
    } catch (err) {
      setError(err.message || 'No fue posible obtener el perfil')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return { profileId, setProfileId, loading, error, result, handleSearch }
}
