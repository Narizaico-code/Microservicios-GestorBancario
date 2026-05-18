import { Link } from 'react-router-dom'
import brandLogo from '../assets/IMGLogoNegativo.png'
import cerditoLogo from '../assets/IMGLogoSinLetra.png'

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#testimonios', label: 'Testimonios' },
  { href: '#nosotros', label: 'Nosotros' },
]

const STATS = [
  { value: '+12K', label: 'Clientes activos' },
  { value: '99.9%', label: 'Disponibilidad' },
  { value: 'GTQ 2M+', label: 'Transacciones/mes' },
  { value: '24/7', label: 'Soporte' },
]

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

const FEATURES = [
  { iconKey: 'bank', title: 'Cuentas digitales', desc: 'Abre y gestiona múltiples cuentas en segundos desde cualquier dispositivo.' },
  { iconKey: 'bolt', title: 'Transferencias rápidas', desc: 'Envía dinero al instante con total seguridad y sin comisiones ocultas.' },
  { iconKey: 'lock', title: 'Seguridad avanzada', desc: 'Encriptación de nivel bancario y autenticación en dos pasos.' },
  { iconKey: 'chart', title: 'Control total', desc: 'Visualiza tus movimientos y saldos en tiempo real.' },
  { iconKey: 'globe', title: 'Multi-divisa', desc: 'Opera en Quetzales y Dólares desde una sola plataforma.' },
  { iconKey: 'device', title: 'Siempre disponible', desc: 'Accede desde cualquier lugar, en cualquier momento.' },
]

const SERVICES = [
  {
    title: 'Cuenta de Ahorro Alcanza',
    tag: 'MÁS POPULAR',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    desc: 'La mejor tasa del mercado. Haz crecer tus ahorros sin comisiones adicionales.',
    highlight: true,
  },
  {
    title: 'Cuenta Incrementa',
    tag: 'INVERSIÓN',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    desc: 'Tu dinero crece automáticamente con tasa competitiva durante 6 meses.',
    highlight: false,
  },
  {
    title: 'Pyme Plus',
    tag: 'EMPRESARIAL',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    desc: 'Beneficios exclusivos para facilitar la gestión financiera de tu negocio.',
    highlight: false,
  },
]

