const VARIANTS = {
  primary:
    'bg-[var(--theme-accent)] text-white border-transparent hover:opacity-90',
  secondary:
    'border-[var(--theme-border)] bg-[var(--theme-surface-alt)] text-[var(--theme-text)]',
  edit:
    'border-[var(--btn-edit-border)] bg-[var(--btn-edit-bg)] text-[var(--btn-edit-text)]',
  delete:
    'border-[var(--btn-delete-border)] bg-[var(--btn-delete-bg)] text-[var(--btn-delete-text)]',
  cancel:
    'border-[var(--btn-cancel-border)] bg-[var(--btn-cancel-bg)] text-[var(--btn-cancel-text)]',
  ghost:
    'border-transparent bg-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50'

export const Button = ({ variant = 'primary', type = 'button', className = '', children, ...props }) => (
  <button type={type} className={`${BASE} ${VARIANTS[variant] || VARIANTS.primary} ${className}`} {...props}>
    {children}
  </button>
)
