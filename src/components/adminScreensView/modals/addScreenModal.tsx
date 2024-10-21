import type {CreateAdminScreen} from '@/types/screens';
import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import CreateScreenFields from './createScreenFields';

export default function AddScreenModal({
  businessId,
  open,
  setOpen,
  onSubmit,
}: {
  businessId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: CreateAdminScreen | null) => Promise<'error' | 'success'>;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<CreateAdminScreen>({
    venue_id: '',
    type: 0,
    unique_identifier: '',
    name: '',
    notes: {
      screen_notes: '',
    },
  });

  React.useEffect(() => {
    if (!open) {
      const addScreenModal = document.querySelector('.addScreenModal');
      if (addScreenModal) {
        const formInputs = addScreenModal.querySelectorAll(
          'input, textarea, select',
        );
        const formErrorContainers =
          addScreenModal.querySelectorAll('.errorContainer');

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
      <Modal className="addScreenModal" open={open} setOpen={setOpen}>
        <ModalHeader title="Add Screen" description="Add New Screen." />
        <ModalDivider />
        <div className="contentContainer">
          <CreateScreenFields
            businessId={businessId}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <ModalDivider />
        <ModalFooter
          backDataTestId="backAddScreenButton"
          submitDataTestId="submitAddScreenButton"
          isError={isError}
          setIsError={setIsError}
          setOpen={setOpen}
          modalClass="addScreenModal"
          buttonText="Create Screen"
          noIcon
          onSubmit={async () => {
            const res = await onSubmit(formData);

            return res;
          }}
        />
      </Modal>
    </div>
  );
}
