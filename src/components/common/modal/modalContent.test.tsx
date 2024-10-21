import {render, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import ModalContent from './modalContent';

describe('ModalContent component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders its children correctly', () => {
    render(
      <ModalContent>
        <input type="text" placeholder="Test Input" />
      </ModalContent>,
    );

    const inputElement = screen.getByPlaceholderText('Test Input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.tagName).toBe('INPUT');
  });

  it('applies default and custom class names correctly', () => {
    const customClassName = 'custom-modal-content';
    render(
      <ModalContent data-testid="testModalContent" className={customClassName}>
        <div>Content</div>
      </ModalContent>,
    );

    // Assuming the ModalContent component's root element can be directly accessed. Adjust the query if the component has a more complex structure.
    const modalContentDiv = screen.getByTestId('testModalContent');
    expect(modalContentDiv).toHaveClass(customClassName);
  });
});
