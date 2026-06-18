import cerditoFondoBlanco from '../../../assets/CerditoFondoBlanco.png'

// Primitivos de UI del formulario de auth. Soportan `dynamic` para alternar
// entre el tema oscuro fijo (login público) y los theme tokens (modal admin).

export const Avatar = ({ dynamic }) => (
  <div className="mb-5 flex justify-center">
    <img
      src={cerditoFondoBlanco}
      alt="Kinal Banc"
      className={`h-[70px] w-[70px] rounded-full border object-contain p-2 ${
        dynamic ? 'border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)]' : 'border-white/8 bg-white/5'
      }`}
    />
  </div>
)

export const Heading = ({ title, sub, dynamic }) => (
  <div className="mb-5 text-center">
    <h2 className={`text-2xl font-black tracking-tight ${dynamic ? 'text-[color:var(--theme-text)]' : 'text-white'}`}>
      {title}
    </h2>
    {sub && (
      <p className={`mt-1 text-[13px] ${dynamic ? 'text-[color:var(--theme-text-muted)]' : 'text-white/40'}`}>{sub}</p>
    )}
  </div>
)

export const ErrorBanner = ({ error }) =>
  error ? (
    <div className="mt-3 whitespace-pre-line rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-[13px] text-red-300">
      {error}
    </div>
  ) : null

export const SuccessBanner = ({ success }) =>
  success ? (
    <div className="mt-3 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-[13px] text-emerald-400">
      {success}
    </div>
  ) : null

export const InputField = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  minLength,
  pattern,
  accept,
  dynamic,
}) => (
  <label className="block">
    <span
      className={`mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] ${
        dynamic ? 'text-[color:var(--theme-text-muted)]' : 'text-white/40'
      }`}
    >
      {label}
    </span>
    <input
      type={type}
      name={name}
      value={type !== 'file' ? value : undefined}
      onChange={onChange}
      required={required}
      minLength={minLength}
      pattern={pattern}
      accept={accept}
      placeholder={placeholder}
      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-0 ${
        dynamic
          ? 'border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] text-[color:var(--theme-text)] placeholder:text-[color:var(--theme-text-muted)] focus:border-[color:var(--theme-accent)]'
          : 'border-white/10 bg-[#1a1a1a] text-white placeholder-white/25 focus:border-white/35'
      }`}
    />
  </label>
)

export const PrimaryButton = ({ children, onClick, disabled, type = 'submit', dynamic }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`mt-4 w-full rounded-xl py-3 text-[15px] font-bold transition hover:opacity-90 disabled:opacity-50 ${
      dynamic ? 'bg-[color:var(--theme-accent)] text-white' : 'bg-white text-black'
    }`}
  >
    {children}
  </button>
)

export const LinkButton = ({ onClick, children, muted = false, dynamic }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-[13px] font-bold transition hover:opacity-80 ${
      dynamic
        ? muted
          ? 'text-[color:var(--theme-text-muted)]'
          : 'text-[color:var(--theme-accent)]'
        : muted
          ? 'text-white/45'
          : 'text-white/65'
    }`}
  >
    {children}
  </button>
)

export const Card = ({ children, dynamic }) => (
  <div
    className={`rounded-[18px] border ${
      dynamic
        ? 'border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] text-[color:var(--theme-text)] shadow-sm'
        : 'border-white/8 bg-[#111111] text-white'
    } px-6 py-6`}
  >
    {children}
  </div>
)
