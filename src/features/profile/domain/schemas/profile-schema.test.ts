import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import { profileSchema } from '@/features/profile/domain/schemas/profile-schema';

describe('profileSchema', () => {
  it('trims fullName and converts whitespace-only to null', () => {
    expect(v.parse(profileSchema, { fullName: '  Ada Lovelace  ' }).fullName).toBe('Ada Lovelace');
    expect(v.parse(profileSchema, { fullName: '   ' }).fullName).toBeNull();
  });

  it('rejects names exceeding 120 characters', () => {
    const result = v.safeParse(profileSchema, { fullName: 'a'.repeat(121) });
    expect(result.success).toBe(false);
  });
});
