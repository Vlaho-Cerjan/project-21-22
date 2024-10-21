import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import Chip from './chip';

describe('Chip component', () => {
  const setValueMock = vi.fn();
  const title = 'Test Title';
  const name = 'testName';

  it('renders with the provided title', () => {
    renderWithProviders(
      <Chip value={false} setValue={setValueMock} title={title} name={name} />,
    );
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('toggles value on checkmark click', () => {
    const {rerender} = renderWithProviders(
      <Chip value={false} setValue={setValueMock} title={title} name={name} />,
    );

    fireEvent.click(screen.getByTestId('checkmarkButton'));
    expect(setValueMock).toHaveBeenCalledWith(true);

    setValueMock.mockClear();
    rerender(<Chip value setValue={setValueMock} title={title} name={name} />);
    fireEvent.click(screen.getByTestId('checkmarkButton'));
    expect(setValueMock).toHaveBeenCalledWith(false);
  });

  it('properly sets the checkbox input based on value', () => {
    const {rerender} = renderWithProviders(
      <Chip value setValue={setValueMock} title={title} name={name} />,
    );
    expect(screen.getByTestId('checkmarkInput')).toBeChecked();

    rerender(
      <Chip value={false} setValue={setValueMock} title={title} name={name} />,
    );
    expect(screen.getByTestId('checkmarkInput')).not.toBeChecked();
  });
});
