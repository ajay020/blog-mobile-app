import { Button, Input, LoadingSpinner } from '@/components/common';
import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store';
import { validators } from '@/utils/validation';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function RegisterScreen() {
    const router = useRouter();
    const { register, isLoading } = useAuthStore();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const nameValidation = validators.name(formData.name);
        const emailValidation = validators.email(formData.email);
        const passwordValidation = validators.password(formData.password);

        let confirmPasswordError = '';
        if (formData.password !== formData.confirmPassword) {
            confirmPasswordError = 'Passwords do not match';
        }

        const newErrors = {
            name: nameValidation.error || '',
            email: emailValidation.error || '',
            password: passwordValidation.error || '',
            confirmPassword: confirmPasswordError,
        };

        setErrors(newErrors);

        return (
            nameValidation.isValid &&
            emailValidation.isValid &&
            passwordValidation.isValid &&
            !confirmPasswordError
        );
    };

    const handleRegister = async () => {
        if (!validate()) return;

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // Navigation will be handled by _layout based on auth state
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message || 'Please try again');
        }
    };

    const navigateToLogin = () => {
        router.back();
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Creating your account..." />;
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.logo}>📝</Text>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join our community of writers</Text>
                </View>

                <View style={styles.form}>
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChangeText={(value) => handleChange('name', value)}
                        error={errors.name}
                        autoCapitalize="words"
                        autoComplete="name"
                    />

                    <Input
                        label="Email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChangeText={(value) => handleChange('email', value)}
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                    />

                    <Input
                        label="Password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChangeText={(value) => handleChange('password', value)}
                        error={errors.password}
                        secureTextEntry
                        autoComplete="password-new"
                    />

                    <Input
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        value={formData.confirmPassword}
                        onChangeText={(value) => handleChange('confirmPassword', value)}
                        error={errors.confirmPassword}
                        secureTextEntry
                        autoComplete="password-new"
                    />

                    <Text style={styles.termsText}>
                        By signing up, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>

                    <Button
                        title="Sign Up"
                        onPress={handleRegister}
                        isLoading={isLoading}
                        fullWidth
                        style={styles.registerButton}
                    />

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity style={styles.loginLink} onPress={navigateToLogin}>
                        <Text style={styles.loginText}>
                            Already have an account?{' '}
                            <Text style={styles.loginTextBold}>Sign In</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logo: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: '700',
        color: COLORS.text.primary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    termsText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.text.secondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
        lineHeight: 18,
    },
    termsLink: {
        color: COLORS.primary,
        fontWeight: '600',
    },
    registerButton: {
        marginBottom: SPACING.lg,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.lg,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.border,
    },
    dividerText: {
        marginHorizontal: SPACING.md,
        fontSize: FONT_SIZES.sm,
        color: COLORS.text.secondary,
    },
    loginLink: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    loginText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
    },
    loginTextBold: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});