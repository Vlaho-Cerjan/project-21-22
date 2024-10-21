import type {RegistrationList} from '@/types/registrations';
import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import RegistrationFields from './registrationFields';

export default function AddRegistrationModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: RegistrationList | null) => Promise<'error' | 'success'>;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<RegistrationList | null>({
    id: '',
    created_at: '',
    updated_at: '',
    status: 0,
    zip: '',
    city: '',
    email: '',
    latitude: 0,
    address_1: '',
    address_2: '',
    last_name: '',
    longitude: 0,
    first_name: '',
    state_code: '',
    business_type_id: '',
    country_code: 'US',
    phone_number: '',
    mobile_number: '',
    business_name: '',
    job_title: '',
    notes: {
      dma_top_20: 0,
      skip_email: false,
      business_id: '',
      approved_by: '',
      declined_by: '',
      do_not_ship_player: false,
      registration_notes: '',
      decline_reason: '',
    },
  });

  React.useEffect(() => {
    if (!open) {
      const addRegistrationModal = document.querySelector(
        '.addRegistrationModal',
      );
      if (addRegistrationModal) {
        const formInputs = addRegistrationModal.querySelectorAll(
          'input, textarea, select',
        );
        const formErrorContainers =
          addRegistrationModal.querySelectorAll('.errorContainer');

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
      <Modal className="addRegistrationModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title="Add Registration"
          description="Add New Registration."
        />
        <ModalDivider />
        <div className="contentContainer">
          <RegistrationFields formData={formData} setFormData={setFormData} />
        </div>
        <ModalDivider />
        <ModalFooter
          backDataTestId="backAddRegButton"
          submitDataTestId="submitAddRegButton"
          isError={isError}
          setIsError={setIsError}
          setOpen={setOpen}
          modalClass="addRegistrationModal"
          buttonText="Create Registration"
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
