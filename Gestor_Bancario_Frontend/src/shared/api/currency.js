import { axiosAccount as apiClient } from "./api";


/**
 * Obtiene las tasas de cambio desde el backend.
 * @param {string} base - Moneda base (ej. 'USD', 'GTQ')
 * @returns {Promise<object>} - Datos de las divisas
 */
export const getCurrencies = async (base = 'USD') => {
    try {
        const response = await apiClient.get(`/currencies?base=${base}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error al obtener divisas', { cause: error });
    }
};
