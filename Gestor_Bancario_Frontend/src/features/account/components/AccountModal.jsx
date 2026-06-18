import { formatCurrency, formatDateTime } from '../../../shared/utils/format.js'
import { Modal, StatusBadge, Button } from '../../../shared/components/ui/index.js'
import { ACCOUNT_TYPE_OPTIONS } from '../../../shared/constants/index.js'

const getAccountTypeLabel = (type) =>
  ACCOUNT_TYPE_OPTIONS.find((option) => option.value === type)?.label || type

const Field = ({ label, children }) => (
  <div className="flex flex-col">
    <label className="mb-2 text-xs font-semibold uppercase text-[var(--theme-text-muted)]">{label}</label>
    {children}
  </div>
)

export const AccountModal = ({ isOpen, onClose, account }) => {
  if (!isOpen || !account) return null

  return (
    <Modal title="Detalles de la Cuenta" onClose={onClose} maxWidth="max-w-2xl">
      <p className="-mt-3 mb-5 text-xs text-[var(--theme-text-muted)]">Información de tu cuenta bancaria</p>

      <div className="space-y-6">
        {/* NÚMERO Y TIPO DE CUENTA */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Número de Cuenta">
            <p className="text-lg font-bold text-[var(--theme-text)]">{account.numeroCuenta || 'N/A'}</p>
          </Field>
          <Field label="Tipo de Cuenta">
            <p className="text-lg font-bold text-[var(--theme-text)]">{getAccountTypeLabel(account.tipoCuenta)}</p>
          </Field>
        </div>

        {/* SALDO Y MONEDA */}
        <div className="rounded-2xl bg-slate-900 p-5 text-white shadow-inner">
          <label className="mb-2 block text-xs font-semibold uppercase text-slate-300">Saldo Actual</label>
          <p className="text-3xl font-bold tracking-tight">{formatCurrency(account.saldo, account.moneda)}</p>
          <p className="mt-2 text-sm text-slate-300">
            Moneda: <span className="font-semibold">{account.moneda}</span>
          </p>
        </div>

        {/* ESTADO */}
        <Field label="Estado de la Cuenta">
          <div className="flex items-center gap-2">
            <StatusBadge tone={account.estado ? 'emerald' : 'rose'}>
              {account.estado ? 'Activa' : 'Inactiva'}
            </StatusBadge>
          </div>
        </Field>

        {/* FECHAS */}
        <div className="grid grid-cols-1 gap-4 border-t border-[var(--theme-border)] pt-4 md:grid-cols-2">
          <Field label="Fecha de Creación">
            <p className="text-sm text-[var(--theme-text-muted)]">
              {account.createdAt ? formatDateTime(account.createdAt) : 'N/A'}
            </p>
          </Field>
          <Field label="Última Actualización">
            <p className="text-sm text-[var(--theme-text-muted)]">
              {account.updatedAt ? formatDateTime(account.updatedAt) : 'N/A'}
            </p>
          </Field>
        </div>

        {/* ID DE USUARIO */}
        <div className="flex flex-col rounded-lg bg-[var(--theme-surface-alt)] p-3">
          <label className="mb-1 text-xs font-semibold uppercase text-[var(--theme-text-muted)]">ID del Usuario</label>
          <p className="break-all font-mono text-xs text-[var(--theme-text-muted)]">{account.userId}</p>
        </div>

        {/* BOTÓN CERRAR */}
        <div className="flex justify-end gap-3 border-t border-[var(--theme-border)] pt-4">
          <Button variant="primary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
