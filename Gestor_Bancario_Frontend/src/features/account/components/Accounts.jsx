import { useEffect } from "react";
import { useAccountStore } from "../store/useAccountStore";
import { Spinner } from "../../../shared/components/layout/Spinner";

export const Accounts = () => {
    const { accounts, loading, error, getAccounts } = useAccountStore();

    useEffect(() => {
        getAccounts();
    }, [getAccounts]);

    if (loading) return <Spinner />;

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
            </div>
        );
    }

    if (!accounts.length) {
        return <p className="text-sm text-slate-500">No hay cuentas para mostrar.</p>;
    }

    return (
        <div className="grid gap-4">
            {accounts.map((account, index) => (
                <div
                    key={account.numeroCuenta || account._id || account.id || index}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-semibold text-slate-900">
                            Cuenta {account.numeroCuenta || `#${index + 1}`}
                        </h3>
                        <span className="text-xs text-slate-500">{account.tipoCuenta || "Cuenta"}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">
                        Saldo: {account.saldo ?? "N/D"} {account.moneda || ""}
                    </p>
                    <p className="text-xs text-slate-500">Estado: {String(account.estado)}</p>
                </div>
            ))}
        </div>
    );
};