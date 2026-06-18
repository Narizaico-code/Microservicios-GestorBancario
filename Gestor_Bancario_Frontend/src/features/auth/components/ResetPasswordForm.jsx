import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPasswordWithAuthService } from '../../../shared/api/auth.js'
import cerditoFondoBlanco from '../../../assets/CerditoFondoBlanco.png'

export const ResetPasswordForm = () => {
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
      setError('Enlace inválido o incompleto. Solicita nuevamente la recuperación.')
      return
    }

    setLoading(true)

    try {
      const result = await resetPasswordWithAuthService(tokenFromUrl, newPassword)
      setMessage(result.message || 'Contraseña actualizada correctamente')
      setTimeout(() => {
        navigate('/auth/login', { replace: true })
      }, 1500)
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative flex items-center justify-center px-6 py-8 lg:px-12">

      {/* ORBITAL RINGS */}
      <div className="animate-spin-slow absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]" />
      <div
        className="animate-spin-slow absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]"
        style={{ animationDirection: 'reverse' }}
      />

      <div className="relative z-10 w-full max-w-[460px]">

        {/* SECURITY */}
        <div className="animate-drift absolute -top-20 right-0 hidden rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 backdrop-blur-xl lg:block">
          <p className="text-sm font-bold text-emerald-400">Conexión segura</p>
          <p className="mt-1 text-xs text-white/40">SSL 256-bit</p>
        </div>

        {/* HEADER */}
        <div className="mb-9 text-center">
          <img
            src={cerditoFondoBlanco}
            alt="Cerdito"
            className="animate-float mx-auto h-20 w-20 rounded-full border border-white/15 bg-white object-cover p-2 shadow-[0_0_30px_rgba(255,255,255,0.08)]"
          />
          <h2 className="mt-7 text-[3.3rem] font-black leading-none tracking-tight">Nueva contraseña</h2>
          <p className="mt-3 text-lg text-white/45">Ingresa tu nueva contraseña para continuar</p>
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
            <span className="mb-3 block text-sm font-bold uppercase tracking-wider text-white/45">Nueva contraseña</span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
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
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
        </form>

        {/* INFO */}
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <p className="font-semibold text-white/80">Tu seguridad es nuestra prioridad</p>
          <p className="mt-2 text-sm leading-7 text-white/35">
            Utilizamos sistemas avanzados de protección y cifrado para proteger tu información bancaria.
          </p>
        </div>

        {/* LOGIN */}
        <div className="mt-6 text-center text-sm text-white/35">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/auth/login" className="font-bold text-white transition hover:text-white/70">
            Iniciar sesión
          </Link>
        </div>

      </div>

    </section>
  )
}
