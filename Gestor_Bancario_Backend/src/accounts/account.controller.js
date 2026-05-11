'use strict';

import Account from './account.model.js';

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

        // Si el usuario quiere ver solo sus cuentas
        if (misCuentas === 'true') {
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
        const isAdmin = req.userRole === 'ADMIN_ROLE';
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


