import type { UserProfile } from '@/features/profile/domain/entities/user-profile';

export interface EnsureProfileInput {
  userId: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
}

export interface ProfileRepository {
  getOrCreateProfile(input: EnsureProfileInput): Promise<UserProfile | null>;
  updateProfile(userId: string, fullName: string | null): Promise<UserProfile>;
}
