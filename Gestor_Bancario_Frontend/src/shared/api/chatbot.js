import axios from "axios";
import { loadSession } from "../utils/session-storage.js";
import { API_CONFIG } from "./api.js";

const getAuthToken = () => {
  const session = loadSession();
  return session?.token || null;
};

export const axiosChatbot = axios.create({
  baseURL: API_CONFIG.bankBaseUrl + '/chatbot',
  timeout: 30000, // Gemini responses might take longer (up to 30s)
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosChatbot.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['x-token'] = token;
  }
  return config;
});

export default axiosChatbot;