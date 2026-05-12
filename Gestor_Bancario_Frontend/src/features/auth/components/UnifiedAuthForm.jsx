import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  forgotPasswordWithAuthService,
  loginWithAuthService,
  registerWithAuthService,
  resendVerificationWithAuthService,
} from '../../../shared/api/auth.js'
import { useAuthStore } from '../store/authStore.js'
import cerditoFondoBlanco from '../../../assets/CerditoFondoBlanco.png'

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
  const [showPassword, setShowPassword] = useState(false)
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
    <form onSubmit={handleSubmitLogin} className="space-y-6 sm:space-y-7">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-[#011743] sm:text-3xl lg:text-4xl">Inicia sesión</h2>
        <p className="mt-2 text-sm text-[#011743]/75 sm:mt-3 sm:text-base lg:text-xl">Accede al sistema bancario</p>
      </div>

      <div className="rounded-[1.6rem] border border-[#011743]/8 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(1,23,67,0.10)] sm:rounded-[2rem] sm:px-8 sm:py-7">
        <div className="flex justify-center">
          <img
            src={cerditoFondoBlanco}
            alt="Cerdito bancario"
            className="h-20 w-auto object-contain sm:h-28 lg:h-32"
          />
        </div>
      
        <div className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          <label className="relative block">
            <span className="sr-only">Email</span>
            <svg className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#011743]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 16a6 6 0 1112 0H2z" />
            </svg>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-[#011743]/30 bg-white py-3 pl-12 pr-4 text-base text-[#011743] outline-none transition focus:border-[#011743] focus:ring-4 focus:ring-[#011743]/10 sm:py-4 sm:pl-14 sm:text-lg"
              placeholder="admin@gestor.local"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Contraseña</span>
            <svg className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-[#011743]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 8V6a5 5 0 1110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2a3 3 0 10-6 0v2h6V6z" clipRule="evenodd" />
            </svg>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-[#011743]/30 bg-white py-3 pl-12 pr-12 text-base text-[#011743] outline-none transition focus:border-[#011743] focus:ring-4 focus:ring-[#011743]/10 sm:py-4 sm:pl-14 sm:text-lg"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#011743] p-1"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.042.15-2.046.425-2.99" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
            </button>
          </label>
        </div>

        {error && <div className="mt-5 whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 px-4 py-3 text-sm text-[#d55353]">{error}</div>}
        {success && <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-[#d55353] py-4 text-xl font-bold text-white transition hover:bg-[#c4454e] disabled:opacity-50"
        >
          {loading ? 'Iniciando sesión...' : 'Ingresar'}
        </button>

        <div className="mt-6 space-y-3 text-center text-lg">
          <button
            type="button"
            onClick={() => setModeWithReset(MODE.FORGOT_PASSWORD)}
            className="block w-full text-[#011743] transition hover:text-[blue] cursor-pointer"
          >
            ¿Olvidaste tu contraseña?
          </button>
          <button
            type="button"
            onClick={() => setModeWithReset(MODE.REGISTER)}
            className="block w-full text-[#011743] transition hover:text-[blue] cursor-pointer"
          >
            Crear una cuenta
          </button>
        </div>
      </div>

      <div className="flex items-center gap-5 px-2 pt-3 text-[#011743]/70">
        <div className="h-px flex-1 bg-[#011743]/30" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#011743]/25 bg-white shadow-sm">
          <svg className="h-6 w-6 text-[#011743]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 8V6a5 5 0 1110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2a3 3 0 10-6 0v2h6V6z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="h-px flex-1 bg-[#011743]/30" />
      </div>
      <p className="text-center text-lg text-[#011743]/75">Tu seguridad es nuestra prioridad</p>
    </form>
  )

  const renderRegisterMode = () => (
    <form onSubmit={handleSubmitRegister} className="space-y-5 rounded-[2rem] border border-[#011743]/8 bg-white px-8 py-7 shadow-[0_18px_40px_rgba(1,23,67,0.10)]">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-[#011743]">Crear cuenta</h2>
        <p className="mt-3 text-lg text-[#011743]/75">Únete a nuestro sistema bancario</p>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-[#011743] mb-2">Nombre</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border-2 border-[#011743]/30 bg-white px-4 py-3 text-[#011743] outline-none transition focus:border-[#d55353] focus:ring-2 focus:ring-[#d55353]/20"
          placeholder="Tu nombre completo"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#011743] mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border-2 border-[#011743]/30 bg-white px-4 py-3 text-[#011743] outline-none transition focus:border-[#d55353] focus:ring-2 focus:ring-[#d55353]/20"
          placeholder="tu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#011743] mb-2">Teléfono</label>
        <input
          type="tel"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          pattern="\d{8}"
          className="w-full rounded-lg border-2 border-[#011743]/30 bg-white px-4 py-3 text-[#011743] outline-none transition focus:border-[#d55353] focus:ring-2 focus:ring-[#d55353]/20"
          placeholder="12345678"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#011743] mb-2">Contraseña</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
          minLength="8"
          className="w-full rounded-lg border-2 border-[#011743]/30 bg-white px-4 py-3 text-[#011743] outline-none transition focus:border-[#d55353] focus:ring-2 focus:ring-[#d55353]/20"
          placeholder="Mínimo 8 caracteres"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#011743] mb-2">Foto de perfil (opcional)</label>
        <input
          type="file"
          name="profilePicture"
          onChange={handleChange}
          accept="image/*"
          className="w-full rounded-lg border-2 border-[#011743]/30 bg-white px-4 py-3 text-[#011743] outline-none transition focus:border-[#d55353] focus:ring-2 focus:ring-[#d55353]/20"
        />
      </div>

      {error && <div className="whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 p-3 text-sm text-[#d55353]">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#d55353] py-3 font-semibold text-white transition hover:bg-[#c4454e] disabled:opacity-50"
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
          className="block w-full text-center text-[#011743]/70 hover:text-[#011743] font-medium"
        >
          ¿No te llegó el correo de verificación?
        </button>
        <button
          type="button"
          onClick={() => setModeWithReset(MODE.LOGIN)}
          className="block w-full text-center text-[#011743]/70 hover:text-[#011743]"
        >
          ¿Ya tienes cuenta? <span className="font-semibold text-[#d55353]">Inicia sesión</span>
        </button>
      </div>
    </form>
  )

  const renderForgotPasswordMode = () => (
    <form onSubmit={handleSubmitForgotPassword} className="space-y-5 rounded-[2rem] border border-[#011743]/8 bg-white px-8 py-7 shadow-[0_18px_40px_rgba(1,23,67,0.10)]">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-[#011743]">Recuperar contraseña</h2>
        <p className="mt-3 text-lg text-[#011743]/75">Recupera acceso a tu cuenta</p>
      </div>
      <div className="rounded-2xl border border-[#011743]/10 bg-[#011743]/4 p-4 text-sm text-[#011743]/80">
        Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
      </div>

      <div>
        <label className="block text-sm font-medium text-[#011743] mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border-2 border-[#011743]/30 bg-white px-4 py-3 text-[#011743] outline-none transition focus:border-[#d55353] focus:ring-2 focus:ring-[#d55353]/20"
          placeholder="tu@email.com"
        />
      </div>

      {error && <div className="whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 p-3 text-sm text-[#d55353]">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#d55353] py-3 font-semibold text-white transition hover:bg-[#c4454e] disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar enlace'}
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.LOGIN)}
        className="w-full text-center text-[#011743]/70 hover:text-[#011743] font-medium"
      >
        Volver al inicio de sesión
      </button>
    </form>
  )

  const renderResendVerificationMode = () => (
    <form onSubmit={handleSubmitResendVerification} className="space-y-5 rounded-[2rem] border border-[#011743]/8 bg-white px-8 py-7 shadow-[0_18px_40px_rgba(1,23,67,0.10)]">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-[#011743]">Reenviar verificación</h2>
        <p className="mt-3 text-lg text-[#011743]/75">Verifica tu email nuevamente</p>
      </div>
      <div className="rounded-2xl border border-[#011743]/10 bg-[#011743]/4 p-4 text-sm text-[#011743]/80">
        Si no recibiste el email de verificación, ingresa tu email y te lo reenviamos.
      </div>

      <div>
        <label className="block text-sm font-medium text-[#011743] mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-lg border-2 border-[#011743]/30 bg-white px-4 py-3 text-[#011743] outline-none transition focus:border-[#d55353] focus:ring-2 focus:ring-[#d55353]/20"
          placeholder="tu@email.com"
        />
      </div>

      {error && <div className="whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 p-3 text-sm text-[#d55353]">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#d55353] py-3 font-semibold text-white transition hover:bg-[#c4454e] disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Reenviar verificación'}
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.REGISTER)}
        className="w-full text-center text-[#011743]/70 hover:text-[#011743] font-medium"
      >
        Volver a crear cuenta
      </button>
    </form>
  )

  const renderWaitingVerificationMode = () => (
    <div className="space-y-5 rounded-[2rem] border border-[#011743]/8 bg-white px-8 py-7 shadow-[0_18px_40px_rgba(1,23,67,0.10)]">
      <div>
        <h2 className="text-4xl font-black tracking-tight text-[#011743]">Verifica tu correo</h2>
        <p className="mt-3 text-lg text-[#011743]/75">Tu cuenta está pendiente de activación</p>
      </div>
      <div className="rounded-xl border border-[#011743]/10 bg-[#011743]/4 p-4 text-sm text-[#011743]/85">
        <p className="font-semibold">Cuenta creada correctamente</p>
        <p className="mt-1">
          Estamos esperando la verificación del correo:
          <span className="ml-1 font-medium">{registeredEmail || form.email || 'Sin email registrado'}</span>
        </p>
      </div>

      <div className="rounded-xl border border-[#011743]/10 bg-[#011743]/4 p-4">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#011743] border-t-transparent" />
          <p className="text-sm text-[#011743]/85">Pendiente de verificación. Revisa bandeja de entrada y spam.</p>
        </div>
      </div>

      {error && <div className="whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 p-3 text-sm text-[#d55353]">{error}</div>}
      {success && <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700">{success}</div>}

      <button
        type="button"
        onClick={handleResendFromWaiting}
        disabled={loading}
        className="w-full rounded-lg bg-[#d55353] py-3 font-semibold text-white transition hover:bg-[#c4454e] disabled:opacity-50"
      >
        {loading ? 'Reenviando...' : 'Reenviar correo de verificación'}
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.LOGIN)}
        className="w-full text-center text-[#011743]/70 hover:text-[#011743] font-medium"
      >
        Ya verifiqué mi correo, ir a iniciar sesión
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.RESEND_VERIFICATION)}
        className="w-full text-center text-[#011743]/60 hover:text-[#011743] text-sm"
      >
        Usar otro correo para reenviar verificación
      </button>
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-[540px]">
      {mode === MODE.LOGIN && renderLoginMode()}
      {mode === MODE.REGISTER && renderRegisterMode()}
      {mode === MODE.FORGOT_PASSWORD && renderForgotPasswordMode()}
      {mode === MODE.RESEND_VERIFICATION && renderResendVerificationMode()}
      {mode === MODE.WAITING_VERIFICATION && renderWaitingVerificationMode()}
    </div>
  )
}
