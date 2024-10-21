import React from 'react';

import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import MediaActionComponent from '../mediaActionComponent';

export interface MediaActionData {
  id: string;
  name: string;
  type: 'image' | 'video' | 'text';
  url?: string;
  text?: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  days?: string[];
}

export type TabType = 'image' | 'video' | 'text';

export default function EditMediaModal({
  open,
  setOpen,
  onSubmit,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: MediaActionData | null) => void;
  data?: MediaActionData;
}) {
  const [isError, setIsError] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<TabType>('image');
  const [formData, setFormData] = React.useState<MediaActionData | null>(null);
  React.useEffect(() => {
    if (!open) {
      setActiveTab('image');
      const editMediaModal = document.querySelector('.editMediaModal');
      if (editMediaModal) {
        const formInputs = editMediaModal.querySelectorAll(
          'input, textarea, select',
        );
        const formErrorContainers =
          editMediaModal.querySelectorAll('.errorContainer');

        formInputs.forEach((input) => {
          input.classList.remove('error');
        });

        formErrorContainers.forEach((errorContainer) => {
          errorContainer.classList.remove('active');
          errorContainer.removeAttribute('style');
        });
      }
    }
  }, [open]);

  return (
    <div>
      <Modal className="editMediaModal" open={open} setOpen={setOpen}>
        <ModalHeader title="Edit Media" description="Edit your media asset." />
        <ModalDivider />
        <div className="contentContainer">
          <MediaActionComponent
            open={open}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            data={data}
            setFormData={setFormData}
          />
        </div>
        <ModalDivider />
        <ModalFooter
          isError={isError}
          setIsError={setIsError}
          setOpen={setOpen}
          modalClass={`editMediaModal .${activeTab}Tab`}
          buttonText="Add Media"
          loadingText="Adding ..."
          successText="Media edited"
          errorText="Error"
          onSubmit={() => onSubmit(formData)}
          noIcon
        />
      </Modal>
    </div>
  );
}
