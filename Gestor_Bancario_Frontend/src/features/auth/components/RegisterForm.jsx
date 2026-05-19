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
      <div>
        <label className="block text-sm text-slate-600 ml-1 mb-1">Nombre</label>
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm text-slate-600 ml-1 mb-1">Correo</label>
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm text-slate-600 ml-1 mb-1">Contraseña</label>
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm text-slate-600 ml-1 mb-1">Teléfono</label>
        <input name="phone" placeholder="Teléfono" value={form.phone} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      </div>
      <div>
        <label className="block text-sm text-slate-600 ml-1 mb-1">Fecha de Nacimiento</label>
        <input name="fechaNacimiento" type="date" value={form.fechaNacimiento || ''} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
        <p className="text-xs text-slate-500 ml-2 mt-1">Obligatorio. El cliente debe ser mayor de 18 años.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-600 ml-1 mb-1">DPI</label>
        <input name="dpi" placeholder="Ej. 1234567890123" value={form.dpi || ''} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
        <p className="text-xs text-slate-500 ml-2 mt-1">Obligatorio. Exactamente 13 dígitos numéricos.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-600 ml-1 mb-1">Ingresos Mensuales</label>
        <input name="ingresosMensuales" type="number" step="0.01" placeholder="Ej. 5000.00" value={form.ingresosMensuales || ''} onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
        <p className="text-xs text-slate-500 ml-2 mt-1">Obligatorio. Mayor a 0. Máximo 2 decimales.</p>
      </div>
      <div>
        <label className="block text-sm text-slate-600 ml-1 mb-1">Foto de Perfil</label>
        <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} className="w-full rounded-2xl border px-4 py-3" />
      </div>
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      <button disabled={loading} className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-white">{loading ? 'Procesando...' : 'Enviar solicitud'}</button>
    </form>
  )
}