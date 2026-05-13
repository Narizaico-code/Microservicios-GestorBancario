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
      unique: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

serviceSchema.index({ name: 1 }, { unique: true });

export default model('Service', serviceSchema);
