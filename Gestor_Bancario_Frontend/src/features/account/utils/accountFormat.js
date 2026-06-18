const ACCOUNT_TYPE_LABELS = {
  AHORRO: 'Ahorro',
  MONETARIA: 'Monetaria',
}

export const getAccountTypeLabel = (type) => ACCOUNT_TYPE_LABELS[type] || type
