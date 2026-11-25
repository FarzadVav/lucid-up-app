import * as v from 'valibot';
import type {
  Category,
  DeleteCategoryResult,
} from '@/features/journals/domain/entities/category';
import type { CategoryRepository } from '@/features/journals/domain/repositories/category-repository';
import { categoryFormSchema } from '@/features/journals/domain/schemas/category-schema';
import { isValidUuid } from '@/shared/utils/params';

export async function listCategoriesUseCase(
  repository: CategoryRepository,
  userId: string
): Promise<Category[]> {
  return repository.listByUser(userId);
}

export async function getCategoryByIdUseCase(
  repository: CategoryRepository,
  categoryId: string,
  userId: string
): Promise<Category | null> {
  if (!isValidUuid(categoryId)) {
    return null;
  }

  return repository.getById(categoryId, userId);
}

export async function createCategoryUseCase(
  repository: CategoryRepository,
  title: string
): Promise<Category> {
  const validated = v.parse(categoryFormSchema, { title });
  return repository.create(validated.title);
}

export async function updateCategoryUseCase(
  repository: CategoryRepository,
  categoryId: string,
  userId: string,
  title: string
): Promise<Category> {
  if (!isValidUuid(categoryId)) {
    throw new Error('Invalid category.');
  }

  const validated = v.parse(categoryFormSchema, { title });
  return repository.update(categoryId, userId, validated.title);
}

export async function deleteCategoryUseCase(
  repository: CategoryRepository,
  categoryId: string
): Promise<DeleteCategoryResult> {
  if (!isValidUuid(categoryId)) {
    throw new Error('Invalid category.');
  }

  return repository.delete(categoryId);
}
