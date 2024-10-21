import ClientApiRequest from '@/src/lib/clientApiRouter';
import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen, waitFor} from '@testing-library/react';
import * as nextAuth from 'next-auth/react';
import {useRouter, useSearchParams} from 'next/navigation';
import {toast} from 'react-toastify';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import SignInModal from './signInModal'; // Adjust the path accordingly

// Mock modules
vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('@/src/lib/clientApiRouter', () => ({
  __esModule: true,
  default: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('SignInModal', () => {
  const setOpenMock = vi.fn();
  const setInputErrorMock = vi.fn();
  const useRouterMock = useRouter as any;
  const useSearchParamsMock = useSearchParams as any;

  beforeEach(() => {
    useRouterMock.mockReturnValue({push: vi.fn()});
    useSearchParamsMock.mockReturnValue({
      get: vi.fn(() => 'mock-callback-url'),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders SignInModal with form elements', () => {
    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Need help signing in?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('opens the sign-in modal if url contains signIn=true', async () => {
    useSearchParamsMock.mockReturnValue({
      get: vi.fn(() => 'true'),
    });

    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    await waitFor(() => expect(screen.getByText('Sign in')).toBeVisible());
  });

  it('handles email and password input changes', () => {
    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    const emailInput = screen.getByPlaceholderText('Email Address');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});
    fireEvent.change(passwordInput, {target: {value: 'password'}});

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password');
  });

  it('handles form submission successfully', async () => {
    const signInMock = nextAuth.signIn as any;
    signInMock.mockResolvedValue({ok: true});
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({push: pushMock});

    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'password'},
    });
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password',
        remember_me: false,
      });
      expect(pushMock).toHaveBeenCalledWith('mock-callback-url');
    });
  });

  it('handles form submission successfully with remember me checked', async () => {
    const signInMock = nextAuth.signIn as any;
    signInMock.mockResolvedValue({ok: true});
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({push: pushMock});

    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'password'},
    });
    fireEvent.click(screen.getByText('Remember me'));
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password',
        remember_me: true,
      });
      expect(pushMock).toHaveBeenCalledWith('mock-callback-url');
    });
  });

  it('handles form submission successfully with redirect to home page if no callback url', async () => {
    const signInMock = nextAuth.signIn as any;
    signInMock.mockResolvedValue({ok: true});
    const pushMock = vi.fn();
    useRouterMock.mockReturnValue({push: pushMock});
    useSearchParamsMock.mockReturnValue({
      get: vi.fn(() => null),
    });

    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'password'},
    });
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith('/');
    });
  });

  it('displays error message if sign-in fails', async () => {
    const signInMock = nextAuth.signIn as any;
    signInMock.mockResolvedValue({ok: false, data: {message: 'error'}});
    const {rerender} = renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'password'},
    });
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalled();
      expect(
        screen.getByText('Email or password is incorrect. Please try again.'),
      ).toBeVisible();
    });

    rerender(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError
        setInputError={setInputErrorMock}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('inputErrorContainer')).toHaveClass('active');
      expect(
        screen.getByText('Email or password is incorrect. Please try again.'),
      ).toBeVisible();
    });
  });

  it('displays specific error message if sign-in call is rejected', async () => {
    const signInMock = nextAuth.signIn as any;
    signInMock.mockRejectedValue({data: {message: 'error'}});
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'password'},
    });
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'An unexpected error happened:',
        'error',
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('displays error message if unexpected error occurs during sign-in', async () => {
    const signInMock = nextAuth.signIn as any;
    signInMock.mockRejectedValue({});

    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: {value: 'password'},
    });
    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalled();
      expect(
        screen.getByText(
          'Something went wrong. Please try again or contact support.',
        ),
      ).toBeInTheDocument();
    });
  });

  it('displays error message if email or password is missing', async () => {
    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    fireEvent.click(screen.getByText('Sign in'));

    await waitFor(() => {
      expect(
        screen.getByText('Please enter your email and password.'),
      ).toBeInTheDocument();
    });
  });

  it('opens request password reset modal', async () => {
    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('requestPasswordResetModal'),
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Need help signing in?'));
    expect(screen.getByTestId('requestPasswordResetModal')).toBeVisible();
  });

  it('handles password reset successfully', async () => {
    const toastSuccessMock = vi.fn();
    (toast.success as unknown) = toastSuccessMock;
    (ClientApiRequest as any).mockResolvedValue({success: true});

    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    await waitFor(() => {
      expect(
        screen.getByTestId('requestPasswordResetModal'),
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Need help signing in?'));
    expect(screen.getByTestId('requestPasswordResetModal')).toBeVisible();
    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.click(screen.getByText('Send Reset Link'));

    await waitFor(() => {
      expect(ClientApiRequest).toHaveBeenCalledWith({
        uri: 'auth/password-request',
        method: 'POST',
        auth: false,
        data: {email: 'test@example.com'},
      });
      expect(toastSuccessMock).toHaveBeenCalledWith(
        'Password reset email sent. Please check your email.',
      );
    });
  });

  it('displays error message if password reset fails', async () => {
    const toastErrorMock = vi.fn();
    (toast.error as unknown) = toastErrorMock;
    (ClientApiRequest as any).mockResolvedValue({success: false});

    renderWithProviders(
      <SignInModal
        open
        setOpen={setOpenMock}
        inputError={false}
        setInputError={setInputErrorMock}
      />,
    );

    fireEvent.click(screen.getByText('Need help signing in?'));
    await waitFor(() => {
      expect(
        screen.getByTestId('requestPasswordResetModal'),
      ).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Email Address'), {
      target: {value: 'test@example.com'},
    });
    fireEvent.click(screen.getByText('Send Reset Link'));

    await waitFor(() => {
      expect(ClientApiRequest).toHaveBeenCalledWith({
        uri: 'auth/password-request',
        method: 'POST',
        auth: false,
        data: {email: 'test@example.com'},
      });
      expect(toastErrorMock).toHaveBeenCalledWith(
        'Error sending password reset email.',
      );
    });
  });
});
