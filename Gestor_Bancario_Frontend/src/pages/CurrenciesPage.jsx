import { useAuthStore } from '../features/auth/store/authStore.js'
import { DashboardHeader } from '../features/dashboard/DashboardHeader.jsx'
import { CurrencyDashboard } from '../features/currency/components/CurrencyDashboard.jsx'
import { clearSession } from '../shared/utils/session-storage.js'

export const CurrenciesPage = () => {
    const { session, logout } = useAuthStore()

    const handleLogout = () => {
        clearSession()
        logout()
    }

    return (
        <main className="min-h-screen bg-[var(--theme-bg)] transition-colors duration-300">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]"></div>
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-cyan-500/5 blur-[100px]"></div>
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:px-8">
                <DashboardHeader
                    title="Tasas de Cambio"
                    subtitle="Visualiza las divisas mundiales en tiempo real"
                    userRole={session.user?.role || 'USER_ROLE'}
                    onLogout={handleLogout}
                />

                <CurrencyDashboard />
            </div>
        </main>
    )
}
