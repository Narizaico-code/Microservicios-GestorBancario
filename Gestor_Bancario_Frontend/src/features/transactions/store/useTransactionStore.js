import { create } from "zustand";
import { getTransactions } from "../../../shared/api/transaction";

export const useTransactionStore = create((set) => ({
    transactions: [],
    loading: false,
    error: null,

    getTransactionsData: async (params = { limit: 10 }) => {
        try {
            set({ loading: true, error: null });
            const response = await getTransactions(params);

            set({ 
              transactions: Array.isArray(response?.data?.data) ? response.data.data : [], 
              loading: false 
            });
        } catch (error) {
            set({ 
              error: error?.response?.data?.message || error.message || "Error al obtener las transacciones", 
              loading: false 
            });
        }
    },
}));
