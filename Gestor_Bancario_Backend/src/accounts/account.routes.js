'use strict';

import { Router } from 'express';
const router = Router();


import {
    createAccount,
    getAccounts,
    updateAccountStatus
} from './account.controller.js';

import { validateCreateAccount } from '../../middlewares/validateCreateAccount.js';
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js';
import parseFormData from '../../middlewares/parseFormData.js';


router.post(
    '/account/create',
    validateJWT,
    parseFormData,
    isAdmin,
    validateCreateAccount,
    createAccount
);


router.get(
    '/account/get',
    validateJWT,
    getAccounts
);

router.patch(
    '/account/:numeroCuenta/status',
    validateJWT,
    isAdmin,
    updateAccountStatus
);

export default router;
