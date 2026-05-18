import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginWithAuthService } from '../../../shared/api/auth.js'
import { useAuthStore } from '../store/authStore.js'

const initialForm = { email: '', password: '' }

export const LoginForm = () => {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const submitLabel = useMemo(() => (loading ? 'Ingresando...' : 'Ingresar'), [loading])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await loginWithAuthService(form)
      const nextSession = {
        token: response.token,
        user: response.userDetails,
        expiresAt: response.expiresAt,
      }

      login(nextSession)
      setForm(initialForm)
      navigate(nextSession.user?.role === 'ADMIN_ROLE' ? '/dashboard' : '/client', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'No se pudo iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-950/30" onSubmit={handleSubmit}>
      <div>
        <h3 className="text-2xl font-bold text-slate-950">Iniciar sesión</h3>
        <p className="mt-2 text-sm text-slate-500">Usa tu correo y contraseña del AuthService.</p>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Correo electrónico</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Contraseña</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
        />
      </label>

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <button type="submit" disabled={loading} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70">
        {submitLabel}
      </button>

      <div className="flex flex-col gap-2 text-sm">
        <Link to="/auth/forgot-password" className="text-cyan-700 hover:underline">Olvidé mi contraseña</Link>
        <Link to="/auth/resend-verification" className="text-cyan-700 hover:underline">Reenviar verificación</Link>
        <Link to="/auth/signup-request" className="text-cyan-700 hover:underline">Solicitud de acceso</Link>
      </div>
    </form>
  )
}