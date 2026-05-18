'use strict';

import { body, param, query, validationResult } from 'express-validator';
import { allowedPromotionFields } from './allowed-fields.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const payload = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    console.warn('Validation error', {
      method: req.method,
      path: req.originalUrl,
      errors: payload.map(({ field, message }) => ({ field, message })),
    });

    return res.status(400).json({
      success: false,
      message: 'Errores de validacion',
      errors: payload,
    });
  }

  return next();
};

const respondValidationError = (req, res, errors) => {
  console.warn('Validation error', {
    method: req.method,
    path: req.originalUrl,
    errors: Array.isArray(errors)
      ? errors.map((message) => ({ message }))
      : [{ message: String(errors) }],
  });

  return res.status(400).json({
    success: false,
    message: 'Errores de validacion',
    errors,
  });
};

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
    return respondValidationError(req, res, errors);
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
    .withMessage('El estado activo debe ser verdadero o falso')
    .toBoolean(),

  body('validFrom')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe ser una fecha válida')
    .toDate(),

  body('validTo')
    .optional()
    .isISO8601()
    .withMessage('La fecha de finalización debe ser una fecha válida')
    .toDate(),

  body('validTo')
    .optional()
    .custom((value, { req }) => {
      if (req.body.validFrom && value) {
        const start = new Date(req.body.validFrom);
        const end = new Date(value);
        if (end <= start) {
          throw new Error('La fecha de finalización debe ser posterior a la fecha de inicio');
        }
      }
      return true;
    }),

  body('imageUrl')
    .optional()
    .isURL({ require_protocol: true })
    .withMessage('La URL de la imagen debe ser válida y empezar con http:// o https://')
    .trim(),

  body('conditions')
    .optional()
    .custom((value) => {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return true;
      }
      throw new Error('Las condiciones deben tener un formato de datos estructurado (objeto JSON)');
    }),

  body('type')
    .optional()
    .isIn(['CASHBACK', 'RATE_REDUCTION', 'FEE_WAIVER', 'BONUS_POINTS', 'GENERAL'])
    .withMessage('El tipo de promoción no es válido. Seleccione una opción de la lista'),

  body('status')
    .optional()
    .isIn(['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED'])
    .withMessage('El estado de la promoción no es válido. Seleccione una opción de la lista'),

  body('targetSegment')
    .optional()
    .isIn(['ALL', 'VIP', 'NEW', 'INACTIVE', 'PREMIUM'])
    .withMessage('El segmento objetivo no es válido. Seleccione una opción de la lista'),

  body('targetRoles')
    .optional()
    .isArray()
    .withMessage('Los roles objetivo deben enviarse como una lista'),

  body('targetRoles.*')
    .optional()
    .isIn(['USER_ROLE', 'EMPLOYEE_ROLE'])
    .withMessage('El rol seleccionado no es válido'),

  body('maxUsesGlobal')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('maxUsesGlobal debe ser un entero mayor que 0'),

  body('maxUsesPerUser')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('maxUsesPerUser debe ser un entero mayor que 0'),

  body('budget')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('budget debe ser un numero mayor que 0'),

  body('priority')
    .optional()
    .isInt({ min: 0 })
    .withMessage('priority debe ser un entero mayor o igual a 0'),

  body('stackable')
    .optional()
    .isBoolean()
    .withMessage('stackable debe ser true o false'),

  body('applicableServices')
    .optional()
    .isArray()
    .withMessage('applicableServices debe ser un array'),

  body('applicableServices.*')
    .optional()
    .isMongoId()
    .withMessage('Uno o más identificadores de servicios aplicables no son válidos'),

  body('internalNote')
    .optional()
    .isString()
    .withMessage('La nota interna debe ser texto')
    .isLength({ max: 300 })
    .withMessage('La nota interna no puede exceder 300 caracteres'),

  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('tags debe ser un array con maximo 10 elementos'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('Cada tag debe ser texto')
    .isLength({ max: 30 })
    .withMessage('Cada tag no puede exceder 30 caracteres'),

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
    .withMessage('El estado activo debe ser verdadero o falso')
    .toBoolean(),

  body('validFrom')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe ser una fecha válida')
    .toDate(),

  body('validTo')
    .optional()
    .isISO8601()
    .withMessage('La fecha de finalización debe ser una fecha válida')
    .toDate(),

  body('validTo')
    .optional()
    .custom((value, { req }) => {
      if (req.body.validFrom && value) {
        const start = new Date(req.body.validFrom);
        const end = new Date(value);
        if (end <= start) {
          throw new Error('La fecha de finalización debe ser posterior a la fecha de inicio');
        }
      }
      return true;
    }),

  body('imageUrl')
    .optional()
    .isURL({ require_protocol: true })
    .withMessage('La URL de la imagen debe ser válida y empezar con http:// o https://')
    .trim(),

  body('conditions')
    .optional()
    .custom((value) => {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        return true;
      }
      throw new Error('Las condiciones deben tener un formato de datos estructurado (objeto JSON)');
    }),

  body('type')
    .optional()
    .isIn(['CASHBACK', 'RATE_REDUCTION', 'FEE_WAIVER', 'BONUS_POINTS', 'GENERAL'])
    .withMessage('El tipo de promoción no es válido. Seleccione una opción de la lista'),

  body('status')
    .optional()
    .isIn(['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED'])
    .withMessage('El estado de la promoción no es válido. Seleccione una opción de la lista'),

  body('targetSegment')
    .optional()
    .isIn(['ALL', 'VIP', 'NEW', 'INACTIVE', 'PREMIUM'])
    .withMessage('El segmento objetivo no es válido. Seleccione una opción de la lista'),

  body('targetRoles')
    .optional()
    .isArray()
    .withMessage('Los roles objetivo deben enviarse como una lista'),

  body('targetRoles.*')
    .optional()
    .isIn(['USER_ROLE', 'EMPLOYEE_ROLE'])
    .withMessage('El rol seleccionado no es válido'),

  body('maxUsesGlobal')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('maxUsesGlobal debe ser un entero mayor que 0'),

  body('maxUsesPerUser')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('maxUsesPerUser debe ser un entero mayor que 0'),

  body('budget')
    .optional()
    .isFloat({ gt: 0 })
    .withMessage('budget debe ser un numero mayor que 0'),

  body('priority')
    .optional()
    .isInt({ min: 0 })
    .withMessage('priority debe ser un entero mayor o igual a 0'),

  body('stackable')
    .optional()
    .isBoolean()
    .withMessage('stackable debe ser true o false'),

  body('applicableServices')
    .optional()
    .isArray()
    .withMessage('applicableServices debe ser un array'),

  body('applicableServices.*')
    .optional()
    .isMongoId()
    .withMessage('Uno o más identificadores de servicios aplicables no son válidos'),

  body('internalNote')
    .optional()
    .isString()
    .withMessage('La nota interna debe ser texto')
    .isLength({ max: 300 })
    .withMessage('La nota interna no puede exceder 300 caracteres'),

  body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('tags debe ser un array con maximo 10 elementos'),

  body('tags.*')
    .optional()
    .isString()
    .withMessage('Cada tag debe ser texto')
    .isLength({ max: 30 })
    .withMessage('Cada tag no puede exceder 30 caracteres'),

  handleValidationErrors,
];

