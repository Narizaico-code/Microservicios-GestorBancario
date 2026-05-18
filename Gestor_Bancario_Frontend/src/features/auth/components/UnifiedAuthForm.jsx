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

/* -- Shared sub-components --------------------------------------------- */
const Avatar = ({ dynamic }) => (
  <div className="mb-5 flex justify-center">
    <img
      src={cerditoFondoBlanco}
      alt="Kinal Banc"
      className={`h-[70px] w-[70px] rounded-full border object-contain p-2 ${
        dynamic ? 'border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)]' : 'border-white/8 bg-white/5'
      }`}
    />
  </div>
)

const Heading = ({ title, sub, dynamic }) => (
  <div className="mb-5 text-center">
    <h2 className={`text-2xl font-black tracking-tight ${dynamic ? 'text-[color:var(--theme-text)]' : 'text-white'}`}>{title}</h2>
    {sub && <p className={`mt-1 text-[13px] ${dynamic ? 'text-[color:var(--theme-text-muted)]' : 'text-white/40'}`}>{sub}</p>}
  </div>
)

const ErrorBanner = ({ error }) => error ? (
  <div className="mt-3 whitespace-pre-line rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-[13px] text-red-300">
    {error}
  </div>
) : null

const SuccessBanner = ({ success }) => success ? (
  <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-[13px] text-emerald-400">
    {success}
  </div>
) : null

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required, minLength, pattern, accept, dynamic }) => (
  <label className="block">
    <span className={`mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] ${dynamic ? 'text-[color:var(--theme-text-muted)]' : 'text-white/40'}`}>{label}</span>
    <input
      type={type}
      name={name}
      value={type !== 'file' ? value : undefined}
      onChange={onChange}
      required={required}
      minLength={minLength}
      pattern={pattern}
      accept={accept}
      placeholder={placeholder}
      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-0 ${
        dynamic
          ? 'border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] text-[color:var(--theme-text)] placeholder:text-[color:var(--theme-text-muted)] focus:border-[color:var(--theme-accent)]'
          : 'border-white/10 bg-[#1a1a1a] text-white placeholder-white/25 focus:border-white/35'
      }`}
    />
  </label>
)

const PrimaryButton = ({ children, onClick, disabled, type = 'submit', dynamic }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`mt-4 w-full rounded-xl py-3 text-[15px] font-bold transition hover:opacity-90 disabled:opacity-50 ${
      dynamic ? 'bg-[color:var(--theme-accent)] text-white' : 'bg-white text-black'
    }`}
  >
    {children}
  </button>
)

const LinkButton = ({ onClick, children, muted = false, dynamic }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-[13px] font-bold transition hover:opacity-80 ${
      dynamic
        ? muted ? 'text-[color:var(--theme-text-muted)]' : 'text-[color:var(--theme-accent)]'
        : muted ? 'text-white/45' : 'text-white/65'
    }`}
  >
    {children}
  </button>
)

const Card = ({ children, dynamic }) => (
  <div className={`rounded-[18px] border ${dynamic ? 'border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] text-[color:var(--theme-text)] shadow-sm' : 'border-white/8 bg-[#111111] text-white'} px-6 py-6`}>
    {children}
  </div>
)

