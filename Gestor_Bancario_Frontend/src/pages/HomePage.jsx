import { Link } from 'react-router-dom'
import heroBackground from '../assets/HomeHeroBackground.svg'
import brandLogo from '../assets/IMGLogoNegativo.png'
import footerLogo from '../assets/IMGLogo.png'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img src={footerLogo} alt="Logo" className="h-14 w-auto" />
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#1a56db]">Gestor Bancario</p>
              <h1 className="text-xl font-bold text-[#011743]">Tu banca digital</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
            <a href="#inicio" className="transition hover:text-[#011743]">Inicio</a>
            <a href="#servicios" className="transition hover:text-[#011743]">Servicios</a>
            <a href="#testimonios" className="transition hover:text-[#011743]">Testimonios</a>
            <a href="#nosotros" className="transition hover:text-[#011743]">Nosotros</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="rounded-full bg-[#011743] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1a56db]"
            >
              Iniciar sesión
            </Link>
            <Link
              to="/auth"
              className="hidden rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-[#011743] transition hover:border-[#011743] hover:text-[#011743] lg:inline-flex"
            >
              Crear cuenta
            </Link>
          </div>
        </div>
      </header>

      <section id="inicio" className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <img
            src={heroBackground}
            alt="Fondo bancario abstracto"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/70 to-slate-50/90" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-8 py-10 lg:py-0">
            <h1 className="max-w-3xl text-4xl font-black tracking-tight text-[#011743] sm:text-5xl lg:text-6xl">
              Transforma tu vida financiera con una plataforma clara y confiable.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Administra tus cuentas, supervisa tus movimientos y realiza transacciones en un espacio diseñado para darte tranquilidad.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                to="/auth"
                className="inline-flex items-center justify-center rounded-full bg-[#011743] px-7 py-3 text-base font-semibold text-white shadow-lg shadow-[#011743]/20 transition hover:bg-[#1a56db]"
              >
                Comenzar ahora
              </Link>
              <a
                href="#servicios"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-base font-semibold text-[#011743] transition hover:border-[#011743] hover:text-[#011743]"
              >
                Ver servicios
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-10">
            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-[#011743]/10 bg-[#011743]/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-[#1a56db]">Banca con respaldo</p>
                <h2 className="mt-3 text-2xl font-bold text-[#011743]">Tu dinero en manos seguras</h2>
                <p className="mt-3 text-slate-600">Disfruta de una experiencia bancaria diseñada para ayudarte a tomar decisiones rápidas y seguras.</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-slate-700">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a56db]">Cuentas</p>
                  <p className="mt-3 text-sm leading-6">Abre y gestiona tus cuentas desde cualquier lugar.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-slate-700">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a56db]">Transferencias</p>
                  <p className="mt-3 text-sm leading-6">Envía dinero rápido con total control.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-slate-700">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a56db]">Aprobaciones</p>
                  <p className="mt-3 text-sm leading-6">Solicita servicios y recibe respuestas claras.</p>
                </div>
                <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-slate-700">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a56db]">Ayuda</p>
                  <p className="mt-3 text-sm leading-6">Soporte disponible cuando más lo necesitas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="bg-slate-100 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#1a56db]">Servicios</p>
            <h2 className="mt-4 text-3xl font-black text-[#011743] sm:text-4xl">Elige tu Cuenta Bancaria Ideal</h2>
            <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Explora y elige la Cuenta Digital que se adapta a ti según tu estilo de vida.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                title: 'Cuenta de Ahorro Alcanza',
                image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
                description: 'La cuenta con la mejor tasa del mercado, perfecta para hacer crecer tus ahorros sin comisiones adicionales ni cargos ocultos.',
              },
              {
                title: 'Cuenta Incrementa',
                image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                description: 'Con tu cuenta Incrementa, tu dinero crece automáticamente con una tasa competitiva durante 6 meses, aumentando tus intereses cada mes.',
              },
              {
                title: 'Pyme Plus',
                image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
                description: 'La cuenta ideal para empresarios, sin costos adicionales. Con beneficios exclusivos para facilitar la gestión financiera de tu negocio.',
              },
            ].map((card) => (
              <article key={card.title} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <img src={card.image} alt={card.title} className="h-52 w-full object-cover" />
                <div className="p-8">
                  <h3 className="text-2xl font-semibold text-[#011743]">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="consejos" className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#1a56db]">Consejos</p>
              <h2 className="mt-4 text-3xl font-black text-[#011743] sm:text-4xl">Consejos para proteger tu dinero</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Descubre buenas prácticas para manejar tu dinero de manera segura, confiable y responsable en el ecosistema digital.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80"
                alt="Consejos de seguridad"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-6">
              {[
                {
                  title: 'Protege tus datos',
                  text: 'No compartas credenciales y activa notificaciones para cada operación importante.',
                },
                {
                  title: 'Revisa tus movimientos',
                  text: 'Monitorea tus transacciones regularmente para detectar cualquier actividad sospechosa.',
                },
                {
                  title: 'Usa conexiones seguras',
                  text: 'Evita redes públicas al realizar operaciones bancarias y asegúrate de usar sitios cifrados.',
                },
              ].map((item) => (
                <div key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-[#f8fbff] p-6 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#011743]">{item.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="testimonios" className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(26,86,219,0.14),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(1,23,67,0.14),_transparent_30%)]" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-[#1a56db]">Testimonios</p>
            <h2 className="mt-4 text-3xl font-black text-[#011743] sm:text-4xl">Clientes que ya confían en nosotros</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              {
                name: 'Roger Valladares',
                quote: 'La banca es sencilla, rápida y clara. Ahora controlo mejor mis gastos.',
              },
              {
                name: 'Marcos Garcia',
                quote: 'Excelente la atención y la seguridad en cada operación.',
              },
              {
                name: 'Kenny Angel',
                quote: 'La mejor app bancaria que he usado, todo está muy bien organizado.',
              },
              {
                name: 'Iosef Gil',
                quote: 'La interfaz es muy intuitiva, puedo revisar mis cuentas en segundos.',
              },
              {
                name: 'Angel Reyes',
                quote: 'Las notificaciones y alertas me hacen sentir más tranquilo con mis finanzas.',
              },
              {
                name: 'Zimri Jahdai',
                quote: 'Muy buena experiencia al registrar mi negocio y gestionar pagos.',
              },
            ].map((item) => (
              <div key={item.name} className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-sm backdrop-blur-sm">
                <p className="text-lg font-semibold text-[#011743]">{item.name}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="nosotros" className="border-t border-slate-200 bg-[#f8fbff] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.7fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-[#1a56db]">Nosotros</p>
              <h2 className="text-3xl font-black text-[#011743] sm:text-4xl">Creamos una banca digital humana y fiable</h2>
              <p className="max-w-2xl text-base leading-8 text-slate-600">
                Gestionamos tu dinero con tecnologías seguras y procesos claros, para que sientas confianza y rapidez en cada operación.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { title: 'Confianza', description: 'Seguridad en cada transacción con soporte cercano.' },
                  { title: 'Claridad', description: 'Interfaz simple y procesos intuitivos.' },
                  { title: 'Disponibilidad', description: 'Accede a tus cuentas desde cualquier lugar.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-[#1a56db]/10 bg-white/90 p-5 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1a56db]">{item.title}</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#011743] via-[#1a56db] to-[#2f6cdf] p-8 text-white shadow-[0_30px_80px_rgba(1,23,67,0.18)]">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.3em] text-white/80">Nuestros pilares</p>
                <h3 className="text-3xl font-black">Atención, tecnología y confianza.</h3>
                <p className="text-base leading-7 text-white/80">
                  Una propuesta de valor que combina un servicio cercano con una plataforma ágil, diseñada para el usuario moderno.
                </p>

                <div className="space-y-4 rounded-[1.75rem] bg-white/10 p-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/80">Soporte 24/7</p>
                    <p className="mt-2 text-lg font-semibold">Respuestas prácticas cuando las necesitas.</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/80">Decisiones rápidas</p>
                    <p className="mt-2 text-lg font-semibold">Flujos claros para avanzar con confianza.</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-white/80">Seguridad</p>
                    <p className="mt-2 text-lg font-semibold">Protección constante de tus datos y operaciones.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-[#011743] px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto flex flex-col items-center justify-between gap-6 max-w-7xl sm:flex-row">
          <div className="flex flex-1 justify-start items-center">
            <img src={brandLogo} alt="Logo" className="h-24 w-auto max-h-24" />
          </div>

          <div className="flex flex-1 justify-center items-center">
            <p className="text-sm font-medium">2026 © Todos los derechos reservados Corporación Bi.</p>
          </div>

          <div className="flex flex-1 justify-end items-center gap-3">
            <a href="#" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M13.725 22V13.5h3.45l.525-3.375h-3.975V7.425c0-.975.27-1.64 1.665-1.64h2.01V2.25c-.35-.05-1.55-.15-2.95-.15-2.925 0-4.925 1.78-4.925 5.05V10.5H7.95V13.5h2.175V22h3.6z" />
              </svg>
            </a>
            <a href="#" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="12" r="3.25" fill="none" stroke="currentColor" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </a>
            <a href="#" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M10 15.5L16.5 12 10 8.5V15.5z" />
                <path d="M21 7.5c0-2.485-2.015-4.5-4.5-4.5H7.5C5.015 3 3 5.015 3 7.5v9C3 19.985 5.015 22 7.5 22h9c2.485 0 4.5-2.015 4.5-4.5v-9z" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </a>
            <a href="#" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M16.5 3H7.5C4.467 3 2 5.467 2 8.5v7C2 18.533 4.467 21 7.5 21h9c3.033 0 5.5-2.467 5.5-5.5v-7C22 5.467 19.533 3 16.5 3zM16 17.5s-1.5 1-3.5 1-3.5-1-3.5-1c-1-1-1-1.5-1-2.5 0-1 1.5-2.5 2-2.5s1.5.5 2 1 .75 1 1.5 1 1.25-.25 1.5-1 2-1 2-1 2 1.5 2 2.5c0 1-1 1.5-1 2.5z" />
              </svg>
            </a>
            <a href="#" className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

    </main>
  )
}
