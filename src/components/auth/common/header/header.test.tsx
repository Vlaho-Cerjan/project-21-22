import {fireEvent, render, screen} from '@/test/utilities';
import {expect, vi} from 'vitest';
import Header from './header';

describe('Header', () => {
  test('renders logo and profile icons', () => {
    render(<Header setOpen={vi.fn()} />);

    // Assert that the logo and profile icons are rendered
    expect(screen.getByTestId('logoIcon')).toBeInTheDocument();
    expect(screen.getByTestId('signInIcon')).toBeInTheDocument();
  });

  test('calls setOpen when logo is clicked', () => {
    const setOpenMock = vi.fn();
    render(<Header setOpen={setOpenMock} />);

    // Simulate a click on the logo icon
    fireEvent.click(screen.getByTestId('signInButton'));

    // Assert that setOpen is called with the correct value
    expect(setOpenMock).toHaveBeenCalledWith(true);
  });
});
