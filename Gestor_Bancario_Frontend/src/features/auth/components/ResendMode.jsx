import { Avatar, Heading, Card, InputField, ErrorBanner, SuccessBanner, PrimaryButton, LinkButton } from './AuthPrimitives.jsx'
import { MODE } from '../hooks/useUnifiedAuth.js'

export const ResendMode = ({ auth }) => {
  const { form, handleChange, error, success, loading, setMode, handleSubmitResend } = auth

  return (
    <form onSubmit={handleSubmitResend} className="flex flex-col gap-4">
      <Avatar />
      <Heading title="Reenviar verificación" sub="Verifica tu email nuevamente" />

      <Card>
        <div className="mb-4 rounded-xl border border-white/7 bg-white/3 px-4 py-3 text-[13px] text-white/40">
          Si no recibiste el email de verificación, ingresa tu email y te lo reenviamos.
        </div>
        <InputField label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="tu@email.com" />
        <ErrorBanner error={error} />
        <SuccessBanner success={success} />
        <PrimaryButton disabled={loading}>{loading ? 'Enviando...' : 'Reenviar verificación'}</PrimaryButton>
      </Card>

      <p className="text-center">
        <LinkButton muted onClick={() => setMode(MODE.REGISTER)}>← Volver a crear cuenta</LinkButton>
      </p>
    </form>
  )
}
