import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createService, updateService } from '../../../shared/api/services.js'

const emptyForm = {
  name: '',
  description: '',
  category: '',
  type: 'SERVICE',
  price: '',
  currency: 'GTQ',
  status: 'DRAFT',
  active: true,
  validFrom: '',
  validTo: '',
  minBalance: '',
  requiresVerifiedEmail: true,
  maxUsesPerUser: '',
  totalUsesLimit: '',
  targetRoles: ['USER_ROLE'],
  tags: '',
  terms: '',
  internalNote: '',
}

const emptyDiscount = {
  type: 'PERCENT',
  value: '',
  startAt: '',
  endAt: '',
  minAmount: '',
  maxUses: '',
  terms: '',
}

export const useServiceForm = ({ service, onSuccess, onClose }) => {
  const isEdit = Boolean(service)
  const [form, setForm] = useState(emptyForm)
  const [discount, setDiscount] = useState(emptyDiscount)
  const [showDiscount, setShowDiscount] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!service) {
      setForm(emptyForm)
      setDiscount(emptyDiscount)
      setShowDiscount(false)
      setImageFile(null)
      return
    }

    setForm({
      name: service.name || '',
      description: service.description || '',
      category: service.category || '',
      type: service.type || 'SERVICE',
      price: service.price ?? '',
      currency: service.currency || 'GTQ',
      status: service.status || 'DRAFT',
      active: service.active ?? true,
      validFrom: service.validFrom ? service.validFrom.slice(0, 10) : '',
      validTo: service.validTo ? service.validTo.slice(0, 10) : '',
      minBalance: service.minBalance ?? '',
      requiresVerifiedEmail: service.requiresVerifiedEmail ?? true,
      maxUsesPerUser: service.maxUsesPerUser ?? '',
      totalUsesLimit: service.totalUsesLimit ?? '',
      targetRoles: service.targetRoles?.length ? service.targetRoles : ['USER_ROLE'],
      tags: Array.isArray(service.tags) ? service.tags.join(', ') : '',
      terms: service.terms || '',
      internalNote: service.internalNote || '',
    })

    if (service.discount) {
      setDiscount({
        type: service.discount.type || 'PERCENT',
        value: service.discount.value ?? '',
        startAt: service.discount.startAt ? service.discount.startAt.slice(0, 10) : '',
        endAt: service.discount.endAt ? service.discount.endAt.slice(0, 10) : '',
        minAmount: service.discount.minAmount ?? '',
        maxUses: service.discount.maxUses ?? '',
        terms: service.discount.terms || '',
      })
      setShowDiscount(true)
    } else {
      setDiscount(emptyDiscount)
      setShowDiscount(false)
    }
  }, [service])

  const roleOptions = useMemo(
    () => [
      { value: 'USER_ROLE', label: 'Cliente' },
      { value: 'EMPLOYEE_ROLE', label: 'Empleado' },
      { value: 'ADMIN_ROLE', label: 'Admin' },
    ],
    []
  )

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleRoleToggle = (role) => {
    setForm((current) => {
      const exists = current.targetRoles.includes(role)
      const nextRoles = exists
        ? current.targetRoles.filter((item) => item !== role)
        : [...current.targetRoles, role]

      return { ...current, targetRoles: nextRoles.length ? nextRoles : ['USER_ROLE'] }
    })
  }

  const handleDiscountChange = (event) => {
    const { name, value } = event.target
    setDiscount((current) => ({ ...current, [name]: value }))
  }

  const buildTags = () =>
    form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

  const buildDiscountPayload = () => {
    if (!showDiscount || !discount.value) return null

    const payload = {
      type: discount.type,
      value: Number(discount.value),
    }

    if (discount.startAt) payload.startAt = discount.startAt
    if (discount.endAt) payload.endAt = discount.endAt
    if (discount.minAmount) payload.minAmount = Number(discount.minAmount)
    if (discount.maxUses) payload.maxUses = Number(discount.maxUses)
    if (discount.terms) payload.terms = discount.terms

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim() || !form.description.trim() || !form.price) {
      toast.error('Nombre, descripcion y precio son obligatorios')
      return
    }

    if (form.type === 'SERVICE' && !form.terms.trim()) {
      toast.error('Los terminos son obligatorios para servicios')
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()

      formData.append('name', form.name.trim())
      formData.append('description', form.description.trim())
      formData.append('type', form.type)
      formData.append('price', String(form.price))

      if (form.category) formData.append('category', form.category.trim())
      if (form.currency) formData.append('currency', form.currency)
      if (form.status) formData.append('status', form.status)
      if (form.validFrom) formData.append('validFrom', form.validFrom)
      if (form.validTo) formData.append('validTo', form.validTo)
      if (form.minBalance) formData.append('minBalance', String(form.minBalance))
      if (form.maxUsesPerUser) formData.append('maxUsesPerUser', String(form.maxUsesPerUser))
      if (form.totalUsesLimit) formData.append('totalUsesLimit', String(form.totalUsesLimit))
      if (form.terms) formData.append('terms', form.terms.trim())
      if (form.internalNote) formData.append('internalNote', form.internalNote.trim())

      formData.append('active', String(Boolean(form.active)))
      formData.append('requiresVerifiedEmail', String(Boolean(form.requiresVerifiedEmail)))

      const tags = buildTags()
      if (tags.length) formData.append('tags', JSON.stringify(tags))

      if (form.targetRoles?.length) {
        formData.append('targetRoles', JSON.stringify(form.targetRoles))
      }

      const discountPayload = buildDiscountPayload()
      if (discountPayload) {
        formData.append('discount', JSON.stringify(discountPayload))
      }

      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = isEdit
        ? await updateService(service._id || service.id, formData)
        : await createService(formData)

      onSuccess?.(response)
      toast.success(isEdit ? 'Servicio actualizado' : 'Servicio creado')
      onClose?.()
    } catch (error) {
      const validationMessage = (() => {
        const errors = error?.payload?.errors
        if (!Array.isArray(errors) || errors.length === 0) return null

        const messages = errors
          .map((item) => {
            if (!item) return null
            if (typeof item === 'string') return item

            const field = item.field || item.param || item.path
            const msg = item.message || item.msg

            if (field && msg) return `${field}: ${msg}`
            return msg || field || null
          })
          .filter(Boolean)

        return messages.length ? messages.join(' | ') : null
      })()

      const message =
        validationMessage ||
        error?.payload?.message ||
        error?.message ||
        'No fue posible guardar el servicio'

      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    setForm,
    discount,
    setDiscount,
    showDiscount,
    setShowDiscount,
    imageFile,
    setImageFile,
    loading,
    roleOptions,
    isEdit,
    handleChange,
    handleRoleToggle,
    handleDiscountChange,
    handleSubmit,
  }
}