import { Router } from 'express';
import {
  createPromotion,
  listPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} from './promotion.controller.js';
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js';
import {
  validateCreatePromotion,
  validateUpdatePromotion,
  validatePromotionId,
} from '../../middlewares/promotion-validators.js';

const router = Router();

router.post('/', validateJWT, isAdmin, validateCreatePromotion, createPromotion);
router.get('/', validateJWT, listPromotions);
router.get('/:id', validateJWT, validatePromotionId, getPromotionById);
router.put(
  '/:id',
  validateJWT,
  isAdmin,
  validatePromotionId,
  validateUpdatePromotion,
  updatePromotion
);
router.delete('/:id', validateJWT, isAdmin, validatePromotionId, deletePromotion);

export default router;
