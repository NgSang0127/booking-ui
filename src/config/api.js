import axios from "axios";
import keycloak from "../keycloak/keycloak";

export const API_BASE_URL = "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
});

api.interceptors.request.use(
    async (config) => {
        if (keycloak.token) {
            try {
                await keycloak.updateToken(70);
                config.headers.Authorization = `Bearer ${keycloak.token}`;
            } catch (error) {
                keycloak.login();
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;