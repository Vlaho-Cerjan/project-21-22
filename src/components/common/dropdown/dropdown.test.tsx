import '@testing-library/jest-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import {expect, it, vi} from 'vitest';
import Dropdown from './dropdown';

describe('Dropdown Component', () => {
  beforeEach(() => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.resetModules();
  });

  it('should render the dropdown', () => {
    render(
      <Dropdown
        openDropdown
        setOpenDropdown={vi.fn()}
        id="test-dropdown"
        activatorId="test-activator"
      />,
    );
    const dropdownTest1 = screen.getByTestId('test-dropdown');
    expect(dropdownTest1).toBeInTheDocument();
  });

  it('should apply classnames correctly', () => {
    render(
      <Dropdown
        openDropdown
        setOpenDropdown={vi.fn()}
        id="test-dropdown"
        activatorId="test-activator"
        className="additional-class"
      />,
    );
    const dropdownTest2 = screen.getByTestId('test-dropdown');
    expect(dropdownTest2).toHaveClass('dropdown');
    expect(dropdownTest2).toHaveClass('open');
    expect(dropdownTest2).toHaveClass('ready');
    expect(dropdownTest2).toHaveClass('additional-class');
  });

  it('should set styles for bottom left position by default', () => {
    const mockButtonRect = {bottom: 50, left: 50, width: 100} as DOMRect;
    const mockDropdownRect = {width: 100, height: 100} as DOMRect;

    const dropdownButton = document.createElement('div');
    dropdownButton.getBoundingClientRect = vi.fn(() => mockButtonRect);

    const dropdownTest3 = document.createElement('div');
    dropdownTest3.getBoundingClientRect = vi.fn(() => mockDropdownRect);
    dropdownTest3.setAttribute = vi.fn((attr, value) => {
      if (attr === 'style') {
        dropdownTest3.style.cssText = value;
      }
    });
    dropdownTest3.getAttribute = vi.fn(() => 'test-activator');
    dropdownTest3.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      return null;
    });

    document.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      if (selector === '#test-dropdown') return dropdownTest3;
      return null;
    });

    render(
      <div>
        <button type="button" id="test-activator">
          Test
        </button>
        <Dropdown
          openDropdown
          setOpenDropdown={vi.fn()}
          id="test-dropdown"
          activatorId="test-activator"
        />
      </div>,
    );

    expect(document.querySelector).toHaveBeenCalledWith('#test-activator');
    expect(document.querySelector).toHaveBeenCalledWith('#test-dropdown');

    expect(dropdownTest3).toHaveStyle('top: 66px');
    expect(dropdownTest3).toHaveStyle('left: 50px');
  });

  it('should handle resize event', () => {
    const setOpenDropdown = vi.fn();
    const mockButtonRect = {bottom: 0, left: 0, width: 100} as DOMRect;
    const mockDropdownRect = {width: 100, height: 100} as DOMRect;

    const dropdownButton = document.createElement('div');
    dropdownButton.getBoundingClientRect = vi.fn(() => mockButtonRect);

    const dropdownTest4 = document.createElement('div');
    dropdownTest4.getBoundingClientRect = vi.fn(() => mockDropdownRect);
    dropdownTest4.setAttribute = vi.fn((attr, value) => {
      if (attr === 'style') {
        dropdownTest4.style.cssText = value;
      }
    });
    dropdownTest4.getAttribute = vi.fn(() => 'test-activator');
    dropdownTest4.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      return null;
    });

    document.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      if (selector === '#test-dropdown') return dropdownTest4;
      return null;
    });

    // Mock window.innerWidth and dispatch resize event
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });
    window.dispatchEvent(new Event('resize'));

    render(
      <div>
        <button type="button" id="test-activator">
          Test
        </button>
        <Dropdown
          openDropdown
          setOpenDropdown={setOpenDropdown}
          id="test-dropdown"
          activatorId="test-activator"
        />
      </div>,
    );

    expect(dropdownTest4).toHaveStyle('top: 8px'); // smaller screen adjustments
  });

  it('should close dropdown on clicking outside', () => {
    const setOpenDropdown = vi.fn();

    const dropdownButton = document.createElement('div');

    const dropdownTest5 = document.createElement('div');
    dropdownTest5.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      return null;
    });

    document.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      if (selector === '#test-dropdown') return dropdownTest5;
      return null;
    });

    render(
      <Dropdown
        openDropdown
        setOpenDropdown={setOpenDropdown}
        id="test-dropdown"
        activatorId="test-activator"
      />,
    );

    fireEvent.click(document);
    expect(setOpenDropdown).toHaveBeenCalledWith(false);
  });

  it('should not close dropdown if clicking inside', () => {
    const setOpenDropdown = vi.fn();
    render(
      <Dropdown
        openDropdown
        setOpenDropdown={setOpenDropdown}
        id="test-dropdown"
        activatorId="test-activator"
      />,
    );

    const dropdownTest6 = screen.getByTestId('test-dropdown');
    fireEvent.click(dropdownTest6);
    expect(setOpenDropdown).not.toHaveBeenCalled();
  });

  it('should handle different dropdown positions', () => {
    const positions = ['bottom left', 'bottom right', 'top left', 'top right'];
    positions.forEach((position) => {
      render(
        <Dropdown
          openDropdown
          setOpenDropdown={vi.fn()}
          id={`test-dropdown_${position.replace(' ', '_')}`}
          activatorId="test-activator"
          dropdownPosition={position as any}
        />,
      );

      const dropdownTest7 = screen.getByTestId(
        `test-dropdown_${position.replace(' ', '_')}`,
      );
      expect(dropdownTest7).toHaveClass(position);
    });
  });

  it('should set styles for bottom right position', () => {
    const mockButtonRect = {bottom: 50, right: 50, width: 100} as DOMRect;
    const mockDropdownRect = {width: 100, height: 100} as DOMRect;

    const dropdownButton = document.createElement('div');
    dropdownButton.getBoundingClientRect = vi.fn(() => mockButtonRect);

    const dropdownTest8 = document.createElement('div');
    dropdownTest8.getBoundingClientRect = vi.fn(() => mockDropdownRect);
    dropdownTest8.setAttribute = vi.fn((attr, value) => {
      if (attr === 'style') {
        dropdownTest8.style.cssText = value;
      }
    });
    dropdownTest8.getAttribute = vi.fn(() => 'test-activator');
    dropdownTest8.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      return null;
    });

    document.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      if (selector === '#test-dropdown') return dropdownTest8;
      return null;
    });

    render(
      <Dropdown
        openDropdown
        setOpenDropdown={vi.fn()}
        id="test-dropdown"
        activatorId="test-activator"
        dropdownPosition="bottom right"
      />,
    );

    expect(document.querySelector).toHaveBeenCalledWith('#test-activator');
    expect(dropdownTest8).toHaveStyle('top: 66px');
    expect(dropdownTest8).toHaveStyle('left: -50px');
  });

  it('should set styles for top left position', () => {
    const mockButtonRect = {top: 50, left: 50, width: 100} as DOMRect;
    const mockDropdownRect = {width: 100, height: 100} as DOMRect;

    const dropdownButton = document.createElement('div');
    dropdownButton.getBoundingClientRect = vi.fn(() => mockButtonRect);

    const dropdownTest9 = document.createElement('div');
    dropdownTest9.getBoundingClientRect = vi.fn(() => mockDropdownRect);
    dropdownTest9.setAttribute = vi.fn((attr, value) => {
      if (attr === 'style') {
        dropdownTest9.style.cssText = value;
      }
    });
    dropdownTest9.getAttribute = vi.fn(() => 'test-activator');
    dropdownTest9.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      return null;
    });

    document.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      if (selector === '#test-dropdown') return dropdownTest9;
      return null;
    });

    render(
      <Dropdown
        openDropdown
        setOpenDropdown={vi.fn()}
        id="test-dropdown"
        activatorId="test-activator"
        dropdownPosition="top left"
      />,
    );

    expect(document.querySelector).toHaveBeenCalledWith('#test-activator');
    expect(dropdownTest9).toHaveStyle('top: -58px');
    expect(dropdownTest9).toHaveStyle('left: 50px');
  });

  it('should set styles for top right position', () => {
    const mockButtonRect = {top: 50, right: 50, width: 100} as DOMRect;
    const mockDropdownRect = {width: 100, height: 100} as DOMRect;

    const dropdownButton = document.createElement('div');
    dropdownButton.getBoundingClientRect = vi.fn(() => mockButtonRect);

    const dropdownTest10 = document.createElement('div');
    dropdownTest10.getBoundingClientRect = vi.fn(() => mockDropdownRect);
    dropdownTest10.setAttribute = vi.fn((attr, value) => {
      if (attr === 'style') {
        dropdownTest10.style.cssText = value;
      }
    });
    dropdownTest10.getAttribute = vi.fn(() => 'test-activator');
    dropdownTest10.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      return null;
    });

    document.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      if (selector === '#test-dropdown') return dropdownTest10;
      return null;
    });

    render(
      <Dropdown
        openDropdown
        setOpenDropdown={vi.fn()}
        id="test-dropdown"
        activatorId="test-activator"
        dropdownPosition="top right"
      />,
    );

    expect(document.querySelector).toHaveBeenCalledWith('#test-activator');
    expect(dropdownTest10).toHaveStyle('top: -58px');
    expect(dropdownTest10).toHaveStyle('left: -50px');
  });

  it('should handle different dropdown offsets', () => {
    const mockButtonRect = {top: 50, right: 50, width: 100} as DOMRect;
    const mockDropdownRect = {width: 100, height: 100} as DOMRect;

    const dropdownButton = document.createElement('div');
    dropdownButton.getBoundingClientRect = vi.fn(() => mockButtonRect);

    const dropdownTest11 = document.createElement('div');
    dropdownTest11.getBoundingClientRect = vi.fn(() => mockDropdownRect);
    dropdownTest11.setAttribute = vi.fn((attr, value) => {
      if (attr === 'style') {
        dropdownTest11.style.cssText = value;
      }
    });
    dropdownTest11.getAttribute = vi.fn(() => 'test-activator');
    dropdownTest11.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      return null;
    });

    document.querySelector = vi.fn((selector) => {
      if (selector === '#test-activator') return dropdownButton;
      if (selector === '#test-dropdown') return dropdownTest11;
      return null;
    });

    render(
      <Dropdown
        openDropdown
        setOpenDropdown={vi.fn()}
        id="test-dropdown"
        activatorId="test-activator"
        dropdownOffset={{top: 10, left: 15}}
      />,
    );

    expect(dropdownTest11).toHaveStyle('top: 16px');
    expect(dropdownTest11).toHaveStyle('left: -15px');
  });

  it('should add and remove event listeners correctly', () => {
    const setOpenDropdown = vi.fn();
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const {unmount} = render(
      <Dropdown
        openDropdown
        setOpenDropdown={setOpenDropdown}
        id="test-dropdown"
        activatorId="test-activator"
      />,
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function),
    );
  });
});
