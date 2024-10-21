import {useAppSelector} from '@/src/hooks';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {CreateAdminScreen} from '@/types/screens';
import {VenueAdminData} from '@/types/venues';
import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import ModalContent from '../../common/modal/modalContent';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalSelectLabel from '../../common/modalSelectLabel/modalSelectLabel';
import ModalSelectLabelServerFuzzy from '../../common/modalSelectLabel/modalSelectLabelServerFuzzy';
import ModalTextAreaLabel from '../../common/modalTextAreaLabel/modalTextAreaLabel';
import Title from '../../common/title/title';

const limit = 5;

const SearchVenues = async (search: string, businessId: string) => {
  const res = await ClientApiRequest({
    uri: `admin/venue/search?search=${search}&business_id=${businessId}&limit=${10}&offset=0`,
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

export default function CreateScreenFields({
  businessId,
  formData,
  setFormData,
}: {
  businessId: string;
  formData: CreateAdminScreen;
  setFormData: React.Dispatch<React.SetStateAction<CreateAdminScreen>>;
}) {
  const {enumData} = useAppSelector((state) => state.enum);

  const typeOptions = Object.entries(enumData?.device_type || {}).map(
    ([key, value]) => ({
      id: value,
      name: key.toLocaleLowerCase().replaceAll('_', ' '),
    }),
  );

  /*
  React.useEffect(() => {
    if (inventory && inventory.length > 0) {
      setFormData({
        ...formData,
        type: inventory[0]?.type || '',
      });
    }
  }, [inventory]);
  */

  React.useEffect(() => {
    if (typeOptions && typeOptions.length > 0) {
      setFormData({
        ...formData,
        type: typeOptions[0]?.id || 0,
      });
    }
  }, []);

  return (
    <>
      <ModalContent>
        <Title className="mB20">Venue Information</Title>
        <div className="formContainer">
          <ModalSelectLabelServerFuzzy<VenueAdminData>
            labelText="Venue"
            errorText="Venue is required."
            selectProps={{
              id: 'venue_id',
              name: 'venue_id',
              'data-testid': 'venue_id',
              required: true,
              value: formData?.venue_id || '',
              onChange: (e) => {
                setFormData({
                  ...formData,
                  venue_id: e.currentTarget.value,
                });
              },
            }}
            value={formData?.venue_id || ''}
            setValue={(value) => {
              setFormData({
                ...formData,
                venue_id: value,
              });
            }}
            dropdownId="venue_id"
            searchKeys={['name', 'address_1', 'phone_number', 'city', 'zip']}
            display={{
              topLeft: 'name',
              bottomLeft: 'description',
            }}
            displayStartLimit={limit}
            displayValue="name"
            dataName="Venues"
            inputTestId="venue_id_input"
            onSearch={async (search) => {
              const res = await SearchVenues(search, businessId);

              if (!res.success) {
                return {
                  success: false,
                  data: [],
                };
              }
              return {
                success: res.success,
                data: res.data.venues,
              };
            }}
          />
        </div>
        <ModalDivider />
        <Title className="mB20">Screen Information</Title>
        <div className="formContainer">
          <ModalInputLabel
            labelText="Name"
            errorText="Name is required."
            inputProps={{
              type: 'text',
              name: 'name',
              'data-testid': 'name',
              required: true,
              placeholder: 'Screen Name',
              value: formData?.name || '',
              onChange: (e) => {
                setFormData({
                  ...formData,
                  name: e.currentTarget.value,
                });
              },
            }}
          />
          <ModalInputLabel
            labelText="Unique Identifier"
            errorText="Unique Identifier is required."
            inputProps={{
              type: 'text',
              name: 'unique_identifier',
              'data-testid': 'unique_identifier',
              required: true,
              placeholder: 'MAC Address or similar data',
              value: formData?.unique_identifier || '',
              onChange: (e) => {
                setFormData({
                  ...formData,
                  unique_identifier: e.currentTarget.value,
                });
              },
            }}
          />
          <ModalSelectLabel
            labelText="Type"
            errorText="Type is required."
            selectProps={{
              name: 'type',
              'data-testid': 'type',
              required: true,
              value: formData?.type || 0,
              onChange: (e) => {
                console.log('e.currentTarget.value', e.currentTarget.value);
                setFormData({
                  ...formData,
                  // @ts-expect-error value is a string
                  type: e.currentTarget.value,
                });
              },
            }}
            data={typeOptions}
          />
          <ModalTextAreaLabel
            labelText="Notes"
            textareaProps={{
              name: 'notes',
              'data-testid': 'notes',
              //required: true,
              placeholder: 'Notes',
              value: formData?.notes?.screen_notes || '',
              onChange: (e) => {
                setFormData({
                  ...formData,
                  notes: {
                    screen_notes: e.currentTarget.value,
                  },
                });
              },
            }}
          />
        </div>
      </ModalContent>
    </>
  );
}
