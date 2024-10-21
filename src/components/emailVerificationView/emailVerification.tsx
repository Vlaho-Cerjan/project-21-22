'use client';

import {ResizedAdaptiveImage} from '@/src/lib/adaptiveImage';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import {useRouter, useSearchParams} from 'next/navigation';
import React from 'react';
import {toast} from 'react-toastify';
import InlineModal from '../common/inlineModal/inlineModal';
import ModalContent from '../common/modal/modalContent';
import ModalHeader from '../common/modal/modalHeader';

const VerifyEmail = async (token: string) => {
  const res = await ClientApiRequest({
    uri: 'api/registration/email-verification',
    method: 'PUT',
    data: {token},
  });

  return res;
};

export default function EmailVerification() {
  const title: string = `Verification Complete`;
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isVerified, setIsVerified] = React.useState<boolean>(false);
  const {setLoading} = React.useContext(LoadingContext);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const EmailVerificationFunc = async () => {
      setLoading(true);
      const verificationToken = searchParams.get('token');
      if (!verificationToken) {
        setTimeout(() => {
          toast.error('Verification is missing.', {
            toastId: 'verification-missing',
          });
        }, 100);
        setTimeout(() => {
          router.push('/sign-up');
        }, 1000);
      } else {
        const res = await VerifyEmail(verificationToken);
        if (!res.success) {
          setTimeout(() => {
            toast.error(res.message, {
              toastId: 'verification-error',
            });
          }, 100);
        } else {
          setIsVerified(true);
        }
      }
      setIsLoading(false);
      setLoading(false);
    };
    if (searchParams) EmailVerificationFunc();
  }, [searchParams]);

  return (
    <div className="mainContentContainer emailVerifiedContainer">
      <div className="imageAbsoluteContainer">
        <ResizedAdaptiveImage
          src="https://media.project-api.tv/api/image/3a75df20-0ba8-11ef-b259-afe90ff3ed2a/image.jpg"
          alt="Email Verification Background Image"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="contentWrapper">
        <InlineModal className="landingModal">
          <ModalHeader data-testid="landingHeader" title={title} />
          <ModalContent data-testid="landingContent">
            {isLoading && <p>Verifying...</p>}
            {!isLoading && isVerified && (
              <>
                <p>Email verification success! Spot on!</p>
                <p>
                  We will send you an email with a link when your account is
                  verified.
                </p>
              </>
            )}
            {!isLoading && !isVerified && (
              <p>Email verification failed! Please contact support.</p>
            )}
          </ModalContent>
        </InlineModal>
      </div>
    </div>
  );
}
