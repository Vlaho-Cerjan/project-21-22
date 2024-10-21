import InputValidationAll from '@/src/utils/InputValidationAll';

import Label from '../label/label';
import ModalSelect from '../select/modalSelect';

export default function ModalSelectLabel({
  labelText,
  labelProps,
  selectProps,
  errorText,
  data,
  noError,
}: {
  labelText: string;
  data: any[];
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  selectProps?: React.HTMLProps<HTMLInputElement> & {
    'data-testid'?: string;
  };
  errorText?: string;
  noError?: boolean;
}) {
  return (
    <div className="formControl">
      <div className="labelContainer">
        <Label htmlFor={selectProps?.name} {...labelProps}>
          {labelText}
        </Label>
      </div>
      <ModalSelect
        options={data}
        {...selectProps}
        aria-label={labelText}
        onChange={(e) => {
          const inputEl = document.querySelector(
            `input[name=${selectProps?.name}]`,
          );
          const errorEl = document.querySelector(
            `.errorContainer.${selectProps?.name}`,
          );
          if (inputEl && selectProps?.required) {
            if (
              InputValidationAll([inputEl as HTMLInputElement], [errorEl], true)
            ) {
              inputEl.classList.remove('error');
              errorEl?.classList.remove('active');
              errorEl?.removeAttribute('style');
            }
          }

          if (selectProps && typeof selectProps.onChange === 'function')
            selectProps.onChange(e);
        }}
      />
      {!noError && (
        <div className={`errorContainer ${selectProps?.name}`}>
          <div className="error">{errorText}</div>
        </div>
      )}
    </div>
  );
}
