export const formatTxnDate = (dateValue) => {
  if (!dateValue) return '-'
  return new Date(dateValue).toLocaleString('es-GT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatAmount = (amount, type) => {
  const numberAmount = Number(amount || 0)
  const isDebit = type === 'RETIRO' || type === 'TRANSFERENCIA'
  const prefix = isDebit ? '-' : '+'
  return `${prefix} Q${numberAmount.toFixed(2)}`
}

export const normalizeTypeLabel = (type) => {
  if (type === 'DEPOSITO') return 'Deposito'
  if (type === 'TRANSFERENCIA') return 'Transferencia'
  if (type === 'RETIRO') return 'Retiro'
  return type || '-'
}
