import { useEffect } from 'react'
import { useAuthStore } from '../../auth/store/authStore.js'
import { useAccountStore } from '../../account/store/useAccountStore.js'
import { useTransactionStore } from '../store/useTransactionStore.js'
import { useTransactionForm } from '../hooks/useTransactionForm.js'
import { useTodaySummary } from '../hooks/useTodaySummary.js'
import { TransactionsHeader } from '../components/TransactionsHeader.jsx'
import { TransactionForm } from '../components/TransactionForm.jsx'
import { TransactionInfoCard } from '../components/TransactionInfoCard.jsx'
import { TodaySummaryCard } from '../components/TodaySummaryCard.jsx'
import { TransactionsTable } from '../components/TransactionsTable.jsx'

export const TransactionsPage = () => {
  const { session } = useAuthStore()
  const { accounts, getAccounts } = useAccountStore()
  const { transactions, loading: loadingData, getTransactionsData } = useTransactionStore()

  const isAdmin = (session?.user?.role || '') === 'ADMIN_ROLE'
  const userName = session?.user?.name || session?.user?.nombre || 'Admin'

  const fetchInitialData = () => {
    getAccounts()
    getTransactionsData({ limit: 100 })
  }

  useEffect(() => {
    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const refreshAll = () => Promise.all([getAccounts(), getTransactionsData({ limit: 100 })])

  const { formValues, savingTransaction, handleChange, resetForm, handleSubmit } = useTransactionForm({
    isAdmin,
    onSuccess: refreshAll,
  })

  const todaySummary = useTodaySummary(transactions)

  return (
    <section className="space-y-5 text-[var(--theme-text)]">
      <TransactionsHeader isAdmin={isAdmin} />

      <div className="grid gap-4 xl:grid-cols-[2.25fr_1fr]">
        <TransactionForm
          isAdmin={isAdmin}
          accounts={accounts}
          formValues={formValues}
          savingTransaction={savingTransaction}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onReset={resetForm}
        />

        <aside className="space-y-4">
          {isAdmin ? (
            <TransactionInfoCard
              alt="Ilustracion de transacciones"
              title="Regla de negocio"
              description="El administrador unicamente puede crear transacciones de tipo deposito."
            />
          ) : (
            <TransactionInfoCard
              alt="Ilustracion de transferencias"
              title="Transferencias seguras"
              description="Puedes enviar dinero seleccionando una de tus cuentas y proporcionando el número de cuenta de destino válido."
            />
          )}

          <TodaySummaryCard summary={todaySummary} onRefresh={fetchInitialData} />
        </aside>
      </div>

      <TransactionsTable
        transactions={transactions}
        loading={loadingData}
        onRefresh={fetchInitialData}
        userName={userName}
      />
    </section>
  )
}
