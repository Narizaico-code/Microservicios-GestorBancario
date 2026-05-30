import { AlertTriangle, KeyRound } from 'lucide-react'
import { Modal } from '../../../shared/components/ui/Modal.jsx'
import { ProfileFeedback } from './ProfileFeedback.jsx'

export const EditProfileModal = ({
  isOpen,
  onClose,
  form,
  onChange,
  onSubmit,
  submitting,
  submitError,
  notice,
  sensitiveCount,
  hasAnyChange,
  passwordChanged,
}) => {
  if (!isOpen) return null

  return (
    <Modal title="Editar perfil" onClose={onClose} maxWidth="max-w-2xl">
      <p className="text-sm text-[color:var(--theme-text-muted)]">
        Cambia correo, telefono o contrasena. Si actualizas dos o mas datos sensibles
        (correo, telefono, contrasena) la solicitud ira a aprobacion. Si hiciste un cambio
        sensible recientemente, tambien puede requerir aprobacion.
      </p>

      <form className="mt-6 space-y-5" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm text-[color:var(--theme-text)]">
            Correo
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 text-[color:var(--theme-text)] outline-none transition focus:border-[color:var(--theme-accent)] focus:bg-[color:var(--theme-surface)]"
            />
          </label>
          <label className="block space-y-2 text-sm text-[color:var(--theme-text)]">
            Telefono
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 text-[color:var(--theme-text)] outline-none transition focus:border-[color:var(--theme-accent)] focus:bg-[color:var(--theme-surface)]"
            />
          </label>
          <label className="block space-y-2 text-sm text-[color:var(--theme-text)]">
            Contrasena actual
            <input
              name="currentPassword"
              type="password"
              value={form.currentPassword}
              onChange={onChange}
              className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 text-[color:var(--theme-text)] outline-none transition focus:border-[color:var(--theme-accent)] focus:bg-[color:var(--theme-surface)]"
            />
          </label>
          <label className="block space-y-2 text-sm text-[color:var(--theme-text)]">
            Nueva contrasena
            <input
              name="newPassword"
              type="password"
              value={form.newPassword}
              onChange={onChange}
              className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 text-[color:var(--theme-text)] outline-none transition focus:border-[color:var(--theme-accent)] focus:bg-[color:var(--theme-surface)]"
            />
          </label>
          <label className="block space-y-2 text-sm text-[color:var(--theme-text)]">
            Ingresos Mensuales
            <input
              name="ingresosMensuales"
              type="number"
              step="0.01"
              value={form.ingresosMensuales}
              onChange={onChange}
              className="w-full rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3 text-[color:var(--theme-text)] outline-none transition focus:border-[color:var(--theme-accent)] focus:bg-[color:var(--theme-surface)]"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-4 text-sm text-[color:var(--theme-text)]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <span>
              Cambios sensibles detectados: {sensitiveCount}
            </span>
          </div>
          {sensitiveCount >= 2 ? (
            <p className="mt-2 text-xs text-amber-600">
              Se solicitara aprobacion del administrador al enviar.
            </p>
          ) : null}
        </div>

        <ProfileFeedback submitError={submitError} notice={notice} />

        {passwordChanged ? (
          <div className="flex items-center gap-2 text-xs text-[color:var(--theme-text-muted)]">
            <KeyRound className="h-4 w-4" />
            Recuerda escribir la contrasena actual para aplicar el cambio.
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-6 py-3 text-sm font-semibold text-[color:var(--theme-text)] transition hover:opacity-80"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting || !hasAnyChange}
            className="rounded-2xl bg-[color:var(--theme-accent)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[color:var(--theme-accent-strong)] disabled:opacity-70"
          >
            {submitting ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
