import { Link } from 'react-router-dom'

const authRoutes = [
  { to: '/auth/login', label: 'Iniciar sesión' },
  { to: '/auth/signup-request', label: 'Solicitud de acceso' },
  { to: '/auth/forgot-password', label: 'Olvidé mi contraseña' },
  { to: '/auth/reset-password', label: 'Restablecer contraseña' },
  { to: '/auth/verify-email', label: 'Verificar email' },
  { to: '/auth/resend-verification', label: 'Reenviar verificación' },
]

export const AuthCenterPage = () => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_42%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
            Gestor Bancario
          </p>
          <h1 className="mt-1 text-lg font-semibold text-white">Centro de autenticación</h1>
          <p className="mt-1 text-sm text-slate-300">
            Todas las rutas de auth están disponibles aquí.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {authRoutes.map((route) => (
            <Link
              key={route.to}
              to={route.to}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 text-white transition hover:-translate-y-1 hover:bg-white/10"
            >
              <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Auth</p>
              <h2 className="mt-3 text-2xl font-bold">{route.label}</h2>
              <p className="mt-2 text-sm text-slate-300">Abrir formulario de {route.label.toLowerCase()}.</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}