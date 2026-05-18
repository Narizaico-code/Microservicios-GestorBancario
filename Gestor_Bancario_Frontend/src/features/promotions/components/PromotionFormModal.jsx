import { usePromotionForm } from '../hooks/usePromotionForm.js'
import { Modal } from '../../../shared/components/ui/Modal.jsx'

export const PromotionFormModal = ({ promotion, onClose, onSuccess }) => {
  const {
    form,
    setImageFile,
    services,
    loadingServices,
    loading,
    roleOptions,
    segmentOptions,
    isEdit,
    handleChange,
    handleRoleToggle,
    handleServiceToggle,
    handleSubmit,
  } = usePromotionForm({ promotion, onSuccess, onClose })

  return (
    <Modal title={isEdit ? 'Editar promocion' : 'Nueva promocion'} onClose={onClose} maxWidth="max-w-4xl">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Nombre</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Tipo de promoción</span>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            >
              <option value="GENERAL">General</option>
              <option value="CASHBACK">Devolución de efectivo</option>
              <option value="RATE_REDUCTION">Reducción de tasa</option>
              <option value="FEE_WAIVER">Exención de comisión</option>
              <option value="BONUS_POINTS">Puntos de bonificación</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm md:col-span-2">
            <span className="text-[var(--theme-text-muted)]">Descripcion</span>
            <textarea
              name="description"
              rows="3"
              value={form.description}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Estado actual</span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            >
              <option value="DRAFT">Borrador</option>
              <option value="SCHEDULED">Programada</option>
              <option value="ACTIVE">Activa</option>
              <option value="PAUSED">Pausada</option>
              <option value="EXPIRED">Expirada</option>
              <option value="CANCELLED">Cancelada</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Segmento Objetivo</span>
            <select
              name="targetSegment"
              value={form.targetSegment}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            >
              {segmentOptions.map((segment) => {
                const labels = { ALL: 'Todos', VIP: 'VIP', NEW: 'Nuevos usuarios', INACTIVE: 'Inactivos', PREMIUM: 'Premium' };
                return <option key={segment} value={segment}>{labels[segment] || segment}</option>;
              })}
            </select>
            <small className="text-xs text-[var(--theme-text-muted)] opacity-70">
              VIP: Saldo alto | NEW: &lt; 30 días | INACTIVE: Sin uso 60 días | PREMIUM: &gt; 1 cuenta
            </small>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Fecha de inicio</span>
            <input
              type="date"
              name="validFrom"
              value={form.validFrom}
              onChange={handleChange}
              title="Fecha en que la promoción comenzará a estar activa"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
            <small className="text-xs text-[var(--theme-text-muted)] opacity-70">Inicio del período activo.</small>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Fecha de finalización</span>
            <input
              type="date"
              name="validTo"
              value={form.validTo}
              onChange={handleChange}
              title="Fecha en que la promoción terminará"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
            <small className="text-xs text-[var(--theme-text-muted)] opacity-70">Fin del período activo.</small>
          </label>

          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2" title="Habilitar permite que la promoción se muestre si está activa">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              <span className="text-[var(--theme-text-muted)]">Activo</span>
            </label>
            <label className="flex items-center gap-2" title="Permite que esta promoción se combine con otras simultáneamente">
              <input type="checkbox" name="stackable" checked={form.stackable} onChange={handleChange} />
              <span className="text-[var(--theme-text-muted)]">Acumulable (Stackable)</span>
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Límite global de usos</span>
            <input
              name="maxUsesGlobal"
              type="number"
              value={form.maxUsesGlobal}
              onChange={handleChange}
              placeholder="Ej. 1000"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
            <small className="text-xs text-[var(--theme-text-muted)] opacity-70">Total de veces que todos los usuarios pueden usarla combinados.</small>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Límite de usos por usuario</span>
            <input
              name="maxUsesPerUser"
              type="number"
              value={form.maxUsesPerUser}
              onChange={handleChange}
              placeholder="Ej. 1"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
            <small className="text-xs text-[var(--theme-text-muted)] opacity-70">Veces que un mismo cliente puede beneficiarse.</small>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Presupuesto máximo asignado</span>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              placeholder="Ej. 50000"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
            <small className="text-xs text-[var(--theme-text-muted)] opacity-70">Límite de gasto monetario de la promoción.</small>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Prioridad</span>
            <input
              name="priority"
              type="number"
              value={form.priority}
              onChange={handleChange}
              placeholder="Ej. 10"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
            <small className="text-xs text-[var(--theme-text-muted)] opacity-70">A mayor número, mayor prioridad para aplicarse.</small>
          </label>
        </div>

        <div className="grid gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">Roles objetivo</span>
          <div className="flex flex-wrap gap-3">
            {roleOptions.map((role) => (
              <label key={role.value} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.targetRoles.includes(role.value)}
                  onChange={() => handleRoleToggle(role.value)}
                />
                <span className="text-[var(--theme-text)]">{role.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Tags (coma)</span>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="cashback, verano"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>
        </div>

        <label className="grid gap-2 text-sm">
          <span className="text-[var(--theme-text-muted)]">Terminos</span>
          <textarea
            name="terms"
            rows="2"
            value={form.terms}
            onChange={handleChange}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
          />
        </label>

        <label className="grid gap-2 text-sm" title="Estructura JSON con las condiciones específicas de la promoción">
          <span className="text-[var(--theme-text-muted)]">Condiciones especiales (JSON)</span>
          <textarea
            name="conditions"
            rows="3"
            value={form.conditions}
            onChange={handleChange}
            placeholder='Ej: {"minPurchase": 500}'
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
          />
          <small className="text-xs text-[var(--theme-text-muted)] opacity-70">Objeto JSON con condiciones adicionales.</small>
        </label>

        <label className="grid gap-2 text-sm" title="Información exclusiva para el equipo administrativo">
          <span className="text-[var(--theme-text-muted)]">Nota interna administrativa</span>
          <textarea
            name="internalNote"
            rows="2"
            value={form.internalNote}
            onChange={handleChange}
            placeholder="Comentarios solo visibles para administradores..."
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
          />
        </label>

        <div className="rounded-[18px] border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--theme-text)]">Servicios aplicables</p>
            {loadingServices ? (
              <span className="text-xs text-[var(--theme-text-muted)]">Cargando...</span>
            ) : null}
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {services.length ? services.map((service) => (
              <label key={service._id} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.applicableServices.includes(service._id)}
                  onChange={() => handleServiceToggle(service._id)}
                />
                <span className="text-[var(--theme-text)]">{service.name}</span>
              </label>
            )) : (
              <p className="text-xs text-[var(--theme-text-muted)]">No hay servicios disponibles.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--theme-text-muted)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#1a56db] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
