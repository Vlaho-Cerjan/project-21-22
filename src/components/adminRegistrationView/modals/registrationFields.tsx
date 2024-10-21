import {Countries} from '@/src/constants/countries';
import {Zupanije} from '@/src/constants/zupanije';
import {useAppSelector} from '@/src/hooks';
import type {BusinessTypeState} from '@/src/store/slices/enumSlice';
import type {RegistrationList} from '@/types/registrations';
import React from 'react';
import {toast} from 'react-toastify';
import AutoCompleteInput from '../../common/autocompleteInput/autocompleteInput';
import Checkmark from '../../common/checkmark/checkmark';
import {ModalDivider} from '../../common/divider/divider';
import ModalContent from '../../common/modal/modalContent';
import ModalInputLabel, {
  ForwardedRefModalInputLabel,
} from '../../common/modalInputLabel/modalInputLabel';
import ModalPhoneLabel from '../../common/modalPhoneLabel/modalPhoneLabel';
import ModalSelectLabelFuzzy from '../../common/modalSelectLabel/modalSelectLabelFuzzy';
import ModalTextAreaLabel from '../../common/modalTextAreaLabel/modalTextAreaLabel';
import Title from '../../common/title/title';

export default function RegistrationFields({
  formData,
  setFormData,
}: {
  formData: RegistrationList | null;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationList | null>>;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const inputRefMemo = React.useMemo(() => inputRef, [inputRef]);
  const dpId = `countriesDropdown${Math.random().toString(36).substring(7)}`;
  const venueId = `venueTypeDropdown${Math.random().toString(36).substring(7)}`;
  const {venueType} = useAppSelector((state) => state.enum);
  const [venueTypeData, setVenueTypeData] = React.useState<
    BusinessTypeState[] | null
  >(null);

  React.useEffect(() => {
    if (venueType) {
      setVenueTypeData(venueType);
    }
  }, [venueType]);

  return (
    <>
      <ModalContent>
        <Title className="mB20">Business Information</Title>
        <div className="formContainer">
          <div className="row">
            <ModalInputLabel
              labelText="First Name"
              errorText="First name is required."
              inputProps={{
                type: 'text',
                name: 'first_name',
                'data-testid': 'first_name',
                required: true,
                placeholder: 'John',
                value: formData?.first_name || '',
                onChange: (e) => {
                  setFormData({
                    ...(formData as RegistrationList),
                    first_name: e.currentTarget.value,
                  });
                },
              }}
            />
            <ModalInputLabel
              labelText="Last Name"
              errorText="Last name is required."
              inputProps={{
                type: 'text',
                name: 'last_name',
                'data-testid': 'last_name',
                required: true,
                placeholder: 'Johnson',
                value: formData?.last_name || '',
                onChange: (e) => {
                  setFormData({
                    ...(formData as RegistrationList),
                    last_name: e.currentTarget.value,
                  });
                },
              }}
            />
          </div>
          <ModalInputLabel
            labelText="Business Name"
            errorText="Business name is required."
            inputProps={{
              type: 'text',
              name: 'business_name',
              'data-testid': 'business_name',
              required: true,
              placeholder: 'Johnson Inc.',
              value: formData?.business_name || '',
              onChange: (e) => {
                setFormData({
                  ...(formData as RegistrationList),
                  business_name: e.currentTarget.value,
                });
              },
            }}
          />
          <ModalInputLabel
            labelText="Business Email"
            errorText="Please enter a valid email address."
            inputProps={{
              type: 'email',
              name: 'email',
              'data-testid': 'email',
              required: true,
              placeholder: 'john.johncon@inc.com',
              value: formData?.email || '',
              onChange: (e) => {
                setFormData({
                  ...(formData as RegistrationList),
                  email: e.currentTarget.value,
                });
              },
            }}
          />
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
                      ...(prev as RegistrationList),
                      address_1: place,
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

                    // set businessData
                    setFormData((prev) => {
                      return {
                        ...(prev as RegistrationList),
                        address_1: streetAddress || '',
                        city: city || '',
                        country_code: country || '',
                        state_code: `${country}-${state.code}` || '',
                        zip: zip || '',
                      };
                    });
                  } else {
                    setFormData((prev) => {
                      return {
                        ...(prev as RegistrationList),
                        address_1: address || '',
                      };
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
                value: formData?.address_1 || '',
                onChange: (e) => {
                  setFormData({
                    ...(formData as RegistrationList),
                    address_1: e.currentTarget.value,
                  });
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
              value: formData?.address_2 || '',
              onChange: (e) => {
                setFormData({
                  ...(formData as RegistrationList),
                  address_2: e.currentTarget.value,
                });
              },
            }}
          />
          <div className="row">
            <ModalSelectLabelFuzzy
              inputTestId="country_code"
              labelText="Country"
              errorText="Country is required."
              selectProps={{
                id: 'countryCode',
                name: 'country_code',
                required: true,
                value: formData?.country_code || '',
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
                  ? Countries.find((c) => c.id === formData?.country_code) ||
                    null
                  : null
              }
              setValue={(data) => {
                setFormData({
                  ...(formData as RegistrationList),
                  country_code: data.id,
                });
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
                value: formData?.city || '',
                onChange: (e) => {
                  setFormData({
                    ...(formData as RegistrationList),
                    city: e.currentTarget.value,
                  });
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
                value: formData?.state_code || '',
                onChange: (e) => {
                  setFormData({
                    ...(formData as RegistrationList),
                    state_code: e.currentTarget.value,
                  });
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
                value: formData?.zip || '',
                onChange: (e) => {
                  setFormData({
                    ...(formData as RegistrationList),
                    zip: e.currentTarget.value,
                  });
                },
              }}
            />
          </div>
          <ModalPhoneLabel
            labelText="Phone Number"
            errorText="Please enter a valid phone number."
            country={formData?.country_code}
            setCountry={(country: string) => {
              setFormData({
                ...(formData as RegistrationList),
                country_code: country,
              });
            }}
            data={formData?.phone_number || ''}
            setData={(data: string) => {
              setFormData({
                ...(formData as RegistrationList),
                phone_number: data,
              });
            }}
            inputProps={{
              type: 'tel',
              name: 'phone_number',
              'data-testid': 'phone_number',
              required: true,
              placeholder: '(555)123-4567',
            }}
          />
          <ModalPhoneLabel
            labelText="Mobile Number"
            errorText="Please enter a valid mobile number."
            country={formData?.country_code}
            setCountry={(country: string) => {
              setFormData({
                ...(formData as RegistrationList),
                country_code: country,
              });
            }}
            data={formData?.mobile_number || ''}
            setData={(data: string) => {
              setFormData({
                ...(formData as RegistrationList),
                mobile_number: data,
              });
            }}
            inputProps={{
              type: 'tel',
              name: 'mobile_number',
              'data-testid': 'mobile_number',
              required: true,
              placeholder: '(555)123-4567',
            }}
          />
          <ModalSelectLabelFuzzy
            inputTestId="venue_type_id"
            labelText="Venue Type"
            errorText="Venue type is required."
            selectProps={{
              id: 'venueType',
              name: 'venue_type_id',
              required: true,
              value: formData?.business_type_id || '',
            }}
            selectTestDataId="venue_type_id"
            data={
              venueTypeData?.map((c) => {
                return {
                  id: c.id,
                  name: c.name,
                };
              }) || []
            }
            searchData={
              venueTypeData?.map((c) => {
                return {
                  id: c.id,
                  name: c.name,
                };
              }) || []
            }
            dropdownId={venueId}
            searchKeys={['name', 'id']}
            displayValue="name"
            display={{
              topLeft: 'name',
            }}
            displayStartLimit={5}
            value={
              venueTypeData
                ? venueTypeData?.find(
                    (c) => c.id === formData?.business_type_id,
                  ) || null
                : null
            }
            setValue={(data) => {
              setFormData({
                ...(formData as RegistrationList),
                business_type_id: data.id,
              });
            }}
            dataName="Venue Types"
          />
        </div>
        <ModalDivider />
        <Title className="mB20">Registration Notes</Title>
        <div className="formContainer">
          <ModalTextAreaLabel
            labelText="Notes"
            duplicateId="denyNote"
            textareaProps={{
              name: 'registration_notes',
              id: 'regNotes',
              minLength: 1,
              maxLength: 500,
              'data-testid': 'registration_notes',
              placeholder: 'Enter notes here...',
              value: formData?.notes.registration_notes || '',
              onChange: (e) => {
                setFormData({
                  ...(formData as RegistrationList),
                  notes: {
                    ...(formData as RegistrationList).notes,
                    registration_notes: e.currentTarget.value,
                  },
                });
              },
            }}
          />
          <Checkmark
            title="DMA Top 20"
            name="dma_top_20"
            value={formData?.notes.dma_top_20 === 1}
            setValue={(value) => {
              setFormData({
                ...(formData as RegistrationList),
                notes: {
                  ...(formData as RegistrationList).notes,
                  dma_top_20: value === true ? 1 : 0,
                },
              });
            }}
          />
          <Checkmark
            title="Do Not Ship Player"
            name="do_not_ship_player"
            value={formData?.notes.do_not_ship_player || false}
            setValue={(value) => {
              setFormData({
                ...(formData as RegistrationList),
                notes: {
                  ...(formData as RegistrationList).notes,
                  do_not_ship_player: value,
                },
              });
            }}
          />
          <Checkmark
            title="Skip Email"
            name="skip_email"
            value={formData?.notes.skip_email || false}
            setValue={(value) => {
              setFormData({
                ...(formData as RegistrationList),
                notes: {
                  ...(formData as RegistrationList).notes,
                  skip_email: value,
                },
              });
            }}
          />
        </div>
      </ModalContent>
    </>
  );
}
