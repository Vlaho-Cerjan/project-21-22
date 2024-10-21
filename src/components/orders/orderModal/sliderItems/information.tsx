import React from 'react';

import AutoCompleteInput from '@/src/components/common/autocompleteInput/autocompleteInput';
import Checkmark from '@/src/components/common/checkmark/checkmark';
import ModalInputLabel, {
  ForwardedRefModalInputLabel,
} from '@/src/components/common/modalInputLabel/modalInputLabel';
import ModalSelectLabelFuzzy from '@/src/components/common/modalSelectLabel/modalSelectLabelFuzzy';
import Text from '@/src/components/common/text/text';
import Title from '@/src/components/common/title/title';
import {Countries} from '@/src/constants/countries';
import {Zupanije} from '@/src/constants/zupanije';
import {OrdersCreateData} from '@/types/orders';
import {toast} from 'react-toastify';

export default function Information({
  value,
  setValue,
  //contactValue,
  //setContactValue,
  shippingData,
  setShippingData,
  //billingData,
  //setBillingData,
  //billingSameAsShipping,
  //setBillingSameAsShipping,
}: {
  value: boolean;
  setValue: React.Dispatch<React.SetStateAction<boolean>>;
  //contactValue: boolean;
  //setContactValue: React.Dispatch<React.SetStateAction<boolean>>;
  shippingData: OrdersCreateData;
  setShippingData: React.Dispatch<React.SetStateAction<OrdersCreateData>>;
  //billingData: OrdersCreateData;
  //setBillingData: React.Dispatch<React.SetStateAction<OrdersCreateData>>;
  //billingSameAsShipping: boolean;
  //setBillingSameAsShipping: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputRefMemo = React.useMemo(() => inputRef, [inputRef]);

  /*
  const billingInputRef = React.useRef<HTMLInputElement>(null);
  const billingInputRefMemo = React.useMemo(
    () => billingInputRef,
    [billingInputRef],
  );

  React.useEffect(() => {
    if (billingSameAsShipping) {
      setBillingData(shippingData);
    } else {
      setBillingData({
        ...shippingData,
        shipping_address_1: '',
        shipping_address_2: '',
        shipping_city: '',
        shipping_state_code: '',
        shipping_country_code: '',
        shipping_zip: '',
      });
    }
  }, [billingSameAsShipping]);
*/

  //console.log(shippingData, 'shippingData');
  return (
    <div className="information informationContainer">
      <div className="shippingData">
        <Title>Shipping Information</Title>
        <div
          data-testid="shipToVenueContainer"
          className="shipToVenueContainer"
        >
          <Checkmark value={value} setValue={setValue} name="shipToVenue" />
          <Text>Ship to venue address</Text>
        </div>
        {/*
        <ModalInputLabel
          errorText="Please enter a valid name"
          labelText="Destination"
          inputProps={{
            required: true,
            id: 'destination',
            'data-testid': 'destination',
            name: 'destination',
            type: 'text',
            value: shippingData.business_name,
            onChange: (e) =>
              setShippingData({
                ...shippingData,
                business_name: e.currentTarget.value,
              }),
          }}
        />
        */}
        <AutoCompleteInput
          inputRef={inputRefMemo}
          onChange={(place) => {
            // if change event return
            // if (typeof setAutocompleteValue === 'undefined') return;
            // if (typeof place === 'string') setAutocompleteValue(place);
            // else {
            //  setAutocompleteValue(place as google.maps.places.PlaceResult);
            // }
            if (place) {
              if (typeof place === 'string') {
                setShippingData((prev) => {
                  return {
                    ...prev,
                    shipping_address_1: place,
                  };
                });
              } else {
                const address = place.formatted_address || place.name;
                const addressComponents = place.address_components || [];

                if (
                  typeof addressComponents !== 'undefined' &&
                  addressComponents.length > 0
                ) {
                  // get street number and street name
                  const streetNumber = addressComponents.find((component) => {
                    return component.types.includes('street_number');
                  })?.long_name;

                  const country = addressComponents.find((component) => {
                    return component.types.includes('country');
                  })?.short_name;

                  const street = addressComponents.find((component) => {
                    return component.types.includes('route');
                  })?.long_name;

                  const streetAddress = streetNumber
                    ? `${streetNumber} ${street}`
                    : street;
                  // get city
                  const city = addressComponents.find((component) => {
                    return component.types.includes('locality');
                  })?.long_name;
                  // get state
                  const state = {
                    code: addressComponents.find((component) => {
                      return component.types.includes(
                        'administrative_area_level_1',
                      );
                    })?.short_name,
                  };

                  if (Zupanije[state.code as keyof typeof Zupanije]) {
                    state.code = Zupanije[state.code as keyof typeof Zupanije];
                  }
                  // get zip code
                  const zip = addressComponents.find((component) => {
                    return component.types.includes('postal_code');
                  })?.long_name;

                  if (
                    !streetNumber ||
                    !streetAddress ||
                    !city ||
                    !state ||
                    !country ||
                    !zip
                  ) {
                    const missingFields = [
                      !streetNumber && 'street number',
                      !streetAddress && 'street name',
                      !city && 'city',
                      !state && 'state',
                      !country && 'country',
                      !zip && 'zip code',
                    ]
                      .filter(Boolean)
                      .join(', ');
                    toast.info(
                      `Please enter a valid address. Missing ${missingFields}.`,
                    );
                    //return;
                  }

                  // set businessData
                  setShippingData((prev) => {
                    return {
                      ...prev,
                      shipping_address_1: streetAddress || '',
                      shipping_city: city || '',
                      shipping_country_code: country || '',
                      shipping_state_code: `${country}-${state.code}` || '',
                      shipping_zip: zip || '',
                    };
                  });
                } else {
                  setShippingData((prev) => {
                    return {
                      ...prev,
                      shipping_address_1: address || '',
                    };
                  });
                }
              }
            }
          }}
        >
          <ForwardedRefModalInputLabel
            ref={inputRef}
            labelText="Address"
            errorText="Address is required."
            inputProps={{
              type: 'text',
              name: 'address_1',
              'data-testid': 'address_1',
              required: true,
              placeholder: '1234 Main St.',
              value: shippingData?.shipping_address_1 || '',
              onChange: (e) => {
                setShippingData({
                  ...shippingData,
                  shipping_address_1: e.currentTarget.value,
                });
              },
            }}
          />
        </AutoCompleteInput>
        <ModalInputLabel
          errorText="Please enter a valid address"
          labelText="Address Line 2"
          inputProps={{
            id: 'address_2',
            'data-testid': 'address_2',
            name: 'address_2',
            type: 'text',
            value: shippingData.shipping_address_2,
            onChange: (e) =>
              setShippingData({
                ...shippingData,
                shipping_address_2: e.currentTarget.value,
              }),
          }}
        />
        <div className="row">
          <ModalInputLabel
            errorText="Please enter a valid city"
            labelText="City"
            inputProps={{
              required: true,
              id: 'city',
              'data-testid': 'city',
              name: 'city',
              type: 'text',
              value: shippingData.shipping_city,
              onChange: (e) =>
                setShippingData({
                  ...shippingData,
                  shipping_city: e.currentTarget.value,
                }),
            }}
          />
          <ModalInputLabel
            errorText="Please enter a valid state code"
            labelText="State Code"
            inputProps={{
              required: true,
              id: 'state_code',
              'data-testid': 'state_code',
              name: 'state_code',
              type: 'text',
              value: shippingData.shipping_state_code,
              onChange: (e) =>
                setShippingData({
                  ...shippingData,
                  shipping_state_code: e.currentTarget.value,
                }),
            }}
          />
        </div>
        <div className="row">
          <ModalSelectLabelFuzzy
            inputTestId="searchCountryForOrder"
            labelText="Country"
            errorText="Country is required."
            selectProps={{
              id: 'countryCode',
              name: 'country_code',
              required: true,
              value: shippingData?.shipping_country_code || '',
            }}
            selectTestDataId="country_code"
            data={Countries}
            searchData={Countries}
            dropdownId={`orderCountryCodeDropdown`}
            searchKeys={['name', 'id']}
            displayValue="name"
            display={{
              topLeft: 'name',
            }}
            displayStartLimit={5}
            value={
              Countries
                ? Countries.find(
                    (c) => c.id === shippingData?.shipping_country_code,
                  ) || null
                : null
            }
            setValue={(data) => {
              setShippingData({
                ...shippingData,
                shipping_country_code: data.id,
              });
            }}
            dataName="Countries"
          />
          <ModalInputLabel
            errorText="Please enter a valid zip code"
            labelText="Zip Code"
            inputProps={{
              required: true,
              className: 'hideArrows',
              id: 'zip',
              'data-testid': 'zip',
              name: 'zip',
              type: 'string',
              value: shippingData.shipping_zip,
              onChange: (e) =>
                setShippingData({
                  ...shippingData,
                  shipping_zip: e.currentTarget.value,
                }),
            }}
          />
        </div>
      </div>
      {/*
      <ModalDivider className="mX" />
      <div className="contactData">
        <div
          data-testid="useAccountDetailsContainer"
          className="useAccountDetailsContainer"
        >
          <Checkmark
            value={contactValue}
            setValue={setContactValue}
            name="useContact"
          />
          <Text>Use account contact details</Text>
        </div>
        <ModalInputLabel
          errorText="Please enter a valid name"
          labelText="Contact Name"
          inputProps={{
            required: true,
            id: 'contactName',
            'data-testid': 'contactName',
            name: 'contactName',
            type: 'text',
            value: `${shippingData.first_name} ${shippingData.last_name}`,
            onChange: (e) => {
              const [first, last] = e.currentTarget.value.split(' ');
              setShippingData({
                ...shippingData,
                first_name: first || '',
                last_name: last || '',
              });
            },
          }}
        />
        <ModalInputLabel
          errorText="Please enter a valid phone number"
          labelText="Contact Phone Number"
          inputProps={{
            required: true,
            id: 'contactPhone',
            'data-testid': 'contactPhone',
            name: 'contactPhone',
            type: 'tel',
            value: shippingData.phone_number,
            onChange: (e) =>
              setShippingData({
                ...shippingData,
                phone_number: e.currentTarget.value,
              }),
          }}
        />
        <ModalInputLabel
          errorText="Please enter a valid email"
          labelText="Contact Email"
          inputProps={{
            required: true,
            id: 'contactEmail',
            'data-testid': 'contactEmail',
            name: 'contactEmail',
            type: 'email',
            value: shippingData.email,
            onChange: (e) =>
              setShippingData({
                ...shippingData,
                email: e.currentTarget.value,
              }),
          }}
        />
      </div>
      */}
      {/*
      <ModalDivider className="mX" />
      <div className="billingData">
        <Title>Billing Information</Title>
        <div
          data-testid="billingVenueContainer"
          className="billingVenueContainer"
        >
          <Checkmark
            value={billingSameAsShipping}
            setValue={setBillingSameAsShipping}
            name="billingSameAsShipping"
          />
          <Text>Billing Same As Shipping</Text>
        </div>
        {/*
        <ModalInputLabel
          errorText="Please enter a valid name"
          labelText="Destination"
          inputProps={{
            required: true,
            id: 'destination',
            'data-testid': 'destination',
            name: 'destination',
            type: 'text',
            value: billingData.business_name,
            onChange: (e) =>
              setBillingData({
                ...billingData,
                business_name: e.currentTarget.value,
              }),
          }}
        />
        */}
      {/*
        <AutoCompleteInput
          inputRef={billingInputRefMemo}
          onChange={(place) => {
            // if change event return
            // if (typeof setAutocompleteValue === 'undefined') return;
            // if (typeof place === 'string') setAutocompleteValue(place);
            // else {
            //  setAutocompleteValue(place as google.maps.places.PlaceResult);
            // }
            if (place) {
              if (typeof place === 'string') {
                setBillingData((prev) => {
                  return {
                    ...prev,
                    shipping_address_1: place,
                  };
                });
              } else {
                const address = place.formatted_address || place.name;
                const addressComponents = place.address_components || [];

                if (
                  typeof addressComponents !== 'undefined' &&
                  addressComponents.length > 0
                ) {
                  // get street number and street name
                  const streetNumber = addressComponents.find((component) => {
                    return component.types.includes('street_number');
                  })?.long_name;

                  const country = addressComponents.find((component) => {
                    return component.types.includes('country');
                  })?.short_name;

                  const street = addressComponents.find((component) => {
                    return component.types.includes('route');
                  })?.long_name;

                  const streetAddress = streetNumber
                    ? `${streetNumber} ${street}`
                    : street;
                  // get city
                  const city = addressComponents.find((component) => {
                    return component.types.includes('locality');
                  })?.long_name;
                  // get state
                  const state = {
                    code: addressComponents.find((component) => {
                      return component.types.includes(
                        'administrative_area_level_1',
                      );
                    })?.short_name,
                  };

                  if (Zupanije[state.code as keyof typeof Zupanije]) {
                    state.code = Zupanije[state.code as keyof typeof Zupanije];
                  }
                  // get zip code
                  const zip = addressComponents.find((component) => {
                    return component.types.includes('postal_code');
                  })?.long_name;

                  if (
                    !streetNumber ||
                    !streetAddress ||
                    !city ||
                    !state ||
                    !country ||
                    !zip
                  ) {
                    const missingFields = [
                      !streetNumber && 'street number',
                      !streetAddress && 'street name',
                      !city && 'city',
                      !state && 'state',
                      !country && 'country',
                      !zip && 'zip code',
                    ]
                      .filter(Boolean)
                      .join(', ');
                    toast.error(
                      `Please enter a valid address. Missing ${missingFields}.`,
                    );
                    return;
                  }

                  // set businessData
                  setBillingData((prev) => {
                    return {
                      ...prev,
                      shipping_address_1: streetAddress || '',
                      shipping_city: city || '',
                      shipping_country_code: country || '',
                      shipping_state_code: `${country}-${state.code}` || '',
                      shipping_zip: zip || '',
                    };
                  });
                } else {
                  setBillingData((prev) => {
                    return {
                      ...prev,
                      shipping_address_1: address || '',
                    };
                  });
                }
              }
            }
          }}
        >
          <ForwardedRefModalInputLabel
            ref={billingInputRef}
            labelText="Address"
            errorText="Address is required."
            inputProps={{
              type: 'text',
              name: 'address_1',
              'data-testid': 'address_1',
              required: true,
              placeholder: '1234 Main St.',
              value: billingData?.shipping_address_1 || '',
              onChange: (e) => {
                setBillingData({
                  ...billingData,
                  shipping_address_1: e.currentTarget.value,
                });
              },
            }}
          />
        </AutoCompleteInput>
        <div className="row">
          <ModalInputLabel
            errorText="Please enter a valid address"
            labelText="Address Line 2"
            inputProps={{
              id: 'address_2',
              'data-testid': 'address_2',
              name: 'address_2',
              type: 'text',
              value: billingData.shipping_address_2,
              onChange: (e) =>
                setBillingData({
                  ...billingData,
                  shipping_address_2: e.currentTarget.value,
                }),
            }}
          />
          <ModalInputLabel
            errorText="Please enter a valid city"
            labelText="City"
            inputProps={{
              required: true,
              id: 'city',
              'data-testid': 'city',
              name: 'city',
              type: 'text',
              value: billingData.shipping_city,
              onChange: (e) =>
                setBillingData({
                  ...billingData,
                  shipping_city: e.currentTarget.value,
                }),
            }}
          />
        </div>
        <div className="row">
          <ModalSelectLabelFuzzy
            labelText="Country"
            errorText="Country is required."
            selectProps={{
              id: 'countryCode',
              name: 'country_code',
              required: true,
              value: billingData?.shipping_country_code || '',
            }}
            selectTestDataId="country_code"
            data={Countries}
            searchData={Countries}
            dropdownId={`orderCountryCodeDropdown`}
            searchKeys={['name', 'id']}
            displayValue="name"
            display={{
              topLeft: 'name',
            }}
            displayStartLimit={5}
            value={
              Countries
                ? Countries.find(
                    (c) => c.id === billingData?.shipping_country_code,
                  ) || null
                : null
            }
            setValue={(data) => {
              setBillingData({
                ...billingData,
                shipping_country_code: data.id,
              });
            }}
            dataName="Countries"
          />
          <ModalInputLabel
            errorText="Please enter a valid zip code"
            labelText="Zip Code"
            inputProps={{
              required: true,
              className: 'hideArrows',
              id: 'zip',
              'data-testid': 'zip',
              name: 'zip',
              type: 'string',
              value: billingData.shipping_zip,
              onChange: (e) =>
                setBillingData({
                  ...billingData,
                  shipping_zip: e.currentTarget.value,
                }),
            }}
          />
        </div>
      </div>
      {/*
      <ModalDivider className="mX" />
      <div className="contactData">
        <div
          data-testid="useAccountDetailsContainer"
          className="useAccountDetailsContainer"
        >
          <Checkmark
            value={contactValue}
            setValue={setContactValue}
            name="useContact"
          />
          <Text>Use account contact details</Text>
        </div>
        <ModalInputLabel
          errorText="Please enter a valid name"
          labelText="Contact Name"
          inputProps={{
            required: true,
            id: 'contactName',
            'data-testid': 'contactName',
            name: 'contactName',
            type: 'text',
            value: `${billingData.first_name} ${billingData.last_name}`,
            onChange: (e) => {
              const [first, last] = e.currentTarget.value.split(' ');
              setBillingData({
                ...billingData,
                first_name: first || '',
                last_name: last || '',
              });
            },
          }}
        />
        <ModalInputLabel
          errorText="Please enter a valid phone number"
          labelText="Contact Phone Number"
          inputProps={{
            required: true,
            id: 'contactPhone',
            'data-testid': 'contactPhone',
            name: 'contactPhone',
            type: 'tel',
            value: billingData.phone_number,
            onChange: (e) =>
              setBillingData({
                ...billingData,
                phone_number: e.currentTarget.value,
              }),
          }}
        />
        <ModalInputLabel
          errorText="Please enter a valid email"
          labelText="Contact Email"
          inputProps={{
            required: true,
            id: 'contactEmail',
            'data-testid': 'contactEmail',
            name: 'contactEmail',
            type: 'email',
            value: billingData.email,
            onChange: (e) =>
              setBillingData({
                ...billingData,
                email: e.currentTarget.value,
              }),
          }}
        />
      </div>
      */}
    </div>
  );
}
