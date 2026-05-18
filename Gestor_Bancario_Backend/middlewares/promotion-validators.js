'use strict';

import { body, param, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validacion',
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }

  return next();
};

const respondValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    message: 'Errores de validacion',
    errors,
  });
};

const allowedPromotionFields = [
  'name',
  'description',
  'terms',
  'active',
  'validFrom',
  'validTo',
  'imageUrl',
  'conditions',
];

const ensureAllowedFields = (req, res, next) => {
  const errors = [];
  const receivedFields = Object.keys(req.body || {});
  const unknownFields = receivedFields.filter(
    (field) => !allowedPromotionFields.includes(field)
  );

  if (receivedFields.length === 0) {
    errors.push('Debe enviar al menos un campo para actualizar');
  }

  if (unknownFields.length > 0) {
    errors.push(`Campos no permitidos: ${unknownFields.join(', ')}`);
  }

  if (errors.length > 0) {
    return respondValidationError(res, errors);
  }

  return next();
};

export const validateNonEmptyFields = (fields) => [
  ...fields.map((field) =>
    body(field)
      .notEmpty()
      .withMessage(`El campo ${field} es requerido`)
  ),
  handleValidationErrors,
];

export const validateCreatePromotion = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),

  body('description')
    .optional()
    .isString()
    .withMessage('La descripcion debe ser texto')
    .trim(),

  body('terms')
    .optional()
    .isString()
    .withMessage('Los terminos deben ser texto')
    .trim(),

  body('active')
    .optional()
    .isBoolean()
    .withMessage('active debe ser true o false')
    .toBoolean(),

  body('validFrom')
    .optional()
    .isISO8601()
    .withMessage('validFrom debe ser una fecha valida')
    .toDate(),

  body('validTo')
    .optional()
    .isISO8601()
    .withMessage('validTo debe ser una fecha valida')
    .toDate(),

  body('validTo')
    .optional()
    .custom((value, { req }) => {
      if (req.body.validFrom && value) {
        const start = new Date(req.body.validFrom);
        const end = new Date(value);
        if (end <= start) {
          throw new Error('validTo debe ser posterior a validFrom');
        }
      }
      return true;
    }),

  body('imageUrl')
    .optional()
    .isURL({ require_protocol: true })
    .withMessage('imageUrl debe ser una URL valida')
    .trim(),

  body('conditions')
    .optional()
    .custom((value) => {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return true;
      }
      throw new Error('conditions debe ser un objeto');
    }),

  handleValidationErrors,
];

export const validateUpdatePromotion = [
  ensureAllowedFields,

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacio')
    .isLength({ max: 100 })
    .withMessage('El nombre no puede exceder 100 caracteres'),

  body('description')
    .optional()
    .isString()
    .withMessage('La descripcion debe ser texto')
    .trim(),

  body('terms')
    .optional()
    .isString()
    .withMessage('Los terminos deben ser texto')
    .trim(),

  body('active')
    .optional()
    .isBoolean()
    .withMessage('active debe ser true o false')
    .toBoolean(),

  body('validFrom')
    .optional()
    .isISO8601()
    .withMessage('validFrom debe ser una fecha valida')
    .toDate(),

  body('validTo')
    .optional()
    .isISO8601()
    .withMessage('validTo debe ser una fecha valida')
    .toDate(),

  body('validTo')
    .optional()
    .custom((value, { req }) => {
      if (req.body.validFrom && value) {
        const start = new Date(req.body.validFrom);
        const end = new Date(value);
        if (end <= start) {
          throw new Error('validTo debe ser posterior a validFrom');
        }
      }
      return true;
    }),

  body('imageUrl')
    .optional()
    .isURL({ require_protocol: true })
    .withMessage('imageUrl debe ser una URL valida')
    .trim(),

  body('conditions')
    .optional()
    .custom((value) => {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return true;
      }
      throw new Error('conditions debe ser un objeto');
    }),

  handleValidationErrors,
];

export const validatePromotionId = [
  param('id').isMongoId().withMessage('ID de promocion invalido'),
  handleValidationErrors,
];
