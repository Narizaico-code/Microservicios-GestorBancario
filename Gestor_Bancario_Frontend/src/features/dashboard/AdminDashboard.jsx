import { useEffect, useState } from 'react'
import { DashboardHeader } from './DashboardHeader.jsx'
import { clearSession } from '../../shared/utils/session-storage.js'
import { getAllAccounts, getBankHealth } from '../../shared/api/bank.js'

export const AdminDashboard = ({ session, onLogout }) => {
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
        const accountsResponse = await getAllAccounts(session.token)

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_38%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8">
        <DashboardHeader
          title="Panel administrativo"
          subtitle="Vista de gestión para administradores"
          userRole={session.user?.role || 'ADMIN_ROLE'}
          onLogout={handleLogout}
        />

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[2rem] border border-white/10 bg-slate-900/80 p-8 shadow-2xl shadow-emerald-950/20 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/80">Bienvenido, admin</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-white">
              Administra cuentas, supervisa movimientos y controla el sistema.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
              Este panel usa el JWT del AuthService y consulta el backend bancario con
              permisos administrativos.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Usuario</p>
                <p className="mt-2 text-lg font-semibold text-white">{session.user?.name || 'Admin'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Rol</p>
                <p className="mt-2 text-lg font-semibold text-white">{session.user?.role || 'ADMIN_ROLE'}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Cuentas visibles</p>
                <p className="mt-2 text-lg font-semibold text-white">{accounts.length}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-slate-900 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <h3 className="text-2xl font-bold text-slate-950">Estado del backend</h3>
            {healthLoading ? (
              <p className="mt-4 text-sm text-slate-500">Consultando salud...</p>
            ) : null}
            {healthError ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {healthError}
              </div>
            ) : null}
            {health ? (
              <div className="mt-4 rounded-2xl bg-cyan-50 px-4 py-3 text-sm text-cyan-900">
                <p className="font-semibold">Health</p>
                <p className="mt-1 break-all text-xs">{JSON.stringify(health)}</p>
              </div>
            ) : null}

            <div className="mt-6 space-y-3">
              {accountsError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {accountsError}
                </div>
              ) : null}
              {accountsLoading ? (
                <p className="text-sm text-slate-500">Cargando cuentas...</p>
              ) : null}
              {accounts.slice(0, 5).map((account, index) => (
                <div key={account._id || account.id || index} className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-sm font-medium text-slate-700">Cuenta #{index + 1}</p>
                  <p className="text-xs text-slate-500">Usuario: {account.userId || 'N/D'}</p>
                  <p className="text-xs text-slate-500">Estado: {String(account.estado)}</p>
                </div>
              ))}
              {!accountsLoading && accounts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  No hay cuentas para mostrar.
                </div>
              ) : null}
            </div>
          </article>
        </section>
      </div>
    </main>
  )
}