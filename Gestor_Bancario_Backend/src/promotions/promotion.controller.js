import Promotion from './promotion.model.js';
import PromotionUsage from './promotion-usage.model.js';
import Service from '../services/service.model.js';

// Campos internos que nunca se aceptan en el body
const INTERNAL_FIELDS = ['currentUsesGlobal', 'budgetUsed', 'createdBy', 'updatedBy'];

/**
 * Elimina campos de solo escritura interna del objeto de datos.
 */
const stripInternalWriteFields = (data) => {
  const cleaned = { ...data };
  INTERNAL_FIELDS.forEach((field) => delete cleaned[field]);
  return cleaned;
};

/**
 * Oculta campos sensibles para usuarios no admin.
 */
const sanitizeForNonAdmin = (promoObj) => {
  const sanitized = promoObj.toObject ? promoObj.toObject() : { ...promoObj };
  delete sanitized.internalNote;
  return sanitized;
};

/**
 * Construye el objeto de sorting a partir del query param sortBy.
 */
const buildSortOptions = (sortBy) => {
  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    priority_desc: { priority: -1 },
    validTo_asc: { validTo: 1 },
  };
  return sortMap[sortBy] || { createdAt: -1 };
};

export const createPromotion = async (req, res) => {
  try {
    const data = stripInternalWriteFields(req.body || {});
    const imageUrlFromFile = req.file?.path || req.file?.secure_url;
    if (imageUrlFromFile) {
      data.imageUrl = imageUrlFromFile;
    }
    const {
      name,
      description,
      terms,
      active,
      validFrom,
      validTo,
      imageUrl,
      conditions,
      type,
      status,
      targetSegment,
      targetRoles,
      maxUsesGlobal,
      maxUsesPerUser,
      budget,
      priority,
      stackable,
      applicableServices,
      internalNote,
      tags,
    } = data;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio',
      });
    }

    // Si vienen applicableServices, verificar que cada ID exista
    if (applicableServices && applicableServices.length > 0) {
      const existingServices = await Service.find({
        _id: { $in: applicableServices },
      });
      const existingIds = existingServices.map((s) => s._id.toString());
      const invalidIds = applicableServices.filter((id) => !existingIds.includes(id));

      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Los siguientes IDs de servicios no existen: ${invalidIds.join(', ')}`,
        });
      }
    }

    // Determinar status
    let finalStatus = status || 'DRAFT';
    if (validFrom && new Date(validFrom) > new Date() && (finalStatus === 'ACTIVE' || active === true)) {
      finalStatus = 'SCHEDULED';
    }

    const created = await Promotion.create({
      name,
      description,
      terms,
      active,
      validFrom,
      validTo,
      imageUrl,
      conditions,
      type,
      status: finalStatus,
      createdBy: req.userId,
      targetSegment,
      targetRoles,
      maxUsesGlobal,
      maxUsesPerUser,
      budget,
      priority,
      stackable,
      applicableServices,
      internalNote,
      tags,
    });

    return res.status(201).json({
      success: true,
      message: 'Promocion creada correctamente',
      data: created,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una promocion con ese nombre',
      });
    }

    return res.status(500).json({ success: false, error: err.message });
  }
};

export const listPromotions = async (req, res) => {
  try {
    const {
      active, q, status, type, targetSegment,
      page = 1, limit = 10, sortBy,
    } = req.query || {};

    const filter = {};
    const isAdmin = req.userRole === 'ADMIN_ROLE';

    // Si no es admin, solo mostrar ACTIVE y active: true
    if (!isAdmin) {
      filter.status = 'ACTIVE';
      filter.active = true;
    } else {
      if (status) {
        filter.status = status;
      }
      if (active !== undefined) {
        filter.active = String(active).toLowerCase() === 'true';
      }
    }

    if (type) {
      filter.type = type;
    }

    if (targetSegment) {
      filter.targetSegment = targetSegment;
    }

    if (q) {
      filter.$or = [
        { name: new RegExp(String(q), 'i') },
        { description: new RegExp(String(q), 'i') },
      ];
    }

    // Paginación
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = buildSortOptions(sortBy);

    const [promotions, totalRecords] = await Promise.all([
      Promotion.find(filter).sort(sort).skip(skip).limit(limitNum),
      Promotion.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limitNum);

    // Ocultar internalNote si no es admin
    const data = isAdmin
      ? promotions
      : promotions.map((p) => sanitizeForNonAdmin(p));

    return res.json({
      success: true,
      data,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalRecords,
        limit: limitNum,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.userRole === 'ADMIN_ROLE';
    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promocion no encontrada' });
    }

    // Si no es admin, verificar que esté ACTIVE
    if (!isAdmin && (promotion.status !== 'ACTIVE' || !promotion.active)) {
      return res.status(404).json({ success: false, message: 'Promocion no encontrada' });
    }

    const data = isAdmin ? promotion : sanitizeForNonAdmin(promotion);

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = stripInternalWriteFields(req.body || {});
    const imageUrlFromFile = req.file?.path || req.file?.secure_url;
    if (imageUrlFromFile) {
      updates.imageUrl = imageUrlFromFile;
    }

    // Si se cambia active: true y status era DRAFT, cambiar a ACTIVE o SCHEDULED
    if (updates.active === true) {
      const existing = await Promotion.findById(id);
      if (existing && existing.status === 'DRAFT') {
        const validFrom = updates.validFrom || existing.validFrom;
        if (validFrom && new Date(validFrom) > new Date()) {
          updates.status = 'SCHEDULED';
        } else {
          updates.status = 'ACTIVE';
        }
      }
    }

    // Agregar updatedBy
    updates.updatedBy = req.userId;

    const updated = await Promotion.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Promocion no encontrada' });
    }

    return res.json({
      success: true,
      message: 'Promocion actualizada correctamente',
      data: updated,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una promocion con ese nombre',
      });
    }

    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promocion no encontrada' });
    }

    // Si ya está CANCELLED, devolver 409
    if (promotion.status === 'CANCELLED') {
      return res.status(409).json({
        success: false,
        message: 'Esta promocion ya esta cancelada',
      });
    }

    // Soft delete
    promotion.status = 'CANCELLED';
    promotion.active = false;
    promotion.updatedBy = req.userId;
    await promotion.save();

    return res.json({
      success: true,
      message: 'Promocion cancelada correctamente',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// --- Nuevos métodos ---

export const togglePromotionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, reason } = req.body;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promocion no encontrada' });
    }

    switch (action) {
      case 'ACTIVATE': {
        if (!['DRAFT', 'PAUSED'].includes(promotion.status)) {
          return res.status(400).json({
            success: false,
            message: `No se puede activar una promocion con status ${promotion.status}. Solo se puede activar desde DRAFT o PAUSED.`,
          });
        }

        // Validar coherencia de fechas
        const now = new Date();
        if (promotion.validTo && promotion.validTo < now) {
          return res.status(400).json({
            success: false,
            message: 'No se puede activar una promocion cuya fecha de fin ya paso',
          });
        }

        promotion.status = 'ACTIVE';
        promotion.active = true;
        break;
      }

      case 'PAUSE': {
        if (promotion.status !== 'ACTIVE') {
          return res.status(400).json({
            success: false,
            message: `No se puede pausar una promocion con status ${promotion.status}. Solo se puede pausar desde ACTIVE.`,
          });
        }

        promotion.status = 'PAUSED';
        promotion.active = false;
        break;
      }

      case 'CANCEL': {
        if (promotion.status === 'EXPIRED') {
          return res.status(400).json({
            success: false,
            message: 'No se puede cancelar una promocion que ya ha expirado',
          });
        }

        promotion.status = 'CANCELLED';
        promotion.active = false;
        if (reason) {
          promotion.internalNote = `[CANCELADA] ${reason}${promotion.internalNote ? ' | Nota previa: ' + promotion.internalNote : ''}`;
        }
        break;
      }

      default:
        return res.status(400).json({
          success: false,
          message: 'Accion invalida',
        });
    }

    promotion.updatedBy = req.userId;
    await promotion.save();

    return res.json({
      success: true,
      message: `Promocion ${action === 'ACTIVATE' ? 'activada' : action === 'PAUSE' ? 'pausada' : 'cancelada'} correctamente`,
      data: promotion,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getPromotionStats = async (req, res) => {
  try {
    const { id } = req.params;

    const promotion = await Promotion.findById(id);
    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promocion no encontrada' });
    }

    // Contar usos totales
    const totalUses = await PromotionUsage.countDocuments({ promotionId: id });

    // Contar usuarios únicos
    const uniqueUsersResult = await PromotionUsage.distinct('userId', { promotionId: id });
    const uniqueUsers = uniqueUsersResult.length;

    // Budget info
    const remainingBudget = promotion.budget !== null
      ? promotion.budget - promotion.budgetUsed
      : null;

    // Días restantes
    let daysRemaining = null;
    if (promotion.validTo) {
      const now = new Date();
      const diff = promotion.validTo.getTime() - now.getTime();
      daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }

    // Usos restantes
    const usesRemaining = promotion.maxUsesGlobal !== null
      ? promotion.maxUsesGlobal - promotion.currentUsesGlobal
      : null;

    return res.json({
      success: true,
      data: {
        totalUses,
        uniqueUsers,
        budgetUsed: promotion.budgetUsed,
        remainingBudget,
        daysRemaining,
        usesRemaining,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
