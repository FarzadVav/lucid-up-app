import type { EmailOtpType } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import { supabase } from '@/shared/infrastructure/supabase/client';

const EMAIL_OTP_TYPES = new Set<EmailOtpType>([
  'email',
  'magiclink',
  'signup',
  'recovery',
  'email_change',
]);

export function getAuthRedirectUrl(): string {
  return Linking.createURL('login');
}

export function extractAuthParamsFromUrl(url: string): Record<string, string> {
  const params: Record<string, string> = {};

  try {
    const parsed = new URL(url);
    parsed.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    if (parsed.hash) {
      const hashParams = new URLSearchParams(parsed.hash.replace(/^#/, ''));
      hashParams.forEach((value, key) => {
        params[key] = value;
      });
    }
  } catch {
    const queryStart = url.indexOf('?');
    const hashStart = url.indexOf('#');

    if (queryStart !== -1) {
      const queryEnd = hashStart !== -1 && hashStart > queryStart ? hashStart : url.length;
      const searchParams = new URLSearchParams(url.slice(queryStart + 1, queryEnd));
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    if (hashStart !== -1) {
      const hashParams = new URLSearchParams(url.slice(hashStart + 1));
      hashParams.forEach((value, key) => {
        params[key] = value;
      });
    }
  }

  return params;
}

export async function createSessionFromUrl(
  url: string
): Promise<{ handled: boolean; error: string | null }> {
  const params = extractAuthParamsFromUrl(url);

  const errorDescription = params.error_description || params.error;
  if (errorDescription) {
    return { handled: true, error: errorDescription };
  }

  const accessToken = params.access_token;
  const refreshToken = params.refresh_token;

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    return { handled: true, error: error ? error.message : null };
  }

  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    return { handled: true, error: error ? error.message : null };
  }

  if (params.token_hash && params.type && EMAIL_OTP_TYPES.has(params.type as EmailOtpType)) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: params.token_hash,
      type: params.type as EmailOtpType,
    });
    return { handled: true, error: error ? error.message : null };
  }

  return { handled: false, error: null };
}
