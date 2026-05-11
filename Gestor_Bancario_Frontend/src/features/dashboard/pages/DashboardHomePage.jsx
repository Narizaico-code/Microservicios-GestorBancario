export const DashboardHomePage = () => {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-[#011743] p-6 text-white shadow-md">
        <h1 className="text-3xl font-extrabold">Inicio</h1>
        <p className="mt-1 text-sm text-white/80">
          Panel principal del gestor bancario para consultar el estado general del sistema.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-[#011743]/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#011743]/60">Transacciones</h2>
          <p className="mt-3 text-2xl font-extrabold text-[#011743]">Modulo activo</p>
          <p className="mt-2 text-sm text-[#011743]/65">
            Desde aqui puedes acceder al registro de depositos y al historial reciente.
          </p>
        </article>

        <article className="rounded-2xl border border-[#011743]/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#011743]/60">Perfil</h2>
          <p className="mt-3 text-2xl font-extrabold text-[#011743]">Proximamente</p>
          <p className="mt-2 text-sm text-[#011743]/65">
            Este espacio queda listo para mostrar datos del usuario autenticado.
          </p>
        </article>

        <article className="rounded-2xl border border-[#011743]/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[#011743]/60">Ayuda</h2>
          <p className="mt-3 text-2xl font-extrabold text-[#011743]">En construccion</p>
          <p className="mt-2 text-sm text-[#011743]/65">
            Agrega accesos rapidos, FAQs o soporte segun lo que necesite el flujo.
          </p>
        </article>
      </div>
    </section>
  )
}