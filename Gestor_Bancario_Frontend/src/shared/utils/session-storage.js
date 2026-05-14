const SESSION_KEY = 'gestor-bancario-session'

export const loadSession = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(SESSION_KEY)

  if (!rawSession) {
    return null
  }

  try {
    return JSON.parse(rawSession)
  } catch {
    return null
  }
}

export const saveSession = (session) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export const clearSession = () => {
  window.localStorage.removeItem(SESSION_KEY)
}