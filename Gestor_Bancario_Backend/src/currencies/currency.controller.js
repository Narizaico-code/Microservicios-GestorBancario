import { getAllRates } from '../../helpers/currency-logic.js';

/**
 * Obtiene todas las tasas de cambio en tiempo real.
 */
export const getCurrencies = async (req, res) => {
    try {
        const { base } = req.query; // Ejemplo: ?base=USD
        const rates = await getAllRates(base || 'USD');

        return res.status(200).json({
            success: true,
            message: 'Tasas de cambio obtenidas correctamente',
            base: base || 'USD',
            rates,
            lastUpdate: new Date().toISOString()
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener divisas',
            error: error.message
        });
    }
};
