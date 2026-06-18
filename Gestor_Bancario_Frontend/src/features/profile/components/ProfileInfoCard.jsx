import {
  Camera,
  ClipboardCheck,
  Clock,
  Mail,
  Phone,
  ShieldCheck,
  UserCircle,
} from 'lucide-react'
import { formatDate } from '../../../shared/utils/format.js'

export const ProfileInfoCard = ({
  profile,
  avatarSrc,
  fallbackSrc,
  onAvatarChange,
  onOpenEdit,
  onSave,
  hasAnyChange,
  submitting,
}) => (
  <article className="flex h-full flex-col rounded-3xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] p-6 shadow-sm text-[color:var(--theme-text)]">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border border-[color:var(--theme-border)]">
        <img
          src={avatarSrc}
          alt={profile?.name || 'Perfil'}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = fallbackSrc
          }}
        />
        <label className="absolute -bottom-2 -right-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[color:var(--theme-text)] text-[color:var(--theme-bg)] shadow">
          <Camera className="h-4 w-4" />
          <input
            type="file"
            accept="image/*"
            name="profilePicture"
            onChange={onAvatarChange}
            className="hidden"
          />
        </label>
      </div>

      <div>
        <p className="text-lg font-semibold">{profile?.name || 'Usuario'}</p>
        <p className="text-sm text-[color:var(--theme-text-muted)]">{profile?.email}</p>
        <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
          <ShieldCheck className="h-4 w-4" />
          {profile?.isActive ? 'Cuenta activa' : 'Cuenta inactiva'}
        </div>
      </div>
    </div>

    <div className="mt-6 grid gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4">
        <div className="flex items-center gap-2 text-sm text-[color:var(--theme-text-muted)]">
          <Mail className="h-4 w-4" />
          Correo
        </div>
        <p className="mt-2 text-sm font-medium">{profile?.email}</p>
        <p className="mt-1 text-xs text-[color:var(--theme-text-muted)]">
          {profile?.isEmailVerified ? 'Verificado' : 'Pendiente de verificacion'}
        </p>
      </div>
      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4">
        <div className="flex items-center gap-2 text-sm text-[color:var(--theme-text-muted)]">
          <Phone className="h-4 w-4" />
          Telefono
        </div>
        <p className="mt-2 text-sm font-medium">
          {profile?.phone || 'N/D'}
        </p>
      </div>
      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4">
        <div className="flex items-center gap-2 text-sm text-[color:var(--theme-text-muted)]">
          <ShieldCheck className="h-4 w-4" />
          Rol
        </div>
        <p className="mt-2 text-sm font-medium">{profile?.role}</p>
      </div>
      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4">
        <div className="flex items-center gap-2 text-sm text-[color:var(--theme-text-muted)]">
          <Clock className="h-4 w-4" />
          Registro
        </div>
        <p className="mt-2 text-sm font-medium">{formatDate(profile?.createdAt)}</p>
      </div>
      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4">
        <div className="flex items-center gap-2 text-sm text-[color:var(--theme-text-muted)]">
          <ClipboardCheck className="h-4 w-4" />
          DPI
        </div>
        <p className="mt-2 text-sm font-medium">{profile?.dpi || 'N/D'}</p>
      </div>
      <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] p-4">
        <div className="flex items-center gap-2 text-sm text-[color:var(--theme-text-muted)]">
          <UserCircle className="h-4 w-4" />
          Nacimiento
        </div>
        <p className="mt-2 text-sm font-medium">
          {formatDate(profile?.fechaNacimiento)}
        </p>
      </div>
    </div>

    <div className="mt-auto pt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={onOpenEdit}
        className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-5 py-2.5 text-sm font-semibold text-[color:var(--theme-text)] transition hover:opacity-80"
      >
        Editar perfil
      </button>
      <button
        type="button"
        onClick={onSave}
        disabled={!hasAnyChange || submitting}
        className="rounded-2xl bg-[color:var(--theme-accent)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--theme-accent-strong)] disabled:opacity-70"
      >
        {submitting ? 'Guardando...' : 'Guardar cambios'}
      </button>
    </div>
  </article>
)
