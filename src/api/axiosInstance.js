import axios from "axios";
import { API_URL } from "./config";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        Accept: "application/json"
    },
});

// Intercepteur pour ajouter le token automatiquement
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;