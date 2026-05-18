'use strict';

import Promotion from '../src/promotions/promotion.model.js';
import PromotionUsage from '../src/promotions/promotion-usage.model.js';
import Account from '../src/accounts/account.model.js';
import Transaction from '../src/transactions/transaction.model.js';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000/api/v1';

/**
 * Verifica la elegibilidad del usuario para una promoción.
 * Solo se aplica a USER_ROLE y EMPLOYEE_ROLE; ADMIN_ROLE pasa directamente.
 */
export const checkPromotionEligibility = async (req, res, next) => {
  try {
    // Admins pasan directamente
    if (req.userRole === 'ADMIN_ROLE') {
      return next();
    }

    const { id } = req.params;

    // 1. Verificar que la promoción exista, esté ACTIVE y active: true
    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promocion no encontrada',
      });
    }

    if (promotion.status !== 'ACTIVE' || !promotion.active) {
      return res.status(403).json({
        success: false,
        message: 'Esta promocion no esta disponible actualmente',
      });
    }

    // 2. Verificar que la fecha actual esté entre validFrom y validTo
    const now = new Date();
    if (promotion.validFrom && now < promotion.validFrom) {
      return res.status(403).json({
        success: false,
        message: `Esta promocion no esta disponible hasta ${promotion.validFrom.toISOString()}`,
      });
    }

    if (promotion.validTo && now > promotion.validTo) {
      return res.status(403).json({
        success: false,
        message: 'Esta promocion ha expirado',
      });
    }

    // 3. Verificar que el rol del usuario esté en targetRoles
    if (promotion.targetRoles && promotion.targetRoles.length > 0) {
      if (!promotion.targetRoles.includes(req.userRole)) {
        return res.status(403).json({
          success: false,
          message: 'No tienes el rol requerido para acceder a esta promocion',
        });
      }
    }

    // 4. Verificar maxUsesGlobal
    if (promotion.maxUsesGlobal !== null && promotion.currentUsesGlobal >= promotion.maxUsesGlobal) {
      return res.status(403).json({
        success: false,
        message: 'Esta promocion ha alcanzado el limite maximo de usos globales',
      });
    }

    // 5. Verificar budget
    if (promotion.budget !== null && promotion.budgetUsed >= promotion.budget) {
      return res.status(403).json({
        success: false,
        message: 'Esta promocion ha agotado su presupuesto',
      });
    }

    // 6. Verificar targetSegment
    if (promotion.targetSegment !== 'ALL') {
      const segmentEligible = await checkSegmentEligibility(
        promotion.targetSegment,
        req.userId,
        res
      );
      if (!segmentEligible) {
        return; // La respuesta ya fue enviada dentro de checkSegmentEligibility
      }
    }

    // 7. Verificar que no haya una promo non-stackable ya activa para el usuario
    if (!promotion.stackable) {
      try {
        const activeNonStackableUsage = await PromotionUsage.findOne({
          userId: req.userId,
          status: 'APPLIED',
        }).populate({
          path: 'promotionId',
          match: { stackable: false, status: 'ACTIVE', active: true },
        });

        if (activeNonStackableUsage && activeNonStackableUsage.promotionId) {
          return res.status(409).json({
            success: false,
            message: 'Ya tienes una promocion no acumulable activa. No puedes activar otra promocion no acumulable.',
          });
        }
      } catch (error) {
        console.error('[checkPromotionEligibility] Error al verificar stackability:', error.message);
        // Graceful degradation: continuar
      }
    }

    // Verificar maxUsesPerUser
    if (promotion.maxUsesPerUser !== null) {
      try {
        const userUsageCount = await PromotionUsage.countDocuments({
          promotionId: promotion._id,
          userId: req.userId,
          status: 'APPLIED',
        });

        if (userUsageCount >= promotion.maxUsesPerUser) {
          return res.status(403).json({
            success: false,
            message: `Ya has alcanzado el limite maximo de ${promotion.maxUsesPerUser} uso(s) para esta promocion`,
          });
        }
      } catch (error) {
        console.error('[checkPromotionEligibility] Error al verificar usos por usuario:', error.message);
      }
    }

    // Todas las verificaciones pasaron
    req.promotion = promotion;
    return next();
  } catch (error) {
    console.error('[checkPromotionEligibility] Error inesperado:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Error interno al verificar elegibilidad de la promocion',
    });
  }
};

