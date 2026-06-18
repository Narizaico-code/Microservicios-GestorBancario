import { Link } from 'react-router-dom'
import brandLogo from '../../../assets/IMGLogoNegativo.png'
import { NAV_LINKS } from '../data/homeData.js'

export const LandingNavbar = () => (
  <header className="sticky top-0 z-30 border-b border-white/7 bg-[#0a0a0a]/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
      <div className="flex items-center gap-3">
        <img src={brandLogo} alt="Logo" className="h-9 w-auto" />
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/35">Gestor Bancario</p>
          <p className="text-sm font-black tracking-widest text-white">KINAL BANC</p>
        </div>
      </div>

      <nav className="hidden items-center gap-1 lg:flex">
        {NAV_LINKS.map(({ href, label }) => (
          <a key={href} href={href}
            className="rounded-xl px-4 py-2 text-sm font-medium text-white/55 transition hover:bg-white/6 hover:text-white">
            {label}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link to="/auth"
          className="rounded-xl border border-white/15 px-4 py-2 text-sm font-bold text-white/80 transition hover:border-white/40 hover:text-white">
          Iniciar sesión
        </Link>
        <Link to="/auth" state={{ mode: 'register' }}
          className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black transition hover:opacity-90">
          Crear cuenta
        </Link>
      </div>
    </div>
  </header>
)
