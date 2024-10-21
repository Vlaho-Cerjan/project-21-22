import {renderWithProviders} from '@/src/utils/testUtils';
import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import ModalFooter, {ModalFooterContainer} from './modalFooter';

describe('ModalFooterContainer component', () => {
  it('renders its children correctly', () => {
    const childText = 'I am a child';
    render(
      <ModalFooterContainer>
        <div>{childText}</div>
      </ModalFooterContainer>,
    );

    expect(screen.getByText(childText)).toBeInTheDocument();
  });

  it('applies default and custom class names correctly', () => {
    const customClassName = 'my-custom-class';
    render(
      <ModalFooterContainer
        data-testid="modalFooterContainer"
        className={customClassName}
      >
        <div>Child Content</div>
      </ModalFooterContainer>,
    );

    const containerDiv = screen.getByTestId('modalFooterContainer');
    expect(containerDiv).toHaveClass('modalFooter');
    expect(containerDiv).toHaveClass(customClassName);
  });
});

describe('ModalFooter component', () => {
  const setOpenMock = vi.fn();
  const onSubmitMock = vi.fn();

  it('renders back and submit buttons correctly', () => {
    renderWithProviders(
      <ModalFooter
        data-testid="modalFooter"
        setOpen={setOpenMock}
        modalClass="modal-class"
        className="custom-class"
        buttonText="Submit"
        onSubmit={onSubmitMock}
      />,
    );

    expect(screen.getByTestId('backButton')).toBeInTheDocument();
    expect(screen.getByTestId('submitButton')).toBeInTheDocument();
    expect(screen.getByTestId('modalFooter')).toHaveClass('custom-class');
  });

  it('does not render back button when noBackButton is true', () => {
    renderWithProviders(
      <ModalFooter
        setOpen={setOpenMock}
        noBackButton
        modalClass="modal-class"
        buttonText="Submit"
        onSubmit={onSubmitMock}
      />,
    );

    expect(screen.queryByTestId('backButton')).not.toBeInTheDocument();
    expect(screen.getByTestId('submitButton')).toBeInTheDocument();
  });

  it('closes modal on back button click', () => {
    renderWithProviders(
      <ModalFooter
        setOpen={setOpenMock}
        modalClass="modal-class"
        buttonText="Submit"
        onSubmit={onSubmitMock}
      />,
    );

    fireEvent.click(screen.getByTestId('backButton'));
    expect(setOpenMock).toHaveBeenCalledWith(false);
  });

  it('calls onSubmit when submit button is clicked', () => {
    renderWithProviders(
      <ModalFooter
        setOpen={setOpenMock}
        modalClass="modal-class"
        buttonText="Submit"
        onSubmit={onSubmitMock}
      />,
    );

    fireEvent.click(screen.getByTestId('submitButton'));
    expect(onSubmitMock).toHaveBeenCalled();
  });
});
