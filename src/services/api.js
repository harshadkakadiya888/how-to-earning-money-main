import axios from "axios";
import { getToken } from "../utils/auth";

const API = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error?.response) {
      console.error("Network/CORS error (no response):", {
        message: error?.message,
        url: error?.config?.baseURL ? `${error.config.baseURL}${error.config.url || ""}` : error?.config?.url,
        method: error?.config?.method,
      });
    }
    return Promise.reject(error);
  },
);

export default api;
