import { create } from 'zustand';
import type { AuthSession } from '@/features/auth/domain/entities/auth-session';

interface AuthStoreState {
  session: AuthSession | null;
  isInitialized: boolean;
  authError: string | null;
  setSession: (session: AuthSession | null) => void;
  setInitialized: (initialized: boolean) => void;
  setAuthError: (error: string | null) => void;
  clearAuthError: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthStoreState>((set) => ({
  session: null,
  isInitialized: false,
  authError: null,
  setSession: (session) =>
    set((state) => ({
      session,
      authError: session ? null : state.authError,
    })),
  setInitialized: (isInitialized) => set({ isInitialized }),
  setAuthError: (authError) => set({ authError }),
  clearAuthError: () => set({ authError: null }),
  reset: () => set({ session: null, authError: null }),
}));