const TESTIMONIALS = [
  { name: 'Roger Valladares', role: 'Cliente Personal', quote: 'La banca es sencilla, rápida y clara. Ahora controlo mejor mis gastos.' },
  { name: 'Marcos Garcia', role: 'Empresario', quote: 'Excelente la atención y la seguridad en cada operación. Muy recomendado.' },
  { name: 'Kenny Angel', role: 'Freelancer', quote: 'La mejor app bancaria que he usado, todo está muy bien organizado.' },
  { name: 'Iosef Gil', role: 'Cliente Personal', quote: 'La interfaz es muy intuitiva, puedo revisar mis cuentas en segundos.' },
  { name: 'Angel Reyes', role: 'Contador', quote: 'Las notificaciones y alertas me hacen sentir más tranquilo con mis finanzas.' },
  { name: 'Zimri Jahdai', role: 'Emprendedor', quote: 'Muy buena experiencia al registrar mi negocio y gestionar pagos.' },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── NAVBAR ── */}
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

      {/* ── HERO ── */}
      <section id="inicio" className="relative overflow-hidden px-5 pb-20 pt-20">
        {/* Glow orbs */}
        <div className="pointer-events-none absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/[0.025] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-20 h-96 w-96 rounded-full bg-white/[0.02] blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">

          {/* ── LEFT: copy ── */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Banca digital disponible ahora
            </div>

            <h1 className="text-5xl font-black leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-[64px]">
              Tu dinero,{' '}
              <span
                className="text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.35) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}
              >bajo control</span>{' '}
              total.
            </h1>

            <p className="max-w-lg text-lg leading-8 text-white/45">
              Administra cuentas, realiza transferencias y supervisa tus finanzas en una plataforma segura y rápida.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="/auth"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-8 text-base font-bold text-black transition hover:opacity-90">
                Comenzar gratis
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <a href="#servicios"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-white/15 px-8 text-base font-bold text-white/70 transition hover:border-white/35 hover:text-white">
                Ver servicios
              </a>
            </div>

            {/* Stats strip */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map(({ value, label }) => (
                <div key={label} className="rounded-xl border border-white/7 bg-[#111111] px-4 py-4 text-center">
                  <p className="text-xl font-black text-white">{value}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-white/35">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: animated mock dashboard ── */}
          <div className="relative hidden h-[520px] lg:block">

            {/* Main card — centro */}
            <div className="animate-float absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-72 overflow-hidden rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl">
                <div className="card-shimmer absolute inset-0 rounded-2xl" />
                {/* Chip + logo */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="h-7 w-10 rounded-[5px]"
                    style={{ background: 'linear-gradient(135deg,rgba(250,210,100,0.9),rgba(200,155,30,0.9))' }} />
                  <span className="text-[10px] font-black tracking-widest text-white/40">KINAL BANC</span>
                </div>
                {/* Number */}
                <p className="relative z-10 mt-5 font-mono text-sm font-bold tracking-[0.22em] text-white/50">
                  •••• •••• •••• 4821
                </p>
                {/* Balance */}
                <div className="relative z-10 mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">Saldo disponible</p>
                  <p className="mt-1 text-3xl font-black text-white">GTQ 12,450<span className="text-lg text-white/40">.00</span></p>
                </div>
                {/* Footer */}
                <div className="relative z-10 mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-white/30">Titular</p>
                    <p className="text-xs font-bold text-white/60">CARLOS MEDINA</p>
                  </div>
                  <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                    ACTIVA
                  </span>
                </div>
              </div>
            </div>

            {/* Notificación de transacción — arriba derecha */}
            <div className="animate-drift [animation-delay:0.8s] absolute right-4 top-10">
              <div className="flex w-52 items-center gap-3 rounded-2xl border border-white/8 bg-[#111111]/90 px-4 py-3 shadow-xl backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/15">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Transferencia</p>
                  <p className="text-[10px] text-emerald-400">+ GTQ 2,800.00</p>
                </div>
              </div>
            </div>

            {/* Badge de pago — abajo izquierda */}
            <div className="animate-drift-alt [animation-delay:1.6s] absolute bottom-16 left-2">
              <div className="flex w-48 items-center gap-3 rounded-2xl border border-white/8 bg-[#111111]/90 px-4 py-3 shadow-xl backdrop-blur-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8">
                  <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white">Pago seguro</p>
                  <p className="text-[10px] text-white/40">Encriptado 256-bit</p>
                </div>
              </div>
            </div>

            {/* Mini cuenta secundaria — arriba izquierda */}
            <div className="animate-float-reverse [animation-delay:2.4s] absolute left-0 top-14">
              <div className="w-40 overflow-hidden rounded-xl border border-white/8 bg-[#111111]/90 p-4 shadow-xl">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white/30">USD</p>
                <p className="mt-1 text-lg font-black text-white">3,820.00</p>
                <p className="mt-1 text-[10px] text-white/35">•••• 7703</p>
              </div>
            </div>

            {/* Badge cuentas activas — abajo derecha */}
            <div className="animate-float [animation-delay:3.2s] absolute bottom-10 right-6">
              <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-[#111111]/90 px-4 py-3 shadow-xl backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[11px] font-bold text-white">2 cuentas activas</p>
              </div>
            </div>

            {/* Dot grid de fondo */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '26px 26px' }} />
          </div>

        </div>
      </section>


      {/* ── MARQUEE TICKER ── */}
      <div className="relative overflow-hidden border-y border-white/7 bg-[#0d0d0d] py-3">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent" />

        <div className="flex">
          {/* Track 1 */}
          <div className="animate-marquee flex shrink-0 items-center gap-0">
            {['Banca digital', 'Transferencias', 'Seguridad', 'Cuentas de ahorro', 'Multi-divisa', 'Pago rápido', 'Soporte 24/7', 'Inversión', 'Encriptación SSL', 'Banca digital', 'Transferencias', 'Seguridad', 'Cuentas de ahorro', 'Multi-divisa', 'Pago rápido', 'Soporte 24/7', 'Inversión', 'Encriptación SSL'].map((item, i) => (
              <span key={i} className="flex items-center gap-5 px-5">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/30 whitespace-nowrap">{item}</span>
                <span className="h-1 w-1 rounded-full bg-white/15 shrink-0" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
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

      {/* ── SERVICIOS ── */}
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

      {/* ── CTA BANNER ── */}
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

      {/* ── TESTIMONIOS ── */}
      <section id="testimonios" className="border-t border-white/7 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40">Testimonios</p>
            <h2 className="text-3xl font-black text-white sm:text-4xl">Clientes que ya confían en nosotros</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, quote }) => (
              <div key={name}
                className="rounded-2xl border border-white/7 bg-[#111111] p-6 transition hover:border-white/14">
                {/* Stars */}
                <div className="mb-4 flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-5 text-sm leading-6 text-white/55">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-black text-black">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-[11px] text-white/35">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOSOTROS ── */}
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
                {['Confianza', 'Claridad', 'Disponibilidad'].map((t) => (
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
                {[
                  { label: 'Soporte 24/7', text: 'Respuestas prácticas cuando las necesitas.' },
                  { label: 'Decisiones rápidas', text: 'Flujos claros para avanzar con confianza.' },
                  { label: 'Seguridad', text: 'Protección constante de tus datos y operaciones.' },
                ].map(({ label, text }) => (
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

      {/* ── FOOTER ── */}
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
              {['FB', 'IG', 'YT'].map((s) => (
                <a key={s} href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 text-[11px] font-black text-white/40 transition hover:border-white/40 hover:text-white">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
