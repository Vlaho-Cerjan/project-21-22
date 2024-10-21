import React from 'react';

import MemoRotate from '@/src/icons/rotate';

import Button from '../../common/button/button';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';

export default function VerifyEmailModal({
  open,
  setOpen,
  verifyEmailFunction,
  email,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  verifyEmailFunction?: () => void;
  email?: string;
}) {
  React.useEffect(() => {
    setTimeout(() => {
      if (typeof verifyEmailFunction !== 'undefined') verifyEmailFunction();
    }, 5000);
  }, []);

  return (
    <Modal open={open} setOpen={setOpen} className="verifyEmail">
      <ModalHeader
        titleComponent="h3"
        title="Verify Your Email"
        description={
          <span>
            Please click on the verification link we just sent to{' '}
            <span style={{color: '#707070'}}>{email}</span>.
          </span>
        }
      />
      <ModalDivider />
      <ModalFooterContainer style={{justifyContent: 'flex-start'}}>
        <Button type="button" className="disabled">
          <MemoRotate />
          RESEND
        </Button>
      </ModalFooterContainer>
    </Modal>
  );
}
