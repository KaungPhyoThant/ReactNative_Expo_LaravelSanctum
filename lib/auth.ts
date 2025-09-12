import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Configure axios base URL - update this to your Laravel API URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';


// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Token management
const TOKEN_KEY = 'auth_token';

export const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const getAuthToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeAuthToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  delete api.defaults.headers.common['Authorization'];
};

// Initialize token on app start
export const initializeAuth = async () => {
  const token = await getAuthToken();
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Auth functions
export const signUp = async (name: string, username: string, password: string, passwordConfirmation: string) => {

  try {
    const response = await api.post('/register', {
      name,
      username,
      password,
      password_confirmation: passwordConfirmation,
    });

    const { token, user } = response.data;
    await setAuthToken(token);

    return { user, token };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Registration failed';
    throw new Error(message);
  }
};

export const signIn = async (username: string, password: string) => {

  try {
    const response = await api.post('/login', {
      username,
      password,
    });

    const { token, user } = response.data;
    await setAuthToken(token);

    return { user, token };
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    throw new Error(message);
  }
};

export const signOut = async () => {

  try {
    await api.post('/logout');
  } catch (error) {
    // Continue with logout even if API call fails
    console.warn('Logout API call failed:', error);
  } finally {
    await removeAuthToken();
  }
};

export const getCurrentUser = async () => {

  try {
    const token = await getAuthToken();
    if (!token) return null;

    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    await removeAuthToken();
    return null;
  }
};

export const refreshToken = async () => {

  try {
    const response = await api.post('/refresh');
    const { token } = response.data;
    await setAuthToken(token);
    return token;
  } catch (error: any) {
    await removeAuthToken();
    throw new Error('Token refresh failed');
  }
};

// Request interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshToken();
        const token = await getAuthToken();
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        await removeAuthToken();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
