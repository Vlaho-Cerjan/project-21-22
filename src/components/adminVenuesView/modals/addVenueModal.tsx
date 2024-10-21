import type {VenueAdminCreateData} from '@/types/venues';
import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import VenueFields from './venueFields';

export default function AddVenueModal({
  businessId,
  open,
  setOpen,
  onSubmit,
}: {
  businessId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: VenueAdminCreateData | null) => Promise<'error' | 'success'>;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<VenueAdminCreateData | null>({
    business_id: '',
    zip: '',
    city: '',
    latitude: 0,
    address_1: '',
    address_2: '',
    longitude: 0,
    name: '',
    description: '',
    state_code: '',
    venue_type_id: '',
    country_code: 'US',
    notes: {
      venue_notes: '',
    },
  });

  React.useEffect(() => {
    if (!open) {
      const addVenueModal = document.querySelector('.addVenueModal');
      if (addVenueModal) {
        const formInputs = addVenueModal.querySelectorAll(
          'input, textarea, select',
        );
        const formErrorContainers =
          addVenueModal.querySelectorAll('.errorContainer');

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
      <Modal className="addVenueModal" open={open} setOpen={setOpen}>
        <ModalHeader title="Add Venue" description="Add New Venue." />
        <ModalDivider />
        <div className="contentContainer">
          <VenueFields
            id="addVenueFields"
            businessId={businessId}
            formData={formData}
            setFormData={setFormData}
          />
        </div>
        <ModalDivider />
        <ModalFooter
          backDataTestId="backAddVenueButton"
          submitDataTestId="submitAddVenueButton"
          isError={isError}
          setIsError={setIsError}
          setOpen={setOpen}
          modalClass="addVenueModal"
          buttonText="Create Venue"
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
