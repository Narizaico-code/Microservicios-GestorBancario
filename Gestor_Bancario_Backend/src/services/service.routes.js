import { Router } from 'express';
import {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService,
} from './service.controller.js';
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js';

const router = Router();

router.post('/', validateJWT, isAdmin, createService);
router.get('/', validateJWT, listServices);
router.get('/:id', validateJWT, getServiceById);
router.put('/:id', validateJWT, isAdmin, updateService);
router.delete('/:id', validateJWT, isAdmin, deleteService);

export default router;
