import { authApi } from '@/api';
import { STORAGE_KEYS } from '@/constants/storage';
import {
    ApiError,
    LoginCredentials,
    RegisterCredentials,
    UpdateProfileData,
    User,
} from '@/types';
import { storage } from '@/utils/storage';
import { create } from 'zustand';

interface AuthState {
    // State
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    hasInitialized: boolean;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => Promise<void>;
    loadStoredAuth: () => Promise<void>;
    updateUser: (user: Partial<User>) => void;
    updateProfile: (data: UpdateProfileData) => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    hasInitialized: false,

    // Login action
    login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
            const response = await authApi.login(credentials);
            // console.log('Login response: ', response);
            const { user, token } = response;

            // Store auth data
            await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            await storage.setItem(STORAGE_KEYS.USER_DATA, user);

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({
                error: apiError.message,
                isLoading: false,
                isAuthenticated: false,
            });
            throw error;
        }
    },

    // Register action
    register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        try {
            const { user, token } = await authApi.register(credentials);

            // Store auth data
            await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
            await storage.setItem(STORAGE_KEYS.USER_DATA, user);

            set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({
                error: apiError.message,
                isLoading: false,
                isAuthenticated: false,
            });
            throw error;
        }
    },

    // Logout action
    logout: async () => {
        try {
            await authApi.logout();
        } catch (error) {
            // Continue with logout even if API call fails
            console.error('Logout error:', error);
        } finally {
            // Clear stored auth data
            await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            await storage.removeItem(STORAGE_KEYS.USER_DATA);

            set({
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
            });
        }
    },

    // Load stored authentication data
    loadStoredAuth: async () => {
        if (get().hasInitialized) return;

        set({ isLoading: true });

        try {
            const token = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
            const user = await storage.getItem<User>(STORAGE_KEYS.USER_DATA);

            if (token && user) {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                });
            }
        } catch (error) {
            console.error('Error loading stored auth:', error);
        } finally {
            set({
                isLoading: false,
                hasInitialized: true,
            });
        }
    },

    // Update user
    updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
            const updatedUser = { ...currentUser, ...userData };
            set({ user: updatedUser });
            storage.setItem(STORAGE_KEYS.USER_DATA, updatedUser);
        }
    },

    updateProfile: async (data: UpdateProfileData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await authApi.updateProfile(data);
            const updatedUser = response.data;

            // Update both the store and the local device storage
            await storage.setItem(STORAGE_KEYS.USER_DATA, updatedUser);

            set({
                user: updatedUser,
                isLoading: false,
                error: null
            });
        } catch (error) {
            const apiError = error as ApiError;
            set({
                error: apiError.message,
                isLoading: false
            });
            throw error; // Let the UI handle the error (like an Alert)
        }
    },

    // Clear error
    clearError: () => set({ error: null }),
}));