import {Countries} from '@/src/constants/countries';
import {Zupanije} from '@/src/constants/zupanije';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {OrdersAdminUpdateData} from '@/types/orders';
import {VenueAdminData, VenueUserData} from '@/types/venues';
import React from 'react';
import {toast} from 'react-toastify';
import AutoCompleteInput from '../../common/autocompleteInput/autocompleteInput';
import Checkmark from '../../common/checkmark/checkmark';
import Counter from '../../common/counter/counter';
import {ModalDivider} from '../../common/divider/divider';
import Label from '../../common/label/label';
import ModalContent from '../../common/modal/modalContent';
import ModalInputLabel, {
  ForwardedRefModalInputLabel,
} from '../../common/modalInputLabel/modalInputLabel';
import ModalSelectLabelFuzzy from '../../common/modalSelectLabel/modalSelectLabelFuzzy';
import ModalTextAreaLabel from '../../common/modalTextAreaLabel/modalTextAreaLabel';
import Text from '../../common/text/text';
import Title from '../../common/title/title';

const fetchVenues = async (businessId: string) => {
  const res = await ClientApiRequest({
    uri: `admin/venue/list?business_id=${businessId}`,
    method: 'GET',
    auth: true,
  });

  return res as {
    success: boolean;
    data: {
      total: number;
      venues: VenueAdminData[];
    };
  };
};

