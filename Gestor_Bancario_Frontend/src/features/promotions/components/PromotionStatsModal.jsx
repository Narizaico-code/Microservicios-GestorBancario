import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../../shared/components/ui/Modal.jsx'
import { getPromotionStats } from '../../../shared/api/promotions.js'

const statItems = [
  { key: 'totalUses', label: 'Usos totales' },
  { key: 'uniqueUsers', label: 'Usuarios unicos' },
  { key: 'budgetUsed', label: 'Budget usado' },
  { key: 'remainingBudget', label: 'Budget restante' },
  { key: 'daysRemaining', label: 'Dias restantes' },
  { key: 'usesRemaining', label: 'Usos restantes' },
]

export const PromotionStatsModal = ({ promotion, onClose }) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!promotion) return

    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await getPromotionStats(promotion._id || promotion.id)
        setStats(response?.data?.data || response?.data || null)
      } catch {
        toast.error('No se pudieron cargar las estadisticas')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [promotion])

  if (!promotion) return null

  return (
    <Modal title="Estadisticas" onClose={onClose} maxWidth="max-w-xl">
      {loading ? (
        <p className="text-sm text-[var(--theme-text-muted)]">Cargando...</p>
      ) : null}
      {!loading && stats ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {statItems.map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--theme-text-muted)]">
                {item.label}
              </p>
              <p className="mt-2 text-lg font-semibold text-[var(--theme-text)]">
                {stats[item.key] ?? 'N/D'}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </Modal>
  )
}