export const validatePromotionId = [
  param('id').isMongoId().withMessage('ID de promocion invalido'),
  handleValidationErrors,
];

// --- Nuevos validators ---

export const validatePromotionQuery = [
  query('active')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('El estado activo debe ser verdadero o falso'),

  query('status')
    .optional()
    .isIn(['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED'])
    .withMessage('El estado de la promoción no es válido. Seleccione una opción de la lista'),

  query('type')
    .optional()
    .isIn(['CASHBACK', 'RATE_REDUCTION', 'FEE_WAIVER', 'BONUS_POINTS', 'GENERAL'])
    .withMessage('El tipo de promoción no es válido. Seleccione una opción de la lista'),

  query('targetSegment')
    .optional()
    .isIn(['ALL', 'VIP', 'NEW', 'INACTIVE', 'PREMIUM'])
    .withMessage('targetSegment debe ser ALL, VIP, NEW, INACTIVE o PREMIUM'),

  query('q')
    .optional()
    .isString()
    .withMessage('q debe ser texto')
    .isLength({ max: 100 })
    .withMessage('q no puede exceder 100 caracteres'),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page debe ser un entero mayor o igual a 1'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit debe ser un entero entre 1 y 100'),

  query('sortBy')
    .optional()
    .isIn(['newest', 'oldest', 'priority_desc', 'validTo_asc'])
    .withMessage('sortBy debe ser newest, oldest, priority_desc o validTo_asc'),

  handleValidationErrors,
];

export const validateTogglePromotion = [
  body('action')
    .notEmpty()
    .withMessage('La accion es obligatoria')
    .isIn(['ACTIVATE', 'PAUSE', 'CANCEL'])
    .withMessage('action debe ser ACTIVATE, PAUSE o CANCEL'),

  body('reason')
    .if(body('action').equals('CANCEL'))
    .notEmpty()
    .withMessage('reason es obligatorio cuando la accion es CANCEL')
    .isString()
    .withMessage('reason debe ser texto')
    .isLength({ max: 300 })
    .withMessage('reason no puede exceder 300 caracteres'),

  handleValidationErrors,
];

export const validateApplyPromotion = [
  body('promotionId')
    .notEmpty()
    .withMessage('promotionId es obligatorio')
    .isMongoId()
    .withMessage('promotionId debe ser un MongoId valido'),

  body('accountNumber')
    .notEmpty()
    .withMessage('accountNumber es obligatorio')
    .isString()
    .withMessage('accountNumber debe ser texto')
    .matches(/^\d{10}$/)
    .withMessage('accountNumber debe ser una cadena de exactamente 10 digitos numericos'),

  handleValidationErrors,
];
