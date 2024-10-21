import {renderWithProviders} from '@/src/utils/testUtils';
import {act, fireEvent, screen} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import Modal from './modal'; // Adjust your import path accordingly

describe('Modal Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // mock window.scrollTo to prevent errors
    window.scrollTo = vi.fn() as any;
    document.body.innerHTML = `
    <!-- Simulating elements that closeModal checks for -->
    <div data-testid="searchDropdownContainer" class="searchDropdownContainer"></div>
    <div class="inputContainer"></div>
  `;
  });

  it('renders and toggles based on open prop', async () => {
    const {rerender} = renderWithProviders(
      <Modal wrapperTestId="testModal" open={false} setOpen={() => {}}>
        <div>Modal Content</div>
      </Modal>,
    );

    // Initially, the modal should not have the 'openModal' class
    expect(screen.getByTestId('testModal')).not.toHaveClass('openModal');

    // Rerender with open={true}
    rerender(
      <Modal open setOpen={() => {}}>
        <div>Modal Content</div>
      </Modal>,
    );

    // Advance timers to simulate the modal opening
    vi.runAllTimers();
    vi.waitFor(() => {
      expect(screen.getByTestId('testModal')).toHaveClass('openModal');
    }).then(() => {});
  });

  it('closes when the close button is clicked', () => {
    renderWithProviders(
      <Modal
        wrapperTestId="testModal"
        open
        setOpen={() => {}}
        noCloseBtn={false}
      >
        <div>Modal Content</div>
      </Modal>,
    );

    // Click the close button
    fireEvent.click(screen.getByRole('button', {name: /close modal/i}));
    vi.runAllTimers();

    // The modal should now be closed
    expect(screen.getByTestId('testModal')).not.toHaveClass('openModal');
  });

  it('closes on outside click if closeOnOutsideClick is true', async () => {
    // spy on eventListener
    const closeModalMock = vi.fn();
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {
      closeModalMock();
    });

    renderWithProviders(
      <Modal wrapperTestId="testId" open setOpen={() => {}} closeOnOutsideClick>
        <div>Modal Content</div>
      </Modal>,
    );

    // Simulate an outside click
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('testId'));
    });
    vi.runAllTimers();

    await vi.waitFor(() => {
      expect(closeModalMock).toHaveBeenCalled();
    });
  });

  it('calls closeOnClickFn if defined', () => {
    const closeOnClickFn = vi.fn();
    renderWithProviders(
      <Modal open setOpen={() => {}} closeOnClickFn={closeOnClickFn}>
        <div>Modal Content</div>
      </Modal>,
    );

    // Click the close button
    fireEvent.click(screen.getByRole('button', {name: /close modal/i}));
    vi.runAllTimers();

    // The closeOnClickFn should have been called
    expect(closeOnClickFn).toHaveBeenCalled();
  });

  it('closes the modal when an outside element is clicked and closeOnOutsideClick is true', async () => {
    // Function to track the open state of the modal
    const setOpenMock = vi.fn();
    const closeModalMock = vi.fn();
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {
      closeModalMock();
    });

    // Render an element outside the modal to simulate an outside click
    renderWithProviders(
      <>
        <div data-testid="outside-element">Outside Element</div>
        <Modal open setOpen={setOpenMock} closeOnOutsideClick>
          <div data-testid="modal-content">Modal Content</div>
        </Modal>
      </>,
    );

    // Simulate clicking on an element outside the modal
    fireEvent.mouseDown(screen.getByTestId('outside-element'));
    vi.runAllTimers();

    // Expect the setOpen function to have been called with false, indicating the modal should close
    await vi.waitFor(() => {
      expect(closeModalMock).toHaveBeenCalled();
    });
  });

  it('does not close the modal when clicking inside the modal content', async () => {
    // Function to track the open state of the modal
    const setOpenMock = vi.fn();

    renderWithProviders(
      <Modal open setOpen={setOpenMock} closeOnOutsideClick>
        <div data-testid="modal-content">Modal Content</div>
      </Modal>,
    );

    // Simulate clicking inside the modal
    fireEvent.mouseDown(screen.getByTestId('modal-content'));
    vi.runAllTimers();

    // Expect the setOpen function not to have been called, as the click is inside the modal
    await vi.waitFor(() => {
      expect(setOpenMock).not.toHaveBeenCalled();
    }, 1000);
  });

  it('closes when clicked outside the modal content and no preventing conditions are met', async () => {
    const closeOnClickFn = vi.fn();
    vi.spyOn(window, 'addEventListener').mockImplementation(() => {
      closeOnClickFn();
    });
    renderWithProviders(
      <Modal
        open
        setOpen={() => {}}
        closeOnOutsideClick
        className="modal"
        wrapperTestId="modal"
        closeOnClickFn={closeOnClickFn}
      >
        <div className="modalContent">Modal Content</div>
      </Modal>,
    );

    // Ensure '.searchDropdownContainer' and '.inputContainer' do not prevent closing
    screen.getByTestId('searchDropdownContainer')!.classList.add('visible');
    // Simulate a click outside the modal content but within the modal container
    await act(async () => {
      fireEvent.mouseDown(screen.getByTestId('modal'));
    });
    vi.runAllTimers();

    // The modal should close, calling `closeOnClickFn`
    await vi.waitFor(() => {
      expect(closeOnClickFn).toHaveBeenCalled();
    }, 1000);
  });

  it('does not close when clicked on an element with `.inputContainer`', () => {
    const closeOnClickFn = vi.fn();
    renderWithProviders(
      <div>
        <Modal open setOpen={() => {}} closeOnOutsideClick>
          <div className="modalContent">Modal Content</div>
        </Modal>
        <div className="inputContainer">Outside Input Container</div>
      </div>,
    );

    // Simulate a click on the `.inputContainer`, which should prevent the modal from closing
    fireEvent.mouseDown(screen.getByText('Outside Input Container'));
    vi.runAllTimers();

    // `closeOnClickFn` should not be called since the click is on an element that prevents the modal from closing
    expect(closeOnClickFn).not.toHaveBeenCalled();
  });
});
