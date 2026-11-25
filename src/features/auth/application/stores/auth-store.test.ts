import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from '@/features/auth/application/stores/auth-store';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      session: null,
      isInitialized: false,
      authError: null,
    });
  });

  it('clears authError when a valid session is set', () => {
    useAuthStore.getState().setAuthError('Expired link');
    useAuthStore.getState().setSession({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        fullName: null,
        avatarUrl: null,
      },
    });

    expect(useAuthStore.getState().session?.user.id).toBe('user-1');
    expect(useAuthStore.getState().authError).toBeNull();
  });

  it('resets session and authError', () => {
    useAuthStore.getState().setSession({
      user: {
        id: 'user-1',
        email: 'user@example.com',
        fullName: 'Ada',
        avatarUrl: null,
      },
    });
    useAuthStore.getState().setAuthError('Error');
    useAuthStore.getState().reset();

    expect(useAuthStore.getState().session).toBeNull();
    expect(useAuthStore.getState().authError).toBeNull();
  });
});
