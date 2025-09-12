import { AuthProvider } from "@/components/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import './global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  )
}
