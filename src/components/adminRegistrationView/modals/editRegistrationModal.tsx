import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {
  RegistrationDenyApproveData,
  RegistrationList,
  RegistrationUpdateData,
} from '@/types/registrations';
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
import RegistrationFields from './registrationFields';

const ApproveModalLazy = dynamic(() => import('./approveModal'), {
  ssr: false,
});

const DenyModalLazy = dynamic(() => import('./denyModal'), {
  ssr: false,
});

const updateReg = async (data: RegistrationList | null) => {
  if (!data) return;
  const regData: RegistrationUpdateData = {
    registration_id: data.id,
    status: data.status,
    email: data.email,
    phone_number: data.phone_number,
    mobile_number: data.mobile_number,
    first_name: data.first_name,
    last_name: data.last_name,
    business_name: data.business_name,
    address_1: data.address_1,
    address_2: data.address_2,
    city: data.city,
    state_code: data.state_code,
    country_code: data.country_code,
    zip: data.zip,
    latitude: data.latitude,
    longitude: data.longitude,
    business_type_id: data.business_type_id,
    job_title: data.job_title,
    registration_notes: {
      business_id: data.notes.business_id || '',
      approved_by: data.notes.approved_by || '',
      declined_by: data.notes.declined_by || '',
      registration_notes: data.notes.registration_notes || '',
      decline_reason: data.notes.decline_reason || '',
      dma_top_20: data.notes.dma_top_20 || 0,
      do_not_ship_player: data.notes.do_not_ship_player || false,
      skip_email: data.notes.skip_email || false,
    },
  };

  const response: {
    success: boolean;
    data: RegistrationList;
  } = await ClientApiRequest({
    uri: `admin/registration`,
    method: 'PUT',
    auth: true,
    data: regData,
  });

  return response;
};

const approveReg = async (data: RegistrationList | null) => {
  if (!data) return;

  const update = await updateReg({
    ...data,
  });

  if (!update || !update.success) {
    toast.error('Error updating registration');
    return {
      success: false,
    };
  }

  const regData: RegistrationDenyApproveData = {
    registration_id: data.id,
    notes: {
      business_id: data.notes.business_id || '',
      approved_by: data.notes.approved_by || '',
      registration_notes: data.notes.registration_notes || '',
      decline_reason: data.notes.decline_reason || '',
      dma_top_20: data.notes.dma_top_20 || 0,
      do_not_ship_player: data.notes.do_not_ship_player || false,
      skip_email: data.notes.skip_email || false,
    },
  };

  const response: {
    success: boolean;
    data: {
      id: string;
    };
  } = await ClientApiRequest({
    uri: `admin/registration/approve`,
    method: 'POST',
    auth: true,
    data: regData,
  });

  return response;
};

const denyReg = async (data: RegistrationList | null) => {
  if (!data) return;
  const update = await updateReg({
    ...data,
  });

  if (!update || !update.success) {
    toast.error('Error updating registration');
    return {
      success: false,
    };
  }

  const regData: RegistrationDenyApproveData = {
    registration_id: data.id,
    notes: {
      business_id: data.notes.business_id || '',
      declined_by: data.notes.declined_by || '',
      registration_notes: data.notes.registration_notes || '',
      decline_reason: data.notes.decline_reason || '',
      dma_top_20: data.notes.dma_top_20 || 0,
      do_not_ship_player: data.notes.do_not_ship_player || false,
      skip_email: data.notes.skip_email || false,
    },
  };
  const response: {
    success: boolean;
    data: RegistrationList;
  } = await ClientApiRequest({
    uri: `admin/registration/decline`,
    method: 'POST',
    auth: true,
    data: regData,
  });

  return response;
};

const getData = async (id: string) => {
  const res = await fetch(`/admin/registrations/items/${id}`);
  const data = await res.json();
  return data as {
    success: boolean;
    data: RegistrationList;
  };
};

export default function EditRegistrationModal({
  open,
  setOpen,
  id,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  onSubmit: (
    id: string, // data: RegistrationList | null
    reason: 'approve' | 'deny' | 'edit' | 'undo',
  ) => void;
}) {
  const [isError, setIsError] = React.useState(false);
  const [approveError, setApproveError] = React.useState(false);
  const [formData, setFormData] = React.useState<RegistrationList | null>(null);
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
      <Modal
        wrapperTestId="editRegistrationModal"
        className="editRegistrationModal"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader
          title="Edit Registration"
          description="Edit Pending Registration Details."
        />
        <ModalDivider />
        <div className="contentContainer">
          {formData && (
            <RegistrationFields formData={formData} setFormData={setFormData} />
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
            <Button
              data-testid="denyEditRegButton"
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
              modalClass="editRegistrationModal"
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
                modalClass="editRegistrationModal"
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
              const res = await approveReg({
                ...formData,
                notes: {
                  ...formData.notes,
                  approved_by: data?.user?.id || '',
                },
              });
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
              const res = await denyReg({
                ...formData,
                notes: {
                  ...formData.notes,
                  declined_by: data?.user?.id || '',
                },
              });
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
