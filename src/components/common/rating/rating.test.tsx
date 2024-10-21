import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Rating from './rating';

describe('Rating component', () => {
  it('renders the rating correctly', () => {
    const ratingValue = 'Excellent';
    render(<Rating rating={ratingValue} />);

    const ratingText = screen.getByTestId('ratingText');
    expect(ratingText).toHaveTextContent(ratingValue);
  });

  it('applies the default and custom class names correctly', () => {
    const customClassName = 'custom-rating';
    const ratingValue = 'Good';
    render(<Rating className={customClassName} rating={ratingValue} />);

    const ratingContainer = screen.getByTestId('ratingContainer');
    expect(ratingContainer).toHaveClass('ratingContainer');
    expect(ratingContainer).toHaveClass(customClassName);

    const ratingDiv = screen.getByTestId('rating');
    expect(ratingDiv).toHaveClass('rating');
    expect(ratingDiv).toHaveClass(ratingValue.toLocaleLowerCase());
  });
});
