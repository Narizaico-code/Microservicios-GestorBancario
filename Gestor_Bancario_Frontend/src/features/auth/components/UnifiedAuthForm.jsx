import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithAuthService } from '../../../shared/services/auth.service.js'
import { registerWithAuthService } from '../../../shared/services/auth.service.js'
import { forgotPasswordWithAuthService } from '../../../shared/services/auth.service.js'
import { resendVerificationWithAuthService } from '../../../shared/services/auth.service.js'
import { useAuthStore } from '../store/authStore.js'

const MODE = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot_password',
  RESEND_VERIFICATION: 'resend_verification',
  WAITING_VERIFICATION: 'waiting_verification',
}

export default function UnifiedAuthForm() {
  const [mode, setMode] = useState(MODE.LOGIN)
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    profilePicture: null,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [registeredEmail, setRegisteredEmail] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const setModeWithReset = (nextMode) => {
    setError('')
    setSuccess('')
    setMode(nextMode)
  }

  const getReadableError = (err, fallbackMessage) => {
    const apiErrors = err?.payload?.errors
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      return apiErrors
        .map((item) => `• ${item?.field || 'campo'}: ${item?.message || 'valor inválido'}`)
        .join('\n')
    }

    return err?.message || fallbackMessage
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] || null : value,
    }))
  }

  const handleSubmitLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const response = await loginWithAuthService({
        email: form.email,
        password: form.password,
      })

      const nextSession = {
        token: response.token,
        user: response.userDetails,
        expiresAt: response.expiresAt,
      }

      login(nextSession)
      navigate(nextSession.user?.role === 'ADMIN_ROLE' ? '/dashboard' : '/client')
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
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('email', form.email)
      formData.append('password', form.password)
      formData.append('phone', form.phone)
      if (form.profilePicture) {
        formData.append('profilePicture', form.profilePicture)
      }

      await registerWithAuthService(formData)
      setRegisteredEmail(form.email)
      setSuccess('Cuenta creada. Revisa tu correo para verificarla y luego iniciar sesión.')
      setForm((current) => ({
        ...current,
        password: '',
        name: '',
        phone: '',
        profilePicture: null,
      }))
      setMode(MODE.WAITING_VERIFICATION)
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

  const handleSubmitResendVerification = async (e) => {
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
      setError(getReadableError(err, 'No se pudo reenviar el correo de verificación'))
    } finally {
      setLoading(false)
    }
  }

  const renderLoginMode = () => (
    <form onSubmit={handleSubmitLogin} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
          placeholder="••••••••"
        />
      </div>

      {error && <div className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Iniciando sesión...' : 'Ingresar'}
      </button>

      <div className="space-y-2 text-sm">
        <button
          type="button"
          onClick={() => setModeWithReset(MODE.FORGOT_PASSWORD)}
          className="block w-full text-center text-cyan-600 hover:text-cyan-700 font-medium"
        >
          ¿Olvidaste tu contraseña?
        </button>
        <button
          type="button"
          onClick={() => setModeWithReset(MODE.REGISTER)}
          className="block w-full text-center text-slate-600 hover:text-slate-700"
        >
          ¿No tienes cuenta? <span className="font-semibold text-cyan-600">Crear una</span>
        </button>
      </div>
    </form>
  )

  const renderRegisterMode = () => (
    <form onSubmit={handleSubmitRegister} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
          placeholder="Tu nombre completo"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          pattern="\d{8}"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
          placeholder="12345678"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength="8"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Foto de perfil (opcional)</label>
        <input
          type="file"
          name="profilePicture"
          onChange={handleChange}
          accept="image/*"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
        />
      </div>

      {error && <div className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <div className="space-y-2 text-sm">
        <button
          type="button"
          onClick={() => {
            setForm((current) => ({ ...current, email: current.email || registeredEmail }))
            setModeWithReset(MODE.RESEND_VERIFICATION)
          }}
          className="block w-full text-center text-cyan-600 hover:text-cyan-700 font-medium"
        >
          ¿No te llegó el correo de verificación?
        </button>
        <button
          type="button"
          onClick={() => setModeWithReset(MODE.LOGIN)}
          className="block w-full text-center text-slate-600 hover:text-slate-700"
        >
          ¿Ya tienes cuenta? <span className="font-semibold text-cyan-600">Inicia sesión</span>
        </button>
      </div>
    </form>
  )

  const renderForgotPasswordMode = () => (
    <form onSubmit={handleSubmitForgotPassword} className="space-y-4">
      <div className="rounded-lg bg-cyan-50 p-4 text-sm text-cyan-800">
        Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
          placeholder="tu@email.com"
        />
      </div>

      {error && <div className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar enlace'}
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.LOGIN)}
        className="w-full text-center text-slate-600 hover:text-slate-700 font-medium"
      >
        Volver al inicio de sesión
      </button>
    </form>
  )

  const renderResendVerificationMode = () => (
    <form onSubmit={handleSubmitResendVerification} className="space-y-4">
      <div className="rounded-lg bg-cyan-50 p-4 text-sm text-cyan-800">
        Si no recibiste el email de verificación, ingresa tu email y te lo reenviamos.
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
          placeholder="tu@email.com"
        />
      </div>

      {error && <div className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Reenviar verificación'}
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.REGISTER)}
        className="w-full text-center text-slate-600 hover:text-slate-700 font-medium"
      >
        Volver a crear cuenta
      </button>
    </form>
  )

  const renderWaitingVerificationMode = () => (
    <div className="space-y-4">
      <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
        <p className="font-semibold">Cuenta creada correctamente</p>
        <p className="mt-1">
          Estamos esperando la verificación del correo:
          <span className="ml-1 font-medium">{registeredEmail || form.email || 'Sin email registrado'}</span>
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-cyan-700" />
          <p className="text-sm text-slate-700">Pendiente de verificación. Revisa bandeja de entrada y spam.</p>
        </div>
      </div>

      {error && <div className="whitespace-pre-line rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">{success}</div>}

      <button
        type="button"
        onClick={handleResendFromWaiting}
        disabled={loading}
        className="w-full rounded-lg bg-cyan-600 py-3 font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Reenviando...' : 'Reenviar correo de verificación'}
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.LOGIN)}
        className="w-full text-center text-slate-600 hover:text-slate-700 font-medium"
      >
        Ya verifiqué mi correo, ir a iniciar sesión
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.RESEND_VERIFICATION)}
        className="w-full text-center text-cyan-700 hover:text-cyan-800 text-sm"
      >
        Usar otro correo para reenviar verificación
      </button>
    </div>
  )

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-950">
          {mode === MODE.LOGIN && 'Inicia sesión'}
          {mode === MODE.REGISTER && 'Crear cuenta'}
          {mode === MODE.FORGOT_PASSWORD && 'Recuperar contraseña'}
          {mode === MODE.RESEND_VERIFICATION && 'Reenviar verificación'}
          {mode === MODE.WAITING_VERIFICATION && 'Verifica tu correo'}
        </h2>
        <p className="text-slate-600">
          {mode === MODE.LOGIN && 'Accede al sistema bancario'}
          {mode === MODE.REGISTER && 'Únete a nuestro sistema'}
          {mode === MODE.FORGOT_PASSWORD && 'Recupera acceso a tu cuenta'}
          {mode === MODE.RESEND_VERIFICATION && 'Verifica tu email nuevamente'}
          {mode === MODE.WAITING_VERIFICATION && 'Tu cuenta está pendiente de activación por correo'}
        </p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
        {mode === MODE.LOGIN && renderLoginMode()}
        {mode === MODE.REGISTER && renderRegisterMode()}
        {mode === MODE.FORGOT_PASSWORD && renderForgotPasswordMode()}
        {mode === MODE.RESEND_VERIFICATION && renderResendVerificationMode()}
        {mode === MODE.WAITING_VERIFICATION && renderWaitingVerificationMode()}
      </div>
    </div>
  )
}
