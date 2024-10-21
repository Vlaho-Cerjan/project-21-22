import type {VenueUserData} from '@/types/venues';
import React from 'react';
import ModalContent from '../../common/modal/modalContent';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalTextAreaLabel from '../../common/modalTextAreaLabel/modalTextAreaLabel';
import Title from '../../common/title/title';

export default function EditVenueFields({
  formData,
  setFormData,
}: {
  formData: Partial<VenueUserData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<VenueUserData>>>;
}) {
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
      </div>
    </ModalContent>
  );
}
