import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { validateJWT } from '../../middlewares/validate-JWT.js';
import { getUserChats, getChatById, sendMessage } from './chatbot.controller.js';

const router = Router();

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
};

// Todas las rutas requieren estar autenticado
router.use(validateJWT);

// Listar historial de conversaciones
router.get('/', getUserChats);

// Obtener una conversación específica
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], getChatById);

// Enviar un mensaje
router.post('/', [
    check('message', 'El mensaje es requerido').not().isEmpty(),
    check('chatId', 'El chatId debe ser de mongo').optional().isMongoId(),
    validarCampos
], sendMessage);

export default router;