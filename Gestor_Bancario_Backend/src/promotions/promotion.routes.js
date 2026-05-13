import { Router } from 'express';
import {
  createPromotion,
  listPromotions,
  getPromotionById,
  updatePromotion,
  deletePromotion,
} from './promotion.controller.js';
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js';

const router = Router();

router.post('/', validateJWT, isAdmin, createPromotion);
router.get('/', validateJWT, listPromotions);
router.get('/:id', validateJWT, getPromotionById);
router.put('/:id', validateJWT, isAdmin, updatePromotion);
router.delete('/:id', validateJWT, isAdmin, deletePromotion);

export default router;
