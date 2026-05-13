'use strict';

import { Router } from 'express';
const router = Router();


import {
    createAccount,
    getAccounts,
    updateAccountStatus,
    requestAccountCreation,
    getAccountRequests,
    approveAccountRequest,
    denyAccountRequest,
} from './account.controller.js';

import { validateCreateAccount } from '../../middlewares/validateCreateAccount.js';
import { validateJWT, isAdmin } from '../../middlewares/validate-JWT.js';
import { validateClientRole } from '../../middlewares/validate-ClientRole.js';
import parseFormData from '../../middlewares/parseFormData.js';


router.post(
    '/account/create',
    validateJWT,
    parseFormData,
    isAdmin,
    validateCreateAccount,
    createAccount
);

router.post(
    '/account/request-create',
    validateJWT,
    validateClientRole,
    parseFormData,
    requestAccountCreation
);

router.get(
    '/account/requests',
    validateJWT,
    isAdmin,
    getAccountRequests
);

router.patch(
    '/account/requests/:requestId/approve',
    validateJWT,
    isAdmin,
    approveAccountRequest
);

router.patch(
    '/account/requests/:requestId/deny',
    validateJWT,
    isAdmin,
    denyAccountRequest
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
