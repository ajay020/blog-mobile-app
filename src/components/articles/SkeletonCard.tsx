import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const SkeletonCard = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(animatedValue, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    // Professional shimmer animation logic
    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-300, 300],
    });

    const Shimmer = () => (
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
            <LinearGradient
                colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
            />
        </Animated.View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.contentRow}>
                <View style={styles.textContainer}>
                    {/* Author Shimmer */}
                    <View style={styles.authorRow}>
                        <View style={[styles.avatar, styles.skeleton]}><Shimmer /></View>
                        <View style={[styles.authorName, styles.skeleton]}><Shimmer /></View>
                    </View>

                    {/* Title Shimmer */}
                    <View style={[styles.titleLine, styles.skeleton]}><Shimmer /></View>
                    <View style={[styles.titleLine, styles.skeleton, { width: '60%' }]}><Shimmer /></View>

                    {/* Excerpt Shimmer */}
                    <View style={[styles.excerptLine, styles.skeleton]}><Shimmer /></View>
                </View>

                {/* Image Shimmer */}
                <View style={[styles.coverImage, styles.skeleton]}><Shimmer /></View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#e0e0e0',
    },
    skeleton: {
        backgroundColor: '#f0f0f0',
        overflow: 'hidden',
        borderRadius: 4,
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textContainer: { flex: 1, paddingRight: 12 },
    authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 20, height: 20, borderRadius: 10, marginRight: 8 },
    authorName: { width: 80, height: 12 },
    titleLine: { height: 18, marginBottom: 8, width: '90%' },
    excerptLine: { height: 14, marginTop: 8, width: '100%' },
    coverImage: { width: 80, height: 80 },
});

export default SkeletonCard;