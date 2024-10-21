import {describe, expect, it, vi} from 'vitest';

import * as signOut from 'next-auth/react';
import {RefreshIfLoggedOut} from '../RefreshIfLoggedOut';

describe('RefreshIfLoggedOut - Function that refreshes the page if the user is logged out', () => {
  const original = window.location;

  beforeEach(() => {
    // fake /api/auth/signout
    vi.spyOn(signOut, 'signOut').mockResolvedValue({
      url: '/sign-up',
    });
  });

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {reload: vi.fn()},
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: original,
    });
  });

  it('should call location.reload if the function receives "invalid_user_token" string', () => {
    const err = 'invalid_user_token';
    const signOutMock = vi.spyOn(signOut, 'signOut');
    RefreshIfLoggedOut(err);

    expect(signOutMock).toHaveBeenCalled();
  });

  it('should call location.reload if the function receives "unauthorized" string', () => {
    const err = 'unauthorized';

    const signOutMock = vi.spyOn(signOut, 'signOut');
    RefreshIfLoggedOut(err);

    expect(signOutMock).toHaveBeenCalled();
  });
});
