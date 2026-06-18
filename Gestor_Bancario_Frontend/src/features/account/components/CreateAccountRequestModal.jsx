import { Modal, SelectField, Alert, Button } from '../../../shared/components/ui/index.js'
import { CURRENCY_OPTIONS } from '../../../shared/constants/index.js'

const CreateAccountRequestModal = ({ isOpen, onClose, onSubmit, loading, error, form, setForm }) => {
  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Modal title="Solicitar creación de cuenta" onClose={onClose} maxWidth="max-w-md">
      <p className="-mt-3 mb-5 max-w-xs text-[13px] leading-relaxed text-[var(--theme-text-muted)]">
        Solo selecciona tipo y moneda. El administrador aprobará o denegará tu solicitud.
      </p>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <SelectField
          label="Tipo de cuenta"
          name="tipoCuenta"
          value={form.tipoCuenta}
          onChange={handleChange}
          disabled={loading}
          title="Selecciona la modalidad de la cuenta bancaria"
        >
          <option value="AHORRO">Ahorro</option>
          <option value="MONETARIA">Monetaria</option>
        </SelectField>

        <SelectField
          label="Moneda"
          name="moneda"
          value={form.moneda}
          onChange={handleChange}
          disabled={loading}
          title="Divisa base para las operaciones de esta cuenta"
        >
          {CURRENCY_OPTIONS.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </SelectField>

        <Alert variant="error">{error || null}</Alert>

        <div className="mt-1 flex gap-3">
          <Button variant="cancel" onClick={onClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex-1">
            {loading ? 'Enviando…' : 'Enviar solicitud'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default CreateAccountRequestModal
