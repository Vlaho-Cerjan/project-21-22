import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {VenueAdminData, VenueDenyApproveData} from '@/types/venues';
import {useSession} from 'next-auth/react';
import dynamic from 'next/dynamic';
import React from 'react';
import {toast} from 'react-toastify';
import FormButton from '../../auth/common/formButton/formButton';
import Button from '../../common/button/button';
import ClearButton from '../../common/button/clearButton';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import VenueFields from './venueFields';

const ApproveModalLazy = dynamic(() => import('./approveModal'), {
  ssr: false,
});

const DenyModalLazy = dynamic(() => import('./denyModal'), {
  ssr: false,
});

const updateVenue = async (data: VenueAdminData | null) => {
  if (!data) return;

  const updateData = {
    ...data,
    venue_id: data.id,
    group_id: data.group_id || '',
  };

  const response: {
    success: boolean;
    data: VenueAdminData;
  } = await ClientApiRequest({
    uri: `admin/venue`,
    method: 'PUT',
    auth: true,
    data: updateData,
  });

  return response;
};

const approveVenue = async (data: VenueAdminData | null) => {
  if (!data) return;

  const update = await updateVenue(data);

  if (!update || !update.success) {
    toast.error('Error updating venue');
    return {
      success: false,
    };
  }

  const VenueData: VenueDenyApproveData = {
    venue_id: data.id,
    business_id: data.business_id,
  };

  const response: {
    success: boolean;
    data: {
      id: string;
    };
  } = await ClientApiRequest({
    uri: `admin/venue/approve`,
    method: 'PUT',
    auth: true,
    data: VenueData,
  });

  return response;
};

const denyVenue = async (data: VenueAdminData | null) => {
  if (!data) return;
  const update = await updateVenue(data);

  if (!update || !update.success) {
    toast.error('Error updating venue');
    return {
      success: false,
    };
  }

  const VenueData: VenueDenyApproveData = {
    venue_id: data.id,
    business_id: data.business_id,
    decline_reason: data.notes.decline_reason,
  };
  const response: {
    success: boolean;
    data: VenueAdminData;
  } = await ClientApiRequest({
    uri: `admin/venue/decline`,
    method: 'PUT',
    auth: true,
    data: VenueData,
  });

  return response;
};

const getData = async (id: string) => {
  const res = await fetch(`/admin/venues/items/${id}`);
  const data = await res.json();
  return data as {
    success: boolean;
    data: VenueAdminData;
  };
};

export default function EditVenueModal({
  businessId,
  open,
  setOpen,
  id,
  onSubmit,
}: {
  businessId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  onSubmit: (
    id: string,
    //data: VenueAdminData | null,
    reason: 'approve' | 'deny' | 'edit' | 'undo',
  ) => void;
}) {
  const [isError, setIsError] = React.useState(false);
  const [approveError, setApproveError] = React.useState(false);
  const [formData, setFormData] = React.useState<VenueAdminData>({
    id: '',
    business_id: '',
    zip: '',
    city: '',
    latitude: 0,
    address_1: '',
    address_2: '',
    longitude: 0,
    group_id: '',
    name: '',
    description: '',
    state_code: '',
    venue_type_id: '',
    country_code: 'US',
    notes: {
      venue_notes: '',
      decline_reason: '',
      declined_by: '',
      approved_by: '',
    },
    status: 0,
  });
  const {data} = useSession();
  const [approveModalOpen, setApproveModalOpen] = React.useState(false);
  const [modalDelay, setModalDelay] = React.useState(false);
  const [denyModalOpen, setDenyModalOpen] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setModalDelay(true);
    }, 1000);
  }, []);

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
      <Modal
        wrapperTestId="editVenueModal"
        className="editVenueModal"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader
          title="Edit Venue"
          description="Edit Pending Venue Details."
        />
        <ModalDivider />
        <div className="contentContainer">
          {formData && (
            <VenueFields
              id="editVenueFields"
              businessId={businessId}
              formData={formData}
              setFormData={setFormData as any}
            />
          )}
        </div>
        <ModalDivider />
        <ModalFooterContainer>
          <div className="footerButtonsContainer">
            <ClearButton
              data-testid="backEditVenueButton"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </ClearButton>
            {formData && (formData.status === 1 || formData.status === 3) && (
              <Button
                data-testid="denyEditVenueButton"
                onClick={async () => {
                  if (formData) {
                    if (formData.status !== 3) {
                      setDenyModalOpen(true);
                      return 'success';
                    } else {
                      setLoading(true);
                      const res = await updateVenue({
                        ...formData,
                        status: 1,
                      });

                      if (res && res.success) {
                        onSubmit(id, 'undo');
                        setLoading(false);
                        return 'success';
                      }
                      setLoading(false);
                      return 'error';
                    }
                  }
                  return 'error';
                }}
                className={formData && formData.status === 3 ? 'info' : 'error'}
              >
                {formData && formData.status === 3 ? 'Undo Deny' : 'Deny'}
              </Button>
            )}
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
                const res = await updateVenue({
                  ...formData,
                  business_id: businessId,
                });

                if (res && res.success) {
                  onSubmit(id, 'edit');
                  return 'success';
                }
                return 'error';
              }}
              noIcon
            />
            {formData && formData.status !== 2 && (
              <FormButton
                data-testid="approveEditVenueButton"
                isError={approveError}
                setIsError={setApproveError}
                // className={`${modalClass}`}
                modalClass="editVenueModal"
                text="Approve"
                buttonVariant="success"
                successText="Approved!"
                onClick={() => setApproveModalOpen(true)}
                noIcon
              />
            )}
          </div>
        </ModalFooterContainer>
      </Modal>
      {modalDelay && formData && (
        <>
          <ApproveModalLazy
            open={approveModalOpen}
            setOpen={setApproveModalOpen}
            onSubmit={async () => {
              const res = await approveVenue({
                ...formData,
                business_id: businessId,
                notes: {
                  ...formData.notes,
                  approved_by: data?.user?.id || '',
                },
              });
              if (res && res.success) {
                onSubmit(id, 'approve');
                setApproveModalOpen(false);
                return 'success';
              }
              return 'error';
            }}
            itemCount={1}
          />
          <DenyModalLazy
            open={denyModalOpen}
            setOpen={setDenyModalOpen}
            data={formData}
            setData={setFormData}
            onSubmit={async () => {
              const res = await denyVenue({
                ...formData,
                business_id: businessId,
                notes: {
                  ...formData.notes,
                  declined_by: data?.user?.id || '',
                },
              });
              if (res && res.success) {
                onSubmit(id, 'deny');
                setDenyModalOpen(false);
                return 'success';
              }
              return 'error';
            }}
            itemCount={1}
          />
        </>
      )}
    </div>
  );
}
