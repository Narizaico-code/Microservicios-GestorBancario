import { useEffect, useMemo, useState } from 'react'
import { getCurrencies } from '../../../shared/api/currency.js'
import { CURRENCIES } from '../../../shared/constants/index.js'

export const useCurrencyConversion = (accounts) => {
  const [selectedCurrency, setSelectedCurrency] = useState('GTQ')
  const [rates, setRates] = useState({})
  const [ratesLoading, setRatesLoading] = useState(false)
  const [ratesError, setRatesError] = useState('')

  const availableCurrencies = useMemo(() => {
    const currencies = new Set(accounts.map((account) => account.moneda).filter(Boolean))
    if (!currencies.size) {
      return CURRENCIES
    }
    return Array.from(currencies)
  }, [accounts])

  useEffect(() => {
    if (!availableCurrencies.length) return
    if (!availableCurrencies.includes(selectedCurrency)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clamp de la moneda seleccionada cuando cambian las cuentas
      setSelectedCurrency(availableCurrencies[0])
    }
  }, [availableCurrencies, selectedCurrency])

  useEffect(() => {
    let isMounted = true

    const loadRates = async () => {
      try {
        setRatesLoading(true)
        setRatesError('')
        const data = await getCurrencies(selectedCurrency)
        if (!isMounted) return
        setRates(data?.rates || {})
      } catch (error) {
        if (!isMounted) return
        setRates({})
        setRatesError(error.message || 'No fue posible cargar las tasas')
      } finally {
        if (isMounted) setRatesLoading(false)
      }
    }

    if (selectedCurrency) {
      loadRates()
    }

    return () => {
      isMounted = false
    }
  }, [selectedCurrency])

  const conversionSummary = useMemo(() => {
    if (!accounts.length) {
      return { total: 0, missing: [] }
    }

    let total = 0
    const missing = new Set()

    accounts.forEach((account) => {
      const amount = Number(account.saldo) || 0
      const currency = account.moneda || selectedCurrency

      if (!currency || currency === selectedCurrency) {
        total += amount
        return
      }

      const rate = rates?.[currency]
      if (!rate) {
        missing.add(currency)
        return
      }

      total += amount / rate
    })

    return { total, missing: Array.from(missing) }
  }, [accounts, rates, selectedCurrency])

  const totalBalance = conversionSummary.missing.length || ratesError ? null : conversionSummary.total

  return {
    selectedCurrency,
    setSelectedCurrency,
    availableCurrencies,
    missingCurrencies: conversionSummary.missing,
    totalBalance,
    ratesLoading,
    ratesError,
  }
}
