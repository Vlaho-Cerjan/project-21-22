import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';

export default function RequestPasswordResetModal({
  open,
  setOpen,
  email,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
  onSubmit: (email: string) => void;
}) {
  const [resetEmail, setResetEmail] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    setResetEmail(email);
  }, [email]);

  useDidUpdateEffect(() => {
    if (!open) {
      setResetEmail('');
      setResetEmail(email);
    }
  }, [open]);

  return (
    <Modal
      id="requestPasswordResetModal"
      className="requestPasswordResetModal"
      wrapperTestId="requestPasswordResetModal"
      open={open}
      setOpen={setOpen}
    >
      <ModalHeader
        titleComponent="h3"
        title="Request Password Reset"
        description="Enter your email address and we'll send you a link to reset your password."
      />
      <ModalDivider className="topDivider" />
      <div className="contentContainer">
        <ModalContent>
          <div className="formContainer">
            <ModalInputLabel
              labelText="Email Address"
              errorText="Please enter a valid email address."
              inputProps={{
                id: 'resetEmail',
                name: 'resetEmail',
                type: 'email',
                'data-testid': 'resetEmail',
                autoComplete: 'email',
                required: true,
                value: resetEmail,
                onChange: (e) => {
                  setResetEmail(e.target.value);
                },
              }}
            />
          </div>
        </ModalContent>
      </div>
      <ModalDivider className="bottomDivider" />
      <ModalFooter
        backDataTestId="backRequestPasswordResetButton"
        submitDataTestId="submitRequestPasswordResetButton"
        isError={isError}
        setIsError={setIsError}
        setOpen={setOpen}
        modalClass="requestPasswordResetModal"
        buttonText="Send Reset Link"
        noIcon
        onSubmit={() => {
          onSubmit(resetEmail);
        }}
      />
    </Modal>
  );
}
