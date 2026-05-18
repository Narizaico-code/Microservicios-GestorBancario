import { Router } from 'express';
import {
  createService,
  listServices,
  getServiceById,
  updateService,
  deleteService,
} from './service.controller.js';
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js';
import {
  validateCreateService,
  validateUpdateService,
  validateServiceId,
  validateServiceQuery,
} from '../../middlewares/service-validators.js';
import { checkServiceEligibility } from '../../middlewares/checkServiceEligibility.js';
import { uploadFieldImage } from '../../middlewares/file-uploader.js';
import { parseJsonFields } from '../../middlewares/parse-json-fields.js';

const router = Router();

router.post(
  '/',
  validateJWT,
  isAdmin,
  uploadFieldImage.single('image'),
  parseJsonFields(['discount', 'targetRoles', 'tags']),
  validateCreateService,
  createService
);
router.get('/', validateJWT, validateServiceQuery, listServices);
router.get('/:id', validateJWT, validateServiceId, checkServiceEligibility, getServiceById);
router.put(
  '/:id',
  validateJWT,
  isAdmin,
  validateServiceId,
  uploadFieldImage.single('image'),
  parseJsonFields(['discount', 'targetRoles', 'tags']),
  validateUpdateService,
  updateService
);
router.delete('/:id', validateJWT, isAdmin, validateServiceId, deleteService);

export default router;
