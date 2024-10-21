import MemoBack from '@/src/icons/back';

import SidebarFormButton from '../../auth/common/formButton/sidebarFormButton';
import ClearButton from '../button/clearButton';

export function SidebarFooterContainer({
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>) {
  return (
    <div {...props} className={`sidebarFooter ${props.className}`}>
      {props.children}
    </div>
  );
}

export default function SidebarFooter({
  setOpen,
  isError,
  setIsError,
  noBackButton,
  sidebarClass,
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
  backButtonFunction,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isError?: boolean;
  setIsError?: React.Dispatch<React.SetStateAction<boolean>>;
  noBackButton?: boolean;
  sidebarClass: string;
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
  backButtonFunction?: () => void;
}) {
  return (
    <div
      {...props}
      className={`sidebarFooter${noBackButton ? ' flexEnd' : ''}${
        props.className ? ` ${props.className}` : ''
      }`}
    >
      {!noBackButton && (
        <ClearButton
          type="button"
          onClick={() => {
            if (typeof backButtonFunction !== 'undefined') backButtonFunction();
            else setOpen(false);
          }}
        >
          {backButtonIcon || <MemoBack />}
          {backButtonText || 'Cancel'}
        </ClearButton>
      )}
      <SidebarFormButton
        isError={isError}
        setIsError={setIsError}
        // className={`${sidebarClass}`}
        sidebarClass={sidebarClass}
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
