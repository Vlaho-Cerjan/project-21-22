import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import ClearButton from './clearButton';

describe('ClearButton component', () => {
  it('renders its children correctly', () => {
    renderWithProviders(<ClearButton>Clear</ClearButton>);
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('applies a className prop correctly', () => {
    const testClassName = 'test-class';
    renderWithProviders(
      <ClearButton className={testClassName}>Clear</ClearButton>,
    );
    expect(screen.getByText('Clear')).toHaveClass(
      `button clearButton ${testClassName}`,
    );
  });

  it('passes other props to the button element', () => {
    const onClickMock = vi.fn();
    renderWithProviders(<ClearButton onClick={onClickMock}>Clear</ClearButton>);

    fireEvent.click(screen.getByText('Clear'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('merges provided className with default without overriding', () => {
    const customClass = 'custom-class';
    renderWithProviders(
      <ClearButton className={customClass}>Clear</ClearButton>,
    );

    // The 'button' and 'clearButton' are base classes defined for the ClearButton components
    expect(screen.getByText('Clear')).toHaveClass(
      `button clearButton ${customClass}`,
    );
  });
});
