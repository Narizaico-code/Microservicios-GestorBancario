import { Eye, Mail } from 'lucide-react'
import { Alert } from '../../../shared/components/ui/Alert.jsx'
import { useProfileLookup } from '../hooks/useProfileLookup.js'

export const ProfileLookupCard = () => {
  const { profileId, setProfileId, loading, error, result, handleSearch } = useProfileLookup()

  return (
    <article className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
      <div className="flex items-center gap-2 text-[color:var(--theme-text)]">
        <Eye className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Ver perfil por ID</h2>
      </div>
      <p className="mt-2 text-sm text-[color:var(--theme-text-muted)]">
        Consulta el perfil completo usando el endpoint /profile/by-id.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSearch}>
        <input
          value={profileId}
          onChange={(event) => setProfileId(event.target.value)}
          placeholder="ID de usuario"
          className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 text-[color:var(--theme-text)] placeholder:text-[color:var(--theme-text-muted)]"
        />

        <Alert>{error}</Alert>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[color:var(--theme-accent)] px-4 py-3 text-white"
        >
          {loading ? 'Buscando...' : 'Buscar perfil'}
        </button>
      </form>

      {result ? (
        <div className="mt-6 rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4 text-sm text-[color:var(--theme-text-muted)]">
          <div className="flex items-center gap-2 text-[color:var(--theme-text)]">
            <Mail className="h-4 w-4" />
            <span>{result.email}</span>
          </div>
          <p className="mt-2">Nombre: {result.name}</p>
          <p>Telefono: {result.phone || 'N/D'}</p>
          <p>Rol: {result.role}</p>
          <p>Activo: {result.isActive ? 'Si' : 'No'}</p>
          <p>Verificado: {result.isEmailVerified ? 'Si' : 'No'}</p>
        </div>
      ) : null}
    </article>
  )
}
