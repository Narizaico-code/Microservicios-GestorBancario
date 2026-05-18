'use strict';

import Account from './account.model.js';
import AccountRequest from './account-request.model.js';

/**
 * CREAR CUENTA
 */
export const createAccount = async (req, res) => {
    try {
        // ...validación deshabilitada para pruebas...

        const accountData = {
            ...req.body,
            estado: true,
            userId: req.body.userId // id del usuario dueño de la cuenta
        };

        const account = new Account(accountData);
        await account.save();

        const accountResponse = account.toObject();
        delete accountResponse._id;

        res.status(201).json({
            success: true,
            message: 'Cuenta creada exitosamente',
            data: accountResponse
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: 'Error al crear la cuenta',
            error: error.message
        });

    }
};

/**
 * SOLICITAR CREACION DE CUENTA (CLIENTE)
 */
export const requestAccountCreation = async (req, res) => {
    try {
        const { tipoCuenta, moneda } = req.body || {};

        if (!tipoCuenta || !['AHORRO', 'MONETARIA'].includes(tipoCuenta)) {
            return res.status(400).json({
                success: false,
                message: 'El tipo de cuenta es requerido y debe ser AHORRO o MONETARIA',
            });
        }

        if (!moneda || !['GTQ', 'USD', 'EUR', 'MXN', 'COP', 'JPY'].includes(moneda)) {
            return res.status(400).json({
                success: false,
                message: 'La moneda es requerida y debe ser una moneda valida',
            });
        }

        if (req.body?.saldo !== undefined || req.body?.estado !== undefined) {
            return res.status(400).json({
                success: false,
                message: 'No puedes enviar saldo ni estado al solicitar una cuenta',
            });
        }

        const pendingRequest = await AccountRequest.findOne({
            userId: req.userId,
            status: 'PENDING',
        }).lean();

        if (pendingRequest) {
            return res.status(409).json({
                success: false,
                message: 'Ya tienes una solicitud pendiente de aprobacion',
                data: pendingRequest,
            });
        }

        const request = await AccountRequest.create({
            userId: req.userId,
            tipoCuenta,
            moneda,
            status: 'PENDING',
        });

        return res.status(201).json({
            success: true,
            message: 'Solicitud enviada. Un administrador debe aprobarla.',
            data: request,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al crear la solicitud de cuenta',
            error: error.message,
        });
    }
};

/**
 * LISTAR SOLICITUDES DE CUENTA (ADMIN)
 */
export const getAccountRequests = async (req, res) => {
    try {
        const status = (req.query?.status || 'PENDING').toUpperCase();
        const allowedStatus = ['PENDING', 'APPROVED', 'DENIED', 'ALL'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'El estado debe ser PENDING, APPROVED, DENIED o ALL',
            });
        }

        const filter = status === 'ALL' ? {} : { status };
        const requests = await AccountRequest.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            data: requests,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al obtener solicitudes de cuenta',
            error: error.message,
        });
    }
};

/**
 * APROBAR SOLICITUD DE CUENTA (ADMIN)
 */
