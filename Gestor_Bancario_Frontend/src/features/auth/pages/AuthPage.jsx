import UnifiedAuthForm from '../components/UnifiedAuthForm.jsx'
import cerditoFondoAzul from '../../../assets/CerditoFondoAzul.png'

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-6 text-[#011743] lg:px-8 lg:py-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-[1600px] overflow-hidden rounded-[2rem] border border-[#011743]/15 bg-white shadow-[0_30px_80px_rgba(1,23,67,0.14)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="flex flex-col justify-between bg-[#011743] px-7 py-8 text-white lg:px-10 lg:py-12">
          <div>
            <h1 className="mt-8 max-w-xl text-5xl font-black leading-[1.02] tracking-tight lg:text-7xl">
              Tu portal bancario seguro.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-9 text-white/88 lg:text-[1.55rem]">
              Inicia sesión, crea una cuenta, recupera tu contraseña o reenvía tu email de verificación en un único lugar.
            </p>
          </div>

          <div className="flex justify-center py-6 lg:py-10">
            <img
              src={cerditoFondoAzul}
              alt="Ilustración de ahorro bancario"
              className="w-full max-w-[340px] object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)] lg:max-w-[430px]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/35 bg-white/[0.03] px-5 py-5">
              <p className="text-3xl font-bold">Acceso seguro</p>
              <p className="mt-2 text-sm text-white/75">Ingresa a tu banca en línea de forma protegida.</p>
            </div>
            <div className="rounded-3xl border border-white/35 bg-white/[0.03] px-5 py-5">
              <p className="text-3xl font-bold">Apertura de cuenta</p>
              <p className="mt-2 text-sm text-white/75">Crea tu perfil y comienza a gestionar tus finanzas.</p>
            </div>
            <div className="rounded-3xl border border-white/35 bg-white/[0.03] px-5 py-5">
              <p className="text-3xl font-bold">Recupera tu acceso</p>
              <p className="mt-2 text-sm text-white/75">Restablece tu contraseña en pocos pasos.</p>
            </div>
            <div className="rounded-3xl border border-white/35 bg-white/[0.03] px-5 py-5">
              <p className="text-3xl font-bold">Verifica tu correo</p>
              <p className="mt-2 text-sm text-white/75">Activa tu cuenta para operar con tranquilidad.</p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white px-6 py-8 lg:px-10 lg:py-12">
          <UnifiedAuthForm />
        </section>
      </div>
    </main>
  )
}