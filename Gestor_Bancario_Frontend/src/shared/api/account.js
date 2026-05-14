import { API_CONFIG, axiosAccount, requestFormData } from "./api";

export const getAccounts = async () => {
    return await axiosAccount.get("/account/get");
};

export const getMyAccounts = async (page = 1, limit = 10) => {
    return await axiosAccount.get(`/account/get?misCuentas=true&page=${page}&limit=${limit}`);
};

export const getAllAccountsAdmin = async (page = 1, limit = 100, estado = 'all') => {
    const estadoQuery = estado ? `&estado=${encodeURIComponent(estado)}` : '';
    return await axiosAccount.get(`/account/get?page=${page}&limit=${limit}${estadoQuery}`);
};

export const updateAccountStatus = async (numeroCuenta, estado) => {
    return await axiosAccount.patch(`/account/${numeroCuenta}/status`, { estado });
};

export const createAccountAdmin = async ({ userId, tipoCuenta, moneda, saldo, estado }) => {
    const payload = {
        userId,
        tipoCuenta,
        moneda,
        saldo,
    };

    if (typeof estado === "boolean") {
        payload.estado = estado;
    }

    return await requestFormData(`${API_CONFIG.bankBaseUrl}/account/create`, {
        method: "POST",
        body: payload,
    });
};

export const requestAccountCreation = async ({ tipoCuenta, moneda }) => {
    return await requestFormData(`${API_CONFIG.bankBaseUrl}/account/request-create`, {
        method: "POST",
        body: {
            tipoCuenta,
            moneda,
        },
    });
};

export const getAccountCreationRequests = async (status = "PENDING") => {
    const statusQuery = status ? `?status=${encodeURIComponent(status)}` : "";
    return await axiosAccount.get(`/account/requests${statusQuery}`);
};

export const approveAccountCreationRequest = async (requestId) => {
    return await axiosAccount.patch(`/account/requests/${requestId}/approve`);
};

export const denyAccountCreationRequest = async (requestId, comment = "") => {
    return await axiosAccount.patch(`/account/requests/${requestId}/deny`, {
        comment,
    });
};