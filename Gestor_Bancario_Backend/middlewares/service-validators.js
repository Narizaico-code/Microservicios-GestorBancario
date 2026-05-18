'use strict';

import { body, param, query, validationResult } from 'express-validator';
import { allowedServiceFields } from './allowed-fields.js';

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

const ensureAllowedServiceFields = (req, res, next) => {
  const errors = [];
  const receivedFields = Object.keys(req.body || {});
  const unknownFields = receivedFields.filter(
    (field) => !allowedServiceFields.includes(field)
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

// --- Reglas comunes de validación ---
const nameRules = (isRequired = true) => {
  let chain = body('name');
  if (!isRequired) chain = chain.optional();
  return chain
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 120 })
    .withMessage('El nombre no puede exceder 120 caracteres')
    .custom((value) => {
      if (/[<>{}\[\]]/.test(value)) {
        throw new Error('El nombre contiene caracteres no permitidos (<>{}[])');
      }
      return true;
    });
};

const descriptionRules = (isRequired = true) => {
  let chain = body('description');
  if (!isRequired) chain = chain.optional();
  return chain
    .isString()
    .withMessage('La descripcion debe ser texto')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripcion debe tener al menos 10 caracteres')
    .isLength({ max: 500 })
    .withMessage('La descripcion no puede exceder 500 caracteres');
};

const typeRules = (isRequired = true) => {
  let chain = body('type');
  if (!isRequired) chain = chain.optional();
  return chain
    .isIn(['PRODUCT', 'SERVICE'])
    .withMessage('El tipo de ítem debe ser un producto o un servicio válido');
};

const priceRules = (isRequired = true) => {
  let chain = body('price');
  if (!isRequired) chain = chain.optional();
  return chain
    .isFloat({ gt: 0, max: 9999999.99 })
    .withMessage('El precio debe ser mayor que 0 y no exceder 9,999,999.99');
};

const commonOptionalRules = () => [
  body('currency')
    .optional()
    .isIn(['GTQ', 'USD', 'EUR', 'MXN'])
    .withMessage('La moneda seleccionada no es válida'),

  body('category')
    .optional()
    .isString()
    .withMessage('La categoria debe ser texto')
    .trim()
    .isLength({ max: 60 })
    .withMessage('La categoria no puede exceder 60 caracteres'),

  body('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'])
    .withMessage('El estado seleccionado no es válido'),

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
          throw new Error('validTo debe ser posterior a validFrom');
        }
      }
      return true;
    }),

  body('imageUrl')
    .optional()
    .isURL({ require_protocol: true })
    .withMessage('La URL de la imagen debe ser válida y empezar con http:// o https://')
    .trim(),

  body('minBalance')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minBalance debe ser un numero mayor o igual a 0'),

  body('maxUsesPerUser')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('El límite de usos por usuario debe ser un número mayor a cero'),

  body('totalUsesLimit')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('El límite total de usos debe ser un número mayor a cero'),

  body('targetRoles')
    .optional()
    .isArray()
    .withMessage('targetRoles debe ser un array'),

  body('targetRoles.*')
    .optional()
    .isIn(['USER_ROLE', 'EMPLOYEE_ROLE', 'ADMIN_ROLE'])
    .withMessage('El rol seleccionado no es válido'),

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

  body('internalNote')
    .optional()
    .isString()
    .withMessage('La nota interna debe ser texto')
    .isLength({ max: 300 })
    .withMessage('La nota interna no puede exceder 300 caracteres'),

  body('requiresVerifiedEmail')
    .optional()
    .isBoolean()
    .withMessage('El campo requiere correo verificado debe ser verdadero o falso'),
];

const termsConditionalRules = () =>
  body('terms')
    .custom((value, { req }) => {
      if (req.body.type === 'SERVICE' && (!value || String(value).trim() === '')) {
        throw new Error('Los terminos son obligatorios cuando el tipo es SERVICE');
      }
      return true;
    })
    .optional()
    .isString()
    .withMessage('Los terminos deben ser texto')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Los terminos no pueden exceder 1000 caracteres');