export const approveAccountRequest = async (req, res) => {
    try {
        const { requestId } = req.params;

        const accountRequest = await AccountRequest.findById(requestId);
        if (!accountRequest) {
            return res.status(404).json({
                success: false,
                message: 'Solicitud no encontrada',
            });
        }

        if (accountRequest.status !== 'PENDING') {
            return res.status(409).json({
                success: false,
                message: 'Solo se pueden aprobar solicitudes pendientes',
            });
        }

        const account = new Account({
            userId: accountRequest.userId,
            tipoCuenta: accountRequest.tipoCuenta,
            moneda: accountRequest.moneda,
            saldo: 0,
            estado: true,
        });

        await account.save();

        accountRequest.status = 'APPROVED';
        accountRequest.reviewedBy = req.userId;
        accountRequest.reviewedAt = new Date();
        accountRequest.reviewComment = null;
        await accountRequest.save();

        return res.status(200).json({
            success: true,
            message: 'Solicitud aprobada y cuenta creada exitosamente',
            data: {
                request: accountRequest,
                account,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al aprobar la solicitud de cuenta',
            error: error.message,
        });
    }
};

/**
 * DENEGAR SOLICITUD DE CUENTA (ADMIN)
 */
export const denyAccountRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { comment } = req.body || {};

        const accountRequest = await AccountRequest.findById(requestId);
        if (!accountRequest) {
            return res.status(404).json({
                success: false,
                message: 'Solicitud no encontrada',
            });
        }

        if (accountRequest.status !== 'PENDING') {
            return res.status(409).json({
                success: false,
                message: 'Solo se pueden denegar solicitudes pendientes',
            });
        }

        accountRequest.status = 'DENIED';
        accountRequest.reviewedBy = req.userId;
        accountRequest.reviewedAt = new Date();
        accountRequest.reviewComment = comment ? String(comment).trim() : null;

        await accountRequest.save();

        return res.status(200).json({
            success: true,
            message: 'Solicitud denegada correctamente',
            data: accountRequest,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al denegar la solicitud de cuenta',
            error: error.message,
        });
    }
};


/**
 * OBTENER CUENTAS (Paginadas)
 */
export const getAccounts = async (req, res) => {
    try {

        const { page = 1, limit = 10, estado, misCuentas } = req.query;

        const pageNumber = Math.max(parseInt(page, 10) || 1, 1);
        const limitNumber = Math.max(parseInt(limit, 10) || 10, 1);

        const normalizedEstado = typeof estado === 'string' ? estado.toLowerCase() : estado;
        const filter = {};

        if (normalizedEstado !== 'all') {
            const estadoValue = typeof normalizedEstado === 'string'
                ? normalizedEstado === 'true'
                : normalizedEstado;
            filter.estado = estadoValue === undefined ? true : estadoValue;
        }

        const isAdmin = req.userRole === 'ADMIN_ROLE';

        // Si el usuario quiere ver solo sus cuentas, o si NO es admin (solo puede ver las suyas)
        if (misCuentas === 'true' || !isAdmin) {
            filter.userId = req.userId;
        }

        // Opciones
        const options = {
            page: pageNumber,
            limit: limitNumber,
            sort: { createdAt: -1 } // Corregido a createdAt que genera mongoose por defecto
        };

        // Buscar cuentas
        const accounts = await Account.find(filter)
            .select('-_id')
            .limit(options.limit)
            .skip((pageNumber - 1) * limitNumber)
            .sort(options.sort)
            .lean(); // Usar lean para retornar objetos planos

        // Total
        const total = await Account.countDocuments(filter);

        // Sanitizar datos sensibles
        const sanitizedAccounts = accounts.map(account => {
            // Si el usuario autenticado no es el dueño de la cuenta y no es admin, ocultamos el saldo
            if (!isAdmin && String(account.userId) !== String(req.userId)) {
                delete account.saldo;
            }
            return account;
        });

        res.status(200).json({
            success: true,
            data: sanitizedAccounts,
            pagination: {
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
                totalRecords: total,
                limit: limitNumber
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: 'Error al obtener las cuentas',
            error: error.message
        });

    }
};

/**
 * ACTUALIZAR ESTADO DE CUENTA
 */
export const updateAccountStatus = async (req, res) => {
    try {
        const { numeroCuenta } = req.params;
        const { estado } = req.body || {};

        if (!numeroCuenta) {
            return res.status(400).json({
                success: false,
                message: 'El numero de cuenta es requerido',
            });
        }

        const account = await Account.findOne({ numeroCuenta });

        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Cuenta no encontrada',
            });
        }

        const nextEstado = typeof estado === 'boolean' ? estado : !account.estado;
        account.estado = nextEstado;
        await account.save();

        const accountResponse = account.toObject();
        delete accountResponse._id;

        return res.status(200).json({
            success: true,
            message: 'Estado de cuenta actualizado',
            data: accountResponse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error al actualizar la cuenta',
            error: error.message,
        });
    }
};


