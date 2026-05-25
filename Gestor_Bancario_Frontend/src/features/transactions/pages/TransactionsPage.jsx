import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import transactionsImage from "../../../assets/Transacciones-image.png"
import { createDepositTransaction, createTransferTransaction } from "../../../shared/api"
import { useAuthStore } from "../../auth/store/authStore"
import { useAccountStore } from "../../account/store/useAccountStore"
import { useTransactionStore } from "../store/useTransactionStore"

const formatDate = (dateValue) => {
  if (!dateValue) return "-"
  const date = new Date(dateValue)
  return date.toLocaleString("es-GT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })
}

const formatAmount = (amount, type) => {
  const numberAmount = Number(amount || 0)
  const isDebit = type === "RETIRO" || type === "TRANSFERENCIA"
  const prefix = isDebit ? "-" : "+"
  return `${prefix} Q${numberAmount.toFixed(2)}`
}

const normalizeTypeLabel = (type) => {
  if (type === "DEPOSITO") return "Deposito"
  if (type === "TRANSFERENCIA") return "Transferencia"
  if (type === "RETIRO") return "Retiro"
  return type || "-"
}

export const TransactionsPage = () => {
  const { session } = useAuthStore()
  const { accounts, getAccounts } = useAccountStore()
  const { transactions, loading: loadingData, getTransactionsData } = useTransactionStore()
  const location = useLocation()
  
  const [formValues, setFormValues] = useState({
    cuentaOrigen: location.state?.cuentaOrigen || "",
    cuentaDestino: "",
    monto: "",
    descripcion: "",
    moneda: "GTQ"
  })
  const [savingTransaction, setSavingTransaction] = useState(false)

  const userRole = session?.user?.role || ""
  const isAdmin = userRole === "ADMIN_ROLE"

  const fetchInitialData = async () => {
    // Si no existen las cuentas, cargarlas del store. No se hacen promise.all de axios aqui.
    getAccounts()
    getTransactionsData({ limit: 100 })
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormValues({
      cuentaOrigen: "",
      cuentaDestino: "",
      monto: "",
      descripcion: "",
      moneda: "GTQ"
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formValues.cuentaDestino.trim()) {
      toast.error("La cuenta destino es obligatoria")
      return
    }

    if (!isAdmin && !formValues.cuentaOrigen.trim()) {
      toast.error("La cuenta origen es obligatoria para transferencias")
      return
    }

    if (!formValues.monto || Number(formValues.monto) <= 0) {
      toast.error("El monto debe ser mayor a 0")
      return
    }

    if (!formValues.descripcion.trim()) {
      toast.error("La descripcion es obligatoria")
      return
    }

    try {
      setSavingTransaction(true)

      if (isAdmin) {
        console.log('[transactions] request', {
          tipoTransaccion: 'DEPOSITO',
          cuentaDestino: formValues.cuentaDestino.trim(),
          monto: Number(formValues.monto),
          descripcion: formValues.descripcion.trim(),
          moneda: formValues.moneda
        })
        await createDepositTransaction({
          cuentaDestino: formValues.cuentaDestino.trim(),
          monto: Number(formValues.monto),
          descripcion: formValues.descripcion.trim(),
          moneda: formValues.moneda
        })
        toast.success("Deposito creado exitosamente")
      } else {
        console.log('[transactions] request', {
          tipoTransaccion: 'TRANSFERENCIA',
          cuentaOrigen: formValues.cuentaOrigen.trim(),
          cuentaDestino: formValues.cuentaDestino.trim(),
          monto: Number(formValues.monto),
          descripcion: formValues.descripcion.trim(),
          moneda: formValues.moneda
        })
        await createTransferTransaction({
          cuentaOrigen: formValues.cuentaOrigen.trim(),
          cuentaDestino: formValues.cuentaDestino.trim(),
          monto: Number(formValues.monto),
          descripcion: formValues.descripcion.trim(),
          moneda: formValues.moneda
        })
        toast.success("Transferencia realizada exitosamente")
      }

      resetForm()
      
      // Sincronizacion global en tiempo real:
      // Se recargan cuentas y transacciones en todos los stores
      await Promise.all([
        getAccounts(),
        getTransactionsData({ limit: 100 })
      ])
      
    } catch (error) {
      console.log('[transactions] error', {
        status: error?.response?.status,
        data: error?.response?.data,
        message: error?.message
      })
      const message = error?.response?.data?.message || `No se pudo procesar la ${isAdmin ? 'transaccion' : 'transferencia'}`
      toast.error(message)
    } finally {
      setSavingTransaction(false)
    }
  }

  const todaySummary = useMemo(() => {
    const today = new Date()
    const isSameDay = (dateValue) => {
      const d = new Date(dateValue)
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
    }

    let deposits = 0
    let withdrawals = 0
    let depositsCount = 0
    let withdrawalsCount = 0

    for (const item of transactions) {
      if (!isSameDay(item.createdAt)) continue

      const amount = Number(item.monto || 0)
      if (item.tipoTransaccion === "DEPOSITO") {
        deposits += amount
        depositsCount += 1
      } else if (item.tipoTransaccion === "RETIRO" || item.tipoTransaccion === "TRANSFERENCIA") {
        withdrawals += amount
        withdrawalsCount += 1
      }
    }

    return {
      deposits,
      withdrawals,
      depositsCount,
      withdrawalsCount
    }
  }, [transactions])

  return (
    <section className="space-y-5 text-[var(--theme-text)]">
      <header className="flex flex-col gap-3 rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] p-4 md:flex-row md:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--theme-primary)] text-white shadow-sm">
          <span className="text-3xl font-bold">↔</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Transacciones</h1>
          <p className="mt-1 text-base text-[var(--theme-text-muted)]">
            {isAdmin ? "Registro y creacion de depositos en cuentas de usuarios." : "Historial de tus movimientos y transferencias."}
          </p>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[2.25fr_1fr]">
        <article className="rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 shadow-[var(--theme-shadow)]">
          <h2 className="text-3xl font-extrabold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>
            {isAdmin ? "Nuevo deposito" : "Nueva transferencia"}
          </h2>
          <p className="mt-1 text-sm text-[var(--theme-text-muted)]">
            {isAdmin ? "Completa los datos para registrar un deposito en la cuenta indicada." : "Transfiere fondos desde tu cuenta hacia otra cuenta destino."}
          </p>

          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            {!isAdmin && (
              <label className="space-y-2" title="Tu cuenta desde donde saldrá el dinero">
                <span className="text-sm font-semibold">Cuenta origen (Tu cuenta)</span>
                <select
                  name="cuentaOrigen"
                  value={formValues.cuentaOrigen}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-4 text-sm text-[var(--theme-text)] outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
                >
                  <option value="" disabled>Selecciona tu cuenta</option>
                  {accounts.map((account) => (
                    <option key={account.numeroCuenta} value={account.numeroCuenta}>
                      {account.numeroCuenta} - Q{account.saldo?.toFixed(2) || '0.00'}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="space-y-2" title={isAdmin ? "Número de cuenta donde se realizará el depósito" : "Número de cuenta a la que deseas transferir"}>
              <span className="text-sm font-semibold">Cuenta destino</span>
              <input
                type="text"
                placeholder="Ej. 1000000001"
                name="cuentaDestino"
                value={formValues.cuentaDestino}
                onChange={handleChange}
                list="cuentas-destino"
                className="h-12 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-4 text-sm text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
              />
              {isAdmin && (
                <datalist id="cuentas-destino">
                  {accounts.map((account) => (
                    <option key={account.numeroCuenta} value={account.numeroCuenta} />
                  ))}
                </datalist>
              )}
            </label>

            <label className="space-y-2" title="Cantidad de dinero a transferir o depositar">
                <span className="text-sm font-semibold">Monto</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Ej. 100.00"
                  name="monto"
                  value={formValues.monto}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-4 text-sm text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
                />
              </label>

              <label className="space-y-2" title="Divisa de la transacción">
                <span className="text-sm font-semibold">Moneda</span>
                <select
                  name="moneda"
                  value={formValues.moneda}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-4 text-sm text-[var(--theme-text)] outline-none focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
                >
                  <option value="GTQ">GTQ</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="MXN">MXN</option>
                  <option value="COP">COP</option>
                  <option value="JPY">JPY</option>
                </select>
              </label>

              <label className="space-y-2" title="El tipo de transacción que se realizará">
                <span className="text-sm font-semibold">Tipo de transaccion</span>
                <div className="flex h-12 items-center justify-between rounded-xl border border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 px-4 text-sm font-semibold text-[var(--theme-primary)]">
                  <span>{isAdmin ? "Deposito" : "Transferencia"}</span>
                  <span className="text-lg">⌄</span>
                </div>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold">Descripcion</span>
                <textarea
                  rows="3"
                  placeholder={isAdmin ? "Motivo del deposito..." : "Motivo de la transferencia..."}
                  name="descripcion"
                  value={formValues.descripcion}
                  onChange={handleChange}
                  className="w-full resize-none rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface-alt)] px-4 py-3 text-sm text-[var(--theme-text)] outline-none placeholder:text-[var(--theme-text-muted)] focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
                />
              </label>

              <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
                <button
                  type="submit"
                  disabled={savingTransaction}
                  className="h-11 rounded-xl bg-[var(--theme-primary)] px-7 text-sm font-bold text-black transition hover:brightness-95 disabled:opacity-50"
                >
                  {savingTransaction ? "Procesando..." : isAdmin ? "Guardar deposito" : "Realizar transferencia"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="h-11 rounded-xl border border-[var(--status-rose-border)] px-7 text-sm font-bold text-[var(--status-rose-text)] transition hover:bg-[var(--status-rose-bg)]"
                >
                  Limpiar
                </button>
              </div>
            </form>
          </article>

        <aside className="space-y-4">
          {isAdmin && (
            <div className="overflow-hidden rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow)]">
              <div className="h-28 bg-[var(--theme-surface-alt)]">
                <img src={transactionsImage} alt="Ilustracion de transacciones" className="h-full w-full object-cover opacity-80 mix-blend-luminosity" />
              </div>
              <div className="m-4 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-4 text-sky-700 dark:text-sky-300">
                <h3 className="text-base font-bold">Regla de negocio</h3>
                <p className="mt-1 text-sm opacity-90">
                  El administrador unicamente puede crear transacciones de tipo <span className="font-bold">deposito</span>.
                </p>
              </div>
            </div>
          )}
          {!isAdmin && (
            <div className="overflow-hidden rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow)]">
              <div className="h-28 bg-[var(--theme-surface-alt)]">
                <img src={transactionsImage} alt="Ilustracion de transferencias" className="h-full w-full object-cover opacity-80 mix-blend-luminosity" />
              </div>
              <div className="m-4 rounded-xl border border-sky-500/30 bg-sky-500/10 px-4 py-4 text-sky-700 dark:text-sky-300">
                <h3 className="text-base font-bold">Transferencias seguras</h3>
                <p className="mt-1 text-sm opacity-90">
                  Puedes enviar dinero seleccionando una de tus cuentas y proporcionando el número de cuenta de destino válido.
                </p>
              </div>
            </div>
          )}

          <div className="rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 shadow-[var(--theme-shadow)]">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>Resumen del dia</h3>
              <div className="rounded-xl border border-[var(--theme-border)] p-2">📅</div>
            </div>
            <p className="mt-1 text-xs text-[var(--theme-text-muted)]">{new Date().toLocaleDateString("es-GT")}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[var(--theme-surface-alt)] p-3">
                <p className="text-xs text-[var(--theme-text-muted)]">Depositos</p>
                <p className="mt-1 text-2xl font-bold text-[var(--status-emerald-text)]">Q{todaySummary.deposits.toFixed(2)}</p>
                <p className="text-xs text-[var(--theme-text-muted)]">{todaySummary.depositsCount} transacciones</p>
              </div>
              <div className="rounded-xl bg-[var(--theme-surface-alt)] p-3">
                <p className="text-xs text-[var(--theme-text-muted)]">Retiros / Pagos</p>
                <p className="mt-1 text-2xl font-bold text-[var(--status-rose-text)]">Q{todaySummary.withdrawals.toFixed(2)}</p>
                <p className="text-xs text-[var(--theme-text-muted)]">{todaySummary.withdrawalsCount} transacciones</p>
              </div>
            </div>

            <button type="button" onClick={fetchInitialData} className="mt-4 h-11 w-full rounded-xl bg-[var(--theme-primary)] px-4 text-left text-sm font-bold text-white transition hover:brightness-95">
              Actualizar resumen
            </button>
          </div>
        </aside>
      </div>

      <article className="overflow-hidden rounded-[18px] border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-[var(--theme-shadow)]">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--theme-border)] px-4 py-4">
          <h3 className="text-2xl font-extrabold text-[var(--theme-text)]" style={{ fontFamily: 'var(--font-display)' }}>Transacciones recientes</h3>
          <button type="button" onClick={fetchInitialData} className="text-sm font-bold text-[var(--theme-primary)] transition hover:opacity-80">
            {loadingData ? "Cargando..." : "Actualizar"}
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-[940px] w-full text-left text-sm">
            <thead className="bg-[var(--theme-surface-alt)] text-xs uppercase tracking-wide text-[var(--theme-text-muted)]">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Cuenta destino</th>
                <th className="px-4 py-3">Descripcion</th>
                <th className="px-4 py-3">Monto</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-[var(--theme-text-muted)]">
                    No hay transacciones registradas.
                  </td>
                </tr>
              )}

              {transactions.map((transaction, index) => (
                <tr key={transaction.id || transaction._id || `${transaction.createdAt}-${transaction.cuentaDestino}` || index} className="border-t border-[var(--theme-border)]">
                  <td className="px-4 py-3">{formatDate(transaction.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.tipoTransaccion === "DEPOSITO" ? "bg-[var(--status-emerald-bg)] text-[var(--status-emerald-text)] border border-[var(--status-emerald-border)]" : "bg-[var(--status-rose-bg)] text-[var(--status-rose-text)] border border-[var(--status-rose-border)]"
                      }`}
                    >
                      {normalizeTypeLabel(transaction.tipoTransaccion)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{transaction.cuentaDestino || transaction.cuentaOrigen || "-"}</td>
                  <td className="px-4 py-3">{transaction.descripcion || "Sin descripcion"}</td>
                  <td
                    className={`px-4 py-3 font-bold ${
                      transaction.tipoTransaccion === "DEPOSITO" ? "text-[var(--status-emerald-text)]" : "text-[var(--status-rose-text)]"
                    }`}
                  >
                    {formatAmount(transaction.monto, transaction.tipoTransaccion)}
                  </td>
                  <td className="px-4 py-3">{session?.user?.name || session?.user?.nombre || "Admin"}</td>
                  <td className="px-4 py-3 text-sm">{transaction.estado || "COMPLETADA"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}
