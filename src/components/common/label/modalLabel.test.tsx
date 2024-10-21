import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import ModalLabel from './modalLabel';

describe('ModalLabel component', () => {
  it('renders children correctly', () => {
    render(
      <ModalLabel data-testid="test-modal-label">Test Modal Label</ModalLabel>,
    );

    expect(screen.getByTestId('test-modal-label')).toHaveTextContent(
      'Test Modal Label',
    );
  });

  it('applies custom className along with default', () => {
    render(
      <ModalLabel className="custom-class" data-testid="test-modal-label">
        Test Modal Label
      </ModalLabel>,
    );

    expect(screen.getByTestId('test-modal-label')).toHaveClass('label');
    expect(screen.getByTestId('test-modal-label')).toHaveClass('modalLabel');
    expect(screen.getByTestId('test-modal-label')).toHaveClass('custom-class');
  });

  it('applies style correctly', () => {
    render(
      <ModalLabel data-testid="test-modal-label">Test Modal Label</ModalLabel>,
    );

    const parentDiv = screen.getByTestId('labelContainer');
    expect(parentDiv).toHaveStyle({marginBottom: '10px', lineHeight: '11px'});
  });

  it('passes other label attributes correctly', () => {
    render(
      <ModalLabel htmlFor="test-input" data-testid="test-modal-label">
        Test Modal Label
      </ModalLabel>,
    );

    expect(screen.getByTestId('test-modal-label')).toHaveAttribute(
      'for',
      'test-input',
    );
  });
});
