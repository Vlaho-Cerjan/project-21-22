'use client';

import {ResizedAdaptiveImage} from '@/src/lib/adaptiveImage';
import InlineModal from '../common/inlineModal/inlineModal';
import ModalContent from '../common/modal/modalContent';
import ModalHeader from '../common/modal/modalHeader';

export default function RegistrationComplete() {
  const title: string = `Registration Complete`;

  return (
    <div className="mainContentContainer registrationContainer">
      <div className="imageAbsoluteContainer">
        <ResizedAdaptiveImage
          src="https://media.project-api.tv/api/image/3a75df20-0ba8-11ef-b259-afe90ff3ed2a/image.jpg"
          alt="Registration Complete Background Image"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="contentWrapper">
        <InlineModal className="landingModal">
          <ModalHeader title={title} />
          <ModalContent>
            <p>Registration has been completed successfully.</p>
            <p>
              You will recieve an email once your account has been verified.
            </p>
          </ModalContent>
        </InlineModal>
      </div>
    </div>
  );
}
