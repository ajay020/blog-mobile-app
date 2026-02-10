import { API_BASE_URL, API_TIMEOUT } from '@/constants/api';
import { STORAGE_KEYS } from '@/constants/storage';
import { useAuthStore } from '@/store';
import { ApiError } from '@/types';
import { storage } from '@/utils/storage';
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * API client configuration and setup
 */
class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: API_TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    /**
     * Setup request and response interceptors
     */
    private setupInterceptors() {
        // Request interceptor - Add auth token to headers
        this.client.interceptors.request.use(
            async (config: InternalAxiosRequestConfig) => {
                const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);

                if (token && config.headers) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor - Handle errors globally
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const apiError = this.handleError(error);

                // Handle unauthorized errors (token expired)
                if (error.response?.status === 401) {

                    const { logout } = useAuthStore.getState();
                    await logout();

                    // You can trigger navigation to login screen here
                    // or emit an event that your auth store can listen to
                }

                return Promise.reject(apiError);
            }
        );
    }

    /**
     * Handle and format API errors
     */
    private handleError(error: AxiosError): ApiError {
        console.log('API Error:', error);

        if (error.response) {
            // Server responded with error
            const data = error.response.data as any;

            return {
                message: data?.message || 'An error occurred',
                statusCode: error.response.status,
                errors: data?.errors,
            };
        } else if (error.request) {
            // Request made but no response
            return {
                message: 'Network error. Please check your connection.',
                statusCode: 0,
            };
        } else {
            // Something else happened
            return {
                message: error.message || 'An unexpected error occurred',
                statusCode: 0,
            };
        }
    }

    /**
     * GET request
     */
    async get<T>(url: string, config?: any): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    /**
     * POST request
     */
    async post<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }

    /**
     * PUT request
     */
    async put<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.put<T>(url, data, config);
        return response.data;
    }

    /**
     * PATCH request
     */
    async patch<T>(url: string, data?: any, config?: any): Promise<T> {
        const response = await this.client.patch<T>(url, data, config);
        return response.data;
    }

    /**
     * DELETE request
     */
    async delete<T>(url: string, config?: any): Promise<T> {
        const response = await this.client.delete<T>(url, config);
        return response.data;
    }

    /**
     * Set auth token
     */
    setAuthToken(token: string) {
        this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    /**
     * Remove auth token
     */
    removeAuthToken() {
        delete this.client.defaults.headers.common['Authorization'];
    }
}

export const apiClient = new ApiClient();