import { Router } from 'express';
import { getCurrencies } from './currency.controller.js';

const api = Router();

/**
 * @route GET /gestionBancaria/api/v1/currencies
 * @desc Obtener tasas de cambio en tiempo real
 * @access Public/Private (Depende de tu preferencia, usualmente los clientes quieren ver esto antes de loguearse)
 */
api.get('/', getCurrencies);

export default api;
