'use strict';

import Service from '../src/services/service.model.js';
import Account from '../src/accounts/account.model.js';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000/api/v1';

export const checkServiceEligibility = async (req, res, next) => {
  try {
    // Admins pasan directamente
    if (req.userRole === 'ADMIN_ROLE') {
      return next();
    }

    const { id } = req.params;

    // 1. Verificar que el servicio exista, esté ACTIVE y active: true
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado',
      });
    }

    if (service.status !== 'ACTIVE' || !service.active) {
      return res.status(403).json({
        success: false,
        message: 'Este servicio no esta disponible actualmente',
      });
    }

    // 2. Verificar que el rol del usuario esté en targetRoles
    if (service.targetRoles && service.targetRoles.length > 0) {
      if (!service.targetRoles.includes(req.userRole)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes el rol requerido para acceder a este servicio',
        });
      }
    }

    // 3. Verificar validFrom
    const now = new Date();
    if (service.validFrom && now < service.validFrom) {
      return res.status(403).json({
        success: false,
        message: `Este servicio no esta disponible hasta ${service.validFrom.toISOString()}`,
      });
    }

    // 4. Verificar validTo
    if (service.validTo && now > service.validTo) {
      return res.status(403).json({
        success: false,
        message: 'Este servicio ha expirado',
      });
    }

    // 5. Verificar totalUsesLimit
    if (service.totalUsesLimit !== null && service.currentUses >= service.totalUsesLimit) {
      return res.status(403).json({
        success: false,
        message: 'Este servicio ha alcanzado el limite maximo de usos',
      });
    }

    // 6. Verificar requiresVerifiedEmail
    if (service.requiresVerifiedEmail) {
      try {
        const response = await fetch(`${AUTH_SERVICE_URL}/auth/profile/by-id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: req.userId }),
        });

        if (!response.ok) {
          console.error(`[checkServiceEligibility] AuthService respondio con status ${response.status}`);
          return res.status(503).json({
            success: false,
            message: 'No se pudo verificar el estado del correo electronico. Intente mas tarde.',
          });
        }

        const profileData = await response.json();
        const profile = profileData.data || profileData;

        if (!profile.isEmailVerified) {
          return res.status(403).json({
            success: false,
            message: 'Debes verificar tu correo electronico para acceder a este servicio',
          });
        }
      } catch (error) {
        console.error('[checkServiceEligibility] Error al consultar AuthService:', error.message);
        return res.status(503).json({
          success: false,
          message: 'No se pudo verificar el estado del correo electronico. Intente mas tarde.',
        });
      }
    }

    // 7. Verificar minBalance
    if (service.minBalance > 0) {
      try {
        const accounts = await Account.find({ userId: req.userId, estado: true });
        const totalBalance = accounts.reduce((sum, account) => sum + (account.saldo || 0), 0);

        if (totalBalance < service.minBalance) {
          return res.status(403).json({
            success: false,
            message: `Saldo insuficiente. Se requiere un saldo minimo de ${service.minBalance} ${service.currency || 'GTQ'}. Tu saldo total es ${totalBalance.toFixed(2)}`,
          });
        }
      } catch (error) {
        console.error('[checkServiceEligibility] Error al consultar saldo:', error.message);
        // Graceful degradation: continuar sin verificar saldo
        return next();
      }
    }

    // Todas las verificaciones pasaron
    req.service = service;
    return next();
  } catch (error) {
    console.error('[checkServiceEligibility] Error inesperado:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error interno al verificar elegibilidad del servicio',
    });
  }
};
