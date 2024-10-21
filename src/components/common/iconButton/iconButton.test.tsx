import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import IconButton from './iconButton';

describe('IconButton component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.useFakeTimers();
  });

  it('renders with icon, prevEl, and nextEl correctly', () => {
    const icon = <div data-testid="icon-test">Icon</div>;
    const prevEl = <div data-testid="prev-test">Previous Element</div>;
    const nextEl = <div data-testid="next-test">Next Element</div>;

    renderWithProviders(
      <IconButton icon={icon} prevEl={prevEl} nextEl={nextEl}>
        Button
      </IconButton>,
    );

    expect(screen.getByTestId('icon-test')).toBeInTheDocument();
    expect(screen.getByTestId('prev-test')).toBeInTheDocument();
    expect(screen.getByTestId('next-test')).toBeInTheDocument();
  });

  it('shows tooltip on long press and hides on release', async () => {
    renderWithProviders(
      <IconButton
        data-testid="icon-button"
        icon={<div>Icon</div>}
        tooltipProps={{
          id: 'custom-tooltip-id',
          content: 'Tooltip Open',
        }}
      />,
    );

    // Simulate long press
    fireEvent.mouseDown(screen.getByTestId('icon-button'));
    // Fast-forward time to exceed the long press threshold

    vi.waitFor(() => {
      expect(screen.getByTestId('custom-tooltip-id')).toBeInTheDocument();
    }).then(() => {
      vi.advanceTimersByTime(1000);
    });
    // Simulate release
    fireEvent.mouseUp(screen.getByTestId('icon-button'));
    expect(screen.queryByText('custom-tooltip-id')).not.toBeInTheDocument();
  });

  it('closes the tooltip when long press is canceled by movement', async () => {
    renderWithProviders(
      <IconButton
        data-testid="icon-button"
        icon={<div>Icon</div>}
        tooltipProps={{
          id: 'tooltip-id',
          content: 'Tooltip Content',
        }}
      />,
    );

    // Start long press
    fireEvent.mouseDown(screen.getByTestId('icon-button'));

    // Simulate movement to cancel long press
    fireEvent.mouseMove(screen.getByTestId('icon-button'), {
      clientX: 30,
      clientY: 30,
    });

    fireEvent.mouseLeave(screen.getByTestId('icon-button'));

    vi.advanceTimersByTime(1000); // Advance time beyond the threshold

    // Assert tooltip has not opened because the long press was canceled
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();

    // Simulate release after canceling
    fireEvent.mouseUp(screen.getByTestId('icon-button'));
    // Ensure tooltip remains closed
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });

  it('closes the tooltip when long press is canceled by moving outside the element', async () => {
    renderWithProviders(
      <IconButton
        data-testid="icon-button"
        icon={<div>Icon</div>}
        tooltipProps={{
          id: 'tooltip-id',
          content: 'Tooltip Content',
        }}
      />,
    );

    // Start long press
    fireEvent.mouseDown(screen.getByTestId('icon-button'));

    // Simulate moving pointer outside the element
    fireEvent.mouseLeave(screen.getByTestId('icon-button'));
    vi.advanceTimersByTime(600); // Advance time beyond the threshold

    // Ensure tooltip has not opened because the long press was canceled by moving outside
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();

    // Simulate release after canceling
    fireEvent.mouseUp(screen.getByTestId('icon-button'));
    // Ensure tooltip remains closed
    expect(screen.queryByText('Tooltip Content')).not.toBeInTheDocument();
  });
});
