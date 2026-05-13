'use strict';

import { Schema, model } from 'mongoose';

const promotionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      unique: true,
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

promotionSchema.index({ name: 1 }, { unique: true });

export default model('Promotion', promotionSchema);
