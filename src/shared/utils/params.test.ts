import { describe, expect, it } from 'vitest';
import { isValidUuid, normalizeRouteParam } from '@/shared/utils/params';

describe('params utils', () => {
  it('normalizes string and array route params', () => {
    expect(normalizeRouteParam('  abc  ')).toBe('abc');
    expect(normalizeRouteParam(['  first  ', 'second'])).toBe('first');
    expect(normalizeRouteParam('   ')).toBeNull();
    expect(normalizeRouteParam(undefined)).toBeNull();
  });

  it('validates UUIDs strictly', () => {
    expect(isValidUuid('11111111-1111-1111-1111-111111111111')).toBe(true);
    expect(isValidUuid('not-a-uuid')).toBe(false);
    expect(isValidUuid(null)).toBe(false);
  });
});
