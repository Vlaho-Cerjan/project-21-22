import React from 'react';

import MemoClear from '@/src/icons/clear';
import {LockBody} from '@/src/utils/LockBodyOverflow';

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  closeSidebarFunction,
  sidebarClasses,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  closeSidebarFunction?: () => void;
  sidebarClasses?: string;
}) {
  const sidebarEl = React.useRef<HTMLDivElement>(null);
  const sidebarContainerEl = React.useRef<HTMLDivElement>(null);

  const [containerOpen, setContainerOpen] = React.useState<null | boolean>(
    null,
  );

  React.useEffect(() => {
    const handleOpen = () => {
      const openTimeout = {
        timeout: null as NodeJS.Timeout | null,
      };
      if (!sidebarOpen) {
        openTimeout.timeout = setTimeout(() => {
          setContainerOpen(false);
        }, 300);
      } else {
        if (openTimeout.timeout) clearTimeout(openTimeout.timeout);
        setContainerOpen(true);
      }
    };

    if (sidebarOpen) {
      if (
        sidebarContainerEl &&
        sidebarContainerEl.current &&
        sidebarEl &&
        sidebarEl.current &&
        !sidebarEl.current?.parentElement?.closest('.modal.openModal') &&
        !sidebarEl.current?.parentElement?.closest('.sidebar.open')
      )
        LockBody(true);
    } else if (!sidebarOpen) {
      if (
        sidebarEl &&
        sidebarEl.current &&
        !sidebarEl.current?.parentElement?.closest('.modal.openModal') &&
        !sidebarEl.current?.parentElement?.closest('.sidebar.open')
      )
        LockBody(false);
    }
    handleOpen();
  }, [sidebarOpen]);

  const classNames = React.useMemo(() => {
    const classes = ['sidebarContainer'];
    if (props.className) {
      classes.push(props.className);
    }
    return classes.join(' ');
  }, [props.className]);

  return (
    <div
      ref={sidebarContainerEl}
      {...props}
      className={`${classNames}${containerOpen ? ' open' : ''}`}
    >
      <div
        ref={sidebarEl}
        className={`sidebar${sidebarOpen ? ` open` : ''}${
          sidebarClasses ? ` ${sidebarClasses}` : ''
        }`}
      >
        <div className="closeContainer">
          <button
            aria-label='Close sidebar by pressing "Escape" key or clicking outside of sidebar.'
            type="button"
            onClick={() => {
              if (typeof closeSidebarFunction !== 'undefined')
                closeSidebarFunction();

              setSidebarOpen(false);
            }}
          >
            <MemoClear />
          </button>
        </div>
        {props.children}
      </div>
      <div className={`sidebarBackdrop${sidebarOpen ? ` open` : ''}`} />
    </div>
  );
}
