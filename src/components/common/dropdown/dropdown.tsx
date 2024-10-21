import React from 'react';

export default function Dropdown({
  openDropdown,
  setOpenDropdown,
  id,
  activatorId,
  dropdownOffset,
  dropdownPosition,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  openDropdown: boolean;
  setOpenDropdown: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  activatorId: string;
  dropdownPosition?: 'top left' | 'top right' | 'bottom left' | 'bottom right';
  dropdownOffset?: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
}) {
  const [ready, setReady] = React.useState(false);

  const resizeDropdown = ({blockOnReady}: {blockOnReady: boolean}) => {
    const dropdown = document.querySelector(`#${id}`);
    const dropdownButton = document.querySelector(
      `#${dropdown?.getAttribute('data-dropdown-for')}`,
    );
    const windowWidth = window.innerWidth;
    // console.log(windowWidth, 'windowWidth');
    if (dropdown?.classList.contains('ready') && blockOnReady) return;

    if (
      dropdownPosition === 'bottom left' ||
      typeof dropdownPosition === 'undefined'
    ) {
      const dropdownButtonRect = dropdownButton?.getBoundingClientRect();
      const left =
        (dropdownButtonRect?.left || 0) +
        (dropdownButtonRect?.width || 0) -
        (dropdownOffset?.left || 0) -
        (dropdown ? dropdown.getBoundingClientRect().width : 0);

      const bottom =
        (dropdownButtonRect?.bottom || 0) + (dropdownOffset?.bottom || 0);

      dropdown?.setAttribute(
        'style',
        `top: ${
          (bottom || 0) + 8 + (windowWidth > 991 ? 8 : 0)
        }px; left: ${left}px;`,
      );
    } else if (dropdownPosition === 'bottom right') {
      const dropdownButtonRect = dropdownButton?.getBoundingClientRect();
      const left =
        (dropdownButtonRect?.right || 0) -
        (dropdownButtonRect?.width || 0) +
        (dropdownOffset?.right || 0);

      const bottom =
        (dropdownButtonRect?.bottom || 0) + (dropdownOffset?.bottom || 0);

      dropdown?.setAttribute(
        'style',
        `top: ${
          (bottom || 0) + 8 + (windowWidth > 991 ? 8 : 0)
        }px; left: ${left}px;`,
      );
    } else if (dropdownPosition === 'top left') {
      const dropdownButtonRect = dropdownButton?.getBoundingClientRect();
      const left =
        (dropdownButtonRect?.left || 0) +
        (dropdownButtonRect?.width || 0) -
        (dropdownOffset?.left || 0) -
        (dropdown ? dropdown.getBoundingClientRect().width : 0);

      const top =
        (dropdownButtonRect?.top || 0) -
        (dropdown ? dropdown.getBoundingClientRect().height : 0) -
        (dropdownOffset?.top || 0);

      dropdown?.setAttribute(
        'style',
        `top: ${(top || 0) - 8}px; left: ${left}px;`,
      );
    } else if (dropdownPosition === 'top right') {
      const dropdownButtonRect = dropdownButton?.getBoundingClientRect();
      const left =
        (dropdownButtonRect?.right || 0) -
        (dropdownButtonRect?.width || 0) +
        (dropdownOffset?.right || 0);

      const top =
        (dropdownButtonRect?.top || 0) -
        (dropdown ? dropdown.getBoundingClientRect().height : 0) -
        (dropdownOffset?.top || 0);

      dropdown?.setAttribute(
        'style',
        `top: ${(top || 0) - 8}px; left: ${left}px;`,
      );
    }
    // console.log((dropdown as HTMLElement)?.style.cssText);
    setReady(true);
  };

  React.useEffect(() => {
    resizeDropdown({
      blockOnReady: true,
    });

    const noResize = () => resizeDropdown({blockOnReady: false});

    window.addEventListener('resize', () => noResize);

    return () => {
      window.removeEventListener('resize', () => noResize);
    };
  }, []);

  const closeDropdown = (e: MouseEvent) => {
    const dropdown = document.querySelector(`#${id}`);

    if (openDropdown && dropdown && !dropdown.contains(e.target as Node)) {
      dropdown.classList.add('ready');
      setOpenDropdown(false);
    }
  };

  React.useEffect(() => {
    // close the dropdown when clicking outside of it
    document.addEventListener('click', closeDropdown);

    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [openDropdown]);

  const classNames = ['dropdown'];

  if (props.className) {
    classNames.push(props.className);
  }
  if (openDropdown) {
    classNames.push('open');
  }

  if (ready) {
    classNames.push('ready');
  }

  if (dropdownPosition) {
    classNames.push(dropdownPosition);
  }

  return (
    <div
      {...props}
      id={id}
      data-testid={id}
      data-dropdown-for={activatorId}
      className={classNames.join(' ')}
    >
      {props?.children}
    </div>
  );
}
