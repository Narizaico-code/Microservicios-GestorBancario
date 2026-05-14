import { useState } from 'react'
import { submitSignupRequestWithAuthService } from '../../../shared/api/auth.js'

const initialForm = { name: '', email: '', password: '', phone: '', profilePicture: null }

export const RegisterForm = () => {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value, files, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'file' ? files?.[0] || null : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const result = await submitSignupRequestWithAuthService(form)
      setMessage(result.message || 'Solicitud enviada. Espera aprobación del administrador y verifica tu correo.')
    } catch (requestError) {
      setError(requestError.message || 'No se pudo enviar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      <input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      <button disabled={loading} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-white">{loading ? 'Procesando...' : 'Enviar solicitud'}</button>
    </form>
  )
}