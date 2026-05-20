import { API_CONFIG, requestFormData, requestJson } from './api.js'

export async function loginWithAuthService({ email, password }) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/login`, {
    method: 'POST',
    body: { email, password },
  })
}

export async function registerWithAuthService(formData) {
  // Keep function name for compatibility, but route registration through signup requests.
  return requestFormData(`${API_CONFIG.authBaseUrl}/auth/signup-request`, {
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

export async function getSignupRequestsWithAuthService(token) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/signup-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function checkSignupRequestStatus(email) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/signup-requests/status/${encodeURIComponent(email)}`)
}

export async function approveSignupRequestWithAuthService(token, requestId) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/signup-requests/${requestId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function rejectSignupRequestWithAuthService(token, requestId) {
  return requestJson(`${API_CONFIG.authBaseUrl}/auth/signup-requests/${requestId}/reject`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
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

export async function updateProfileWithAuthService(token, formData) {
  return requestFormData(`${API_CONFIG.authBaseUrl}/users/me`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
}

export async function getUpdateRequestsWithAuthService(token, status) {
  const statusQuery = status ? `?status=${encodeURIComponent(status)}` : ''
  return requestJson(`${API_CONFIG.authBaseUrl}/users/update-requests${statusQuery}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function approveUpdateRequestWithAuthService(token, requestId) {
  return requestJson(`${API_CONFIG.authBaseUrl}/users/update-requests/${requestId}/approve`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function rejectUpdateRequestWithAuthService(token, requestId) {
  return requestJson(`${API_CONFIG.authBaseUrl}/users/update-requests/${requestId}/reject`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getAllUsersWithAuthService(token) {
  return requestJson(`${API_CONFIG.authBaseUrl}/users/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}