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

const CreatePasswordRequest = async (newPassword: string, token: string) => {
  const res = await ClientApiRequest({
    uri: 'auth/password-create',
    method: 'POST',
    data: {
      password: newPassword,
      token,
    },
  });

  return res;
};

export default function CreatePassword() {
  const title: string = `Create Password`;
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
      const res = await CreatePasswordRequest(newPassword, paramToken);
      if (res.success) {
        if (res.data) {
          const {token} = res.data;
          const signInRes = await signIn('credentials', {
            redirect: false,
            token,
          });

          console.log(signInRes);

          if (signInRes && signInRes?.ok) {
            toast.success(
              'Password created successfully. Redirecting to project portal.',
            );
            router.push('/');
          }
        }
        return 'success';
      }
      toast.error('Password creation failed. Please try again.');
      return 'error';
    }
    return 'error';
  };

  return (
    <div className="mainContentContainer createPasswordContainer">
      <div className="imageAbsoluteContainer">
        <ResizedAdaptiveImage
          src="https://media.project-api.tv/api/image/3a75df20-0ba8-11ef-b259-afe90ff3ed2a/image.jpg"
          alt="Create Password Background Image"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="contentWrapper">
        <InlineModal className="landingModal passwordCreate">
          <ModalHeader data-testid="landingHeader" title={title} />
          <ModalContent
            data-testid="landingContent"
            className="descriptionContent"
          >
            <p>Please create your password.</p>
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
                  labelText="Password"
                  errorText="Password must contain at least 8 characters, upper and lowercase letters, numbers and special characters."
                  showEye
                  inputProps={{
                    'data-testid': 'newPassword',
                    id: 'newPassword',
                    type: 'password',
                    name: 'newPassword',
                    placeholder: 'Enter your password',
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
                    placeholder: 'Confirm your password',
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
              data-testid="createPasswordButton"
              modalClass="landingModal"
              text="Create Password"
              noIcon
              isError={isError}
              setIsError={setIsError}
              onClick={() => {
                return onSubmit();
              }}
            >
              Create Password
            </FormButton>
          </ModalFooterContainer>
        </InlineModal>
      </div>
    </div>
  );
}
