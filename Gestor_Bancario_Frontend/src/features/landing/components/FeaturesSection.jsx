import { FEATURES } from '../data/homeData.js'

const FEATURE_ICON = {
  bank: (
    <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
    </svg>
  ),
  bolt: (
    <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  lock: (
    <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  chart: (
    <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l4-4 4 4 4-6" />
    </svg>
  ),
  globe: (
    <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
    </svg>
  ),
  device: (
    <svg className="h-5 w-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
      <rect x="5" y="2" width="14" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
    </svg>
  ),
}

export const FeaturesSection = () => (
  <section className="border-t border-white/7 px-5 py-20">
    <div className="mx-auto max-w-7xl">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Plataforma</p>
        <h2 className="text-3xl font-black text-white sm:text-4xl">Todo lo que necesitas en un solo lugar</h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-white/45">
          Herramientas diseñadas para que tomes el control de tus finanzas con confianza.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ iconKey, title, desc }) => (
          <div key={title}
            className="group rounded-2xl border border-white/7 bg-[#111111] p-6 transition hover:border-white/15 hover:bg-[#161616]">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[12px] bg-white/8 transition group-hover:bg-white/12">
              {FEATURE_ICON[iconKey]}
            </div>
            <h3 className="mb-2 font-bold text-white">{title}</h3>
            <p className="text-sm leading-6 text-white/45">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
