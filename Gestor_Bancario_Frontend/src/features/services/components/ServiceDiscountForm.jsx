import { Field, SelectField, TextareaField } from '../../../shared/components/ui/index.js'

export const ServiceDiscountForm = ({ discount, showDiscount, setShowDiscount, onDiscountChange }) => (
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
        <SelectField label="Tipo de Descuento" name="type" value={discount.type} onChange={onDiscountChange}>
          <option value="PERCENT">Porcentaje</option>
          <option value="AMOUNT">Monto Fijo</option>
        </SelectField>

        <Field label="Valor" name="value" type="number" value={discount.value} onChange={onDiscountChange} />
        <Field label="Inicio" name="startAt" type="date" value={discount.startAt} onChange={onDiscountChange} />
        <Field label="Fin" name="endAt" type="date" value={discount.endAt} onChange={onDiscountChange} />
        <Field label="Min amount" name="minAmount" type="number" value={discount.minAmount} onChange={onDiscountChange} />
        <Field label="Max usos" name="maxUses" type="number" value={discount.maxUses} onChange={onDiscountChange} />

        <div className="md:col-span-2">
          <TextareaField label="Terminos descuento" name="terms" rows="2" value={discount.terms} onChange={onDiscountChange} />
        </div>
      </div>
    ) : null}
  </div>
)
