import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';
import { createSessionFromUrl } from '@/features/auth/infrastructure/auth-redirect';
import { mapSupabaseSessionToAuthSession } from '@/features/auth/infrastructure/mappers/auth-mapper';
import { supabase } from '@/shared/infrastructure/supabase/client';

export const supabaseAuthRepository: AuthRepository = {
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      throw new Error(error.message);
    }
    return mapSupabaseSessionToAuthSession(data.session ?? null);
  },

  async sendMagicLink(email, redirectUrl) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });
    if (error) {
      throw new Error(error.message);
    }
  },

  async verifyOtpFromUrl(url) {
    return createSessionFromUrl(url);
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },

  onAuthStateChange(callback) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      callback(mapSupabaseSessionToAuthSession(nextSession));
    });
    return () => {
      subscription.unsubscribe();
    };
  },

  startAutoRefresh() {
    void supabase.auth.startAutoRefresh();
  },

  stopAutoRefresh() {
    void supabase.auth.stopAutoRefresh();
  },
};
