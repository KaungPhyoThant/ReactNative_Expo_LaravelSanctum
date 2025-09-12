import { useAuth } from '@/components/AuthContext'
import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Text, View } from 'react-native'

const SignUp = () => {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    passwordConfirmation: '',
  })

  const submit = async () => {
    if (!form.name || !form.username || !form.password || !form.passwordConfirmation) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    if (form.password !== form.passwordConfirmation) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp(form.name, form.username, form.password, form.passwordConfirmation);
      Alert.alert('Success', 'User signed up successfully.');
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
        label='Name'
        placeholder='Enter Your Name'
        keyboardType='default'
        value={form.name}
        onChangeText={(text) => (setForm({ ...form, name: text }))}
      />
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
      <CustomInput
        value={form.passwordConfirmation}
        onChangeText={(text) => (setForm({ ...form, passwordConfirmation: text }))}
        label='Confirm Password'
        placeholder='Confirm Your Password'
        secureTextEntry
      />
      <CustomButton title='Sign Up' isLoading={isSubmitting} onPress={submit} />

      <View className='self-center flex-row gap-1 justify-center items-center'>
        <Text className='base-regular text-black'>Already have an account?</Text>
        <Link href={"/sign-in"} className='base-bold text-primary'>Sign In</Link>
      </View>
    </View>
  )
}

export default SignUp
