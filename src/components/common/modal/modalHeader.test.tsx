import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import ModalHeader from './modalHeader';

describe('ModalHeader component', () => {
  const titleText = 'Test Title';
  const descriptionText = 'Test Description';

  it('renders the title correctly', () => {
    render(<ModalHeader title={titleText} />);
    expect(screen.getByText(titleText)).toBeInTheDocument();
  });

  it('conditionally renders the description', () => {
    // Description not rendered when prop not provided
    const {rerender} = render(<ModalHeader title={titleText} />);
    expect(screen.queryByText(descriptionText)).not.toBeInTheDocument();

    // Description rendered when prop provided
    rerender(<ModalHeader title={titleText} description={descriptionText} />);
    expect(screen.getByText(descriptionText)).toBeInTheDocument();
  });

  it('applies default and custom class names correctly', () => {
    const customClassName = 'custom-modal-header';
    render(
      <ModalHeader
        data-testid="testModalHeader"
        title={titleText}
        description={descriptionText}
        className={customClassName}
      />,
    );

    const modalHeaderDiv = screen.getByTestId('testModalHeader');
    expect(modalHeaderDiv).toHaveClass('modalHeader');
    expect(modalHeaderDiv).toHaveClass(customClassName);
  });
});
