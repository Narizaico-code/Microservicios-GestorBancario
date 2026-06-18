import { useCallback, useEffect, useState } from 'react'

/**
 * Centraliza el patrón fetch-en-montaje.
 * Ejecuta `asyncFn` al montar (y cuando cambie su identidad) y expone { data, loading, error, setData, refetch }.
 * El caller DEBE pasar una `asyncFn` estable (envuelta en useCallback con sus deps).
 *
 * @param {() => Promise<any>} asyncFn  Función async estable.
 * @param {{ enabled?: boolean, initialData?: any }} [options]
 *   - enabled: si es false no ejecuta y deja loading=false (útil para gates por token).
 *   - initialData: valor inicial de `data`.
 */
export const useAsync = (asyncFn, { enabled = true, initialData } = {}) => {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState('')

  const refetch = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const result = await asyncFn()
      setData(result)
      return result
    } catch (err) {
      setError(err?.message || 'Error inesperado')
    } finally {
      setLoading(false)
    }
  }, [asyncFn])

  /* eslint-disable react-hooks/set-state-in-effect -- useAsync centraliza el fetch-on-mount; setLoading/setError iniciales son intencionales */
  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    setError('')
    asyncFn()
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Error inesperado')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [enabled, asyncFn])
  /* eslint-enable react-hooks/set-state-in-effect */

  return { data, loading, error, setData, refetch }
}
