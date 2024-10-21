import MemoMinus from '@/src/icons/minus';
import MemoPlus from '@/src/icons/plus';
import React from 'react';

export default function Counter({
  counter,
  setCounter,
  nextButtonClick,
  prevButtonClick,
  ...props
}: React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  counter: number;
  setCounter:
    | ((number: number) => void)
    | React.Dispatch<React.SetStateAction<number>>;
  nextButtonClick?: () => void;
  prevButtonClick?: () => void;
}) {
  return (
    <div className="counter">
      <button
        aria-label="Decrease counter"
        data-testid="decreaseCounter"
        onClick={() => {
          if (typeof prevButtonClick !== 'undefined') prevButtonClick();
          else if (counter > 1) setCounter(counter - 1);
        }}
        type="button"
        className="counterButton left"
      >
        <MemoMinus />
      </button>
      <input
        required
        onKeyDown={(e) => {
          // if not number or backspace or arrow keys, prevent
          if (
            !(
              (e.key >= '0' && e.key <= '9') ||
              e.key === 'Backspace' ||
              e.key === 'ArrowLeft' ||
              e.key === 'ArrowRight' ||
              e.key === 'ArrowUp' ||
              e.key === 'ArrowDown' ||
              e.key === 'Tab' ||
              e.key === 'Delete' ||
              e.key === 'Enter'
            )
          ) {
            e.preventDefault();
          }
          if (typeof props.onKeyDown !== 'undefined') props.onKeyDown(e);
        }}
        className="counterInput"
        name="counter"
        onChange={(e) => {
          if (e.target.value === '') return setCounter(1);
          setCounter(parseInt(e.target.value, 10));
          if (typeof props.onChange !== 'undefined') props.onChange(e);
        }}
        type="number"
        value={counter}
        {...props}
      />
      <button
        aria-label="Increase counter"
        data-testid="increaseCounter"
        onClick={() => {
          if (typeof nextButtonClick !== 'undefined') nextButtonClick();
          else setCounter(counter + 1);
        }}
        type="button"
        className="counterButton right"
      >
        <MemoPlus />
      </button>
    </div>
  );
}
