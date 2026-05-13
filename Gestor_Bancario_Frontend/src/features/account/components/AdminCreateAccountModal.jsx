import { useEffect, useState } from "react";
import { AlertCircle, Loader2, RefreshCw, X } from "lucide-react";
import { createAccountAdmin } from "../../../shared/api/account";

const initialForm = {
  userId: "",
  tipoCuenta: "AHORRO",
  moneda: "GTQ",
  saldo: "",
  estado: true,
};

export const AdminCreateAccountModal = ({
  isOpen,
  onClose,
  onCreated,
  users = [],
  usersLoading = false,
  usersError = "",
  onReloadUsers,
}) => {
  const [form, setForm] = useState(initialForm);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setForm(initialForm);
    setSelectedUserId("");
    setSubmitting(false);
    setError("");
  }, [isOpen]);

  if (!isOpen) return null;

  const getReadableError = (err) => {
    const apiErrors = err?.payload?.errors;
    if (Array.isArray(apiErrors) && apiErrors.length > 0) {
      return apiErrors
        .map((item) => `• ${item?.field || "campo"}: ${item?.message || "valor inválido"}`)
        .join("\n");
    }

    return err?.message || "No se pudo crear la cuenta";
  };

  const validate = () => {
    const issues = [];

    if (!form.userId.trim()) {
      issues.push("Debes ingresar o seleccionar un userId.");
    }

    if (!form.tipoCuenta) {
      issues.push("El tipo de cuenta es requerido.");
    }

    if (!form.moneda) {
      issues.push("La moneda es requerida.");
    }

    const saldoNumber = Number(form.saldo);
    if (Number.isNaN(saldoNumber)) {
      issues.push("El saldo debe ser un número válido.");
    } else if (saldoNumber < 0) {
      issues.push("El saldo no puede ser negativo.");
    }

    return issues;
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "userId") {
      setSelectedUserId("");
    }
  };

  const handleSelectUser = (event) => {
    const nextUserId = event.target.value;
    setSelectedUserId(nextUserId);
    setForm((current) => ({
      ...current,
      userId: nextUserId,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const issues = validate();
    if (issues.length > 0) {
      setError(issues.join("\n"));
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        saldo: Number(form.saldo),
      };
      const response = await createAccountAdmin(payload);
      onCreated?.(response);
    } catch (err) {
      setError(getReadableError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 sm:px-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white">
          <div>
            <h2 className="text-xl font-bold">Crear cuenta bancaria</h2>
            <p className="text-xs text-slate-300">Registro manual por administracion</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 transition hover:bg-slate-800"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-700">Seleccionar usuario</h3>
              <button
                type="button"
                onClick={onReloadUsers}
                disabled={usersLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                {usersLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                Recargar
              </button>
            </div>

            {usersError ? (
              <div className="flex items-start gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{usersError}</span>
              </div>
            ) : null}

            <select
              value={selectedUserId}
              onChange={handleSelectUser}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email}
                </option>
              ))}
            </select>

            <div>
              <label className="text-xs font-semibold text-slate-600">User ID (manual)</label>
              <input
                type="text"
                name="userId"
                value={form.userId}
                onChange={handleChange}
                placeholder="Ingresa el ID del usuario"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Tipo de cuenta</label>
              <select
                name="tipoCuenta"
                value={form.tipoCuenta}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="AHORRO">Ahorro</option>
                <option value="MONETARIA">Monetaria</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Moneda</label>
              <select
                name="moneda"
                value={form.moneda}
                onChange={handleChange}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="GTQ">GTQ</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="MXN">MXN</option>
                <option value="COP">COP</option>
                <option value="JPY">JPY</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Saldo inicial</label>
              <input
                type="number"
                name="saldo"
                value={form.saldo}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600">Estado</label>
              <select
                name="estado"
                value={String(form.estado)}
                onChange={(event) => {
                  const nextValue = event.target.value === "true";
                  setForm((current) => ({
                    ...current,
                    estado: nextValue,
                  }));
                }}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="true">Activa</option>
                <option value="false">Inactiva</option>
              </select>
            </div>
          </section>

          {error ? (
            <div className="flex items-start gap-2 whitespace-pre-line rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>{error}</span>
            </div>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
