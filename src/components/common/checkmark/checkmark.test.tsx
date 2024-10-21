import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import Checkmark from './checkmark';

describe('Checkmark component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with the provided title', () => {
    const title = 'Test Title';
    renderWithProviders(
      <Checkmark value={false} setValue={() => {}} title={title} />,
    );
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('toggles value on button click', () => {
    const setValueMock = vi.fn();
    const {rerender} = renderWithProviders(
      <Checkmark value={false} setValue={setValueMock} title="Toggle" />,
    );

    fireEvent.click(screen.getByTestId('checkmarkButton'));
    expect(setValueMock).toHaveBeenCalledWith(true);

    // Reset mock and render with value as true
    setValueMock.mockClear();
    rerender(<Checkmark value setValue={setValueMock} title="Toggle" />);
    fireEvent.click(screen.getByTestId('checkmarkButton'));
    expect(setValueMock).toHaveBeenCalledWith(false);
  });

  it('shows checkmark tick when value is true', () => {
    renderWithProviders(<Checkmark value setValue={() => {}} />);
    expect(screen.getByTestId('checkmarkTick')).toBeInTheDocument();
  });

  it('does not show checkmark tick when value is false', () => {
    renderWithProviders(<Checkmark value={false} setValue={() => {}} />);
    const tickElement = screen.queryByTestId('checkmarkTick');
    expect(tickElement).not.toBeInTheDocument();
  });

  it('properly sets the checkbox input based on value', () => {
    const {rerender} = renderWithProviders(
      <Checkmark value setValue={() => {}} />,
    );
    expect(screen.getByTestId('checkmarkInput')).toBeChecked();

    rerender(<Checkmark value={false} setValue={() => {}} />);
    expect(screen.getByTestId('checkmarkInput')).not.toBeChecked();
  });
});
