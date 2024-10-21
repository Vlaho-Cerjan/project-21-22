'use client';

import {ResizedAdaptiveImage} from '@/src/lib/adaptiveImage';
import {useRouter, useSearchParams} from 'next/navigation';
import React from 'react';
import {toast} from 'react-toastify';
import InlineModal from '../common/inlineModal/inlineModal';
import ModalContent from '../common/modal/modalContent';
import ModalHeader from '../common/modal/modalHeader';

export default function PhoneVerified() {
  const title: string = `Verification Complete`;
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const verificationCode = searchParams.get('verified');
    if (!verificationCode) {
      setTimeout(() => {
        toast.error('Verification is missing.', {
          toastId: 'verification-missing',
        });
      }, 100);
      setTimeout(() => {
        router.push('/sign-up');
      }, 1000);
    }
  }, []);

  return (
    <div className="mainContentContainer phoneVerifiedContainer">
      <div className="imageAbsoluteContainer">
        <ResizedAdaptiveImage
          src="https://media.project-api.tv/api/image/3a75df20-0ba8-11ef-b259-afe90ff3ed2a/image.jpg"
          alt="Phone Verified Background Image"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="contentWrapper">
        <InlineModal className="landingModal">
          <ModalHeader data-testid="landingHeader" title={title} />
          <ModalContent data-testid="landingContent">
            <p>Phone number verification success! Spot on!</p>
            <p>You can safely close this window and finish registering.</p>
          </ModalContent>
        </InlineModal>
      </div>
    </div>
  );
}
