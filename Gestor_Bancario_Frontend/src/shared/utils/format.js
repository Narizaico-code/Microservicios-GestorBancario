// Utilidades de formato compartidas (es-GT).
// Reemplazan las ~12 redeclaraciones inline dispersas por el frontend.

const DEFAULT_DATE_OPTIONS = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}

const DATE_TIME_OPTIONS = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}

const SHORT_DATE_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

/**
 * Formatea una fecha en locale es-GT. Por defecto dd/mm/aaaa.
 * Pasar `options` (Intl.DateTimeFormat) para variar el estilo.
 */
export const formatDate = (value, options = DEFAULT_DATE_OPTIONS) => {
  if (!value) return 'N/D'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/D'
  return date.toLocaleDateString('es-GT', options)
}

/** Fecha con mes en texto. Ej: "5 ene 2026". */
export const formatShortDate = (value) => formatDate(value, SHORT_DATE_OPTIONS)

/** Fecha con hora. Ej: "5 de enero de 2026, 14:30". */
export const formatDateTime = (value) => formatDate(value, DATE_TIME_OPTIONS)

/** Formatea un monto como moneda (es-GT). */
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

/** Número con separador de miles y 2 decimales (sin símbolo de moneda). */
export const formatNumber = (amount) => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return 'N/D'
  }
  return new Intl.NumberFormat('es-GT', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount))
}

/** Resuelve la etiqueta de un valor dentro de una lista de opciones {value,label}. */
export const getStatusBadge = (value, options = []) => {
  const match = options.find((option) => option.value === value)
  return match?.label || value || 'N/D'
}

/** Enmascara un número de cuenta dejando visibles solo los últimos 4 dígitos. */
export const maskAccountNumber = (value) => {
  if (!value) return 'N/D'
  const str = String(value)
  if (str.length <= 4) return str
  return `•••• ${str.slice(-4)}`
}
