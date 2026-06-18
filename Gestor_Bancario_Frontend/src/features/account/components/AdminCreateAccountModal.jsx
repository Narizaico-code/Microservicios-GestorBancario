import { Loader2 } from 'lucide-react'
import { Modal, Alert, Button } from '../../../shared/components/ui/index.js'
import { useCreateAccountForm } from '../hooks/useCreateAccountForm.js'
import { UserSelector } from './UserSelector.jsx'
import { AccountFields } from './AccountFields.jsx'

export const AdminCreateAccountModal = ({
  isOpen,
  onClose,
  onCreated,
  users = [],
  usersLoading = false,
  usersError = '',
  onReloadUsers,
}) => {
  const {
    form,
    selectedUserId,
    submitting,
    error,
    handleChange,
    handleSelectUser,
    handleEstadoChange,
    handleSubmit,
  } = useCreateAccountForm({ isOpen, onCreated })

  if (!isOpen) return null

  return (
    <Modal title="Crear cuenta bancaria" onClose={onClose} maxWidth="max-w-2xl">
      <p className="-mt-3 mb-5 text-xs text-[var(--theme-text-muted)]">Registro manual por administracion</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <UserSelector
          users={users}
          usersLoading={usersLoading}
          usersError={usersError}
          onReloadUsers={onReloadUsers}
          selectedUserId={selectedUserId}
          onSelectUser={handleSelectUser}
          userId={form.userId}
          onChange={handleChange}
        />

        <AccountFields form={form} onChange={handleChange} onEstadoChange={handleEstadoChange} />

        <Alert variant="error" className="whitespace-pre-line">
          {error || null}
        </Alert>

        <div className="flex justify-end gap-3">
          <Button variant="cancel" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            Crear cuenta
          </Button>
        </div>
      </form>
    </Modal>
  )
}
