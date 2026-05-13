import { useEffect, useState } from 'react'
import {
  User,
  Wallet,
  Plus,
  Headphones
} from 'lucide-react'

import { getRecentAccounts } from '../../shared/api/bank.js'
import { requestAccountCreation } from '../../shared/api/account.js'

export default function ClientDashboard({ session }) {
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState('')
  const [accounts, setAccounts] = useState([])
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false)
  const [requestForm, setRequestForm] = useState({ tipoCuenta: 'AHORRO', moneda: 'GTQ' })
  const [requestLoading, setRequestLoading] = useState(false)
  const [requestError, setRequestError] = useState('')
  const [requestSuccess, setRequestSuccess] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadAccounts = async () => {
      try {
        const response = await getRecentAccounts(session.token)

        if (!isMounted) return

        setAccounts(
          Array.isArray(response?.data)
            ? response.data
            : []
        )
      } catch (error) {
        if (!isMounted) return

        setAccountsError(
          error.message || 'No fue posible cargar las cuentas'
        )
      } finally {
        if (isMounted) setAccountsLoading(false)
      }
    }

    loadAccounts()

    return () => {
      isMounted = false
    }
  }, [session.token])

  const handleLogout = () => {
    clearSession()
    onLogout()
  }

  const handleRequestFormChange = (event) => {
    const { name, value } = event.target
    setRequestForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleOpenRequestModal = () => {
    setRequestError('')
    setRequestSuccess('')
    setShowCreateRequestModal(true)
  }

  const handleSubmitAccountRequest = async (event) => {
    event.preventDefault()
    setRequestLoading(true)
    setRequestError('')
    setRequestSuccess('')

    try {
      const response = await requestAccountCreation(requestForm)
      setRequestSuccess(response?.message || 'Solicitud enviada al administrador')
      setShowCreateRequestModal(false)
    } catch (error) {
      setRequestError(error.message || 'No fue posible enviar la solicitud')
    } finally {
      setRequestLoading(false)
    }
  }

  return (
    <>
      {/* TOP CARD */}
         {/*<section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
           <div className="flex items-center gap-5">
              

              <div>
                <h2 className="text-5xl font-black">
                  ¡Hola, {session.user?.name || 'Cliente'}!
                </h2>

                <p className="mt-2 text-slate-300 text-lg">
                  Bienvenido a tu panel personal
                </p>
              </div>
            </div>
          </div>
        </section>*/ }

        {/* MAIN GRID */}
        <section className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 mt-8">

          {/* HERO */}
          <article className="relative overflow-hidden rounded-[2rem] border border-blue-500/10 bg-[#09152f] p-10 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 blur-3xl" />

            <div className="relative z-10">
              <p className="uppercase tracking-[0.3em] text-cyan-300 font-semibold text-sm">
                !Bienvenido {session.user?.name || 'Cliente'}!
              </p>

              <h2 className="mt-5 text-6xl font-black leading-tight max-w-3xl">
                Gestiona tus cuentas y finanzas de forma
                <span className="text-cyan-400">
                  {' '}simple y segura.
                </span>
              </h2>

              <p className="mt-6 text-slate-300 text-lg leading-8 max-w-2xl">
                Aquí puedes revisar los movimientos de tus cuentas,
                verificar tu saldo y acceder a tus configuraciones
                principales de manera rápida.
              </p> 

              <div className="grid sm:grid-cols-2 gap-5 mt-10">
                <div className="rounded-[1.7rem] bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/15 flex items-center justify-center">
                    <User className="text-blue-300" />
                  </div>

                  <p className="mt-5 text-slate-400">
                    Usuario
                  </p>

                  <h3 className="mt-1 text-3xl font-black">
                    {session.user?.name || 'Cliente'}
                  </h3>
                </div>

                <div className="rounded-[1.7rem] bg-white/5 border border-white/10 backdrop-blur-xl p-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                    <Wallet className="text-emerald-300" />
                  </div>

                  <p className="mt-5 text-slate-400">
                    Cuentas activas
                  </p>

                  <h3 className="mt-1 text-3xl font-black">
                    {accounts.length}
                  </h3>
                </div>
              </div>
            </div>
          </article>

          {/* ACCOUNTS */}
          <article className="rounded-[2rem] bg-white p-10 text-slate-900 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-4xl font-black">
                Mis cuentas recientes
              </h3>
            </div>

            {requestSuccess ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
                {requestSuccess}
              </div>
            ) : null}

            {requestError ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
                {requestError}
              </div>
            ) : null}

            {accountsError && (
              <div className="mt-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-600">
                {accountsError}
              </div>
            )}

            {accountsLoading && (
              <p className="mt-8 text-slate-500">
                Cargando cuentas...
              </p>
            )}

            {!accountsLoading && accounts.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center text-7xl">
                  👛
                </div>

                <h4 className="mt-8 text-4xl font-black">
                  Aún no tienes cuentas
                </h4>

                <p className="mt-4 text-slate-500 max-w-md text-lg">
                  Cuando tengas cuentas registradas,
                  las verás aquí.
                </p>

                <button
                  type="button"
                  onClick={handleOpenRequestModal}
                  className="mt-8 h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-500 transition text-white font-semibold flex items-center gap-3"
                >
                  <Plus size={20} />
                  Abrir mi primera cuenta
                </button>
              </div>
            )}

            <div className="space-y-5 mt-8">
              {accounts.slice(0, 5).map((account) => (
                <div
                  key={account._id || account.id}
                  className="rounded-[1.7rem] border border-slate-200 p-6 flex items-center justify-between hover:shadow-lg transition"
                >
                  <div>
                    <p className="text-slate-500">
                      Cuenta {account.tipoCuenta}
                    </p>

                    <h4 className="mt-2 text-xl font-bold font-mono">
                      {account.numeroCuenta}
                    </h4>
                  </div>

                  <div className="text-right">
                    <h4 className="text-2xl font-black">
                      {account.moneda || 'GTQ'} {account.saldo}
                    </h4>

                    <p className="text-emerald-500 font-semibold mt-1">
                      Activa
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        {showCreateRequestModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
              <h3 className="text-2xl font-black">Solicitar creacion de cuenta</h3>
              <p className="mt-2 text-sm text-slate-500">
                Solo selecciona tipo y moneda. El administrador aprobara o denegara tu solicitud.
              </p>

              <form className="mt-6 space-y-4" onSubmit={handleSubmitAccountRequest}>
                <label className="block text-sm font-semibold text-slate-700">
                  Tipo de cuenta
                  <select
                    name="tipoCuenta"
                    value={requestForm.tipoCuenta}
                    onChange={handleRequestFormChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="AHORRO">Ahorro</option>
                    <option value="MONETARIA">Monetaria</option>
                  </select>
                </label>

                <label className="block text-sm font-semibold text-slate-700">
                  Moneda
                  <select
                    name="moneda"
                    value={requestForm.moneda}
                    onChange={handleRequestFormChange}
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
                  >
                    <option value="GTQ">GTQ</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="MXN">MXN</option>
                    <option value="COP">COP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </label>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  El monto inicial sera 0 y el estado se definira automaticamente al aprobar.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateRequestModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                    disabled={requestLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={requestLoading}
                    className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                  >
                    {requestLoading ? 'Enviando...' : 'Enviar solicitud'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}

        {/* SUPPORT */}
        <section className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Headphones className="text-emerald-400" />
            </div>

            <div>
              <h3 className="text-3xl font-black">
                ¿Necesitas ayuda?
              </h3>

              <p className="mt-2 text-slate-400 text-lg">
                Nuestro equipo está disponible para ayudarte.
              </p>
            </div>
          </div>

          <button className="h-14 px-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 transition text-emerald-400 font-semibold">
            Contactar soporte
          </button>
        </section>
    </>
  )
}