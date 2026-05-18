'use strict';

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const promotionUsageSchema = new Schema(
  {
    promotionId: {
      type: Schema.Types.ObjectId,
      ref: 'Promotion',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    usedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['APPLIED', 'REVERSED'],
      default: 'APPLIED',
    },
    benefitDetails: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Índices
promotionUsageSchema.index({ promotionId: 1, userId: 1 });
promotionUsageSchema.index({ userId: 1 });
promotionUsageSchema.index({ usedAt: -1 });

export default model('PromotionUsage', promotionUsageSchema);
