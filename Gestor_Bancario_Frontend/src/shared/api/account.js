import { axiosAccount } from "./api";

export const getAccounts = async () => {
    return await axiosAccount.get("/account/get");
};

export const getAllAccountsAdmin = async (page = 1, limit = 100) => {
    return await axiosAccount.get(`/account/get?page=${page}&limit=${limit}`);
};