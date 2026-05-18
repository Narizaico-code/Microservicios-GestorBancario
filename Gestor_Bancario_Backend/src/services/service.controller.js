import Service from './service.model.js';

const normalizeServiceType = (type) => {
  if (!type) return null;
  return String(type).trim().toUpperCase();
};

const normalizeDiscount = (discount) => {
  if (!discount) return null;

  const normalized = { ...discount };
  if (normalized.type) {
    normalized.type = String(normalized.type).trim().toUpperCase();
  }
  return normalized;
};

const isValidServiceType = (type) => ['PRODUCT', 'SERVICE'].includes(type);
const isValidDiscountType = (type) => ['PERCENT', 'AMOUNT'].includes(type);

// Campos internos que nunca se aceptan en el body
const INTERNAL_FIELDS = ['currentUses', 'createdBy', 'updatedBy'];

/**
 * Elimina campos de solo lectura interna del objeto de datos.
 */
const stripInternalWriteFields = (data) => {
  const cleaned = { ...data };
  INTERNAL_FIELDS.forEach((field) => delete cleaned[field]);
  return cleaned;
};

/**
 * Oculta campos sensibles para usuarios no admin.
 */
const sanitizeForNonAdmin = (serviceObj) => {
  const sanitized = serviceObj.toObject ? serviceObj.toObject() : { ...serviceObj };
  delete sanitized.internalNote;
  return sanitized;
};

/**
 * Construye el objeto de sorting a partir del query param sortBy.
 */
const buildSortOptions = (sortBy) => {
  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    name_asc: { name: 1 },
  };
  return sortMap[sortBy] || { createdAt: -1 };
};

export const createService = async (req, res) => {
  try {
    const data = stripInternalWriteFields(req.body || {});
    const imageUrlFromFile = req.file?.path || req.file?.secure_url;
    if (imageUrlFromFile) {
      data.imageUrl = imageUrlFromFile;
    }
    const {
      name,
      description,
      category,
      type,
      price,
      active,
      imageUrl,
      terms,
      validFrom,
      validTo,
      discount,
      status,
      currency,
      targetRoles,
      minBalance,
      requiresVerifiedEmail,
      maxUsesPerUser,
      totalUsesLimit,
      tags,
      internalNote,
    } = data;

    const normalizedType = normalizeServiceType(type);
    if (!name || !description || price === undefined || price === null) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, descripcion y precio son obligatorios',
      });
    }

    if (!normalizedType || !isValidServiceType(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo invalido. Use PRODUCT o SERVICE',
      });
    }

    const normalizedDiscount = normalizeDiscount(discount);
    if (normalizedDiscount?.type && !isValidDiscountType(normalizedDiscount.type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de descuento invalido. Use PERCENT o AMOUNT',
      });
    }

    if (normalizedDiscount && normalizedDiscount.value === undefined) {
      return res.status(400).json({
        success: false,
        message: 'El valor del descuento es obligatorio',
      });
    }

    // Validación adicional de discount
    if (normalizedDiscount) {
      if (normalizedDiscount.type === 'PERCENT' && normalizedDiscount.value > 100) {
        return res.status(400).json({
          success: false,
          message: 'El valor del descuento porcentual no puede superar 100',
        });
      }
      if (normalizedDiscount.type === 'AMOUNT' && normalizedDiscount.value > price) {
        return res.status(400).json({
          success: false,
          message: 'El valor del descuento no puede superar el precio del servicio',
        });
      }
    }

    const created = await Service.create({
      name,
      description,
      category,
      type: normalizedType,
      price,
      active,
      imageUrl,
      terms,
      validFrom,
      validTo,
      discount: normalizedDiscount,
      status: status || 'DRAFT',
      createdBy: req.userId,
      currency,
      targetRoles,
      minBalance,
      requiresVerifiedEmail,
      maxUsesPerUser,
      totalUsesLimit,
      tags,
      internalNote,
    });

    return res.status(201).json({
      success: true,
      message: 'Servicio creado correctamente',
      data: created,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un servicio con ese nombre',
      });
    }

    return res.status(500).json({ success: false, error: err.message });
  }
};

