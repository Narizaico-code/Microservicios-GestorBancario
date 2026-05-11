import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardHeader from './DashboardHeader.jsx'
import { clearSession } from '../../shared/utils/session-storage.js'
import { getBankHealth, getRecentAccounts } from '../../shared/api/bank.js'

export default function ClientDashboard({ session, onLogout }) {
  const [healthLoading, setHealthLoading] = useState(true)
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [healthError, setHealthError] = useState('')
  const [accountsError, setAccountsError] = useState('')
  const [health, setHealth] = useState(null)
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadHealth = async () => {
      try {
        const healthResponse = await getBankHealth()

        if (!isMounted) return
        setHealth(healthResponse)
      } catch (requestError) {
        if (!isMounted) return
        setHealthError(requestError.message || 'No fue posible consultar la salud del backend')
      } finally {
        if (isMounted) setHealthLoading(false)
      }
    }

    const loadAccounts = async () => {
      try {
        const accountsResponse = await getRecentAccounts(session.token)

        if (!isMounted) return
        setAccounts(Array.isArray(accountsResponse?.data) ? accountsResponse.data : [])
      } catch (requestError) {
        if (!isMounted) return
        setAccountsError(requestError.message || 'No fue posible cargar las cuentas')
      } finally {
        if (isMounted) setAccountsLoading(false)
      }
    }

    loadHealth()
    loadAccounts()

    return () => {
      isMounted = false
    }
  }, [session.token])

  const handleLogout = () => {
    clearSession()
    onLogout()
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_38%),linear-gradient(180deg,_#020617_0%,_#111827_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8">
        <DashboardHeader
          title="Panel del cliente"
          subtitle="Vista personal con tus datos y cuentas"
          userRole={session.user?.role || 'USER_ROLE'}
          onLogout={handleLogout}
        />

        <div className="flex flex-wrap justify-end gap-3">
          <Link
            to="/client/perfil"
            className="rounded-full border border-cyan-200/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Ver mi perfil
          </Link>
          <Link
            to="/client/favoritos"
            className="rounded-full border border-cyan-200/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Ver favoritos
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/80">Bienvenido</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Gestiona tus cuentas y finanzas de forma simple.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Aquí puedes revisar los movimientos de tus cuentas, verificar tu saldo y
              acceder a tus configuraciones principales.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Usuario</p>
                <p className="mt-2 text-lg font-semibold text-white">{session.user?.name || 'Cliente'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Cuentas activas</p>
                <p className="mt-2 text-lg font-semibold text-white">{accounts.length}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-slate-950">Mis cuentas recientes</h3>

            <div className="mt-6 space-y-3">
              {accountsError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {accountsError}
                </div>
              ) : null}
              {accountsLoading ? (
                <p className="text-sm text-slate-500">Cargando cuentas...</p>
              ) : null}
              {accounts.slice(0, 5).map((account) => (
                <div key={account._id || account.id || account.numeroCuenta} className="rounded-2xl bg-slate-50 px-4 py-3 border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Cuenta {account.tipoCuenta ? account.tipoCuenta.toLowerCase() : ''}</p>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{account.numeroCuenta || 'Sin numero'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {account.moneda || 'GTQ'} {account.saldo}
                    </p>
                    <p className="text-xs text-emerald-600 font-medium">Activa</p>
                  </div>
                </div>
              ))}
              {!accountsLoading && accounts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500 text-center">
                  Aún no tienes cuentas registradas o activas.
                </div>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}