import ArticleCard from '@/components/articles/ArticleCard';
import SkeletonCard from '@/components/articles/SkeletonCard';
import { useArticlesStore } from '@/store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

function Home() {
    const { articles, isLoading, error, fetchArticles } = useArticlesStore();
    // console.log("Article in home", articles)
    const router = useRouter();

    useEffect(() => {
        fetchArticles();
    }, [])


    if (isLoading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* Render 6 skeletons to fill the screen */}
                {[...Array(6)].map((_, index) => (
                    <SkeletonCard key={index} />
                ))}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={articles}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <ArticleCard
                        article={item}
                        onPress={(slug) => router.push({
                            pathname: '/article/[slug]',
                            params: { slug }
                        })}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    }
    ,
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 16,
    },
})