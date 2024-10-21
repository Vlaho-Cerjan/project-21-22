import MemoEye from '@/src/icons/eye';
import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {expect, vi} from 'vitest';
import PassEyeButton from './passEyeButton';

describe('PassEyeButton', () => {
  it('should render properly', () => {
    renderWithProviders(<PassEyeButton />);
    const button = screen.getByRole('button');
    const icon = screen.getByTestId('defaultEyeIcon');
    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
  });

  it('should render the button with the provided icon', () => {
    renderWithProviders(
      <PassEyeButton icon={<MemoEye data-testid="eyeSvg" />} />,
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toContainElement(screen.getByTestId('eyeSvg'));
  });

  it('should toggle the state when clicked', () => {
    const setState = vi.fn();
    const {rerender} = renderWithProviders(
      <PassEyeButton icon={<MemoEye />} state={false} setState={setState} />,
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByTestId('eyeButton')).toHaveClass('active');
    expect(setState).toHaveBeenCalledWith(true);
    rerender(<PassEyeButton icon={<MemoEye />} state setState={setState} />);
    fireEvent.click(button);
    expect(screen.getByTestId('eyeButton')).not.toHaveClass('active');
    expect(setState).toHaveBeenCalledWith(false);
  });

  it('should work with password input', () => {
    renderWithProviders(
      <>
        <input data-testid="passwordInput" type="password" name="password" />
        <PassEyeButton
          icon={<MemoEye />}
          passInputName="password"
          state={false}
        />
      </>,
    );
    const button = screen.getByRole('button');
    const input = screen.getByTestId('passwordInput') as HTMLInputElement;
    fireEvent.click(button);
    expect(input.type).toBe('text');
    expect(button).toHaveClass('active');
    fireEvent.click(button);
    expect(input.type).toBe('password');
    expect(button).not.toHaveClass('active');
  });

  it('should set the outside type with setType', () => {
    const setType = vi.fn();
    renderWithProviders(
      <>
        <input data-testid="passwordInput" type="password" name="password" />
        <PassEyeButton
          icon={<MemoEye />}
          passInputName="password"
          state={false}
          setType={setType}
        />
      </>,
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(setType).toHaveBeenCalledWith('text');
    fireEvent.click(button);
    expect(setType).toHaveBeenCalledWith('password');
  });
});
