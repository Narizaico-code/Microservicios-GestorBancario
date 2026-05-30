export const formatDate = (value) => {
  if (!value) return 'N/D'
  return new Date(value).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

export const formatCurrency = (amount, currency = 'GTQ') => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return 'N/D'
  }
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount))
}

export const getStatusBadge = (value, options) => {
  const match = options.find((option) => option.value === value)
  return match?.label || value || 'N/D'
}
