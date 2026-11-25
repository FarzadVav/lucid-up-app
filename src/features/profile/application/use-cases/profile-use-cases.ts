import * as v from 'valibot';
import type { UserProfile } from '@/features/profile/domain/entities/user-profile';
import type {
  EnsureProfileInput,
  ProfileRepository,
} from '@/features/profile/domain/repositories/profile-repository';
import { profileSchema } from '@/features/profile/domain/schemas/profile-schema';

export async function getOrCreateProfileUseCase(
  repository: ProfileRepository,
  input: EnsureProfileInput
): Promise<UserProfile | null> {
  return repository.getOrCreateProfile(input);
}

export async function updateProfileUseCase(
  repository: ProfileRepository,
  userId: string,
  input: { fullName: string | null }
): Promise<UserProfile> {
  const validated = v.parse(profileSchema, { fullName: input.fullName ?? '' });
  return repository.updateProfile(userId, validated.fullName);
}
