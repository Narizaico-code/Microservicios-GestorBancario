const INPUT_CLASS =
  'w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-3 py-2 text-sm text-[var(--theme-text)] outline-none transition focus:border-[var(--theme-accent)]'

const Label = ({ label, children }) => (
  <label className="grid gap-1.5 text-sm">
    {label ? <span className="font-medium text-[var(--theme-text-muted)]">{label}</span> : null}
    {children}
  </label>
)

const ErrorText = ({ error }) =>
  error ? <span className="text-xs text-[var(--status-rose-text)]">{error}</span> : null

export const Field = ({ label, error, className = '', ...props }) => (
  <Label label={label}>
    <input className={`${INPUT_CLASS} ${className}`} {...props} />
    <ErrorText error={error} />
  </Label>
)

export const SelectField = ({ label, error, className = '', children, ...props }) => (
  <Label label={label}>
    <select className={`${INPUT_CLASS} ${className}`} {...props}>
      {children}
    </select>
    <ErrorText error={error} />
  </Label>
)

export const TextareaField = ({ label, error, className = '', ...props }) => (
  <Label label={label}>
    <textarea className={`${INPUT_CLASS} resize-y ${className}`} {...props} />
    <ErrorText error={error} />
  </Label>
)
