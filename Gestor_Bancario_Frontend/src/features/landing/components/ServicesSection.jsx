import { Link } from 'react-router-dom'
import { SERVICES } from '../data/homeData.js'

export const ServicesSection = () => (
  <section id="servicios" className="border-t border-white/7 px-5 py-20">
    <div className="mx-auto max-w-7xl">
      <div className="mb-12 text-center">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Cuentas</p>
        <h2 className="text-3xl font-black text-white sm:text-4xl">Elige tu cuenta ideal</h2>
        <p className="mx-auto mt-3 max-w-xl text-base text-white/45">
          Productos diseñados para cada etapa de tu vida financiera.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {SERVICES.map(({ title, tag, image, desc, highlight }) => (
          <article key={title}
            className={`group overflow-hidden rounded-2xl border transition hover:border-white/20 ${highlight ? 'border-white/20 bg-[#161616]' : 'border-white/7 bg-[#111111]'}`}>
            <div className="relative overflow-hidden">
              <img src={image} alt={title} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/80 to-transparent" />
              <span className="absolute left-4 top-4 rounded-lg border border-white/20 bg-black/60 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm">
                {tag}
              </span>
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
              <p className="text-sm leading-6 text-white/45">{desc}</p>
              <Link to="/auth" state={{ mode: 'register' }}
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-bold text-white/60 transition hover:text-white">
                Solicitar cuenta
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)
