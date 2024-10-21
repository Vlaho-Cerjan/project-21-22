import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';
import {describe, expect, it, vi} from 'vitest';
import ModalInput, {ForwardedRefModalInput} from './modalInput';

describe('ModalInput component', () => {
  it('passes props correctly to the input element', () => {
    const onChangeMock = vi.fn();
    render(
      <ModalInput
        aria-label="test modal input"
        onChange={onChangeMock}
        data-testid="modal-input"
      />,
    );

    fireEvent.change(screen.getByTestId('modal-input'), {
      target: {value: 'testing'},
    });
    expect(onChangeMock).toHaveBeenCalled();
    expect(screen.getByTestId('modal-input')).toHaveAttribute(
      'aria-label',
      'test modal input',
    );
  });
});

describe('ForwardedRefModalInput component', () => {
  it('forwards ref correctly to the input element', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(
      <ForwardedRefModalInput
        ref={ref}
        data-testid="forwarded-ref-modal-input"
      />,
    );

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(screen.getByTestId('forwarded-ref-modal-input')).toEqual(
      ref.current,
    );
  });

  it('passes props correctly to the input element', () => {
    const onChangeMock = vi.fn();
    render(
      <ForwardedRefModalInput
        aria-label="test forwarded modal input"
        onChange={onChangeMock}
        data-testid="forwarded-modal-input"
      />,
    );

    fireEvent.change(screen.getByTestId('forwarded-modal-input'), {
      target: {value: 'testing'},
    });
    expect(onChangeMock).toHaveBeenCalled();
    expect(screen.getByTestId('forwarded-modal-input')).toHaveAttribute(
      'aria-label',
      'test forwarded modal input',
    );
  });
});
