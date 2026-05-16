import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Filter,
  Loader2,
  Mail,
  ShieldCheck,
  UserPlus,
  Users,
} from 'lucide-react'
import { useAuthStore } from '../../auth/store/authStore.js'
import { UnifiedAuthForm } from '../../auth/components/UnifiedAuthForm.jsx'
import {
  approveSignupRequestWithAuthService,
  rejectSignupRequestWithAuthService,
  getAllUsersWithAuthService,
  getProfileByIdWithAuthService,
  getSignupRequestsWithAuthService,
  registerWithAuthService,
} from '../../../shared/api/auth.js'

const initialRegisterForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
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

const resolveUser = (user) => {
  const profile = user?.UserProfile || {}
  const emailRecord = user?.UserEmail || {}
  const roleRecord = user?.UserRoles?.[0]?.Role || {}

  return {
    id: user?.id || user?.Id || 'N/D',
    name: user?.name || user?.Name || 'N/D',
    email: user?.email || user?.Email || 'N/D',
    phone: user?.phone || profile.phone || profile.Phone || 'N/D',
    role: user?.role || roleRecord.Name || 'USER_ROLE',
    isActive: user?.isActive ?? user?.IsActive ?? false,
    emailVerified: user?.isEmailVerified ?? emailRecord.EmailVerified ?? false,
    createdAt: user?.createdAt || user?.CreatedAt,
  }
}

