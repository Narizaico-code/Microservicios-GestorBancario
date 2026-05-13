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

export const createService = async (req, res) => {
  try {
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
    } = req.body || {};

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
    const { type, category, active, q } = req.query || {};
    const filter = {};

    if (type) {
      const normalizedType = normalizeServiceType(type);
      if (normalizedType && isValidServiceType(normalizedType)) {
        filter.type = normalizedType;
      }
    }

    if (category) {
      filter.category = category;
    }

    if (active !== undefined) {
      filter.active = String(active).toLowerCase() === 'true';
    }

    if (q) {
      filter.name = new RegExp(String(q), 'i');
    }

    const services = await Service.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, services });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    return res.json({ success: true, service });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

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

    const updated = await Service.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

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
    const deleted = await Service.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Servicio no encontrado' });
    }

    return res.json({ success: true, message: 'Servicio eliminado correctamente' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
