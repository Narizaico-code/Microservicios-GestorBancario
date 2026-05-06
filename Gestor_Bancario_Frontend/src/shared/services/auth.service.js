import { API_CONFIG } from '../config/api.js'
import { requestFormData, requestJson } from './api-client.js'

export async function loginWithAuthService({ email, password }) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/login`, {
    method: 'POST',
    body: { email, password },
  })
}

export async function registerWithAuthService(formData) {
  return requestFormData(`${API_CONFIG.authBaseUrl}/auth/register`, {
    method: 'POST',
    body: formData,
  })
}

export async function submitSignupRequestWithAuthService(formData) {
  return requestFormData(`${API_CONFIG.authBaseUrl}/auth/signup-request`, {
    method: 'POST',
    body: formData,
  })
}

export async function verifyEmailWithAuthService(token) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/verify-email`, {
    method: 'POST',
    body: { token },
  })
}

export async function verifyEmailLinkWithAuthService(token) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/verify-email?token=${encodeURIComponent(token)}`)
}

export async function resendVerificationWithAuthService(email) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/resend-verification`, {
    method: 'POST',
    body: { email },
  })
}

export async function forgotPasswordWithAuthService(email) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/forgot-password`, {
    method: 'POST',
    body: { email },
  })
}

export async function resetPasswordWithAuthService(token, newPassword) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/reset-password`, {
    method: 'POST',
    body: { token, newPassword },
  })
}

export async function getProfileWithAuthService(token) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getProfileByIdWithAuthService(token, userId) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/profile/by-id`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: { userId },
  })
}