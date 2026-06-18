import { useEffect, useMemo, useState } from 'react'
import { updateProfileWithAuthService } from '../../../shared/api/auth.js'

const initialForm = {
  email: '',
  phone: '',
  ingresosMensuales: '',
  currentPassword: '',
  newPassword: '',
  profilePicture: null,
}

export const useProfileForm = ({ profile, token, setProfile, updateUser }) => {
  const [form, setForm] = useState(initialForm)
  const [submitError, setSubmitError] = useState('')
  const [notice, setNotice] = useState({ text: '', tone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  // Seed editable fields from profile (initial load + after a successful update)
  useEffect(() => {
    if (!profile) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- seed del form desde profile (carga inicial / tras update)
    setForm((current) => ({
      ...current,
      email: profile.email || '',
      phone: profile.phone || '',
      ingresosMensuales: profile.ingresosMensuales || '',
    }))
  }, [profile])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sincroniza previewUrl con el objectURL del archivo (recurso del navegador) */
    if (!form.profilePicture) {
      setPreviewUrl('')
      return undefined
    }

    const url = URL.createObjectURL(form.profilePicture)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [form.profilePicture])

  const {
    emailChanged,
    phoneChanged,
    ingresosMensualesChanged,
    passwordChanged,
    profilePictureChanged,
    sensitiveCount,
  } = useMemo(() => {
    const normalizedEmail = (form.email || '').trim().toLowerCase()
    const normalizedProfileEmail = (profile?.email || '').trim().toLowerCase()
    const normalizedPhone = (form.phone || '').trim()
    const normalizedProfilePhone = (profile?.phone || '').trim()
    const normalizedIngresos = form.ingresosMensuales
    const normalizedProfileIngresos = profile?.ingresosMensuales

    const emailDiff = Boolean(normalizedEmail && normalizedEmail !== normalizedProfileEmail)
    const phoneDiff = Boolean(normalizedPhone && normalizedPhone !== normalizedProfilePhone)
    const ingresosDiff = Boolean(
      normalizedIngresos !== undefined &&
        normalizedIngresos !== null &&
        Number(normalizedIngresos) !== Number(normalizedProfileIngresos)
    )
    const passwordDiff = Boolean(form.newPassword)
    const pictureDiff = Boolean(form.profilePicture)

    return {
      emailChanged: emailDiff,
      phoneChanged: phoneDiff,
      ingresosMensualesChanged: ingresosDiff,
      passwordChanged: passwordDiff,
      profilePictureChanged: pictureDiff,
      sensitiveCount: [emailDiff, phoneDiff, passwordDiff].filter(Boolean).length,
    }
  }, [form, profile])

  const hasAnyChange =
    emailChanged ||
    phoneChanged ||
    ingresosMensualesChanged ||
    passwordChanged ||
    profilePictureChanged

  const handleChange = (event) => {
    const { name, value, files, type } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'file' ? files?.[0] || null : value,
    }))
  }

  const handleSubmit = async (event) => {
    event?.preventDefault?.()
    setSubmitError('')
    setNotice({ text: '', tone: '' })

    if (!hasAnyChange) {
      setSubmitError('No hay cambios para actualizar')
      return
    }

    if (passwordChanged && !form.currentPassword) {
      setSubmitError('La contrasena actual es obligatoria para cambiar la contrasena')
      return
    }

    if (!token) {
      setSubmitError('Sesion no valida. Inicia sesion nuevamente.')
      return
    }

    const payload = new FormData()
    if (emailChanged) payload.append('email', form.email.trim())
    if (phoneChanged) payload.append('phone', form.phone.trim())
    if (ingresosMensualesChanged) payload.append('ingresosMensuales', form.ingresosMensuales)
    if (passwordChanged) {
      payload.append('newPassword', form.newPassword)
      payload.append('currentPassword', form.currentPassword)
    }
    if (profilePictureChanged) {
      payload.append('profilePicture', form.profilePicture)
    }

    try {
      setSubmitting(true)
      const response = await updateProfileWithAuthService(token, payload)

      if (response?.data?.status === 'PENDING') {
        setNotice({
          text:
            response?.message ||
            'Solicitud enviada. Un administrador debe aprobar los cambios.',
          tone: 'warning',
        })
        setForm((current) => ({
          ...current,
          currentPassword: '',
          newPassword: '',
          profilePicture: null,
        }))
        return
      }

      const nextProfile = response?.data || profile
      if (nextProfile) {
        setProfile(nextProfile)
        updateUser({
          id: nextProfile.id,
          name: nextProfile.name,
          profilePicture: nextProfile.profilePicture,
          role: nextProfile.role,
          email: nextProfile.email,
        })
        setForm((current) => ({
          ...current,
          email: nextProfile.email || '',
          phone: nextProfile.phone || '',
          ingresosMensuales: nextProfile.ingresosMensuales || '',
          currentPassword: '',
          newPassword: '',
          profilePicture: null,
        }))
      }

      setNotice({
        text:
          response?.message ||
          'Cambios aplicados exitosamente. Revisa tu correo si cambiaste email.',
        tone: 'success',
      })
    } catch (error) {
      setSubmitError(error.message || 'No fue posible actualizar el perfil')
    } finally {
      setSubmitting(false)
    }
  }

  return {
    form,
    previewUrl,
    submitError,
    notice,
    submitting,
    hasAnyChange,
    passwordChanged,
    sensitiveCount,
    handleChange,
    handleSubmit,
  }
}
