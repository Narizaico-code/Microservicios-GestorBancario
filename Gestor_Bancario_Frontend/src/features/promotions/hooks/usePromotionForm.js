import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { createPromotion, updatePromotion } from '../../../shared/api/promotions.js'
import { getServices } from '../../../shared/api/services.js'

const emptyForm = {
  name: '',
  description: '',
  terms: '',
  type: 'GENERAL',
  status: 'DRAFT',
  active: false,
  validFrom: '',
  validTo: '',
  targetSegment: 'ALL',
  targetRoles: ['USER_ROLE'],
  maxUsesGlobal: '',
  maxUsesPerUser: '',
  budget: '',
  priority: '',
  stackable: false,
  tags: '',
  internalNote: '',
  conditions: '',
  applicableServices: [],
}

export const usePromotionForm = ({ promotion, onSuccess, onClose }) => {
  const isEdit = Boolean(promotion)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [services, setServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingServices(true)
        const response = await getServices({ limit: 100 })
        setServices(response?.data?.data || [])
      } catch {
        toast.error('No se pudo cargar servicios')
      } finally {
        setLoadingServices(false)
      }
    }
    loadServices()
  }, [])

  useEffect(() => {
    if (!promotion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- seed/reset del form según la promo seleccionada
      setForm(emptyForm)
      setImageFile(null)
      return
    }

    setForm({
      name: promotion.name || '',
      description: promotion.description || '',
      terms: promotion.terms || '',
      type: promotion.type || 'GENERAL',
      status: promotion.status || 'DRAFT',
      active: promotion.active ?? false,
      validFrom: promotion.validFrom ? promotion.validFrom.slice(0, 10) : '',
      validTo: promotion.validTo ? promotion.validTo.slice(0, 10) : '',
      targetSegment: promotion.targetSegment || 'ALL',
      targetRoles: promotion.targetRoles?.length ? promotion.targetRoles : ['USER_ROLE'],
      maxUsesGlobal: promotion.maxUsesGlobal ?? '',
      maxUsesPerUser: promotion.maxUsesPerUser ?? '',
      budget: promotion.budget ?? '',
      priority: promotion.priority ?? '',
      stackable: promotion.stackable ?? false,
      tags: Array.isArray(promotion.tags) ? promotion.tags.join(', ') : '',
      internalNote: promotion.internalNote || '',
      conditions: promotion.conditions ? JSON.stringify(promotion.conditions, null, 2) : '',
      applicableServices: Array.isArray(promotion.applicableServices) ? promotion.applicableServices : [],
    })
  }, [promotion])

  const roleOptions = useMemo(
    () => [
      { value: 'USER_ROLE', label: 'Cliente' },
      { value: 'EMPLOYEE_ROLE', label: 'Empleado' },
    ],
    []
  )

  const segmentOptions = useMemo(() => ['ALL', 'VIP', 'NEW', 'INACTIVE', 'PREMIUM'], [])

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

  const handleServiceToggle = (serviceId) => {
    setForm((current) => {
      const exists = current.applicableServices.includes(serviceId)
      const next = exists
        ? current.applicableServices.filter((item) => item !== serviceId)
        : [...current.applicableServices, serviceId]

      return { ...current, applicableServices: next }
    })
  }

  const buildTags = () =>
    form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

  const parseConditions = () => {
    if (!form.conditions.trim()) return null
    try {
      return JSON.parse(form.conditions)
    } catch {
      toast.error('El JSON de condiciones no es valido')
      return 'invalid'
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      toast.error('El nombre es obligatorio')
      return
    }

    const conditionsPayload = parseConditions()
    if (conditionsPayload === 'invalid') return

    try {
      setLoading(true)
      const formData = new FormData()

      formData.append('name', form.name.trim())
      if (form.description) formData.append('description', form.description.trim())
      if (form.terms) formData.append('terms', form.terms.trim())
      if (form.type) formData.append('type', form.type)
      if (form.status) formData.append('status', form.status)
      if (form.validFrom) formData.append('validFrom', form.validFrom)
      if (form.validTo) formData.append('validTo', form.validTo)
      if (form.targetSegment) formData.append('targetSegment', form.targetSegment)

      formData.append('active', String(Boolean(form.active)))
      formData.append('stackable', String(Boolean(form.stackable)))

      if (form.maxUsesGlobal) formData.append('maxUsesGlobal', String(form.maxUsesGlobal))
      if (form.maxUsesPerUser) formData.append('maxUsesPerUser', String(form.maxUsesPerUser))
      if (form.budget) formData.append('budget', String(form.budget))
      if (form.priority) formData.append('priority', String(form.priority))
      if (form.internalNote) formData.append('internalNote', form.internalNote.trim())

      const tags = buildTags()
      if (tags.length) formData.append('tags', JSON.stringify(tags))

      if (form.targetRoles?.length) {
        formData.append('targetRoles', JSON.stringify(form.targetRoles))
      }

      if (form.applicableServices?.length) {
        formData.append('applicableServices', JSON.stringify(form.applicableServices))
      }

      if (conditionsPayload) {
        formData.append('conditions', JSON.stringify(conditionsPayload))
      }

      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = isEdit
        ? await updatePromotion(promotion._id || promotion.id, formData)
        : await createPromotion(formData)

      toast.success(isEdit ? 'Promocion actualizada' : 'Promocion creada')
      onSuccess?.(response)
      onClose?.()
    } catch (error) {
      const message = error?.payload?.message || error?.message || 'No fue posible guardar la promocion'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return {
    form,
    setForm,
    imageFile,
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
  }
}
