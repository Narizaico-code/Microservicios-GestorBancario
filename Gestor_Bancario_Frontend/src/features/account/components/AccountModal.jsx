import { X } from 'lucide-react';

export const AccountModal = ({ isOpen, onClose, account }) => {
    if (!isOpen || !account) return null;

    const formatCurrency = (amount, currency) => {
        return new Intl.NumberFormat('es-GT', {
            style: 'currency',
            currency: currency || 'GTQ',
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('es-GT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getAccountTypeLabel = (type) => {
        const types = {
            AHORRO: 'Cuenta de Ahorro',
            MONETARIA: 'Cuenta Monetaria',
        };
        return types[type] || type;
    };

    const getStatusBadge = (estado) => {
        return estado ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                Activa
            </span>
        ) : (
            <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-semibold rounded-full">
                Inactiva
            </span>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-3 sm:px-4">
            {/* CONTENEDOR */}
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* HEADER */}
                <div className="p-4 sm:p-5 text-white sticky top-0 z-10 flex justify-between items-center bg-slate-900">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold">
                            Detalles de la Cuenta
                        </h2>
                        <p className="text-xs sm:text-sm opacity-80">
                            Información de tu cuenta bancaria
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-lg transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* CONTENIDO */}
                <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
                    {/* NÚMERO Y TIPO DE CUENTA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                Número de Cuenta
                            </label>
                            <p className="text-lg font-bold text-slate-900">
                                {account.numeroCuenta || 'N/A'}
                            </p>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                Tipo de Cuenta
                            </label>
                            <p className="text-lg font-bold text-slate-900">
                                {getAccountTypeLabel(account.tipoCuenta)}
                            </p>
                        </div>
                    </div>

                    {/* SALDO Y MONEDA */}
                    <div className="mt-1 rounded-2xl bg-slate-900 p-5 text-white shadow-inner">
                        <label className="text-xs font-semibold text-slate-300 uppercase mb-2 block">
                            Saldo Actual
                        </label>
                        <p className="text-3xl font-bold tracking-tight">
                            {formatCurrency(account.saldo, account.moneda)}
                        </p>
                        <p className="text-sm text-slate-300 mt-2">
                            Moneda: <span className="font-semibold">{account.moneda}</span>
                        </p>
                    </div>

                    {/* ESTADO */}
                    <div className="flex flex-col">
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-2">
                            Estado de la Cuenta
                        </label>
                        <div className="flex items-center gap-2">
                            {getStatusBadge(account.estado)}
                        </div>
                    </div>

                    {/* FECHAS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                Fecha de Creación
                            </label>
                            <p className="text-sm text-slate-700">
                                {account.createdAt ? formatDate(account.createdAt) : 'N/A'}
                            </p>
                        </div>

                        <div className="flex flex-col">
                            <label className="text-xs font-semibold text-slate-500 uppercase mb-2">
                                Última Actualización
                            </label>
                            <p className="text-sm text-slate-700">
                                {account.updatedAt ? formatDate(account.updatedAt) : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* ID DE USUARIO */}
                    <div className="flex flex-col bg-slate-100 p-3 rounded-lg">
                        <label className="text-xs font-semibold text-slate-500 uppercase mb-1">
                            ID del Usuario
                        </label>
                        <p className="text-xs text-slate-600 break-all font-mono">
                            {account.userId}
                        </p>
                    </div>
                </div>

                {/* BOTÓN CERRAR */}
                <div className="flex justify-end gap-3 p-4 sm:p-5 border-t border-slate-200 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
