'use strict';

import Promotion from '../src/promotions/promotion.model.js';
import Service from '../src/services/service.model.js';

const INTERVAL_MS = 15 * 60 * 1000; // 15 minutos

/**
 * Job de mantenimiento automático de estados para promociones y servicios.
 * Se ejecuta cada 15 minutos.
 */
const runStatusMaintenanceJob = async () => {
  const timestamp = new Date().toISOString();
  console.log(`[StatusCron] ${timestamp} — Ejecutando job de mantenimiento de estados...`);

  try {
    // 1. Promociones SCHEDULED cuyo validFrom <= ahora → ACTIVE
    const now = new Date();

    const scheduledToActive = await Promotion.updateMany(
      {
        status: 'SCHEDULED',
        validFrom: { $lte: now },
      },
      {
        $set: { status: 'ACTIVE', active: true },
      }
    );
    if (scheduledToActive.modifiedCount > 0) {
      console.log(`[StatusCron] ${timestamp} — ${scheduledToActive.modifiedCount} promocion(es) pasaron de SCHEDULED a ACTIVE`);
    }

    // 2. Promociones ACTIVE cuyo validTo < ahora → EXPIRED
    const activeToExpired = await Promotion.updateMany(
      {
        status: 'ACTIVE',
        validTo: { $lt: now },
      },
      {
        $set: { status: 'EXPIRED', active: false },
      }
    );
    if (activeToExpired.modifiedCount > 0) {
      console.log(`[StatusCron] ${timestamp} — ${activeToExpired.modifiedCount} promocion(es) pasaron de ACTIVE a EXPIRED`);
    }

    // 3. Servicios ACTIVE cuyo validTo < ahora → INACTIVE
    const serviceActiveToInactive = await Service.updateMany(
      {
        status: 'ACTIVE',
        validTo: { $lt: now },
      },
      {
        $set: { status: 'INACTIVE', active: false },
      }
    );
    if (serviceActiveToInactive.modifiedCount > 0) {
      console.log(`[StatusCron] ${timestamp} — ${serviceActiveToInactive.modifiedCount} servicio(s) pasaron de ACTIVE a INACTIVE`);
    }

    console.log(`[StatusCron] ${timestamp} — Job de mantenimiento completado.`);
  } catch (error) {
    console.error(`[StatusCron] ${timestamp} — Error en job de mantenimiento:`, error.message);
  }
};

/**
 * Inicia el cron job de mantenimiento de estados.
 * Ejecuta inmediatamente y luego cada 15 minutos.
 */
export const startPromotionStatusCron = () => {
  console.log('[StatusCron] Iniciando job de mantenimiento de estados (intervalo: 15 min)');

  // Ejecutar inmediatamente al iniciar
  runStatusMaintenanceJob();

  // Ejecutar cada 15 minutos
  setInterval(runStatusMaintenanceJob, INTERVAL_MS);
};
