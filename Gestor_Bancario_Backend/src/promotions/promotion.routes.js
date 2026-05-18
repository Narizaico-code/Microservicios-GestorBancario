import { Router } from 'express';
import {
  createPromotion,
  listPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus,
  getPromotionStats,
} from './promotion.controller.js';
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js';
import {
  validateCreatePromotion,
  validateUpdatePromotion,
  validatePromotionId,
  validatePromotionQuery,
  validateTogglePromotion,
} from '../../middlewares/promotion-validators.js';
import { checkPromotionEligibility } from '../../middlewares/checkPromotionEligibility.js';
import { uploadFieldImage } from '../../middlewares/file-uploader.js';
import { parseJsonFields } from '../../middlewares/parse-json-fields.js';

const router = Router();

router.post(
  '/',
  validateJWT,
  isAdmin,
  uploadFieldImage.single('image'),
  parseJsonFields(['conditions', 'targetRoles', 'applicableServices', 'tags']),
  validateCreatePromotion,
  createPromotion
);
router.get('/', validateJWT, validatePromotionQuery, listPromotions);
router.get('/:id', validateJWT, validatePromotionId, checkPromotionEligibility, getPromotionById);
router.put(
  '/:id',
  validateJWT,
  isAdmin,
  validatePromotionId,
  uploadFieldImage.single('image'),
  parseJsonFields(['conditions', 'targetRoles', 'applicableServices', 'tags']),
  validateUpdatePromotion,
  updatePromotion
);
router.delete('/:id', validateJWT, isAdmin, validatePromotionId, deletePromotion);
router.patch('/:id/toggle', validateJWT, isAdmin, validatePromotionId, validateTogglePromotion, togglePromotionStatus);
router.get('/:id/stats', validateJWT, isAdmin, validatePromotionId, getPromotionStats);

export default router;
