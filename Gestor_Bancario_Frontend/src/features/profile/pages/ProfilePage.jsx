import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../auth/store/authStore.js'
import {
  getProfileWithAuthService,
  updateProfileWithAuthService,
} from '../../../shared/api/auth.js'
import { getRecentAccounts } from '../../../shared/api/bank.js'
import { getFavorites } from '../../../shared/api/favorites.js'
import { getCurrencies } from '../../../shared/api/currency.js'
import defaultAvatarImg from '../../../assets/DefaultAvatarUser.png'
import { ProfileHeader } from '../components/ProfileHeader.jsx'
import { ProfileInfoCard } from '../components/ProfileInfoCard.jsx'
import { AccountsSummaryCard } from '../components/AccountsSummaryCard.jsx'
import { FavoritesSummaryCard } from '../components/FavoritesSummaryCard.jsx'
import { EditProfileModal } from '../components/EditProfileModal.jsx'
import { AdminUpdateRequests } from '../components/AdminUpdateRequests.jsx'
import { ProfileFeedback } from '../components/ProfileFeedback.jsx'

const initialForm = {
  email: '',
  phone: '',
  ingresosMensuales: '',
  currentPassword: '',
  newPassword: '',
  profilePicture: null,
}

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { session, updateUser } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState('')
  const [accounts, setAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState('')
  const [favorites, setFavorites] = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(true)
  const [favoritesError, setFavoritesError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [submitError, setSubmitError] = useState('')
  const [notice, setNotice] = useState({ text: '', tone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState('GTQ')
  const [rates, setRates] = useState({})
  const [ratesLoading, setRatesLoading] = useState(false)
  const [ratesError, setRatesError] = useState('')

  const isAdmin = session?.user?.role === 'ADMIN_ROLE'

  useEffect(() => {
    let isMounted = true

    const loadProfile = async () => {
      try {
        setProfileLoading(true)
        setProfileError('')
        const response = await getProfileWithAuthService(session.token)
        if (!isMounted) return
        const userData = response?.data || response?.user || null
        setProfile(userData)
        if (userData) {
          updateUser({
            id: userData.id,
            name: userData.name,
            profilePicture: userData.profilePicture,
            role: userData.role,
            email: userData.email,
          })
        }
        setForm((current) => ({
          ...current,
          email: userData?.email || '',
          phone: userData?.phone || '',
          ingresosMensuales: userData?.ingresosMensuales || '',
        }))
      } catch (error) {
        if (!isMounted) return
        setProfileError(error.message || 'No fue posible cargar el perfil')
      } finally {
        if (isMounted) setProfileLoading(false)
      }
    }

    if (session?.token) {
      loadProfile()
    } else {
      setProfileLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [session?.token])

  useEffect(() => {
    let isMounted = true

    const loadAccounts = async () => {
      try {
        setAccountsLoading(true)
        setAccountsError('')
        const response = await getRecentAccounts(session.token)
        if (!isMounted) return
        setAccounts(Array.isArray(response?.data) ? response.data : [])
      } catch (error) {
        if (!isMounted) return
        setAccountsError(error.message || 'No fue posible cargar cuentas')
      } finally {
        if (isMounted) setAccountsLoading(false)
      }
    }

    if (session?.token) {
      loadAccounts()
    } else {
      setAccountsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [session?.token])

  useEffect(() => {
    let isMounted = true

    const loadFavorites = async () => {
      try {
        setFavoritesLoading(true)
        setFavoritesError('')
        const response = await getFavorites()
        if (!isMounted) return
        const favs = response?.data?.favorites || response?.favorites
        setFavorites(Array.isArray(favs) ? favs : [])
      } catch (error) {
        if (!isMounted) return
        const apiError = error.response?.data?.message || error.response?.data?.error || error.message
        setFavoritesError(apiError || 'No fue posible cargar favoritos')
      } finally {
        if (isMounted) setFavoritesLoading(false)
      }
    }

    if (session?.token) {
      loadFavorites()
    } else {
      setFavoritesLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [session?.token])

  useEffect(() => {
    if (!form.profilePicture) {
      setPreviewUrl('')
      return undefined
    }

    const url = URL.createObjectURL(form.profilePicture)
    setPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [form.profilePicture])

  const {
    emailChanged,
    phoneChanged,
    ingresosMensualesChanged,
    passwordChanged,
    profilePictureChanged,
    sensitiveCount,
  } = useMemo(() => {
    const normalizedEmail = (form.email || '').trim().toLowerCase()
    const normalizedProfileEmail = (profile?.email || '').trim().toLowerCase()
    const normalizedPhone = (form.phone || '').trim()
    const normalizedProfilePhone = (profile?.phone || '').trim()
    const normalizedIngresos = form.ingresosMensuales
    const normalizedProfileIngresos = profile?.ingresosMensuales

    const emailDiff = Boolean(normalizedEmail && normalizedEmail !== normalizedProfileEmail)
    const phoneDiff = Boolean(normalizedPhone && normalizedPhone !== normalizedProfilePhone)
    const ingresosDiff = Boolean(
      normalizedIngresos !== undefined &&
        normalizedIngresos !== null &&
        Number(normalizedIngresos) !== Number(normalizedProfileIngresos)
    )
    const passwordDiff = Boolean(form.newPassword)
    const pictureDiff = Boolean(form.profilePicture)

    return {
      emailChanged: emailDiff,
      phoneChanged: phoneDiff,
      ingresosMensualesChanged: ingresosDiff,
      passwordChanged: passwordDiff,
      profilePictureChanged: pictureDiff,
      sensitiveCount: [emailDiff, phoneDiff, passwordDiff].filter(Boolean).length,
    }
  }, [form, profile])

  const hasAnyChange =
    emailChanged ||
    phoneChanged ||
    ingresosMensualesChanged ||
    passwordChanged ||
    profilePictureChanged

  const handleChange = (event) => {
    const { name, value, files, type } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'file' ? files?.[0] || null : value,
    }))
  }

  const handleSubmit = async (event) => {
    event?.preventDefault?.()
    setSubmitError('')
    setNotice({ text: '', tone: '' })

    if (!hasAnyChange) {
      setSubmitError('No hay cambios para actualizar')
      return
    }

    if (passwordChanged && !form.currentPassword) {
      setSubmitError('La contrasena actual es obligatoria para cambiar la contrasena')
      return
    }

    if (!session?.token) {
      setSubmitError('Sesion no valida. Inicia sesion nuevamente.')
      return
    }

    const payload = new FormData()
    if (emailChanged) payload.append('email', form.email.trim())
    if (phoneChanged) payload.append('phone', form.phone.trim())
    if (ingresosMensualesChanged) payload.append('ingresosMensuales', form.ingresosMensuales)
    if (passwordChanged) {
      payload.append('newPassword', form.newPassword)
      payload.append('currentPassword', form.currentPassword)
    }
    if (profilePictureChanged) {
      payload.append('profilePicture', form.profilePicture)
    }

    try {
      setSubmitting(true)
      const response = await updateProfileWithAuthService(session.token, payload)

      if (response?.data?.status === 'PENDING') {
        setNotice({
          text:
            response?.message ||
            'Solicitud enviada. Un administrador debe aprobar los cambios.',
          tone: 'warning',
        })
        setForm((current) => ({
          ...current,
          currentPassword: '',
          newPassword: '',
          profilePicture: null,
        }))
        return
      }

      const nextProfile = response?.data || profile
      if (nextProfile) {
        setProfile(nextProfile)
        updateUser({
          id: nextProfile.id,
          name: nextProfile.name,
          profilePicture: nextProfile.profilePicture,
          role: nextProfile.role,
          email: nextProfile.email,
        })
        setForm((current) => ({
          ...current,
          email: nextProfile.email || '',
          phone: nextProfile.phone || '',
          ingresosMensuales: nextProfile.ingresosMensuales || '',
          currentPassword: '',
          newPassword: '',
          profilePicture: null,
        }))
      }

      setNotice({
        text:
          response?.message ||
          'Cambios aplicados exitosamente. Revisa tu correo si cambiaste email.',
        tone: 'success',
      })
    } catch (error) {
      setSubmitError(error.message || 'No fue posible actualizar el perfil')
    } finally {
      setSubmitting(false)
    }
  }

  const availableCurrencies = useMemo(() => {
    const currencies = new Set(accounts.map((account) => account.moneda).filter(Boolean))
    if (!currencies.size) {
      return ['GTQ', 'USD', 'EUR', 'MXN', 'COP', 'JPY']
    }
    return Array.from(currencies)
  }, [accounts])

  useEffect(() => {
    if (!availableCurrencies.length) return
    if (!availableCurrencies.includes(selectedCurrency)) {
      setSelectedCurrency(availableCurrencies[0])
    }
  }, [availableCurrencies, selectedCurrency])

  useEffect(() => {
    let isMounted = true

    const loadRates = async () => {
      try {
        setRatesLoading(true)
        setRatesError('')
        const data = await getCurrencies(selectedCurrency)
        if (!isMounted) return
        setRates(data?.rates || {})
      } catch (error) {
        if (!isMounted) return
        setRates({})
        setRatesError(error.message || 'No fue posible cargar las tasas')
      } finally {
        if (isMounted) setRatesLoading(false)
      }
    }

    if (selectedCurrency) {
      loadRates()
    }

    return () => {
      isMounted = false
    }
  }, [selectedCurrency])

  const conversionSummary = useMemo(() => {
    if (!accounts.length) {
      return { total: 0, missing: [] }
    }

    let total = 0
    const missing = new Set()

    accounts.forEach((account) => {
      const amount = Number(account.saldo) || 0
      const currency = account.moneda || selectedCurrency

      if (!currency || currency === selectedCurrency) {
        total += amount
        return
      }

      const rate = rates?.[currency]
      if (!rate) {
        missing.add(currency)
        return
      }

      total += amount / rate
    })

    return { total, missing: Array.from(missing) }
  }, [accounts, rates, selectedCurrency])

  const totalBalance = conversionSummary.missing.length || ratesError ? null : conversionSummary.total

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
              missingCurrencies={conversionSummary.missing}
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

      {isAdmin ? <AdminUpdateRequests token={session?.token} /> : null}

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
