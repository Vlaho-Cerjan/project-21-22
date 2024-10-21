import React from 'react';

import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import MediaActionComponent from '../mediaActionComponent';
import type {MediaActionData} from './editMediaModal';

export type TabType = 'image' | 'video' | 'text';

export default function AddMediaModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: MediaActionData | null) => void;
}) {
  const [isError, setIsError] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabType>('image');
  const [formData, setFormData] = React.useState<MediaActionData | null>(null);

  React.useEffect(() => {
    if (!open) {
      setActiveTab('image');
      const addMediaModal = document.querySelector('.addMediaModal');
      if (addMediaModal) {
        const formInputs = addMediaModal.querySelectorAll(
          'input, textarea, select',
        );
        const formErrorContainers =
          addMediaModal.querySelectorAll('.errorContainer');

        formInputs.forEach((input) => {
          input.classList.remove('error');
        });

        formErrorContainers.forEach((errorContainer) => {
          errorContainer.classList.remove('active');
          errorContainer?.removeAttribute('style');
        });
      }
    }
  }, [open]);

  return (
    <div>
      <Modal className="addMediaModal" open={open} setOpen={setOpen}>
        <ModalHeader title="Add Media" description="Add new media asset." />
        <ModalDivider />
        <div className="contentContainer">
          <MediaActionComponent
            open={open}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setFormData={setFormData}
          />
        </div>
        <ModalDivider />
        <ModalFooter
          isError={isError}
          setIsError={setIsError}
          setOpen={setOpen}
          modalClass={`addMediaModal .${activeTab}Tab`}
          buttonText="Add Media"
          loadingText="Adding ..."
          successText="Media added"
          errorText="Error"
          onSubmit={() => onSubmit(formData)}
          noIcon
        />
      </Modal>
    </div>
  );
}
