import { axiosTransaction } from "./api";

const getTransactions = async (params = {}) => {
  return await axiosTransaction.get("/transactions/get", { params });
};

const createDepositTransaction = async ({ cuentaDestino, monto, descripcion, moneda = "GTQ" }) => {
  return await axiosTransaction.post("/transactions/create", {
    tipoTransaccion: "DEPOSITO",
    cuentaDestino,
    monto,
    descripcion,
    moneda,
  });
};

export { getTransactions, createDepositTransaction };
