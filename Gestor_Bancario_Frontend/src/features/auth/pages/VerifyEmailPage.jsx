import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { verifyEmailLinkWithAuthService } from '../../../shared/api/auth.js'

export const VerifyEmailPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tokenFromQuery = searchParams.get('token') || ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleVerify = async () => {
    const token = tokenFromQuery.trim()
    if (!token) {
      setError('Link inválido o incompleto. Solicita un nuevo correo de verificación.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await verifyEmailLinkWithAuthService(token)
      setSuccess('Correo verificado correctamente. Redirigiendo al login...')
      setTimeout(() => {
        navigate('/auth', { replace: true })
      }, 2000)
    } catch (requestError) {
      setError(requestError.message || 'No fue posible verificar el correo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tokenFromQuery) {
      handleVerify()
      return
    }

    setError('No se encontró token en la URL. Solicita un nuevo enlace de verificación.')
  }, [tokenFromQuery])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-bold">Verificar email</h1>
        <p className="mt-3 text-slate-300">Confirmando tu correo automáticamente desde el enlace.</p>

        {error && <p className="mt-4 rounded-xl border border-red-300/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
        {success && <p className="mt-4 rounded-xl border border-emerald-300/40 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</p>}

        {loading && <p className="mt-4 text-center text-sm text-slate-300">Verificando...</p>}
        <Link to="/auth" className="mt-4 block text-center text-cyan-300 hover:underline">Volver al login</Link>
      </div>
    </main>
  )
}
