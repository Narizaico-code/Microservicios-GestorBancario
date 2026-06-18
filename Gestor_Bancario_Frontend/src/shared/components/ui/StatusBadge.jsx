const TONE_CLASSES = {
  emerald: 'bg-[var(--status-emerald-bg)] text-[var(--status-emerald-text)] border-[var(--status-emerald-border)]',
  rose: 'bg-[var(--status-rose-bg)] text-[var(--status-rose-text)] border-[var(--status-rose-border)]',
  slate: 'bg-[var(--status-slate-bg)] text-[var(--status-slate-text)] border-[var(--status-slate-border)]',
  amber: 'bg-[var(--status-amber-bg)] text-[var(--status-amber-text)] border-[var(--status-amber-border)]',
  sky: 'bg-[var(--status-sky-bg)] text-[var(--status-sky-text)] border-[var(--status-sky-border)]',
}

export const StatusBadge = ({ tone = 'slate', className = '', children }) => (
  <span
    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold ${
      TONE_CLASSES[tone] || TONE_CLASSES.slate
    } ${className}`}
  >
    {children}
  </span>
)
