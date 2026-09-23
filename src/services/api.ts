import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

let API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000';
if (Platform.OS === 'web') {
  // Translate Android emulator localhost alias to standard localhost for web
  API_URL = API_URL.replace('10.0.2.2', '127.0.0.1');
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    let token: string | null = null;
    if (Platform.OS === 'web') {
      token = localStorage.getItem('token');
    } else {
      token = await SecureStore.getItemAsync('token');
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors (e.g., expired token)
      if (Platform.OS === 'web') {
        localStorage.removeItem('token');
      } else {
        await SecureStore.deleteItemAsync('token');
      }
      // Optionally we could use useAuthStore.getState().logout() but avoiding circular dependencies is better.
      // We will let the app handle the missing token state on next check, or rely on navigation.
      
      // If we are on web, we can just reload or redirect
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
