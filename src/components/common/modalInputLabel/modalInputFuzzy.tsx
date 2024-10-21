import React from 'react';

import MemoDownArrow from '@/src/icons/down-arrow';
import InputValidationAll from '@/src/utils/InputValidationAll';

import ClearButton from '../button/clearButton';
import ModalInput from '../input/modalInput';
import Label from '../label/label';

interface ModalInputFuzzyProps {
  labelText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  inputProps?: React.HTMLProps<HTMLInputElement>;
  errorText?: string;
  setOpenSearch?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalInputFuzzy({
  labelText,
  labelProps,
  inputProps,
  errorText,
  setOpenSearch,
}: ModalInputFuzzyProps) {
  return (
    <div className="formControl">
      <div className="labelContainer">
        <Label htmlFor={inputProps?.name} {...labelProps}>
          {labelText}
        </Label>
      </div>
      <ClearButton
        onClick={() => {
          if (typeof setOpenSearch !== 'undefined') setOpenSearch(true);
        }}
        className="inputFuzzyContainer"
      >
        <ModalInput
          {...inputProps}
          readOnly
          onChange={(e) => {
            const errorEl = document.querySelector(
              `.errorContainer.${inputProps?.name}`,
            );
            if (e.currentTarget.required) {
              if (InputValidationAll([e.currentTarget], [errorEl])) {
                e.currentTarget.classList.remove('error');
                errorEl?.classList.remove('active');
                errorEl?.removeAttribute('style');
              }
            }

            if (inputProps && typeof inputProps.onChange === 'function')
              inputProps.onChange(e);
          }}
        />
        <div className="inputFuzzyIcon">
          <MemoDownArrow />
        </div>
      </ClearButton>
      <div className={`errorContainer ${inputProps?.name}`}>
        <div className="error">{errorText}</div>
      </div>
    </div>
  );
}
