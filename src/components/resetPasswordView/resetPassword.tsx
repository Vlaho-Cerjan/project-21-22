'use client';

import {ResizedAdaptiveImage} from '@/src/lib/adaptiveImage';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {signIn} from 'next-auth/react';
import {useRouter, useSearchParams} from 'next/navigation';
import React from 'react';
import {toast} from 'react-toastify';
import FormButton from '../auth/common/formButton/formButton';
import {ModalDivider} from '../common/divider/divider';
import InlineModal from '../common/inlineModal/inlineModal';
import ModalContent from '../common/modal/modalContent';
import {ModalFooterContainer} from '../common/modal/modalFooter';
import ModalHeader from '../common/modal/modalHeader';
import ModalInputLabel from '../common/modalInputLabel/modalInputLabel';

const ResetPasswordRequest = async (newPassword: string, token: string) => {
  const res = await ClientApiRequest({
    uri: 'auth/password-reset',
    method: 'POST',
    data: {
      password: newPassword,
      token,
    },
  });

  return res;
};

export default function ResetPassword() {
  const title: string = `Reset Password`;
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isError, setIsError] = React.useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      router.push('/sign-up');
    }
  }, []);

  const onSubmit = async () => {
    const paramToken = searchParams.get('token');
    if (paramToken) {
      const res = await ResetPasswordRequest(newPassword, paramToken);
      if (res.success) {
        if (res.data) {
          const {token} = res.data;
          const signInRes = await signIn('credentials', {
            redirect: false,
            token,
          });

          if (signInRes && signInRes.error) {
            toast.error(
              'Password reset success but automatic sign in failed. Redirecting to sign in page',
            );
            router.push('/sign-up/?signIn=true');
          }
          if (signInRes && signInRes.ok) {
            toast.success(
              'Password reset successful. Redirecting to dashboard.',
            );
            router.push('/');
          }
        }
        return 'success';
      }
      toast.error('Password reset failed. Please try again.');
      return 'error';
    }
    return 'error';
  };

  return (
    <div className="mainContentContainer resetPasswordContainer">
      <div className="imageAbsoluteContainer">
        <ResizedAdaptiveImage
          src="https://media.project-api.tv/api/image/3a75df20-0ba8-11ef-b259-afe90ff3ed2a/image.jpg"
          alt="Reset Password Background Image"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="contentWrapper">
        <InlineModal className="landingModal passwordReset">
          <ModalHeader data-testid="landingHeader" title={title} />
          <ModalContent
            data-testid="landingContent"
            className="descriptionContent"
          >
            <p>Please choose your new password.</p>
            <p>
              The password has to contain at least 8 characters, upper and
              lowercase letters, numbers and special characters.
            </p>
          </ModalContent>
          <ModalDivider />
          <div data-testid="landingForm" className="contentContainer">
            <ModalContent>
              <div className="formContainer">
                <ModalInputLabel
                  labelText="New Password"
                  errorText="Password must contain at least 8 characters, upper and lowercase letters, numbers and special characters."
                  showEye
                  inputProps={{
                    'data-testid': 'newPassword',
                    id: 'newPassword',
                    type: 'password',
                    name: 'newPassword',
                    placeholder: 'Enter your new password',
                    value: newPassword,
                    autoComplete: 'new-password',
                    required: true,
                    onChange: (e) => setNewPassword(e.target.value),
                  }}
                />
                <ModalInputLabel
                  labelText="Confirm Password"
                  errorText="Passwords do not match."
                  showEye
                  inputProps={{
                    'data-testid': 'confirmPassword',
                    id: 'confirmPassword',
                    type: 'password',
                    name: 'confirmPassword',
                    placeholder: 'Confirm your new password',
                    value: confirmPassword,
                    autoComplete: 'confirm-password',
                    required: true,
                    onChange: (e) => setConfirmPassword(e.target.value),
                  }}
                />
              </div>
            </ModalContent>
          </div>
          <ModalDivider />
          <ModalFooterContainer>
            <FormButton
              data-testid="resetPasswordButton"
              modalClass="landingModal"
              text="Update Password"
              noIcon
              isError={isError}
              setIsError={setIsError}
              onClick={() => {
                return onSubmit();
              }}
            >
              Update Password
            </FormButton>
          </ModalFooterContainer>
        </InlineModal>
      </div>
    </div>
  );
}
