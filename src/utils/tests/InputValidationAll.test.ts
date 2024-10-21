import type {RegistrationData} from '@/types/registrations';
import {describe, expect, it} from 'vitest';
import InputValidationAll from '../InputValidationAll';

describe('InputValidationAll - Function that checks if all the required fields are correctly filled', () => {
  function createElementsAndErrors() {
    const fullName = document.createElement('input');
    fullName.type = 'text';
    fullName.required = true;
    fullName.name = 'fullName';
    fullName.value = 'John Doe';
    const fullNameError = document.createElement('div');
    fullNameError.classList.add('errorContainer');
    fullNameError.classList.add('fullName');
    const errorChild = document.createElement('div');
    errorChild.classList.add('error');
    errorChild.textContent = 'This field is required';
    fullNameError.appendChild(errorChild);

    const email = document.createElement('input');
    email.type = 'email';
    email.required = true;
    email.name = 'email';
    email.value = 'test@test.com';
    const emailError = document.createElement('div');
    emailError.classList.add('errorContainer');
    emailError.classList.add('email');
    const errorChild2 = document.createElement('div');
    errorChild2.classList.add('error');
    errorChild2.textContent = 'This field is required';
    emailError.appendChild(errorChild2);

    const newPassword = document.createElement('input');
    newPassword.type = 'password';
    newPassword.id = 'newPassword';
    newPassword.required = true;
    newPassword.name = 'newPassword';
    newPassword.value = 'Password123!';
    const newPasswordError = document.createElement('div');
    newPasswordError.classList.add('errorContainer');
    newPasswordError.classList.add('newPassword');
    const errorChild3 = document.createElement('div');
    errorChild3.classList.add('error');
    errorChild3.textContent = 'This field is required';
    newPasswordError.appendChild(errorChild3);

    const confirmPassword = document.createElement('input');
    confirmPassword.type = 'password';
    confirmPassword.id = 'confirmPassword';
    confirmPassword.required = true;
    confirmPassword.name = 'confirmPassword';
    confirmPassword.value = 'Password123!';
    const confirmPasswordError = document.createElement('div');
    confirmPasswordError.classList.add('errorContainer');
    confirmPasswordError.classList.add('confirmPassword');
    const errorChild4 = document.createElement('div');
    errorChild4.classList.add('error');
    errorChild4.textContent = 'This field is required';
    confirmPasswordError.appendChild(errorChild4);

    const url = document.createElement('input');
    url.type = 'url';
    url.required = true;
    url.name = 'url';
    url.value = 'https://www.test.com';
    const urlError = document.createElement('div');
    urlError.classList.add('errorContainer');
    urlError.classList.add('url');
    const errorChild5 = document.createElement('div');
    errorChild5.classList.add('error');
    errorChild5.textContent = 'This field is required';
    urlError.appendChild(errorChild5);

    const tel = document.createElement('input');
    tel.type = 'tel';
    tel.required = true;
    tel.name = 'tel';
    tel.value = '+385955608459';
    const telError = document.createElement('div');
    telError.classList.add('errorContainer');
    telError.classList.add('tel');
    const errorChild6 = document.createElement('div');
    errorChild6.classList.add('error');
    errorChild6.textContent = 'This field is required';
    telError.appendChild(errorChild6);

    const businessLocation = document.createElement('input');
    businessLocation.type = 'text';
    businessLocation.required = true;
    businessLocation.name = 'businessLocation';
    businessLocation.value = '12345 Test, Test, Test';
    const businessLocationError = document.createElement('div');
    businessLocationError.classList.add('errorContainer');
    businessLocationError.classList.add('businessLocation');
    const errorChild7 = document.createElement('div');
    errorChild7.classList.add('error');
    errorChild7.textContent = 'This field is required';
    businessLocationError.appendChild(errorChild7);

    document.body.appendChild(fullName);
    document.body.appendChild(fullNameError);
    document.body.appendChild(email);
    document.body.appendChild(emailError);
    document.body.appendChild(newPassword);
    document.body.appendChild(newPasswordError);
    document.body.appendChild(confirmPassword);
    document.body.appendChild(confirmPasswordError);
    document.body.appendChild(url);
    document.body.appendChild(urlError);
    document.body.appendChild(tel);
    document.body.appendChild(telError);
    document.body.appendChild(businessLocation);
    document.body.appendChild(businessLocationError);

    return {
      fullName,
      fullNameError,
      email,
      emailError,
      newPassword,
      newPasswordError,
      confirmPassword,
      confirmPasswordError,
      url,
      urlError,
      tel,
      telError,
      businessLocation,
      businessLocationError,
    };
  }

  it('should return true if all the required input fields are correctly filled (without error elements)', () => {
    const {fullName, email, newPassword} = createElementsAndErrors();

    expect(InputValidationAll([fullName, email, newPassword], [], true)).toBe(
      true,
    );
  });

  it('should return false if one of the required input fields is not correctly filled (without error)', () => {
    const {
      fullName,
      email,
      newPassword,
      fullNameError,
      emailError,
      newPasswordError,
    } = createElementsAndErrors();

    email.value = '';

    expect(
      InputValidationAll(
        [fullName, email, newPassword],
        [fullNameError, emailError, newPasswordError],
        true,
      ),
    ).toBe(false);

    expect(email).not.toHaveClass('error');
    expect(emailError).not.toHaveClass('active');
  });

  it('should return false if one of the required input fields is not filled and have an error displayed', () => {
    const {
      fullName,
      email,
      newPassword,
      fullNameError,
      emailError,
      newPasswordError,
    } = createElementsAndErrors();

    email.value = '';

    expect(
      InputValidationAll(
        [fullName, email, newPassword],
        [fullNameError, emailError, newPasswordError],
      ),
    ).toBe(false);

    expect(email).toHaveClass('error');
    expect(emailError).toHaveClass('active');
  });

  it('should return false if one of the required input fields is wrongly filled and have an error displayed', () => {
    const {
      fullName,
      email,
      newPassword,
      fullNameError,
      emailError,
      newPasswordError,
    } = createElementsAndErrors();

    fullName.value = 'Test';
    email.value = 'test';
    newPassword.value = 'test';

    expect(
      InputValidationAll(
        [fullName, email, newPassword],
        [fullNameError, emailError, newPasswordError],
      ),
    ).toBe(false);

    const emailRegexCheck = email.value.match(
      /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g,
    );
    const passwordRegexCheck = newPassword.value.match(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/g,
    );
    const fullNameRegexCheck = fullName.value.match(
      /^(?=.*[A-Za-z])[A-Za-z.'-]+\s[A-Za-z.'-]+(?:\s[A-Za-z.'-]+)*$/g,
    );
    expect(emailRegexCheck).toBeNull();
    expect(passwordRegexCheck).toBeNull();
    expect(fullNameRegexCheck).toBeNull();
    expect(fullName).toHaveClass('error');
    expect(fullNameError).toHaveClass('active');
    expect(email).toHaveClass('error');
    expect(emailError).toHaveClass('active');
    expect(newPassword).toHaveClass('error');
    expect(newPasswordError).toHaveClass('active');
  });

  it('should return false if confirmPassword does not match newPassword', () => {
    const {confirmPassword, confirmPasswordError} = createElementsAndErrors();

    confirmPassword.value = 'Password123!$$$';

    expect(
      document.querySelector<HTMLInputElement>('#newPassword'),
    ).not.toBeNull();

    expect(InputValidationAll([confirmPassword], [confirmPasswordError])).toBe(
      false,
    );
    expect(confirmPassword).toHaveClass('error');
    expect(confirmPasswordError).toHaveClass('active');
  });

  it('should return true for proper url input or false for improper url input', () => {
    const {url, urlError} = createElementsAndErrors();

    url.value = 'test.com';

    const urlRegexCheck = url.value.match(
      /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi,
    );

    expect(InputValidationAll([url], [urlError])).toBe(true);
    expect(urlRegexCheck).not.toBeNull();
    expect(url).not.toHaveClass('error');
    expect(urlError).not.toHaveClass('active');

    url.value = 'testcom';

    const urlRegexCheck2 = url.value.match(
      /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi,
    );

    expect(InputValidationAll([url], [urlError])).toBe(false);
    expect(urlRegexCheck2).toBeNull();
    expect(url).toHaveClass('error');
    expect(urlError).toHaveClass('active');
  });

  it('should return true for proper phone number input or false for improper phone number input', () => {
    const {tel, telError} = createElementsAndErrors();

    const telRegexCheck = tel.value.match(
      /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
    );

    expect(InputValidationAll([tel], [telError])).toBe(true);
    expect(telRegexCheck).not.toBeNull();
    expect(tel).not.toHaveClass('error');
    expect(telError).not.toHaveClass('active');

    tel.value = '04';

    const telRegexCheck2 = tel.value.match(
      /(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})/g,
    );

    expect(InputValidationAll([tel], [telError])).toBe(false);
    expect(telRegexCheck2).toBeNull();
    expect(tel).toHaveClass('error');
    expect(telError).toHaveClass('active');
  });

  it('should return true if there is propper business location data or false if there is not', () => {
    const {businessLocation, businessLocationError} = createElementsAndErrors();
    const bussinesData: RegistrationData = {
      business_name: 'Test Business',
      address_1: '12345 Test',
      address_2: '',
      city: 'Test',
      state_code: 'Test',
      zip: '12345',
      country_code: 'Test',
      website: 'https://www.test.com',
      first_name: 'Test',
      last_name: 'Test',
      email: 'test@test.com',
      phone_number: '+385955608459',
      mobile_number: '+385955608459',
      business_type_id: 'Test',
      latitude: 0,
      longitude: 0,
      job_title: 'Test',
      status: 0,
    };

    expect(
      InputValidationAll(
        [businessLocation],
        [businessLocationError],
        false,
        bussinesData,
      ),
    ).toBe(true);

    expect(businessLocation).not.toHaveClass('error');
    expect(businessLocationError).not.toHaveClass('active');

    expect(
      InputValidationAll([businessLocation], [businessLocationError]),
    ).toBe(false);

    expect(businessLocation).toHaveClass('error');
    expect(businessLocationError).toHaveClass('active');
  });

  afterEach(() => {
    // clear dom
    document.body.innerHTML = '';
  });
});
