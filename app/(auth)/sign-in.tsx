import { useAuth } from '@/components/AuthContext'
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn as apiSignIn } from '@/lib/auth'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignIn = () => {
  const { refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: ''
  })

  const submit = async () => {
    if (!form.username || !form.password) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await apiSignIn(form.username, form.password);
      await refreshUser();
      Alert.alert('Success', 'User signed in successfully.');
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <View className='gap-3 bg-white rounded-lg p-5 mt-5'>
      <CustomInput
        label='Username'
        placeholder='Enter Your Username'
        keyboardType='default'
        value={form.username}
        onChangeText={(text) => (setForm({ ...form, username: text }))}
      />
      <CustomInput
        value={form.password}
        onChangeText={(text) => (setForm({ ...form, password: text }))}
        label='Password'
        placeholder='Enter Your Password'
        secureTextEntry
      />
      <CustomButton title='Sign In' isLoading={isSubmitting} onPress={submit} />

      <View className='self-center flex-row gap-1 justify-center items-center'>
        <Text className='base-regular text-black'>Do not have an account?</Text>
        <Link href={"/sign-up"} className='base-bold text-primary'>Sign Up</Link>
      </View>
    </View>
  )
}

export default SignIn
