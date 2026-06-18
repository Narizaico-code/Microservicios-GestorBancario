import { Link } from 'react-router-dom'
import cerditoLogo from '../../../assets/IMGLogoSinLetra.png'

export const CtaBanner = () => (
  <section className="border-t border-white/7 px-5 py-16">
    <div className="mx-auto max-w-7xl">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111111] px-8 py-12 text-center">
        <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-white/[0.03] blur-3xl" />
        <img src={cerditoLogo} alt="" className="mx-auto mb-6 h-16 w-16 object-contain opacity-20" />
        <h2 className="text-3xl font-black text-white sm:text-4xl">¿Listo para empezar?</h2>
        <p className="mx-auto mt-3 max-w-lg text-base text-white/45">
          Únete a miles de clientes que ya gestionan su dinero de forma más inteligente y segura.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/auth" state={{ mode: 'register' }}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-black transition hover:opacity-90">
            Crear cuenta gratis
          </Link>
          <Link to="/auth"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 px-8 text-base font-bold text-white/70 transition hover:border-white/35 hover:text-white">
            Iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  </section>
)
