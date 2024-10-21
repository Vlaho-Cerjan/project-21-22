import React from 'react';

import ClientApiRequest from '@/src/lib/clientApiRouter';
import {signIn} from 'next-auth/react';
import dynamic from 'next/dynamic';
import {useRouter, useSearchParams} from 'next/navigation';
import {toast} from 'react-toastify';
import ClearButton from '../../common/button/clearButton';
import Checkmark from '../../common/checkmark/checkmark';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import FormButton from '../common/formButton/formButton';

const PasswordReset = async (email: string) => {
  const res = await ClientApiRequest({
    uri: 'auth/password-request',
    method: 'POST',
    auth: false,
    data: {
      email,
    },
  });

  return res;
};

const RequestPasswordResetModalLazy = dynamic(
  () =>
    import('@/src/components/auth/requestPasswordModal/requestPasswordModal'),
  {
    ssr: false,
  },
);

export default function SignInModal({
  open,
  setOpen,
  inputError,
  setInputError,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inputError: boolean;
  setInputError: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [errorText, setErrorText] = React.useState(
    'Email or password is incorrect. Please try again.',
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const [openRequestPasswordModal, setOpenRequestPasswordModal] =
    React.useState(false);
  const [openModalDelay, setOpenModalDelay] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setOpenModalDelay(true);
    }, 500);
  }, []);

  React.useEffect(() => {
    if (searchParams.get('signIn') === 'true') {
      setTimeout(() => {
        setOpen(true);
      }, 500);
    }
  }, []);

  React.useEffect(() => {
    const handleEnterPress = (e: KeyboardEvent) => {
      const signInModal = document.querySelector('.signInModal');
      const target = e.target as HTMLElement;
      const isTargetInModal = signInModal?.contains(target);
      const submitButton = document.getElementById('submitSignInButton');
      if (e.key === 'Enter' && submitButton && isTargetInModal) {
        submitButton.click();
      }
    };

    window.addEventListener('keydown', handleEnterPress);

    return () => {
      window.removeEventListener('keydown', handleEnterPress);
    };
  }, []);

  async function handleSubmit() {
    // event.preventDefault();
    // etLoading(true);

    if (!email || !password) {
      setInputError(true);
      setErrorText('Please enter your email and password.');
      return 'error';
    }

    const body = {
      email,
      password,
      rememberMe,
    };

    try {
      const response: any = await signIn('credentials', {
        redirect: false,
        email: body.email,
        password: body.password,
        remember_me: body.rememberMe,
      });

      if (response && !response.ok) {
        setInputError(true);
        setErrorText('Email or password is incorrect. Please try again.');
        return 'error';
      }

      // setSuccess(true);

      // setLoading(false);
      router.push(searchParams.get('callbackUrl') || '/');
      return 'success';
    } catch (error: any) {
      if (error && error.data && error.data.message) {
        console.error('An unexpected error happened:', error.data.message);
      } else {
        console.error('An unexpected error happened:', error);
      }

      // setLoading(false);

      setErrorText(
        'Something went wrong. Please try again or contact support.',
      );
      return 'error';
    }
  }

  return (
    <Modal
      data-testid="signInModal"
      className="signInModal"
      open={open}
      setOpen={setOpen}
    >
      <ModalHeader
        title="Sign Into Project"
        description="Enter your email and password."
      />
      <ModalDivider className="topDivider" />
      <div className="contentContainer">
        <ModalContent>
          <div className="formContainer">
            <ModalInputLabel
              labelText="Email Address"
              noError
              inputProps={{
                id: 'signInEmail',
                name: 'signInEmail',
                type: 'email',
                'data-testid': 'email',
                autoComplete: 'email',
                placeholder: 'Email Address',
                value: email,
                onChange: (e) => {
                  setEmail(e.target.value);
                  setInputError(false);
                },
              }}
            />
            <ModalInputLabel
              labelText="Password"
              noError
              inputProps={{
                id: 'signInPassword',
                type: 'password',
                'data-testid': 'password',
                placeholder: 'Password',
                name: 'signInPassword',
                value: password,
                onChange: (e) => {
                  setPassword(e.target.value);
                  setInputError(false);
                },
              }}
              showEye
            />
            <Checkmark
              name="rememberMe"
              label="Remember me checkbox"
              title="Remember me"
              value={rememberMe}
              setValue={() => setRememberMe(!rememberMe)}
            />
          </div>
          <div
            data-testid="inputErrorContainer"
            className={`inputErrorContainer${inputError ? ' active' : ''}`}
          >
            <div className="inputError">{errorText}</div>
          </div>
        </ModalContent>
      </div>
      <ModalDivider className="bottomDivider" />
      <ModalFooterContainer>
        <ClearButton
          onClick={() => setOpenRequestPasswordModal(true)}
          data-testid="forgotPasswordLink"
        >
          Need help signing in?
        </ClearButton>
        <FormButton
          data-testid="submitSignInButton"
          modalClass="signInModal"
          id="submitSignInButton"
          isError={isError}
          setIsError={setIsError}
          onClick={() => handleSubmit()}
        />
      </ModalFooterContainer>
      {openModalDelay && (
        <RequestPasswordResetModalLazy
          open={openRequestPasswordModal}
          setOpen={setOpenRequestPasswordModal}
          email={email}
          onSubmit={async (resetEmail) => {
            const res = await PasswordReset(resetEmail);
            if (res.success) {
              setOpenRequestPasswordModal(false);
              toast.success(
                'Password reset email sent. Please check your email.',
              );
            } else {
              toast.error('Error sending password reset email.');
            }
          }}
        />
      )}
    </Modal>
  );
}
