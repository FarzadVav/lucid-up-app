import * as Linking from 'expo-linking';
import { useEffect, useRef, type PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';
import { useAuthStore } from '@/features/auth/application/stores/auth-store';
import { restoreSessionFromUrlUseCase } from '@/features/auth/application/use-cases/auth-use-cases';
import { extractAuthParamsFromUrl } from '@/features/auth/infrastructure/auth-redirect';
import { supabaseAuthRepository } from '@/features/auth/infrastructure/repositories/supabase-auth-repository';
import { queryClient } from '@/shared/infrastructure/query/query-client';
import { getErrorMessage } from '@/shared/utils/errors';

/**
 * Synchronizes Supabase auth session, deep-link OTP callbacks, and native
 * foreground token refresh into the Zustand auth store.
 */
export function AuthBootstrapper({ children }: PropsWithChildren) {
  const handledUrlsRef = useRef<Set<string>>(new Set());
  const linkingUrl = Linking.useLinkingURL();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }

    let isMounted = true;
    const { setSession, setInitialized, setAuthError } = useAuthStore.getState();

    const initializeAuth = async () => {
      try {
        if (Platform.OS === 'web') {
          const urlParams = extractAuthParamsFromUrl(window.location.href);
          const urlError = urlParams.error_description || urlParams.error;
          if (urlError && isMounted) {
            setAuthError(urlError);
          } else if (urlParams.token_hash && urlParams.type) {
            const { error: verifyError } = await restoreSessionFromUrlUseCase(
              supabaseAuthRepository,
              window.location.href
            );
            if (verifyError && isMounted) {
              setAuthError(verifyError);
            }
          }
        }

        const initialSession = await supabaseAuthRepository.getSession();
        if (isMounted) {
          setSession(initialSession);
        }
      } catch (error) {
        if (isMounted) {
          setAuthError(getErrorMessage(error, 'Unable to restore session.'));
        }
      } finally {
        if (isMounted) {
          setInitialized(true);
        }
      }
    };

    void initializeAuth();

    const unsubscribe = supabaseAuthRepository.onAuthStateChange((nextSession) => {
      if (!isMounted) {
        return;
      }
      setSession(nextSession);
      if (!nextSession) {
        queryClient.clear();
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const appStateSubscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        supabaseAuthRepository.startAutoRefresh();
      } else {
        supabaseAuthRepository.stopAutoRefresh();
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
    const { setAuthError } = useAuthStore.getState();

    const processUrl = async () => {
      const { handled, error } = await restoreSessionFromUrlUseCase(
        supabaseAuthRepository,
        linkingUrl
      );
      if (!isCancelled && handled && error) {
        setAuthError(error);
      }
    };

    void processUrl();

    return () => {
      isCancelled = true;
    };
  }, [linkingUrl]);

  return <>{children}</>;
}
