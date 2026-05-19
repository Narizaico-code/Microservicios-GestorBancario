import { error } from 'node:console';
import Account from '../src/accounts/account.model.js';

export const validateTransaction = async (req, res, next) => {
    try {
        const { tipoTransaccion, monto, moneda, cuentaOrigen, cuentaDestino } = req.body;

        if (!tipoTransaccion || !monto || !moneda) {
            return res.status(400).json({ success: false, message: 'tipoTransaccion, monto y moneda son obligatorios' });
        }

        const normalizedType = String(tipoTransaccion).toUpperCase();
        const validTypes = ['DEPOSITO', 'TRANSFERENCIA', 'RETIRO'];
        if (!validTypes.includes(normalizedType)) {
            return res.status(400).json({ success: false, error: error, message: 'El tipo de transacción seleccionado no es válido' });
        }

        if (monto <= 0) {
            return res.status(400).json({ success: false, error: error, message: 'El monto de la transacción debe ser mayor a cero' });
        }

        const validCurrencies = ['GTQ', 'USD', 'EUR', 'MXN', 'COP', 'JPY'];
        if (!validCurrencies.includes(String(moneda).toUpperCase())) {
            return res.status(400).json({ success: false, error: error, message: 'La moneda seleccionada no es válida' });
        }

        if (normalizedType === 'TRANSFERENCIA') {
            if (!cuentaOrigen) return res.status(400).json({ success: false, error: error, message: 'Debe especificar la cuenta de origen para realizar la transferencia' });
            if (!cuentaDestino) return res.status(400).json({ success: false, error: error, message: 'Debe especificar la cuenta de destino para realizar la transferencia' });

            const origin = await Account.findOne({ numeroCuenta: cuentaOrigen });
            const destination = await Account.findOne({ numeroCuenta: cuentaDestino });

            if (!origin || !destination) return res.status(404).json({ success: false, error: error, message: 'La cuenta de origen o destino no existe' });

            // Validar que el usuario autenticado sea el dueño de la cuenta de origen
            if (String(origin.userId) !== String(req.userId)) {
                return res.status(403).json({ success: false, error: error, message: 'No tienes permiso para operar con la cuenta de origen' });
            }
            if (origin.saldo < monto) return res.status(400).json({ success: false, error: error, message: 'Saldo insuficiente en la cuenta origen' });

        } else if (normalizedType === 'DEPOSITO') {
            if (req.userRole !== 'ADMIN_ROLE') {
                return res.status(403).json({ success: false, error: error, message: 'Solo los administradores pueden realizar depósitos' });
            }

            if (!cuentaDestino) return res.status(400).json({ success: false, error: error, message: 'Debe especificar la cuenta de destino para realizar el depósito' });

            const destination = await Account.findOne({ numeroCuenta: cuentaDestino });

            if (!destination) return res.status(404).json({ success: false, error: error, message: 'La cuenta destinataria no existe' });

        } else if (normalizedType === 'RETIRO') {
            if (!cuentaOrigen) return res.status(400).json({ success: false, error: error, message: 'Debe especificar la cuenta de origen para realizar el retiro' });

            const origin = await Account.findOne({ numeroCuenta: cuentaOrigen });

            if (!origin) return res.status(404).json({ success: false, error: error, message: 'La cuenta de origen no existe' });

            // Validar que el usuario autenticado sea el dueño de la cuenta de origen
            if (String(origin.userId) !== String(req.userId)) {
                return res.status(403).json({ success: false, error: error, message: 'No tienes permiso para operar con la cuenta de origen' });
            }
            if (origin.saldo < monto) return res.status(400).json({ success: false, error: error, message: 'Saldo insuficiente en la cuenta origen' });
        }

        next();

    } catch (error) {
        res.status(500).json({ success: false, error: error, message: 'Error en validación de transacción' });
    }
};
