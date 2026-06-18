import { axiosAccount, requestFormData, API_CONFIG } from './api'

export const getServices = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  )
  return axiosAccount.get('/services', { params: cleanParams })
}

export const getServiceById = (id) => axiosAccount.get(`/services/${id}`)

export const createService = (formData) =>
  requestFormData(`${API_CONFIG.bankBaseUrl}/services`, {
    method: 'POST',
    body: formData,
  })

export const updateService = (id, formData) =>
  requestFormData(`${API_CONFIG.bankBaseUrl}/services/${id}`, {
    method: 'PUT',
    body: formData,
  })

export const deleteService = (id) => axiosAccount.delete(`/services/${id}`)
