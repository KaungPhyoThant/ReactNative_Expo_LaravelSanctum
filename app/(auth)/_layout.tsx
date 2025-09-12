import bg from '@/assets/images/partial-react-logo.png';
import logo from '@/assets/images/react-logo.png';
import AuthGuard from '@/components/AuthGuard';
import { Slot } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

export default function AuthLayout() {
  return (
    <AuthGuard requireAuth={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView className='bg-white h-full' keyboardShouldPersistTaps='handled'>
          <View className='w-full relative mb-10' style={{ height: Dimensions.get('screen').height / 2.50 }}>
            <ImageBackground source={bg} className='size-full rounded-b-lg' resizeMethod='auto' />
            <Image source={logo} className='self-center size-48 absolute -bottom-5 z-10 mb-10' resizeMode="cover" />
            <Text className="font-quicksand-bold self-center text-primary" style={{
              fontSize: 25,
            }}>Welcome</Text>
          </View>
          <Slot />
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthGuard>
  )
}
