import {render, screen} from '@testing-library/react';
import {expect} from 'vitest';
import PressEnter from './pressEnter';

test('renders PressEnter component', () => {
  render(<PressEnter />);

  const enterText = screen.getByTestId('pressEnterText');
  const enterIcon = screen.getByTestId('enterIcon');

  expect(enterText).toBeInTheDocument();
  expect(enterIcon).toBeInTheDocument();
});
