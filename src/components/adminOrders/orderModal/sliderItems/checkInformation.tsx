import Text from '@/src/components/common/text/text';

import {OrdersAdminCreateData} from '@/types/orders';
import {VenueAdminData} from '@/types/venues';
import OrderTitle from '../../orderTitle/orderTitle';

export default function CheckInformation({
  counter,
  shippingData,
  //billingData,
  venueData,
}: {
  counter: number;
  shippingData: OrdersAdminCreateData;
  //billingData: OrdersAdminCreateData;
  venueData: VenueAdminData | null;
}) {
  return (
    <div className="checkInformation">
      <div className="informationRow">
        <OrderTitle>Order Type</OrderTitle>
        <Text>Project Player(s)</Text>
      </div>
      <div className="informationRow">
        <OrderTitle>Order Quantity</OrderTitle>
        <Text data-testid="checkInfoProjectPlayerCounter">{counter}</Text>
      </div>
      <div className="informationRow">
        <OrderTitle>Selected Venue</OrderTitle>
        <Text data-testid="checkInfoProjectVenueName">{venueData?.name}</Text>
      </div>
      {/*
      data && data.user && (
        <div className="informationRow">
          <OrderTitle>Shipping Contact</OrderTitle>
          <Text data-testid="checkInfoContact">
            {`${data.user.first_name} ${data.user.last_name}`} <br />
            {data.user.mobile_number} <br />
            {data.user.email}
          </Text>
        </div>
      )
        */}
      <div className="informationRow">
        <OrderTitle>Shipping Address</OrderTitle>
        <Text data-testid="checkInfoShippingAddress">
          {`${shippingData.shipping_address_1}${shippingData.shipping_address_2 && `, ${shippingData.shipping_address_2}`}`}{' '}
          <br />
          {`${shippingData.shipping_city}, ${shippingData.shipping_state_code}, ${shippingData.shipping_zip}`}
          <br />
          {shippingData.shipping_country_code}
        </Text>
      </div>
      <div className="informationRow">
        <OrderTitle>Order Notes</OrderTitle>
        <Text data-testid="checkInfoOrderNotes">
          {shippingData.notes?.order_notes}
        </Text>
      </div>
      {/*
      <div className="informationRow">
        <OrderTitle>Billing Address</OrderTitle>
        <Text data-testid="checkInfoBillingAddress">
          {`${billingData.shipping_address_1}${billingData.shipping_address_2 ? ` ${billingData.shipping_address_2}` : ''}`}{' '}
          <br />
          {`${billingData.shipping_city}, ${billingData.shipping_state_code} ${billingData.shipping_zip}`}
        </Text>
      </div>
      */}
    </div>
  );
}
