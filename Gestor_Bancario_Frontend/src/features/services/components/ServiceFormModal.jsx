import { useServiceForm } from '../hooks/useServiceForm.js'
import { Modal } from '../../../shared/components/ui/Modal.jsx'

export const ServiceFormModal = ({ service, onClose, onSuccess }) => {
  const {
    form,
    discount,
    showDiscount,
    setShowDiscount,
    setImageFile,
    loading,
    roleOptions,
    isEdit,
    handleChange,
    handleRoleToggle,
    handleDiscountChange,
    handleSubmit,
  } = useServiceForm({ service, onSuccess, onClose })

  return (
    <Modal title={isEdit ? 'Editar servicio' : 'Nuevo servicio'} onClose={onClose} maxWidth="max-w-3xl">
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Nombre</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
              placeholder="Servicio premium"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Categoria</span>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
              placeholder="Seguros, salud..."
            />
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
            <span className="text-[var(--theme-text-muted)]">Tipo</span>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            >
              <option value="SERVICE">SERVICE</option>
              <option value="PRODUCT">PRODUCT</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Precio</span>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>

          {form.type === 'SERVICE' ? (
            <label className="grid gap-2 text-sm md:col-span-2">
              <span className="text-[var(--theme-text-muted)]">Terminos</span>
              <textarea
                name="terms"
                rows="3"
                value={form.terms}
                onChange={handleChange}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
              />
            </label>
          ) : null}

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Moneda</span>
            <select
              name="currency"
              value={form.currency}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            >
              <option value="GTQ">GTQ</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MXN">MXN</option>
            </select>
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
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </label>

          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
              />
              <span className="text-[var(--theme-text-muted)]">Activo</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="requiresVerifiedEmail"
                checked={form.requiresVerifiedEmail}
                onChange={handleChange}
              />
              <span className="text-[var(--theme-text-muted)]">Email verificado</span>
            </label>
          </div>

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

          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Min balance</span>
            <input
              name="minBalance"
              type="number"
              value={form.minBalance}
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
            <span className="text-[var(--theme-text-muted)]">Total usos limite</span>
            <input
              name="totalUsesLimit"
              type="number"
              value={form.totalUsesLimit}
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
              placeholder="vip, premium"
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
            <p className="text-sm font-semibold text-[var(--theme-text)]">Descuento</p>
            <button
              type="button"
              onClick={() => setShowDiscount((current) => !current)}
              className="text-xs font-semibold text-[#1a56db]"
            >
              {showDiscount ? 'Ocultar' : 'Agregar'}
            </button>
          </div>

          {showDiscount ? (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span className="text-[var(--theme-text-muted)]">Tipo</span>
                <select
                  name="type"
                  value={discount.type}
                  onChange={handleDiscountChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
                >
                  <option value="PERCENT">PERCENT</option>
                  <option value="AMOUNT">AMOUNT</option>
                </select>
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[var(--theme-text-muted)]">Valor</span>
                <input
                  name="value"
                  type="number"
                  value={discount.value}
                  onChange={handleDiscountChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[var(--theme-text-muted)]">Inicio</span>
                <input
                  name="startAt"
                  type="date"
                  value={discount.startAt}
                  onChange={handleDiscountChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[var(--theme-text-muted)]">Fin</span>
                <input
                  name="endAt"
                  type="date"
                  value={discount.endAt}
                  onChange={handleDiscountChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[var(--theme-text-muted)]">Min amount</span>
                <input
                  name="minAmount"
                  type="number"
                  value={discount.minAmount}
                  onChange={handleDiscountChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-[var(--theme-text-muted)]">Max usos</span>
                <input
                  name="maxUses"
                  type="number"
                  value={discount.maxUses}
                  onChange={handleDiscountChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
                />
              </label>

              <label className="grid gap-2 text-sm md:col-span-2">
                <span className="text-[var(--theme-text-muted)]">Terminos descuento</span>
                <textarea
                  name="terms"
                  rows="2"
                  value={discount.terms}
                  onChange={handleDiscountChange}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
                />
              </label>
            </div>
          ) : null}
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
