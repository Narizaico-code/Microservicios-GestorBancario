import { ForgotPasswordForm } from '../components/ForgotPasswordForm.jsx'

export const ForgotPasswordPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-bold">Olvidé mi contraseña</h1>
        <p className="mt-2 text-slate-300">Solicita el correo de recuperación.</p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  )
}