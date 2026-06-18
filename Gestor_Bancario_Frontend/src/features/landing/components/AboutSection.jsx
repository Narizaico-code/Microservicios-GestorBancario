import { ABOUT_VALUES, ABOUT_PILLARS } from '../data/homeData.js'

export const AboutSection = () => (
  <section id="nosotros" className="border-t border-white/7 px-5 py-20">
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Nosotros</p>
          <h2 className="text-3xl font-black text-white sm:text-4xl">Una banca digital hecha para las personas</h2>
          <p className="text-base leading-8 text-white/45">
            Gestionamos tu dinero con tecnologías seguras y procesos claros, para que sientas confianza y rapidez en cada operación.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {ABOUT_VALUES.map((t) => (
              <div key={t} className="rounded-xl border border-white/7 bg-[#111111] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/35">{t}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/7 bg-[#111111] p-7">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35">Nuestros pilares</p>
          <h3 className="mb-4 text-2xl font-black text-white">Atención, tecnología y confianza.</h3>
          <div className="space-y-4 rounded-xl border border-white/6 bg-[#1a1a1a] p-5">
            {ABOUT_PILLARS.map(({ label, text }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md bg-white/10 text-center text-[10px] font-black leading-5 text-white/60">✓</span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/40">{label}</p>
                  <p className="text-sm text-white/60">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)
