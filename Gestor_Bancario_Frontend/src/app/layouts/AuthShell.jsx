import { Link } from 'react-router-dom'

export const AuthShell = ({ eyebrow, title, subtitle, children, aside }) => {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_42%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8">
        <header className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/80">
              Gestor Bancario
            </p>
            <h1 className="mt-1 text-lg font-semibold text-white">{title}</h1>
            <p className="mt-1 text-sm text-slate-300">{subtitle}</p>
          </div>
          <Link
            to="/auth"
            className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Centro Auth
          </Link>
        </header>

        <section className="grid flex-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl">
            <div>
              <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-cyan-200">
                {eyebrow}
              </span>
              {children}
            </div>
          </article>

          <aside className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            {aside}
          </aside>
        </section>
      </div>
    </main>
  )
}