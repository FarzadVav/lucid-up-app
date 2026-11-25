import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupportedStorage } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import type { Database } from '@/shared/types/database.types';

/**
 * Extends generated `Database` with `journals` and `delete_category` from
 * local migration `20261125104837_create_categories_and_journals.sql` until
 * remote migrations are synced and `npm run db:types` is regenerated.
 */
export type AppDatabase = Omit<Database, 'public'> & {
  public: {
    Tables: Database['public']['Tables'] & {
      journals: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          category_id: string;
          title: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          title?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Database['public']['Views'];
    Functions: Database['public']['Functions'] & {
      delete_category: {
        Args: {
          p_category_id: string;
        };
        Returns: {
          deleted_category_id: string;
          default_category_id: string;
          moved_journals_count: number;
        }[];
      };
    };
    Enums: Database['public']['Enums'];
    CompositeTypes: Database['public']['CompositeTypes'];
  };
};

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

export const supabase = createClient<AppDatabase>(supabaseUrl, supabaseKey, {
  auth: {
    storage,
    autoRefreshToken: isBrowserOrNative,
    persistSession: isBrowserOrNative,
    detectSessionInUrl: isBrowser,
  },
});
