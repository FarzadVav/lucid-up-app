import * as v from 'valibot';
import { describe, expect, it } from 'vitest';
import { loginSchema } from '@/features/auth/domain/schemas/login-schema';

describe('loginSchema', () => {
  it('trims and lowercases a valid email address', () => {
    const result = v.parse(loginSchema, { email: '  User@Example.COM  ' });
    expect(result.email).toBe('user@example.com');
  });

  it('rejects empty or invalid email addresses', () => {
    expect(v.safeParse(loginSchema, { email: '   ' }).success).toBe(false);
    expect(v.safeParse(loginSchema, { email: 'not-an-email' }).success).toBe(false);
  });
});
