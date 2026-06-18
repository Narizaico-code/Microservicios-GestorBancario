import { useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { useUsersDirectory } from '../hooks/useUsersDirectory.js'
import { useSignupRequests } from '../hooks/useSignupRequests.js'
import { RegisterUserCard } from '../components/RegisterUserCard.jsx'
import { ProfileLookupCard } from '../components/ProfileLookupCard.jsx'
import { UsersListSection } from '../components/UsersListSection.jsx'
import { AccessRequestsSection } from '../components/AccessRequestsSection.jsx'
import { CreateUserModal } from '../components/CreateUserModal.jsx'

export const AdminAuthPage = () => {
  const { filteredUsers, loading: usersLoading, error: usersError, search, setSearch, refreshUsers } =
    useUsersDirectory()
  const {
    requests,
    loading: requestsLoading,
    error: requestsError,
    actionError: requestsActionError,
    actionId: requestsActionId,
    handleRequestAction,
    refreshRequests,
  } = useSignupRequests()

  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleRegistered = () => {
    setShowCreateModal(false)
    refreshUsers()
    refreshRequests()
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-[color:var(--theme-text)]">
      <div className="rounded-3xl border border-[color:var(--theme-border)] bg-[linear-gradient(135deg,var(--theme-surface)_0%,var(--theme-surface-alt)_100%)] p-8 shadow-[var(--theme-shadow)]">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-[color:var(--theme-accent)]" />
          <h1 className="text-2xl font-bold">Auth administrativo</h1>
        </div>
        <p className="mt-3 text-sm text-[color:var(--theme-text-muted)]">
          Registro controlado, consulta de perfiles y aprobaciones de cambios.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <RegisterUserCard onOpen={() => setShowCreateModal(true)} />
        <ProfileLookupCard />
      </section>

      <UsersListSection
        users={filteredUsers}
        loading={usersLoading}
        error={usersError}
        search={search}
        setSearch={setSearch}
      />

      <AccessRequestsSection
        requests={requests}
        loading={requestsLoading}
        error={requestsError}
        actionError={requestsActionError}
        actionId={requestsActionId}
        onAction={handleRequestAction}
      />

      <CreateUserModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onRegistered={handleRegistered}
      />
    </div>
  )
}
