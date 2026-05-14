import { useState } from 'react'
import { forgotPasswordWithAuthService } from '../../../shared/api/auth.js'

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await forgotPasswordWithAuthService(email)
    setMessage(result.message || 'Correo enviado')
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Correo" className="w-full rounded-2xl border px-4 py-3" />
      {message ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
      <button className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-white">Enviar</button>
    </form>
  )
}