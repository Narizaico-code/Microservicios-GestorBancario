import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitSignupRequestWithAuthService } from '../../../shared/api/auth.js'

const initialForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  fechaNacimiento: '',
  dpi: '',
  ingresosMensuales: '',
  profilePicture: null
}

export const SignupRequestPage = () => {
  const navigate = useNavigate()
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
      setMessage(result.message || 'Solicitud enviada correctamente.')
      setSuccess(true)
    } catch (requestError) {
      setError(requestError.message || 'No se pudo enviar la solicitud')
      setMessage('')
    }
  }

  useEffect(() => {
    if (!success) return
    const timer = setTimeout(() => {
      navigate('/auth', {
        replace: true,
        state: { infoMessage: 'Esperando autorización de Administrador' },
      })
    }, 1000)
    return () => clearTimeout(timer)
  }, [success, navigate])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[460px] flex-col gap-5 rounded-[18px] border border-white/8 bg-[#111111] p-8"
      >
        {/* Header */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
            Kinal Banc
          </p>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Solicitud de acceso
          </h1>
          <p className="mt-1 text-[13px] text-white/40">
            Envía una solicitud para aprobación del Administrador.
          </p>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-4">

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Nombre
            </span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Correo electrónico
            </span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Contraseña
            </span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Teléfono
            </span>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="12345678"
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">DPI</span>
            <input
              name="dpi" value={form.dpi} onChange={handleChange} required placeholder="13 dígitos" pattern="\d{13}"
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">Fecha de Nacimiento</span>
            <input
              name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition focus:border-white/35"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">Ingresos Mensuales (GTQ)</span>
            <input
              name="ingresosMensuales" type="number" min="0" value={form.ingresosMensuales} onChange={handleChange} required placeholder="Ej. 5000.00"
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-white/35"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-white/40">
              Foto de perfil (opcional)
            </span>
            <input
              name="profilePicture"
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white/45 outline-none transition focus:border-white/35"
            />
          </label>
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-[13px] text-emerald-400">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-[13px] text-red-300">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-white py-3 text-[15px] font-bold text-black transition hover:opacity-90"
        >
          Enviar solicitud
        </button>
      </form>
    </main>
  )
}