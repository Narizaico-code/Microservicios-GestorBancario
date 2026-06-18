import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  forgotPasswordWithAuthService,
  loginWithAuthService,
  registerWithAuthService,
  resendVerificationWithAuthService,
  checkSignupRequestStatus,
} from '../../../shared/api/auth.js'
import { getReadableError } from '../../../shared/utils/getReadableError.js'
import { useAuthStore } from '../store/authStore.js'

export const MODE = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot_password',
  RESEND_VERIFICATION: 'resend_verification',
  WAITING_VERIFICATION: 'waiting_verification',
}

const emptyForm = {
  email: '',
  password: '',
  name: '',
  phone: '',
  fechaNacimiento: '',
  dpi: '',
  ingresosMensuales: '',
  profilePicture: null,
}

export const useUnifiedAuth = ({ initialMode = MODE.LOGIN, onRegistered } = {}) => {
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [requestStatus, setRequestStatus] = useState('PENDING')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const setModeWithReset = (nextMode) => {
    setError('')
    setSuccess('')
    setMode(nextMode)
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'file' ? files?.[0] || null : value }))
  }

  const handleSubmitLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await loginWithAuthService({ email: form.email, password: form.password })
      const session = { token: res.token, user: res.userDetails, expiresAt: res.expiresAt }
      login(session)
      navigate(session.user?.role === 'ADMIN_ROLE' ? '/dashboard' : '/client')
    } catch (err) {
      setError(getReadableError(err, 'No se pudo iniciar sesión'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('email', form.email)
      fd.append('password', form.password)
      fd.append('phone', form.phone)
      fd.append('fechaNacimiento', form.fechaNacimiento)
      fd.append('dpi', form.dpi)
      fd.append('ingresosMensuales', form.ingresosMensuales)
      if (form.profilePicture) fd.append('profilePicture', form.profilePicture)

      await registerWithAuthService(fd)
      setRegisteredEmail(form.email)
      setSuccess('Cuenta creada. Revisa tu correo para verificarla.')
      setForm((c) => ({
        ...c,
        password: '',
        name: '',
        phone: '',
        fechaNacimiento: '',
        dpi: '',
        ingresosMensuales: '',
        profilePicture: null,
      }))
      setMode(MODE.WAITING_VERIFICATION)
      if (typeof onRegistered === 'function') {
        try {
          onRegistered()
        } catch {
          /* noop */
        }
      }
    } catch (err) {
      setError(getReadableError(err, 'No se pudo crear la cuenta'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitForgotPassword = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await forgotPasswordWithAuthService(form.email)
      setSuccess('Se envió un enlace de recuperación a tu email')
      setTimeout(() => setMode(MODE.LOGIN), 2000)
    } catch (err) {
      setError(getReadableError(err, 'No se pudo enviar el email'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitResend = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await resendVerificationWithAuthService(form.email)
      setRegisteredEmail(form.email)
      setSuccess('Se reenvió el correo de verificación. Revisa tu bandeja y spam.')
    } catch (err) {
      setError(getReadableError(err, 'No se pudo reenviar el email'))
    } finally {
      setLoading(false)
    }
  }

  const handleResendFromWaiting = async () => {
    const email = registeredEmail || form.email
    if (!email) {
      setModeWithReset(MODE.RESEND_VERIFICATION)
      return
    }
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await resendVerificationWithAuthService(email)
      setSuccess('Correo de verificación reenviado correctamente.')
    } catch (err) {
      setError(getReadableError(err, 'No se pudo reenviar el correo'))
    } finally {
      setLoading(false)
    }
  }

  // Polling del estado de la solicitud mientras se espera la verificación.
  useEffect(() => {
    if (mode !== MODE.WAITING_VERIFICATION) return
    const email = registeredEmail || form.email
    if (!email) return

    let isPolling = true

    const checkStatus = async () => {
      if (!isPolling) return
      try {
        const res = await checkSignupRequestStatus(email)
        if (res.status === 'APPROVED' && requestStatus !== 'APPROVED') {
          setRequestStatus('APPROVED')
        } else if (res.status === 'VERIFIED') {
          setSuccess('¡Cuenta verificada! Ya puedes iniciar sesión.')
          isPolling = false
          setTimeout(() => setModeWithReset(MODE.LOGIN), 1000)
        } else if (res.status === 'REJECTED') {
          setError('Tu solicitud ha sido denegada por el Administrador.')
          isPolling = false
        }
      } catch {
        // Ignorar 404 para seguir buscando
      }
    }

    checkStatus()

    const interval = setInterval(() => {
      if (isPolling) checkStatus()
      else clearInterval(interval)
    }, 1500)

    return () => {
      isPolling = false
      clearInterval(interval)
    }
  }, [mode, registeredEmail, form.email, requestStatus])

  return {
    mode,
    setMode: setModeWithReset,
    form,
    setForm,
    loading,
    error,
    success,
    showPassword,
    setShowPassword,
    registeredEmail,
    requestStatus,
    handleChange,
    handleSubmitLogin,
    handleSubmitRegister,
    handleSubmitForgotPassword,
    handleSubmitResend,
    handleResendFromWaiting,
  }
}
