const WifiIcon = () => (
  <svg className="h-5 w-5 text-white/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" d="M8.25 4.5a7.5 7.5 0 000 15M12 6.75a5.25 5.25 0 010 10.5M15.75 9a3.75 3.75 0 010 6" />
  </svg>
)

// Tarjeta decorativa flotante reutilizada en el panel de showcase.
const DecorativeCard = ({ className, style, shimmer, number, footer }) => (
  <div
    className={`overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-2xl backdrop-blur-xl ${className}`}
    style={style}
  >
    {shimmer}
    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-3xl" />

    <div className="relative z-10 flex items-center justify-between">
      <div className="h-10 w-16 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-500" />
      <WifiIcon />
    </div>

    <p className="relative z-10 mt-5 font-mono text-[11px] font-bold tracking-[0.2em] text-white/55">
      {number}
    </p>

    <div className="relative z-10 mt-5 flex items-end justify-between">{footer}</div>
  </div>
)

export const AuthShowcasePanel = () => (
  <section className="relative hidden overflow-hidden border-r border-white/5 px-10 py-8 lg:flex lg:flex-col">

    {/* LOGO */}
    <div className="relative z-20">
      <p className="text-[11px] font-black uppercase tracking-[0.35em] text-white/35">Gestor Bancario</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">KINAL BANC</h1>
    </div>

    {/* CARD 1 */}
    <DecorativeCard
      className="animate-drift absolute left-10 top-44 rotate-[-12deg] bg-gradient-to-br from-[#1a1a1a] to-[#232323]"
      style={{ width: 240, height: 145 }}
      shimmer={<div className="card-shimmer absolute inset-0 rounded-[2rem]" />}
      number="•••• •••• •••• 4821"
      footer={
        <>
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">Titular</p>
            <p className="text-[11px] font-black text-white/70">KINAL BANK</p>
          </div>
          <p className="text-[11px] font-black text-white/75">GTQ 12,450.00</p>
        </>
      }
    />

    {/* CARD 2 */}
    <DecorativeCard
      className="animate-drift-alt absolute bottom-32 right-24 rotate-[10deg] bg-gradient-to-br from-[#161616] to-[#222222]"
      style={{ width: 230, height: 140 }}
      shimmer={<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />}
      number="•••• •••• •••• 7703"
      footer={
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">Mastercard</p>
          <p className="text-[11px] font-black text-white/70">USD 3,820.00</p>
        </div>
      }
    />

    {/* TOP WIDGET */}
    <div className="animate-float absolute right-20 top-20 rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-6 py-5 backdrop-blur-xl">
      <p className="text-xs font-black uppercase tracking-wider text-white/25">Transacciones</p>
      <p className="mt-2 text-4xl font-black">14,823</p>
      <div className="mt-5 flex gap-1">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="w-1 rounded-full bg-white/25" style={{ height: `${10 + item * 4}px` }} />
        ))}
      </div>
    </div>

    {/* SECURITY BADGE */}
    <div className="animate-float-reverse absolute left-16 bottom-48 rounded-full border border-yellow-400/20 bg-yellow-400/10 p-5 backdrop-blur-xl">
      <span className="text-2xl font-black text-yellow-300">₿</span>
    </div>

    {/* MAIN CONTENT */}
    <div className="relative z-10 mt-auto max-w-[620px] pb-20">
      <p className="text-sm font-black uppercase tracking-[0.35em] text-white/30">Seguridad avanzada</p>
      <h2 className="mt-6 text-[5.5rem] font-black leading-[0.9] tracking-[-0.04em]">
        Restablece tu
        <br />
        acceso con total
        <br />
        <span className="text-white/25">seguridad.</span>
      </h2>
      <p className="mt-8 max-w-xl text-2xl leading-[2.2rem] text-white/45">
        Crea una nueva contraseña segura para continuar utilizando todos los servicios de Kinal Banc.
      </p>
    </div>

  </section>
)
