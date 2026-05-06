const stripTrailingSlash = (value = '') => value.replace(/\/+$/, '')

export const API_CONFIG = {
  authBaseUrl: stripTrailingSlash(
    import.meta.env.VITE_AUTH_API_URL || 'http://localhost:3006/api/v1'
  ),
  bankBaseUrl: stripTrailingSlash(
    import.meta.env.VITE_BANK_API_URL || 'http://localhost:3005/gestionBancaria/api/v1'
  ),
  bankHealthUrl: stripTrailingSlash(
    import.meta.env.VITE_BANK_HEALTH_URL || 'http://localhost:3005/health'
  ),
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

	const response = await fetch(url, {
		method,
		headers: {
			Accept: 'application/json',
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