/**
 * Verifica la elegibilidad del usuario según el segmento de la promoción.
 * Retorna true si es elegible, false si ya se envió una respuesta de error.
 */
async function checkSegmentEligibility(segment, userId, res) {
  try {
    switch (segment) {
      case 'NEW': {
        // Verificar si el usuario fue creado hace menos de 30 días
        try {
          const response = await fetch(`${AUTH_SERVICE_URL}/auth/profile/by-id`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
          });

          if (!response.ok) {
            console.error(`[checkSegmentEligibility] AuthService respondio con status ${response.status}`);
            // Graceful degradation: permitir continuar
            return true;
          }

          const profileData = await response.json();
          const profile = profileData.data || profileData;
          const createdAt = new Date(profile.createdAt || profile.created_at);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          if (createdAt < thirtyDaysAgo) {
            res.status(403).json({
              success: false,
              message: 'Esta promocion es exclusiva para usuarios nuevos (registrados en los ultimos 30 dias)',
            });
            return false;
          }
        } catch (error) {
          console.error('[checkSegmentEligibility] Error al verificar segmento NEW:', error.message);
          // Graceful degradation: permitir continuar
          return true;
        }
        break;
      }

      case 'VIP': {
        // Verificar si el usuario tiene al menos una cuenta con saldo >= 10,000 GTQ
        try {
          const vipAccount = await Account.findOne({
            userId,
            estado: true,
            saldo: { $gte: 10000 },
          });

          if (!vipAccount) {
            res.status(403).json({
              success: false,
              message: 'Esta promocion es exclusiva para usuarios VIP (requiere al menos una cuenta con saldo >= 10,000 GTQ)',
            });
            return false;
          }
        } catch (error) {
          console.error('[checkSegmentEligibility] Error al verificar segmento VIP:', error.message);
          return true;
        }
        break;
      }

      case 'INACTIVE': {
        // Verificar si el usuario no tiene transacciones en los últimos 60 días
        try {
          const sixtyDaysAgo = new Date();
          sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

          // Obtener cuentas del usuario
          const userAccounts = await Account.find({ userId, estado: true });
          const accountNumbers = userAccounts.map((a) => a.numeroCuenta);

          if (accountNumbers.length > 0) {
            const recentTransaction = await Transaction.findOne({
              $or: [
                { cuentaOrigen: { $in: accountNumbers } },
                { cuentaDestino: { $in: accountNumbers } },
              ],
              createdAt: { $gte: sixtyDaysAgo },
            });

            if (recentTransaction) {
              res.status(403).json({
                success: false,
                message: 'Esta promocion es exclusiva para usuarios inactivos (sin transacciones en los ultimos 60 dias)',
              });
              return false;
            }
          }
        } catch (error) {
          console.error('[checkSegmentEligibility] Error al verificar segmento INACTIVE:', error.message);
          return true;
        }
        break;
      }

      case 'PREMIUM': {
        // Verificar si el usuario tiene más de una cuenta activa
        try {
          const activeAccountCount = await Account.countDocuments({
            userId,
            estado: true,
          });

          if (activeAccountCount <= 1) {
            res.status(403).json({
              success: false,
              message: 'Esta promocion es exclusiva para usuarios premium (requiere mas de una cuenta activa)',
            });
            return false;
          }
        } catch (error) {
          console.error('[checkSegmentEligibility] Error al verificar segmento PREMIUM:', error.message);
          return true;
        }
        break;
      }

      default:
        break;
    }

    return true;
  } catch (error) {
    console.error('[checkSegmentEligibility] Error inesperado:', error.message);
    return true; // Graceful degradation
  }
}
