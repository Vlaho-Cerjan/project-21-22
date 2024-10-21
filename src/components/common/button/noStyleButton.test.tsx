import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import NoStyleButton from './noStyleButton';

describe('NoStyleButton component', () => {
  it('renders its children correctly', () => {
    renderWithProviders(<NoStyleButton>Text</NoStyleButton>);
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('applies a className prop correctly', () => {
    const testClassName = 'test-class';
    renderWithProviders(
      <NoStyleButton className={testClassName}>Text</NoStyleButton>,
    );
    expect(screen.getByText('Text')).toHaveClass(
      `button noStyle ${testClassName}`,
    );
  });

  it('passes other props to the button element', () => {
    const onClickMock = vi.fn();
    renderWithProviders(
      <NoStyleButton onClick={onClickMock}>Text</NoStyleButton>,
    );

    fireEvent.click(screen.getByText('Text'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('merges provided className with default without overriding', () => {
    const customClass = 'custom-class';
    renderWithProviders(
      <NoStyleButton className={customClass}>Text</NoStyleButton>,
    );

    expect(screen.getByText('Text')).toHaveClass(
      `button noStyle ${customClass}`,
    );
  });
});
