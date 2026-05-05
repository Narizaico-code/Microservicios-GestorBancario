import { API_CONFIG } from '../config/api.js'
import { requestJson } from './api-client.js'

export async function getBankHealth() {
  return requestJson(API_CONFIG.bankHealthUrl)
}

export async function getRecentAccounts(token) {
  return requestJson(`${API_CONFIG.bankBaseUrl}/account/get?misCuentas=true&limit=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getAllAccounts(token) {
  return requestJson(`${API_CONFIG.bankBaseUrl}/account/get?limit=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}