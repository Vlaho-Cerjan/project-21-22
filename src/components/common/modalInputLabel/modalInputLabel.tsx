import MemoClear from '@/src/icons/clear';
import InputValidationAll from '@/src/utils/InputValidationAll';

import MemoEye from '@/src/icons/eye';
import React, {forwardRef} from 'react';
import PassEyeButton from '../../auth/passEyeButton/passEyeButton';
import ClearButton from '../button/clearButton';
import ModalInput, {ForwardedRefModalInput} from '../input/modalInput';
import Label from '../label/label';

export default function ModalInputLabel({
  labelText,
  labelProps,
  inputProps,
  errorText,
  onClear,
  showEye,
  noError,
}: {
  labelText: string;
  labelProps?: React.DetailedHTMLProps<
    React.LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
  >;
  inputProps?: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > & {
    'data-testid'?: string;
  };
  errorText?: string;
  onClear?: () => void;
  showEye?: boolean;
  noError?: boolean;
}) {
  const originalType = inputProps?.type || 'text';
  const [type, setType] = React.useState(inputProps?.type || 'text');

  return (
    <div className="formControl">
      <div className="labelContainer">
        <Label htmlFor={inputProps?.name} {...labelProps}>
          {labelText}
        </Label>
      </div>
      <div className="modalInputContainer">
        <ModalInput
          {...inputProps}
          type={type}
          onChange={(e) => {
            if (typeof noError === 'undefined' || !noError) {
              const errorEl = document.querySelector(
                `.errorContainer.${inputProps?.name}`,
              );
              if (e.currentTarget.required) {
                const input = e.currentTarget as HTMLInputElement;
                if (originalType === 'password') {
                  input.type = 'password';
                }
                if (InputValidationAll([input], [errorEl], true)) {
                  e.currentTarget.classList.remove('error');
                  errorEl?.classList.remove('active');
                  errorEl?.removeAttribute('style');
                }
              }
            }

            if (inputProps && typeof inputProps.onChange === 'function')
              inputProps.onChange(e);
          }}
        />
        {typeof onClear === 'function' && (
          <ClearButton onClick={onClear}>
            <MemoClear />
          </ClearButton>
        )}
        {showEye && (
          <div className="eyeContainer">
            <PassEyeButton
              setType={setType}
              passInputName={inputProps?.name || ''}
              icon={<MemoEye />}
            />
          </div>
        )}
      </div>
      {(typeof noError === 'undefined' || !noError) && (
        <div className={`errorContainer ${inputProps?.name}`}>
          <div className="error">{errorText}</div>
        </div>
      )}
    </div>
  );
}

export const ForwardedRefModalInputLabel = forwardRef(
  function ForwardedRefModalInputLabel(
    {
      labelText,
      labelProps,
      inputProps,
      errorText,
      onClear,
      showEye,
    }: {
      labelText: string;
      labelProps?: React.HTMLProps<HTMLLabelElement>;
      inputProps?: React.HTMLProps<HTMLInputElement> & {
        'data-testid'?: string;
      };
      errorText?: string;
      onClear?: () => void;
      showEye?: boolean;
    },
    ref: React.Ref<HTMLInputElement>,
  ) {
    const originalType = inputProps?.type || 'text';
    const [type, setType] = React.useState(inputProps?.type || 'text');

    return (
      <div className="formControl">
        <div className="labelContainer">
          <Label htmlFor={inputProps?.name} {...labelProps}>
            {labelText}
          </Label>
        </div>
        <div className="modalInputContainer">
          <ForwardedRefModalInput
            {...inputProps}
            type={type}
            ref={ref}
            onChange={(e) => {
              const errorEl = document.querySelector(
                `.errorContainer.${inputProps?.name}`,
              );
              const input = e.currentTarget as HTMLInputElement;
              if (originalType === 'password') {
                input.type = 'password';
              }
              if (e.currentTarget.required) {
                if (InputValidationAll([input], [errorEl], true)) {
                  e.currentTarget.classList.remove('error');
                  errorEl?.classList.remove('active');
                  errorEl?.removeAttribute('style');
                }
              }

              if (inputProps && typeof inputProps.onChange === 'function')
                inputProps.onChange(e);
            }}
          />
          {typeof onClear === 'function' && (
            <ClearButton onClick={onClear}>
              <MemoClear />
            </ClearButton>
          )}
          {showEye && (
            <div className="eyeContainer">
              <PassEyeButton
                passInputName="signInPassword"
                icon={<MemoEye />}
                setType={setType}
              />
            </div>
          )}
        </div>
        <div className={`errorContainer ${inputProps?.name}`}>
          <div className="error">{errorText}</div>
        </div>
      </div>
    );
  },
);
