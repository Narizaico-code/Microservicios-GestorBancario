export const Card = ({ as: Tag = 'div', className = '', children, ...props }) => (
  <Tag
    className={`rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow)] ${className}`}
    {...props}
  >
    {children}
  </Tag>
)
