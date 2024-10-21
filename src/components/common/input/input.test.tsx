import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import React from 'react';
import {describe, expect, it, vi} from 'vitest';
import Input from './input';

describe('Input component', () => {
  it('forwards the ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    renderWithProviders(<Input ref={ref} data-testid="test-input" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByTestId('test-input')).toEqual(ref.current);
  });

  it('passes props to the input element', () => {
    const onChangeMock = vi.fn();
    renderWithProviders(
      <Input
        aria-label="test input"
        onChange={onChangeMock}
        data-testid="test-input"
      />,
    );

    fireEvent.change(screen.getByTestId('test-input'), {
      target: {value: 'test'},
    });
    expect(onChangeMock).toHaveBeenCalled();
    expect(screen.getByTestId('test-input')).toHaveAttribute(
      'aria-label',
      'test input',
    );
  });
});
