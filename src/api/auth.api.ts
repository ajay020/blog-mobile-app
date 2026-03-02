import { API_ENDPOINTS } from '@/constants/api';
import {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    UpdatePasswordData,
    UpdateProfileData,
    User
} from '@/types';
import { apiClient } from './client';

/**
 * Authentication APIs
 */
export const authApi = {
    /**
     * Login user
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
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
        await apiClient.get(API_ENDPOINTS.LOGOUT);
    },

    // Get current user profile
    getMe: async (): Promise<{ success: boolean; data: User }> => {
        const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
        return response;
    },

    // Update user profile
    updateProfile: async (data: UpdateProfileData): Promise<{ success: boolean; data: User }> => {
        const response = await apiClient.put<{ success: boolean; data: User }>(
            '/auth/updatedetails',
            data
        );

        return response;
    },

    // Update password
    updatePassword: async (data: UpdatePasswordData): Promise<AuthResponse> => {
        const response = await apiClient.put<AuthResponse>('/auth/updatepassword', data);

        return response;
    },

    // Delete account
    deleteAccount: async (): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.delete<{ success: boolean; message: string }>('/auth/account');

        authApi.logout();

        return response;
    },

    /**
     * Refresh auth token
     */
    // refreshToken: async (): Promise<{ token: string }> => {
    // const response = await apiClient.post<ApiResponse<{ token: string }>>(
    //     API_ENDPOINTS.REFRESH_TOKEN
    // );
    // return response.data;
    // },
};