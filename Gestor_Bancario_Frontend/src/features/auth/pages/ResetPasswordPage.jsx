import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPasswordWithAuthService } from '../../../shared/api/auth.js'
import cerditoFondoBlanco from '../../../assets/CerditoFondoBlanco.png'

export const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const tokenFromUrl = (searchParams.get('token') || '').trim()

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setMessage('')

    if (!tokenFromUrl) {
      setError(
        'Enlace inválido o incompleto. Solicita nuevamente la recuperación.'
      )
      return
    }

    setLoading(true)

    try {
      const result = await resetPasswordWithAuthService(
        tokenFromUrl,
        newPassword
      )

      setMessage(
        result.message || 'Contraseña actualizada correctamente'
      )

      setTimeout(() => {
        navigate('/auth/login', { replace: true })
      }, 1500)
    } catch (err) {
      setError(
        err?.message || 'No se pudo actualizar la contraseña'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* GRID */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* GLOW EFFECTS */}
      <div className="animate-pulse-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.04),transparent_40%)]" />

      <div className="animate-pulse-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.03),transparent_40%)] [animation-delay:2s]" />

      {/* CENTER LINE */}
      <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/10 lg:block" />

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1600px] lg:grid-cols-[1.05fr_0.95fr]">

        {/* ====================================================== */}
        {/* LEFT SIDE */}
        {/* ====================================================== */}
        <section className="relative hidden overflow-hidden border-r border-white/5 px-10 py-8 lg:flex lg:flex-col">

          {/* LOGO */}
          <div className="relative z-20">
            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-white/35">
              Gestor Bancario
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight">
              KINAL BANC
            </h1>
          </div>

          {/* CARD 1 */}
          <div
            className="animate-drift absolute left-10 top-44 rotate-[-12deg] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#232323] p-6 shadow-2xl backdrop-blur-xl"
            style={{
              width: 240,
              height: 145,
            }}
          >
            <div className="card-shimmer absolute inset-0 rounded-[2rem]" />

            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="h-10 w-16 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500" />

              <svg
                className="h-5 w-5 text-white/25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  d="M8.25 4.5a7.5 7.5 0 000 15M12 6.75a5.25 5.25 0 010 10.5M15.75 9a3.75 3.75 0 010 6"
                />
              </svg>
            </div>

            <p className="relative z-10 mt-5 font-mono text-[11px] font-bold tracking-[0.2em] text-white/55">
              •••• •••• •••• 4821
            </p>

            <div className="relative z-10 mt-5 flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Titular
                </p>

                <p className="text-[11px] font-black text-white/70">
                  KINAL BANK
                </p>
              </div>

              <p className="text-[11px] font-black text-white/75">
                GTQ 12,450.00
              </p>
            </div>
          </div>

          {/* CARD 2 */}
          <div
            className="animate-drift-alt absolute bottom-32 right-24 rotate-[10deg] overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#161616] to-[#222222] p-6 shadow-2xl backdrop-blur-xl"
            style={{
              width: 230,
              height: 140,
            }}
          >
            {/* Glow */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

            {/* Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />

            {/* Top */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="h-10 w-16 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500" />

              <svg
                className="h-5 w-5 text-white/25"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  d="M8.25 4.5a7.5 7.5 0 000 15M12 6.75a5.25 5.25 0 010 10.5M15.75 9a3.75 3.75 0 010 6"
                />
              </svg>
            </div>

            {/* Number */}
            <p className="relative z-10 mt-5 font-mono text-[11px] font-bold tracking-[0.2em] text-white/55">
              •••• •••• •••• 7703
            </p>

            {/* Bottom */}
            <div className="relative z-10 mt-5 flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Mastercard
                </p>

                <p className="text-[11px] font-black text-white/70">
                  USD 3,820.00
                </p>
              </div>
            </div>
          </div>

          {/* TOP WIDGET */}
          <div className="animate-float absolute right-20 top-20 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-xl">

            <p className="text-xs font-black uppercase tracking-wider text-white/25">
              Transacciones
            </p>

            <p className="mt-2 text-4xl font-black">
              14,823
            </p>

            <div className="mt-5 flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="w-1 rounded-full bg-white/25"
                  style={{
                    height: `${10 + item * 4}px`,
                  }}
                />
              ))}
            </div>

          </div>

          {/* SECURITY BADGE */}
          <div className="animate-float-reverse absolute left-16 bottom-48 rounded-full border border-yellow-400/20 bg-yellow-400/10 p-5 backdrop-blur-xl">
            <span className="text-2xl font-black text-yellow-300">
              ₿
            </span>
          </div>

          {/* MAIN CONTENT */}
          <div className="relative z-10 mt-auto max-w-[620px] pb-20">

            <p className="text-sm font-black uppercase tracking-[0.35em] text-white/30">
              Seguridad avanzada
            </p>

            <h2 className="mt-6 text-[5.5rem] font-black leading-[0.9] tracking-[-0.04em]">

              Restablece tu
              <br />

              acceso con total

              <br />

              <span className="text-white/25">
                seguridad.
              </span>

            </h2>

            <p className="mt-8 max-w-xl text-2xl leading-[2.2rem] text-white/45">
              Crea una nueva contraseña segura para continuar
              utilizando todos los servicios de Kinal Banc.
            </p>

          </div>

        </section>

        {/* ====================================================== */}
        {/* RIGHT SIDE */}
        {/* ====================================================== */}
        <section className="relative flex items-center justify-center px-6 py-8 lg:px-12">

          {/* ORBITAL RINGS */}
          <>
            <div className="animate-spin-slow absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />

            <div
              className="animate-spin-slow absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
              style={{
                animationDirection: 'reverse',
              }}
            />
          </>

          <div className="relative z-10 w-full max-w-[460px]">

            {/* SECURITY */}
            <div className="animate-drift absolute -top-20 right-0 hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 backdrop-blur-xl lg:block">

              <p className="text-sm font-bold text-emerald-400">
                Conexión segura
              </p>

              <p className="mt-1 text-xs text-white/40">
                SSL 256-bit
              </p>

            </div>

            {/* HEADER */}
            <div className="mb-9 text-center">

              <img
                src={cerditoFondoBlanco}
                alt="Cerdito"
                className="animate-float mx-auto h-20 w-20 rounded-full border border-white/15 bg-white object-cover p-2 shadow-[0_0_30px_rgba(255,255,255,0.08)]"
              />

              <h2 className="mt-7 text-[3.3rem] font-black leading-none tracking-tight">
                Nueva contraseña
              </h2>

              <p className="mt-3 text-lg text-white/45">
                Ingresa tu nueva contraseña para continuar
              </p>

            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.02] p-6 shadow-[0_0_80px_rgba(255,255,255,0.03)] backdrop-blur-2xl"
            >

              {/* TOKEN */}
              <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/55">

                {tokenFromUrl
                  ? 'Token de recuperación detectado correctamente.'
                  : 'No se encontró un token válido en la URL.'}

              </div>

              {/* PASSWORD */}
              <label className="block">

                <span className="mb-3 block text-sm font-bold uppercase tracking-wider text-white/45">
                  Nueva contraseña
                </span>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(event.target.value)
                  }
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-white outline-none transition placeholder:text-white/20 focus:border-[#2c3954] focus:bg-[#1f293d]"
                />

              </label>

              {/* ERROR */}
              {error ? (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              {/* SUCCESS */}
              {message ? (
                <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                  {message}
                </div>
              ) : null}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading || !tokenFromUrl}
                className="mt-7 w-full rounded-2xl bg-white px-4 py-3.5 text-base font-black text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {loading
                  ? 'Actualizando...'
                  : 'Actualizar contraseña'}

              </button>

            </form>

            {/* INFO */}
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">

              <p className="font-semibold text-white/80">
                Tu seguridad es nuestra prioridad
              </p>

              <p className="mt-2 text-sm leading-7 text-white/35">
                Utilizamos sistemas avanzados de protección y
                cifrado para proteger tu información bancaria.
              </p>

            </div>

            {/* LOGIN */}
            <div className="mt-6 text-center text-sm text-white/35">

              ¿Recordaste tu contraseña?{' '}

              <Link
                to="/auth/login"
                className="font-bold text-white transition hover:text-white/70"
              >
                Iniciar sesión
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  )
}