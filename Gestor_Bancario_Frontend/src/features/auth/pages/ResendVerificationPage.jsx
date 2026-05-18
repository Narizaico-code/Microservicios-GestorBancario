import { ResendVerificationForm } from '../components/ResendVerificationForm.jsx'

export const ResendVerificationPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h1 className="text-3xl font-bold">Reenviar verificación</h1>
        <p className="mt-2 text-slate-300">Pide un nuevo correo de verificación.</p>
        <div className="mt-6">
          <ResendVerificationForm />
        </div>
      </div>
    </main>
  )
}
