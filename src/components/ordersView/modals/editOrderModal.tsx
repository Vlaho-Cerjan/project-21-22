import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import {OrdersListData, OrdersUpdateData} from '@/types/orders';
import React from 'react';
import FormButton from '../../auth/common/formButton/formButton';
import ClearButton from '../../common/button/clearButton';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import {ModalFooterContainer} from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import OrderFields from './orderFields';

const updateOrder = async (data: OrdersUpdateData | null) => {
  if (!data) return;
  const regData = {
    order_id: data.order_id,
    //status: data.status,
    //product_id: data.product_id,
    venue_id: data.venue_id,
    quantity: data.quantity,
    shipping_address_1: data.shipping_address_1,
    shipping_address_2: data.shipping_address_2,
    shipping_city: data.shipping_city,
    shipping_state_code: data.shipping_state_code,
    shipping_country_code: data.shipping_country_code,
    shipping_zip: data.shipping_zip,
  };

  const response: {
    success: boolean;
    data: OrdersListData;
  } = await ClientApiRequest({
    uri: `api/order`,
    method: 'PUT',
    auth: true,
    data: regData,
  });

  return response;
};

const getData = async (id: string) => {
  const res = await fetch(`/resources/orders/items/${id}`);
  const data = await res.json();
  return data as {
    success: boolean;
    data: OrdersUpdateData;
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
    id: string, // data: OrdersListData | null
    reason: 'approve' | 'deny' | 'edit' | 'undo',
  ) => void;
}) {
  const [isError, setIsError] = React.useState(false);
  const [formData, setFormData] = React.useState<OrdersUpdateData | null>(null);
  const [oldAddress, setOldAddress] = React.useState<{
    shipping_address_1: string;
    shipping_address_2: string;
    shipping_city: string;
    shipping_state_code: string;
    shipping_country_code: string;
    shipping_zip: string;
  } | null>(null);
  const {setLoading} = React.useContext(LoadingContext);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id) {
        const res = await getData(id);
        if (res.success) {
          setFormData({
            ...res.data,
            order_id: id,
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
          <OrderFields
            oldAddress={oldAddress}
            formData={formData}
            setFormData={setFormData}
          />
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
                const res = await updateOrder(formData);

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
