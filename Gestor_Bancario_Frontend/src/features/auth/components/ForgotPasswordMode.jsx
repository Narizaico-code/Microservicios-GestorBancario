import { Avatar, Heading, Card, InputField, ErrorBanner, SuccessBanner, PrimaryButton, LinkButton } from './AuthPrimitives.jsx'
import { MODE } from '../hooks/useUnifiedAuth.js'

export const ForgotPasswordMode = ({ auth }) => {
  const { form, handleChange, error, success, loading, setMode, handleSubmitForgotPassword } = auth

  return (
    <form onSubmit={handleSubmitForgotPassword} className="flex flex-col gap-4">
      <Avatar />
      <Heading title="Recuperar contraseña" sub="Recupera acceso a tu cuenta" />

      <Card>
        <div className="mb-4 rounded-xl border border-white/7 bg-white/3 px-4 py-3 text-[13px] text-white/40">
          Ingresa tu email y te enviaremos un enlace para recuperar tu contraseña.
        </div>
        <InputField label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="tu@email.com" />
        <ErrorBanner error={error} />
        <SuccessBanner success={success} />
        <PrimaryButton disabled={loading}>{loading ? 'Enviando...' : 'Enviar enlace'}</PrimaryButton>
      </Card>

      <p className="text-center">
        <LinkButton muted onClick={() => setMode(MODE.LOGIN)}>← Volver al inicio de sesión</LinkButton>
      </p>
    </form>
  )
}
