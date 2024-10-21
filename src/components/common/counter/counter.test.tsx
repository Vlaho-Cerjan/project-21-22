import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import Counter from './counter';

describe('Counter component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('increments counter on plus button click', () => {
    const setCounter = vi.fn();
    renderWithProviders(<Counter counter={1} setCounter={setCounter} />);
    fireEvent.click(screen.getByTestId('increaseCounter'));
    expect(setCounter).toHaveBeenCalledWith(2);
  });

  it('decrements counter on minus button click', () => {
    const setCounter = vi.fn();
    renderWithProviders(<Counter counter={2} setCounter={setCounter} />);
    fireEvent.click(screen.getByTestId('decreaseCounter'));
    expect(setCounter).toHaveBeenCalledWith(1);
  });

  it('calls nextButtonClick if provided, on plus button click', () => {
    const nextButtonClick = vi.fn();
    renderWithProviders(
      <Counter
        counter={1}
        setCounter={vi.fn()}
        nextButtonClick={nextButtonClick}
      />,
    );
    fireEvent.click(screen.getByTestId('increaseCounter'));
    expect(nextButtonClick).toHaveBeenCalled();
  });

  it('calls prevButtonClick if provided, on minus button click', () => {
    const prevButtonClick = vi.fn();
    renderWithProviders(
      <Counter
        counter={2}
        setCounter={vi.fn()}
        prevButtonClick={prevButtonClick}
      />,
    );
    fireEvent.click(screen.getByTestId('decreaseCounter'));
    expect(prevButtonClick).toHaveBeenCalled();
  });

  it('prevents non-numeric key entries', () => {
    const onKeyDown = vi.fn((e) => e.preventDefault());
    renderWithProviders(
      <Counter counter={1} setCounter={vi.fn()} onKeyDown={onKeyDown} />,
    );
    const input = screen.getByRole('spinbutton');
    fireEvent.keyDown(input, {key: 'a'});
    expect(onKeyDown).toHaveBeenCalled();
  });

  it('allows numeric key entries and does not call preventDefault', () => {
    const preventDefault = vi.fn();
    renderWithProviders(<Counter counter={1} setCounter={vi.fn()} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.keyDown(input, {key: '1', preventDefault});
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('updates counter on input change', () => {
    const setCounter = vi.fn();
    renderWithProviders(<Counter counter={1} setCounter={setCounter} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '3'}});
    expect(setCounter).toHaveBeenCalledWith(3);
  });

  it('prevents default and does not update counter for non-numeric key entries on input', () => {
    const setCounter = vi.fn();
    renderWithProviders(<Counter counter={1} setCounter={setCounter} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.keyDown(input, {key: 'a'});
    expect(setCounter).not.toHaveBeenCalled();
  });

  it('does not decrement counter below 1', () => {
    const setCounter = vi.fn();
    renderWithProviders(<Counter counter={1} setCounter={setCounter} />);
    fireEvent.click(screen.getByTestId('decreaseCounter'));
    expect(setCounter).not.toHaveBeenCalled();
  });

  it('resets counter to 1 if input is empty and blurred', () => {
    const setCounter = vi.fn();
    renderWithProviders(<Counter counter={5} setCounter={setCounter} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: ''}});
    fireEvent.blur(input);
    expect(setCounter).toHaveBeenCalledWith(1);
  });

  it('calls onChange prop on input change', () => {
    const onChange = vi.fn();
    renderWithProviders(
      <Counter counter={1} setCounter={vi.fn()} onChange={onChange} />,
    );
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, {target: {value: '3'}});
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onKeyDown prop on input key down', () => {
    const onKeyDown = vi.fn();
    renderWithProviders(
      <Counter counter={1} setCounter={vi.fn()} onKeyDown={onKeyDown} />,
    );
    const input = screen.getByRole('spinbutton');
    fireEvent.keyDown(input, {key: '1'});
    expect(onKeyDown).toHaveBeenCalled();
  });
});
