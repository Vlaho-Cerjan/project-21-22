import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import RequestPasswordResetModal from './requestPasswordModal';

describe('RequestPasswordResetModal', () => {
  let setOpen: any;
  let onSubmit: any;
  let email: string;

  beforeEach(() => {
    setOpen = vi.fn();
    onSubmit = vi.fn();
    email = 'test@example.com';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with provided props', () => {
    renderWithProviders(
      <RequestPasswordResetModal
        open
        setOpen={setOpen}
        email={email}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByText('Request Password Reset')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toHaveValue(email);
  });

  it('updates email input value when email prop changes', () => {
    const newEmail = 'new@example.com';
    const {rerender} = renderWithProviders(
      <RequestPasswordResetModal
        open
        setOpen={setOpen}
        email={email}
        onSubmit={onSubmit}
      />,
    );

    const emailInput = screen.getByLabelText(
      'Email Address',
    ) as HTMLInputElement;
    expect(emailInput).toHaveValue(email);

    rerender(
      <RequestPasswordResetModal
        open
        setOpen={setOpen}
        email={newEmail}
        onSubmit={onSubmit}
      />,
    );
    expect(emailInput).toHaveValue(newEmail);
  });

  it('resets email input when modal closes', () => {
    const {rerender} = renderWithProviders(
      <RequestPasswordResetModal
        open
        setOpen={setOpen}
        email={email}
        onSubmit={onSubmit}
      />,
    );

    const emailInput = screen.getByLabelText(
      'Email Address',
    ) as HTMLInputElement;
    fireEvent.change(emailInput, {target: {value: 'new@example.com'}});

    rerender(
      <RequestPasswordResetModal
        open={false}
        setOpen={setOpen}
        email={email}
        onSubmit={onSubmit}
      />,
    );
    expect(emailInput).toHaveValue(email);
  });

  it('calls onSubmit with correct email when submit button is clicked', async () => {
    renderWithProviders(
      <RequestPasswordResetModal
        open
        setOpen={setOpen}
        email={email}
        onSubmit={onSubmit}
      />,
    );

    const submitButton = screen.getByTestId('submitRequestPasswordResetButton');
    fireEvent.click(submitButton);

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith(email));
  });
});
