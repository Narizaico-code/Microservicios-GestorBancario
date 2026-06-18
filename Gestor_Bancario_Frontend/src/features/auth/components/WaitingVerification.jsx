import { Avatar, Heading, Card, PrimaryButton, LinkButton } from './AuthPrimitives.jsx'
import { MODE } from '../hooks/useUnifiedAuth.js'

export const WaitingVerification = ({ auth }) => {
  const { form, error, success, loading, registeredEmail, requestStatus, setMode, handleResendFromWaiting } = auth
  const isApproved = requestStatus === 'APPROVED' || requestStatus === 'VERIFIED'
  const emailToUse = registeredEmail || form.email || 'Sin email registrado'

  return (
    <div className="flex flex-col gap-4">
      <Avatar />
      <Heading title="Activación en curso" sub="Sigue el estado de tu cuenta" />

      <Card>
        <div className="mb-4 rounded-xl border border-white/7 bg-white/3 px-4 py-3 text-[13px] text-white/50">
          <p className="mb-1 font-bold text-white">Solicitud enviada correctamente</p>
          <p className="break-words">
            Cuenta: <span className="font-semibold text-white">{emailToUse}</span>
          </p>
        </div>

        <div className="mb-4 flex flex-col gap-3">
          {/* Paso 1: Admin */}
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
              isApproved ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/10 bg-white/5'
            }`}
          >
            {isApproved ? (
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-[3px] border-white/20 border-t-white" />
            )}
            <div className="flex flex-col">
              <p className={`text-[13px] font-bold ${isApproved ? 'text-emerald-400' : 'text-white'}`}>
                Aprobación de Administrador
              </p>
              <p className={`text-[11px] ${isApproved ? 'text-emerald-400/70' : 'text-white/40'}`}>
                {isApproved ? 'Solicitud aprobada' : 'Tu solicitud está siendo revisada...'}
              </p>
            </div>
          </div>

          {/* Paso 2: Email */}
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
              !isApproved ? 'border-white/5 bg-transparent opacity-50' : 'border-white/10 bg-white/5'
            }`}
          >
            <span
              className={`h-5 w-5 shrink-0 rounded-full border-[3px] ${
                isApproved ? 'animate-spin border-white/20 border-t-white' : 'border-white/10'
              }`}
            />
            <div className="flex flex-col">
              <p className={`text-[13px] font-bold ${isApproved ? 'text-white' : 'text-white/50'}`}>
                Verificación de Correo
              </p>
              <p className={`text-[11px] ${isApproved ? 'text-white/70' : 'text-white/30'}`}>
                {isApproved
                  ? 'Se ha enviado un enlace a tu correo. Revisa también la carpeta de Spam.'
                  : 'Esperando aprobación previa...'}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 whitespace-pre-line rounded-xl border border-red-500/25 bg-red-500/8 px-4 py-3 text-[13px] text-red-300">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-[13px] text-emerald-400">
            {success}
          </div>
        )}

        {isApproved && (
          <PrimaryButton type="button" onClick={handleResendFromWaiting} disabled={loading}>
            {loading ? 'Reenviando...' : 'Reenviar enlace de verificación'}
          </PrimaryButton>
        )}
      </Card>

      <div className="flex flex-col items-center gap-2">
        <LinkButton muted onClick={() => setMode(MODE.LOGIN)}>
          Ya verifiqué mi correo, iniciar sesión
        </LinkButton>
      </div>
    </div>
  )
}
