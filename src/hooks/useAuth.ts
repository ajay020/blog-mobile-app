import { useAuthStore } from '@/store';
import { useEffect } from 'react';

/**
 * Custom hook for authentication
 * Provides auth state and actions with automatic state loading
 */
export const useAuth = () => {
    const {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        loadStoredAuth,
        clearError,
        updateUser,
    } = useAuthStore();

    // Load stored auth on mount
    useEffect(() => {
        loadStoredAuth();
    }, [loadStoredAuth]);

    return {
        // State
        user,
        token,
        isAuthenticated,
        isLoading,
        error,

        // Actions
        login,
        register,
        logout,
        clearError,
        updateUser,
    };
};