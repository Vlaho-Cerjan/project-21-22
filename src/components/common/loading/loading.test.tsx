import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Loading from './loading';

// Mock MemoLoading since it's an external component, assuming it renders an SVG or similar
vi.mock('@/src/icons/loading', () => ({
  __esModule: true,
  default: () => <svg data-testid="loading-icon" />,
}));

describe('Loading component', () => {
  it('renders loading spinner when loading is true', () => {
    render(<Loading loading />);

    expect(screen.getByTestId('loadingContainer')).toHaveClass(
      'loadingContainer active',
    );
    expect(screen.getByTestId('loading-icon')).toBeInTheDocument();
  });

  it('does not render loading spinner when loading is false', () => {
    render(<Loading loading={false} />);

    expect(screen.getByTestId('loadingContainer')).not.toHaveClass('active');
    expect(screen.queryByTestId('loading-icon')).not.toBeInTheDocument();
  });
});
