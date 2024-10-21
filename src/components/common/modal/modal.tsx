'use client';

import React, {useEffect, useRef} from 'react';

import MemoClear from '@/src/icons/clear';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {LockBody} from '@/src/utils/LockBodyOverflow';

export default function Modal({
  open,
  setOpen,
  children,
  id,
  className,
  wrapperClassName,
  noCloseBtn,
  closeOnOutsideClick,
  closeOnClickFn,
  wrapperTestId,
  ...props
}: React.DetailsHTMLAttributes<HTMLDivElement> & {
  open: boolean;
  setOpen:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((open: boolean) => void);
  children: React.ReactNode;
  id?: string;
  className?: string;
  wrapperClassName?: string;
  wrapperTestId?: string;
  noCloseBtn?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnClickFn?: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [openState, setOpenState] = React.useState(open);

  useDidUpdateEffect(() => {
    if (!openState && open) setTimeout(() => setOpen(false), 350);
  }, [openState]);

  useDidUpdateEffect(() => {
    console.log('didUpdateEffect open', open);
    if (open) setOpenState(true);
    else setOpenState(false);
  }, [open]);

  useEffect(() => {
    if (closeOnOutsideClick) {
      const modalEl = modalRef.current;
      const searchDropdownContainer = document.querySelector(
        '.searchDropdownContainer',
      );
      const modalContent = modalContentRef.current;
      const modalWrapper = modalContent?.querySelector('.modalWrapper');
      const closeModal = (e: Event) => {
        console.log(
          modalWrapper,
          searchDropdownContainer,
          (e.target as HTMLElement).closest('.inputContainer'),
          'modalWrapper, searchDropdownContainer, inputContainer',
        );
        if (
          modalWrapper &&
          !modalWrapper.classList.contains('visible') &&
          searchDropdownContainer &&
          !searchDropdownContainer.classList.contains('visible') &&
          !(e.target as HTMLElement).closest('.inputContainer')
        ) {
          console.log('click outside');
          if (typeof closeOnClickFn !== 'undefined') closeOnClickFn();
          setOpenState(false);
        }
        if (modalWrapper && !modalWrapper.contains(e.target as Node)) {
          console.log('click outside 2');
          if (typeof closeOnClickFn !== 'undefined') closeOnClickFn();
          else setOpenState(false);
        }
      };

      modalEl?.addEventListener('click', closeModal);
      modalEl?.addEventListener('touchstart', closeModal);
      return () => {
        modalEl?.removeEventListener('click', closeModal);
        modalEl?.removeEventListener('touchstart', closeModal);
      };
    }
    return () => {};
  }, [closeOnOutsideClick, closeOnClickFn]);

  useEffect(() => {
    const modalEl = modalRef.current;
    const modalContent = modalContentRef.current;
    if (openState) {
      if (
        !modalEl?.parentElement?.closest('.modal.openModal') &&
        !modalEl?.parentElement?.closest('.sidebar.open')
      )
        LockBody(true);
      modalEl?.classList.add('openModal');
      setTimeout(() => {
        modalContent?.classList.add('open');
        modalContent?.classList.add('bottom');
      }, 11);

      setTimeout(() => {
        const firstInput:
          | HTMLInputElement
          | HTMLTextAreaElement
          | HTMLSelectElement
          | undefined
          | null = modalContent?.querySelector('input, select, textarea');
        if (firstInput && 'focus' in firstInput) firstInput.focus();
        modalContent?.classList.remove('bottom');
      }, 251);
    } else {
      if (
        !modalEl?.parentElement?.closest('.modal.openModal') &&
        !modalEl?.parentElement?.closest('.sidebar.open')
      )
        LockBody(false);
      modalContent?.classList.add('bottom');
      setTimeout(() => {
        modalContent?.classList.remove('open');
      }, 11);
      setTimeout(() => {
        modalEl?.classList.remove('openModal');
      }, 251);
    }
  }, [openState]);

  const classes = React.useMemo(() => {
    const classesTemp = {
      classes: ['modal'],
    };
    if (openState) classesTemp.classes.push('openModal');
    if (className) classesTemp.classes.push(className);
    return classesTemp.classes.join(' ');
  }, [className]);

  return (
    <div
      {...props}
      data-testid={wrapperTestId || 'modalContainer'}
      id={id || undefined}
      className={classes}
      ref={modalRef}
    >
      <div
        data-testid="modalContent"
        className="modalContent"
        ref={modalContentRef}
      >
        <div
          data-testid="modalWrapper"
          className={`modalWrapper ${wrapperClassName}`}
        >
          {!noCloseBtn && (
            <button
              aria-label='Close modal by pressing "Escape" key or clicking outside of modal.'
              className="closeButton"
              onClick={() => {
                if (typeof closeOnClickFn !== 'undefined') {
                  setOpenState(false);
                  closeOnClickFn();
                } else setOpenState(false);
              }}
              type="button"
            >
              <MemoClear />
            </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
