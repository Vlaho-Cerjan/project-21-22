import {screenSettingsKeys, type UpdateUserScreen} from '@/types/screens';
import React from 'react';
import Checkmark from '../../common/checkmark/checkmark';
import {ModalDivider} from '../../common/divider/divider';
import ModalContent from '../../common/modal/modalContent';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import Title from '../../common/title/title';

export default function ScreenFields({
  formData,
  setFormData,
}: {
  formData: UpdateUserScreen;
  setFormData: React.Dispatch<React.SetStateAction<UpdateUserScreen>>;
}) {
  return (
    <>
      <ModalContent>
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
        </div>
        <ModalDivider />
        <Title className="mB20">Screen Settings</Title>
        <div className="settingsContainer">
          {screenSettingsKeys.map((key) => {
            const formDataSettings = Object.entries(formData.settings).filter(
              ([k]) => k.includes(key),
            );

            return (
              <div key={key} className="settingsItem">
                <Title className="small">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </Title>
                <div className="flexWrapContainer">
                  {formDataSettings.map(([k, v]) => {
                    const splitTitle = k.split('_');
                    const title =
                      key === 'rating'
                        ? splitTitle[1]?.toUpperCase()
                        : (splitTitle[1]?.charAt(0).toUpperCase() || '') +
                          (splitTitle[1]?.slice(1) || '');
                    return (
                      <Checkmark
                        key={k}
                        title={title}
                        value={v === 1}
                        setValue={(value) => {
                          setFormData({
                            ...formData,
                            settings: {
                              ...formData.settings,
                              [k]: value ? 1 : 0,
                            },
                          });
                        }}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ModalContent>
    </>
  );
}
