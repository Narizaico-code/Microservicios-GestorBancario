import axios from "axios";

const axiosAccount = axios.create({
  baseURL: import.meta.env.VITE_ACCOUNT_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
axiosAccount.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});*/


export { axiosAccount };
export { ApiError, requestJson, requestFormData } from '../services/api-client.js'