import {Countries} from '@/src/constants/countries';
import {Zupanije} from '@/src/constants/zupanije';
import {useAppSelector} from '@/src/hooks';
import type {BusinessTypeState} from '@/src/store/slices/enumSlice';
import type {VenueUserData} from '@/types/venues';
import React from 'react';
import {toast} from 'react-toastify';
import AutoCompleteInput from '../../common/autocompleteInput/autocompleteInput';
import ModalContent from '../../common/modal/modalContent';
import ModalInputLabel, {
  ForwardedRefModalInputLabel,
} from '../../common/modalInputLabel/modalInputLabel';
import ModalSelectLabelFuzzy from '../../common/modalSelectLabel/modalSelectLabelFuzzy';
import ModalTextAreaLabel from '../../common/modalTextAreaLabel/modalTextAreaLabel';
import Title from '../../common/title/title';

/*
const searchGroups = async (searchText: string) => {
  const res = await ClientApiRequest({
    uri: `api/group/list?limit=100&offset=0&search=${searchText}`,
    method: 'GET',
    auth: true,
  });

  return res as {
    success: boolean;
    data: {
      total: string;
      groups: VenueUserGroupData[];
    };
  };
};
*/

export default function VenueFields({
  //id,
  formData,
  setFormData,
}: {
  id: string;
  formData: Partial<VenueUserData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<VenueUserData>>>;
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
    <ModalContent>
      <Title className="mB20">Venue Information</Title>
      <div className="formContainer">
        <ModalInputLabel
          labelText="Name"
          errorText="Name is required."
          inputProps={{
            type: 'text',
            name: 'name',
            'data-testid': 'name',
            required: true,
            placeholder: 'John',
            value: formData?.name || '',
            onChange: (e) => {
              setFormData({
                ...(formData as VenueUserData),
                name: e.currentTarget.value,
              });
            },
          }}
        />
        <ModalTextAreaLabel
          labelText="Description"
          errorText="Description is required."
          textareaProps={{
            type: 'text',
            name: 'description',
            'data-testid': 'description',
            required: true,
            placeholder: 'Description',
            value: formData?.description || '',
            onChange: (e) => {
              setFormData({
                ...(formData as VenueUserData),
                description: e.currentTarget.value,
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
                    ...(prev as VenueUserData),
                    address_1: place,
                  };
                });
              } else {
                const address = place.formatted_address || place.name;
                const addressComponents = place.address_components || [];
                const lat = place.geometry?.location?.lat();
                const lng = place.geometry?.location?.lng();

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
                  setFormData((prev) => {
                    return {
                      ...(prev as VenueUserData),
                      address_1: streetAddress || '',
                      city: city || '',
                      country_code: country || '',
                      state_code: `${country}-${state.code}` || '',
                      zip: zip || '',
                      latitude: lat || 0,
                      longitude: lng || 0,
                    };
                  });
                } else {
                  setFormData((prev) => {
                    return {
                      ...(prev as VenueUserData),
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
            labelText="Address"
            errorText="Address is required."
            inputProps={{
              type: 'text',
              name: 'address_1',
              'data-testid': 'address_1',
              required: true,
              placeholder: '1234 Main St.',
              value: formData?.address_1 || '',
              onChange: (e) => {
                setFormData({
                  ...(formData as VenueUserData),
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
                ...(formData as VenueUserData),
                address_2: e.currentTarget.value,
              });
            },
          }}
        />
        <div className="row">
          <ModalSelectLabelFuzzy
            inputTestId="countryCodeSearchInput"
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
                ? Countries.find((c) => c.id === formData?.country_code) || null
                : null
            }
            setValue={(data) => {
              setFormData({
                ...(formData as VenueUserData),
                country_code: data.id as string,
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
                  ...(formData as VenueUserData),
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
                  ...(formData as VenueUserData),
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
                  ...(formData as VenueUserData),
                  zip: e.currentTarget.value,
                });
              },
            }}
          />
        </div>
        <ModalSelectLabelFuzzy
          inputTestId="venueTypeSearchInput"
          labelText="Venue Type"
          errorText="Venue type is required."
          selectProps={{
            id: 'venueType',
            name: 'venue_type_id',
            required: true,
            value: formData?.venue_type_id || '',
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
              ? venueTypeData?.find((c) => c.id === formData?.venue_type_id) ||
                null
              : null
          }
          setValue={(data) => {
            setFormData({
              ...(formData as VenueUserData),
              venue_type_id: data.id as string,
            });
          }}
          dataName="Venue Types"
        />
      </div>
    </ModalContent>
  );
}
