import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Description from './description'; // Adjust the import path as necessary

describe('Description component', () => {
  it('renders its children correctly', () => {
    renderWithProviders(<Description>Description Text</Description>);
    expect(screen.getByText('Description Text')).toBeInTheDocument();
  });

  it('applies a className prop correctly', () => {
    const testClassName = 'test-class';
    renderWithProviders(
      <Description className={testClassName}>Description Text</Description>,
    );
    expect(screen.getByText('Description Text')).toHaveClass(
      `description ${testClassName}`,
    );
  });

  it('passes other props to the span element', () => {
    const onClickMock = vi.fn();
    renderWithProviders(
      <Description onClick={onClickMock}>Clickable Description</Description>,
    );
    fireEvent.click(screen.getByText('Clickable Description'));
    expect(onClickMock).toHaveBeenCalled();
  });
});
