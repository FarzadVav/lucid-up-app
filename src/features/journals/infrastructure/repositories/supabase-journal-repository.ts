import type { JournalRepository } from '@/features/journals/domain/repositories/journal-repository';
import { mapJournalRowToEntity } from '@/features/journals/infrastructure/mappers/journal-mapper';
import { supabase } from '@/shared/infrastructure/supabase/client';

export const supabaseJournalRepository: JournalRepository = {
  async listByCategory(categoryId, userId) {
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .eq('user_id', userId)
      .eq('category_id', categoryId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []).map(mapJournalRowToEntity);
  },

  async getById(journalId, userId) {
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .eq('id', journalId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data ? mapJournalRowToEntity(data) : null;
  },

  async create(input) {
    const { data, error } = await supabase
      .from('journals')
      .insert({
        title: input.title,
        content: input.content,
        category_id: input.categoryId,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapJournalRowToEntity(data);
  },

  async update(journalId, userId, input) {
    const { data, error } = await supabase
      .from('journals')
      .update({
        title: input.title,
        content: input.content,
        category_id: input.categoryId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', journalId)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Journal could not be updated.');
    }

    return mapJournalRowToEntity(data);
  },

  async delete(journalId, userId) {
    const { data, error } = await supabase
      .from('journals')
      .delete()
      .eq('id', journalId)
      .eq('user_id', userId)
      .select('id')
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('Journal not found.');
    }
  },
};
