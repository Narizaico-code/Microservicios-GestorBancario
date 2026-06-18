const VARIANTS = {
  error: 'bg-[var(--status-rose-bg)] text-[var(--status-rose-text)] border-[var(--status-rose-border)]',
  success: 'bg-[var(--status-emerald-bg)] text-[var(--status-emerald-text)] border-[var(--status-emerald-border)]',
  info: 'bg-[var(--status-sky-bg)] text-[var(--status-sky-text)] border-[var(--status-sky-border)]',
  warning: 'bg-[var(--status-amber-bg)] text-[var(--status-amber-text)] border-[var(--status-amber-border)]',
}

export const Alert = ({ variant = 'error', className = '', children }) => {
  if (!children) return null
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${VARIANTS[variant] || VARIANTS.error} ${className}`}>
      {children}
    </div>
  )
}
