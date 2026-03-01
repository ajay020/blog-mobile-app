import ArticleCard from '@/components/articles/ArticleCard';
import { useArticlesStore } from '@/store/articlesStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import debounce from 'lodash.debounce';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SearchScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { articles, fetchArticles, isLoading } = useArticlesStore();
  const router = useRouter();

  // 1. The Debounced Search Logic
  const handler = useCallback(
    debounce((query: string) => {
      if (query.length > 2) {
        fetchArticles({ search: query, page: 1 });
      }
    }, 500),
    []
  );

  const onChangeText = (text: string) => {
    setSearchTerm(text);
    handler(text);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#6b6b6b" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search for titles, tags, or topics..."
            value={searchTerm}
            onChangeText={onChangeText}
            autoFocus
            clearButtonMode="while-editing"
          />
        </View>

        {/* Results List */}
        {isLoading && searchTerm.length > 2 ? (
          <View style={styles.centered}>
            <ActivityIndicator color="#1a8917" />
          </View>
        ) : (
          <FlatList
            data={searchTerm.length > 2 ? articles : []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ArticleCard
                article={item}
                onPress={(slug) => router.push(`/article/${slug}`)}
              />
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {searchTerm.length > 2
                    ? "No articles found for this search."
                    : "Start typing to find amazing articles."}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 50,
  },
  searchIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#242424' },
  centered: { flex: 1, justifyContent: 'center' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#6b6b6b', textAlign: 'center', fontSize: 16 },
});

export default SearchScreen;