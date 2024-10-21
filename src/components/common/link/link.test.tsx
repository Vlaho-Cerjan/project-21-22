import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import StyledLink from './link';

describe('StyledLink component', () => {
  it('renders children correctly', () => {
    render(<StyledLink href="/test">Test Link</StyledLink>);

    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('applies custom className along with default', () => {
    render(
      <StyledLink className="custom-class" href="/test">
        Test Link
      </StyledLink>,
    );

    expect(screen.getByText('Test Link')).toHaveClass('link');
    expect(screen.getByText('Test Link')).toHaveClass('custom-class');
  });

  it('passes href attribute correctly', () => {
    render(<StyledLink href="/test">Test Link</StyledLink>);

    expect(screen.getByText('Test Link')).toHaveAttribute('href', '/test');
  });
});
