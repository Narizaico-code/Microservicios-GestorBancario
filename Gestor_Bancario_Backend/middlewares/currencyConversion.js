import Account from '../src/accounts/account.model.js';
import { convert } from '../helpers/currency-logic.js';

export const currencyConversionMiddleware = async (req, res, next) => {
  try {
    const { tipoTransaccion, monto, moneda, cuentaOrigen, cuentaDestino } = req.body;
    if (!tipoTransaccion || monto == null || !moneda) return next();

    const type = String(tipoTransaccion).toUpperCase();
    const requestCurrency = String(moneda).toUpperCase();
    const requestAmount = Number(parseFloat(monto));

    if (!Number.isFinite(requestAmount) || requestAmount <= 0) return next();

    // Valores por defecto si no aplica conversión.
    req.body.montoOrigen = Number(requestAmount.toFixed(2));
    req.body.montoDestino = Number(requestAmount.toFixed(2));

    if (type === 'TRANSFERENCIA') {
      const origin = await Account.findOne({ numeroCuenta: cuentaOrigen });
      const destination = await Account.findOne({ numeroCuenta: cuentaDestino });
      if (!origin || !destination) return next();

      const originCurrency = String(origin.moneda).toUpperCase();
      const destinationCurrency = String(destination.moneda).toUpperCase();

      const debitAmount = await convert(requestAmount, requestCurrency, originCurrency);
      const creditAmount = await convert(requestAmount, requestCurrency, destinationCurrency);

      if (!Number.isFinite(debitAmount) || !Number.isFinite(creditAmount)) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo convertir moneda para la transferencia'
        });
      }

      req.body.montoOrigen = debitAmount;
      req.body.montoDestino = creditAmount;
      req.body.monedaOrigen = originCurrency;
      req.body.monedaDestino = destinationCurrency;
      return next();
    }

    if (type === 'DEPOSITO') {
      const destination = await Account.findOne({ numeroCuenta: cuentaDestino });
      if (!destination) return next();

      const destinationCurrency = String(destination.moneda).toUpperCase();
      const creditAmount = await convert(requestAmount, requestCurrency, destinationCurrency);
      if (!Number.isFinite(creditAmount)) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo convertir moneda para el deposito'
        });
      }

      req.body.montoDestino = creditAmount;
      req.body.monedaDestino = destinationCurrency;
      return next();
    }

    if (type === 'RETIRO') {
      const origin = await Account.findOne({ numeroCuenta: cuentaOrigen });
      if (!origin) return next();

      const originCurrency = String(origin.moneda).toUpperCase();
      const debitAmount = await convert(requestAmount, requestCurrency, originCurrency);
      if (!Number.isFinite(debitAmount)) {
        return res.status(400).json({
          success: false,
          message: 'No se pudo convertir moneda para el retiro'
        });
      }

      req.body.montoOrigen = debitAmount;
      req.body.monedaOrigen = originCurrency;
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error en conversion de moneda',
      error: error.message
    });
  }
};

export { convert };
export default currencyConversionMiddleware;
