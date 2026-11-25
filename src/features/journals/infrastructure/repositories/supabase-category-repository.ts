import type { CategoryRepository } from '@/features/journals/domain/repositories/category-repository';
import { mapCategoryRowToEntity } from '@/features/journals/infrastructure/mappers/journal-mapper';
import { supabase } from '@/shared/infrastructure/supabase/client';

export const supabaseCategoryRepository: CategoryRepository = {
  async listByUser(userId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(mapCategoryRowToEntity);
  },

  async getById(categoryId, userId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapCategoryRowToEntity(data) : null;
  },

  async getDefaultByUser(userId) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .eq('is_default', true)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapCategoryRowToEntity(data) : null;
  },

  async create(title) {
    const { data, error } = await supabase
      .from('categories')
      .insert({
        title,
        is_default: false,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapCategoryRowToEntity(data);
  },

  async update(categoryId, userId, title) {
    const { data, error } = await supabase
      .from('categories')
      .update({ title })
      .eq('id', categoryId)
      .eq('user_id', userId)
      .eq('is_default', false)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Category could not be updated.');
    }

    return mapCategoryRowToEntity(data);
  },

  async delete(categoryId) {
    const { data, error } = await supabase.rpc('delete_category', {
      p_category_id: categoryId,
    });

    if (error) {
      throw new Error(error.message);
    }

    const row = Array.isArray(data) ? data[0] : data;
    if (!row) {
      throw new Error('Failed to delete category.');
    }

    return {
      deletedCategoryId: row.deleted_category_id,
      defaultCategoryId: row.default_category_id,
      movedJournalsCount: row.moved_journals_count,
    };
  },
};
