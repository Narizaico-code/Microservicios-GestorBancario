import { Filter, Users } from 'lucide-react'
import { Alert } from '../../../shared/components/ui/Alert.jsx'
import { formatDate } from '../../../shared/utils/format.js'

const COLUMNS = ['ID', 'Nombre', 'Correo', 'Rol', 'Estado', 'Verificado', 'Registro']

export const UsersListSection = ({ users, loading, error, search, setSearch }) => (
  <section className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-[color:var(--theme-text)]">
        <Users className="h-5 w-5 text-indigo-600" />
        <div>
          <h2 className="text-lg font-semibold">Listado de usuarios</h2>
          <p className="text-sm text-[color:var(--theme-text-muted)]">Usuarios registrados en el AuthService</p>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-3 py-2">
        <Filter className="h-4 w-4 text-[color:var(--theme-text-muted)]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar"
          className="text-sm text-[color:var(--theme-text)] placeholder:text-[color:var(--theme-text-muted)] outline-none bg-transparent"
        />
      </div>
    </div>

    {loading ? <p className="mt-4 text-sm text-[color:var(--theme-text-muted)]">Cargando usuarios...</p> : null}
    {error ? <Alert className="mt-4">{error}</Alert> : null}

    {!loading && !error ? (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] text-left text-xs font-semibold text-[color:var(--theme-text-muted)]">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} className="px-4 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--theme-border)] text-sm">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[color:var(--theme-surface-alt)]">
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--theme-text-muted)]">{user.id}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3 text-[color:var(--theme-text-muted)]">{user.email}</td>
                <td className="px-4 py-3 text-[color:var(--theme-text-muted)]">{user.role}</td>
                <td className="px-4 py-3 text-[color:var(--theme-text-muted)]">
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </td>
                <td className="px-4 py-3 text-[color:var(--theme-text-muted)]">{user.emailVerified ? 'Si' : 'No'}</td>
                <td className="px-4 py-3 text-[color:var(--theme-text-muted)]">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!users.length ? (
          <div className="rounded-2xl border border-dashed border-[color:var(--theme-border)] px-4 py-6 text-sm text-[color:var(--theme-text-muted)]">
            No hay usuarios para mostrar.
          </div>
        ) : null}
      </div>
    ) : null}
  </section>
)
