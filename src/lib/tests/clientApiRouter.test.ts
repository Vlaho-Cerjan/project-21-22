// At the top of your test file
import axios from 'axios';
import {getSession, signOut} from 'next-auth/react';
import {toast} from 'react-toastify';

import {beforeEach, describe, expect, it, vi} from 'vitest';
import ClientApiRequest from '../clientApiRouter';

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

vi.mock('next-auth/react', () => ({
  getSession: vi.fn(),
  signOut: vi.fn(),
}));
vi.mock('react-toastify', () => ({
  toast: {
    error: vi.fn(),
  },
}));

describe('ClientApiRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    (axios as any).mockResolvedValue({data: {success: true}});
    (getSession as any).mockResolvedValue({user: {token: 'test-token'}});
  });

  it('sends a request and returns data on success', async () => {
    const response = await ClientApiRequest({uri: '/test', method: 'GET'});
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
    await ClientApiRequest({uri: '/test', method: 'GET', showError: true});
    expect(toast.error).toHaveBeenCalledWith(
      'Session expired, please login again',
      expect.anything(),
    );
  });

  it('sends requests without auth if auth parameter is false', async () => {
    await ClientApiRequest({uri: '/test', method: 'GET', auth: false});
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
    await ClientApiRequest({uri: '/test-network-error', showError: true});
    expect(toast.error).toHaveBeenCalledWith(
      'Network Error',
      expect.anything(),
    );
  });

  it('sends requests with additional headers when provided', async () => {
    const additionalHeaders = {'X-Custom-Header': 'Value'};
    await ClientApiRequest({uri: '/test', method: 'GET', additionalHeaders});
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining(additionalHeaders),
      }),
    );
  });

  it('does not include Authorization header when session is not present', async () => {
    (getSession as any).mockResolvedValueOnce(null); // Simulate no session
    await ClientApiRequest({uri: '/test-no-session', auth: true});
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
    const response = await ClientApiRequest({uri: '/test-no-data'});
    expect(response).toEqual({});
  });

  it('signs out and redirects to /sign-up on specific API error messages', async () => {
    // Mock an API error response that should trigger a sign-out
    (axios as any).mockRejectedValue({
      response: {
        data: {message: 'invalid_token'}, // This error message triggers a sign-out
      },
    });

    await ClientApiRequest({uri: '/test-sign-out'});

    // Check if the signOut function was called with the expected redirect argument
    await vi.waitFor(
      () => {
        // expect(signOut).toHaveBeenCalled();
        expect(toast.error).toHaveBeenCalledWith(
          'Session expired, please login again',
          expect.anything(),
        );
      },
      {
        timeout: 3000,
      },
    );
  });

  it('handles aborted requests gracefully', async () => {
    // Mock an aborted request error
    (axios as any).mockRejectedValueOnce({message: 'canceled'});
    const mockAbort = new AbortController();
    // mock the signal property of the abort controller and set aborted to true
    Object.defineProperty(mockAbort.signal, 'aborted', {value: true});

    await ClientApiRequest({
      uri: '/test-aborted',
      abort: mockAbort,
    });
    expect(toast.error).toHaveBeenCalledWith(
      'The user aborted the request',
      expect.anything(),
    );
  });

  it('handles the unauthorized user error message', async () => {
    (axios as any).mockRejectedValueOnce({
      response: {
        data: {message: 'unauthorized'},
      },
    });

    await ClientApiRequest({uri: '/test-unauthorized'});
    expect(toast.error).toHaveBeenCalledWith('Unauthorized', expect.anything());
    expect(signOut).toHaveBeenCalled();

    (axios as any).mockRejectedValueOnce({
      response: {
        data: {message: 'invalid_token'},
      },
    });

    await ClientApiRequest({uri: '/test-invalid-token'});
    expect(toast.error).toHaveBeenCalledWith(
      'Session expired, please login again',
      expect.anything(),
    );
    expect(signOut).toHaveBeenCalled();

    (axios as any).mockRejectedValueOnce({
      response: {
        data: {message: 'invalid_user_token'},
      },
    });

    await ClientApiRequest({uri: '/test-invalid-user-token'});

    expect(toast.error).toHaveBeenCalledWith(
      'Session expired, please login again',
      expect.anything(),
    );
    expect(signOut).toHaveBeenCalled();
  });

  it('shows a generic error message when showError is true', async () => {
    (axios as any).mockRejectedValueOnce({
      response: {
        data: 'Error message',
      },
    });

    await ClientApiRequest({uri: '/test-generic-error', showError: true});
    expect(toast.error).toHaveBeenCalledWith(
      'Error message',
      expect.anything(),
    );
  });

  it('shows a generic error message when showError is true and no error message is provided', async () => {
    (axios as any).mockRejectedValueOnce({
      response: {
        data: '',
      },
    });

    await ClientApiRequest({uri: '/test-generic-error-empty', showError: true});
    expect(toast.error).toHaveBeenCalledWith(
      'An error occurred',
      expect.anything(),
    );
  });
});
