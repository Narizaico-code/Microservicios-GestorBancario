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