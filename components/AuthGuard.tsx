import { useAuth } from '@/components/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (requireAuth && !user) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (!requireAuth && user) {
    return <Redirect href="/" />;
  }

  return <>{children}</>;
};

export default AuthGuard;
