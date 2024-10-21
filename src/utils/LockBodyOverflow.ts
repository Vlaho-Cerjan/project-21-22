/**
 * Locks or unlocks the body overflow.
 * @param lock A boolean indicating whether to lock or unlock the body overflow.
 */

'use client';

import IsItMobile from './IsItMobileDevice';

export const LockBody = (lock: boolean) => {
  const isBodyOverflowed =
    document.body.scrollHeight > window.innerHeight ? '15px' : 0;
  const paddingRight = IsItMobile() ? 'calc(100vw - 100%)' : isBodyOverflowed;

  if (lock) {
    document.body.setAttribute(
      'style',
      `position:fixed; top:-${window.scrollY}px; padding-right: ${paddingRight}; overflow-y: hidden; width: 100%; height: auto;`,
    );
  } else {
    const scrollY = document.body.style.top;
    document.body.removeAttribute('style');
    const scrollYValue = parseInt(scrollY || '0', 10) * -1;
    window.scrollTo(0, scrollYValue);
  }
};
