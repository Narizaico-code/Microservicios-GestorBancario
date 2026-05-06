import UnifiedAuthForm from '../components/UnifiedAuthForm.jsx'

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_42%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">Gestor Bancario</p>
            <h1 className="mt-1 text-lg font-semibold text-white">Autenticación</h1>
            <p className="mt-1 text-sm text-slate-300">Acceso flexible al sistema.</p>
          </div>
          <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">AuthService + Backend</div>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <div>
              <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">Acceso Unificado</span>
              <h2 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-white md:text-5xl">Un formulario para todo.</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">Inicia sesión, crea una cuenta, recupera tu contraseña o reenvía tu email de verificación, todo en un mismo lugar.</p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">Login</p><p className="mt-2 text-xl font-semibold text-white">Acceso seguro</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">Registro</p><p className="mt-2 text-xl font-semibold text-white">Nuevas cuentas</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">Recuperación</p><p className="mt-2 text-xl font-semibold text-white">Contraseña</p></div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-sm text-slate-400">Verificación</p><p className="mt-2 text-xl font-semibold text-white">Email</p></div>
            </div>
          </article>

          <aside className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <UnifiedAuthForm />
          </aside>
        </section>
      </div>
    </main>
  )
}