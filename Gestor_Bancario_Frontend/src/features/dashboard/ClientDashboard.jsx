import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Wallet, Headphones, ArrowRight } from 'lucide-react'
import { useAccountStore } from '../account/store/useAccountStore.js'
import { CurrencyDashboard } from '../currency/components/CurrencyDashboard.jsx'
import useChatStore from '../chatbot/store/useChatStore.js'

export const ClientDashboard = ({ session }) => {
  const { accounts, loading: accountsLoading, getAccounts } = useAccountStore()
  const { startNewChat, sendMessage } = useChatStore()
  const navigate = useNavigate()

  useEffect(() => {
    // Solo recargar si esta vacio o forzar la recarga inicial
    getAccounts()
  }, [getAccounts])

  // Extraer divisas únicas de las cuentas del usuario
  const userCurrencies = useMemo(() => {
    if (!accounts || accounts.length === 0) return ['GTQ', 'USD']; // Fallback si no tiene cuentas
    const currenciesSet = new Set(accounts.map(acc => acc.moneda).filter(Boolean));
    return Array.from(currenciesSet);
  }, [accounts])

  return (
    <div className="text-[color:var(--theme-text)] font-sans">

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.85fr] gap-5 items-start">

        {/* HERO */}
        <div className="relative overflow-hidden rounded-[18px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-7">
          <div className="absolute top-0 right-0 w-60 h-60 bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)] pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[color:var(--theme-text-muted)] mb-4">
              ¡Bienvenido {session.user?.name?.toUpperCase() || 'CLIENTE'}!
            </p>

            <h2 className="text-2xl sm:text-[32px] font-black leading-tight text-[color:var(--theme-text)] mb-4 max-w-xs">
              Gestiona tus cuentas y finanzas de forma{' '}
              <span className="text-[color:var(--theme-text-muted)]">simple y segura.</span>
            </h2>

            <p className="text-[13px] text-[color:var(--theme-text-muted)] leading-relaxed max-w-sm mb-7">
              Aquí puedes revisar los movimientos de tus cuentas, verificar tu saldo y acceder a tus configuraciones principales de manera rápida.
            </p>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* User */}
              <div className="relative overflow-hidden rounded-[14px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-5">
                <div className="absolute right-[-14px] bottom-[-14px] opacity-[0.04] pointer-events-none">
                  <User size={90} strokeWidth={1} />
                </div>
                <div className="w-[38px] h-[38px] rounded-[10px] bg-[color:var(--theme-bg)] flex items-center justify-center mb-5">
                  <User size={18} className="text-[color:var(--theme-text)]" />
                </div>
                <p className="text-[12px] text-[color:var(--theme-text-muted)] mb-1">Usuario</p>
                <h3 className="text-xl font-black text-[color:var(--theme-text)]">{session.user?.name || 'Cliente'}</h3>
              </div>

              {/* Accounts */}
              <div className="relative overflow-hidden rounded-[14px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-5">
                <div className="absolute right-[-14px] bottom-[-14px] opacity-[0.04] pointer-events-none">
                  <Wallet size={90} strokeWidth={1} />
                </div>
                <div className="w-[38px] h-[38px] rounded-[10px] bg-[color:var(--theme-bg)] flex items-center justify-center mb-5">
                  <Wallet size={18} className="text-[color:var(--theme-text)]" />
                </div>
                <p className="text-[12px] text-[color:var(--theme-text-muted)] mb-1">Cuentas activas</p>
                <h3 className="text-xl font-black text-[color:var(--theme-text)]">{accountsLoading ? '–' : accounts.length}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ACCOUNTS */}
        <div className="rounded-[18px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 h-full">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[22px] font-black text-[color:var(--theme-text)]">Mis cuentas recientes</h3>

          </div>

          <div className="flex flex-col gap-3">
            {accountsLoading && <p className="text-[color:var(--theme-text-muted)] text-sm">Cargando cuentas…</p>}
            {!accountsLoading && accounts.length === 0 && <p className="text-[color:var(--theme-text-muted)] text-sm">No tienes cuentas aún.</p>}

            {accounts.slice(0, 3).map((account, index) => (
              <div
                key={account._id || account.id || index}
                onClick={() => navigate('/client/accounts')}
                className="relative overflow-hidden rounded-[14px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-[18px] py-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-[color:var(--theme-bg)]"
              >
                <div className="absolute right-0 top-0 h-full w-[6px] bg-[color:var(--theme-accent)] rounded-r-[14px]" />
                <div>
                  <p className="text-[11px] text-[color:var(--theme-text-muted)] font-medium mb-1.5">Cuenta {account.tipoCuenta}</p>
                  <p className="text-[15px] font-bold text-[color:var(--theme-text)] font-mono tracking-wider">{account.numeroCuenta}</p>
                </div>
                <div className="text-right pr-[18px]">
                  <p className="text-[20px] font-black text-[color:var(--theme-text)] leading-none mb-1.5">
                    {account.moneda || 'GTQ'} {Number(account.saldo).toLocaleString()}
                  </p>
                  <p className={`text-[12px] font-semibold ${account.estado ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {account.estado ? 'Activa' : 'Inactiva'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CURRENCY DASHBOARD SECTION */}
      <div className="mt-8">
        <div className="mb-4">
          <h3 className="text-[22px] font-black text-[color:var(--theme-text)]">Tipo de Cambio</h3>
          <p className="text-[13px] text-[color:var(--theme-text-muted)]">Tasas de conversión actuales basadas en las divisas de tus cuentas.</p>
        </div>
        <CurrencyDashboard allowedCurrencies={userCurrencies} />
      </div>

      {/* SUPPORT BANNER (MOVED) */}
      <div className="mt-8 rounded-[18px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-[46px] h-[46px] rounded-[12px] bg-[color:var(--theme-surface-alt)] border border-[color:var(--theme-border)] flex items-center justify-center shrink-0">
            <Headphones size={22} className="text-[color:var(--theme-text)]" />
          </div>
          <div>
            <h3 className="text-[18px] font-black text-[color:var(--theme-text)] mb-1">¿Necesitas ayuda?</h3>
            <p className="text-[13px] text-[color:var(--theme-text-muted)]">Nuestro asistente virtual está listo para ayudarte en tiempo real.</p>
          </div>
        </div>
        <button
          onClick={() => {
            startNewChat();
            sendMessage("Hola, necesito ayuda con mi cuenta.");
          }}
          className="self-start sm:self-auto h-[44px] px-7 rounded-[12px] border border-[color:var(--theme-border)] text-[color:var(--theme-text)] text-[14px] font-bold flex items-center gap-2 hover:bg-[color:var(--theme-surface-alt)] transition-colors whitespace-nowrap"
        >
          Hablar con soporte <ArrowRight size={14} />
        </button>
      </div>

    </div>
  )
}

