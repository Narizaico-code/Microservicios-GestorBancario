import { createContext, createElement, useContext, useMemo, useState } from 'react'
import { clearSession, loadSession, saveSession } from '../../../shared/utils/session-storage.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession())

  const value = useMemo(
    () => ({
      session,
      isAuthenticated: Boolean(session?.token),
      login(nextSession) {
        saveSession(nextSession)
        setSession(nextSession)
      },
      logout() {
        clearSession()
        setSession(null)
      },
    }),
    [session]
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuthStore() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthStore must be used within AuthProvider')
  }

  return context
}