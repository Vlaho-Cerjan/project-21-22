import {useAppSelector} from '@/src/hooks';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {OrdersCreateData} from '@/types/orders';
import {VenueUserCreateData} from '@/types/venues';
import dynamic from 'next/dynamic';
import React from 'react';

const OrderModalLazy = dynamic(
  () => import('../../orders/orderModal/orderModal'),
  {
    ssr: false,
  },
);

const CreateVenueModalLazy = dynamic(
  () => import('../../venuesView/modals/addVenueModal'),
  {
    ssr: false,
  },
);

const createVenue = async (data: VenueUserCreateData) => {
  const res = await ClientApiRequest({
    uri: 'api/venue',
    method: 'POST',
    data,
    auth: true,
  });

  return res as {success: boolean; data: {id: string}};
};

const createOrder = async (data: OrdersCreateData) => {
  const res = await ClientApiRequest({
    uri: 'api/order',
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
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    success: boolean;
    data: {
      id: string;
    };
  }) => void;
}) {
  //const [isError, setIsError] = React.useState(false);
  const {inventory} = useAppSelector((state) => state.enum);
  const {setLoading} = React.useContext(LoadingContext);
  //const [formData, setFormData] = React.useState<VenueUserData | null>(null);

  const [shippingData, setShippingData] = React.useState<OrdersCreateData>({
    product_id: '',
    quantity: 1,
    venue_id: '',
    shipping_address_1: '',
    shipping_address_2: '',
    shipping_city: '',
    shipping_state_code: '',
    shipping_country_code: '',
    shipping_zip: '',
  });

  const [venueCreateOpen, setVenueCreateOpen] = React.useState(false);
  const [venueCreated, setVenueCreated] = React.useState(false);
  const onVenueCreate = async (data: VenueUserCreateData | null) => {
    if (!data) return 'error';
    setLoading(true);
    const res = await createVenue(data);
    if (res.success) {
      setShippingData({
        ...shippingData,
        venue_id: res.data.id,
      });
      setVenueCreated(true);
      setLoading(false);
      return 'success';
    }
    setLoading(false);
    return 'error';
  };

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
      setShippingData({
        product_id: '',
        quantity: 1,
        venue_id: '',
        shipping_address_1: '',
        shipping_address_2: '',
        shipping_city: '',
        shipping_state_code: '',
        shipping_country_code: '',
        shipping_zip: '',
      });
    }
  }, [open]);

  return (
    <div>
      <OrderModalLazy
        open={open}
        setOpen={setOpen}
        counter={shippingData?.quantity || 0}
        setCounter={(value: number) => {
          if (!shippingData) return;
          setShippingData({
            ...shippingData,
            quantity: value,
          });
        }}
        setVenueCreateOpen={setVenueCreateOpen}
        setVenueCreated={setVenueCreated}
        venueCreated={venueCreated}
        verifyOrderFunction={async () => {
          setLoading(true);
          if (!shippingData) return;
          //console.log('shippingData', shippingData);
          const res = await createOrder(shippingData);
          onSubmit(res);
          setLoading(false);
        }}
        //venueData={formData}
        //setVenueData={setFormData}
        shippingData={shippingData}
        setShippingData={setShippingData}
      />
      <CreateVenueModalLazy
        open={venueCreateOpen}
        setOpen={setVenueCreateOpen}
        onSubmit={onVenueCreate}
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
