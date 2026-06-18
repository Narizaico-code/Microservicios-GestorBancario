import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore.js'
import defaultAvatarImg from '../../../assets/DefaultAvatarUser.png'
import { useProfileData } from '../hooks/useProfileData.js'
import { useProfileAccounts } from '../hooks/useProfileAccounts.js'
import { useProfileFavorites } from '../hooks/useProfileFavorites.js'
import { useProfileForm } from '../hooks/useProfileForm.js'
import { useCurrencyConversion } from '../hooks/useCurrencyConversion.js'
import { ProfileHeader } from '../components/ProfileHeader.jsx'
import { ProfileInfoCard } from '../components/ProfileInfoCard.jsx'
import { AccountsSummaryCard } from '../components/AccountsSummaryCard.jsx'
import { FavoritesSummaryCard } from '../components/FavoritesSummaryCard.jsx'
import { EditProfileModal } from '../components/EditProfileModal.jsx'
import { AdminUpdateRequests } from '../components/AdminUpdateRequests.jsx'
import { ProfileFeedback } from '../components/ProfileFeedback.jsx'

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { session, updateUser } = useAuthStore()
  const token = session?.token
  const isAdmin = session?.user?.role === 'ADMIN_ROLE'

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const { profile, setProfile, loading: profileLoading, error: profileError } = useProfileData(token, updateUser)
  const { accounts, loading: accountsLoading, error: accountsError } = useProfileAccounts(token)
  const { favorites, loading: favoritesLoading, error: favoritesError } = useProfileFavorites(token)

  const {
    form,
    previewUrl,
    submitError,
    notice,
    submitting,
    hasAnyChange,
    passwordChanged,
    sensitiveCount,
    handleChange,
    handleSubmit,
  } = useProfileForm({ profile, token, setProfile, updateUser })

  const {
    selectedCurrency,
    setSelectedCurrency,
    availableCurrencies,
    missingCurrencies,
    totalBalance,
    ratesLoading,
    ratesError,
  } = useCurrencyConversion(accounts)

  const avatarSrc = previewUrl || profile?.profilePicture || defaultAvatarImg

  return (
    <div className="mx-auto max-w-6xl space-y-6 text-[color:var(--theme-text)]">
      <ProfileHeader />

      {profileLoading ? (
        <div className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-8 text-sm text-[color:var(--theme-text-muted)] shadow-sm">
          Cargando perfil...
        </div>
      ) : null}

      {profileError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          {profileError}
        </div>
      ) : null}

      {!isEditModalOpen ? (
        <ProfileFeedback submitError={submitError} notice={notice} />
      ) : null}

      {!profileLoading && profile ? (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <ProfileInfoCard
            profile={profile}
            avatarSrc={avatarSrc}
            fallbackSrc={defaultAvatarImg}
            onAvatarChange={handleChange}
            onOpenEdit={() => setIsEditModalOpen(true)}
            onSave={handleSubmit}
            hasAnyChange={hasAnyChange}
            submitting={submitting}
          />

          <div className="flex flex-col gap-6">
            <AccountsSummaryCard
              accounts={accounts}
              loading={accountsLoading}
              error={accountsError}
              selectedCurrency={selectedCurrency}
              availableCurrencies={availableCurrencies}
              onCurrencyChange={setSelectedCurrency}
              totalBalance={totalBalance}
              missingCurrencies={missingCurrencies}
              ratesLoading={ratesLoading}
              ratesError={ratesError}
            />

            <FavoritesSummaryCard
              favorites={favorites}
              loading={favoritesLoading}
              error={favoritesError}
              onSeeAll={() => navigate('/client/favoritos')}
            />
          </div>
        </section>
      ) : null}

      {isAdmin ? <AdminUpdateRequests token={token} /> : null}

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        submitting={submitting}
        submitError={submitError}
        notice={notice}
        sensitiveCount={sensitiveCount}
        hasAnyChange={hasAnyChange}
        passwordChanged={passwordChanged}
      />
    </div>
  )
}
