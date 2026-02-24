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

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading, error } = useAuthStore();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const emailValidation = validators.email(formData.email);
        const passwordValidation = validators.password(formData.password);

        const newErrors = {
            email: emailValidation.error || '',
            password: passwordValidation.error || '',
        };

        setErrors(newErrors);

        return emailValidation.isValid && passwordValidation.isValid;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            await login({
                email: formData.email,
                password: formData.password,
            });

            // Navigation to main app is handled by auth state change in index.tsx
            router.push("/(tabs)");

        } catch (error: any) {
            Alert.alert('Login Failed', error.message || 'Please try again');
        }
    };

    // console.log('Login screen rendered');


    const navigateToRegister = () => {
        router.push("/register");
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message="Signing in..." />;
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
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue reading</Text>
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.form}>
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
                        placeholder="Enter your password"
                        value={formData.password}
                        onChangeText={(value) => handleChange('password', value)}
                        error={errors.password}
                        secureTextEntry
                        autoComplete="password"
                    />

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        isLoading={isLoading}
                        fullWidth
                        style={styles.loginButton}
                    />

                    <View style={styles.divider}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    <TouchableOpacity
                        style={styles.registerLink}
                        onPress={navigateToRegister}
                    >
                        <Text style={styles.registerText}>
                            Don't have an account?{' '}
                            <Text style={styles.registerTextBold}>Sign Up</Text>
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
    errorContainer: {
        backgroundColor: COLORS.backgroundSecondary,
        padding: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.lg,
    },
    errorText: {
        color: COLORS.error,
        fontSize: FONT_SIZES.sm,
        textAlign: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: SPACING.md,
    },
    forgotPasswordText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '600',
    },
    loginButton: {
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
    registerLink: {
        alignItems: 'center',
        paddingVertical: SPACING.md,
    },
    registerText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
    },
    registerTextBold: {
        color: COLORS.primary,
        fontWeight: '700',
    },
});