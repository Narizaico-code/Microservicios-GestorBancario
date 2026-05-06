import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resetPasswordWithAuthService } from '../../../shared/api/auth.js'

export default function ResetPasswordPage() {
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await resetPasswordWithAuthService(token, newPassword)
    setMessage(result.message || 'Contraseña actualizada')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <form className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold">Restablecer contraseña</h1>
        <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Token" className="mt-6 w-full rounded-2xl border px-4 py-3 text-slate-900" />
        <input value={newPassword} onChange={(event) => setNewPassword(event.target.value)} type="password" placeholder="Nueva contraseña" className="mt-4 w-full rounded-2xl border px-4 py-3 text-slate-900" />
        {message ? <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
        <button className="mt-6 w-full rounded-2xl bg-white px-4 py-3 text-slate-950">Actualizar</button>
        <Link to="/auth" className="mt-4 block text-center text-cyan-300 hover:underline">Volver al login</Link>
      </form>
    </main>
  )
}