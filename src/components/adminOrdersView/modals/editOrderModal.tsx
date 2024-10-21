import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {
  OrdersAdminData,
  OrdersAdminUpdateData,
  OrdersDeclineData,
} from '@/types/orders';
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
import OrderFields from './orderFields';

const ApproveModalLazy = dynamic(() => import('./approveModal'), {
  ssr: false,
});

const DenyModalLazy = dynamic(() => import('./denyModal'), {
  ssr: false,
});

const updateOrder = async (data: OrdersAdminUpdateData | null) => {
  if (!data) return;

  const response: {
    success: boolean;
    data: {
      id: string;
    };
  } = await ClientApiRequest({
    uri: `admin/order`,
    method: 'PUT',
    auth: true,
    data,
  });

  return response;
};

const approveOrder = async (data: OrdersAdminUpdateData | null) => {
  if (!data) return;

  const update = await updateOrder({
    ...data,
  });

  if (!update || !update.success) {
    toast.error('Error updating order');
    return {
      success: false,
    };
  }

  const response: {
    success: boolean;
    data: {
      id: string;
    };
  } = await ClientApiRequest({
    uri: `admin/order/approve`,
    method: 'PUT',
    auth: true,
    data: {
      order_id: data.order_id,
    },
  });

  return response;
};

const denyOrder = async (
  data:
    | (OrdersAdminUpdateData & {
        notes: {
          decline_reason: string;
        };
      })
    | null,
) => {
  if (!data) return;
  const update = await updateOrder({
    ...data,
  });

  if (!update || !update.success) {
    toast.error('Error updating order');
    return {
      success: false,
    };
  }

  const orderData: OrdersDeclineData = {
    order_id: data.order_id,
    notes: data.notes,
  };
  const response: {
    success: boolean;
    data: null;
  } = await ClientApiRequest({
    uri: `admin/order/decline`,
    method: 'PUT',
    auth: true,
    data: orderData,
  });

  return response;
};

const getData = async (id: string) => {
  const res = await fetch(`/admin/businesses/orders/items/${id}`);
  const data = await res.json();
  return data as {
    success: boolean;
    data: OrdersAdminData;
  };
};

export default function EditOrderModal({
  open,
  setOpen,
  id,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: string;
  onSubmit: (
    id: string, // data: OrderList | null
    reason: 'approve' | 'deny' | 'edit' | 'undo',
  ) => void;
}) {
  const [isError, setIsError] = React.useState(false);
  const [approveError, setApproveError] = React.useState(false);
  const [formData, setFormData] = React.useState<
    | (OrdersAdminUpdateData & {
        notes: {
          order_notes: string;
          decline_reason: string;
        };
      })
    | null
  >(null);
  const [oldAddress, setOldAddress] = React.useState<{
    shipping_address_1: string;
    shipping_address_2: string;
    shipping_city: string;
    shipping_state_code: string;
    shipping_country_code: string;
    shipping_zip: string;
  } | null>(null);
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
        if (res.success) {
          setFormData({
            ...res.data,
            order_id: res.data.id,
            notes: {
              order_notes: formData?.notes.order_notes || '',
              decline_reason: formData?.notes.decline_reason || '',
            },
          });
          setOldAddress({
            shipping_address_1: res.data.shipping_address_1,
            shipping_address_2: res.data.shipping_address_2,
            shipping_city: res.data.shipping_city,
            shipping_state_code: res.data.shipping_state_code,
            shipping_country_code: res.data.shipping_country_code,
            shipping_zip: res.data.shipping_zip,
          });
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [id]);

  React.useEffect(() => {
    if (!open) {
      const addOrderModal = document.querySelector('.addOrderModal');
      if (addOrderModal) {
        const formInputs = addOrderModal.querySelectorAll(
          'input, textarea, select',
        );
        const formErrorContainers =
          addOrderModal.querySelectorAll('.errorContainer');

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
        wrapperTestId="editOrderModal"
        className="editOrderModal"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader
          title="Edit Order"
          description="Edit Pending Order Details."
        />
        <ModalDivider />
        <div className="contentContainer">
          {formData && (
            <OrderFields
              businessId={formData.business_id}
              oldAddress={oldAddress}
              formData={formData}
              setFormData={setFormData}
            />
          )}
        </div>
        <ModalDivider />
        <ModalFooterContainer>
          <div className="footerButtonsContainer">
            <ClearButton
              data-testid="backEditOrderButton"
              onClick={() => {
                setOpen(false);
              }}
            >
              Cancel
            </ClearButton>
            <Button
              data-testid="denyEditOrderButton"
              onClick={async () => {
                if (formData) {
                  if (formData.status !== 3) setDenyModalOpen(true);
                  else {
                    setLoading(true);
                    const res = await updateOrder({
                      ...formData,
                      status: 1,
                    });

                    if (res && res.success) {
                      onSubmit(id, 'undo');
                    }
                    setLoading(false);
                  }
                }
              }}
              className={formData && formData.status === 3 ? 'info' : 'error'}
            >
              {formData && formData.status === 3 ? 'Undo Deny' : 'Deny'}
            </Button>
          </div>
          <div className="footerButtonsContainer">
            <FormButton
              data-testid="submitEditOrderButton"
              isError={isError}
              setIsError={setIsError}
              // className={`${modalClass}`}
              modalClass="editOrderModal"
              text="Update"
              successText="Updated!"
              onClick={async () => {
                const res = await updateOrder({
                  ...formData,
                } as OrdersAdminUpdateData);

                if (res && res.success) {
                  onSubmit(id, 'edit');
                }
              }}
              noIcon
            />
            {formData && formData.status !== 3 && (
              <FormButton
                data-testid="approveEditOrderButton"
                isError={approveError}
                setIsError={setApproveError}
                // className={`${modalClass}`}
                modalClass="editOrderModal"
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
              const res = await approveOrder({
                ...formData,
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
              const res = await denyOrder({
                ...formData,
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
