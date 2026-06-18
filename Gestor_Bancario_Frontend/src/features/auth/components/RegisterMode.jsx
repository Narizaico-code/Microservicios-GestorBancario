import { Avatar, Heading, Card, InputField, ErrorBanner, SuccessBanner, PrimaryButton, LinkButton } from './AuthPrimitives.jsx'
import { MODE } from '../hooks/useUnifiedAuth.js'

export const RegisterMode = ({ auth, dynamic }) => {
  const { form, setForm, handleChange, error, success, loading, registeredEmail, setMode, handleSubmitRegister } = auth

  return (
    <form onSubmit={handleSubmitRegister} className="flex flex-col gap-4">
      <Avatar dynamic={dynamic} />
      <Heading title="Crear cuenta" sub="Únete a nuestro sistema bancario" dynamic={dynamic} />

      <Card dynamic={dynamic}>
        <div className="flex flex-col gap-4">
          <InputField label="Nombre" name="name" value={form.name} onChange={handleChange} required placeholder="Tu nombre completo" dynamic={dynamic} />
          <InputField label="Correo electrónico" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="tu@email.com" dynamic={dynamic} />
          <InputField label="Teléfono" name="phone" type="tel" value={form.phone} onChange={handleChange} required pattern="\d{8}" placeholder="12345678" dynamic={dynamic} />
          <InputField label="DPI" name="dpi" type="text" value={form.dpi} onChange={handleChange} required pattern="\d{13}" placeholder="13 dígitos" dynamic={dynamic} />
          <InputField label="Fecha de Nacimiento" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={handleChange} required dynamic={dynamic} />
          <InputField label="Ingresos Mensuales (GTQ)" name="ingresosMensuales" type="number" value={form.ingresosMensuales} onChange={handleChange} required placeholder="Ej. 5000.00" dynamic={dynamic} />
          <InputField label="Contraseña" name="password" type="password" value={form.password} onChange={handleChange} required minLength="8" placeholder="Mínimo 8 caracteres" dynamic={dynamic} />
          <InputField label="Foto de perfil (opcional)" name="profilePicture" type="file" accept="image/*" onChange={handleChange} dynamic={dynamic} />
        </div>
        <ErrorBanner error={error} />
        <SuccessBanner success={success} />
        <PrimaryButton disabled={loading} dynamic={dynamic}>{loading ? 'Creando cuenta...' : 'Crear cuenta'}</PrimaryButton>
      </Card>

      <div className="flex items-center justify-center gap-4 text-[13px]">
        <LinkButton
          muted
          onClick={() => {
            setForm((c) => ({ ...c, email: c.email || registeredEmail }))
            setMode(MODE.RESEND_VERIFICATION)
          }}
          dynamic={dynamic}
        >
          ¿No te llegó el correo?
        </LinkButton>
        <span className={dynamic ? 'text-[color:var(--theme-text-muted)]' : 'text-white/15'}>|</span>
        <LinkButton onClick={() => setMode(MODE.LOGIN)} dynamic={dynamic}>
          Iniciar sesión
        </LinkButton>
      </div>
    </form>
  )
}
