import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore.js'
import AuthPage from '../../features/auth/pages/AuthPage.jsx'
import RegisterPage from '../../features/auth/pages/RegisterPage.jsx'
import SignupRequestPage from '../../features/auth/pages/SignupRequestPage.jsx'
import ForgotPasswordPage from '../../features/auth/pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from '../../features/auth/pages/ResetPasswordPage.jsx'
import VerifyEmailPage from '../../features/auth/pages/VerifyEmailPage.jsx'
import UnauthorizedPage from '../../features/auth/pages/UnauthorizedPage.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'
import RoleGuard from './RoleGuard.jsx'
import { DashboardPage  } from '../../app/layouts/DashboardPages.jsx'
import ClientPage from '../../pages/ClientPage.jsx'
import { AdminAccounts } from '../../features/account/components/AdminAccounts.jsx'
import { Help } from '../../shared/components/layout/Help.jsx'
import ProfilePage from '../../features/profile/pages/ProfilePage.jsx'
import ClientProfilePage from '../../features/profile/pages/ClientProfilePage.jsx'
import AdminAuthPage from '../../features/admin/pages/AdminAuthPage.jsx'
import ClientFavoritesPage from '../../features/favorites/pages/ClientFavoritesPage.jsx'

function DashboardRedirect() {
  const { session } = useAuthStore()
  return <Navigate to={session?.user?.role === 'ADMIN_ROLE' ? '/dashboard' : '/client'} replace />
}

export default function AppRoutes() {
  return (
    <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/signup-request" element={<SignupRequestPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<RoleGuard allowedRoles={['ADMIN_ROLE']} />}>
              <Route path="/dashboard" element={<DashboardPage />}>
                <Route index element={<Navigate to="cuentas" replace />} />
                <Route path="cuentas" element={<AdminAccounts />} />
                <Route path="usuarios" element={<AdminAuthPage />} />
                <Route path="perfil" element={<ProfilePage />} />
                <Route path="ayuda" element={<Help />} />
              </Route>
            </Route>
            <Route element={<RoleGuard allowedRoles={['USER_ROLE', 'CLIENT_ROLE']} />}>
              <Route path="/client" element={<ClientPage />} />
              <Route path="/client/perfil" element={<ClientProfilePage />} />
              <Route path="/client/favoritos" element={<ClientFavoritesPage />} />
            </Route>
            <Route path="/home" element={<DashboardRedirect />} />
          </Route>

        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
  )
}

