import type {BusinessData} from '@/types/businesses';
import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import BusinessFields from './businessFields';

export default function AddBusinessModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: BusinessData | null) => Promise<'error' | 'success'>;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<BusinessData | null>({
    id: '',
    created_at: '',
    updated_at: '',
    zip: '',
    city: '',
    address_1: '',
    latitude: 0,
    longitude: 0,
    address_2: '',
    state_code: '',
    business_type_id: '',
    country_code: 'US',
    phone_number: '',
    business_name: '',
  });

  React.useEffect(() => {
    if (!open) {
      const addBusinessModal = document.querySelector('.addBusinessModal');
      if (addBusinessModal) {
        const formInputs = addBusinessModal.querySelectorAll(
          'input, textarea, select',
        );
        const formErrorContainers =
          addBusinessModal.querySelectorAll('.errorContainer');

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
      <Modal className="addBusinessModal" open={open} setOpen={setOpen}>
        <ModalHeader title="Add Business" description="Add New Business." />
        <ModalDivider />
        <div className="contentContainer">
          <BusinessFields formData={formData} setFormData={setFormData} />
        </div>
        <ModalDivider />
        <ModalFooter
          backDataTestId="backAddRegButton"
          submitDataTestId="submitAddRegButton"
          isError={isError}
          setIsError={setIsError}
          setOpen={setOpen}
          modalClass="addBusinessModal"
          buttonText="Create Business"
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
