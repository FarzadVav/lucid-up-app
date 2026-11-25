import type { ProfileRepository } from '@/features/profile/domain/repositories/profile-repository';
import { mapUserRowToProfile } from '@/features/profile/infrastructure/mappers/profile-mapper';
import { supabase } from '@/shared/infrastructure/supabase/client';

export const supabaseProfileRepository: ProfileRepository = {
  async getOrCreateProfile({ userId, email, fullName, avatarUrl }) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (data) {
      return mapUserRowToProfile(data);
    }

    if (!email) {
      return null;
    }

    const { data: created, error: insertError } = await supabase
      .from('users')
      .upsert(
        {
          id: userId,
          email,
          full_name: fullName,
          avatar_url: avatarUrl,
        },
        { onConflict: 'id' }
      )
      .select('*')
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return mapUserRowToProfile(created);
  },

  async updateProfile(userId, fullName) {
    const { data, error } = await supabase
      .from('users')
      .update({ full_name: fullName })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return mapUserRowToProfile(data);
  },
};