export const AdminAuthPage = () => {
  const { session } = useAuthStore()
  const [registerForm, setRegisterForm] = useState(initialRegisterForm)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerMessage, setRegisterMessage] = useState('')
  const [registerError, setRegisterError] = useState('')

  const [profileId, setProfileId] = useState('')
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileResult, setProfileResult] = useState(null)

  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [usersError, setUsersError] = useState('')
  const [userSearch, setUserSearch] = useState('')

  const [requests, setRequests] = useState([])
  const [requestsLoading, setRequestsLoading] = useState(true)
  const [requestsError, setRequestsError] = useState('')
  const [requestsActionError, setRequestsActionError] = useState('')
  const [requestsActionId, setRequestsActionId] = useState('')

  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      try {
        setUsersLoading(true)
        setUsersError('')
        const response = await getAllUsersWithAuthService(session?.token)
        if (!isMounted) return
        setUsers(Array.isArray(response?.users) ? response.users : [])
      } catch (error) {
        if (!isMounted) return
        setUsersError(error.message || 'No fue posible cargar los usuarios')
      } finally {
        if (isMounted) setUsersLoading(false)
      }
    }

    if (session?.token) {
      loadUsers()
    } else {
      setUsersLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [session?.token])

  useEffect(() => {
    let isMounted = true

    const loadRequests = async () => {
      try {
        setRequestsLoading(true)
        setRequestsError('')
        const response = await getSignupRequestsWithAuthService(session?.token)
        if (!isMounted) return
        setRequests(Array.isArray(response?.data) ? response.data : [])
      } catch (error) {
        if (!isMounted) return
        setRequestsError(error.message || 'No fue posible cargar las solicitudes')
      } finally {
        if (isMounted) setRequestsLoading(false)
      }
    }

    if (session?.token) {
      loadRequests()
    } else {
      setRequestsLoading(false)
    }

    return () => {
      isMounted = false
    }
  }, [session?.token])

  const filteredUsers = useMemo(() => {
    const normalized = userSearch.trim().toLowerCase()
    if (!normalized) return users

    return users.filter((user) => {
      const resolved = resolveUser(user)
      return (
        resolved.name.toLowerCase().includes(normalized) ||
        resolved.email.toLowerCase().includes(normalized) ||
        String(resolved.id).toLowerCase().includes(normalized)
      )
    })
  }, [userSearch, users])

  const handleRegisterChange = (event) => {
    const { name, value, files, type } = event.target
    setRegisterForm((current) => ({
      ...current,
      [name]: type === 'file' ? files?.[0] || null : value,
    }))
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()
    setRegisterLoading(true)
    setRegisterError('')
    setRegisterMessage('')

    try {
      const result = await registerWithAuthService(registerForm)
      setRegisterMessage(result.message || 'Usuario registrado')
      setRegisterForm(initialRegisterForm)
    } catch (error) {
      setRegisterError(error.message || 'No se pudo registrar el usuario')
    } finally {
      setRegisterLoading(false)
    }
  }

  const handleProfileSearch = async (event) => {
    event.preventDefault()
    if (!profileId.trim()) {
      setProfileError('Ingresa un ID valido')
      return
    }

    setProfileLoading(true)
    setProfileError('')

    try {
      const response = await getProfileByIdWithAuthService(session?.token, profileId.trim())
      setProfileResult(response?.data || null)
    } catch (error) {
      setProfileError(error.message || 'No fue posible obtener el perfil')
      setProfileResult(null)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleRequestAction = async (requestId, action) => {
    try {
      setRequestsActionId(requestId)
      setRequestsActionError('')
      if (action === 'approve') {
        await approveSignupRequestWithAuthService(session?.token, requestId)
      } else if (action === 'reject') {
        await rejectSignupRequestWithAuthService(session?.token, requestId)
      }

      setRequests((current) => current.filter((item) => item.Id !== requestId))
    } catch (error) {
      setRequestsActionError(error.message || 'No fue posible procesar la solicitud')
    } finally {
      setRequestsActionId('')
    }
  }

  const refreshUsers = async () => {
    try {
      setUsersLoading(true)
      setUsersError('')
      const response = await getAllUsersWithAuthService(session?.token)
      setUsers(Array.isArray(response?.users) ? response.users : [])
    } catch (error) {
      setUsersError(error.message || 'No fue posible cargar los usuarios')
    } finally {
      setUsersLoading(false)
    }
  }

  const refreshRequests = async () => {
    try {
      setRequestsLoading(true)
      setRequestsError('')
      const response = await getSignupRequestsWithAuthService(session?.token)
      setRequests(Array.isArray(response?.data) ? response.data : [])
    } catch (error) {
      setRequestsError(error.message || 'No fue posible cargar las solicitudes')
    } finally {
      setRequestsLoading(false)
    }
  }

  const getRequestedFields = (request) => {
    const fields = []
    if (request.Email) fields.push('Correo')
    if (request.Phone) fields.push('Telefono')
    if (request.ProfilePicture) fields.push('Foto')
    return fields.length ? fields : ['Sin cambios detectados']
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-7 w-7 text-cyan-200" />
          <h1 className="text-2xl font-bold">Auth administrativo</h1>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Registro controlado, consulta de perfiles y aprobaciones de cambios.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <UserPlus className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold">Registrar usuario</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">Registro de usuarios desde el panel administrativo.</p>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-white"
            >
              <UserPlus className="h-4 w-4" /> Crear usuario
            </button>
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Eye className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Ver perfil por ID</h2>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Consulta el perfil completo usando el endpoint /profile/by-id.
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleProfileSearch}>
            <input
              value={profileId}
              onChange={(event) => setProfileId(event.target.value)}
              placeholder="ID de usuario"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400"
            />

            {profileError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {profileError}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-white"
            >
              {profileLoading ? 'Buscando...' : 'Buscar perfil'}
            </button>
          </form>

          {profileResult ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex items-center gap-2 text-slate-900">
                <Mail className="h-4 w-4" />
                <span>{profileResult.email}</span>
              </div>
              <p className="mt-2">Nombre: {profileResult.name}</p>
              <p>Telefono: {profileResult.phone || 'N/D'}</p>
              <p>Rol: {profileResult.role}</p>
              <p>Activo: {profileResult.isActive ? 'Si' : 'No'}</p>
              <p>Verificado: {profileResult.isEmailVerified ? 'Si' : 'No'}</p>
            </div>
          ) : null}
        </article>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900">
            <Users className="h-5 w-5 text-indigo-600" />
            <div>
              <h2 className="text-lg font-semibold">Listado de usuarios</h2>
              <p className="text-sm text-slate-500">Usuarios registrados en el AuthService</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <input
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
              placeholder="Buscar"
              className="text-sm text-slate-900 placeholder-slate-400 outline-none"
            />
          </div>
        </div>

        {usersLoading ? (
          <p className="mt-4 text-sm text-slate-500">Cargando usuarios...</p>
        ) : null}
        {usersError ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {usersError}
          </div>
        ) : null}

        {!usersLoading && !usersError ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold text-slate-600">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Verificado</th>
                  <th className="px-4 py-3">Registro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {filteredUsers.map((user) => {
                  const resolved = resolveUser(user)
                  return (
                    <tr key={resolved.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono text-xs text-slate-700">{resolved.id}</td>
                      <td className="px-4 py-3 text-slate-800">{resolved.name}</td>
                      <td className="px-4 py-3 text-slate-700">{resolved.email}</td>
                      <td className="px-4 py-3 text-slate-700">{resolved.role}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {resolved.isActive ? 'Activo' : 'Inactivo'}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {resolved.emailVerified ? 'Si' : 'No'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {formatDate(resolved.createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {!filteredUsers.length ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                No hay usuarios para mostrar.
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-slate-900">
            <ClipboardCheck className="h-5 w-5 text-emerald-600" />
            <div>
              <h2 className="text-lg font-semibold">Solicitudes de acceso</h2>
              <p className="text-sm text-slate-500">Solicitudes pendientes para aprobar o rechazar</p>
            </div>
          </div>
        </div>

        {requestsLoading ? <p className="mt-4 text-sm text-slate-500">Cargando solicitudes...</p> : null}
        {requestsError ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {requestsError}
          </div>
        ) : null}
        {requestsActionError ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {requestsActionError}
          </div>
        ) : null}

        {!requestsLoading && !requestsError ? (
          <div className="mt-6 space-y-4">
            {requests.map((request) => (
              <div key={request.Id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Solicitud #{request.Id}</p>
                    <p className="text-xs text-slate-500">Correo: {request.Email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                      request.Status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    <Loader2 className="h-4 w-4" />
                    {request.Status || 'PENDING'}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-slate-700">Solicitante</p>
                    <p>{request.Name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Campos enviados</p>
                    <p>{getRequestedFields(request).join(', ')}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Fecha de solicitud</p>
                    <p>{formatDate(request.created_at || request.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-700">Estado</p>
                    <p>{request.Status || 'PENDING'}</p>
                  </div>
                </div>

                {request.Status === 'PENDING' ? (
                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => handleRequestAction(request.Id, 'approve')}
                      disabled={requestsActionId === request.Id}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
                    >
                      {requestsActionId === request.Id ? 'Procesando...' : 'Aprobar'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRequestAction(request.Id, 'reject')}
                      disabled={requestsActionId === request.Id}
                      className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-70"
                    >
                      {requestsActionId === request.Id ? 'Procesando...' : 'Rechazar'}
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
      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute right-4 top-4 rounded-full bg-slate-100 px-3 py-1 text-sm"
            >
              Cerrar
            </button>
            <UnifiedAuthForm
              initialMode={"register"}
              onlyRegister={true}
              onRegistered={() => {
                setShowCreateModal(false)
                refreshUsers()
                refreshRequests()
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
