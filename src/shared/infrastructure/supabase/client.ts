import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import type { Database } from '@/shared/types/database.types';

export type AppDatabase = Database;

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  (Constants.expoConfig?.extra?.supabaseUrl as string | undefined) ||
  'https://isjafkdnfwtscabinzyh.supabase.co';

const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  (Constants.expoConfig?.extra?.supabaseAnonKey as string | undefined) ||
  'sb_publishable_0AV_nJVJBJ-oWe4gMFTeWA_9qucNysh';

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

export const supabase = createClient<AppDatabase>(supabaseUrl, supabaseKey, {
  auth: {
    storage,
    autoRefreshToken: isBrowserOrNative,
    persistSession: isBrowserOrNative,
    detectSessionInUrl: isBrowser,
  },
});
