// At the top of your test file
import axios from 'axios';
import {getServerSession} from 'next-auth';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import ApiRequest from '../apiRouter';

vi.mock('axios', () => {
  const axiosMock = vi.fn(() => Promise.resolve({data: {}}));
  return {
    __esModule: true, // This property makes it compatible as a module
    default: axiosMock, // Mock the default export as a function
    // Mock any specific methods you use, if necessary
    get: axiosMock,
    post: axiosMock,
    put: axiosMock,
  };
});

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('next-auth/react', () => ({
  signOut: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('ApiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    (axios as any).mockResolvedValue({data: {success: true}});
    (getServerSession as any).mockResolvedValue({user: {token: 'test-token'}});
  });

  it('sends a request and returns data on success', async () => {
    const response = await ApiRequest({uri: '/test', method: 'GET'});
    expect(response).toEqual({success: true});
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_API_URL}/test`,
      }),
    );
  });

  it('handles session expiration and shows a toast message', async () => {
    (axios as any).mockRejectedValueOnce({
      response: {
        data: {message: 'invalid_user_token'},
      },
    });
    try {
      await ApiRequest({uri: '/test', method: 'GET'});
    } catch (e) {
      expect(e).toEqual({
        response: {
          data: {
            message: 'invalid_user_token',
          },
        },
      });
    }
  });

  it('sends requests without auth if auth parameter is false', async () => {
    await ApiRequest({uri: '/test', method: 'GET', auth: false});
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      }),
    );
  });

  it('handles network errors gracefully', async () => {
    (axios as any).mockRejectedValueOnce(new Error('Network Error'));

    try {
      await ApiRequest({uri: '/test-network-error'});
    } catch (e) {
      expect(e).toEqual(new Error('Network Error'));
    }
  });

  it('sends requests with additional headers when provided', async () => {
    const additionalHeaders = {'X-Custom-Header': 'Value'};
    await ApiRequest({uri: '/test', method: 'GET', additionalHeaders});
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining(additionalHeaders),
      }),
    );
  });

  it('does not include Authorization header when session is not present', async () => {
    (getServerSession as any).mockResolvedValueOnce(null); // Simulate no session
    await ApiRequest({uri: '/test-no-session', auth: true});
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.not.objectContaining({
          Authorization: expect.any(String),
        }),
      }),
    );
  });

  it('handles API responses without a data property', async () => {
    (axios as any).mockResolvedValueOnce({});
    const response = await ApiRequest({uri: '/test-no-data'});
    expect(response).toEqual({});
  });

  it('signs out and redirects to /sign-up on specific API error messages', async () => {
    // Mock an API error response that should trigger a sign-out
    (axios as any).mockRejectedValue({
      response: {
        data: {message: 'invalid_token'}, // This error message triggers a sign-out
      },
    });

    try {
      await ApiRequest({uri: '/test-invalid-token'});
    } catch (e) {
      expect(e).toEqual({
        response: {
          data: {
            message: 'invalid_token',
          },
        },
      });
    }
  });

  it('handles the unauthorized user error message', async () => {
    (axios as any).mockRejectedValueOnce({
      response: {
        data: {message: 'unauthorized'},
      },
    });

    try {
      await ApiRequest({uri: '/test-unauthorized'});
    } catch (e) {
      expect(e).toEqual({
        response: {
          data: {
            message: 'unauthorized',
          },
        },
      });
    }

    (axios as any).mockRejectedValueOnce({
      response: {
        data: {message: 'invalid_token'},
      },
    });

    try {
      await ApiRequest({uri: '/test-invalid-token'});
    } catch (e) {
      expect(e).toEqual({
        response: {
          data: {
            message: 'invalid_token',
          },
        },
      });
    }

    (axios as any).mockRejectedValueOnce({
      response: {
        data: {message: 'invalid_user_token'},
      },
    });

    try {
      await ApiRequest({uri: '/test-invalid-user-token'});
    } catch (e) {
      expect(e).toEqual({
        response: {
          data: {
            message: 'invalid_user_token',
          },
        },
      });
    }
  });

  it('shows a generic error message when showError is true', async () => {
    (axios as any).mockRejectedValueOnce({
      response: {
        data: 'Error message',
      },
    });

    try {
      await ApiRequest({uri: '/test-generic-error'});
    } catch (e) {
      expect(e).toEqual({
        response: {
          data: 'Error message',
        },
      });
    }
  });

  it('shows a generic error message when showError is true and no error message is provided', async () => {
    (axios as any).mockRejectedValueOnce({
      response: {
        data: '',
      },
    });

    try {
      await ApiRequest({uri: '/test-generic-error-empty'});
    } catch (e) {
      expect(e).toEqual({
        response: {
          data: '',
        },
      });
    }
  });
});
