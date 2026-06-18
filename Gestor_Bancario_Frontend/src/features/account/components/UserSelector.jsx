import { Loader2, RefreshCw } from 'lucide-react'
import { SelectField, Field, Alert } from '../../../shared/components/ui/index.js'

export const UserSelector = ({
  users,
  usersLoading,
  usersError,
  onReloadUsers,
  selectedUserId,
  onSelectUser,
  userId,
  onChange,
}) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-semibold text-[var(--theme-text)]">Seleccionar usuario</h3>
      <button
        type="button"
        onClick={onReloadUsers}
        disabled={usersLoading}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--theme-border)] px-3 py-1 text-xs font-semibold text-[var(--theme-text-muted)] transition hover:bg-[var(--theme-surface-alt)] disabled:opacity-60"
      >
        {usersLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
        Recargar
      </button>
    </div>

    <Alert variant="error">{usersError || null}</Alert>

    <SelectField label="" value={selectedUserId} onChange={onSelectUser}>
      <option value="">Selecciona un usuario</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name} - {user.email}
        </option>
      ))}
    </SelectField>

    <Field
      label="User ID (manual)"
      type="text"
      name="userId"
      value={userId}
      onChange={onChange}
      placeholder="Ej. user_123"
      title="Identificador único del usuario dueño de la cuenta"
    />
  </section>
)
