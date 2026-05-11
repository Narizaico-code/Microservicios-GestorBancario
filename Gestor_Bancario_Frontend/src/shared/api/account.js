import { axiosAccount } from "./api";

export const getAccounts = async () => {
    return await axiosAccount.get("/account/get");
};

export const getAllAccountsAdmin = async (page = 1, limit = 100, estado = 'all') => {
    const estadoQuery = estado ? `&estado=${encodeURIComponent(estado)}` : '';
    return await axiosAccount.get(`/account/get?page=${page}&limit=${limit}${estadoQuery}`);
};

export const updateAccountStatus = async (numeroCuenta, estado) => {
    return await axiosAccount.patch(`/account/${numeroCuenta}/status`, { estado });
};