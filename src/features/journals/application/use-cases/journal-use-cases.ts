import * as v from 'valibot';
import { DEFAULT_CATEGORY_TITLE } from '@/features/journals/domain/constants';
import type { Journal } from '@/features/journals/domain/entities/journal';
import type { CategoryRepository } from '@/features/journals/domain/repositories/category-repository';
import type { JournalRepository } from '@/features/journals/domain/repositories/journal-repository';
import {
  journalCreateSchema,
  journalUpdateSchema,
} from '@/features/journals/domain/schemas/journal-schema';
import { isValidUuid } from '@/shared/utils/params';

export async function listJournalsByCategoryUseCase(
  repository: JournalRepository,
  categoryId: string,
  userId: string
): Promise<Journal[]> {
  if (!isValidUuid(categoryId)) {
    return [];
  }

  return repository.listByCategory(categoryId, userId);
}

export async function getJournalByIdUseCase(
  repository: JournalRepository,
  journalId: string,
  userId: string
): Promise<Journal | null> {
  if (!isValidUuid(journalId)) {
    return null;
  }

  return repository.getById(journalId, userId);
}

export async function createJournalUseCase(
  journalRepository: JournalRepository,
  categoryRepository: CategoryRepository,
  userId: string,
  input: {
    title: string;
    content: string;
    categoryId: string | null;
  }
): Promise<Journal> {
  const validated = v.parse(journalCreateSchema, input);

  let targetCategoryId = validated.categoryId;

  if (targetCategoryId) {
    if (!isValidUuid(targetCategoryId)) {
      throw new Error('Selected category is invalid or unavailable.');
    }

    const selectedCategory = await categoryRepository.getById(targetCategoryId, userId);
    if (!selectedCategory) {
      throw new Error('Selected category is invalid or unavailable.');
    }
    targetCategoryId = selectedCategory.id;
  } else {
    const defaultCategory = await categoryRepository.getDefaultByUser(userId);
    if (!defaultCategory) {
      throw new Error(`Default category "${DEFAULT_CATEGORY_TITLE}" was not found.`);
    }
    targetCategoryId = defaultCategory.id;
  }

  return journalRepository.create({
    title: validated.title,
    content: validated.content,
    categoryId: targetCategoryId,
  });
}

export async function updateJournalUseCase(
  journalRepository: JournalRepository,
  categoryRepository: CategoryRepository,
  journalId: string,
  userId: string,
  input: {
    title: string;
    content: string;
    categoryId: string | null;
  }
): Promise<Journal> {
  if (!isValidUuid(journalId)) {
    throw new Error('Invalid journal.');
  }

  const validated = v.parse(journalUpdateSchema, input);

  if (!validated.categoryId || !isValidUuid(validated.categoryId)) {
    throw new Error('Selected category is invalid or unavailable.');
  }

  const selectedCategory = await categoryRepository.getById(validated.categoryId, userId);
  if (!selectedCategory) {
    throw new Error('Selected category is invalid or unavailable.');
  }

  return journalRepository.update(journalId, userId, {
    title: validated.title,
    content: validated.content,
    categoryId: selectedCategory.id,
  });
}

export async function deleteJournalUseCase(
  repository: JournalRepository,
  journalId: string,
  userId: string
): Promise<void> {
  if (!isValidUuid(journalId)) {
    throw new Error('Invalid journal.');
  }

  await repository.delete(journalId, userId);
}
