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
      setError('Enlace inválido o incompleto. Solicita nuevamente la recuperación de contraseña.')
      return
    }

    setLoading(true)

    try {
      const result = await resetPasswordWithAuthService(tokenFromUrl, newPassword)
      setMessage(result.message || 'Contraseña actualizada correctamente')
      setTimeout(() => {
        navigate('/auth/login', { replace: true })
      }, 1200)
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar la contraseña')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-6 text-[#011743] lg:px-8 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1400px] overflow-hidden rounded-[2rem] border border-[#011743]/15 bg-white shadow-[0_30px_80px_rgba(1,23,67,0.14)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden flex-col justify-between bg-[#011743] px-8 py-10 text-white lg:flex">
          <div>
            <h1 className="text-5xl font-black leading-tight tracking-tight">Actualiza tu contraseña</h1>
            <p className="mt-6 text-xl leading-8 text-white/85">
              Protege tu cuenta creando una clave nueva y segura para continuar usando tu banca en línea.
            </p>
          </div>

          <div className="rounded-3xl border border-white/35 bg-white/[0.04] px-6 py-5">
            <p className="text-3xl font-bold">Recuperación segura</p>
            <p className="mt-2 text-sm text-white/75">
              El token se valida desde el enlace. Solo necesitas ingresar tu nueva contraseña.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white px-6 py-8 lg:px-10 lg:py-12">
          <form
            className="w-full max-w-xl rounded-[2rem] border border-[#011743]/8 bg-white px-8 py-7 shadow-[0_18px_40px_rgba(1,23,67,0.10)]"
            onSubmit={handleSubmit}
          >
            <h2 className="text-4xl font-black tracking-tight text-[#011743]">Cambiar contraseña</h2>
            <p className="mt-3 text-lg text-[#011743]/75">Completa los datos para restablecer tu acceso.</p>

            <div className="mt-6 flex justify-center">
              <img
                src={cerditoFondoBlanco}
                alt="Cerdito bancario"
                className="h-28 w-auto object-contain"
              />
            </div>

            <div className="mt-7 space-y-4">
              <div className="rounded-2xl border border-[#011743]/20 bg-[#011743]/[0.04] px-4 py-3 text-sm text-[#011743]/80">
                {tokenFromUrl
                  ? 'Token de recuperación detectado en la URL.'
                  : 'No se encontró token en la URL. Vuelve a abrir el enlace enviado por correo.'}
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#011743]">Nueva contraseña</span>
                <input
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-[#011743]/30 bg-white px-4 py-3 text-[#011743] outline-none transition focus:border-[#011743] focus:ring-4 focus:ring-[#011743]/10"
                />
              </label>
            </div>

            {error ? (
              <div className="mt-5 rounded-2xl border border-[#d55353]/30 bg-[#d55353]/8 px-4 py-3 text-sm text-[#d55353]">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || !tokenFromUrl}
              className="mt-6 w-full rounded-2xl bg-[#d55353] px-4 py-3 text-lg font-bold text-white transition hover:bg-[#c4454e] disabled:opacity-50"
            >
              {loading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>

            <Link
              to="/auth"
              className="mt-4 block text-center text-base font-semibold text-[#011743] transition hover:text-[#02235f] hover:underline"
            >
              Volver al login
            </Link>
          </form>
        </section>
      </div>
    </main>
  )
}