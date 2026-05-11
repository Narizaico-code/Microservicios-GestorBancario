import axios from "axios";
import { loadSession } from "../utils/session-storage.js";

const stripTrailingSlash = (value = '') => value.replace(/\/+$/, '')

const getAuthToken = () => {
  const session = loadSession()
  return session?.token || null
}

export const API_CONFIG = {
  authBaseUrl: stripTrailingSlash(
    import.meta.env.VITE_AUTH_API_URL || 'http://localhost:4000/api/v1'
  ),
  bankBaseUrl: stripTrailingSlash(
    import.meta.env.VITE_BANK_API_URL || 'http://localhost:3006/gestionBancaria/api/v1'
  ),
  bankHealthUrl: stripTrailingSlash(
    import.meta.env.VITE_BANK_HEALTH_URL || 'http://localhost:3006/health'
  ),
}

export const axiosAccount = axios.create({
  baseURL: import.meta.env.VITE_ACCOUNT_URL || API_CONFIG.bankBaseUrl,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const axiosTransaction = axios.create({
  baseURL: import.meta.env.VITE_TRANSACTION_URL || API_CONFIG.bankBaseUrl,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

for (const instance of [axiosAccount, axiosTransaction]) {
  instance.interceptors.request.use((config) => {
    const token = getAuthToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      config.headers['x-token'] = token
    }

    return config
  })
}

export class ApiError extends Error {
	constructor(message, status, payload) {
		super(message)
		this.name = 'ApiError'
		this.status = status
		this.payload = payload
	}
}

export async function requestJson(url, options = {}) {
	const { body, headers, method = 'GET' } = options
	const token = getAuthToken()

	const response = await fetch(url, {
		method,
		headers: {
			Accept: 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...(body ? { 'Content-Type': 'application/json' } : {}),
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	})

	const rawText = await response.text()
	const payload = rawText ? JSON.parse(rawText) : null

	if (!response.ok) {
		const message = payload?.message || payload?.error || 'Request failed'
		throw new ApiError(message, response.status, payload)
	}

	return payload
}

export async function requestFormData(url, options = {}) {
	const { body, headers, method = 'POST' } = options
	const token = getAuthToken()

	const formData = body instanceof FormData ? body : new FormData()

	if (!(body instanceof FormData) && body && typeof body === 'object') {
		for (const [key, value] of Object.entries(body)) {
			if (value !== undefined && value !== null) {
				formData.append(key, value)
			}
		}
	}

	const response = await fetch(url, {
		method,
		headers: {
			Accept: 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...headers,
		},
		body: formData,
	})

	const rawText = await response.text()
	const payload = rawText ? JSON.parse(rawText) : null

	if (!response.ok) {
		const message = payload?.message || payload?.error || 'Request failed'
		throw new ApiError(message, response.status, payload)
	}

	return payload
}

export { axiosAccount as default }
