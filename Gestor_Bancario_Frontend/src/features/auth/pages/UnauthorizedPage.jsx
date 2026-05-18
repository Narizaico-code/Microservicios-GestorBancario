import { Link } from 'react-router-dom'

export const UnauthorizedPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <h1 className="text-3xl font-bold">No autorizado</h1>
        <p className="mt-3 text-slate-300">No tienes permisos para ver esta sección.</p>
        <Link to="/auth" className="mt-6 inline-flex rounded-2xl bg-white px-4 py-3 text-slate-950">Volver</Link>
      </div>
    </main>
  )
}