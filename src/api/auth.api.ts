import { API_ENDPOINTS } from '@/constants/api';
import {
    ApiResponse,
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    User,
} from '@/types';
import { apiClient } from './client';

/**
 * Authentication API service
 */
export const authApi = {
    /**
     * Login user
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        // Backend returns: { success: true, token: "...", user: {...} }
        // So apiClient.post returns this directly (no .data wrapper)
        const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.LOGIN,
            credentials
        );
        console.log('API login response: ', response);
        return response;
    },

    /**
     * Register new user
     */
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.REGISTER,
            credentials
        );
        return response;
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.LOGOUT);
    },

    /**
     * Get current user
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<ApiResponse<User>>(API_ENDPOINTS.ME);
        return response.data;
    },

    /**
     * Refresh auth token
     */
    refreshToken: async (): Promise<{ token: string }> => {
        const response = await apiClient.post<ApiResponse<{ token: string }>>(
            API_ENDPOINTS.REFRESH_TOKEN
        );
        return response.data;
    },
};