import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import transactionsImage from "../../../assets/Transacciones-image.png"
import { createDepositTransaction, getTransactions, getAccounts } from "../../../shared/api"

const getTokenPayload = () => {
  const tokenKeys = ["token", "authToken", "accessToken", "x-token"]

  let token = null
  for (const key of tokenKeys) {
    token = localStorage.getItem(key) || sessionStorage.getItem(key)
    if (token) break
  }

  if (!token) return null

  try {
    const payloadBase64 = token.split(".")[1]
    if (!payloadBase64) return null
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

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
  const [formValues, setFormValues] = useState({
    cuentaDestino: "",
    monto: "",
    descripcion: "",
    moneda: "GTQ"
  })
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [savingTransaction, setSavingTransaction] = useState(false)

  const tokenPayload = useMemo(() => getTokenPayload(), [])
  const userRole = tokenPayload?.role || ""
  const isAdmin = userRole === "ADMIN_ROLE"

  const fetchInitialData = async () => {
    try {
      setLoadingData(true)

      const [accountsResponse, transactionsResponse] = await Promise.all([
        getAccounts({ limit: 100 }),
        getTransactions({ limit: 10 })
      ])

      const accountsData = Array.isArray(accountsResponse?.data?.data) ? accountsResponse.data.data : []
      const transactionData = Array.isArray(transactionsResponse?.data?.data) ? transactionsResponse.data.data : []

      setAccounts(accountsData)
      setTransactions(transactionData)
    } catch (error) {
      const message = error?.response?.data?.message || "No se pudieron cargar los datos de transacciones"
      toast.error(message)
    } finally {
      setLoadingData(false)
    }
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
      cuentaDestino: "",
      monto: "",
      descripcion: "",
      moneda: "GTQ"
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isAdmin) {
      toast.error("Solo un administrador puede registrar depositos")
      return
    }

    if (!formValues.cuentaDestino.trim()) {
      toast.error("La cuenta destino es obligatoria")
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

      await createDepositTransaction({
        cuentaDestino: formValues.cuentaDestino.trim(),
        monto: Number(formValues.monto),
        descripcion: formValues.descripcion.trim(),
        moneda: formValues.moneda
      })

      toast.success("Deposito creado exitosamente")
      resetForm()
      await fetchInitialData()
    } catch (error) {
      const message = error?.response?.data?.message || "No se pudo crear el deposito"
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
    <section className="space-y-5 text-[#011743]">
      <header className="flex flex-col gap-3 rounded-2xl bg-[#F3F2F2] py-2 md:flex-row md:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F8D80D] shadow-sm">
          <span className="text-3xl font-bold">↔</span>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Transacciones</h1>
          <p className="mt-1 text-base text-[#011743]/70">Registro y creacion de depositos en cuentas de usuarios.</p>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[2.25fr_1fr]">
        <article className="rounded-2xl border border-[#011743]/10 bg-white p-5 shadow-sm">
          <h2 className="text-3xl font-extrabold text-[#011743]">Nuevo deposito</h2>
          <p className="mt-1 text-sm text-[#011743]/65">Completa los datos para registrar un deposito en la cuenta indicada.</p>
          {!isAdmin && (
            <p className="mt-2 rounded-lg bg-[#d55353]/10 px-3 py-2 text-sm font-semibold text-[#d55353]">
              Tu usuario no es administrador. Solo ADMIN_ROLE puede crear depositos.
            </p>
          )}

          <form className="mt-5 grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <label className="space-y-2">
              <span className="text-sm font-semibold">Cuenta destino</span>
              <input
                type="text"
                placeholder="Ej. 001-874563-2"
                name="cuentaDestino"
                value={formValues.cuentaDestino}
                onChange={handleChange}
                list="cuentas-destino"
                className="h-12 w-full rounded-xl border border-[#011743]/15 bg-[#F3F2F2] px-4 text-sm outline-none placeholder:text-[#011743]/35 focus:border-[#011743]"
              />
              <datalist id="cuentas-destino">
                {accounts.map((account) => (
                  <option key={account.numeroCuenta} value={account.numeroCuenta} />
                ))}
              </datalist>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Monto (GTQ)</span>
              <input
                type="number"
                min="0"
                placeholder="Q 0.00"
                name="monto"
                value={formValues.monto}
                onChange={handleChange}
                className="h-12 w-full rounded-xl border border-[#011743]/15 bg-[#F3F2F2] px-4 text-sm outline-none placeholder:text-[#011743]/35 focus:border-[#011743]"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Tipo de transaccion</span>
              <div className="flex h-12 items-center justify-between rounded-xl border border-[#F8D80D]/90 bg-[#F8D80D]/20 px-4 text-sm font-semibold">
                <span>Deposito</span>
                <span className="text-lg">⌄</span>
              </div>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold">Descripcion</span>
              <textarea
                rows="3"
                placeholder="Motivo del deposito..."
                name="descripcion"
                value={formValues.descripcion}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-[#011743]/15 bg-[#F3F2F2] px-4 py-3 text-sm outline-none placeholder:text-[#011743]/35 focus:border-[#011743]"
              />
            </label>

            <div className="md:col-span-2 flex flex-wrap gap-3 pt-1">
              <button
                type="submit"
                disabled={savingTransaction || !isAdmin}
                className="h-11 rounded-xl bg-[#F8D80D] px-7 text-sm font-bold text-[#011743] transition hover:brightness-95"
              >
                {savingTransaction ? "Guardando..." : "Guardar deposito"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="h-11 rounded-xl border border-[#d55353] px-7 text-sm font-bold text-[#d55353] transition hover:bg-[#d55353] hover:text-white"
              >
                Limpiar
              </button>
            </div>
          </form>
        </article>

        <aside className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-[#011743]/10 bg-white shadow-sm">
            <div className="h-28 bg-[#F3F2F2]">
              <img src={transactionsImage} alt="Ilustracion de transacciones" className="h-full w-full object-cover" />
            </div>
            <div className="m-4 rounded-2xl bg-[#011743] px-4 py-4 text-white">
              <h3 className="text-base font-bold">Regla de negocio</h3>
              <p className="mt-1 text-sm text-white/85">
                El administrador unicamente puede crear transacciones de tipo <span className="font-bold text-[#F8D80D]">deposito</span>.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#011743]/10 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-extrabold">Resumen del dia</h3>
              <div className="rounded-xl border border-[#011743]/15 p-2">📅</div>
            </div>
            <p className="mt-1 text-xs text-[#011743]/55">{new Date().toLocaleDateString("es-GT")}</p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#F3F2F2] p-3">
                <p className="text-xs text-[#011743]/60">Depositos</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">Q{todaySummary.deposits.toFixed(2)}</p>
                <p className="text-xs text-[#011743]/60">{todaySummary.depositsCount} transacciones</p>
              </div>
              <div className="rounded-xl bg-[#F3F2F2] p-3">
                <p className="text-xs text-[#011743]/60">Retiros / Pagos</p>
                <p className="mt-1 text-2xl font-bold text-[#d55353]">Q{todaySummary.withdrawals.toFixed(2)}</p>
                <p className="text-xs text-[#011743]/60">{todaySummary.withdrawalsCount} transacciones</p>
              </div>
            </div>

            <button type="button" onClick={fetchInitialData} className="mt-4 h-11 w-full rounded-xl bg-[#F8D80D] px-4 text-left text-sm font-bold">
              Actualizar resumen
            </button>
          </div>
        </aside>
      </div>

      <article className="overflow-hidden rounded-2xl border border-[#011743]/10 bg-white shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#011743]/10 px-4 py-4">
          <h3 className="text-2xl font-extrabold">Transacciones recientes</h3>
          <button type="button" onClick={fetchInitialData} className="text-sm font-bold text-[#011743]">
            {loadingData ? "Cargando..." : "Actualizar"}
          </button>
        </header>

        <div className="overflow-x-auto">
          <table className="min-w-[940px] w-full text-left text-sm">
            <thead className="bg-[#F3F2F2] text-xs uppercase tracking-wide text-[#011743]/70">
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
                  <td colSpan="7" className="px-4 py-8 text-center text-[#011743]/60">
                    No hay transacciones registradas.
                  </td>
                </tr>
              )}

              {transactions.map((transaction, index) => (
                <tr key={transaction.id || transaction._id || `${transaction.createdAt}-${transaction.cuentaDestino}` || index} className="border-t border-[#011743]/10">
                  <td className="px-4 py-3">{formatDate(transaction.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.tipoTransaccion === "DEPOSITO" ? "bg-[#F8D80D]/25 text-[#011743]" : "bg-[#d55353]/15 text-[#d55353]"
                      }`}
                    >
                      {normalizeTypeLabel(transaction.tipoTransaccion)}
                    </span>
                  </td>
                  <td className="px-4 py-3">{transaction.cuentaDestino || transaction.cuentaOrigen || "-"}</td>
                  <td className="px-4 py-3">{transaction.descripcion || "Sin descripcion"}</td>
                  <td
                    className={`px-4 py-3 font-bold ${
                      transaction.tipoTransaccion === "DEPOSITO" ? "text-emerald-600" : "text-[#d55353]"
                    }`}
                  >
                    {formatAmount(transaction.monto, transaction.tipoTransaccion)}
                  </td>
                  <td className="px-4 py-3">{tokenPayload?.name || tokenPayload?.nombre || "Admin"}</td>
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
