import { useEffect, useState } from 'react'
import { useAccountStore } from '../store/useAccountStore'
import { Wallet, CreditCard, LayoutGrid, TrendingUp, Plus } from 'lucide-react'
import { requestAccountCreation } from '../../../shared/api/account.js'
import CreateAccountRequestModal from './CreateAccountRequestModal.jsx'

const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2 })

export const MyAccounts = () => {
  const { accounts, loading, error, getAccounts } = useAccountStore()
  const [showModal, setShowModal]       = useState(false)
  const [form, setForm]                 = useState({ tipoCuenta: 'AHORRO', moneda: 'GTQ' })
  const [reqLoading, setReqLoading]     = useState(false)
  const [reqError, setReqError]         = useState('')

  useEffect(() => { getAccounts() }, [getAccounts])

  const totalGTQ = accounts.filter(a => a.moneda === 'GTQ').reduce((s, a) => s + a.saldo, 0)
  const totalUSD = accounts.filter(a => a.moneda === 'USD').reduce((s, a) => s + a.saldo, 0)

  const handleOpenModal = () => { setReqError(''); setForm({ tipoCuenta: 'AHORRO', moneda: 'GTQ' }); setShowModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setReqLoading(true); setReqError('')
    try {
      await requestAccountCreation(form)
      setShowModal(false)
      getAccounts()
    } catch (err) {
      setReqError(err.message || 'No fue posible enviar la solicitud')
    } finally {
      setReqLoading(false)
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-white/30 text-sm">
      <div className="w-9 h-9 rounded-full border-[3px] border-white/10 border-t-white animate-spin" />
      Cargando tus cuentas…
    </div>
  )

  if (error) return (
    <div className="mt-4 rounded-[16px] border border-red-500/20 bg-red-500/5 p-10 text-center">
      <p className="text-white font-bold mb-2">Ups, algo salió mal</p>
      <p className="text-red-400/70 text-sm mb-4">{error}</p>
      <button onClick={() => getAccounts()} className="px-5 py-2 rounded-xl border border-white/10 bg-white/5 text-white text-sm hover:bg-white/10 transition">
        Reintentar
      </button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 pb-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-white flex items-center justify-center shrink-0">
            <CreditCard size={20} className="text-black" />
          </div>
          <div>
            <h2 className="text-[26px] font-black text-white leading-none">Mis cuentas</h2>
            <p className="text-[13px] text-white/35 mt-0.5">Administra y consulta tus cuentas de forma segura</p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 h-[36px] px-4 rounded-[10px] bg-white text-black text-[12px] font-bold hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus size={14} /> Solicitar cuenta
        </button>
      </div>

      {/* Grid */}
      {!accounts.length ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-[16px] border border-dashed border-white/10 text-white/25">
          <Wallet size={40} className="mb-4" />
          <p className="font-bold text-base mb-1">Sin cuentas</p>
          <p className="text-sm">No tienes cuentas registradas aún.</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {accounts.map((account, index) => (
            <div
              key={account._id || account.numeroCuenta || index}
              className="relative overflow-hidden rounded-[16px] border border-white/[0.07] bg-[#111111] p-[22px] transition-colors hover:border-white/[0.14]"
            >
              <div className="absolute right-0 top-0 h-full w-[6px] bg-white rounded-r-[16px]" />
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/35 mb-3">
                {account.tipoCuenta || 'Cuenta'}
              </p>
              <p className="text-[16px] font-bold text-white font-mono tracking-wide mb-5">
                {account.numeroCuenta}
              </p>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-1">Saldo disponible</p>
              <p className="text-[28px] font-black text-white leading-none">
                <span className="text-[14px] font-bold text-white/45 mr-1.5">{account.moneda || 'GTQ'}</span>
                {fmt(account.saldo)}
              </p>
              <span className="mt-3 inline-block text-[11px] font-bold text-emerald-400 bg-emerald-400/10 rounded-[6px] px-2.5 py-1">
                Activa
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Summary footer */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-[16px] border border-white/[0.07] bg-[#111111] overflow-hidden">
          {[
            { Icon: LayoutGrid, label: 'Total GTQ', value: `GTQ ${totalGTQ.toLocaleString()}` },
            { Icon: TrendingUp, label: 'Total USD',  value: `USD ${totalUSD.toLocaleString()}` },
            { Icon: Wallet,     label: 'Cuentas activas', value: accounts.length },
          ].map(({ Icon, label, value }, i) => (
            <div key={label} className={`flex items-center gap-3 px-6 py-5 ${i < 2 ? 'sm:border-r border-white/[0.07]' : ''} ${i > 0 ? 'border-t sm:border-t-0 border-white/[0.07]' : ''}`}>
              <div className="w-9 h-9 rounded-[10px] bg-white/[0.06] flex items-center justify-center shrink-0">
                <Icon size={16} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-0.5">{label}</p>
                <p className="text-[18px] font-black text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateAccountRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        loading={reqLoading}
        error={reqError}
        form={form}
        setForm={setForm}
      />
    </div>
  )
}
