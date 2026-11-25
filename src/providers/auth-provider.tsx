import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import { AppState, Platform } from 'react-native';
import type { Tables } from '@/types/database.types';
import { createSessionFromUrl, extractAuthParamsFromUrl } from '@/utils/auth-redirect';
import { supabase } from '@/utils/supabase';

export type UserProfile = Tables<'users'>;

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  authError: string | null;
  clearAuthError: () => void;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: { full_name?: string | null }) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const handledUrlsRef = useRef<Set<string>>(new Set());
  const linkingUrl = Linking.useLinkingURL();

  const fetchOrCreateProfile = useCallback(async (currentSession: Session | null) => {
    const currentUser = currentSession?.user;
    if (!currentUser) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', currentUser.id)
      .maybeSingle();

    if (error) {
      console.error('Failed to load user profile:', error.message);
      return;
    }

    if (data) {
      setProfile(data);
      return;
    }

    if (currentUser.email) {
      const { data: created, error: insertError } = await supabase
        .from('users')
        .upsert(
          {
            id: currentUser.id,
            email: currentUser.email,
            full_name:
              typeof currentUser.user_metadata?.full_name === 'string'
                ? currentUser.user_metadata.full_name
                : null,
            avatar_url:
              typeof currentUser.user_metadata?.avatar_url === 'string'
                ? currentUser.user_metadata.avatar_url
                : null,
          },
          { onConflict: 'id' }
        )
        .select('*')
        .single();

      if (insertError) {
        console.error('Failed to create fallback user profile:', insertError.message);
        return;
      }

      setProfile(created);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }

    let isMounted = true;

    const initializeAuth = async () => {
      try {
        if (Platform.OS === 'web') {
          const urlParams = extractAuthParamsFromUrl(window.location.href);
          const urlError = urlParams.error_description || urlParams.error;
          if (urlError && isMounted) {
            setAuthError(urlError);
          } else if (urlParams.token_hash && urlParams.type) {
            const { error: verifyError } = await createSessionFromUrl(window.location.href);
            if (verifyError && isMounted) {
              setAuthError(verifyError);
            }
          }
        }

        const { data, error } = await supabase.auth.getSession();
        if (error && isMounted) {
          setAuthError(error.message);
        }

        const initialSession = data.session ?? null;
        if (isMounted) {
          setSession(initialSession);
        }

        await fetchOrCreateProfile(initialSession);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) {
        return;
      }

      setSession(nextSession);
      if (nextSession) {
        setAuthError(null);
      }
      void fetchOrCreateProfile(nextSession);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchOrCreateProfile]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        void supabase.auth.startAutoRefresh();
      } else {
        void supabase.auth.stopAutoRefresh();
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!linkingUrl || Platform.OS === 'web') {
      return;
    }

    if (handledUrlsRef.current.has(linkingUrl)) {
      return;
    }
    handledUrlsRef.current.add(linkingUrl);

    let isCancelled = false;

    const processUrl = async () => {
      const { handled, error } = await createSessionFromUrl(linkingUrl);
      if (!isCancelled && handled && error) {
        setAuthError(error);
      }
    };

    void processUrl();

    return () => {
      isCancelled = true;
    };
  }, [linkingUrl]);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchOrCreateProfile(session);
  }, [fetchOrCreateProfile, session]);

  const updateProfile = useCallback(
    async (updates: { full_name?: string | null }) => {
      if (!session?.user) {
        return { error: 'You must be signed in to update your profile.' };
      }

      const { data, error } = await supabase
        .from('users')
        .update({
          full_name: updates.full_name ?? null,
        })
        .eq('id', session.user.id)
        .select('*')
        .single();

      if (error) {
        return { error: error.message };
      }

      setProfile(data);
      return { error: null };
    },
    [session]
  );

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setAuthError(error.message);
      return;
    }
    setSession(null);
    setProfile(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        isLoading,
        isAuthenticated: Boolean(session),
        authError,
        clearAuthError,
        refreshProfile,
        updateProfile,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}
