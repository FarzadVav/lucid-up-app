import type { UserProfile } from '@/features/profile/domain/entities/user-profile';
import type { Tables } from '@/shared/types/database.types';

export type UserRow = Tables<'users'>;

export function mapUserRowToProfile(row: UserRow): UserProfile {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
