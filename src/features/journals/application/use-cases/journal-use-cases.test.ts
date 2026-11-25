import { describe, expect, it, vi } from 'vitest';
import {
  createCategoryUseCase,
  deleteCategoryUseCase,
} from '@/features/journals/application/use-cases/category-use-cases';
import {
  createJournalUseCase,
  updateJournalUseCase,
} from '@/features/journals/application/use-cases/journal-use-cases';
import { DEFAULT_CATEGORY_TITLE } from '@/features/journals/domain/constants';
import type { Category } from '@/features/journals/domain/entities/category';
import type { Journal } from '@/features/journals/domain/entities/journal';
import type { CategoryRepository } from '@/features/journals/domain/repositories/category-repository';
import type { JournalRepository } from '@/features/journals/domain/repositories/journal-repository';

const USER_ID = '11111111-1111-1111-1111-111111111111';
const DEFAULT_CAT_ID = '22222222-2222-2222-2222-222222222222';
const JOURNAL_ID = '33333333-3333-3333-3333-333333333333';

const defaultCategory: Category = {
  id: DEFAULT_CAT_ID,
  userId: USER_ID,
  title: DEFAULT_CATEGORY_TITLE,
  isDefault: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

function createMockCategoryRepo(overrides: Partial<CategoryRepository> = {}): CategoryRepository {
  return {
    listByUser: vi.fn().mockResolvedValue([defaultCategory]),
    getById: vi.fn().mockResolvedValue(defaultCategory),
    getDefaultByUser: vi.fn().mockResolvedValue(defaultCategory),
    create: vi.fn().mockResolvedValue(defaultCategory),
    update: vi.fn().mockResolvedValue(defaultCategory),
    delete: vi.fn().mockResolvedValue({
      deletedCategoryId: DEFAULT_CAT_ID,
      defaultCategoryId: DEFAULT_CAT_ID,
      movedJournalsCount: 0,
    }),
    ...overrides,
  };
}

function createMockJournalRepo(overrides: Partial<JournalRepository> = {}): JournalRepository {
  const sampleJournal: Journal = {
    id: JOURNAL_ID,
    userId: USER_ID,
    categoryId: DEFAULT_CAT_ID,
    title: 'Morning Reflection',
    content: 'Quiet thoughts.',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  return {
    listByCategory: vi.fn().mockResolvedValue([sampleJournal]),
    getById: vi.fn().mockResolvedValue(sampleJournal),
    create: vi.fn().mockResolvedValue(sampleJournal),
    update: vi.fn().mockResolvedValue(sampleJournal),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('journal and category use cases', () => {
  it('trims category title on create', async () => {
    const repo = createMockCategoryRepo();
    await createCategoryUseCase(repo, '  Reflections  ');
    expect(repo.create).toHaveBeenCalledWith('Reflections');
  });

  it('rejects deleting invalid category UUID', async () => {
    const repo = createMockCategoryRepo();
    await expect(deleteCategoryUseCase(repo, 'not-a-uuid')).rejects.toThrow('Invalid category.');
  });

  it('falls back to default category when creating journal with null categoryId', async () => {
    const categoryRepo = createMockCategoryRepo();
    const journalRepo = createMockJournalRepo();

    await createJournalUseCase(journalRepo, categoryRepo, USER_ID, {
      title: '  Evening Notes  ',
      content: 'Line 1\nLine 2',
      categoryId: null,
    });

    expect(categoryRepo.getDefaultByUser).toHaveBeenCalledWith(USER_ID);
    expect(journalRepo.create).toHaveBeenCalledWith({
      title: 'Evening Notes',
      content: 'Line 1\nLine 2',
      categoryId: DEFAULT_CAT_ID,
    });
  });

  it('requires a category when updating a journal', async () => {
    const categoryRepo = createMockCategoryRepo();
    const journalRepo = createMockJournalRepo();

    await expect(
      updateJournalUseCase(journalRepo, categoryRepo, JOURNAL_ID, USER_ID, {
        title: 'Title',
        content: 'Body',
        categoryId: null,
      })
    ).rejects.toThrow('Please select a category.');
  });
});
