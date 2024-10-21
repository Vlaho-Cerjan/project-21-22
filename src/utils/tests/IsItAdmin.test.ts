import {getSession} from 'next-auth/react';
import {beforeEach, describe, expect, it} from 'vitest';
import IsItAdmin from '../IsItAdmin';

vi.mock('next-auth/react', () => ({
  getSession: vi.fn(),
})); // Adjust the import path as necessary

describe('IsItAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns true if the user has an admin role', async () => {
    (getSession as any).mockResolvedValue({
      user: {
        roles: [{name: 'Admin'}],
      },
    });

    const isAdmin = await IsItAdmin();
    expect(isAdmin).toBe(true);
  });

  it('returns false if the user does not have an admin role', async () => {
    (getSession as any).mockResolvedValue({
      user: {
        roles: [{name: 'User'}],
      },
    });

    const isAdmin = await IsItAdmin();
    expect(isAdmin).toBe(false);
  });

  it('returns false if there is no session', async () => {
    (getSession as any).mockResolvedValue(null);

    const isAdmin = await IsItAdmin();
    expect(isAdmin).toBe(false);
  });
});
