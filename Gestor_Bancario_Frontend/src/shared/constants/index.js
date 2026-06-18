// Constantes compartidas: roles, tipos de cuenta, monedas y estados.
// Centralizan los literales mágicos repetidos por el frontend.

// --- Roles ---
export const ROLES = {
  ADMIN: 'ADMIN_ROLE',
  USER: 'USER_ROLE',
  EMPLOYEE: 'EMPLOYEE_ROLE',
  CLIENT: 'CLIENT_ROLE',
}

export const ROLE_OPTIONS = [
  { value: ROLES.USER, label: 'Cliente' },
  { value: ROLES.EMPLOYEE, label: 'Empleado' },
  { value: ROLES.ADMIN, label: 'Admin' },
]

// --- Tipos de cuenta ---
export const ACCOUNT_TYPES = {
  AHORRO: 'AHORRO',
  MONETARIA: 'MONETARIA',
}

export const ACCOUNT_TYPE_OPTIONS = [
  { value: ACCOUNT_TYPES.AHORRO, label: 'Cuenta de Ahorro' },
  { value: ACCOUNT_TYPES.MONETARIA, label: 'Cuenta Monetaria' },
]

// --- Monedas ---
export const CURRENCIES = ['GTQ', 'USD', 'EUR', 'MXN', 'COP', 'JPY']

export const CURRENCY_OPTIONS = [
  { value: 'GTQ', label: 'GTQ — Quetzal' },
  { value: 'USD', label: 'USD — Dólar' },
  { value: 'EUR', label: 'EUR — Euro' },
  { value: 'MXN', label: 'MXN — Peso mexicano' },
  { value: 'COP', label: 'COP — Peso colombiano' },
  { value: 'JPY', label: 'JPY — Yen japonés' },
]

// --- Estado de cuenta (boolean estado: true=activa) ---
export const ACCOUNT_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
}

// --- Estados genéricos de solicitudes / recursos ---
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}
