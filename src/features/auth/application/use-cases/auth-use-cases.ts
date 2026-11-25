import * as v from 'valibot';
import type { AuthRepository } from '@/features/auth/domain/repositories/auth-repository';
import { loginSchema } from '@/features/auth/domain/schemas/login-schema';

export async function sendMagicLinkUseCase(
  repository: AuthRepository,
  input: { email: string; redirectUrl: string }
): Promise<string> {
  const validated = v.parse(loginSchema, { email: input.email });
  await repository.sendMagicLink(validated.email, input.redirectUrl);
  return validated.email;
}

export async function signOutUseCase(repository: AuthRepository): Promise<void> {
  await repository.signOut();
}

export async function restoreSessionFromUrlUseCase(
  repository: AuthRepository,
  url: string
): Promise<{ handled: boolean; error: string | null }> {
  return repository.verifyOtpFromUrl(url);
}
