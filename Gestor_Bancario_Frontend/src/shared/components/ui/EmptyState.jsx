export const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-6 py-12 text-center ${className}`}
  >
    {Icon ? <Icon className="h-10 w-10 text-[var(--theme-text-muted)]" /> : null}
    <div className="space-y-1">
      {title ? <p className="text-base font-semibold text-[var(--theme-text)]">{title}</p> : null}
      {description ? <p className="text-sm text-[var(--theme-text-muted)]">{description}</p> : null}
    </div>
    {action}
  </div>
)
