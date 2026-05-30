import { UserCircle } from 'lucide-react'

export const ProfileHeader = () => (
  <div className="rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-8 shadow-sm text-[color:var(--theme-text)]">
    <div className="flex items-center gap-3">
      <UserCircle className="h-7 w-7 text-[color:var(--theme-accent)]" />
      <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
        Perfil de usuario
      </h1>
    </div>
    <p className="mt-3 text-sm text-[color:var(--theme-text-muted)]">
      Administra tus datos personales, revisa tus cuentas y gestiona cambios sensibles.
    </p>
  </div>
)
