import type {Dispatch, SetStateAction} from 'react';
import React from 'react';

import MemoCheckmark from '@/src/icons/checkmark';
import MemoWarning from '@/src/icons/warning';
import InputValidationAll from '@/src/utils/InputValidationAll';

import MemoBack from '@/src/icons/back';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import type {RegistrationData} from '@/types/registrations';
import type {FuseOptionKey} from 'fuse.js';
import {toast} from 'react-toastify';
import AutoCompleteInput from '../../common/autocompleteInput/autocompleteInput';
import Button from '../../common/button/button';
import WhiteButton from '../../common/button/whiteButton';
import Description from '../../common/description/description';
import Input from '../../common/input/input';
import SelectFuzzy from '../../common/modalSelectLabel/selectFuzzy';
import TelInput from '../../common/telInput/telInput';
import Title from '../../common/title/title';
import PressEnter from '../pressEnter/pressEnter';

export interface PageData {
  title: React.ReactNode;
  description: React.ReactNode;
  inputPlaceholder?: string;
  inputName: string;
  value:
    | string
    | number
    | {
        id: string;
        name: string;
      };
  setValue?: (tempData: any) => void;
  setAutocompleteValue?: (
    value: google.maps.places.PlaceResult | string | null,
  ) => void;
  type?: string;
  errorMessage?: string;
  autocomplete?: string;
  searchData?: any;
  searchKeys?: FuseOptionKey<any>[];
  displayValue?: string;
  display?: {
    topLeft: string;
    topRight?: string;
    bottomLeft?: string | string[];
    // *** topRight has to be defined if bottomRight is defined ***
    bottomRight?: string;
  };
  displayStartLimit?: number;
  dataName?: string;
}

const sendVerificationCode = async (phone: string) => {
  const response: {
    success: boolean;
  } = await ClientApiRequest({
    uri: 'auth/phone-verification-request',
    method: 'POST',
    data: {mobile_number: phone},
    auth: false,
  });

  if (!response.success)
    toast.error('Error sending verification code', {
      autoClose: false,
    });
  else toast.success('Verification code sent successfully');
  return response;
};

