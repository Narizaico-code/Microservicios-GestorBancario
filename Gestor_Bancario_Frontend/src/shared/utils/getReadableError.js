// Convierte un error de la API (con payload.errors[]) en un mensaje legible.
export const getReadableError = (err, fallback) => {
  const apiErrors = err?.payload?.errors
  if (Array.isArray(apiErrors) && apiErrors.length > 0) {
    return apiErrors.map((i) => `• ${i?.field || 'campo'}: ${i?.message || 'valor inválido'}`).join('\n')
  }
  return err?.message || fallback
}
