import { useAuth } from "@/components/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import CustomButton from "@/components/CustomButton";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";

export default function Index() {
  const { user, loading, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      Alert.alert('Success', 'Logged out successfully');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <AuthGuard requireAuth={true}>
      <View className="flex-1 justify-center items-center bg-white px-6">
        <Text className="text-2xl font-bold text-green-600 mb-4">Welcome!</Text>
        <Text className="text-gray-600 mb-2">You are successfully authenticated</Text>
        <Text className="text-sm text-gray-500 mb-8">User: {user?.name}</Text>

        <CustomButton
          title="Logout"
          onPress={handleLogout}
          isLoading={isLoggingOut}
        />
      </View>
    </AuthGuard>
  );
}
