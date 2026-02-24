import { Button } from '@/components/common';
import { useAuth } from '@/hooks';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

function Profile() {
  const { logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <View>
      <Text>Profile</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  )
}

export default Profile