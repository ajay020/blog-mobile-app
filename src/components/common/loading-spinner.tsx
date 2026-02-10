import { COLORS, FONT_SIZES, SPACING } from '@/constants/theme';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'large';
    color?: string;
    fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message,
    size = 'large',
    color = COLORS.primary,
    fullScreen = false,
}) => {
    return (
        <View style={[styles.container, fullScreen && styles.fullScreen]}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    fullScreen: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    message: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.text.secondary,
    },
});