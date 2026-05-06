import { axiosAccount } from "./api";

export const getAccounts = async () => {
    return await axiosAccount.get("/account/get");
};