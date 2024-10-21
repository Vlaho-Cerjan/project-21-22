import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import WhiteButton from './whiteButton';

describe('WhiteButton component', () => {
  it('renders its children correctly', () => {
    renderWithProviders(<WhiteButton>Text</WhiteButton>);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('applies a className prop correctly', () => {
    const testClassName = 'test-class';
    renderWithProviders(
      <WhiteButton className={testClassName}>Text</WhiteButton>,
    );
    expect(screen.getByText('Text')).toHaveClass(
      `button whiteButton ${testClassName}`,
    );
  });

  it('passes other props to the button element', () => {
    const onClickMock = vi.fn();
    renderWithProviders(<WhiteButton onClick={onClickMock}>Text</WhiteButton>);

    fireEvent.click(screen.getByText('Text'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('merges provided className with default without overriding', () => {
    const customClass = 'custom-class';
    renderWithProviders(
      <WhiteButton className={customClass}>Text</WhiteButton>,
    );

    expect(screen.getByText('Text')).toHaveClass(
      `button whiteButton ${customClass}`,
    );
  });
});
