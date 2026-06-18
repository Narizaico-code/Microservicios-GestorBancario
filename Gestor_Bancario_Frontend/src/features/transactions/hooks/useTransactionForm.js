import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { createDepositTransaction, createTransferTransaction } from '../../../shared/api/index.js'

const buildInitialForm = (locationState) => ({
  cuentaOrigen: locationState?.cuentaOrigen || '',
  cuentaDestino: locationState?.cuentaDestino || '',
  monto: '',
  descripcion: '',
  moneda: 'GTQ',
})

export const useTransactionForm = ({ isAdmin, onSuccess }) => {
  const location = useLocation()
  const [formValues, setFormValues] = useState(() => buildInitialForm(location.state))
  const [savingTransaction, setSavingTransaction] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const resetForm = () => setFormValues(buildInitialForm(null))

  const validate = () => {
    if (!formValues.cuentaDestino.trim()) {
      toast.error('La cuenta destino es obligatoria')
      return false
    }
    if (!isAdmin && !formValues.cuentaOrigen.trim()) {
      toast.error('La cuenta origen es obligatoria para transferencias')
      return false
    }
    if (!formValues.monto || Number(formValues.monto) <= 0) {
      toast.error('El monto debe ser mayor a 0')
      return false
    }
    if (!formValues.descripcion.trim()) {
      toast.error('La descripcion es obligatoria')
      return false
    }
    return true
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    try {
      setSavingTransaction(true)

      if (isAdmin) {
        await createDepositTransaction({
          cuentaDestino: formValues.cuentaDestino.trim(),
          monto: Number(formValues.monto),
          descripcion: formValues.descripcion.trim(),
          moneda: formValues.moneda,
        })
        toast.success('Deposito creado exitosamente')
      } else {
        await createTransferTransaction({
          cuentaOrigen: formValues.cuentaOrigen.trim(),
          cuentaDestino: formValues.cuentaDestino.trim(),
          monto: Number(formValues.monto),
          descripcion: formValues.descripcion.trim(),
          moneda: formValues.moneda,
        })
        toast.success('Transferencia realizada exitosamente')
      }

      resetForm()
      await onSuccess?.()
    } catch (error) {
      const message =
        error?.response?.data?.message || `No se pudo procesar la ${isAdmin ? 'transaccion' : 'transferencia'}`
      toast.error(message)
    } finally {
      setSavingTransaction(false)
    }
  }

  return { formValues, savingTransaction, handleChange, resetForm, handleSubmit }
}
