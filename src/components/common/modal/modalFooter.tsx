import MemoBack from '@/src/icons/back';

import FormButton from '../../auth/common/formButton/formButton';
import ClearButton from '../button/clearButton';

export function ModalFooterContainer({
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div {...props} className={`modalFooter ${props.className}`}>
      {props.children}
    </div>
  );
}

export default function ModalFooter({
  setOpen,
  isError,
  setIsError,
  noBackButton,
  modalClass,
  buttonText,
  loadingText,
  successText,
  errorText,
  buttonIcon,
  onSubmit,
  noIcon,
  buttonVariant,
  backButtonIcon,
  backButtonText,
  backDataTestId,
  submitDataTestId,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isError?: boolean;
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>;
  noBackButton?: boolean;
  modalClass: string;
  buttonText: string;
  loadingText?: string;
  successText?: string;
  errorText?: string;
  buttonIcon?: React.ReactNode;
  onSubmit: () => void | Promise<'success' | 'error'> | undefined;
  noIcon?: boolean;
  buttonVariant?: 'success' | 'error' | 'warning' | 'info';
  backButtonText?: string;
  backButtonIcon?: React.ReactNode;
  backDataTestId?: string;
  submitDataTestId?: string;
}) {
  return (
    <div
      {...props}
      className={`modalFooter${noBackButton ? ' flexEnd' : ''}${
        props.className ? ` ${props.className}` : ''
      }`}
    >
      {!noBackButton && (
        <ClearButton
          type="button"
          data-testid={`${backDataTestId || 'backButton'}`}
          onClick={() => {
            setOpen(false);
          }}
        >
          {backButtonIcon || <MemoBack />}
          {backButtonText || 'Cancel'}
        </ClearButton>
      )}
      <FormButton
        data-testid={`${submitDataTestId ? submitDataTestId : 'submitButton'}`}
        isError={isError}
        setIsError={setIsError}
        // className={`${modalClass}`}
        modalClass={modalClass}
        text={buttonText}
        loadingText={loadingText}
        successText={successText}
        errorText={errorText}
        icon={buttonIcon}
        onClick={onSubmit}
        noIcon={noIcon}
        buttonVariant={buttonVariant}
      />
    </div>
  );
}
