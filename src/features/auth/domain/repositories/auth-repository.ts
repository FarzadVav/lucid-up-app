import type { AuthSession } from '@/features/auth/domain/entities/auth-session';

export interface AuthRepository {
  getSession(): Promise<AuthSession | null>;
  sendMagicLink(email: string, redirectUrl: string): Promise<void>;
  verifyOtpFromUrl(url: string): Promise<{ handled: boolean; error: string | null }>;
  signOut(): Promise<void>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
  startAutoRefresh(): void;
  stopAutoRefresh(): void;
}
