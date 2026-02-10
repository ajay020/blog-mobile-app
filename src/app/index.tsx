import { useAuthStore } from '@/store';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';

export default function Index() {
  const {
    isAuthenticated,
    isLoading,
    hasInitialized,
    loadStoredAuth,
  } = useAuthStore();

  useEffect(() => {
    if (!hasInitialized) {
      loadStoredAuth();
    }
  }, [hasInitialized]);

  //  splash / loading
  if (!hasInitialized || isLoading) {
    return null; // later replace with SplashScreen
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // Logged in
  return <Redirect href="/(tabs)" />;
}
