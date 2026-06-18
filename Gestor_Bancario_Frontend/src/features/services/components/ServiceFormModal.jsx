import { useServiceForm } from '../hooks/useServiceForm.js'
import { Modal, Field, SelectField, TextareaField, Button } from '../../../shared/components/ui/index.js'
import { ServiceDiscountForm } from './ServiceDiscountForm.jsx'

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
          <Field label="Nombre" name="name" value={form.name} onChange={handleChange} placeholder="Servicio premium" />
          <Field label="Categoria" name="category" value={form.category} onChange={handleChange} placeholder="Seguros, salud..." />

          <div className="md:col-span-2">
            <TextareaField label="Descripcion" name="description" rows="3" value={form.description} onChange={handleChange} />
          </div>

          <SelectField label="Tipo de ítem" name="type" value={form.type} onChange={handleChange}>
            <option value="SERVICE">Servicio</option>
            <option value="PRODUCT">Producto</option>
          </SelectField>

          <Field label="Precio" name="price" type="number" value={form.price} onChange={handleChange} />

          {form.type === 'SERVICE' ? (
            <div className="md:col-span-2">
              <TextareaField label="Terminos" name="terms" rows="3" value={form.terms} onChange={handleChange} />
            </div>
          ) : null}

          <SelectField label="Moneda" name="currency" value={form.currency} onChange={handleChange}>
            <option value="GTQ">GTQ</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="MXN">MXN</option>
          </SelectField>

          <SelectField label="Estado actual" name="status" value={form.status} onChange={handleChange}>
            <option value="DRAFT">Borrador</option>
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
          </SelectField>

          <div className="flex items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              <span className="text-[var(--theme-text-muted)]">Activo</span>
            </label>
            <label className="flex items-center gap-2" title="Indica si el usuario debe tener su correo verificado para usar esto">
              <input
                type="checkbox"
                name="requiresVerifiedEmail"
                checked={form.requiresVerifiedEmail}
                onChange={handleChange}
              />
              <span className="text-[var(--theme-text-muted)]">Requiere Email Verificado</span>
            </label>
          </div>

          <Field
            label="Fecha de inicio"
            type="date"
            name="validFrom"
            value={form.validFrom}
            onChange={handleChange}
            title="Fecha en que el servicio comenzará a estar activo"
          />

          <Field
            label="Fecha de finalización"
            type="date"
            name="validTo"
            value={form.validTo}
            onChange={handleChange}
            title="Fecha en que el servicio dejará de estar activo"
          />

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-[var(--theme-text-muted)]">Saldo mínimo requerido</span>
            <Field
              name="minBalance"
              type="number"
              value={form.minBalance}
              onChange={handleChange}
              title="Saldo mínimo requerido en la cuenta para poder adquirirlo"
            />
            <small className="text-xs text-[var(--theme-text-muted)] opacity-70">Saldo mínimo requerido para adquirir.</small>
          </label>

          <Field
            label="Límite de usos por usuario"
            name="maxUsesPerUser"
            type="number"
            value={form.maxUsesPerUser}
            onChange={handleChange}
            title="Límite máximo de veces que un usuario puede adquirir esto"
          />

          <Field
            label="Límite total de usos global"
            name="totalUsesLimit"
            type="number"
            value={form.totalUsesLimit}
            onChange={handleChange}
            title="Límite máximo global en todo el sistema"
          />
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
          <Field label="Tags (coma)" name="tags" value={form.tags} onChange={handleChange} placeholder="vip, premium" />

          <label className="grid gap-1.5 text-sm">
            <span className="font-medium text-[var(--theme-text-muted)]">Imagen</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>
        </div>

        <TextareaField
          label="Nota interna administrativa"
          name="internalNote"
          rows="2"
          value={form.internalNote}
          onChange={handleChange}
          placeholder="Solo visible para administradores..."
          title="Información exclusiva para el equipo administrativo"
        />

        <ServiceDiscountForm
          discount={discount}
          showDiscount={showDiscount}
          setShowDiscount={setShowDiscount}
          onDiscountChange={handleDiscountChange}
        />

        <div className="flex justify-end gap-3">
          <Button variant="cancel" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
