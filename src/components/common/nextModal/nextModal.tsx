'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect, useRef} from 'react';

import MemoClear from '@/src/icons/clear';
import {LockBody} from '@/src/utils/LockBodyOverflow';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';

export default function NextModal({
  open,
  setOpen,
  children,
  id,
  className,
  wrapperClassName,
  noCloseBtn,
  closeOnOutsideClick,
  closeOnClickFn,
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
  noCloseBtn?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnClickFn?: () => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [openState, setOpenState] = React.useState(open);
  const router = useRouter();

  useDidUpdateEffect(() => {
    if (!openState) setTimeout(() => setOpen(false), 300);
  }, [openState]);

  useDidUpdateEffect(() => {
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
        if (
          modalWrapper &&
          !modalWrapper.classList.contains('visible') &&
          searchDropdownContainer &&
          !searchDropdownContainer.classList.contains('visible') &&
          !(e.target as HTMLElement).closest('.inputContainer')
        ) {
          if (typeof closeOnClickFn !== 'undefined') closeOnClickFn();
          setOpenState(false);
        }
        if (modalWrapper && !modalWrapper.contains(e.target as Node)) {
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
        const firstInput = modalContent?.querySelector('input');
        if (firstInput) firstInput.focus();
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
    <div {...props} id={id || undefined} className={classes} ref={modalRef}>
      <div className="modalContent" ref={modalContentRef}>
        <div className={`modalWrapper ${wrapperClassName}`}>
          {!noCloseBtn && (
            <button
              aria-label='Close modal by pressing "Escape" key or clicking outside of modal.'
              className="closeButton"
              onClick={() => {
                if (typeof closeOnClickFn !== 'undefined') {
                  setOpenState(false);
                  closeOnClickFn();
                } else {
                  setOpenState(false);
                }
                setTimeout(() => {
                  router.back();
                }, 300);
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
