import type {RegistrationData} from '@/types/registrations';
import {trim} from 'lodash';

export default function InputValidationAll(
  inputs: NodeListOf<any> | any[],
  errorEl?: NodeListOf<any> | any[],
  withoutError?: boolean,
  businessData?: RegistrationData,
) {
  const errorFunction = (
    input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    errorElement?: HTMLDivElement | null,
  ) => {
    if (typeof withoutError !== 'undefined' && withoutError) return;
    if (!input.classList.contains('error')) input.classList.add('error');
    if (errorElement && !errorElement.classList.contains('active')) {
      errorElement.classList.add('active');
      const errorText = errorElement.querySelector('.error');
      if (errorText) errorElement.style.height = `${errorText.clientHeight}px`;
    }
  };

  const isValid = {
    status: true,
  };

  inputs.forEach((input) => {
    // find error element by input name
    const error: {
      el: HTMLDivElement | null;
    } = {
      el: null,
    };

    if (errorEl) {
      errorEl.forEach((el) => {
        if (el.classList.contains(input.name)) {
          error.el = el;
        }
      });
    }

    if (
      input.value === '' ||
      trim(input.value) === '' ||
      input.value === '0' ||
      input.value === '0.00' ||
      input.value === '0,00'
    ) {
      isValid.status = false;
      if (error.el) errorFunction(input, error.el);
      return false;
    }
    if (input.type === 'url' || input.name === 'website') {
      const regexCheck = input.value.match(
        /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi,
      );
      if (regexCheck === null) {
        isValid.status = false;
        if (error.el) errorFunction(input, error.el);
        return false;
      }
    }
    if (input.type === 'tel') {
      const regexCheck = input.value.match(
        /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
      );
      if (regexCheck === null) {
        isValid.status = false;
        if (error.el) errorFunction(input, error.el);
        return false;
      }
    }
    if (input.type === 'email') {
      const regexCheck = input.value.match(
        /^[-!#$%&'*+/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z{|}~])*@[a-zA-Z](-?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/g,
      );
      if (regexCheck === null) {
        isValid.status = false;
        if (error.el) errorFunction(input, error.el);
        return false;
      }
    }
    if (
      input.type === 'password' ||
      input.name.toLowerCase().includes('password')
    ) {
      if ((input.name as string).toLowerCase().includes('confirmpassword')) {
        const passwordInput =
          document.querySelector<HTMLInputElement>('#newPassword');
        if (passwordInput && input.value !== passwordInput.value) {
          isValid.status = false;
          if (error.el) errorFunction(input, error.el);
          return false;
        }
      }

      if ((input.name as string).toLowerCase().includes('newpassword')) {
        // minimum 8 characters with a mix of letters, numbers, and symbols.
        const regexCheck = input.value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/g,
        );
        if (regexCheck === null) {
          isValid.status = false;
          if (error.el) errorFunction(input, error.el);
          return false;
        }
      }
    }
    if (input.name === 'fullName') {
      const regexCheck = input.value.match(
        /^(?=.*[A-Za-z])[A-Za-z.'-]+\s[A-Za-z.'-]+(?:\s[A-Za-z.'-]+)*$/g,
      );
      if (regexCheck === null) {
        isValid.status = false;
        if (error.el) errorFunction(input, error.el);
        return false;
      }
    }

    if (input.name === 'businessLocation') {
      if (
        typeof businessData === 'undefined' ||
        businessData?.address_1 === '' ||
        businessData?.city === '' ||
        businessData?.state_code === '' ||
        businessData?.zip === '' ||
        businessData?.country_code === '' ||
        businessData?.latitude === null ||
        businessData?.longitude === null
      ) {
        isValid.status = false;
        if (error.el) errorFunction(input, error.el);
        return false;
      }
    }
    input.classList.remove('error');
    if (error.el) {
      error.el.classList.remove('active');
      error.el.removeAttribute('style');
    }
    return true;
  });

  const input: {
    el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
  } = {
    el: null,
  };

  // find first input with error and return it and stop search
  inputs.forEach((el) => {
    if (el.classList.contains('error')) {
      input.el = el;
      return false;
    }
    return true;
  });

  return isValid.status;
}
