'use strict';

import { Schema, model } from 'mongoose';

const accountRequestSchema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'El id del usuario es requerido'],
      trim: true,
    },
    tipoCuenta: {
      type: String,
      required: [true, 'El tipo de cuenta es requerido'],
      enum: {
        values: ['AHORRO', 'MONETARIA'],
        message: 'Tipo de cuenta no valido',
      },
    },
    moneda: {
      type: String,
      required: [true, 'La moneda es requerida'],
      enum: {
        values: ['GTQ', 'USD', 'EUR', 'MXN', 'COP', 'JPY'],
        message: 'Moneda no valida',
      },
    },
    status: {
      type: String,
      default: 'PENDING',
      enum: {
        values: ['PENDING', 'APPROVED', 'DENIED'],
        message: 'Estado de solicitud no valido',
      },
    },
    reviewedBy: {
      type: String,
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewComment: {
      type: String,
      default: null,
      trim: true,
      maxlength: [250, 'El comentario no puede exceder 250 caracteres'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

accountRequestSchema.index({ userId: 1, status: 1 });
accountRequestSchema.index({ createdAt: -1 });

export default model('AccountRequest', accountRequestSchema);
