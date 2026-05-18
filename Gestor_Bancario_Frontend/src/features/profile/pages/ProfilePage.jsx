import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  KeyRound,
  Mail,
  Phone,
  ShieldCheck,
  UserCircle,
} from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore.js'
import {
  approveUpdateRequestWithAuthService,
  getProfileWithAuthService,
  getUpdateRequestsWithAuthService,
  rejectUpdateRequestWithAuthService,
  updateProfileWithAuthService,
} from '../../../shared/api/auth.js'
import { getRecentAccounts } from '../../../shared/api/bank.js'
import defaultAvatarImg from '../../../assets/DefaultAvatarUser.png'

const initialForm = {
  email: '',
  phone: '',
  currentPassword: '',
  newPassword: '',
  profilePicture: null,
}

const formatDate = (value) => {
  if (!value) return 'N/D'
  return new Date(value).toLocaleDateString('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatCurrency = (amount, currency = 'GTQ') => {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return 'N/D'
  }
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount))
}

const getStatusBadge = (value, options) => {
  const match = options.find((option) => option.value === value)
  return match?.label || value || 'N/D'
}

export const ProfilePage = () => {
  const { session, updateUser } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [profileError, setProfileError] = useState('')
  const [accounts, setAccounts] = useState([])
  const [accountsLoading, setAccountsLoading] = useState(true)
  const [accountsError, setAccountsError] = useState('')
  const [form, setForm] = useState(initialForm)
  const [submitError, setSubmitError] = useState('')
  const [notice, setNotice] = useState({ text: '', tone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

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

  const { emailChanged, phoneChanged, passwordChanged, profilePictureChanged, sensitiveCount } = useMemo(() => {
    const normalizedEmail = (form.email || '').trim().toLowerCase()
    const normalizedProfileEmail = (profile?.email || '').trim().toLowerCase()
    const normalizedPhone = (form.phone || '').trim()
    const normalizedProfilePhone = (profile?.phone || '').trim()

    const emailDiff = Boolean(normalizedEmail && normalizedEmail !== normalizedProfileEmail)
    const phoneDiff = Boolean(normalizedPhone && normalizedPhone !== normalizedProfilePhone)
    const passwordDiff = Boolean(form.newPassword)
    const pictureDiff = Boolean(form.profilePicture)

    return {
      emailChanged: emailDiff,
      phoneChanged: phoneDiff,
      passwordChanged: passwordDiff,
      profilePictureChanged: pictureDiff,
      sensitiveCount: [emailDiff, phoneDiff, passwordDiff].filter(Boolean).length,
    }
  }, [form, profile])

  const hasAnyChange = emailChanged || phoneChanged || passwordChanged || profilePictureChanged

  const handleChange = (event) => {
    const { name, value, files, type } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'file' ? files?.[0] || null : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
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

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, account) => sum + (Number(account.saldo) || 0), 0)
  }, [accounts])

  const avatarSrc = previewUrl || profile?.profilePicture || defaultAvatarImg

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <UserCircle className="h-7 w-7 text-cyan-200" />
          <h1 className="text-2xl font-bold">Perfil de usuario</h1>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Administra tus datos personales, revisa tus cuentas y gestiona cambios sensibles.
        </p>
      </div>

      {profileLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600 shadow-sm">
          Cargando perfil...
        </div>
      ) : null}

      {profileError ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 shadow-sm">
          {profileError}
        </div>
      ) : null}

      {!profileLoading && profile ? (
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative h-20 w-20 overflow-hidden rounded-full border border-slate-200">
                <img
                  src={avatarSrc}
                  alt={profile.name || 'Perfil'}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = defaultAvatarImg
                  }}
                />
                <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-900 text-white shadow">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    name="profilePicture"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {profile.name || 'Usuario'}
                </p>
                <p className="text-sm text-slate-500">{profile.email}</p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  {profile.isActive ? 'Cuenta activa' : 'Cuenta inactiva'}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4" />
                  Correo
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">{profile.email}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {profile.isEmailVerified ? 'Verificado' : 'Pendiente de verificacion'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Phone className="h-4 w-4" />
                  Telefono
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {profile.phone || 'N/D'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <ShieldCheck className="h-4 w-4" />
                  Rol
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">{profile.role}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="h-4 w-4" />
                  Registro
                </div>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Resumen de cuentas</h2>
                <p className="text-sm text-slate-500">Informacion de tus productos activos</p>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {accounts.length} cuentas
              </div>
            </div>

            {accountsLoading ? (
              <p className="mt-4 text-sm text-slate-500">Cargando cuentas...</p>
            ) : null}
            {accountsError ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {accountsError}
              </div>
            ) : null}

            {!accountsLoading && !accountsError ? (
              <>
                <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-4 text-white">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Saldo total</p>
                  <p className="mt-2 text-2xl font-bold">
                    {formatCurrency(totalBalance, accounts?.[0]?.moneda || 'GTQ')}
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  {accounts.slice(0, 4).map((account, index) => (
                    <div key={account._id || account.id || index} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                      <p className="text-sm font-semibold text-slate-800">
                        {account.tipoCuenta || 'Cuenta'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {account.numeroCuenta || 'Sin numero'}
                      </p>
                      <p className="mt-2 text-sm text-slate-700">
                        {formatCurrency(account.saldo, account.moneda || 'GTQ')}
                      </p>
                    </div>
                  ))}
                  {!accounts.length ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                      No hay cuentas visibles todavia.
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}
          </article>
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-slate-900">
          <KeyRound className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">Editar perfil</h2>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Cambia correo, telefono, contrasena o foto. Si actualizas dos o mas datos sensibles
          (correo, telefono, contrasena) la solicitud ira a aprobacion. Si hiciste un cambio
          sensible recientemente, tambien puede requerir aprobacion.
        </p>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2 text-sm text-slate-700">
              Correo
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-700">
              Telefono
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-700">
              Contrasena actual
              <input
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
              />
            </label>
            <label className="block space-y-2 text-sm text-slate-700">
              Nueva contrasena
              <input
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-300 focus:bg-white"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>
                Cambios sensibles detectados: {sensitiveCount}
              </span>
            </div>
            {sensitiveCount >= 2 ? (
              <p className="mt-2 text-xs text-amber-700">
                Se solicitara aprobacion del administrador al enviar.
              </p>
            ) : null}
          </div>

          {submitError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitError}
            </div>
          ) : null}

          {notice.text ? (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                notice.tone === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
              }`}
            >
              {notice.text}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-70"
          >
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </section>

      {isAdmin ? <AdminUpdateRequests token={session?.token} /> : null}
    </div>
  )
}

const AdminUpdateRequests = ({ token }) => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [actionId, setActionId] = useState('')

  const statusOptions = useMemo(
    () => [
      { value: 'ALL', label: 'Todas' },
      { value: 'PENDING', label: 'Pendientes' },
      { value: 'APPROVED', label: 'Aprobadas' },
      { value: 'REJECTED', label: 'Rechazadas' },
    ],
    []
  )

  const statusBadgeOptions = useMemo(
    () => [
      { value: 'PENDING', label: 'Pendiente' },
      { value: 'APPROVED', label: 'Aprobada' },
      { value: 'REJECTED', label: 'Rechazada' },
    ],
    []
  )

  useEffect(() => {
    let isMounted = true

    const loadRequests = async () => {
      try {
        setLoading(true)
        setError('')
        const normalizedStatus = statusFilter === 'ALL' ? null : statusFilter
        const response = await getUpdateRequestsWithAuthService(token, normalizedStatus)
        if (!isMounted) return
        setRequests(Array.isArray(response?.data) ? response.data : [])
      } catch (error) {
        if (!isMounted) return
        setError(error.message || 'No fue posible cargar las solicitudes')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (token) {
      loadRequests()
    } else {
      setLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [statusFilter, token])

  const handleAction = async (requestId, action) => {
    try {
      setActionId(requestId)
      setActionError('')
      if (action === 'approve') {
        await approveUpdateRequestWithAuthService(token, requestId)
      } else {
        await rejectUpdateRequestWithAuthService(token, requestId)
      }

      setRequests((current) => {
        if (statusFilter === 'PENDING') {
          return current.filter((item) => item.Id !== requestId)
        }
        return current.map((item) =>
          item.Id === requestId
            ? {
                ...item,
                Status: action === 'approve' ? 'APPROVED' : 'REJECTED',
                ApprovedAt: new Date().toISOString(),
              }
            : item
        )
      })
    } catch (error) {
      setActionError(error.message || 'No fue posible procesar la solicitud')
    } finally {
      setActionId('')
    }
  }

  const getRequestedFields = (request) => {
    const fields = []
    if (request.Email) fields.push('Correo')
    if (request.Phone) fields.push('Telefono')
    if (request.ProfilePicture) fields.push('Foto')
    if (request.PasswordHash) fields.push('Contrasena')
    return fields.length ? fields : ['Sin cambios detectados']
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-slate-900">
          <ClipboardCheck className="h-5 w-5 text-emerald-600" />
          <div>
            <h2 className="text-lg font-semibold">Solicitudes de edicion de perfil</h2>
            <p className="text-sm text-slate-500">Aprobaciones pendientes del sistema</p>
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? <p className="mt-4 text-sm text-slate-500">Cargando solicitudes...</p> : null}
      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}
      {actionError ? (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {actionError}
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="mt-6 space-y-4">
          {requests.map((request, index) => (
            <div key={request.Id || index} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Solicitud #{request.Id}</p>
                  <p className="text-xs text-slate-500">Usuario: {request.UserId}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    request.Status === 'APPROVED'
                      ? 'bg-emerald-100 text-emerald-700'
                      : request.Status === 'REJECTED'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {request.Status === 'APPROVED' ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <Clock className="h-4 w-4" />
                  )}
                  {getStatusBadge(request.Status, statusBadgeOptions)}
                </span>
              </div>

              <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-slate-700">Campos solicitados</p>
                  <p>{getRequestedFields(request).join(', ')}</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-700">Fecha de solicitud</p>
                  <p>{formatDate(request.created_at || request.createdAt)}</p>
                </div>
              </div>

              {request.Status === 'PENDING' ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleAction(request.Id, 'approve')}
                    disabled={actionId === request.Id}
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                  >
                    {actionId === request.Id ? 'Procesando...' : 'Aprobar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(request.Id, 'reject')}
                    disabled={actionId === request.Id}
                    className="rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-70"
                  >
                    Rechazar
                  </button>
                </div>
              ) : null}
            </div>
          ))}

          {!requests.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
              No hay solicitudes para mostrar.
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