export const UnifiedAuthForm = ({ onRegistered, initialMode = MODE.LOGIN, onlyRegister = false, dynamic = false } = {}) => {
  const [mode, setMode] = useState(initialMode)
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '', profilePicture: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const setModeWithReset = (nextMode) => { setError(''); setSuccess(''); setMode(nextMode) }

  const getReadableError = (err, fallback) => {
    const apiErrors = err?.payload?.errors
    if (Array.isArray(apiErrors) && apiErrors.length > 0)
      return apiErrors.map((i) => `• ${i?.field || 'campo'}: ${i?.message || 'valor inválido'}`).join('\n')
    return err?.message || fallback
  }

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    setForm((prev) => ({ ...prev, [name]: type === 'file' ? files?.[0] || null : value }))
  }

  /* ── Submit handlers ─────────────────────────────────────────────────── */
  const handleSubmitLogin = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      const res = await loginWithAuthService({ email: form.email, password: form.password })
      const session = { token: res.token, user: res.userDetails, expiresAt: res.expiresAt }
      login(session)
      navigate(session.user?.role === 'ADMIN_ROLE' ? '/dashboard' : '/client')
    } catch (err) { setError(getReadableError(err, 'No se pudo iniciar sesión')) }
    finally { setLoading(false) }
  }

  const handleSubmitRegister = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      const fd = new FormData()
      fd.append('name', form.name); fd.append('email', form.email)
      fd.append('password', form.password); fd.append('phone', form.phone)
      if (form.profilePicture) fd.append('profilePicture', form.profilePicture)
      await registerWithAuthService(fd)
      setRegisteredEmail(form.email)
      setSuccess('Cuenta creada. Revisa tu correo para verificarla.')
      setForm((c) => ({ ...c, password: '', name: '', phone: '', profilePicture: null }))
      setMode(MODE.WAITING_VERIFICATION)
      if (typeof onRegistered === 'function') try { onRegistered() } catch (_) {}
    } catch (err) { setError(getReadableError(err, 'No se pudo crear la cuenta')) }
    finally { setLoading(false) }
  }

  const handleSubmitForgotPassword = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      await forgotPasswordWithAuthService(form.email)
      setSuccess('Se envió un enlace de recuperación a tu email')
      setTimeout(() => setMode(MODE.LOGIN), 2000)
    } catch (err) { setError(getReadableError(err, 'No se pudo enviar el email')) }
    finally { setLoading(false) }
  }

  const handleSubmitResend = async (e) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true)
    try {
      await resendVerificationWithAuthService(form.email)
      setRegisteredEmail(form.email)
      setSuccess('Se reenvió el correo de verificación. Revisa tu bandeja y spam.')
    } catch (err) { setError(getReadableError(err, 'No se pudo reenviar el email')) }
    finally { setLoading(false) }
  }

  const handleResendFromWaiting = async () => {
    const email = registeredEmail || form.email
    if (!email) { setModeWithReset(MODE.RESEND_VERIFICATION); return }
    setLoading(true); setError(''); setSuccess('')
    try {
      await resendVerificationWithAuthService(email)
      setSuccess('Correo de verificación reenviado correctamente.')
    } catch (err) { setError(getReadableError(err, 'No se pudo reenviar el correo')) }
    finally { setLoading(false) }
  }

  /* ── Render: LOGIN ───────────────────────────────────────────────────── */
  const renderLoginMode = () => (
    <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
      <Avatar />
      <Heading title="¡Bienvenido de nuevo!" sub="Inicia sesión para continuar" />

      <Card>
        <div className="flex flex-col gap-4">

          {/* Email con ícono */}
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Correo electrónico
            </span>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 16a6 6 0 1112 0H2z" />
              </svg>
              <input
                type="email" name="email" value={form.email} onChange={handleChange} required
                placeholder="ejemplo@banco.com"
                className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] py-3 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
              />
            </div>
          </label>

          {/* Contraseña con toggle */}
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Contraseña
            </span>
            <div className="relative">
              <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 8V6a5 5 0 1110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2a3 3 0 10-6 0v2h6V6z" clipRule="evenodd" />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} required
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] py-3 pl-10 pr-11 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition"
                aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword
                  ? <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.042.15-2.046.425-2.99"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/></svg>
                  : <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/></svg>
                }
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <LinkButton onClick={() => setModeWithReset(MODE.FORGOT_PASSWORD)}>
              ¿Olvidaste tu contraseña?
            </LinkButton>
          </div>
        </div>

        <ErrorBanner error={error} />
        <SuccessBanner success={success} />
        <PrimaryButton disabled={loading}>{loading ? 'Ingresando...' : 'Ingresar'}</PrimaryButton>
      </Card>

      <div className="flex flex-col gap-2.5">
        <div className="rounded-xl border border-white/6 bg-[#111111] px-4 py-3 text-xs text-white/30">
          <p className="mb-1 font-bold text-white/40">Tu seguridad es nuestra prioridad</p>
          Contamos con tecnología de encriptación para proteger tu información.
        </div>
        <p className="text-center text-[13px] text-white/35">
          ¿No tienes cuenta?{' '}
          <button type="button" onClick={() => setModeWithReset(MODE.REGISTER)} className="font-bold text-white hover:opacity-80 transition">
            Crear una cuenta
          </button>
        </p>
      </div>
    </form>
  )

  /* ── Render: REGISTER ────────────────────────────────────────────────── */
  const renderRegisterMode = () => (
    <form onSubmit={handleSubmitRegister} className="flex flex-col gap-4">
      <Avatar dynamic={dynamic} />
      <Heading title="Crear cuenta" sub="Únete a nuestro sistema bancario" dynamic={dynamic} />

      <Card dynamic={dynamic}>
        <div className="flex flex-col gap-4">
          <InputField label="Nombre" name="name" value={form.name} onChange={handleChange} required placeholder="Tu nombre completo" dynamic={dynamic} />
          <InputField label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="tu@email.com" dynamic={dynamic} />
          <InputField label="Teléfono" name="phone" type="tel" value={form.phone} onChange={handleChange} required pattern="\d{8}" placeholder="12345678" dynamic={dynamic} />
          <InputField label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} required minLength="8" placeholder="Mínimo 8 caracteres" dynamic={dynamic} />
          <InputField label="Foto de perfil (opcional)" name="profilePicture" type="file" accept="image/*" onChange={handleChange} dynamic={dynamic} />
        </div>
        <ErrorBanner error={error} />
        <SuccessBanner success={success} />
        <PrimaryButton disabled={loading} dynamic={dynamic}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</PrimaryButton>
      </Card>

      <div className="flex items-center justify-center gap-4 text-[13px]">
        <LinkButton muted onClick={() => { setForm((c) => ({ ...c, email: c.email || registeredEmail })); setModeWithReset(MODE.RESEND_VERIFICATION) }} dynamic={dynamic}>
          ¿No te llegó el correo?
        </LinkButton>
        <span className={dynamic ? 'text-[color:var(--theme-text-muted)]' : 'text-white/15'}>|</span>
        <LinkButton onClick={() => setModeWithReset(MODE.LOGIN)} dynamic={dynamic}>Iniciar sesión</LinkButton>
      </div>
    </form>
  )

  /* ── Render: FORGOT PASSWORD ─────────────────────────────────────────── */
  const renderForgotPasswordMode = () => (
    <form onSubmit={handleSubmitForgotPassword} className="flex flex-col gap-4">
      <Avatar />
      <Heading title="Recuperar contraseña" sub="Recupera acceso a tu cuenta" />

      <Card>
        <div className="mb-4 rounded-xl border border-white/7 bg-white/3 px-4 py-3 text-[13px] text-white/40">
          Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
        </div>
        <InputField label="Correo electrónico" name="email" type="email" value={form.email} required placeholder="tu@email.com" />
        <ErrorBanner error={error} />
        <SuccessBanner success={success} />
        <PrimaryButton disabled={loading}>{loading ? 'Enviando...' : 'Enviar enlace'}</PrimaryButton>
      </Card>

      <p className="text-center">
        <LinkButton muted onClick={() => setModeWithReset(MODE.LOGIN)}>← Volver al inicio de sesión</LinkButton>
      </p>
    </form>
  )

  /* ── Render: RESEND VERIFICATION ─────────────────────────────────────── */
  const renderResendMode = () => (
    <form onSubmit={handleSubmitResend} className="flex flex-col gap-4">
      <Avatar />
      <Heading title="Reenviar verificación" sub="Verifica tu email nuevamente" />

      <Card>
        <div className="mb-4 rounded-xl border border-white/7 bg-white/3 px-4 py-3 text-[13px] text-white/40">
          Si no recibiste el email de verificación, ingresa tu email y te lo reenviamos.
        </div>
        <InputField label="Correo electrónico" name="email" type="email" value={form.email} required placeholder="tu@email.com" />
        <ErrorBanner error={error} />
        <SuccessBanner success={success} />
        <PrimaryButton disabled={loading}>{loading ? 'Enviando...' : 'Reenviar verificación'}</PrimaryButton>
      </Card>

      <p className="text-center">
        <LinkButton muted onClick={() => setModeWithReset(MODE.REGISTER)}>← Volver a crear cuenta</LinkButton>
      </p>
    </form>
  )

  /* ── Render: WAITING VERIFICATION ────────────────────────────────────── */
  const renderWaitingMode = () => (
    <div className="flex flex-col gap-4">
      <Avatar />
      <Heading title="Verifica tu correo" sub="Tu cuenta está pendiente de activación" />

      <Card>
        <div className="mb-3 rounded-xl border border-white/7 bg-white/3 px-4 py-3 text-[13px] text-white/50">
          <p className="mb-1 font-bold">Cuenta creada correctamente</p>
          <p className="break-words">
            Esperando verificación del correo:{' '}
            <span className="font-semibold text-white">{registeredEmail || form.email || 'Sin email registrado'}</span>
          </p>
        </div>

        <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/7 bg-white/3 px-4 py-3">
          <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-[13px] text-white/40">Pendiente de verificación. Revisa bandeja de entrada y spam.</p>
        </div>

        {error && <div className="mb-3 whitespace-pre-line rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-[13px] text-red-300">{error}</div>}
        {success && <div className="mb-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-[13px] text-emerald-400">{success}</div>}

        <PrimaryButton type="button" onClick={handleResendFromWaiting} disabled={loading}>
          {loading ? 'Reenviando...' : 'Reenviar correo de verificación'}
        </PrimaryButton>
      </Card>

      <div className="flex flex-col items-center gap-2">
        <LinkButton muted onClick={() => setModeWithReset(MODE.LOGIN)}>Ya verifiqué mi correo, iniciar sesión</LinkButton>
        <LinkButton onClick={() => setModeWithReset(MODE.RESEND_VERIFICATION)}>Usar otro correo</LinkButton>
      </div>
    </div>
  )

  /* ── Render root ─────────────────────────────────────────────────────── */
  if (onlyRegister) return <div className="mx-auto w-full max-w-[540px]">{renderRegisterMode()}</div>

  return (
    <div className="mx-auto w-full max-w-[480px]">
      {mode === MODE.LOGIN               && renderLoginMode()}
      {mode === MODE.REGISTER            && renderRegisterMode()}
      {mode === MODE.FORGOT_PASSWORD     && renderForgotPasswordMode()}
      {mode === MODE.RESEND_VERIFICATION && renderResendMode()}
      {mode === MODE.WAITING_VERIFICATION && renderWaitingMode()}
    </div>
  )
}

