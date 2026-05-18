import { useState } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '../../../shared/components/ui/Modal.jsx'
import { togglePromotion } from '../../../shared/api/promotions.js'

const actions = [
  { value: 'ACTIVATE', label: 'Activar' },
  { value: 'PAUSE', label: 'Pausar' },
  { value: 'CANCEL', label: 'Cancelar' },
]

export const PromotionToggleModal = ({ promotion, onClose, onSuccess }) => {
  const [action, setAction] = useState('ACTIVATE')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  if (!promotion) return null

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (action === 'CANCEL' && !reason.trim()) {
      toast.error('La razon es obligatoria para cancelar')
      return
    }

    try {
      setLoading(true)
      await togglePromotion(promotion._id || promotion.id, {
        action,
        reason: action === 'CANCEL' ? reason.trim() : undefined,
      })
      toast.success('Estado actualizado')
      onSuccess?.()
      onClose?.()
    } catch (error) {
      const message = error?.response?.data?.message || 'No se pudo cambiar el estado'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="Cambiar estado" onClose={onClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-2">
          {actions.map((item) => (
            <label key={item.value} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <input
                type="radio"
                name="action"
                value={item.value}
                checked={action === item.value}
                onChange={() => setAction(item.value)}
              />
              <span className="text-[var(--theme-text)]">{item.label}</span>
            </label>
          ))}
        </div>

        {action === 'CANCEL' ? (
          <label className="grid gap-2 text-sm">
            <span className="text-[var(--theme-text-muted)]">Razon</span>
            <textarea
              rows="3"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[var(--theme-text)]"
            />
          </label>
        ) : null}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-sm text-[var(--theme-text-muted)]"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-[#1a56db] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Guardando...' : 'Confirmar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
