import { useEffect, useMemo, useState } from "react"
import { Search, Filter, Download, AlertCircle, Eye, ToggleRight, ToggleLeft } from "lucide-react"
import { getAllAccountsAdmin, updateAccountStatus } from "../../../shared/api/account"
import { Spinner } from "../../../shared/components/layout/Spinner.jsx"
import { AccountModal } from "./AccountModal.jsx"

export const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState("")
  const [actionId, setActionId] = useState("")
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [currencyFilter, setCurrencyFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("newest")

  // Load accounts
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await getAllAccountsAdmin(1, 100, 'all')
        setAccounts(Array.isArray(response?.data?.data) ? response.data.data : [])
      } catch (err) {
        setError(err.message || "Error al cargar las cuentas")
      } finally {
        setLoading(false)
      }
    }
    loadAccounts()
  }, [])

  // Filter and sort
  const filteredAccounts = useMemo(() => {
    let result = [...accounts]

    // Search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase()
      result = result.filter(acc =>
        (acc.numeroCuenta || "").toLowerCase().includes(searchLower) ||
        (acc.userId || "").toLowerCase().includes(searchLower) ||
        (acc.moneda || "").toLowerCase().includes(searchLower)
      )
    }

    // Status filter
    if (statusFilter !== "ALL") {
      const statusValue = statusFilter === "ACTIVE"
      result = result.filter(acc => acc.estado === statusValue)
    }

    // Type filter
    if (typeFilter !== "ALL") {
      result = result.filter(acc => acc.tipoCuenta === typeFilter)
    }

    // Currency filter
    if (currencyFilter !== "ALL") {
      result = result.filter(acc => acc.moneda === currencyFilter)
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "highest-balance":
          return b.saldo - a.saldo
        case "lowest-balance":
          return a.saldo - b.saldo
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return result
  }, [accounts, search, statusFilter, typeFilter, currencyFilter, sortBy])

  const handleViewDetails = (account) => {
    setSelectedAccount(account)
    setIsModalOpen(true)
  }

  const handleToggleStatus = async (account) => {
    try {
      setActionId(account.numeroCuenta)
      setActionError("")
      const nextEstado = !account.estado
      await updateAccountStatus(account.numeroCuenta, nextEstado)

      setAccounts((current) =>
        current.map((item) =>
          item.numeroCuenta === account.numeroCuenta
            ? { ...item, estado: nextEstado }
            : item
        )
      )
    } catch (err) {
      setActionError(err.message || "No fue posible actualizar la cuenta")
    } finally {
      setActionId("")
    }
  }

  const handleDownloadReport = () => {
    // TODO: Implement CSV export
    console.log("Download report")
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAccount(null)
  }

  // Stats
  const totalAccounts = accounts.length
  const activeAccounts = accounts.filter(a => a.estado).length
  const totalBalance = accounts.reduce((sum, a) => sum + (a.saldo || 0), 0)

  if (loading) return <Spinner />

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: currency || "GTQ",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-GT", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const getAccountTypeLabel = (type) => {
    const types = {
      AHORRO: "Ahorro",
      MONETARIA: "Monetaria",
    }
    return types[type] || type
  }

  const getStatusBadge = (estado) => {
    if (estado) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
          Activa
        </span>
      )
    } else {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
          <span className="h-2 w-2 rounded-full bg-slate-400"></span>
          Inactiva
        </span>
      )
    }
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Gestión de Cuentas</h1>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition"
        >
          <Download size={20} />
          Descargar Reporte
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600 uppercase">Total de Cuentas</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{totalAccounts}</p>
          <p className="mt-1 text-xs text-slate-500">{activeAccounts} activas</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600 uppercase">Saldo Total (GTQ)</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">
            {totalBalance.toLocaleString("es-GT", { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-600 uppercase">Promedio por Cuenta</p>
          <p className="mt-2 text-4xl font-bold text-slate-900">
            {totalAccounts > 0
              ? (totalBalance / totalAccounts).toLocaleString("es-GT", { maximumFractionDigits: 2 })
              : "0"}
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={20} className="text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-900">Filtros y Búsqueda</h2>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Buscar por número de cuenta o usuario
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej: 1234567890 o usuario@email.com"
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-slate-900 placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVE">Activas</option>
                <option value="INACTIVE">Inactivas</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">Todos</option>
                <option value="AHORRO">Ahorro</option>
                <option value="MONETARIA">Monetaria</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Moneda</label>
              <select
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">Todas</option>
                <option value="GTQ">GTQ</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="MXN">MXN</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Ordenar</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="highest-balance">Mayor saldo</option>
                <option value="lowest-balance">Menor saldo</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}
      {actionError ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-700">{actionError}</p>
        </div>
      ) : null}

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {filteredAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-3" />
            <p className="text-slate-600">No se encontraron cuentas con los filtros aplicados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                    # Cuenta
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                    Saldo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                    Creada
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredAccounts.map((account) => (
                  <tr key={account._id || account.numeroCuenta} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-slate-900">
                      {account.numeroCuenta}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {account.userId}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {getAccountTypeLabel(account.tipoCuenta)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                      {formatCurrency(account.saldo, account.moneda)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(account.estado)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {formatDate(account.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(account)}
                          className="inline-flex items-center justify-center p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(account)}
                          disabled={actionId === account.numeroCuenta}
                          className={`inline-flex items-center justify-center p-2 rounded-lg transition ${
                            account.estado
                              ? "text-orange-600 hover:bg-orange-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                          title={account.estado ? "Desactivar" : "Activar"}
                        >
                          {account.estado ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={closeModal}
        account={selectedAccount}
      />
    </div>
  )
}
