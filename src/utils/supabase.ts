import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY environment variables.'
  );
}

const isBrowser = Platform.OS === 'web' && typeof window !== 'undefined';
const isBrowserOrNative = Platform.OS !== 'web' || isBrowser;

const storage: SupportedStorage = isBrowserOrNative
  ? AsyncStorage
  : {
      getItem: () => Promise.resolve(null),
      setItem: () => Promise.resolve(),
      removeItem: () => Promise.resolve(),
    };

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    storage,
    autoRefreshToken: isBrowserOrNative,
    persistSession: isBrowserOrNative,
    detectSessionInUrl: isBrowser,
  },
});
