import { UserPlus } from 'lucide-react'

export const RegisterUserCard = ({ onOpen }) => (
  <article className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm">
    <div className="flex items-center gap-2 text-[color:var(--theme-text)]">
      <UserPlus className="h-5 w-5 text-emerald-600" />
      <h2 className="text-lg font-semibold">Registrar usuario</h2>
    </div>
    <p className="mt-2 text-sm text-[color:var(--theme-text-muted)]">
      Registro de usuarios desde el panel administrativo.
    </p>

    <div className="mt-6">
      <button
        type="button"
        onClick={onOpen}
        className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-white"
      >
        <UserPlus className="h-4 w-4" /> Crear usuario
      </button>
    </div>
  </article>
)
