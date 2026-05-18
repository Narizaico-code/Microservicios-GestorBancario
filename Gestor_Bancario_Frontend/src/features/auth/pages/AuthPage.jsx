import { useLocation } from 'react-router-dom'
import { UnifiedAuthForm } from '../components/UnifiedAuthForm.jsx'
import brandLogo from '../../../assets/IMGLogoNegativo.png'
import cerditoLogo from '../../../assets/IMGLogoSinLetra.png'

/* ── Mini credit card component ─────────────────────────────────────────── */
const FloatingCard = ({ className = '', colorFrom = '#1c1c1c', colorTo = '#2a2a2a', number = '•••• •••• •••• 4821', holder = 'KINAL BANC', balance = 'GTQ 12,450.00' }) => (
  <div className={`relative overflow-hidden rounded-2xl border border-white/10 p-5 shadow-2xl ${className}`}
    style={{ background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`, width: 220, height: 130 }}
  >
    {/* Shimmer overlay */}
    <div className="card-shimmer absolute inset-0 rounded-2xl" />

    {/* Radial glow */}
    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

    {/* Top row */}
    <div className="relative z-10 flex items-center justify-between">
      {/* Chip */}
      <div className="h-6 w-9 rounded-[4px] border border-white/20 bg-gradient-to-br from-yellow-300/80 to-yellow-500/80"
        style={{ background: 'linear-gradient(135deg, rgba(250,210,100,0.85), rgba(210,160,40,0.85))' }}
      >
        <div className="mt-[6px] h-[1px] w-full bg-yellow-600/40" />
      </div>
      {/* Contactless icon */}
      <svg className="h-5 w-5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" d="M8.25 4.5a7.5 7.5 0 000 15M12 6.75a5.25 5.25 0 010 10.5M15.75 9a3.75 3.75 0 010 6" />
      </svg>
    </div>

    {/* Card number */}
    <p className="relative z-10 mt-3 font-mono text-[11px] font-bold tracking-[0.18em] text-white/60">{number}</p>

    {/* Bottom row */}
    <div className="relative z-10 mt-2 flex items-end justify-between">
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/30">Titular</p>
        <p className="text-[10px] font-bold text-white/70">{holder}</p>
      </div>
      <p className="text-[10px] font-black text-white/80">{balance}</p>
    </div>
  </div>
)

/* ── Floating coin ───────────────────────────────────────────────────────── */
const Coin = ({ symbol = 'Q', className = '' }) => (
  <div className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/15 shadow-lg ${className}`}
    style={{ background: 'linear-gradient(135deg, rgba(250,210,60,0.18), rgba(210,160,30,0.12))' }}
  >
    <span className="text-lg font-black text-yellow-300/70">{symbol}</span>
  </div>
)

/* ── Floating badge ──────────────────────────────────────────────────────── */
const Badge = ({ icon, label, className = '' }) => (
  <div className={`flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm shadow-lg ${className}`}>
    <span className="text-base">{icon}</span>
    <span className="text-xs font-bold text-white/60">{label}</span>
  </div>
)

/* ── Main page ───────────────────────────────────────────────────────────── */
export const AuthPage = () => {
  const { state } = useLocation()
  const infoMessage = state?.infoMessage
  const initialMode  = state?.mode ?? 'login'

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto grid min-h-screen w-full max-w-[1280px] lg:grid-cols-[1fr_1fr]">

        {/* ════════════════════════════════════════════════════════════
            PANEL IZQUIERDO — Marca + elementos flotantes
        ════════════════════════════════════════════════════════════ */}
        <section
          className="order-2 relative hidden overflow-hidden lg:flex lg:order-1 flex-col justify-between px-10 py-10"
          style={{ backgroundColor: '#0d0d0d', borderRight: '1px solid rgba(255,255,255,0.06)' }}
        >
          {/* ── Fondo radial glow ── */}
          <div className="animate-pulse-glow pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_30%_40%,rgba(255,255,255,0.04),transparent)]" />
          <div className="animate-pulse-glow delay-3 pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_70%_70%,rgba(255,255,255,0.03),transparent)]" />

          {/* ── ELEMENTOS FLOTANTES ── */}

          {/* Tarjeta grande — centro izquierda */}
          <div className="animate-drift [animation-delay:0s] absolute left-8 top-[22%]" style={{ zIndex: 2 }}>
            <FloatingCard
              colorFrom="#1a1a1a"
              colorTo="#222222"
              number="•••• •••• •••• 4821"
              holder="KINAL BANC"
              balance="GTQ 12,450.00"
            />
          </div>

          {/* Tarjeta mediana — derecha centro */}
          <div className="animate-drift-alt [animation-delay:1.6s] absolute right-6 top-[35%]" style={{ zIndex: 2 }}>
            <FloatingCard
              colorFrom="#161616"
              colorTo="#1e1e1e"
              number="•••• •••• •••• 7703"
              holder="VISA PLATINUM"
              balance="USD 3,820.00"
              className="opacity-80"
            />
          </div>

          {/* Tarjeta pequeña — abajo derecha */}
          <div className="animate-float [animation-delay:3.2s] absolute bottom-[22%] right-12" style={{ zIndex: 2 }}>
            <FloatingCard
              colorFrom="#121212"
              colorTo="#1c1c1c"
              number="•••• •••• •••• 2290"
              holder="MASTERCARD"
              balance="GTQ 8,100.00"
              className="opacity-65 scale-90"
            />
          </div>

          {/* Logo flotante grande — fondo */}
          <div className="animate-float-slow [animation-delay:0.8s] pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 1 }}>
            <img
              src={cerditoLogo}
              alt=""
              className="h-64 w-64 object-contain opacity-[0.04]"
            />
          </div>

          {/* Monedas flotantes */}
          <Coin symbol="Q"  className="animate-float [animation-delay:0.8s] absolute left-[14%] top-[15%]" />
          <Coin symbol="$"  className="animate-float-reverse [animation-delay:2.4s] absolute right-[18%] top-[18%]" />
          <Coin symbol="€"  className="animate-float [animation-delay:4.0s] absolute left-[22%] bottom-[28%]" />
          <Coin symbol="₿"  className="animate-float-reverse [animation-delay:1.6s] absolute right-[12%] bottom-[18%]" />

          {/* Badges flotantes */}
          <Badge icon="🔒" label="Pago seguro"    className="animate-float [animation-delay:1.6s] absolute left-[8%] bottom-[38%]" />
          <Badge icon="⚡" label="Transferencia"  className="animate-drift [animation-delay:3.2s] absolute right-[5%] top-[58%]" />
          <Badge icon="✓"  label="Cuenta activa"  className="animate-float-reverse [animation-delay:0s] absolute left-[15%] top-[58%]" />

          {/* Dot grid decorativo */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          {/* ── Contenido fijo ── */}
          <div className="relative z-10 flex items-center gap-3">
            <img src={brandLogo} alt="Logo" className="h-10 w-auto" />
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-white/35">Gestor Bancario</p>
              <h1 className="text-base font-black tracking-widest text-white">KINAL BANC</h1>
            </div>
          </div>

          <div className="relative z-10 max-w-xs">
            <p className="mb-4 text-[11px] font-bold tracking-[0.2em] uppercase text-white/30">
              Tu portal bancario
            </p>
            <h2 className="text-4xl font-black leading-tight text-white xl:text-[44px]">
              Gestiona tu dinero con total{' '}
              <span className="text-white/40">confianza.</span>
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/40">
              Accede a tus productos, realiza transacciones y gestiona tu dinero de forma fácil, rápida y segura.
            </p>
          </div>

          <p className="relative z-10 text-xs text-white/20">
            2026 © Corporación Bi. Todos los derechos reservados.
          </p>
        </section>

        {/* ════════════════════════════════════════════════════════════
            PANEL DERECHO — Formulario + decoración animada
        ════════════════════════════════════════════════════════════ */}
        <section className="order-1 relative overflow-hidden flex items-center justify-center bg-[#0a0a0a] px-5 py-10 lg:order-2 lg:px-10">

          {/* ── Decoración animada (detrás del formulario) ── */}

          {/* Anillo orbital exterior */}
          <div className="animate-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.04]" />
          {/* Anillo orbital medio */}
          <div className="animate-spin-slow [animation-delay:-4s] pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]"
            style={{ animationDirection: 'reverse' }} />

          {/* Orbe central de glow */}
          <div className="animate-pulse-glow pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] blur-3xl" />

          {/* Métrica — Transacciones seguras (arriba izquierda) */}
          <div className="animate-float [animation-delay:0s] pointer-events-none absolute left-4 top-10 hidden xl:block">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 backdrop-blur-sm">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">Transacciones</p>
              <p className="mt-0.5 text-lg font-black text-white/50">14,823</p>
              <div className="mt-2 flex gap-0.5">
                {[40,55,35,70,60,80,65].map((h, i) => (
                  <div key={i} className="w-1 rounded-full bg-white/20" style={{ height: h * 0.3 }} />
                ))}
              </div>
            </div>
          </div>

          {/* Badge seguridad — arriba derecha */}
          <div className="animate-drift [animation-delay:1.2s] pointer-events-none absolute right-4 top-12 hidden xl:block">
            <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-2.5 backdrop-blur-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/15">
                <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-400">Conexión segura</p>
                <p className="text-[9px] text-white/30">SSL 256-bit</p>
              </div>
            </div>
          </div>

          {/* Actividad reciente — abajo izquierda */}
          <div className="animate-float-reverse [animation-delay:2.0s] pointer-events-none absolute bottom-14 left-4 hidden xl:block">
            <div className="w-44 rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm">
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.15em] text-white/30">Última actividad</p>
              {[
                { label: 'Depósito', amount: '+850', color: 'text-emerald-400' },
                { label: 'Retiro',   amount: '-200', color: 'text-white/40' },
              ].map(({ label, amount, color }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <p className="text-[10px] text-white/40">{label}</p>
                  <p className={`text-[10px] font-bold ${color}`}>{amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Badge usuarios activos — abajo derecha */}
          <div className="animate-drift-alt [animation-delay:0.6s] pointer-events-none absolute bottom-16 right-4 hidden xl:block">
            <div className="flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] font-bold text-white/40">+12K usuarios activos</p>
            </div>
          </div>

          {/* Dot grid decorativo (muy sutil) */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* ── Formulario (z-10, sobre la decoración) ── */}
          <div className="relative z-10 w-full max-w-[460px]">
            {infoMessage && (
              <div className="mb-6 flex items-start gap-3 rounded-[14px] border border-yellow-400/25 bg-yellow-400/[0.06] px-4 py-3.5 text-sm text-yellow-300">
                <span className="mt-0.5 shrink-0 text-base">⏳</span>
                <span className="font-medium">{infoMessage}</span>
              </div>
            )}
            <UnifiedAuthForm initialMode={initialMode} />
          </div>
        </section>

      </div>
    </main>
  )
}