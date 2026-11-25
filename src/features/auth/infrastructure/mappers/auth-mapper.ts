import type { Session } from '@supabase/supabase-js';
import type { AuthSession } from '@/features/auth/domain/entities/auth-session';

export function mapSupabaseSessionToAuthSession(
  session: Session | null
): AuthSession | null {
  if (!session?.user) {
    return null;
  }

  const { user } = session;
  return {
    user: {
      id: user.id,
      email: user.email ?? null,
      fullName:
        typeof user.user_metadata?.full_name === 'string'
          ? user.user_metadata.full_name
          : null,
      avatarUrl:
        typeof user.user_metadata?.avatar_url === 'string'
          ? user.user_metadata.avatar_url
          : null,
    },
  };
}
