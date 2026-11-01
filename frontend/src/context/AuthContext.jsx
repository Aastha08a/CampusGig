import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';

import axios from 'axios';
import api, { setAccessToken } from '../services/api';

const AuthContext = createContext();

const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessTokenState] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = useCallback((userData, token) => {
        setUser(userData);
        setAccessToken(token);
        setAccessTokenState(token);
    }, []);

    const logout = useCallback(async () => {
        try {
            await axios.post(
                `${API_BASE_URL}/auth/logout`,
                {},
                { withCredentials: true }
            );
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            setUser(null);
            setAccessToken(null);
            setAccessTokenState(null);
        }
    }, []);

    // Restore a session when the app opens.
    useEffect(() => {
        let cancelled = false;

        async function restoreSession() {
            try {
                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    { withCredentials: true }
                );

                const token = response.data.accessToken;

                const profileResponse = await axios.get(
                    `${API_BASE_URL}/users/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        withCredentials: true,
                    }
                );

                if (!cancelled) {
                    setAccessToken(token);
                    setAccessTokenState(token);
                    setUser(profileResponse.data);
                }
            } catch (error) {
                console.error(
                    'Session restoration failed:',
                    error.response?.status,
                    error.response?.data || error.message
                );

                if (!cancelled) {
                    setAccessToken(null);
                    setAccessTokenState(null);
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        restoreSession();

        return () => {
            cancelled = true;
        };
    }, []);

    // Attach the current access token and refresh it after a 401.
    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (accessToken) {
                    config.headers = config.headers || {};
                    config.headers.Authorization =
                        `Bearer ${accessToken}`;
                }

                return config;
            }
        );

        const responseInterceptor = api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response?.status !== 401 ||
                    !originalRequest ||
                    originalRequest._retry ||
                    originalRequest.url?.includes('/auth/refresh-token') ||
                    originalRequest.url?.includes('/auth/login')
                ) {
                    return Promise.reject(error);
                }

                originalRequest._retry = true;

                try {
                    const response = await axios.post(
                        `${API_BASE_URL}/auth/refresh-token`,
                        {},
                        { withCredentials: true }
                    );

                    const newToken = response.data.accessToken;

                    setAccessToken(newToken);
                    setAccessTokenState(newToken);

                    originalRequest.headers =
                        originalRequest.headers || {};

                    originalRequest.headers.Authorization =
                        `Bearer ${newToken}`;

                    return api(originalRequest);
                } catch (refreshError) {
                    setUser(null);
                    setAccessToken(null);
                    setAccessTokenState(null);

                    return Promise.reject(refreshError);
                }
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken]);

    return (
        <AuthContext.Provider
            value={{
                user,
                accessToken,
                login,
                logout,
                loading,
                api,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
