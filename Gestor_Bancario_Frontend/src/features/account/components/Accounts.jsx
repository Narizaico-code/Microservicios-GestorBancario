import { useEffect, useMemo, useState } from "react";
import { useAccountStore } from "../store/useAccountStore";
import { Spinner } from "../../../shared/components/layout/Spinner";
import { AccountModal } from "./AccountModal";
import {
    Wallet,
    CreditCard,
    BadgeDollarSign,
    CheckCircle2,
    Search,
} from "lucide-react";



export const Accounts = () => {
    const { accounts, loading, error, getAccounts } = useAccountStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const openModal = (account) => {
        setSelectedAccount(account);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAccount(null);
    };

    useEffect(() => {
        getAccounts();
    }, [getAccounts]);

    // 🔍 FILTRO (tipo Users)
    const filteredAccounts = useMemo(() => {
        const normalized = search.trim().toLowerCase();

        return accounts.filter((acc) => {
            const numero = (acc.numeroCuenta || "").toLowerCase();
            const tipo = (acc.tipoCuenta || "").toLowerCase();

            const matchesSearch =
                !normalized ||
                numero.includes(normalized) ||
                tipo.includes(normalized);

            const matchesType =
                typeFilter === "ALL"
                    ? true
                    : (acc.tipoCuenta || "").toUpperCase() === typeFilter;

            return matchesSearch && matchesType;
        });
    }, [accounts, search, typeFilter]);

    if (loading) return <Spinner />;

    if (error) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm">
                {error}
            </div>
        );
    }

    if (!accounts.length) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-14 text-center shadow-sm">
                <Wallet className="mb-4 h-12 w-12 text-slate-400" />
                <h2 className="text-lg font-semibold text-slate-700">
                    No hay cuentas disponibles
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Cuando existan cuentas registradas aparecerán aquí.
                </p>
            </div>
        );
    }

    return (
        <>
            {/* HEADER + FILTERS */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold text-slate-900">
                    Mis cuentas
                </h1>

                <div className="flex w-full md:w-auto items-center gap-3">
                    {/* Search */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar cuenta..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-200 focus:ring-2 focus:ring-blue-50"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-200 focus:ring-2 focus:ring-blue-50"
                    >
                        <option value="ALL">Todos</option>
                        <option value="AHORRO">Ahorro</option>
                        <option value="MONETARIA">Monetaria</option>
                    </select>
                </div>
            </div>

            {/* GRID */}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredAccounts.map((account, index) => (
                    <div
                        key={account.numeroCuenta || account._id || index}
                        className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                    >
                        <div className="absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-blue-100 opacity-50 blur-2xl" />

                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                                        <CreditCard className="h-6 w-6" />
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900">
                                        {account.tipoCuenta || "Cuenta"}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        {account.numeroCuenta}
                                    </p>
                                </div>

                                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    Activa
                                </div>
                            </div>

                            <div className="mt-6 rounded-2xl bg-slate-900 p-5 text-white">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <BadgeDollarSign className="h-4 w-4" />
                                    <span className="text-sm">
                                        Saldo disponible
                                    </span>
                                </div>

                                <h2 className="mt-2 text-3xl font-bold">
                                    {account.moneda || "Q"}{" "}
                                    {account.saldo}
                                </h2>
                            </div>

                            <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4">
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    Verificada
                                </div>

                                <button
                                    onClick={() => openModal(account)}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
                                >
                                    Ver detalles
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <AccountModal
                isOpen={isModalOpen}
                onClose={closeModal}
                account={selectedAccount}
            />
        </>
    );
};