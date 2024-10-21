import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import Button from './button';

describe('Button component', () => {
  it('renders its children correctly', () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies a className prop correctly', () => {
    const testClassName = 'test-class';
    renderWithProviders(<Button className={testClassName}>Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass(testClassName);
  });

  it('passes other props to the button element', () => {
    const onClickMock = vi.fn();
    renderWithProviders(<Button onClick={onClickMock}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(onClickMock).toHaveBeenCalled();
  });

  it('merges provided className with default without overriding', () => {
    const customClass = 'custom-class';
    renderWithProviders(<Button className={customClass}>Click me</Button>);

    // Assuming 'button' is a base class defined for all button components
    // Adjust based on your actual implementation details
    expect(screen.getByText('Click me')).toHaveClass(`button ${customClass}`);
  });
});
