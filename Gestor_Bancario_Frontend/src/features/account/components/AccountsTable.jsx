import { AlertCircle, Eye, ToggleRight, ToggleLeft } from 'lucide-react'
import { StatusBadge } from '../../../shared/components/ui/StatusBadge.jsx'
import { EmptyState } from '../../../shared/components/ui/EmptyState.jsx'
import { formatCurrency, formatDate } from '../../../shared/utils/format.js'
import { getAccountTypeLabel } from '../utils/accountFormat.js'

const COLUMNS = ['# Cuenta', 'Usuario', 'Tipo', 'Saldo', 'Estado', 'Creada', 'Acciones']

const AccountStatusBadge = ({ estado }) => (
  <StatusBadge tone={estado ? 'emerald' : 'slate'} className="gap-1.5">
    <span className={`h-2 w-2 rounded-full ${estado ? 'bg-emerald-600' : 'bg-slate-400'}`} />
    {estado ? 'Activa' : 'Inactiva'}
  </StatusBadge>
)

export const AccountsTable = ({ accounts, actionId, onViewDetails, onToggleStatus }) => (
  <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] shadow-sm overflow-hidden">
    {accounts.length === 0 ? (
      <EmptyState
        className="border-0 bg-transparent"
        icon={AlertCircle}
        title="No se encontraron cuentas con los filtros aplicados"
      />
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)]">
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column}
                  className="px-6 py-4 text-left text-xs font-semibold text-[color:var(--theme-text-muted)] uppercase"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--theme-border)]">
            {accounts.map((account, index) => (
              <tr
                key={account._id || account.numeroCuenta || index}
                className="hover:bg-[color:var(--theme-surface-alt)] transition"
              >
                <td className="px-6 py-4 text-sm font-mono font-semibold">{account.numeroCuenta}</td>
                <td className="px-6 py-4 text-sm text-[color:var(--theme-text-muted)]">{account.userId}</td>
                <td className="px-6 py-4 text-sm text-[color:var(--theme-text-muted)]">
                  {getAccountTypeLabel(account.tipoCuenta)}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  {formatCurrency(account.saldo, account.moneda)}
                </td>
                <td className="px-6 py-4 text-sm">
                  <AccountStatusBadge estado={account.estado} />
                </td>
                <td className="px-6 py-4 text-sm text-[color:var(--theme-text-muted)]">
                  {formatDate(account.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewDetails(account)}
                      className="inline-flex items-center justify-center p-2 text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition"
                      title="Ver detalles"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onToggleStatus(account)}
                      disabled={actionId === account.numeroCuenta}
                      className={`inline-flex items-center justify-center p-2 rounded-lg transition ${
                        account.estado
                          ? 'text-orange-600 hover:bg-orange-500/10'
                          : 'text-emerald-600 hover:bg-emerald-500/10'
                      }`}
                      title={account.estado ? 'Desactivar' : 'Activar'}
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
)
