import ContentRenderer from '@/components/articles/ContentRenderer';
import { useArticlesStore } from '@/store';
import { format } from 'date-fns';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';


export default function ArticleDetail() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { selectedArticle, fetchArticleBySlug, isLoading, clearSelectedArticle } = useArticlesStore();

    useEffect(() => {
        if (slug) fetchArticleBySlug(slug);

        // Cleanup when leaving the screen
        return () => clearSelectedArticle();
    }, [slug]);

    if (isLoading || !selectedArticle) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Set the screen title dynamically */}
            <Stack.Screen options={{ title: '', headerShadowVisible: false }} />

            {selectedArticle.coverImage && (
                <Image source={{ uri: selectedArticle.coverImage }} style={styles.coverImage} />
            )}

            <View style={styles.contentContainer}>
                <Text style={styles.title}>{selectedArticle.title}</Text>

                {/* Author Info Section */}
                <View style={styles.authorSection}>
                    <Image source={{ uri: selectedArticle.author.avatar }} style={styles.avatar} />
                    <View>
                        <Text style={styles.authorName}>{selectedArticle.author.name}</Text>
                        <Text style={styles.metaText}>
                            {format(new Date(selectedArticle.createdAt), 'MMM d, yyyy')} · {selectedArticle.readingTime} min read
                        </Text>
                    </View>
                </View>

                {/* Article Content - Using your excerpt for now as a placeholder */}
                <Text style={styles.bodyText}>
                    {selectedArticle.excerpt}
                    {"\n"}
                </Text>
                <ContentRenderer blocks={selectedArticle.content.blocks} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    coverImage: { width: '100%', height: 250 },
    contentContainer: { padding: 20 },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1a1a1a',
        lineHeight: 34,
        marginBottom: 20,
    },
    authorSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
        paddingBottom: 20,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#eee',
    },
    avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    authorName: { fontSize: 16, fontWeight: '600', color: '#242424' },
    metaText: { fontSize: 14, color: '#6b6b6b', marginTop: 2 },
    bodyText: {
        fontSize: 18,
        lineHeight: 28,
        color: '#292929',
        letterSpacing: -0.003,
    },
});