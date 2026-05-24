import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { Search, Filter, Download, AlertCircle, Eye, ToggleRight, ToggleLeft, PlusCircle, Package, Tag } from "lucide-react"
import {
  getAllAccountsAdmin,
  updateAccountStatus,
  getAccountCreationRequests,
  approveAccountCreationRequest,
  denyAccountCreationRequest,
} from "../../../shared/api/account"
import { getAllUsersWithAuthService } from "../../../shared/api/auth"
import { Spinner } from "../../../shared/components/layout/Spinner.jsx"
import { AccountModal } from "./AccountModal.jsx"
import ExcelJS from "exceljs"
import { AdminCreateAccountModal } from "./AdminCreateAccountModal.jsx"
import { AdminRequestDetailsModal } from "./AdminRequestDetailsModal.jsx"
import { useAuthStore } from "../../auth/store/authStore.js"

const resolveUser = (user) => {
  const profile = user?.UserProfile || {}
  const emailRecord = user?.UserEmail || {}
  const roleRecord = user?.UserRoles?.[0]?.Role || {}

  return {
    id: user?.id || user?.Id || "",
    name: user?.name || user?.Name || "Sin nombre",
    email: user?.email || user?.Email || "sin-email",
    phone: user?.phone || profile.phone || profile.Phone || "",
    role: user?.role || roleRecord.Name || "USER_ROLE",
    isActive: user?.isActive ?? user?.IsActive ?? false,
    emailVerified: user?.isEmailVerified ?? emailRecord.EmailVerified ?? false,
    dpi: profile.DPI || profile.dpi || "No registrado",
    address: profile.Address || profile.address || "No registrada",
    monthlyIncome: profile.MonthlyIncome || profile.monthlyIncome || 0,
    occupation: profile.Occupation || profile.occupation || "No registrada",
  }
}
export const AdminAccounts = () => {
  const { session } = useAuthStore()
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState("")
  const [actionId, setActionId] = useState("")
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState("")
  const [accountRequests, setAccountRequests] = useState([])
  const [accountRequestsLoading, setAccountRequestsLoading] = useState(false)
  const [accountRequestsError, setAccountRequestsError] = useState("")
  const [requestActionId, setRequestActionId] = useState("")
  
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  // Filters
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [currencyFilter, setCurrencyFilter] = useState("ALL")
  const [sortBy, setSortBy] = useState("newest")

  // Load accounts
  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getAllAccountsAdmin(1, 100, "all")
      setAccounts(Array.isArray(response?.data?.data) ? response.data.data : [])
    } catch (err) {
      setError(err.message || "Error al cargar las cuentas")
    } finally {
      setLoading(false)
    }
  }, [])



  useEffect(() => {
    loadAccounts()
  }, [loadAccounts])

  const loadAccountRequests = useCallback(async () => {
    try {
      setAccountRequestsLoading(true)
      setAccountRequestsError("")
      const response = await getAccountCreationRequests("PENDING")
      setAccountRequests(Array.isArray(response?.data?.data) ? response.data.data : [])
    } catch (err) {
      setAccountRequestsError(err.message || "No fue posible cargar las solicitudes de cuenta")
    } finally {
      setAccountRequestsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAccountRequests()
  }, [loadAccountRequests])

  const loadUsers = useCallback(async () => {
    if (!session?.token) {
      setUsersError("No hay sesion activa para cargar usuarios")
      return
    }



    try {
      setUsersLoading(true)
      setUsersError("")
      const response = await getAllUsersWithAuthService(session.token)
      const rawUsers = Array.isArray(response?.users) ? response.users : []
      setUsers(rawUsers.map(resolveUser).filter((user) => user.id))
    } catch (err) {
      setUsersError(err.message || "No fue posible cargar los usuarios")
    } finally {
      setUsersLoading(false)
    }
  }, [session?.token])

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

  const handleOpenCreate = () => {
    setIsCreateOpen(true)
    if (!users.length && !usersLoading) {
      loadUsers()
    }
  }

  const handleCloseCreate = () => {
    setIsCreateOpen(false)
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

  const handleRequestAction = async (requestId, action) => {
    try {
      setRequestActionId(requestId)
      setActionError("")

      if (action === "approve") {
        await approveAccountCreationRequest(requestId)
        await loadAccounts() // Refresh accounts table
      } else {
        await denyAccountCreationRequest(requestId)
      }

      // Optimistic update: remove from local state immediately
      setAccountRequests((current) => current.filter((item) => item._id !== requestId))
      handleCloseRequestModal()
    } catch (err) {
      setActionError(err.message || "No fue posible procesar la solicitud")
    } finally {
      setRequestActionId("")
    }
  }

  const handleOpenRequestModal = (request) => {
    setSelectedRequest(request)
    setIsRequestModalOpen(true)
    if (!users.length && !usersLoading) {
      loadUsers()
    }
  }

  const handleCloseRequestModal = () => {
    setSelectedRequest(null)
    setIsRequestModalOpen(false)
  }

  const handleDownloadReport = async () => {
    try {
      const workbook = new ExcelJS.Workbook()
      workbook.creator = "Gestor Bancario"
      workbook.created = new Date()
      workbook.modified = new Date()

      const detailsSheet = workbook.addWorksheet("Detalles de Cuentas", {
        properties: { defaultRowHeight: 20 },
        views: [{ state: "frozen", ySplit: 4 }],
      })

      detailsSheet.mergeCells("A1:H1")
      detailsSheet.getCell("A1").value = "REPORTE DE CUENTAS"
      detailsSheet.getCell("A1").font = { name: "Calibri", size: 16, bold: true, color: { argb: "FFFFFFFF" } }
      detailsSheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" }
      detailsSheet.getCell("A1").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F4E78" } }

      detailsSheet.mergeCells("A2:H2")
      detailsSheet.getCell("A2").value = `Generado el ${new Date().toLocaleString("es-GT")}`
      detailsSheet.getCell("A2").font = { name: "Calibri", size: 10, italic: true, color: { argb: "FF5B6570" } }
      detailsSheet.getCell("A2").alignment = { horizontal: "right" }

      detailsSheet.addRow([])
      const detailHeaderRow = detailsSheet.addRow([
        "Número de Cuenta",
        "ID Usuario",
        "Tipo de Cuenta",
        "Moneda",
        "Saldo",
        "Estado",
        "Fecha de Creación",
        "Última Actualización",
      ])

      

      detailHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: "FFFFFFFF" } }
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2F75B5" } }
        cell.alignment = { horizontal: "center", vertical: "middle" }
        cell.border = {
          top: { style: "thin", color: { argb: "FFB8C2CC" } },
          left: { style: "thin", color: { argb: "FFB8C2CC" } },
          bottom: { style: "thin", color: { argb: "FFB8C2CC" } },
          right: { style: "thin", color: { argb: "FFB8C2CC" } },
        }
      })

      filteredAccounts.forEach((account) => {
        const row = detailsSheet.addRow([
          account.numeroCuenta || "-",
          account.userId || "-",
          getAccountTypeLabel(account.tipoCuenta) || "-",
          account.moneda || "-",
          Number(account.saldo || 0),
          account.estado ? "Activa" : "Inactiva",
          account.createdAt ? new Date(account.createdAt) : null,
          account.updatedAt ? new Date(account.updatedAt) : null,
        ])

        row.eachCell((cell, colNumber) => {
          cell.border = {
            top: { style: "thin", color: { argb: "FFD9E2F3" } },
            left: { style: "thin", color: { argb: "FFD9E2F3" } },
            bottom: { style: "thin", color: { argb: "FFD9E2F3" } },
            right: { style: "thin", color: { argb: "FFD9E2F3" } },
          }
          cell.alignment = { vertical: "middle" }

          if (colNumber === 5) {
            cell.numFmt = '#,##0.00'
            cell.alignment = { horizontal: "right", vertical: "middle" }
          }

          if (colNumber === 6) {
            const isActive = cell.value === "Activa"
            cell.font = { bold: true, color: { argb: isActive ? "FF1E7A3E" : "FF7A1E1E" } }
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: isActive ? "FFE8F5E9" : "FFFDECEC" },
            }
            cell.alignment = { horizontal: "center", vertical: "middle" }
          }
        })

        if (row.number % 2 === 0) {
          row.eachCell((cell, colNumber) => {
            if (colNumber !== 6) {
              cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F9FC" } }
            }
          })
        }
      })

      detailsSheet.columns.forEach((column, index) => {
        const widths = [20, 18, 18, 12, 14, 14, 20, 20]
        column.width = widths[index] || 15
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `Reporte_Cuentas_${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error al descargar el reporte:", err)
      setActionError("Error al generar el reporte Excel")
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAccount(null)
  }

  const handleCreateSuccess = () => {
    setIsCreateOpen(false)
    loadAccounts()
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
    <div className="space-y-6 w-full text-[color:var(--theme-text)]">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Cuentas</h1>
          <p className="mt-2 text-sm text-[color:var(--theme-text-muted)]">
            Administra el estado, saldo y solicitudes de cuentas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/promociones"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--theme-text)] transition hover:bg-[color:var(--theme-surface-alt)]"
          >
            <Tag size={16} />
            Promociones
          </Link>
          <Link
            to="/dashboard/servicios"
            className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-sm font-semibold text-[color:var(--theme-text)] transition hover:bg-[color:var(--theme-surface-alt)]"
          >
            <Package size={16} />
            Servicios
          </Link>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 transition"
          >
            <PlusCircle size={20} />
            Crear cuenta
          </button>
          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700 transition"
          >
            <Download size={20} />
            Descargar Reporte
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-[color:var(--theme-text-muted)] uppercase">Total de Cuentas</p>
          <p className="mt-2 text-4xl font-bold">{totalAccounts}</p>
          <p className="mt-1 text-xs text-[color:var(--theme-text-muted)]">{activeAccounts} activas</p>
        </div>
        <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-[color:var(--theme-text-muted)] uppercase">Saldo Total (GTQ)</p>
          <p className="mt-2 text-4xl font-bold">
            {totalBalance.toLocaleString("es-GT", { maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
          <p className="text-sm font-semibold text-[color:var(--theme-text-muted)] uppercase">Promedio por Cuenta</p>
          <p className="mt-2 text-4xl font-bold">
            {totalAccounts > 0
              ? (totalBalance / totalAccounts).toLocaleString("es-GT", { maximumFractionDigits: 2 })
              : "0"}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Solicitudes de creacion de cuenta</h2>
            <p className="text-sm text-[color:var(--theme-text-muted)]">Solicitudes enviadas por clientes pendientes de revision</p>
          </div>
          <button
            type="button"
            onClick={loadAccountRequests}
            className="rounded-lg border border-[color:var(--theme-border)] px-3 py-2 text-sm font-semibold text-[color:var(--theme-text-muted)] hover:bg-[color:var(--theme-surface-alt)]"
            disabled={accountRequestsLoading}
          >
            {accountRequestsLoading ? "Cargando..." : "Recargar"}
          </button>
        </div>

        {accountRequestsError ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {accountRequestsError}
          </div>
        ) : null}

        {!accountRequestsLoading && !accountRequests.length ? (
          <div className="mt-4 rounded-xl border border-dashed border-[color:var(--theme-border)] px-4 py-6 text-sm text-[color:var(--theme-text-muted)]">
            No hay solicitudes pendientes.
          </div>
        ) : null}

        <div className="mt-4 space-y-3">
          {accountRequests.map((request) => (
            <div key={request._id} className="rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold">Usuario: {request.userId}</p>
                  <p className="text-xs text-[color:var(--theme-text-muted)]">
                    Tipo: {getAccountTypeLabel(request.tipoCuenta)} | Moneda: {request.moneda}
                  </p>
                  <p className="text-xs text-[color:var(--theme-text-muted)]">
                    Solicitada: {formatDate(request.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenRequestModal(request)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition"
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Section */}
      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={20} className="text-[color:var(--theme-text-muted)]" />
          <h2 className="text-lg font-semibold">Filtros y Búsqueda</h2>
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">
              Buscar por número de cuenta o usuario
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-[color:var(--theme-text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej: 1234567890 o usuario@email.com"
                className="w-full rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] py-2 pl-10 pr-4 text-[color:var(--theme-text)] placeholder:text-[color:var(--theme-text-muted)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </div>
          </div>

          {/* Filters Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-[color:var(--theme-text)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">Todos</option>
                <option value="ACTIVE">Activas</option>
                <option value="INACTIVE">Inactivas</option>
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">Tipo</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-[color:var(--theme-text)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <option value="ALL">Todos</option>
                <option value="AHORRO">Ahorro</option>
                <option value="MONETARIA">Monetaria</option>
              </select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">Moneda</label>
              <select
                value={currencyFilter}
                onChange={(e) => setCurrencyFilter(e.target.value)}
                className="w-full rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-[color:var(--theme-text)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
              <label className="block text-sm font-semibold text-[color:var(--theme-text-muted)] mb-2">Ordenar</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-lg border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-3 py-2 text-[color:var(--theme-text)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] shadow-sm overflow-hidden">
        {filteredAccounts.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-[color:var(--theme-text-muted)] mb-3" />
            <p className="text-[color:var(--theme-text-muted)]">No se encontraron cuentas con los filtros aplicados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[color:var(--theme-text-muted)] uppercase">
                    # Cuenta
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[color:var(--theme-text-muted)] uppercase">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[color:var(--theme-text-muted)] uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[color:var(--theme-text-muted)] uppercase">
                    Saldo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[color:var(--theme-text-muted)] uppercase">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[color:var(--theme-text-muted)] uppercase">
                    Creada
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-[color:var(--theme-text-muted)] uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[color:var(--theme-border)]">
                {filteredAccounts.map((account, index) => (
                  <tr key={account._id || account.numeroCuenta || index} className="hover:bg-[color:var(--theme-surface-alt)] transition">
                    <td className="px-6 py-4 text-sm font-mono font-semibold">
                      {account.numeroCuenta}
                    </td>
                    <td className="px-6 py-4 text-sm text-[color:var(--theme-text-muted)]">
                      {account.userId}
                    </td>
                    <td className="px-6 py-4 text-sm text-[color:var(--theme-text-muted)]">
                      {getAccountTypeLabel(account.tipoCuenta)}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {formatCurrency(account.saldo, account.moneda)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {getStatusBadge(account.estado)}
                    </td>
                    <td className="px-6 py-4 text-sm text-[color:var(--theme-text-muted)]">
                      {formatDate(account.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(account)}
                          className="inline-flex items-center justify-center p-2 text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition"
                          title="Ver detalles"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(account)}
                          disabled={actionId === account.numeroCuenta}
                          className={`inline-flex items-center justify-center p-2 rounded-lg transition ${
                            account.estado
                              ? "text-orange-600 hover:bg-orange-500/10"
                              : "text-emerald-600 hover:bg-emerald-500/10"
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

      <AdminCreateAccountModal
        isOpen={isCreateOpen}
        onClose={handleCloseCreate}
        onCreated={handleCreateSuccess}
        users={users}
        usersLoading={usersLoading}
        usersError={usersError}
        onReloadUsers={loadUsers}
      />

      <AdminRequestDetailsModal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        request={selectedRequest}
        user={users.find((u) => u.id === selectedRequest?.userId)}
        onApprove={(id) => handleRequestAction(id, "approve")}
        onDeny={(id) => handleRequestAction(id, "deny")}
        actionLoadingId={requestActionId}
      />
    </div>
  )
}
