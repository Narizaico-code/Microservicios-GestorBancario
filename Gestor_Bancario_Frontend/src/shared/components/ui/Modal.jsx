export const Modal = ({ title, onClose, children, maxWidth = 'max-w-lg' }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
    <div
      className={`relative flex w-full ${maxWidth} max-h-[90vh] flex-col rounded-[20px] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-[var(--theme-shadow)]`}
    >
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h2>
        <button
          onClick={onClose}
          className="text-[var(--theme-text-muted)] transition hover:text-[var(--theme-text)]"
          type="button"
        >
          ✕
        </button>
      </div>
      <div className="min-h-0 overflow-y-auto">
        {children}
      </div>
    </div>
  </div>
)
