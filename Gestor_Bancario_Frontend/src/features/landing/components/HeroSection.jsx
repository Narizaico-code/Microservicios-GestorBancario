import { STATS } from '../data/homeData.js'

const HeroMockDashboard = () => (
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
)

export const HeroSection = () => (
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
      <HeroMockDashboard />

    </div>
  </section>
)
