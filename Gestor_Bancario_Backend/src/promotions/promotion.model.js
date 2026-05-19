'use strict';

import { Schema, model } from 'mongoose';

const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    terms: {
      type: String,
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    validFrom: {
      type: Date,
    },
    validTo: {
      type: Date,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    conditions: {
      type: Schema.Types.Mixed,
    },
    // --- Campos nuevos ---
    type: {
      type: String,
      enum: ['CASHBACK', 'RATE_REDUCTION', 'FEE_WAIVER', 'BONUS_POINTS', 'GENERAL'],
      default: 'GENERAL',
    },
    status: {
      type: String,
      enum: ['DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED'],
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
    targetSegment: {
      type: String,
      enum: ['ALL', 'VIP', 'NEW', 'INACTIVE', 'PREMIUM'],
      default: 'ALL',
    },
    targetRoles: {
      type: [String],
      enum: ['USER_ROLE', 'EMPLOYEE_ROLE'],
      default: ['USER_ROLE'],
    },
    maxUsesGlobal: {
      type: Number,
      default: null,
    },
    maxUsesPerUser: {
      type: Number,
      default: 1,
    },
    currentUsesGlobal: {
      type: Number,
      default: 0,
    },
    budget: {
      type: Number,
      default: null,
    },
    budgetUsed: {
      type: Number,
      default: 0,
    },
    priority: {
      type: Number,
      default: 0,
    },
    stackable: {
      type: Boolean,
      default: false,
    },
    applicableServices: {
      type: [String],
      default: [],
    },
    internalNote: {
      type: String,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
promotionSchema.index({ name: 1 }, { unique: true });
promotionSchema.index({ status: 1 });
promotionSchema.index({ type: 1, status: 1 });
promotionSchema.index({ targetSegment: 1 });
promotionSchema.index({ validFrom: 1, validTo: 1 });

export default model('Promotion', promotionSchema);
