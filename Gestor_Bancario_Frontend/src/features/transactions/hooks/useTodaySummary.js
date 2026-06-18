import { useMemo } from 'react'

export const useTodaySummary = (transactions) =>
  useMemo(() => {
    const today = new Date()
    const isSameDay = (dateValue) => {
      const d = new Date(dateValue)
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      )
    }

    let deposits = 0
    let withdrawals = 0
    let depositsCount = 0
    let withdrawalsCount = 0

    for (const item of transactions) {
      if (!isSameDay(item.createdAt)) continue

      const amount = Number(item.monto || 0)
      if (item.tipoTransaccion === 'DEPOSITO') {
        deposits += amount
        depositsCount += 1
      } else if (item.tipoTransaccion === 'RETIRO' || item.tipoTransaccion === 'TRANSFERENCIA') {
        withdrawals += amount
        withdrawalsCount += 1
      }
    }

    return { deposits, withdrawals, depositsCount, withdrawalsCount }
  }, [transactions])
