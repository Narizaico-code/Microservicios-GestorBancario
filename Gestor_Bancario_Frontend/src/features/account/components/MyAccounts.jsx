import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAccountStore } from '../store/useAccountStore'
import { Wallet, CreditCard, LayoutGrid, TrendingUp, Plus } from 'lucide-react'
import { requestAccountCreation } from '../../../shared/api/account.js'
import { formatNumber } from '../../../shared/utils/format.js'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge.jsx'
import CreateAccountRequestModal from './CreateAccountRequestModal.jsx'

export const MyAccounts = () => {
  const { accounts, loading, error, getAccounts } = useAccountStore()
  const navigate = useNavigate()
  
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
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-[color:var(--theme-text-muted)] text-sm">
      <div className="w-9 h-9 rounded-full border-[3px] border-[color:var(--theme-border)] border-t-[color:var(--theme-text)] animate-spin" />
      Cargando tus cuentas…
    </div>
  )

  if (error) return (
    <div className="mt-4 rounded-[16px] border border-rose-500/20 bg-rose-500/5 p-10 text-center">
      <p className="text-[color:var(--theme-text)] font-bold mb-2">Ups, algo salió mal</p>
      <p className="text-rose-400 text-sm mb-4">{error}</p>
      <button onClick={() => getAccounts()} className="px-5 py-2 rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] text-[color:var(--theme-text)] text-sm hover:opacity-80 transition">
        Reintentar
      </button>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 pb-8 text-[color:var(--theme-text)]">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-[12px] bg-[color:var(--theme-surface-alt)] border border-[color:var(--theme-border)] flex items-center justify-center shrink-0">
            <CreditCard size={20} className="text-[color:var(--theme-text)]" />
          </div>
          <div>
            <h2 className="text-[26px] font-black leading-none">Mis cuentas</h2>
            <p className="text-[13px] text-[color:var(--theme-text-muted)] mt-0.5">Administra y consulta tus cuentas de forma segura</p>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center gap-1.5 h-[36px] px-4 rounded-[10px] bg-[color:var(--theme-accent)] text-white text-[12px] font-bold hover:bg-[color:var(--theme-accent-strong)] transition-colors shrink-0"
        >
          <Plus size={14} /> Solicitar cuenta
        </button>
      </div>

      {/* Grid */}
      {!accounts.length ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-[16px] border border-dashed border-[color:var(--theme-border)] text-[color:var(--theme-text-muted)]">
          <Wallet size={40} className="mb-4" />
          <p className="font-bold text-base mb-1">Sin cuentas</p>
          <p className="text-sm">No tienes cuentas registradas aún.</p>
        </div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {accounts.map((account, index) => (
            <div
              key={account._id || account.numeroCuenta || index}
              className="relative overflow-hidden rounded-[16px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-[22px] transition-colors hover:border-[color:var(--theme-accent)]"
            >
              <div className="absolute right-0 top-0 h-full w-[6px] bg-[color:var(--theme-accent)] rounded-r-[16px]" />
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-[color:var(--theme-text-muted)] mb-3">
                {account.tipoCuenta || 'Cuenta'}
              </p>
              <p className="text-[16px] font-bold text-[color:var(--theme-text)] font-mono tracking-wide mb-5">
                {account.numeroCuenta}
              </p>
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[color:var(--theme-text-muted)] mb-1">Saldo disponible</p>
              <p className="text-[28px] font-black leading-none text-[color:var(--theme-text)]">
                <span className="text-[14px] font-bold text-[color:var(--theme-text-muted)] mr-1.5">{account.moneda || 'GTQ'}</span>
                {formatNumber(account.saldo)}
              </p>
              <div className="flex items-center justify-between mt-3">
                <StatusBadge tone={account.estado ? 'emerald' : 'rose'}>
                  {account.estado ? 'Activa' : 'Inactiva'}
                </StatusBadge>
                <button
                  onClick={() => navigate("../transacciones", { state: { cuentaOrigen: account.numeroCuenta } })}
                  className="rounded-[8px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-3 py-1 text-[12px] font-bold text-[color:var(--theme-text)] transition hover:opacity-80"
                >
                  Transferir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary footer */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 rounded-[16px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] overflow-hidden">
          {[
            { Icon: LayoutGrid, label: 'Total GTQ', value: `GTQ ${totalGTQ.toLocaleString()}` },
            { Icon: TrendingUp, label: 'Total USD',  value: `USD ${totalUSD.toLocaleString()}` },
            { Icon: Wallet,     label: 'Cuentas activas', value: accounts.length },
          ].map(({ Icon, label, value }, i) => (
            <div key={label} className={`flex items-center gap-3 px-6 py-5 ${i < 2 ? 'sm:border-r border-[color:var(--theme-border)]' : ''} ${i > 0 ? 'border-t sm:border-t-0 border-[color:var(--theme-border)]' : ''}`}>
              <div className="w-9 h-9 rounded-[10px] bg-[color:var(--theme-surface-alt)] flex items-center justify-center shrink-0">
                <Icon size={16} className="text-[color:var(--theme-text)]" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[color:var(--theme-text-muted)] mb-0.5">{label}</p>
                <p className="text-[18px] font-black text-[color:var(--theme-text)]">{value}</p>
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