export const listServices = async (req, res) => {
  try {
    const {
      type, status, category, active, q,
      minPrice, maxPrice, currency, targetRole,
      page = 1, limit = 10, sortBy,
    } = req.query || {};

    const filter = {};
    const isAdmin = req.userRole === 'ADMIN_ROLE';

    // Si no es admin, solo mostrar servicios ACTIVE y active: true
    if (!isAdmin) {
      filter.status = 'ACTIVE';
      filter.active = true;
    } else {
      // Para admin, aplicar filtros de status y active si se proporcionan
      if (status) {
        filter.status = status;
      }
      if (active !== undefined) {
        filter.active = String(active).toLowerCase() === 'true';
      }
    }

    if (type) {
      const normalizedType = normalizeServiceType(type);
      if (normalizedType && isValidServiceType(normalizedType)) {
        filter.type = normalizedType;
      }
    }

    if (category) {
      filter.category = category;
    }

    if (q) {
      filter.$or = [
        { name: new RegExp(String(q), 'i') },
        { description: new RegExp(String(q), 'i') },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    if (currency) {
      filter.currency = currency;
    }

    if (targetRole) {
      filter.targetRoles = targetRole;
    }

    // Paginación
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sort = buildSortOptions(sortBy);

    const [services, totalRecords] = await Promise.all([
      Service.find(filter).sort(sort).skip(skip).limit(limitNum),
      Service.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limitNum);

    // Ocultar internalNote si no es admin
    const data = isAdmin
      ? services
      : services.map((s) => sanitizeForNonAdmin(s));

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

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const isAdmin = req.userRole === 'ADMIN_ROLE';
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    // Si no es admin, verificar que el servicio esté ACTIVE
    if (!isAdmin && (service.status !== 'ACTIVE' || !service.active)) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    const data = isAdmin ? service : sanitizeForNonAdmin(service);

    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = stripInternalWriteFields(req.body || {});
    const imageUrlFromFile = req.file?.path || req.file?.secure_url;
    if (imageUrlFromFile) {
      updates.imageUrl = imageUrlFromFile;
    }

    if (updates.type) {
      const normalizedType = normalizeServiceType(updates.type);
      if (!normalizedType || !isValidServiceType(normalizedType)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo invalido. Use PRODUCT o SERVICE',
        });
      }
      updates.type = normalizedType;
    }

    if (updates.discount) {
      const normalizedDiscount = normalizeDiscount(updates.discount);
      if (normalizedDiscount?.type && !isValidDiscountType(normalizedDiscount.type)) {
        return res.status(400).json({
          success: false,
          message: 'Tipo de descuento invalido. Use PERCENT o AMOUNT',
        });
      }
      updates.discount = normalizedDiscount;
    }

    // Si se actualiza price y hay un discount.type: 'AMOUNT' activo, recalcular
    if (updates.price !== undefined && !updates.discount) {
      const existing = await Service.findById(id);
      if (existing && existing.discount && existing.discount.type === 'AMOUNT') {
        if (existing.discount.value > updates.price) {
          // Invalidar el descuento
          updates.discount = null;
          return res.status(200).json({
            success: true,
            message: 'Servicio actualizado. El descuento fue invalidado porque su valor superaba el nuevo precio.',
            data: await Service.findByIdAndUpdate(
              id,
              { $set: { ...updates, updatedBy: req.userId } },
              { new: true, runValidators: true }
            ),
            warning: 'El descuento de tipo AMOUNT fue removido porque superaba el nuevo precio.',
          });
        }
      }
    }

    // Agregar updatedBy
    updates.updatedBy = req.userId;

    const updated = await Service.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    return res.json({
      success: true,
      message: 'Servicio actualizado correctamente',
      data: updated,
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un servicio con ese nombre',
      });
    }

    return res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    // Si ya está ARCHIVED, devolver 409
    if (service.status === 'ARCHIVED') {
      return res.status(409).json({
        success: false,
        message: 'Este servicio ya esta archivado',
      });
    }

    // Soft delete
    service.status = 'ARCHIVED';
    service.active = false;
    service.updatedBy = req.userId;
    await service.save();

    return res.json({
      success: true,
      message: 'Servicio archivado correctamente',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
