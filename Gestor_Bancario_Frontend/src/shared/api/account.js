import { axiosAccount } from "./api";

const getAccounts = async () => {
    return await axiosAccount.get("/account/get");
};