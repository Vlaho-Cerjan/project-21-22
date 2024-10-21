import MemoClear from '@/src/icons/clear';

import InputValidationAll from '@/src/utils/InputValidationAll';
import React from 'react';
import ClearButton from '../button/clearButton';
import Label from '../label/label';
import TelInput from '../telInput/telInput';

export default function ModalPhoneLabel({
  labelText,
  labelProps,
  inputProps,
  errorText,
  data,
  setData,
  onClear,
  country,
}: {
  labelText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  inputProps?: React.HTMLProps<HTMLInputElement> & {
    'data-testid'?: string;
  };
  errorText?: string;
  onClear?: () => void;
  data: string;
  setData: (value: string) => void;
  country?: string;
  setCountry?: (value: string) => void;
}) {
  return (
    <div className="formControl">
      <div className="labelContainer">
        <Label htmlFor={inputProps?.name} {...labelProps}>
          {labelText}
        </Label>
      </div>
      <div className="modalInputContainer">
        <TelInput
          data={data}
          setData={setData}
          country={country}
          {...inputProps}
          onChange={(e) => {
            const errorEl = document.querySelector(
              `.errorContainer.${inputProps?.name}`,
            );
            if (e.currentTarget.required) {
              if (InputValidationAll([e.currentTarget], [errorEl], true)) {
                e.currentTarget.classList.remove('error');
                errorEl?.classList.remove('active');
                errorEl?.removeAttribute('style');
              }
            }

            if (inputProps && typeof inputProps.onChange === 'function')
              inputProps.onChange(e);
          }}
        />
        {/* <ModalInput
          {...inputProps}
          onChange={(e) => {
            const errorEl = document.querySelector(
              `.errorContainer.${inputProps?.name}`,
            );
            if (e.currentTarget.required) {
              if (InputValidationAll([e.currentTarget], [errorEl], true)) {
                e.currentTarget.classList.remove('error');
                errorEl?.classList.remove('active');
                errorEl?.removeAttribute('style');
              }
            }

            if (inputProps && typeof inputProps.onChange === 'function')
              inputProps.onChange(e);
          }}
        />
        */}
        {typeof onClear === 'function' && (
          <ClearButton onClick={onClear}>
            <MemoClear />
          </ClearButton>
        )}
      </div>
      <div className={`errorContainer ${inputProps?.name}`}>
        <div className="error">{errorText}</div>
      </div>
    </div>
  );
}
