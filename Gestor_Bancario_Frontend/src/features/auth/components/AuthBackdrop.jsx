// Fondo decorativo compartido para las pantallas de auth (grid + glows + línea central).
export const AuthBackdrop = () => (
  <>
    {/* GRID */}
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '28px 28px',
      }}
    />

    {/* GLOW EFFECTS */}
    <div className="animate-pulse-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.04),transparent_40%)]" />
    <div className="animate-pulse-glow pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.03),transparent_40%)] [animation-delay:2s]" />

    {/* CENTER LINE */}
    <div className="absolute left-1/2 top-0 hidden h-full w-px bg-white/10 lg:block" />
  </>
)
