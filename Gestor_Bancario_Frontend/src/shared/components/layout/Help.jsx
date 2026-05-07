import {
    HelpCircle,
    BookOpen,
    ShieldCheck,
    AlertTriangle,
    Phone,
    Mail,
    Info,
} from "lucide-react";

export const Help = () => {
    return (
        <div className="mx-auto max-w-5xl space-y-8">
            {/* Header */}
            <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-lg">
                <div className="flex items-center gap-3">
                    <HelpCircle className="h-6 w-6 text-blue-300" />
                    <h1 className="text-2xl font-bold">Centro de ayuda</h1>
                </div>

                <p className="mt-3 text-sm text-slate-300">
                    Información y soporte para el uso del sistema de gestión bancaria.
                </p>
            </div>

            {/* Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Qué puedes hacer */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="mb-4 flex items-center gap-2 text-slate-900">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold">Funciones disponibles</h2>
                    </div>

                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Consultar todas tus cuentas bancarias en tiempo real
                        </li>
                        <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Visualizar saldo disponible y tipo de cuenta
                        </li>
                        <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Revisar estado de cada cuenta (activa/inactiva)
                        </li>
                        <li className="flex gap-2">
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Acceder a detalles completos de cada producto financiero
                        </li>
                    </ul>
                </div>

                {/* Seguridad */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                    <div className="mb-4 flex items-center gap-2 text-slate-900">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <h2 className="text-lg font-semibold">Seguridad</h2>
                    </div>

                    <p className="text-sm text-slate-600">
                        Tu información está protegida mediante autenticación y
                        cifrado. Nunca compartas tus credenciales.
                    </p>

                    <div className="mt-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
                        ✔ Sesiones seguras <br />
                        ✔ Acceso controlado por token <br />
                        ✔ Protección de datos sensibles
                    </div>
                </div>

                {/* Problemas comunes */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md md:col-span-2">
                    <div className="mb-4 flex items-center gap-2 text-slate-900">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <h2 className="text-lg font-semibold">Problemas comunes</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3 text-sm">
                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="font-semibold text-slate-800">
                                No cargan cuentas
                            </p>
                            <p className="text-slate-600 mt-1">
                                Revisa tu conexión o refresca la página.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="font-semibold text-slate-800">
                                Error de login
                            </p>
                            <p className="text-slate-600 mt-1">
                                Vuelve a iniciar sesión o verifica tu token.
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-4">
                            <p className="font-semibold text-slate-800">
                                Datos incorrectos
                            </p>
                            <p className="text-slate-600 mt-1">
                                Contacta al administrador del sistema.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md md:col-span-2">
                    <div className="mb-4 flex items-center gap-2 text-slate-900">
                        <Phone className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold">Soporte</h2>
                    </div>

                    <div className="flex flex-col gap-3 text-sm text-slate-600 md:flex-row md:justify-between">
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-500" />
                            soporte@gestorbancario.com
                        </div>

                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-500" />
                            +502 0000 0000
                        </div>

                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-slate-500" />
                            Horario: 8:00 AM - 6:00 PM
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};