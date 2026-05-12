import UnifiedAuthForm from '../components/UnifiedAuthForm.jsx'
import cerditoFondoAzul from '../../../assets/CerditoFondoAzul.png'

export default function AuthPage() {
  return (
    <main className="min-h-screen bg-white px-3 py-3 text-[#011743] sm:px-5 sm:py-5 lg:px-8 lg:py-7">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] w-full max-w-[1250px] gap-5 overflow-hidden rounded-[1.6rem] border border-[#011743]/10 bg-white shadow-[0_18px_45px_rgba(1,23,67,0.10)] lg:min-h-[92vh] lg:grid-cols-[1fr_0.95fr] lg:gap-0">
        
        {/* Panel izquierdo */}
  <section className="order-2 flex flex-col justify-between bg-[#011743] px-5 py-5 text-white sm:px-6 sm:py-6 lg:order-1 lg:px-7 lg:py-7">
          
          <div>
            <h1 className="mt-4 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Tu portal bancario seguro.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-base sm:leading-7 lg:mt-5 lg:text-xl">
              Inicia sesión, crea una cuenta, recupera tu contraseña o reenvía tu email de verificación en un único lugar.
            </p>
          </div>

          {/* Imagen */}
          <div className="flex justify-center py-4 lg:py-4">
            <img
              src={cerditoFondoAzul}
              alt="Ilustración de ahorro bancario"
              className="w-full max-w-[170px] object-contain sm:max-w-[210px] lg:max-w-[240px]"
            />
          </div>

          {/* Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-4">
              <p className="text-lg font-bold sm:text-xl">Acceso seguro</p>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                Ingresa a tu banca en línea.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-4">
              <p className="text-lg font-bold sm:text-xl">Apertura de cuenta</p>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                Crea tu perfil rápidamente.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-4">
              <p className="text-lg font-bold sm:text-xl">Recupera acceso</p>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                Restablece tu contraseña.
              </p>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/[0.04] px-4 py-4">
              <p className="text-lg font-bold sm:text-xl">Verifica correo</p>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">
                Activa tu cuenta fácilmente.
              </p>
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section className="order-1 flex items-center justify-center bg-white px-4 py-5 sm:px-5 lg:order-2 lg:px-7 lg:py-7">
          <div className="w-full max-w-[440px] sm:max-w-[480px] lg:max-w-[520px]">
            <UnifiedAuthForm />
          </div>
        </section>
      </div>
    </main>
  )
}