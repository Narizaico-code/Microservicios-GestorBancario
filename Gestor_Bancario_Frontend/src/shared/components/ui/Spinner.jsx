export const Spinner = ({ size = 24, fullScreen = false, className = '' }) => {
  const spinner = (
    <div
      className={`animate-spin rounded-full border-2 border-[var(--theme-border)] border-t-[var(--theme-accent)] ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Cargando"
    />
  )

  if (fullScreen) {
    return <div className="flex h-screen items-center justify-center">{spinner}</div>
  }

  return spinner
}
