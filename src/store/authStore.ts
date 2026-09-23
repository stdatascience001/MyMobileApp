import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Helper to handle web vs native storage
const setStorageItem = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const removeStorageItem = async (key: string) => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  token: null,
  isLoading: true,
  setToken: async (token: string) => {
    await setStorageItem('token', token);
    set({ token, isAuthenticated: true });
  },
  logout: async () => {
    await removeStorageItem('token');
    set({ token: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    try {
      const token = await getStorageItem('token');
      if (token) {
        set({ token, isAuthenticated: true, isLoading: false });
      } else {
        set({ token: null, isAuthenticated: false, isLoading: false });
      }
    } catch (e) {
      set({ token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
