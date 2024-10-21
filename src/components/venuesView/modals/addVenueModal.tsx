import type {VenueUserCreateData} from '@/types/venues';
import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import VenueFields from './venueFields';

export default function AddVenueModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: VenueUserCreateData | null) => Promise<'success' | 'error'>;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<VenueUserCreateData>({
    name: '',
    description: '',
    zip: '',
    city: '',
    latitude: 0,
    address_1: '',
    address_2: '',
    longitude: 0,
    state_code: '',
    venue_type_id: '',
    country_code: 'US',
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
      <Modal
        wrapperTestId="addVenueModal"
        className="addVenueModal"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader title="Add Venue" description="Add New Venue." />
        <ModalDivider />
        <div className="contentContainer">
          <VenueFields
            id="addVenueModal"
            formData={formData}
            setFormData={setFormData as any}
          />
        </div>
        <ModalDivider />
        <ModalFooter
          backDataTestId="backVenueButton"
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
