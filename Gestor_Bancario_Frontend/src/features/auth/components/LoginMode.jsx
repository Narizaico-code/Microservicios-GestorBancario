import { Avatar, Heading, Card, ErrorBanner, SuccessBanner, PrimaryButton, LinkButton } from './AuthPrimitives.jsx'
import { MODE } from '../hooks/useUnifiedAuth.js'

export const LoginMode = ({ auth }) => {
  const { form, handleChange, error, success, loading, showPassword, setShowPassword, setMode, handleSubmitLogin } = auth

  return (
    <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
      <Avatar />
      <Heading title="¡Bienvenido de nuevo!" sub="Inicia sesión para continuar" />

      <Card>
        <div className="flex flex-col gap-4">
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Correo electrónico
            </span>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a4 4 0 100 8 4 4 0 000-8zM2 16a6 6 0 1112 0H2z" />
              </svg>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="ejemplo@banco.com"
                className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] py-3 pl-10 pr-4 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Contraseña
            </span>
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5 8V6a5 5 0 1110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2a3 3 0 10-6 0v2h6V6z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] py-3 pl-10 pr-11 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/60 transition"
                aria-label={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.042.15-2.046.425-2.99" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <LinkButton onClick={() => setMode(MODE.FORGOT_PASSWORD)}>¿Olvidaste tu contraseña?</LinkButton>
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
          <button
            type="button"
            onClick={() => setMode(MODE.REGISTER)}
            className="font-bold text-white hover:opacity-80 transition"
          >
            Crear una cuenta
          </button>
        </p>
      </div>
    </form>
  )
}