const discountRules = () => [
  body('discount')
    .optional()
    .custom((value) => {
      if (value !== null && (typeof value !== 'object' || Array.isArray(value))) {
        throw new Error('discount debe ser un objeto');
      }
      return true;
    }),

  body('discount.type')
    .if(body('discount').exists({ values: 'falsy' }).not())
    .if(body('discount').isObject())
    .notEmpty()
    .withMessage('discount.type es requerido')
    .isIn(['PERCENT', 'AMOUNT'])
    .withMessage('El tipo de descuento debe ser por porcentaje o monto fijo'),

  body('discount.value')
    .if(body('discount').exists({ values: 'falsy' }).not())
    .if(body('discount').isObject())
    .notEmpty()
    .withMessage('discount.value es requerido')
    .isFloat({ gt: 0 })
    .withMessage('discount.value debe ser mayor que 0')
    .custom((value, { req }) => {
      const discount = req.body.discount;
      if (discount && discount.type === 'PERCENT' && value > 100) {
        throw new Error('discount.value no puede exceder 100 cuando el tipo es PERCENT');
      }
      if (discount && discount.type === 'AMOUNT' && req.body.price && value > req.body.price) {
        throw new Error('discount.value no puede exceder el precio cuando el tipo es AMOUNT');
      }
      return true;
    }),

  body('discount.startAt')
    .optional()
    .isISO8601()
    .withMessage('discount.startAt debe ser una fecha ISO8601 valida')
    .toDate(),

  body('discount.endAt')
    .optional()
    .isISO8601()
    .withMessage('discount.endAt debe ser una fecha ISO8601 valida')
    .toDate()
    .custom((value, { req }) => {
      if (req.body.discount?.startAt && value) {
        const start = new Date(req.body.discount.startAt);
        const end = new Date(value);
        if (end <= start) {
          throw new Error('discount.endAt debe ser posterior a discount.startAt');
        }
      }
      return true;
    }),

  body('discount.minAmount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('discount.minAmount debe ser mayor o igual a 0')
    .custom((value, { req }) => {
      if (req.body.price && value > req.body.price) {
        throw new Error('discount.minAmount no puede exceder el precio');
      }
      return true;
    }),

  body('discount.maxUses')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('discount.maxUses debe ser un entero mayor que 0'),

  body('discount.terms')
    .optional()
    .isString()
    .withMessage('discount.terms debe ser texto')
    .isLength({ max: 500 })
    .withMessage('discount.terms no puede exceder 500 caracteres'),
];

// --- Exports ---

export const validateCreateService = [
  nameRules(true),
  descriptionRules(true),
  typeRules(true),
  priceRules(true),
  ...commonOptionalRules(),
  termsConditionalRules(),
  ...discountRules(),
  handleValidationErrors,
];

export const validateUpdateService = [
  ensureAllowedServiceFields,
  nameRules(false),
  descriptionRules(false),
  typeRules(false),
  priceRules(false),
  ...commonOptionalRules(),
  body('terms')
    .optional()
    .isString()
    .withMessage('Los terminos deben ser texto')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Los terminos no pueden exceder 1000 caracteres'),
  ...discountRules(),
  handleValidationErrors,
];

export const validateServiceId = [
  param('id').isMongoId().withMessage('ID de servicio invalido'),
  handleValidationErrors,
];

export const validateServiceQuery = [
  query('type')
    .optional()
    .isIn(['PRODUCT', 'SERVICE'])
    .withMessage('type debe ser PRODUCT o SERVICE'),

  query('status')
    .optional()
    .isIn(['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'])
    .withMessage('status debe ser DRAFT, ACTIVE, INACTIVE o ARCHIVED'),

  query('category')
    .optional()
    .isString()
    .withMessage('category debe ser texto'),

  query('active')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('El estado activo debe ser verdadero o falso'),

  query('q')
    .optional()
    .isString()
    .withMessage('q debe ser texto')
    .isLength({ max: 100 })
    .withMessage('q no puede exceder 100 caracteres'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('minPrice debe ser un numero mayor o igual a 0'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('maxPrice debe ser un numero mayor o igual a 0')
    .custom((value, { req }) => {
      if (req.query.minPrice && parseFloat(value) <= parseFloat(req.query.minPrice)) {
        throw new Error('maxPrice debe ser mayor que minPrice');
      }
      return true;
    }),

  query('currency')
    .optional()
    .isIn(['GTQ', 'USD', 'EUR', 'MXN'])
    .withMessage('currency debe ser GTQ, USD, EUR o MXN'),

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
    .isIn(['price_asc', 'price_desc', 'newest', 'oldest', 'name_asc'])
    .withMessage('sortBy debe ser price_asc, price_desc, newest, oldest o name_asc'),

  query('targetRole')
    .optional()
    .isIn(['USER_ROLE', 'EMPLOYEE_ROLE'])
    .withMessage('targetRole debe ser USER_ROLE o EMPLOYEE_ROLE'),

  handleValidationErrors,
];
