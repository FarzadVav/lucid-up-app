import type { Journal } from '@/features/journals/domain/entities/journal';

export interface JournalRepository {
  listByCategory(categoryId: string, userId: string): Promise<Journal[]>;
  getById(journalId: string, userId: string): Promise<Journal | null>;
  create(input: { title: string; content: string; categoryId: string }): Promise<Journal>;
  update(
    journalId: string,
    userId: string,
    input: { title: string; content: string; categoryId: string }
  ): Promise<Journal>;
  delete(journalId: string, userId: string): Promise<void>;
}
