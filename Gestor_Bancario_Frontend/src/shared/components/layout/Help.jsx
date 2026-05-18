import { HelpCircle, BookOpen, ShieldCheck, AlertTriangle, Phone, Mail, Info } from 'lucide-react'

export const Help = () => (
  <div className="flex flex-col gap-4 pb-8 text-[color:var(--theme-text)]">

    {/* HEADER */}
    <div className="flex items-center gap-3 rounded-[16px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-5">
      <div className="w-9 h-9 rounded-[10px] bg-[color:var(--theme-surface-alt)] flex items-center justify-center shrink-0 border border-[color:var(--theme-border)]">
        <HelpCircle size={18} className="text-[color:var(--theme-text)]" />
      </div>
      <div>
        <h1 className="text-[22px] font-black leading-none mb-1">Centro de ayuda</h1>
        <p className="text-[13px] text-[color:var(--theme-text-muted)]">Información y soporte para el uso del sistema de gestión bancaria.</p>
      </div>
    </div>

    {/* GRID 2 cols */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      {/* Funciones */}
      <div className="rounded-[16px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-5 transition-colors hover:border-[color:var(--theme-text-muted)]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-[color:var(--theme-surface-alt)] flex items-center justify-center shrink-0 border border-[color:var(--theme-border)]">
            <BookOpen size={16} className="text-[color:var(--theme-text)]" />
          </div>
          <h2 className="text-[15px] font-bold">Funciones disponibles</h2>
        </div>
        <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
          {[
            'Consultar todas tus cuentas bancarias en tiempo real',
            'Visualizar saldo disponible y tipo de cuenta',
            'Revisar estado de cada cuenta (activa / inactiva)',
            'Acceder a detalles completos de cada producto financiero',
          ].map(item => (
            <li key={item} className="flex items-start gap-2.5 text-[13px] text-[color:var(--theme-text-muted)] leading-relaxed">
              <span className="mt-[7px] w-[5px] h-[5px] rounded-full bg-[color:var(--theme-text-muted)] opacity-70 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Seguridad */}
      <div className="rounded-[16px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-5 transition-colors hover:border-[color:var(--theme-text-muted)]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-[10px] bg-[color:var(--theme-surface-alt)] flex items-center justify-center shrink-0 border border-[color:var(--theme-border)]">
            <ShieldCheck size={16} className="text-[color:var(--theme-text)]" />
          </div>
          <h2 className="text-[15px] font-bold">Seguridad</h2>
        </div>
        <p className="text-[13px] text-[color:var(--theme-text-muted)] leading-relaxed mb-4">
          Tu información está protegida mediante autenticación y cifrado. Nunca compartas tus credenciales.
        </p>
        <div className="rounded-[10px] border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-[12px] text-emerald-400 leading-loose">
          ✔ Sesiones seguras<br />
          ✔ Acceso controlado por token<br />
          ✔ Protección de datos sensibles
        </div>
      </div>
    </div>

    {/* Problemas comunes */}
    <div className="rounded-[16px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-5 transition-colors hover:border-[color:var(--theme-text-muted)]">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-9 h-9 rounded-[10px] bg-[color:var(--theme-surface-alt)] flex items-center justify-center shrink-0 border border-[color:var(--theme-border)]">
          <AlertTriangle size={16} className="text-[color:var(--theme-text)]" />
        </div>
        <h2 className="text-[15px] font-bold">Problemas comunes</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { title: 'No cargan cuentas',  desc: 'Revisa tu conexión o refresca la página.' },
          { title: 'Error de login',     desc: 'Vuelve a iniciar sesión o verifica tu token.' },
          { title: 'Datos incorrectos',  desc: 'Contacta al administrador del sistema.' },
        ].map(({ title, desc }) => (
          <div key={title} className="rounded-[12px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface-alt)] px-4 py-3">
            <p className="text-[13px] font-bold mb-1.5">{title}</p>
            <p className="text-[13px] text-[color:var(--theme-text-muted)] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Soporte */}
    <div className="rounded-[16px] border border-[color:var(--theme-border)] bg-[color:var(--theme-surface)] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-wrap transition-colors hover:border-[color:var(--theme-text-muted)]">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-[10px] bg-[color:var(--theme-surface-alt)] flex items-center justify-center shrink-0 border border-[color:var(--theme-border)]">
          <Phone size={16} className="text-[color:var(--theme-text)]" />
        </div>
        <h2 className="text-[15px] font-bold">Soporte</h2>
      </div>
      <div className="flex flex-col sm:flex-row flex-wrap gap-4">
        {[
          { Icon: Mail,  text: 'soporte@gestorbancario.com' },
          { Icon: Phone, text: '+502 0000 0000' },
          { Icon: Info,  text: 'Horario: 8:00 AM – 6:00 PM' },
        ].map(({ Icon, text }) => (
          <div key={text} className="flex items-center gap-2 text-[13px] text-[color:var(--theme-text-muted)]">
            <Icon size={14} className="text-[color:var(--theme-text-muted)] opacity-70 shrink-0" />
            {text}
          </div>
        ))}
      </div>
    </div>
  </div>
)