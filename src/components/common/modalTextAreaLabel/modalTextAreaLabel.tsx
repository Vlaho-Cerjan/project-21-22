import MemoClear from '@/src/icons/clear';
import InputValidationAll from '@/src/utils/InputValidationAll';

import ClearButton from '../button/clearButton';
import Label from '../label/label';
import ModalTextArea from '../textarea/modalTextarea';

export default function ModalTextAreaLabel({
  labelText,
  labelProps,
  textareaProps,
  errorText,
  onClear,
  duplicateId,
}: {
  labelText: string;
  labelProps?: React.HTMLProps<HTMLLabelElement>;
  textareaProps?: React.HTMLProps<HTMLTextAreaElement> & {
    'data-testid'?: string;
  };
  duplicateId?: string;
  errorText?: string;
  onClear?: () => void;
}) {
  return (
    <div className="formControl">
      <div className="labelContainer">
        <Label htmlFor={textareaProps?.name} {...labelProps}>
          {labelText}
        </Label>
      </div>
      <div className="modalInputContainer">
        <ModalTextArea
          {...textareaProps}
          duplicateId={duplicateId}
          onChange={(e) => {
            const errorEl = document.querySelector(
              `.errorContainer.${textareaProps?.name}`,
            );
            if (e.currentTarget.required) {
              if (InputValidationAll([e.currentTarget], [errorEl], true)) {
                e.currentTarget.classList.remove('error');
                errorEl?.classList.remove('active');
                errorEl?.removeAttribute('style');
              }
            }

            if (textareaProps && typeof textareaProps.onChange === 'function')
              textareaProps.onChange(e);
          }}
        />
        {typeof onClear === 'function' && (
          <ClearButton onClick={onClear}>
            <MemoClear />
          </ClearButton>
        )}
      </div>
      <div className={`errorContainer ${textareaProps?.name}`}>
        <div className="error">{errorText}</div>
      </div>
    </div>
  );
}
