import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import {
  createJournalUseCase,
  deleteJournalUseCase,
  getJournalByIdUseCase,
  listJournalsByCategoryUseCase,
  updateJournalUseCase,
} from '@/features/journals/application/use-cases/journal-use-cases';
import { supabaseCategoryRepository } from '@/features/journals/infrastructure/repositories/supabase-category-repository';
import { supabaseJournalRepository } from '@/features/journals/infrastructure/repositories/supabase-journal-repository';
import { journalQueryKeys } from '@/features/journals/presentation/hooks/journal-query-keys';
import { isValidUuid } from '@/shared/utils/params';

export function useJournalsByCategoryQuery(categoryId: string | null) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  return useQuery({
    queryKey: journalQueryKeys.journalsByCategory(userId, categoryId),
    enabled: Boolean(userId && isValidUuid(categoryId)),
    queryFn: () => listJournalsByCategoryUseCase(supabaseJournalRepository, categoryId!, userId!),
  });
}

export function useJournalQuery(journalId: string | null) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  return useQuery({
    queryKey: journalQueryKeys.journal(userId, journalId),
    enabled: Boolean(userId && isValidUuid(journalId)),
    queryFn: () => getJournalByIdUseCase(supabaseJournalRepository, journalId!, userId!),
  });
}

export function useCreateJournalMutation() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { title: string; content: string; categoryId: string | null }) => {
      if (!userId) {
        throw new Error('Authentication required.');
      }
      return createJournalUseCase(
        supabaseJournalRepository,
        supabaseCategoryRepository,
        userId,
        input
      );
    },
    onSuccess: async (createdJournal) => {
      await queryClient.invalidateQueries({
        queryKey: journalQueryKeys.journalsByCategory(userId, createdJournal.categoryId),
      });
    },
  });
}

export function useUpdateJournalMutation() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      journalId: string;
      title: string;
      content: string;
      categoryId: string | null;
    }) => {
      if (!userId) {
        throw new Error('Authentication required.');
      }
      return updateJournalUseCase(
        supabaseJournalRepository,
        supabaseCategoryRepository,
        input.journalId,
        userId,
        {
          title: input.title,
          content: input.content,
          categoryId: input.categoryId,
        }
      );
    },
    onSuccess: async (updatedJournal) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: journalQueryKeys.journal(userId, updatedJournal.id),
        }),
        queryClient.invalidateQueries({
          queryKey: journalQueryKeys.all(userId),
        }),
      ]);
    },
  });
}

export function useDeleteJournalMutation() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (journalId: string) => {
      if (!userId) {
        throw new Error('Authentication required.');
      }
      return deleteJournalUseCase(supabaseJournalRepository, journalId, userId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: journalQueryKeys.all(userId),
      });
    },
  });
}
