import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {VenueAdminData} from '@/types/venues';
import {useSession} from 'next-auth/react';
import dynamic from 'next/dynamic';
import React from 'react';
import FormButton from '../../auth/common/formButton/formButton';
import Button from '../../common/button/button';
import ClearButton from '../../common/button/clearButton';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';

const ApproveModalLazy = dynamic(() => import('./approveModal'), {
  ssr: false,
});

const DenyModalLazy = dynamic(() => import('./denyModal'), {
  ssr: false,
});

const updateReg = async (data: VenueAdminData | null) => {
  if (!data) return;
  const regData: VenueAdminData = {
    ...data,
    venue_id: data.id || '',
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

const approveReg = async (data: VenueAdminData | null) => {
  if (!data) return;
  const regData: VenueAdminData = {
    ...data,
  };

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

  if (response.success) {
    const convert: {
      success: boolean;
    } = await ClientApiRequest({
      uri: 'api/venue/convert',
      method: 'POST',
      auth: true,
      data: {
        id: data.id,
      },
    });

    return convert;
  }

  return response;
};

const denyReg = async (data: VenueAdminData | null) => {
  if (!data) return;
  const regData: VenueAdminData = {
    ...data,
  };
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
    data: VenueAdminData;
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
  const [approveError, setApproveError] = React.useState(false);
  const [formData, setFormData] = React.useState<VenueAdminData | null>(null);
  const {data} = useSession();
  const [approveModalOpen, setApproveModalOpen] = React.useState(false);
  const [modalDelay, setModalDelay] = React.useState(false);
  const [denyModalOpen, setDenyModalOpen] = React.useState(false);

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
      <Modal className="editVenueModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title="Edit Venue"
          description="Edit Pending Venue Details."
        />
        <ModalDivider />
        <div className="contentContainer">
          {
            formData && true
            // <VenueFields formData={formData} setFormData={setFormData} />
          }
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
            <Button
              data-tesid="denyEditRegButton"
              onClick={async () => {
                if (formData) {
                  if (formData.status !== 4) setDenyModalOpen(true);
                  else {
                    setLoading(true);
                    const res = await updateReg({
                      ...formData,
                      status: 2,
                    });

                    if (res && res.success) {
                      onSubmit(id, 'undo');
                    }
                    setLoading(false);
                  }
                }
              }}
              className={formData && formData.status === 4 ? 'info' : 'error'}
            >
              {formData && formData.status === 4 ? 'Undo Deny' : 'Deny'}
            </Button>
          </div>
          <div className="footerButtonsContainer">
            <FormButton
              data-testid="submitEditRegButton"
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
            {formData && formData.status !== 4 && (
              <FormButton
                data-testid="approveEditRegButton"
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
              const res = await approveReg(formData);
              if (res && res.success) {
                onSubmit(id, 'approve');
                setApproveModalOpen(false);
              }
            }}
            itemCount={1}
          />
          <DenyModalLazy
            open={denyModalOpen}
            setOpen={setDenyModalOpen}
            data={formData}
            setData={setFormData}
            onSubmit={async () => {
              const res = await denyReg(formData);
              if (res && res.success) {
                onSubmit(id, 'deny');
                setDenyModalOpen(false);
              }
            }}
            itemCount={1}
          />
        </>
      )}
    </div>
  );
}
