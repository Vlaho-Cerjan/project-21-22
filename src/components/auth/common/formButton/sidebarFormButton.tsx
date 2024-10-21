'use client';

import React, {useState} from 'react';

import MemoArrowCircleRight from '@/src/icons/arrow-circle-right';
import MemoCheckmark from '@/src/icons/checkmark';
import MemoClear from '@/src/icons/clear';
import MemoLoading from '@/src/icons/loading';
import InputValidationAll from '@/src/utils/InputValidationAll';

import {LoadingContext} from '@/src/store/providers/loadingProvider';
import Button from '../../../common/button/button';

export default function SidebarFormButton({
  className,
  text,
  isError,
  setIsError,
  setOpen,
  sidebarClass,
  loadingText,
  successText,
  errorText,
  onClick,
  icon,
  noIcon,
  buttonVariant,
}: {
  className?: string;
  text?: string;
  isError?: boolean;
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  sidebarClass?: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  onClick?: () => any;
  icon?: React.ReactNode;
  noIcon?: boolean;
  buttonVariant?: 'success' | 'error' | 'warning' | 'info';
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {setLoading} = React.useContext(LoadingContext);

  const handleClick = async () => {
    if (typeof setIsError !== 'undefined') setIsError(false);
    const sidebar = document.querySelector(`.${sidebarClass}`);
    if (!sidebar || !sidebarClass) {
      if (typeof onClick !== 'undefined') {
        setLoading(true);
        setIsLoading(true);
        const res = await onClick();
        if (res === 'error') {
          if (typeof setIsError !== 'undefined') {
            setLoading(false);
            setIsLoading(false);
            setIsError(true);
            setTimeout(() => {
              setIsError(false);
            }, 3000);
          }
          setLoading(false);
          setIsLoading(false);
          return;
        }

        setLoading(false);
        setIsLoading(false);
      }
      setIsSuccess(true);
      if (typeof setOpen !== 'undefined') setOpen(false);
      // Reset success state after a short delay (optional)
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
      return;
    }
    const inputs = sidebar.querySelectorAll(
      'input[required], select[required], textarea[required]',
    );
    const errorEls = sidebar.querySelectorAll('.errorContainer');

    const filteredInputs = Array.from(inputs).filter(
      (input) =>
        input.closest('.sidebar')?.classList.contains(sidebarClass) ?? false,
    );

    const filteredErrorEls = Array.from(errorEls).filter(
      (errorEl) =>
        errorEl.closest('.sidebar')?.classList.contains(sidebarClass) ?? false,
    );

    if (
      filteredInputs.length > 0 &&
      typeof setIsError !== 'undefined' &&
      !InputValidationAll(filteredInputs, filteredErrorEls)
    ) {
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
      return;
    }
    if (typeof onClick !== 'undefined') {
      setLoading(true);
      setIsLoading(true);
      const res = await onClick();
      if (res === 'error') {
        if (typeof setIsError !== 'undefined') {
          setIsError(true);
          setTimeout(() => {
            setIsError(false);
          }, 3000);
        }
        setLoading(false);
        setIsLoading(false);
        return;
      }

      setLoading(false);
      setIsLoading(false);
    }
    setIsSuccess(true);
    if (typeof setOpen !== 'undefined') setOpen(false);
    // Reset success state after a short delay (optional)
    setTimeout(() => {
      setIsSuccess(false);
    }, 2000);
  };

  const buttonText = () => {
    if (isLoading) {
      if (loadingText) {
        return loadingText;
      }
      return 'Loading...';
    }
    if (isSuccess) {
      if (successText) {
        return successText;
      }
      return 'Success!';
    }
    if (isError) {
      if (errorText) {
        return errorText;
      }
      return 'Error!';
    }
    if (text) {
      return text;
    }
    return 'Sign in';
  };

  const buttonClass = React.useMemo(() => {
    const classes = {
      className: '',
    };
    if (className) {
      classes.className = className;
    }
    if (isLoading) {
      classes.className += ' loading';
    }
    if (isSuccess || buttonVariant === 'success') {
      classes.className += ' success';
    }
    if (isError || buttonVariant === 'error') {
      classes.className += ' error';
    }
    if (buttonVariant === 'warning') {
      classes.className += ' warning';
    }
    if (buttonVariant === 'info') {
      classes.className += ' info';
    }
    return classes.className;
  }, [className, isLoading, isSuccess, isError, buttonVariant]);

  return (
    <Button
      data-testid="formButton"
      className={`formButton ${buttonClass}`}
      onClick={handleClick}
      disabled={isLoading}
    >
      {!noIcon && isLoading ? (
        <MemoLoading
          aria-label="Loading"
          data-testid="loadingIcon"
          className="loading"
        />
      ) : null}
      {!noIcon && isSuccess ? (
        <MemoCheckmark aria-label="Success" data-testid="successIcon" />
      ) : null}
      {!noIcon && isError ? (
        <MemoClear aria-label="Error" data-testid="errorIcon" />
      ) : null}
      {!noIcon && !isLoading && !isSuccess && !isError
        ? icon || (
            <MemoArrowCircleRight
              aria-label="Submit"
              data-testid="defaultIcon"
            />
          )
        : null}
      {buttonText()}
    </Button>
  );
}
