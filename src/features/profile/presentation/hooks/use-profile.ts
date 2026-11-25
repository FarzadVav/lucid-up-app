import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import {
  getOrCreateProfileUseCase,
  updateProfileUseCase,
} from '@/features/profile/application/use-cases/profile-use-cases';
import { supabaseProfileRepository } from '@/features/profile/infrastructure/repositories/supabase-profile-repository';

export const profileQueryKeys = {
  all: ['profile'] as const,
  detail: (userId: string | null) => ['profile', userId] as const,
};

export function useProfileQuery() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  return useQuery({
    queryKey: profileQueryKeys.detail(userId),
    enabled: Boolean(userId),
    queryFn: () => {
      if (!user) {
        return null;
      }
      return getOrCreateProfileUseCase(supabaseProfileRepository, {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
      });
    },
  });
}

export function useUpdateProfileMutation() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { fullName: string | null }) => {
      if (!userId) {
        throw new Error('You must be signed in to update your profile.');
      }
      return updateProfileUseCase(supabaseProfileRepository, userId, input);
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileQueryKeys.detail(userId), updatedProfile);
    },
  });
}
