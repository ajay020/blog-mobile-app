import ArticleCard from '@/components/articles/ArticleCard';
import { useBookmarkStore } from '@/store/bookmarkStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BookmarksScreen = () => {
  const router = useRouter();
  const { bookmarks, fetchBookmarks, isLoading, error } = useBookmarkStore();

  // Fetch bookmarks on mount
  useEffect(() => {
    fetchBookmarks();
  }, []);

  // Handle Pull-to-Refresh
  const onRefresh = useCallback(() => {
    fetchBookmarks();
  }, []);

  // Empty State Component
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.iconCircle}>
        <Ionicons name="bookmark-outline" size={40} color="#6b6b6b" />
      </View>
      <Text style={styles.emptyTitle}>No bookmarks yet</Text>
      <Text style={styles.emptySubtitle}>
        Articles you bookmark will appear here for quick access.
      </Text>
    </View>
  );

  if (isLoading && bookmarks.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1a8917" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
      </View>

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={(slug) => router.push(`/article/${slug}`)}
          />
        )}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            tintColor="#1a8917"
          />
        }
        contentContainerStyle={bookmarks.length === 0 && { flex: 1 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#242424',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#242424',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b6b6b',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default BookmarksScreen;