import { axiosAccount, requestFormData, API_CONFIG } from './api'

export const getServices = (params = {}) => axiosAccount.get('/services', { params })

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
