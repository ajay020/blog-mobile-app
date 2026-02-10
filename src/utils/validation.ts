/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validators = {
    email: (email: string): ValidationResult => {
        if (!email) {
            return { isValid: false, error: 'Email is required' };
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, error: 'Please enter a valid email' };
        }
        return { isValid: true };
    },

    password: (password: string): ValidationResult => {
        if (!password) {
            return { isValid: false, error: 'Password is required' };
        }
        if (password.length < 5) {
            return { isValid: false, error: 'Password must be at least 5 characters' };
        }
        return { isValid: true };
    },

    name: (name: string): ValidationResult => {
        if (!name || name.trim().length === 0) {
            return { isValid: false, error: 'Name is required' };
        }
        if (name.trim().length < 2) {
            return { isValid: false, error: 'Name must be at least 2 characters' };
        }
        return { isValid: true };
    },

    required: (value: string, fieldName: string = 'This field'): ValidationResult => {
        if (!value || value.trim().length === 0) {
            return { isValid: false, error: `${fieldName} is required` };
        }
        return { isValid: true };
    },

    minLength: (
        value: string,
        min: number,
        fieldName: string = 'This field'
    ): ValidationResult => {
        if (value.length < min) {
            return {
                isValid: false,
                error: `${fieldName} must be at least ${min} characters`,
            };
        }
        return { isValid: true };
    },

    maxLength: (
        value: string,
        max: number,
        fieldName: string = 'This field'
    ): ValidationResult => {
        if (value.length > max) {
            return {
                isValid: false,
                error: `${fieldName} must be no more than ${max} characters`,
            };
        }
        return { isValid: true };
    },
};