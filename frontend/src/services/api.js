import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    withCredentials: true,
});

// Keep the current access token available to the API service.
let accessToken = null;

export function setAccessToken(token) {
    accessToken = token;
}

// Attach the token to every protected API request.
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

export default api;