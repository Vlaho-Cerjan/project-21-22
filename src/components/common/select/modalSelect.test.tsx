import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';
import ModalSelect from './modalSelect';

describe('ModalSelect component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const options = [
    {id: '1', name: 'Option 1', disabled: false},
    {id: '2', name: 'Option 2', disabled: false},
    {id: '3', name: 'Option 3', disabled: true},
  ];

  it('displays the selected option text', async () => {
    render(<ModalSelect options={options} value="2" name="selectTest" />);

    await vi.waitFor(() => {
      const selectedText = screen.getByTestId('modalSelectText');
      expect(selectedText).toHaveTextContent('Option 2');
    });
  });

  it('renders options correctly when dropdown is triggered', async () => {
    render(<ModalSelect options={options} name="selectTest" />);

    await vi.waitFor(() => {
      const dropdownTrigger = screen.getByTestId('dropdownButton_selectTest');
      fireEvent.click(dropdownTrigger);
      options.forEach((option) => {
        expect(
          screen.getByTestId(`modalSelectOption_${option.id}`),
        ).toBeInTheDocument();
      });
    });
  });

  it('calls onChange with correct value when option is clicked', async () => {
    const onChangeMock = vi.fn();
    render(
      <ModalSelect
        options={options}
        onChange={onChangeMock}
        name="selectTest"
      />,
    );

    await waitFor(() => {
      // Simulate dropdown trigger
      const dropdownTrigger = screen.getByTestId('dropdownButton_selectTest');
      fireEvent.click(dropdownTrigger);

      // Simulate clicking an option
      const optionToClick = screen.getByTestId('modalSelectOption_1');
      fireEvent.click(optionToClick);
      expect(onChangeMock).toHaveBeenCalledWith(
        expect.objectContaining({
          currentTarget: expect.objectContaining({
            value: '1',
          }),
        }),
      );
    });
  });
});
