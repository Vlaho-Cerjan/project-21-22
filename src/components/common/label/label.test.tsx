import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Label from './label';

describe('Label component', () => {
  it('renders children correctly', () => {
    render(<Label data-testid="test-label">Test Label</Label>);

    expect(screen.getByTestId('test-label')).toHaveTextContent('Test Label');
  });

  it('applies custom className along with default', () => {
    render(
      <Label className="custom-class" data-testid="test-label">
        Test Label
      </Label>,
    );

    expect(screen.getByTestId('test-label')).toHaveClass('label');
    expect(screen.getByTestId('test-label')).toHaveClass('custom-class');
  });

  it('passes other label attributes correctly', () => {
    render(
      <Label htmlFor="test-input" data-testid="test-label">
        Test Label
      </Label>,
    );

    expect(screen.getByTestId('test-label')).toHaveAttribute(
      'for',
      'test-input',
    );
  });
});
