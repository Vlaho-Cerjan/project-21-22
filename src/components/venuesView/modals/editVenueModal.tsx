import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {VenueUserData} from '@/types/venues';
import {useSession} from 'next-auth/react';
import React from 'react';
import FormButton from '../../auth/common/formButton/formButton';
import ClearButton from '../../common/button/clearButton';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import EditVenueFields from './editVenueFields';

const updateReg = async (data: VenueUserData | null) => {
  if (!data) return;
  const regData = {
    venue_id: data.id,
    name: data.name,
    description: data.description,
  };

  // @ts-expect-error - id is not in VenueUserData
  delete regData.id;

  const response: {
    success: boolean;
    data: {
      id: string;
    };
  } = await ClientApiRequest({
    uri: `api/venue`,
    method: 'PUT',
    auth: true,
    data: regData,
  });

  return response;
};

const getData = async (id: string) => {
  const res = await fetch(`/resources/venues/items/${id}`);
  const data = await res.json();
  return data as {
    success: boolean;
    data: VenueUserData;
  };
};

export default function EditVenueModal({
  open,
  setOpen,
  id,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  onSubmit: (
    id: string, // data: VenueList | null
    reason: 'approve' | 'deny' | 'edit' | 'undo',
  ) => void;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<VenueUserData>({
    id: '',
    name: '',
    description: '',
    address_1: '',
    address_2: '',
    city: '',
    state_code: '',
    zip: '',
    country_code: '',
    latitude: 0,
    longitude: 0,
    status: 0,
    venue_type_id: '',
    venue_id: '',
    group_id: '',
    created_at: '',
    updated_at: '',
  });
  const {data} = useSession();
  React.useEffect(() => {
    if (data) {
      /*
      setFormData((prev) => {
        if (prev) {
          return {
            ...prev,
            converted_by: data.user.id,
          };
        }
        return {
          converted_by: data.user.id,
          id: '',
          business_name: '',
          email: '',
          phone_number: '',
          mobile_number: '',
          first_name: '',
          last_name: '',
          job_title: '',
          address_1: '',
          address_2: '',
          city: '',
          zip: '',
          state_code: '',
          country_code: '',
          latitude: 0,
          longitude: 0,
          status: 0,
          business_type_id: '',
          created_at: '',
          updated_at: '',
          dma_top_20: 0,
          skip_email: false,
          business_id: '',
          website: '',
          do_not_ship_player: false,
          venue_notes: '',
          decline_reason: '',
        };
      });
      */
    }
  }, [data]);

  const {setLoading} = React.useContext(LoadingContext);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id) {
        const res = await getData(id);
        if (res.success)
          setFormData({
            ...res.data,
          });
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

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
      <Modal className="editVenueModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title="Edit Venue"
          description="Edit Pending Venue Details."
        />
        <ModalDivider />
        <div className="contentContainer">
          {formData && (
            <EditVenueFields
              formData={formData}
              setFormData={setFormData as any}
            />
          )}
        </div>
        <ModalDivider />
        <ModalFooterContainer>
          <div className="footerButtonsContainer">
            <ClearButton
              data-testid="backEditRegButton"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </ClearButton>
          </div>
          <div className="footerButtonsContainer">
            <FormButton
              data-testid="submitEditVenueButton"
              isError={isError}
              setIsError={setIsError}
              // className={`${modalClass}`}
              modalClass="editVenueModal"
              text="Update"
              successText="Updated!"
              onClick={async () => {
                const res = await updateReg(formData);

                if (res && res.success) {
                  onSubmit(id, 'edit');
                }
              }}
              noIcon
            />
          </div>
        </ModalFooterContainer>
      </Modal>
    </div>
  );
}
