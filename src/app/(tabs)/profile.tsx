import ArticleCard from '@/components/articles/ArticleCard';
import { useArticlesStore, useAuthStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import {
  ActivityIndicator
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { myArticles, fetchMyArticles, isLoading } = useArticlesStore();
  const router = useRouter();

  useEffect(() => {
    fetchMyArticles();
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push("/(auth)/login")
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topRow}>
        <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => router.push('/profile/edit')}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      {user.bio && <Text style={styles.bio}>{user.bio}</Text>}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{user.followersCount || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statCount}>{user.followingCount || 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <View style={styles.tabHeader}>
        <View style={styles.activeTabContainer}>
          <Text style={styles.activeTab}>Stories</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={22} color="#d32f2f" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyComponent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerBox}>
          <ActivityIndicator size="small" color="#1a8917" />
          <Text style={styles.loadingText}>Fetching your stories...</Text>
        </View>
      );
    }

    return (
      <View style={styles.centerBox}>
        <Ionicons name="document-text-outline" size={48} color="#ccc" />
        <Text style={styles.emptyTitle}>No stories yet</Text>
        <Text style={styles.emptySubtitle}>
          When you publish articles, they will appear here for everyone to read.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={myArticles}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ArticleCard
            article={item}
            onPress={(slug) => router.push(`/article/${slug}`)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerContainer: { padding: 20, paddingBottom: 0 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0'
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: { color: '#242424', fontSize: 14, fontWeight: '600' },
  name: { fontSize: 24, fontWeight: '800', color: '#1a1a1a', marginBottom: 6 },
  bio: { fontSize: 16, color: '#6b6b6b', lineHeight: 22, marginBottom: 15 },
  statsRow: { flexDirection: 'row', gap: 20, marginBottom: 25 },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statCount: { fontWeight: '700', fontSize: 16, color: '#1a1a1a' },
  statLabel: { color: '#6b6b6b', fontSize: 14 },
  tabHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  activeTabContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#1a1a1a',
    paddingBottom: 12,
  },
  activeTab: { fontSize: 15, fontWeight: '700', color: '#1a1a1a' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 12 },
  logoutText: { color: '#d32f2f', fontWeight: '500', fontSize: 14 },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 40
  },
  loadingText: { marginTop: 10, color: '#6b6b6b', fontSize: 14 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', marginTop: 15 },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b6b6b',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20
  },
});