import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitSignupRequestWithAuthService } from '../../../shared/api/auth.js'

const initialForm = { name: '', email: '', password: '', phone: '', profilePicture: null }

<<<<<<< HEAD
export default function SignupRequestPage() {
  const navigate = useNavigate()
=======
export const SignupRequestPage = () => {
>>>>>>> 82b5b6ef2d0175768938cc0f9b714df51ebb5b20
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (event) => {
    const { name, value, files, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'file' ? files?.[0] || null : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const result = await submitSignupRequestWithAuthService(form)
      setMessage(result.message || 'Cuenta solicitada correctamente, esperando APROBACION de Administrador')
      setSuccess(true)
    } catch (requestError) {
      setError(requestError.message || 'No se pudo enviar la solicitud')
      setMessage('')
    }
  }

  useEffect(() => {
    if (!success) return

    const timer = setTimeout(() => {
      navigate('/auth', { replace: true })
    }, 2500)

    return () => clearTimeout(timer)
  }, [success, navigate])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold">Solicitud de acceso</h1>
        <p className="mt-2 text-slate-300">Envía una solicitud para aprobación.</p>
        <div className="mt-6 space-y-3">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" className="w-full rounded-2xl border px-4 py-3 text-slate-900" />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Correo" className="w-full rounded-2xl border px-4 py-3 text-slate-900" />
          <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" className="w-full rounded-2xl border px-4 py-3 text-slate-900" />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" className="w-full rounded-2xl border px-4 py-3 text-slate-900" />
          <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} className="w-full rounded-2xl border px-4 py-3 text-slate-300" />
        </div>
        {message ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        {error ? <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
        <button className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-slate-950">Enviar solicitud</button>
      </form>
    </main>
  )
}