export default function OrderFields({
  businessId,
  formData,
  setFormData,
  oldAddress,
}: {
  businessId: string;
  formData:
    | (OrdersAdminUpdateData & {
        notes: {
          order_notes: string;
          decline_reason: string;
        };
      })
    | null;
  setFormData: React.Dispatch<
    React.SetStateAction<
      | (OrdersAdminUpdateData & {
          notes: {
            order_notes: string;
            decline_reason: string;
          };
        })
      | null
    >
  >;
  oldAddress: {
    shipping_address_1: string;
    shipping_address_2: string;
    shipping_city: string;
    shipping_state_code: string;
    shipping_country_code: string;
    shipping_zip: string;
  } | null;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputRefMemo = React.useMemo(() => inputRef, [inputRef]);
  const dpId = `countriesDropdown${Math.random().toString(36).substring(7)}`;
  const [venueList, setVenueList] = React.useState<VenueUserData[]>([]);
  const [selectedVenue, setSelectedVenue] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [counter, setCounter] = React.useState<number>(1);
  const [useVenueAddress, setUseVenueAddress] = React.useState<boolean>(false);
  const [venueAddress, setVenueAddress] = React.useState<{
    shipping_address_1: string;
    shipping_address_2: string;
    shipping_city: string;
    shipping_state_code: string;
    shipping_country_code: string;
    shipping_zip: string;
  } | null>(null);
  const {setLoading} = React.useContext(LoadingContext);

  React.useEffect(() => {
    if (!useVenueAddress && formData && oldAddress) {
      setFormData({
        ...formData,
        ...oldAddress,
      });
    } else if (useVenueAddress && formData && venueAddress) {
      setFormData({
        ...formData,
        ...venueAddress,
      });
    }
  }, [useVenueAddress]);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const venues = await fetchVenues(businessId);
      if (venues.success) {
        setVenueList(venues.data.venues);
        setSelectedVenue({
          id: venues.data.venues[0]?.id || '',
          name: venues.data.venues[0]?.name || '',
        });
      } else console.error('Error fetching venues');
      setLoading(false);
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      if (!formData) return;
      if (counter !== formData.quantity) setCounter(formData.quantity);
      if (selectedVenue?.id !== formData.venue_id) {
        setSelectedVenue({
          id: formData.venue_id,
          name: venueList.find((v) => v.id === formData.venue_id)?.name || '',
        });
      }
    }, 200);
  }, [formData, venueList]);

  React.useEffect(() => {
    if (selectedVenue) {
      const venue: VenueUserData | undefined = venueList.find(
        (v) => v.id === selectedVenue.id,
      );
      if (!venue || !formData) return;
      setVenueAddress({
        shipping_address_1: venue.address_1 || '',
        shipping_address_2: venue.address_2 || '',
        shipping_city: venue.city || '',
        shipping_state_code: venue.state_code || '',
        shipping_country_code: venue.country_code || '',
        shipping_zip: venue.zip || '',
      });
      if (venue.id !== formData.venue_id) {
        if (useVenueAddress)
          setFormData({
            ...formData,
            shipping_address_1: venue.address_1 || '',
            shipping_address_2: venue.address_2 || '',
            shipping_city: venue.city || '',
            shipping_state_code: venue.state_code || '',
            shipping_country_code: venue.country_code || '',
            shipping_zip: venue.zip || '',
            venue_id: venue.id || '',
          });
        else
          setFormData({
            ...formData,
            venue_id: venue.id || '',
          });
      }
    }
  }, [selectedVenue, venueList]);

  useDidUpdateEffect(() => {
    const shippingDataEl = document.querySelector('.shippingContainer');
    if (!useVenueAddress) {
      if (shippingDataEl) {
        const inputContainers =
          shippingDataEl.querySelectorAll('.modalInputControl');

        const selectContainers = shippingDataEl.querySelectorAll(
          '.modalSelectControl',
        );

        const containers = [...inputContainers, ...selectContainers];

        const formDatas = shippingDataEl.querySelectorAll(
          'input, textarea, select',
        );
        containers.forEach((el: Element) => {
          el.classList.remove('disabledInput');
        });

        formDatas.forEach((el: Element) => {
          (el as HTMLInputElement).readOnly = false;
          (el as HTMLSelectElement).disabled = false;
          (el as HTMLTextAreaElement).readOnly = false;
        });

        if (formData && oldAddress) {
          setFormData({
            ...formData,
            ...oldAddress,
          });
        }
      }
    } else {
      if (shippingDataEl) {
        const inputContainers =
          shippingDataEl.querySelectorAll('.modalInputControl');

        const selectContainers = shippingDataEl.querySelectorAll(
          '.modalSelectControl',
        );

        const containers = [...inputContainers, ...selectContainers];

        //console.log('containers', containers);
        const formDatas = shippingDataEl.querySelectorAll(
          'input, textarea, select',
        );
        containers.forEach((el: Element) => {
          el.classList.add('disabledInput');
        });
        formDatas.forEach((el: Element) => {
          (el as HTMLInputElement).readOnly = true;
          (el as HTMLSelectElement).disabled = true;
          (el as HTMLTextAreaElement).readOnly = true;
        });
      }
      if (formData && venueAddress) {
        setFormData({
          ...formData,
          ...venueAddress,
        });
      }
    }
  }, [useVenueAddress]);

  return (
    <>
      <ModalContent>
        <Title className="mB20">Order Information</Title>
        <div className="formContainer">
          <Label htmlFor="projectPlayerCounter">Quantity</Label>
          <Counter
            counter={counter}
            setCounter={setCounter}
            data-testid="projectPlayerCounter"
            max={5}
            maxLength={1}
            readOnly
            prevButtonClick={() => {
              if (counter > 1) {
                setCounter(counter - 1);
                setFormData({
                  ...formData,
                  quantity: counter - 1,
                } as typeof formData);
              }
            }}
            nextButtonClick={() => {
              if (counter < 5) {
                setCounter(counter + 1);
                setFormData({
                  ...formData,
                  quantity: counter + 1,
                } as typeof formData);
              }
            }}
            onChange={(e) => {
              // if value is bigger than 5, set to 5
              if (Number(e.currentTarget.value) > 5) {
                setCounter(5);
                setFormData({
                  ...formData,
                  quantity: 5,
                } as typeof formData);
              }
            }}
          />
          <ModalSelectLabelFuzzy
            inputTestId="editSelectVenueForOrderDropdown"
            labelText={'Select Venue'}
            data={
              (venueList &&
                venueList.map((venue) => {
                  return {
                    name: venue.name || '',
                    id: venue.id || '',
                  };
                })) ||
              []
            }
            searchData={
              (venueList &&
                venueList.map((venue) => {
                  return {
                    name: venue.name || '',
                    id: venue.id || '',
                  };
                })) ||
              []
            }
            dropdownId={'editSelectVenueForOrderDropdown'}
            searchKeys={['name']}
            displayValue={'name'}
            display={{
              topLeft: 'name',
              topRight: undefined,
              bottomLeft: undefined,
              bottomRight: undefined,
            }}
            displayStartLimit={5}
            value={selectedVenue}
            setValue={setSelectedVenue}
            dataName={'Venues'}
          />
        </div>
        <ModalDivider />
        <Title className="mB20">Shipping Information</Title>
        <div className="formContainer shippingContainer">
          <div
            data-testid="shipToVenueContainer"
            className="shipToVenueContainer"
          >
            <Checkmark
              value={useVenueAddress}
              setValue={setUseVenueAddress}
              name="editShipToVenue"
            />
            <Text>Ship to venue address</Text>
          </div>
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
                  setFormData((prev) => {
                    return {
                      ...prev,
                      shipping_address_1: place,
                    } as typeof formData;
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
                      state.code =
                        Zupanije[state.code as keyof typeof Zupanije];
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

                    //console.log(streetAddress);

                    // set businessData
                    setFormData((prev) => {
                      return {
                        ...prev,
                        shipping_address_1: streetAddress || '',
                        shipping_city: city || '',
                        shipping_country_code: country || '',
                        shipping_state_code: `${country}-${state.code}` || '',
                        shipping_zip: zip || '',
                      } as typeof formData;
                    });
                  } else {
                    setFormData((prev) => {
                      return {
                        ...prev,
                        shipping_address_1: address || '',
                      } as typeof formData;
                    });
                  }
                }
              }
            }}
          >
            <ForwardedRefModalInputLabel
              ref={inputRef}
              labelText="Business Address"
              errorText="Business address is required."
              inputProps={{
                type: 'text',
                name: 'address_1',
                'data-testid': 'address_1',
                required: true,
                placeholder: '1234 Main St.',
                value: formData?.shipping_address_1 || '',
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    shipping_address_1: e.currentTarget.value,
                  } as typeof formData);
                },
              }}
            />
          </AutoCompleteInput>
          <ModalInputLabel
            labelText="Address Line 2"
            inputProps={{
              type: 'text',
              name: 'address_2',
              'data-testid': 'address_2',
              placeholder: 'Suite, Floor, etc.',
              value: formData?.shipping_address_2 || '',
              onChange: (e) => {
                setFormData({
                  ...formData,
                  shipping_address_2: e.currentTarget.value,
                } as typeof formData);
              },
            }}
          />
          <div className="row">
            <ModalSelectLabelFuzzy
              inputTestId="editSelectCountryForOrderDropdown"
              labelText="Country"
              errorText="Country is required."
              selectProps={{
                id: 'countryCode',
                name: 'country_code',
                required: true,
                value: formData?.shipping_country_code || '',
              }}
              selectTestDataId="country_code"
              data={Countries}
              searchData={Countries}
              dropdownId={dpId}
              searchKeys={['name', 'id']}
              displayValue="name"
              display={{
                topLeft: 'name',
              }}
              displayStartLimit={5}
              value={
                Countries
                  ? Countries.find(
                      (c) => c.id === formData?.shipping_country_code,
                    ) || null
                  : null
              }
              setValue={(data) => {
                setFormData({
                  ...formData,
                  shipping_country_code: data.id,
                } as typeof formData);
              }}
              dataName="Countries"
            />
            <ModalInputLabel
              labelText="City"
              errorText="City is required."
              inputProps={{
                type: 'text',
                name: 'city',
                'data-testid': 'city',
                required: true,
                placeholder: 'New York',
                value: formData?.shipping_city || '',
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    shipping_city: e.currentTarget.value,
                  } as typeof formData);
                },
              }}
            />
          </div>
          <div className="row">
            <ModalInputLabel
              labelText="State"
              errorText="State is required."
              inputProps={{
                type: 'text',
                name: 'state_code',
                'data-testid': 'state_code',
                required: true,
                placeholder: 'US-NY',
                value: formData?.shipping_state_code || '',
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    shipping_state_code: e.currentTarget.value,
                  } as typeof formData);
                },
              }}
            />
            <ModalInputLabel
              labelText="Zip"
              errorText="Zip is required."
              inputProps={{
                type: 'text',
                name: 'zip',
                'data-testid': 'zip',
                required: true,
                placeholder: '10001',
                value: formData?.shipping_zip || '',
                onChange: (e) => {
                  setFormData({
                    ...formData,
                    shipping_zip: e.currentTarget.value,
                  } as typeof formData);
                },
              }}
            />
          </div>
        </div>
        <ModalDivider />
        <Title className="mB20">Order Notes</Title>
        <div className="formContainer">
          <ModalTextAreaLabel
            labelText="Notes"
            duplicateId="denyNote"
            textareaProps={{
              name: 'order_notes',
              id: 'regNotes',
              minLength: 1,
              maxLength: 500,
              'data-testid': 'order_notes',
              placeholder: 'Enter notes here...',
              value: formData?.notes.order_notes || '',
              onChange: (e) => {
                setFormData({
                  ...formData,
                  notes: {
                    ...formData?.notes,
                    order_notes: e.currentTarget.value,
                  },
                } as typeof formData);
              },
            }}
          />
        </div>
      </ModalContent>
    </>
  );
}
