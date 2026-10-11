import {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';

import axios from 'axios';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = (userData, token) => {
        setUser(userData);
        setAccessToken(token);
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
    };

    useEffect(() => {
        async function restoreSession() {
            try {
                const response = await axios.post(
                    `${
                        import.meta.env.VITE_API_URL ||
                        'http://localhost:4000'
                    }/auth/refresh-token`,
                    {},
                    {
                        withCredentials: true,
                    }
                );

                const newAccessToken =
                    response.data.accessToken;

                setAccessToken(newAccessToken);

                const profileResponse = await api.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                    },
                });

                setUser(profileResponse.data);
            } catch (error) {
                setUser(null);
                setAccessToken(null);
            } finally {
                setLoading(false);
            }
        }

        restoreSession();
    }, []);

    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(
            (config) => {
                if (accessToken) {
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
                    error.response?.status === 401 &&
                    !originalRequest._retry
                ) {
                    originalRequest._retry = true;

                    try {
                        const response = await axios.post(
                            `${
                                import.meta.env.VITE_API_URL ||
                                'http://localhost:4000'
                            }/auth/refresh-token`,
                            {},
                            {
                                withCredentials: true,
                            }
                        );

                        const newAccessToken =
                            response.data.accessToken;

                        setAccessToken(newAccessToken);

                        originalRequest.headers.Authorization =
                            `Bearer ${newAccessToken}`;

                        return api(originalRequest);
                    } catch (refreshError) {
                        logout();

                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
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