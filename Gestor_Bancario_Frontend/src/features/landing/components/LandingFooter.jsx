import brandLogo from '../../../assets/IMGLogoNegativo.png'
import { FOOTER_SOCIALS } from '../data/homeData.js'

export const LandingFooter = () => (
  <footer className="border-t border-white/7 bg-[#111111] px-5 py-10">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <img src={brandLogo} alt="Logo" className="h-12 w-auto" />
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/30">Gestor Bancario</p>
            <p className="text-sm font-black tracking-widest text-white">KINAL BANC</p>
          </div>
        </div>
        <p className="text-sm text-white/30">2026 © Todos los derechos reservados · Kinal Banc.</p>
        <div className="flex gap-2">
          {FOOTER_SOCIALS.map((s) => (
            <a key={s} href="#"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-[11px] font-black text-white/40 transition hover:border-white/40 hover:text-white">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
)
