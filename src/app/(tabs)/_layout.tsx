import { COLORS } from '@/constants/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Tabs layout - Bottom tab navigation for main app screens
 */
export default function TabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.text.secondary,
                tabBarStyle: {
                    backgroundColor: COLORS.white,
                    borderTopColor: COLORS.border,
                    borderTopWidth: 1,
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom > 0 ? insets.bottom : 8, // ✅ Use safe area or default
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                },
                headerStyle: {
                    backgroundColor: COLORS.white,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.border,
                },
                headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: '700',
                    color: COLORS.text.primary,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="home" color={color} size={size} />
                    ),
                    headerTitle: 'Feed',
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="explore" color={color} size={size} />
                    ),
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Create',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="create" color={color} size={size} />
                    ),
                    headerTitle: 'Write Article',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <TabBarIcon name="profile" color={color} size={size} />
                    ),
                }}
            />
        </Tabs>
    );
}

/**
 * Simple icon component for tabs
 * Replace with actual icon library (e.g., @expo/vector-icons)
 */
function TabBarIcon({ name, color, size }: { name: string; color: string; size: number }) {
    const icons: Record<string, string> = {
        home: '🏠',
        explore: '🔍',
        create: '✏️',
        profile: '👤',
    };

    return (
        <Text style={{ fontSize: size, color }}>
            {icons[name] || '•'}
        </Text>
    );
}