import {LoadingContext} from '@/src/store/providers/loadingProvider';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import React from 'react';
import {describe, expect, it, vi} from 'vitest';
import SidebarFormButton from './sidebarFormButton';

const mockLoadingContext = {
  loading: false,
  setLoading: vi.fn(),
};

const TestWrapper: React.FC<{children: React.ReactNode}> = ({children}) => {
  return (
    <LoadingContext.Provider value={mockLoadingContext}>
      {children}
    </LoadingContext.Provider>
  );
};

describe('SidebarFormButton', () => {
  beforeEach(() => {
    mockLoadingContext.setLoading.mockClear();
  });

  it('should render with default text', () => {
    render(<SidebarFormButton />, {wrapper: TestWrapper});
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('should render with a custom class', () => {
    render(<SidebarFormButton text="Sign in" className="custom" />, {
      wrapper: TestWrapper,
    });
    expect(screen.getByText('Sign in')).toHaveClass('custom');
  });

  it('should display loading text and icon when loading', async () => {
    const onClick = vi.fn().mockResolvedValue('success');
    render(
      <SidebarFormButton
        text="Sign in"
        loadingText="Loading..."
        onClick={onClick}
      />,
      {
        wrapper: TestWrapper,
      },
    );
    const button = screen.getByText('Sign in');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByTestId('loadingIcon')).toBeInTheDocument();
    });
  });

  it('should display success text and icon on success', async () => {
    const onClick = vi.fn().mockResolvedValue('success');
    render(
      <SidebarFormButton
        text="Sign in"
        loadingText="Loading..."
        successText="Success!"
        onClick={onClick}
      />,
      {wrapper: TestWrapper},
    );
    const button = screen.getByText('Sign in');
    fireEvent.click(button);
    await waitFor(() =>
      expect(screen.getByText('Loading...')).toBeInTheDocument(),
    );
    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByTestId('successIcon')).toBeInTheDocument();
    });

    await waitFor(
      () => expect(screen.getByText('Sign in')).toBeInTheDocument(),
      {
        timeout: 3000,
      },
    );
  });

  it('should display error text and icon on error', async () => {
    const onClick = vi.fn().mockResolvedValue('error');
    const setIsError = vi.fn();
    const {rerender} = render(
      <SidebarFormButton
        text="Sign in"
        loadingText="Loading..."
        errorText="Error!"
        onClick={onClick}
        setIsError={setIsError}
      />,
      {wrapper: TestWrapper},
    );
    const button = screen.getByText('Sign in');
    fireEvent.click(button);

    // Wait for the loading text
    await waitFor(() =>
      expect(screen.getByText('Loading...')).toBeInTheDocument(),
    );

    // Simulate setting error state
    setIsError(true);
    rerender(
      <SidebarFormButton
        text="Sign in"
        loadingText="Loading..."
        errorText="Error!"
        onClick={onClick}
        setIsError={setIsError}
        isError // Ensure isError prop is set
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Error!')).toBeInTheDocument();
      expect(screen.getByTestId('errorIcon')).toBeInTheDocument();
    });

    setIsError(false);
    rerender(
      <SidebarFormButton
        text="Sign in"
        loadingText="Loading..."
        errorText="Error!"
        onClick={onClick}
        setIsError={setIsError}
        isError={false} // Ensure isError prop is set
      />,
    );

    await waitFor(
      () => expect(screen.getByText('Sign in')).toBeInTheDocument(),
      {
        timeout: 4000,
      },
    );
  });

  it('should call setLoading on click', async () => {
    const onClick = vi.fn().mockResolvedValue('success');
    render(<SidebarFormButton text="Sign in" onClick={onClick} />, {
      wrapper: TestWrapper,
    });
    const button = screen.getByText('Sign in');
    fireEvent.click(button);
    await waitFor(() =>
      expect(mockLoadingContext.setLoading).toHaveBeenCalledWith(true),
    );
  });

  it('should handle modal validation and set error state', async () => {
    const onClick = vi.fn().mockResolvedValue('error');
    const setIsError = vi.fn();
    document.body.innerHTML = `
      <div class="test-modal">
        <input required />
        <div class="errorContainer"></div>
      </div>
    `;
    const {rerender} = render(
      <SidebarFormButton
        text="Sign in"
        onClick={onClick}
        sidebarClass="test-modal"
        setIsError={setIsError}
      />,
      {wrapper: TestWrapper},
    );
    const button = screen.getByText('Sign in');
    fireEvent.click(button);

    // Wait for error state to be set
    await waitFor(() => {
      expect(setIsError).toHaveBeenCalledWith(true);
    });

    // Simulate setting error state
    setIsError(true);
    rerender(
      <SidebarFormButton
        text="Sign in"
        loadingText="Loading..."
        onClick={onClick}
        setIsError={setIsError}
        isError // Ensure isError prop is set
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Error!')).toBeInTheDocument();
      expect(screen.getByTestId('errorIcon')).toBeInTheDocument();
    });
  });

  it('should handle modal validation with bad input and set error state', async () => {
    const onClick = vi.fn().mockResolvedValue('error');
    const setIsError = vi.fn();
    document.body.innerHTML = `
      <div class="test-modal">
        <input type="email" value="test" required />
        <div class="errorContainer"></div>
      </div>
    `;
    const {rerender} = render(
      <SidebarFormButton
        text="Sign in"
        onClick={onClick}
        sidebarClass="test-modal"
        setIsError={setIsError}
      />,
      {wrapper: TestWrapper},
    );
    const button = screen.getByText('Sign in');
    fireEvent.click(button);

    // Wait for error state to be set
    await waitFor(() => {
      expect(setIsError).toHaveBeenCalledWith(true);
    });

    // Simulate setting error state
    setIsError(true);
    rerender(
      <SidebarFormButton
        text="Sign in"
        loadingText="Loading..."
        onClick={onClick}
        setIsError={setIsError}
        isError // Ensure isError prop is set
      />,
    );

    await waitFor(() => {
      expect(screen.getByText('Error!')).toBeInTheDocument();
      expect(screen.getByTestId('errorIcon')).toBeInTheDocument();
    });
  });

  it('should handle modal validation and continue on success', async () => {
    const onClick = vi.fn().mockResolvedValue('success');
    const setIsError = vi.fn();
    document.body.innerHTML = `
      <div class="test-modal">
        <input required />
        <div class="errorContainer"></div>
      </div>
    `;
    render(
      <SidebarFormButton
        text="Sign in"
        onClick={onClick}
        sidebarClass="test-modal"
        setIsError={setIsError}
      />,
      {wrapper: TestWrapper},
    );
    const button = screen.getByText('Sign in');
    fireEvent.click(button);

    // Wait for loading state
    await waitFor(() =>
      expect(mockLoadingContext.setLoading).toHaveBeenCalledWith(true),
    );

    // Simulate success response
    await waitFor(() => {
      expect(onClick).toHaveBeenCalled();
      expect(mockLoadingContext.setLoading).toHaveBeenCalledWith(false);
    });

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument();
      expect(screen.getByTestId('successIcon')).toBeInTheDocument();
    });
  });

  it('should render with different variants', () => {
    const {rerender} = render(
      <SidebarFormButton text="Sign in" buttonVariant="success" />,
      {
        wrapper: TestWrapper,
      },
    );
    expect(screen.getByText('Sign in')).toHaveClass('success');
    rerender(<SidebarFormButton text="Sign in" buttonVariant="error" />);
    expect(screen.getByText('Sign in')).toHaveClass('error');
    rerender(<SidebarFormButton text="Sign in" buttonVariant="warning" />);
    expect(screen.getByText('Sign in')).toHaveClass('warning');
    rerender(<SidebarFormButton text="Sign in" buttonVariant="info" />);
    expect(screen.getByText('Sign in')).toHaveClass('info');
  });
});
