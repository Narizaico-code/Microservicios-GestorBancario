import { useEffect, useState } from 'react'
import { createAccountAdmin } from '../../../shared/api/account'
import { getReadableError } from '../../../shared/utils/getReadableError.js'

const initialForm = {
  userId: '',
  tipoCuenta: 'AHORRO',
  moneda: 'GTQ',
  saldo: '',
  estado: true,
}

const validate = (form) => {
  const issues = []

  if (!form.userId.trim()) {
    issues.push('Debes ingresar o seleccionar un userId.')
  }

  if (!form.tipoCuenta) {
    issues.push('El tipo de cuenta es requerido.')
  }

  if (!form.moneda) {
    issues.push('La moneda es requerida.')
  }

  const saldoNumber = Number(form.saldo)
  if (Number.isNaN(saldoNumber)) {
    issues.push('El saldo debe ser un número válido.')
  } else if (saldoNumber < 0) {
    issues.push('El saldo no puede ser negativo.')
  }

  return issues
}

export const useCreateAccountForm = ({ isOpen, onCreated }) => {
  const [form, setForm] = useState(initialForm)
  const [selectedUserId, setSelectedUserId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset del form al abrir el modal
    setForm(initialForm)
    setSelectedUserId('')
    setSubmitting(false)
    setError('')
  }, [isOpen])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (name === 'userId') {
      setSelectedUserId('')
    }
  }

  const handleSelectUser = (event) => {
    const nextUserId = event.target.value
    setSelectedUserId(nextUserId)
    setForm((current) => ({
      ...current,
      userId: nextUserId,
    }))
  }

  const handleEstadoChange = (event) => {
    const nextValue = event.target.value === 'true'
    setForm((current) => ({
      ...current,
      estado: nextValue,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    const issues = validate(form)
    if (issues.length > 0) {
      setError(issues.join('\n'))
      return
    }

    try {
      setSubmitting(true)
      const payload = {
        ...form,
        saldo: Number(form.saldo),
      }
      const response = await createAccountAdmin(payload)
      onCreated?.(response)
    } catch (err) {
      setError(getReadableError(err, 'No se pudo crear la cuenta'))
    } finally {
      setSubmitting(false)
    }
  }

  return {
    form,
    selectedUserId,
    submitting,
    error,
    handleChange,
    handleSelectUser,
    handleEstadoChange,
    handleSubmit,
  }
}
