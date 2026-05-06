import { create } from "zustand";
import { getAccounts } from "../../../shared/api/account";

export const useAccountStore = create((set) => ({
    accounts: [],
    loading: false,
    error: null,

    getAccounts: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getAccounts();

            set({ accounts: response.data?.data || [], loading: false });
        } catch (error) {
            set({ error: error.response?.data || error.message || "Error al obtener las cuentas", 
                loading: false 
            });
        }
    },
}));