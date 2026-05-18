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

export const UnifiedAuthForm = ({ onRegistered, initialMode = MODE.LOGIN, onlyRegister = false } = {}) => {
  const [mode, setMode] = useState(initialMode)
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
      if (typeof onRegistered === 'function') {
        try {
          onRegistered()
        } catch (err) {
          // noop
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
      <div className="flex justify-end">
        
      </div>

      <div className="text-center">
        <img
          src={cerditoFondoBlanco}
          alt="Cerdito bancario"
          className="mx-auto mb-2 h-20 w-20 rounded-full bg-slate-100 object-contain p-2 sm:h-24 sm:w-24"
        />
        <h2 className="text-2xl font-black tracking-tight text-[#011743] sm:text-3xl">¡Bienvenido de nuevo!</h2>
        <p className="mt-2 text-sm text-[#011743]/70 sm:text-base">Inicia sesión para continuar</p>
      </div>

      <div className="rounded-[1.6rem] border border-[#011743]/8 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(1,23,67,0.10)] sm:rounded-[2rem] sm:px-7 sm:py-7">
        <div className="space-y-4">
          <label className="relative block">
            <span className="text-sm font-semibold text-[#011743]">Correo electrónico</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white py-3 pl-12 pr-4 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
              placeholder="ejemplo@banco.com"
            />
            <svg className="pointer-events-none absolute left-4 top-[52px] h-5 w-5 -translate-y-1/2 text-[#011743]/60" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 16a6 6 0 1112 0H2z" />
            </svg>
          </label>

          <label className="relative block">
            <span className="text-sm font-semibold text-[#011743]">Contraseña</span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white py-3 pl-12 pr-12 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
              placeholder="Ingresa tu contraseña"
            />
            <svg className="pointer-events-none absolute left-4 top-[52px] h-5 w-5 -translate-y-1/2 text-[#011743]/60" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 8V6a5 5 0 1110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2a3 3 0 10-6 0v2h6V6z" clipRule="evenodd" />
            </svg>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-[52px] -translate-y-1/2 text-[#011743]/70"
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

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#011743]/70 sm:text-sm">
            <button
              type="button"
              onClick={() => setModeWithReset(MODE.FORGOT_PASSWORD)}
              className="font-semibold text-[#1a56db]"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {error && <div className="mt-5 whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 px-4 py-3 text-sm text-[#d55353]">{error}</div>}
        {success && <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a56db] py-3 text-base font-semibold text-white transition hover:bg-[#1949b7] disabled:opacity-50"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11V7m0 8h.01M7 11V7a5 5 0 0110 0v4" />
          </svg>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>

      <div className="space-y-4">
        

       

        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs text-slate-600">
          <p className="font-semibold text-slate-700">Tu seguridad es nuestra prioridad</p>
          Contamos con tecnología de encriptación para proteger tu información.
        </div>

        <div className="text-center text-sm text-[#011743]/70">
          <button
            type="button"
            onClick={() => setModeWithReset(MODE.REGISTER)}
            className="font-semibold text-[#1a56db]"
          >
            Crear una cuenta
          </button>
        </div>
      </div>
    </form>
  )

  const renderRegisterMode = () => (
    <form onSubmit={handleSubmitRegister} className="space-y-6 sm:space-y-7">
      <div className="text-center">
        <img
          src={cerditoFondoBlanco}
          alt="Cerdito bancario"
          className="mx-auto mb-2 h-20 w-20 rounded-full bg-slate-100 object-contain p-2 sm:h-24 sm:w-24"
        />
        <h2 className="text-2xl font-black tracking-tight text-[#011743] sm:text-3xl">Crear cuenta</h2>
        <p className="mt-2 text-sm text-[#011743]/70 sm:text-base">Únete a nuestro sistema bancario</p>
      </div>

      <div className="rounded-[1.6rem] border border-[#011743]/8 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(1,23,67,0.10)] sm:rounded-[2rem] sm:px-7 sm:py-7">
        <div className="space-y-4">
          <label className="block text-sm font-semibold text-[#011743]">
            Nombre
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white py-3 px-4 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
              placeholder="Tu nombre completo"
            />
          </label>

          <label className="block text-sm font-semibold text-[#011743]">
            Correo electrónico
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white py-3 px-4 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
              placeholder="tu@email.com"
            />
          </label>

          <label className="block text-sm font-semibold text-[#011743]">
            Teléfono
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              pattern="\d{8}"
              className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white py-3 px-4 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
              placeholder="12345678"
            />
          </label>

          <label className="block text-sm font-semibold text-[#011743]">
            Contraseña
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength="8"
              className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white py-3 px-4 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
              placeholder="Mínimo 8 caracteres"
            />
          </label>

          <label className="block text-sm font-semibold text-[#011743]">
            Foto de perfil (opcional)
            <input
              type="file"
              name="profilePicture"
              onChange={handleChange}
              accept="image/*"
              className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white px-4 py-3 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
            />
          </label>
        </div>

        {error && <div className="mt-5 whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 px-4 py-3 text-sm text-[#d55353]">{error}</div>}
        {success && <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-[#1a56db] py-3 text-base font-semibold text-white transition hover:bg-[#1949b7] disabled:opacity-50"
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm text-[#011743]/70">
  <button
    type="button"
    onClick={() => {
      setForm((current) => ({
        ...current,
        email: current.email || registeredEmail,
      }))
      setModeWithReset(MODE.RESEND_VERIFICATION)
    }}
    className="font-semibold text-[#1a56db] whitespace-nowrap"
  >
    ¿No te llegó el correo?
  </button>

  <span className="text-[#011743]/30">|</span>

  <button
    type="button"
    onClick={() => setModeWithReset(MODE.LOGIN)}
    className="font-semibold text-[#1a56db] whitespace-nowrap"
  >
    Inicia sesión
  </button>
</div>
    </form>
  )

  const renderForgotPasswordMode = () => (
    <form onSubmit={handleSubmitForgotPassword} className="space-y-6 sm:space-y-7">
      <div className="text-center">
        <img
          src={cerditoFondoBlanco}
          alt="Cerdito bancario"
          className="mx-auto mb-2 h-20 w-20 rounded-full bg-slate-100 object-contain p-2 sm:h-24 sm:w-24"
        />
        <h2 className="text-2xl font-black tracking-tight text-[#011743] sm:text-3xl">Recuperar contraseña</h2>
        <p className="mt-2 text-sm text-[#011743]/70 sm:text-base">Recupera acceso a tu cuenta</p>
      </div>

      <div className="rounded-[1.6rem] border border-[#011743]/8 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(1,23,67,0.10)] sm:rounded-[2rem] sm:px-7 sm:py-7">
        <div className="mb-2 rounded-2xl border border-[#011743]/10 bg-[#011743]/4 p-4 text-sm text-[#011743]/80">
          Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
        </div>

        <label className="block text-sm font-semibold text-[#011743]">
          Correo electrónico
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white py-3 px-4 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
            placeholder="tu@email.com"
          />
        </label>

        {error && <div className="mt-5 whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 px-4 py-3 text-sm text-[#d55353]">{error}</div>}
        {success && <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-[#1a56db] py-3 text-base font-semibold text-white transition hover:bg-[#1949b7] disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
      </div>

      <div className="text-center text-sm text-[#011743]/70">
        <button
          type="button"
          onClick={() => setModeWithReset(MODE.LOGIN)}
          className="font-semibold text-[#1a56db]"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </form>
  )

  const renderResendVerificationMode = () => (
    <form onSubmit={handleSubmitResendVerification} className="space-y-6 sm:space-y-7">
      <div className="text-center">
        <img
          src={cerditoFondoBlanco}
          alt="Cerdito bancario"
          className="mx-auto mb-2 h-20 w-20 rounded-full bg-slate-100 object-contain p-2 sm:h-24 sm:w-24"
        />
        <h2 className="text-2xl font-black tracking-tight text-[#011743] sm:text-3xl">Reenviar verificación</h2>
        <p className="mt-2 text-sm text-[#011743]/70 sm:text-base">Verifica tu email nuevamente</p>
      </div>

      <div className="rounded-[1.6rem] border border-[#011743]/8 bg-white px-5 py-6 shadow-[0_18px_40px_rgba(1,23,67,0.10)] sm:rounded-[2rem] sm:px-7 sm:py-7">
        <div className="mb-2 rounded-2xl border border-[#011743]/10 bg-[#011743]/4 p-4 text-sm text-[#011743]/80">
          Si no recibiste el email de verificación, ingresa tu email y te lo reenviamos.
        </div>

        <label className="block text-sm font-semibold text-[#011743]">
          Correo electrónico
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-2xl border border-[#011743]/20 bg-white py-3 px-4 text-sm text-[#011743] outline-none transition focus:border-[#1a56db] focus:ring-4 focus:ring-[#1a56db]/10 sm:text-base"
            placeholder="tu@email.com"
          />
        </label>

        {error && <div className="mt-5 whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 px-4 py-3 text-sm text-[#d55353]">{error}</div>}
        {success && <div className="mt-5 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-2xl bg-[#1a56db] py-3 text-base font-semibold text-white transition hover:bg-[#1949b7] disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Reenviar verificación'}
        </button>
      </div>

      <div className="text-center text-sm text-[#011743]/70">
        <button
          type="button"
          onClick={() => setModeWithReset(MODE.REGISTER)}
          className="font-semibold text-[#1a56db]"
        >
          Volver a crear cuenta
        </button>
      </div>
    </form>
  )

  const renderWaitingVerificationMode = () => (
  <div className="space-y-5">
    <div className="text-center">
      <img
        src={cerditoFondoBlanco}
        alt="Cerdito bancario"
        className="mx-auto mb-3 h-16 w-16 rounded-full bg-slate-100 object-contain p-2 sm:h-20 sm:w-20"
      />

      <h2 className="text-2xl font-black tracking-tight text-[#011743]">
        Verifica tu correo
      </h2>

      <p className="mt-1 text-sm text-[#011743]/70">
        Tu cuenta está pendiente de activación
      </p>
    </div>

    <div className="rounded-3xl border border-[#011743]/10 bg-white px-5 py-5 shadow-[0_12px_30px_rgba(1,23,67,0.08)]">
      
      <div className="rounded-2xl border border-[#011743]/10 bg-[#011743]/4 p-4 text-sm text-[#011743]/85">
        <p className="font-semibold">
          Cuenta creada correctamente
        </p>

        <p className="mt-1 break-words">
          Estamos esperando la verificación del correo:
          <span className="ml-1 font-medium">
            {registeredEmail || form.email || 'Sin email registrado'}
          </span>
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-[#011743]/10 bg-[#011743]/4 p-4">
        <div className="flex items-center gap-3">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#011743] border-t-transparent" />

          <p className="text-sm text-[#011743]/85">
            Pendiente de verificación. Revisa bandeja de entrada y spam.
          </p>
        </div>
      </div>

      {error && (
        <div className="mt-4 whitespace-pre-line rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 px-4 py-3 text-sm text-[#d55353]">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <button
        type="button"
        onClick={handleResendFromWaiting}
        disabled={loading}
        className="mt-5 w-full rounded-2xl bg-[#1a56db] py-3 text-sm font-semibold text-white transition hover:bg-[#1949b7] disabled:opacity-50"
      >
        {loading ? 'Reenviando...' : 'Reenviar correo de verificación'}
      </button>
    </div>

    <div className="space-y-2 text-center">
      <button
        type="button"
        onClick={() => setModeWithReset(MODE.LOGIN)}
        className="w-full text-sm font-medium text-[#011743]/70 hover:text-[#011743]"
      >
        Ya verifiqué mi correo, iniciar sesión
      </button>

      <button
        type="button"
        onClick={() => setModeWithReset(MODE.RESEND_VERIFICATION)}
        className="text-sm font-semibold text-[#1a56db]"
      >
        Usar otro correo
      </button>
    </div>
  </div>
)
  if (onlyRegister) {
    return <div className="mx-auto w-full max-w-[540px]">{renderRegisterMode()}</div>
  }

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
