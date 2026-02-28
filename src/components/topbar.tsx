import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TopBar = ({ title }: { title?: string }) => {
    const router = useRouter();

    return (
        <View style={styles.headerContainer}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={styles.iconButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <Ionicons name="arrow-back" size={28} color="#242424" />
            </TouchableOpacity>

            <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
            </Text>

            <View style={styles.rightActions}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="ellipsis-horizontal" size={22} color="#242424" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        color: '#242424',
        marginHorizontal: 10,
    },
    iconButton: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightActions: {
        flexDirection: 'row',
        width: 44, // Matches the back button width to keep title centered
        justifyContent: 'flex-end',
    },
});

export default TopBar;