import { useCallback, useEffect, useMemo, useState } from 'react'
import { getAllAccountsAdmin, updateAccountStatus } from '../../../shared/api/account.js'

export const useAdminAccounts = () => {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState('')
  const [actionId, setActionId] = useState('')

  // Filtros
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [currencyFilter, setCurrencyFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('newest')

  const loadAccounts = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getAllAccountsAdmin(1, 100, 'all')
      setAccounts(Array.isArray(response?.data?.data) ? response.data.data : [])
    } catch (err) {
      setError(err.message || 'Error al cargar las cuentas')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-en-montaje; loadAccounts es estable (useCallback)
    loadAccounts()
  }, [loadAccounts])

  const handleToggleStatus = useCallback(async (account) => {
    try {
      setActionId(account.numeroCuenta)
      setActionError('')
      const nextEstado = !account.estado
      await updateAccountStatus(account.numeroCuenta, nextEstado)
      setAccounts((current) =>
        current.map((item) =>
          item.numeroCuenta === account.numeroCuenta ? { ...item, estado: nextEstado } : item
        )
      )
    } catch (err) {
      setActionError(err.message || 'No fue posible actualizar la cuenta')
    } finally {
      setActionId('')
    }
  }, [])

  const filteredAccounts = useMemo(() => {
    let result = [...accounts]

    if (search.trim()) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (acc) =>
          (acc.numeroCuenta || '').toLowerCase().includes(searchLower) ||
          (acc.userId || '').toLowerCase().includes(searchLower) ||
          (acc.moneda || '').toLowerCase().includes(searchLower)
      )
    }

    if (statusFilter !== 'ALL') {
      const statusValue = statusFilter === 'ACTIVE'
      result = result.filter((acc) => acc.estado === statusValue)
    }

    if (typeFilter !== 'ALL') {
      result = result.filter((acc) => acc.tipoCuenta === typeFilter)
    }

    if (currencyFilter !== 'ALL') {
      result = result.filter((acc) => acc.moneda === currencyFilter)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'highest-balance':
          return b.saldo - a.saldo
        case 'lowest-balance':
          return a.saldo - b.saldo
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return result
  }, [accounts, search, statusFilter, typeFilter, currencyFilter, sortBy])

  const stats = useMemo(
    () => ({
      total: accounts.length,
      active: accounts.filter((a) => a.estado).length,
      totalBalance: accounts.reduce((sum, a) => sum + (a.saldo || 0), 0),
    }),
    [accounts]
  )

  const filters = {
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    currencyFilter,
    setCurrencyFilter,
    sortBy,
    setSortBy,
  }

  return {
    accounts,
    loading,
    error,
    actionError,
    setActionError,
    actionId,
    loadAccounts,
    handleToggleStatus,
    filteredAccounts,
    stats,
    filters,
  }
}
