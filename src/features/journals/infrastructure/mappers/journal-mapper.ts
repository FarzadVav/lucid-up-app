import type { Category } from '@/features/journals/domain/entities/category';
import type { Journal } from '@/features/journals/domain/entities/journal';
import type { AppDatabase } from '@/shared/infrastructure/supabase/client';

export type CategoryRow = AppDatabase['public']['Tables']['categories']['Row'];
export type JournalRow = AppDatabase['public']['Tables']['journals']['Row'];

export function mapCategoryRowToEntity(row: CategoryRow): Category {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapJournalRowToEntity(row: JournalRow): Journal {
  return {
    id: row.id,
    userId: row.user_id,
    categoryId: row.category_id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
