import MemoRotate from '@/src/icons/rotate';

import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import React from 'react';
import {toast} from 'react-toastify';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import FormButton from '../common/formButton/formButton';

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

export default function VerifyPhoneModal({
  open,
  setOpen,
  verifyPhoneFunction,
  mobileNumber,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  verifyPhoneFunction?: (code: string) => Promise<string>;
  mobileNumber?: string;
}) {
  const [code, setCode] = React.useState<string | null>(null);
  const [isError, setIsError] = React.useState(false);
  const [resend, setResend] = React.useState(false);
  const [timeRemaining, setTimeRemaining] = React.useState(30);
  const {setLoading} = React.useContext(LoadingContext);

  React.useEffect(() => {
    if (open) {
      if (timeRemaining > 0) {
        setTimeout(() => {
          setTimeRemaining(timeRemaining - 1);
        }, 1000);
      } else if (timeRemaining === 0) {
        setResend(true);
      } else if (timeRemaining === -1 && resend) {
        setResend(false);
      }
    }

    if (!open) {
      setTimeRemaining(30);
      setResend(false);
    }
  }, [open, timeRemaining]);

  return (
    <Modal open={open} setOpen={setOpen} className="verifyPhone">
      <ModalHeader
        title="Verify Your Number"
        titleComponent="h3"
        description={
          <span>
            A text message was just sent to{' '}
            <span
              data-testid="verifyNumberDescription"
              style={{color: '#707070'}}
            >
              {mobileNumber}
            </span>
            .
          </span>
        }
      />
      <ModalDivider />
      <div className="contentContainer">
        <ModalContent>
          <ModalInputLabel
            labelText="Enter Verification Code"
            labelProps={{
              htmlFor: 'verificationCode',
            }}
            inputProps={{
              onKeyDown: (e) => {
                // enter key clicks the verify
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (typeof verifyPhoneFunction !== 'undefined' && code)
                    verifyPhoneFunction(code);
                }
              },
              required: true,
              id: 'verificationCode',
              name: 'verificationCode',
              value: code || '',
              onChange: (e) => {
                setCode(e.currentTarget.value);
              },
              'data-testid': 'verificationCode',
              type: 'tel',
            }}
            errorText="Verification code invalid, please try again or resend the code."
          />
        </ModalContent>
      </div>
      <ModalDivider />
      <ModalFooterContainer>
        <FormButton
          disabled={!resend}
          text={`Resend ${timeRemaining > 0 ? `(${timeRemaining}s)` : ''}`}
          icon={<MemoRotate />}
          loadingText="Resending..."
          successText="Resent"
          onClick={async () => {
            if (typeof sendVerificationCode !== 'undefined' && mobileNumber) {
              setLoading(true);
              await sendVerificationCode(mobileNumber || '');
              setLoading(false);
            }
            setTimeRemaining(-1);
          }}
          data-testid="resendButton"
          type="button"
          className={!resend ? 'disabled' : ''}
        >
          <MemoRotate />
          Resend {timeRemaining > 0 ? `(${timeRemaining}s)` : ''}
        </FormButton>
        <FormButton
          isError={isError}
          setIsError={setIsError}
          data-testid="verifyButton"
          modalClass="verifyPhone"
          text="Verify"
          loadingText="Verifying..."
          successText="Verified"
          onClick={() => {
            if (typeof verifyPhoneFunction !== 'undefined' && code)
              verifyPhoneFunction(code);
          }}
        />
      </ModalFooterContainer>
    </Modal>
  );
}
