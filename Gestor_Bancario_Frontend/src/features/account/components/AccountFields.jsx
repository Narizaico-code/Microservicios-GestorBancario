import { SelectField, Field } from '../../../shared/components/ui/index.js'
import { CURRENCIES } from '../../../shared/constants/index.js'

export const AccountFields = ({ form, onChange, onEstadoChange }) => (
  <section className="grid gap-4 md:grid-cols-2">
    <SelectField
      label="Tipo de cuenta"
      name="tipoCuenta"
      value={form.tipoCuenta}
      onChange={onChange}
      title="Selecciona la modalidad de la cuenta bancaria"
    >
      <option value="AHORRO">Ahorro</option>
      <option value="MONETARIA">Monetaria</option>
    </SelectField>

    <SelectField
      label="Moneda"
      name="moneda"
      value={form.moneda}
      onChange={onChange}
      title="Divisa base para las operaciones de esta cuenta"
    >
      {CURRENCIES.map((currency) => (
        <option key={currency} value={currency}>
          {currency}
        </option>
      ))}
    </SelectField>

    <Field
      label="Saldo inicial"
      type="number"
      name="saldo"
      value={form.saldo}
      onChange={onChange}
      min="0"
      step="0.01"
      placeholder="Ej. 1500.00"
      title="Monto de apertura disponible en la cuenta"
    />

    <SelectField label="Estado" name="estado" value={String(form.estado)} onChange={onEstadoChange}>
      <option value="true">Activa</option>
      <option value="false">Inactiva</option>
    </SelectField>
  </section>
)
