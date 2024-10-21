import {useAppSelector} from '@/src/hooks';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {OrdersAdminCreateData} from '@/types/orders';
import dynamic from 'next/dynamic';
import React from 'react';

const OrderModalLazy = dynamic(
  () => import('../../adminOrders/orderModal/orderModal'),
  {
    ssr: false,
  },
);

const createOrder = async (data: OrdersAdminCreateData) => {
  const res = await ClientApiRequest({
    uri: 'admin/order',
    method: 'POST',
    data,
    auth: true,
  });

  return res as {success: boolean; data: {id: string}};
};

export default function AddOrderModal({
  open,
  setOpen,
  onSubmit,
  businessId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    success: boolean;
    data: {
      id: string;
    };
  }) => void;
  businessId: string;
}) {
  //const [isError, setIsError] = React.useState(false);
  const {inventory} = useAppSelector((state) => state.enum);
  const {setLoading} = React.useContext(LoadingContext);
  //const [formData, setFormData] = React.useState<VenueUserData | null>(null);

  const [shippingData, setShippingData] = React.useState<OrdersAdminCreateData>(
    {
      business_id: '',
      product_id: '',
      quantity: 0,
      venue_id: '',
      shipping_address_1: '',
      shipping_address_2: '',
      shipping_city: '',
      shipping_state_code: '',
      shipping_country_code: '',
      shipping_zip: '',
      notes: {
        order_notes: '',
      },
    },
  );

  React.useEffect(() => {
    if (inventory) {
      const product = inventory[0];
      if (!product) return;
      setShippingData({
        ...shippingData,
        product_id: product.id,
      });
    }
  }, [inventory]);

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
      <OrderModalLazy
        businessId={businessId}
        open={open}
        setOpen={setOpen}
        counter={shippingData?.quantity || 1}
        setCounter={(value: number) => {
          if (!shippingData) return;
          setShippingData({
            ...shippingData,
            quantity: value,
          });
        }}
        verifyOrderFunction={async () => {
          setLoading(true);
          if (!shippingData) return;
          //console.log('shippingData', shippingData);
          const res = await createOrder({
            ...shippingData,
            business_id: businessId,
          });
          onSubmit(res);
          setLoading(false);
        }}
        //venueData={formData}
        //setVenueData={setFormData}
        shippingData={shippingData}
        setShippingData={setShippingData}
      />
      {/*
      <Modal className="addOrderModal" open={open} setOpen={setOpen}>
        <ModalHeader title="Add Order" description="Add New Order." />
        <ModalDivider />
        <div className="contentContainer">
          <OrderFields formData={formData} setFormData={setFormData} />
        </div>
        <ModalDivider />
        <ModalFooter
          backDataTestId="backAddRegButton"
          submitDataTestId="submitAddRegButton"
          isError={isError}
          setIsError={setIsError}
          setOpen={setOpen}
          modalClass="addOrderModal"
          buttonText="Create Order"
          noIcon
          onSubmit={() => {
            onSubmit(formData);
          }}
        />
      </Modal>
      */}
    </div>
  );
}
