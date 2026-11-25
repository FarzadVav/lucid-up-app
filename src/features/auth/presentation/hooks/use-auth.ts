import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/application/stores/auth-store';
import {
  sendMagicLinkUseCase,
  signOutUseCase,
} from '@/features/auth/application/use-cases/auth-use-cases';
import { getAuthRedirectUrl } from '@/features/auth/infrastructure/auth-redirect';
import { supabaseAuthRepository } from '@/features/auth/infrastructure/repositories/supabase-auth-repository';
import { getErrorMessage } from '@/shared/utils/errors';

export function useAuth() {
  const session = useAuthStore((state) => state.session);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const authError = useAuthStore((state) => state.authError);
  const clearAuthError = useAuthStore((state) => state.clearAuthError);

  return {
    session,
    user: session?.user ?? null,
    isLoading: !isInitialized,
    isAuthenticated: Boolean(session),
    authError,
    clearAuthError,
  };
}

export function useSendMagicLinkMutation() {
  return useMutation({
    mutationFn: (email: string) =>
      sendMagicLinkUseCase(supabaseAuthRepository, {
        email,
        redirectUrl: getAuthRedirectUrl(),
      }),
  });
}

export function useSignOutMutation() {
  const queryClient = useQueryClient();
  const resetAuth = useAuthStore((state) => state.reset);
  const setAuthError = useAuthStore((state) => state.setAuthError);

  return useMutation({
    mutationFn: () => signOutUseCase(supabaseAuthRepository),
    onSuccess: () => {
      resetAuth();
      queryClient.clear();
    },
    onError: (error) => {
      setAuthError(getErrorMessage(error, 'Unable to sign out.'));
    },
  });
}
