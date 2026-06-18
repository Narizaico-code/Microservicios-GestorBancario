import { axiosAccount, requestFormData, API_CONFIG } from './api'

export const getPromotions = (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  )
  return axiosAccount.get('/promotions', { params: cleanParams })
}

export const getPromotionById = (id) => axiosAccount.get(`/promotions/${id}`)

export const createPromotion = (formData) =>
  requestFormData(`${API_CONFIG.bankBaseUrl}/promotions`, {
    method: 'POST',
    body: formData,
  })

export const updatePromotion = (id, formData) =>
  requestFormData(`${API_CONFIG.bankBaseUrl}/promotions/${id}`, {
    method: 'PUT',
    body: formData,
  })

export const deletePromotion = (id) => axiosAccount.delete(`/promotions/${id}`)

export const togglePromotion = (id, body) =>
  axiosAccount.patch(`/promotions/${id}/toggle`, body)

export const getPromotionStats = (id) => axiosAccount.get(`/promotions/${id}/stats`)
