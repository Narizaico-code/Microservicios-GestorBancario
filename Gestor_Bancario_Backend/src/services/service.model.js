'use strict';

import { Schema, model } from 'mongoose';

const discountSchema = new Schema(
  {
    type: {
      type: String,
      enum: ['PERCENT', 'AMOUNT'],
    },
    value: {
      type: Number,
      min: [0, 'El valor del descuento no puede ser negativo'],
    },
    startAt: {
      type: Date,
    },
    endAt: {
      type: Date,
    },
    minAmount: {
      type: Number,
      min: [0, 'El monto minimo no puede ser negativo'],
    },
    maxUses: {
      type: Number,
      min: [1, 'El maximo de usos debe ser al menos 1'],
    },
    terms: {
      type: String,
      trim: true,
    },
    usesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const serviceSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripcion es requerida'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'El tipo es requerido'],
      enum: ['PRODUCT', 'SERVICE'],
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    terms: {
      type: String,
      trim: true,
    },
    validFrom: {
      type: Date,
    },
    validTo: {
      type: Date,
    },
    discount: {
      type: discountSchema,
      default: null,
    },
    // --- Campos nuevos ---
    status: {
      type: String,
      enum: ['DRAFT', 'ACTIVE', 'INACTIVE', 'ARCHIVED'],
      default: 'DRAFT',
    },
    createdBy: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      default: null,
    },
    targetRoles: {
      type: [String],
      enum: ['USER_ROLE', 'EMPLOYEE_ROLE', 'ADMIN_ROLE'],
      default: ['USER_ROLE'],
    },
    minBalance: {
      type: Number,
      default: 0,
    },
    requiresVerifiedEmail: {
      type: Boolean,
      default: true,
    },
    maxUsesPerUser: {
      type: Number,
      default: null,
    },
    totalUsesLimit: {
      type: Number,
      default: null,
    },
    currentUses: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      enum: ['GTQ', 'USD', 'EUR', 'MXN'],
      default: 'GTQ',
    },
    tags: {
      type: [String],
      default: [],
    },
    internalNote: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
serviceSchema.index({ name: 1 }, { unique: true });
serviceSchema.index({ status: 1 });
serviceSchema.index({ type: 1, status: 1 });
serviceSchema.index({ targetRoles: 1 });
serviceSchema.index({ tags: 1 });

export default model('Service', serviceSchema);
