import Promotion from './promotion.model.js';

export const createPromotion = async (req, res) => {
  try {
    const {
      name,
      description,
      terms,
      active,
      validFrom,
      validTo,
      imageUrl,
      conditions,
    } = req.body || {};

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es obligatorio',
      });
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
    const { active, q } = req.query || {};
    const filter = {};

    if (active !== undefined) {
      filter.active = String(active).toLowerCase() === 'true';
    }

    if (q) {
      filter.name = new RegExp(String(q), 'i');
    }

    const promotions = await Promotion.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, promotions });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const getPromotionById = async (req, res) => {
  try {
    const { id } = req.params;
    const promotion = await Promotion.findById(id);

    if (!promotion) {
      return res.status(404).json({ success: false, message: 'Promocion no encontrada' });
    }

    return res.json({ success: true, promotion });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    const updated = await Promotion.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

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
    const deleted = await Promotion.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Promocion no encontrada' });
    }

    return res.json({ success: true, message: 'Promocion eliminada correctamente' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
