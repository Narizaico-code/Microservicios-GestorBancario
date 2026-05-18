import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Wallet, Headphones, ArrowRight, Plus } from 'lucide-react'
import { getRecentAccounts } from '../../shared/api/bank.js'
import { requestAccountCreation } from '../../shared/api/account.js'

export const ClientDashboard = ({ session }) => {
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState('')
  const [accounts, setAccounts] = useState([])
  const [requestForm, setRequestForm] = useState({ tipoCuenta: 'AHORRO', moneda: 'GTQ' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [requestSuccess, setRequestSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true
    const loadAccounts = async () => {
      try {
        const response = await getRecentAccounts(session.token)
        if (!isMounted) return
        setAccounts(Array.isArray(response?.data) ? response.data : [])
      } catch (error) {
        if (!isMounted) return
        setAccountsError(error.message || 'No fue posible cargar las cuentas')
      } finally {
        if (isMounted) setAccountsLoading(false)
      }
    }
    loadAccounts()
    return () => { isMounted = false }
  }, [session.token])

  const handleLogout = () => {
    clearSession()
    onLogout()
  }

  const handleRequestFormChange = (event) => {
    const { name, value } = event.target
    setRequestForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmitAccountRequest = async (event) => {
    event.preventDefault()
    setRequestLoading(true)
    setRequestError('')
    setRequestSuccess('')
    try {
      const response = await requestAccountCreation(requestForm)
      setRequestSuccess(response?.message || 'Solicitud enviada al administrador')
      setShowModal(false)
    } catch (error) {
      setRequestError(error.message || 'No fue posible enviar la solicitud')
    } finally {
      setRequestLoading(false)
    }
  }

  const handleOpenModal = () => {
    setRequestError('')
    setRequestSuccess('')
    setRequestForm({ tipoCuenta: 'AHORRO', moneda: 'GTQ' })
    setShowModal(true)
  }

  return (
    <div className="text-white font-sans">

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.85fr] gap-5 items-start">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#111111] p-7">
          <div className="absolute top-0 right-0 w-60 h-60 bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-white/50 mb-4">
              ¡Bienvenido {session.user?.name?.toUpperCase() || 'CLIENTE'}!
            </p>

            <h2 className="text-2xl sm:text-[32px] font-black leading-tight text-white mb-4 max-w-xs">
              Gestiona tus cuentas y finanzas de forma{' '}
              <span className="text-white/45">simple y segura.</span>
            </h2>

            <p className="text-[13px] text-white/40 leading-relaxed max-w-sm mb-7">
              Aquí puedes revisar los movimientos de tus cuentas, verificar tu saldo y acceder a tus configuraciones principales de manera rápida.
            </p>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* User */}
              <div className="relative overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#1a1a1a] p-5">
                <div className="absolute right-[-14px] bottom-[-14px] opacity-[0.04] pointer-events-none">
                  <User size={90} strokeWidth={1} />
                </div>
                <div className="w-[38px] h-[38px] rounded-[10px] bg-white flex items-center justify-center mb-5">
                  <User size={18} className="text-black" />
                </div>
                <p className="text-[12px] text-white/40 mb-1">Usuario</p>
                <h3 className="text-xl font-black text-white">{session.user?.name || 'Cliente'}</h3>
              </div>

              {/* Accounts */}
              <div className="relative overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#1a1a1a] p-5">
                <div className="absolute right-[-14px] bottom-[-14px] opacity-[0.04] pointer-events-none">
                  <Wallet size={90} strokeWidth={1} />
                </div>
                <div className="w-[38px] h-[38px] rounded-[10px] bg-white flex items-center justify-center mb-5">
                  <Wallet size={18} className="text-black" />
                </div>
                <p className="text-[12px] text-white/40 mb-1">Cuentas activas</p>
                <h3 className="text-xl font-black text-white">{accountsLoading ? '–' : accounts.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACCOUNTS */}
        <div className="rounded-[18px] border border-white/[0.07] bg-[#111111] p-6 h-full">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[22px] font-black text-white">Mis cuentas recientes</h3>

          </div>

          <div className="flex flex-col gap-3">
            {accountsLoading && <p className="text-white/30 text-sm">Cargando cuentas…</p>}
            {!accountsLoading && accounts.length === 0 && <p className="text-white/30 text-sm">No tienes cuentas aún.</p>}

            {accounts.slice(0, 3).map((account, index) => (
              <div
                key={account._id || account.id || index}
                className="relative overflow-hidden rounded-[14px] border border-white/[0.06] bg-[#1a1a1a] px-[18px] py-4 flex items-center justify-between cursor-pointer transition-colors hover:border-white/[0.14]"
              >
                <div className="absolute right-0 top-0 h-full w-[6px] bg-white rounded-r-[14px]" />
                <div>
                  <p className="text-[11px] text-white/45 font-medium mb-1.5">Cuenta {account.tipoCuenta}</p>
                  <p className="text-[15px] font-bold text-white font-mono tracking-wider">{account.numeroCuenta}</p>
                </div>
                <div className="text-right pr-[18px]">
                  <p className="text-[20px] font-black text-white leading-none mb-1.5">
                    {account.moneda || 'GTQ'} {Number(account.saldo).toLocaleString()}
                  </p>
                  <p className="text-[12px] text-emerald-400 font-semibold">Activa</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUPPORT BANNER */}
      <div className="mt-5 rounded-[18px] border border-white/[0.07] bg-[#111111] px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-[46px] h-[46px] rounded-[12px] bg-white flex items-center justify-center shrink-0">
            <Headphones size={22} className="text-black" />
          </div>
          <div>
            <h3 className="text-[18px] font-black text-white mb-1">¿Necesitas ayuda?</h3>
            <p className="text-[13px] text-white/40">Estamos aquí para ayudarte con cualquier consulta o problema.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/client/ayuda')}
          className="self-start sm:self-auto h-[44px] px-7 rounded-[12px] border border-white/20 text-white text-[14px] font-bold flex items-center gap-2 hover:bg-white hover:text-black transition-colors whitespace-nowrap"
        >
          Ir a ayuda <ArrowRight size={14} />
        </button>
      </div>


    </div>
  )
}

