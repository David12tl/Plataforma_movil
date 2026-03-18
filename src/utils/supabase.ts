import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const isWeb = Platform.OS === 'web';

// Helper para acceder a localStorage de forma segura en SSR (Server Side Rendering)
const getWebStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
};

const customStorage = {
  getItem: (key: string) => 
    isWeb ? getWebStorage().getItem(key) : SecureStore.getItemAsync(key),
  
  setItem: (key: string, value: string) => 
    isWeb ? getWebStorage().setItem(key, value) : SecureStore.setItemAsync(key, value),
  
  removeItem: (key: string) => 
    isWeb ? getWebStorage().removeItem(key) : SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});