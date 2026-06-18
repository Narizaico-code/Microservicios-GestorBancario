import { useState } from 'react'
import { Spinner } from '../../../shared/components/ui/Spinner.jsx'
import { Alert } from '../../../shared/components/ui/Alert.jsx'
import { exportAccountsReport } from '../../../shared/utils/exportAccountsReport.js'
import { useAdminAccounts } from '../hooks/useAdminAccounts.js'
import { useAdminUsers } from '../hooks/useAdminUsers.js'
import { useAccountRequests } from '../hooks/useAccountRequests.js'
import { AccountsToolbar } from './AccountsToolbar.jsx'
import { AccountsStatsCards } from './AccountsStatsCards.jsx'
import { AccountRequestsPanel } from './AccountRequestsPanel.jsx'
import { AccountsFilters } from './AccountsFilters.jsx'
import { AccountsTable } from './AccountsTable.jsx'
import { AccountModal } from './AccountModal.jsx'
import { AdminCreateAccountModal } from './AdminCreateAccountModal.jsx'
import { AdminRequestDetailsModal } from './AdminRequestDetailsModal.jsx'

export const AdminAccounts = () => {
  const {
    loading,
    error,
    actionError,
    setActionError,
    actionId,
    loadAccounts,
    handleToggleStatus,
    filteredAccounts,
    stats,
    filters,
  } = useAdminAccounts()

  const { users, usersLoading, usersError, loadUsers } = useAdminUsers()
  const requests = useAccountRequests({ onApproved: loadAccounts })

  const [selectedAccount, setSelectedAccount] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)

  const ensureUsersLoaded = () => {
    if (!users.length && !usersLoading) loadUsers()
  }

  const handleViewDetails = (account) => {
    setSelectedAccount(account)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedAccount(null)
  }

  const handleOpenCreate = () => {
    setIsCreateOpen(true)
    ensureUsersLoaded()
  }

  const handleCreateSuccess = () => {
    setIsCreateOpen(false)
    loadAccounts()
  }

  const handleOpenRequestModal = (request) => {
    setSelectedRequest(request)
    setIsRequestModalOpen(true)
    ensureUsersLoaded()
  }

  const closeRequestModal = () => {
    setSelectedRequest(null)
    setIsRequestModalOpen(false)
  }

  const handleProcessRequest = async (requestId, action) => {
    const ok = await requests.handleRequestAction(requestId, action)
    if (ok) closeRequestModal()
  }

  const handleDownloadReport = async () => {
    try {
      setActionError('')
      await exportAccountsReport(filteredAccounts)
    } catch {
      setActionError('Error al generar el reporte Excel')
    }
  }

  if (loading) return <Spinner fullScreen />

  return (
    <div className="space-y-6 w-full text-[color:var(--theme-text)]">
      <AccountsToolbar onCreate={handleOpenCreate} onDownloadReport={handleDownloadReport} />

      <AccountsStatsCards total={stats.total} active={stats.active} totalBalance={stats.totalBalance} />

      <AccountRequestsPanel
        requests={requests.requests}
        loading={requests.loading}
        error={requests.error}
        onReload={requests.loadRequests}
        onViewDetails={handleOpenRequestModal}
      />

      <AccountsFilters filters={filters} />

      <Alert>{error}</Alert>
      <Alert>{actionError || requests.actionError}</Alert>

      <AccountsTable
        accounts={filteredAccounts}
        actionId={actionId}
        onViewDetails={handleViewDetails}
        onToggleStatus={handleToggleStatus}
      />

      <AccountModal isOpen={isModalOpen} onClose={closeModal} account={selectedAccount} />

      <AdminCreateAccountModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreateSuccess}
        users={users}
        usersLoading={usersLoading}
        usersError={usersError}
        onReloadUsers={loadUsers}
      />

      <AdminRequestDetailsModal
        isOpen={isRequestModalOpen}
        onClose={closeRequestModal}
        request={selectedRequest}
        user={users.find((u) => u.id === selectedRequest?.userId)}
        onApprove={(id) => handleProcessRequest(id, 'approve')}
        onDeny={(id) => handleProcessRequest(id, 'deny')}
        actionLoadingId={requests.requestActionId}
      />
    </div>
  )
}
