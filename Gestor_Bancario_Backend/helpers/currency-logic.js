import { config } from 'dotenv';
config();

const parsedFallbackRate = parseFloat(process.env.USD_TO_GTQ);
const FALLBACK_USD_TO_GTQ = Number.isFinite(parsedFallbackRate) ? parsedFallbackRate : 7.8;

// Tasas aproximadas locales (base USD) para continuidad cuando APIs externas fallan.
export const LOCAL_RATES_USD_BASE = {
  USD: 1,
  GTQ: FALLBACK_USD_TO_GTQ,
  EUR: 0.92,
  MXN: 16.9,
  COP: 3920,
  JPY: 149.5
};

export const getLocalCrossRate = (base, target) => {
  const baseToUsd = LOCAL_RATES_USD_BASE[base];
  const targetToUsd = LOCAL_RATES_USD_BASE[target];
  if (!Number.isFinite(baseToUsd) || !Number.isFinite(targetToUsd) || baseToUsd <= 0) return NaN;

  // base -> USD -> target
  return targetToUsd / baseToUsd;
};

export const getRateFromApis = async (base, target) => {
  // API principal
  try {
    const resPrimary = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const dataPrimary = await resPrimary.json();
    const ratePrimary = dataPrimary?.rates?.[target];
    if (Number.isFinite(ratePrimary)) return ratePrimary;
  } catch (error) {
    // Continue with fallback API
  }

  // API de respaldo
  try {
    const resBackup = await fetch(`https://api.exchangerate.host/latest?base=${base}&symbols=${target}`);
    const dataBackup = await resBackup.json();
    const rateBackup = dataBackup?.rates?.[target];
    if (Number.isFinite(rateBackup)) return rateBackup;
  } catch (error) {
    // Continue with local fallback
  }

  // API de respaldo 2
  try {
    const resBackup2 = await fetch(`https://api.frankfurter.app/latest?from=${base}&to=${target}`);
    const dataBackup2 = await resBackup2.json();
    const rateBackup2 = dataBackup2?.rates?.[target];
    if (Number.isFinite(rateBackup2)) return rateBackup2;
  } catch (error) {
    // Continue with local fallback
  }

  // Fallback local multimoneda para continuidad operativa.
  const localRate = getLocalCrossRate(base, target);
  if (Number.isFinite(localRate)) return localRate;

  return NaN;
};

export const convert = async (amount, from, to) => {
  const amt = Number(amount);
  if (!Number.isFinite(amt)) return NaN;

  const base = String(from).toUpperCase();
  const target = String(to).toUpperCase();
  if (base === target) return Number(amt.toFixed(2));

  const rate = await getRateFromApis(base, target);
  if (!Number.isFinite(rate)) return NaN;

  return Number((amt * rate).toFixed(2));
};

export const getAllRates = async (baseCurrency = 'USD') => {
  const base = baseCurrency.toUpperCase();
  const currencies = Object.keys(LOCAL_RATES_USD_BASE);
  const results = {};

  // Intentamos obtener todas las tasas de una sola vez de la API principal para eficiencia
  try {
    const res = await fetch(`https://open.er-api.com/v6/latest/${base}`);
    const data = await res.json();
    if (data && data.rates) {
      currencies.forEach(curr => {
        if (data.rates[curr]) {
          results[curr] = data.rates[curr];
        } else {
          results[curr] = getLocalCrossRate(base, curr);
        }
      });
      return results;
    }
  } catch (error) {
    // Fallback manual si la API falla
  }

  // Si falla la API masiva, llenamos con locales o peticiones individuales (aunque lo ideal es local para no saturar)
  currencies.forEach(curr => {
    results[curr] = getLocalCrossRate(base, curr);
  });

  return results;
};