export default function PageComponent({
  index,
  currentPage,
  setPage,
  pageLength,
  openPhone,
  verifiedPhone,
  setVerifiedPhone,
  title,
  description,
  inputPlaceholder,
  inputName,
  inputLabel,
  value,
  setValue,
  setAutocompleteValue,
  type,
  errorMessage,
  autocomplete,
  businessData,
  clearValue,
  onEmailSubmit,
  searchData,
  searchKeys,
  displayValue,
  display,
  displayStartLimit,
  dataName,
}: {
  index: number;
  currentPage: number;
  setPage: Dispatch<React.SetStateAction<number>>;
  pageLength: number;
  openPhone?: Dispatch<SetStateAction<boolean>>;
  verifiedPhone?: boolean;
  setVerifiedPhone?: Dispatch<SetStateAction<boolean>>;
  title: React.ReactNode;
  description: React.ReactNode;
  inputPlaceholder?: string;
  inputName: string;
  inputLabel?: string;
  value:
    | string
    | number
    | {
        id: string;
        name: string;
      };
  setValue?: (tempData: any) => void;
  setAutocompleteValue?: (
    value: google.maps.places.PlaceResult | string | null,
  ) => void;
  type?: string;
  errorMessage?: string;
  autocomplete?: string;
  businessData?: RegistrationData;
  clearValue?: (inputName: string) => void;
  onEmailSubmit?: () => void;
  searchData?: any;
  searchKeys?: FuseOptionKey<any>[];
  displayValue?: string;
  display?: {
    topLeft: string;
    topRight?: string;
    bottomLeft?: string | string[];
    // *** topRight has to be defined if bottomRight is defined ***
    bottomRight?: string;
  };
  displayStartLimit?: number;
  dataName?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [goBackButtonVisible, setGoBackButtonVisible] = React.useState(false);

  return (
    <div data-testid={`pageComponent_${inputName}`} className="pageComponent">
      <Title
        component={index === 0 ? 'h1' : 'h2'}
        className="pageComponentTitle"
        data-testid={`title_${inputName}`}
      >
        {title}
      </Title>
      {description && (
        <Description
          className="pageComponentDescription"
          data-testid={`description_${inputName}`}
        >
          {description}
        </Description>
      )}
      <div className="signInSliderInputContainer">
        {inputName === 'businessLocation' && (
          <AutoCompleteInput
            inputRef={inputRef}
            active={currentPage === 2}
            onChange={(place) => {
              // if change event return
              if (typeof setAutocompleteValue === 'undefined') return;
              if (typeof place === 'string') setAutocompleteValue(place);
              else {
                setAutocompleteValue(place as google.maps.places.PlaceResult);
              }
            }}
          >
            <Input
              ref={inputRef}
              data-testid={`input_${inputName}`}
              aria-label={inputLabel}
              // onKeyUp={(e) => handleKeyUp(e)}
              onChange={(e) => {
                const pageComponent =
                  document.querySelectorAll('.pageComponent')[currentPage - 1];
                const inputEl = pageComponent?.querySelectorAll(
                  'input[required], textarea[required], select[required]',
                );
                const errorEl =
                  pageComponent?.querySelectorAll('.errorContainer');

                if (inputEl && e.currentTarget.classList.contains('error')) {
                  InputValidationAll(inputEl, errorEl, false, businessData);
                }

                if (
                  e.currentTarget.name === 'mobileNumber' &&
                  typeof setVerifiedPhone !== 'undefined'
                ) {
                  setVerifiedPhone(false);
                }

                if (typeof setAutocompleteValue !== 'undefined') {
                  setAutocompleteValue(e.currentTarget.value);
                }
              }}
              placeholder={inputPlaceholder ?? 'Type your answer here...'}
              name={inputName}
              required
              id={inputName}
              type={type}
              value={value && value !== '' ? (value as string) : ''}
            />
          </AutoCompleteInput>
        )}
        {type === 'select' && (
          <SelectFuzzy
            offset={{
              top: -77,
              left: 0,
            }}
            selectProps={{
              name: inputName,
              id: inputName,
              'aria-label': inputLabel,
              required: true,
              value: (
                value as {
                  id: string;
                  name: string;
                }
              ).id,
              'data-testid': `select_${inputName}`,
            }}
            selectTestDataId={`select_${inputName}Button`}
            dropdownId={`${inputName}_dropdown`}
            data-testid={`select_${inputName}`}
            data={searchData || []}
            searchData={searchData || []}
            searchKeys={searchKeys || []}
            displayValue={displayValue || ''}
            display={
              display || {
                topLeft: '',
                topRight: '',
                bottomLeft: '',
                bottomRight: '',
              }
            }
            displayStartLimit={displayStartLimit || 5}
            value={
              value as {
                id: string;
                name: string;
              }
            }
            setValue={(tempData) => {
              if (typeof setValue !== 'undefined') setValue(tempData);
            }}
            dataName={dataName || ''}
          />
        )}
        {type === 'tel' && (
          <TelInput
            data={value as string}
            active={currentPage === 6 || currentPage === 7}
            setData={(data) => {
              if (typeof setValue !== 'undefined') setValue(data);
            }}
            country={businessData?.country_code || 'us'}
            aria-label={inputName}
            data-testid={`input_${inputName}`}
            required
            onChange={(e) => {
              const pageComponent =
                document.querySelectorAll('.pageComponent')[currentPage - 1];
              const inputEl = pageComponent?.querySelectorAll(
                'input[required], textarea[required], select[required]',
              );
              const errorEl =
                pageComponent?.querySelectorAll('.errorContainer');

              if (inputEl && e.currentTarget.classList.contains('error')) {
                if (
                  !InputValidationAll(inputEl, errorEl, false, businessData) &&
                  inputName === 'confirmPassword'
                )
                  setGoBackButtonVisible(true);
                else setGoBackButtonVisible(false);
              }

              if (
                e.currentTarget.name === 'mobileNumber' &&
                typeof setVerifiedPhone !== 'undefined'
              ) {
                setVerifiedPhone(false);
              }
            }}
            placeholder={inputPlaceholder ?? 'Type your answer here...'}
            name={inputName}
            id={inputName}
            type={type}
            autoComplete={autocomplete}
          />
        )}
        {inputName !== 'businessLocation' &&
          type !== 'tel' &&
          type !== 'select' && (
            <Input
              aria-label={inputLabel}
              data-testid={`input_${inputName}`}
              required
              // onKeyUp={(e) => handleKeyUp(e)}
              onChange={(e) => {
                const pageComponent =
                  document.querySelectorAll('.pageComponent')[currentPage - 1];
                const inputEl = pageComponent?.querySelectorAll(
                  'input[required], textarea[required], select[required]',
                );
                const errorEl =
                  pageComponent?.querySelectorAll('.errorContainer');

                if (inputEl && e.currentTarget.classList.contains('error')) {
                  if (
                    !InputValidationAll(
                      inputEl,
                      errorEl,
                      false,
                      businessData,
                    ) &&
                    inputName === 'confirmPassword'
                  )
                    setGoBackButtonVisible(true);
                  else setGoBackButtonVisible(false);
                }

                if (
                  e.currentTarget.name === 'mobileNumber' &&
                  typeof setVerifiedPhone !== 'undefined'
                ) {
                  setVerifiedPhone(false);
                }

                if (typeof setValue !== 'undefined') setValue(e);
              }}
              placeholder={inputPlaceholder ?? 'Type your answer here...'}
              name={inputName}
              id={inputName}
              type={type}
              value={value && value !== '' ? (value as string) : ''}
              autoComplete={autocomplete}
            />
          )}
        <div
          data-testid={`error_${inputName}`}
          className={`errorContainer ${inputName}`}
        >
          <span className="error">
            <MemoWarning
              aria-label="Warning icon"
              style={{
                width: '18px',
                height: '18px',
              }}
            />
            {errorMessage}
          </span>
        </div>
      </div>
      <div
        style={{
          marginTop: '34px',
          display: 'flex',
          alignItems: 'center',
        }}
        className={`signUpButtonsContainers ${goBackButtonVisible ? ' backActive' : ''}`}
      >
        <div className="backButtonContainer">
          <WhiteButton
            type="button"
            data-testid={`backButton_${currentPage}`}
            onClick={() => {
              if (typeof clearValue !== 'undefined') clearValue(inputName);
              setGoBackButtonVisible(false);
              if (currentPage > 1) setPage(currentPage - 1);
            }}
            className="backButton"
          >
            <MemoBack aria-label="Back icon" />
            <span>Back</span>
          </WhiteButton>
        </div>
        <Button
          onClick={(e) => {
            const inputEl = document.querySelectorAll(
              `input[name="${inputName}"]`,
            );
            const pageComponent =
              document.querySelectorAll('.pageComponent')[currentPage - 1];
            const errorEl = pageComponent?.querySelectorAll('.errorContainer');
            //console.log(document, inputEl, 'inputEl', errorEl, 'errorEl');
            if (!InputValidationAll(inputEl, errorEl, false, businessData)) {
              if (inputName === 'confirmPassword') setGoBackButtonVisible(true);
              return;
            }
            setGoBackButtonVisible(false);
            if (
              currentPage === pageLength - 1 &&
              typeof openPhone !== 'undefined' &&
              typeof verifiedPhone !== 'undefined' &&
              !verifiedPhone
            ) {
              e.preventDefault();
              e.stopPropagation();
              openPhone(true);
              sendVerificationCode(value as string);
            } else if (currentPage === pageLength && businessData?.email) {
              if (typeof onEmailSubmit !== 'undefined') onEmailSubmit();
            } else if (currentPage < pageLength) {
              setPage(currentPage + 1);
            }
          }}
          type="button"
          data-testid={`nextButton_${inputName}`}
          id={`nextButton_${inputName}`}
        >
          <MemoCheckmark aria-label="Checkmark icon" />
          <span>OK</span>
        </Button>
        <div
          className="enterContainer"
          style={{
            marginLeft: '20px',
          }}
        >
          <PressEnter />
        </div>
      </div>
    </div>
  );
}
