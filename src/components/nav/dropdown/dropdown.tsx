import React from 'react';

export default function NavDropdown({
  id,
  level,
  subnavOpen,
  children,
}: {
  id: string;
  level?: number;
  subnavOpen: boolean;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    // set max height if dropdown is open
    const dropdownContainer = document.querySelector(`#${id}`);
    const dropdownEl = dropdownContainer?.querySelector(
      `#${id} > .navDropdown`,
    );
    if (dropdownContainer && dropdownContainer instanceof HTMLDivElement) {
      if (subnavOpen) {
        dropdownContainer.style.maxHeight = `${dropdownContainer.scrollHeight}px`;
      } else {
        dropdownContainer.style.maxHeight = '0';
      }
    }

    // set aria-expanded attribute
    const dropdownButton = document.querySelector(
      `.dropdownButton[aria-controls="${id}"]`,
    );
    if (dropdownButton && dropdownButton instanceof HTMLButtonElement) {
      dropdownButton.setAttribute('aria-expanded', subnavOpen.toString());
    }

    // set aria-hidden attribute
    const dropdown = document.querySelector(`#${id}`);
    if (dropdown && dropdown instanceof HTMLDivElement) {
      dropdown.setAttribute('aria-hidden', (!subnavOpen).toString());
    }

    // set a event listener to check if dropdowns inside dropdown are open and set max-height by getting the height of ".navDropdown" and adding it to the height of the dropdown
    const clickListener = (e: Event) => {
      setTimeout(() => {
        // if current target has a parent with class 'dropdownItem' and the parent has a sibling with class 'dropdownContainer' then return
        if (
          !(e.target as HTMLElement)
            .closest('.dropdownItem')
            ?.nextElementSibling?.classList.contains('dropdownContainer')
        ) {
          return;
        }

        if (
          e.target instanceof Element &&
          (e.target.classList.contains('addNetworkButton') ||
            e.target.closest('.addNetworkButton') !== null)
        ) {
          return;
        }

        const dropdownContainerItem = (e.target as HTMLElement).closest(
          '.dropdownItem',
        )?.nextElementSibling;

        const navDropItem =
          dropdownContainerItem?.querySelector('.navDropdown');
        let height = 0;
        if (navDropItem?.classList.contains('open')) {
          height = navDropItem.scrollHeight;
        } else if (navDropItem?.parentElement?.clientHeight !== 0)
          height = -navDropItem!.scrollHeight;
        if (dropdownContainer instanceof HTMLDivElement)
          dropdownContainer!.style.maxHeight = `${
            dropdownContainer!.scrollHeight + height
          }px`;
      }, 1);
    };
    if (dropdownEl) {
      dropdownEl.addEventListener('click', clickListener);
    }

    return () => {
      if (dropdownEl) {
        dropdownEl.removeEventListener('click', clickListener);
      }
    };
  }, [subnavOpen]);

  return (
    <div
      id={id}
      className={`dropdownContainer${subnavOpen ? ' open' : ''}${
        level ? ` level${level}` : ''
      }`}
    >
      <div className={`navDropdown${subnavOpen ? ' open' : ''}`}>
        {children}
      </div>
    </div>
  );
}
