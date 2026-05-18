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
            <span className="text-[var(--theme-text-muted)]">Tipo</span>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            >
              <option value="GENERAL">GENERAL</option>
              <option value="CASHBACK">CASHBACK</option>
              <option value="RATE_REDUCTION">RATE_REDUCTION</option>
              <option value="FEE_WAIVER">FEE_WAIVER</option>
              <option value="BONUS_POINTS">BONUS_POINTS</option>
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
            <span className="text-[var(--theme-text-muted)]">Estado</span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="PAUSED">PAUSED</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Segmento</span>
            <select
              name="targetSegment"
              value={form.targetSegment}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            >
              {segmentOptions.map((segment) => (
                <option key={segment} value={segment}>{segment}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Vigencia inicio</span>
            <input
              type="date"
              name="validFrom"
              value={form.validFrom}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Vigencia fin</span>
            <input
              type="date"
              name="validTo"
              value={form.validTo}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              <span className="text-[var(--theme-text-muted)]">Activo</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="stackable" checked={form.stackable} onChange={handleChange} />
              <span className="text-[var(--theme-text-muted)]">Stackable</span>
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Max usos global</span>
            <input
              name="maxUsesGlobal"
              type="number"
              value={form.maxUsesGlobal}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Max usos por usuario</span>
            <input
              name="maxUsesPerUser"
              type="number"
              value={form.maxUsesPerUser}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Budget</span>
            <input
              name="budget"
              type="number"
              value={form.budget}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Priority</span>
            <input
              name="priority"
              type="number"
              value={form.priority}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
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

        <label className="grid gap-2 text-sm">
          <span className="text-[var(--theme-text-muted)]">Condiciones (JSON)</span>
          <textarea
            name="conditions"
            rows="3"
            value={form.conditions}
            onChange={handleChange}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
          />
        </label>

        <label className="grid gap-2 text-sm">
          <span className="text-[var(--theme-text-muted)]">Nota interna</span>
          <textarea
            name="internalNote"
            rows="2"
            value={form.internalNote}
            onChange={handleChange}
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
