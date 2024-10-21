import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {BusinessData, BusinessUpdateData} from '@/types/businesses';
import React from 'react';
import FormButton from '../../auth/common/formButton/formButton';
import ClearButton from '../../common/button/clearButton';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import BusinessFields from './businessFields';

const updateReg = async (data: BusinessData | null) => {
  if (!data) return;
  const regData: BusinessUpdateData = {
    ...data,
    business_id: data.id,
  };

  // @ts-expect-error - id is not in BusinessUpdateData
  delete regData.id;

  const response: {
    success: boolean;
    data: {
      id: string;
    };
  } = await ClientApiRequest({
    uri: `admin/business`,
    method: 'PUT',
    auth: true,
    data: regData,
  });

  return response;
};

const getData = async (id: string) => {
  const res = await fetch(`/admin/businesses/items/${id}`);
  const data = await res.json();
  return data as {
    success: boolean;
    data: BusinessData;
  };
};

export default function EditBusinessModal({
  open,
  setOpen,
  id,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  onSubmit: (
    id: string, // data: BusinessData | null
  ) => void;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<BusinessData | null>(null);

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
      <Modal
        wrapperTestId="editBusinessModal"
        className="editBusinessModal"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader
          title="Edit Business"
          description="Edit Pending Business Details."
        />
        <ModalDivider />
        <div className="contentContainer">
          {formData && (
            <BusinessFields formData={formData} setFormData={setFormData} />
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
              data-testid="submitEditRegButton"
              isError={isError}
              setIsError={setIsError}
              // className={`${modalClass}`}
              modalClass="editBusinessModal"
              text="Update"
              successText="Updated!"
              onClick={async () => {
                const res = await updateReg(formData);

                if (res && res.success) {
                  onSubmit(id);
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
