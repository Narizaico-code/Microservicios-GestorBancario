import { X, AlertTriangle, Info } from 'lucide-react'

const CreateAccountRequestModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading,
  error,
  form,
  setForm,
}) => {
  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md rounded-[20px] border border-white/[0.08] bg-[#111111] shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-[18px] font-black text-white leading-snug">
              Solicitar creación de cuenta
            </h2>
            <p className="text-[13px] text-white/40 mt-1 leading-relaxed max-w-xs">
              Solo selecciona tipo y moneda. El administrador aprobará o denegará tu solicitud.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="ml-4 shrink-0 w-8 h-8 rounded-[8px] bg-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="px-6 py-5 flex flex-col gap-4">

          {/* Tipo de cuenta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/40">
              Tipo de cuenta
            </label>
            <select
              name="tipoCuenta"
              value={form.tipoCuenta}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-[12px] border border-white/[0.08] bg-[#1a1a1a] px-4 py-3 text-[14px] text-white outline-none transition-colors focus:border-white/25 disabled:opacity-50 cursor-pointer"
            >
              <option value="AHORRO">Ahorro</option>
              <option value="MONETARIA">Monetaria</option>
            </select>
          </div>

          {/* Moneda */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold tracking-[0.15em] uppercase text-white/40">
              Moneda
            </label>
            <select
              name="moneda"
              value={form.moneda}
              onChange={handleChange}
              disabled={loading}
              className="w-full rounded-[12px] border border-white/[0.08] bg-[#1a1a1a] px-4 py-3 text-[14px] text-white outline-none transition-colors focus:border-white/25 disabled:opacity-50 cursor-pointer"
            >
              <option value="GTQ">GTQ — Quetzal</option>
              <option value="USD">USD — Dólar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="MXN">MXN — Peso mexicano</option>
              <option value="COP">COP — Peso colombiano</option>
              <option value="JPY">JPY — Yen japonés</option>
            </select>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-[12px] border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
              <AlertTriangle size={15} className="text-red-400 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-400 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 h-[44px] rounded-[12px] border border-white/[0.10] text-white/60 text-[14px] font-semibold hover:border-white/20 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-[44px] rounded-[12px] bg-white text-black text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando…' : 'Enviar solicitud'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateAccountRequestModal
