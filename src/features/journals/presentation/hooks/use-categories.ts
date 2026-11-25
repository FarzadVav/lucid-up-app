import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import {
  createCategoryUseCase,
  deleteCategoryUseCase,
  getCategoryByIdUseCase,
  listCategoriesUseCase,
  updateCategoryUseCase,
} from '@/features/journals/application/use-cases/category-use-cases';
import { supabaseCategoryRepository } from '@/features/journals/infrastructure/repositories/supabase-category-repository';
import { journalQueryKeys } from '@/features/journals/presentation/hooks/journal-query-keys';
import { isValidUuid } from '@/shared/utils/params';

export function useCategoriesQuery() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  return useQuery({
    queryKey: journalQueryKeys.categories(userId),
    enabled: Boolean(userId),
    queryFn: () => listCategoriesUseCase(supabaseCategoryRepository, userId!),
  });
}

export function useCategoryQuery(categoryId: string | null) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  return useQuery({
    queryKey: journalQueryKeys.category(userId, categoryId),
    enabled: Boolean(userId && isValidUuid(categoryId)),
    queryFn: () => getCategoryByIdUseCase(supabaseCategoryRepository, categoryId!, userId!),
  });
}

export function useCreateCategoryMutation() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) => createCategoryUseCase(supabaseCategoryRepository, title),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: journalQueryKeys.categories(userId),
      });
    },
  });
}

export function useUpdateCategoryMutation() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { categoryId: string; title: string }) => {
      if (!userId) {
        throw new Error('Authentication required.');
      }
      return updateCategoryUseCase(
        supabaseCategoryRepository,
        input.categoryId,
        userId,
        input.title
      );
    },
    onSuccess: async (updatedCategory) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: journalQueryKeys.categories(userId),
        }),
        queryClient.invalidateQueries({
          queryKey: journalQueryKeys.category(userId, updatedCategory.id),
        }),
      ]);
    },
  });
}

export function useDeleteCategoryMutation() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (categoryId: string) =>
      deleteCategoryUseCase(supabaseCategoryRepository, categoryId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: journalQueryKeys.all(userId),
      });
    },
  });
}
