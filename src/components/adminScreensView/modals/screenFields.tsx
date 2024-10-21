import {useAppSelector} from '@/src/hooks';
import {screenSettingsKeys, UpdateAdminScreen} from '@/types/screens';
import React from 'react';
import Checkmark from '../../common/checkmark/checkmark';
import {ModalDivider} from '../../common/divider/divider';
import ModalContent from '../../common/modal/modalContent';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalSelectLabel from '../../common/modalSelectLabel/modalSelectLabel';
import ModalTextAreaLabel from '../../common/modalTextAreaLabel/modalTextAreaLabel';
import Title from '../../common/title/title';

export default function ScreenFields({
  formData,
  setFormData,
}: {
  formData: UpdateAdminScreen;
  setFormData: React.Dispatch<React.SetStateAction<UpdateAdminScreen>>;
}) {
  const {enumData} = useAppSelector((state) => state.enum);

  const screenStatus = Object.entries(enumData?.screen_status || {}).map(
    ([name, id]) => ({
      id,
      name,
    }),
  );

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
          <ModalInputLabel
            labelText="Shipping City"
            errorText="Shipping City is required."
            inputProps={{
              type: 'text',
              name: 'shipping_city',
              'data-testid': 'shipping_city',
              required: true,
              placeholder: 'Shipping City',
              value: formData?.shipping_city || '',
              onChange: (e) => {
                setFormData({
                  ...formData,
                  shipping_city: e.currentTarget.value,
                });
              },
            }}
          />
          <ModalSelectLabel
            labelText="Status"
            errorText="Status is required."
            selectProps={{
              name: 'status',
              'data-testid': 'status',
              required: true,
              value: formData.status,
              onChange: (e) => {
                setFormData({
                  ...formData,
                  // @ts-expect-error value is a string
                  status: e.currentTarget.value,
                });
              },
            }}
            data={screenStatus}
          />
          {/* notes */}
          <ModalTextAreaLabel
            labelText="Notes"
            errorText="Notes is required."
            textareaProps={{
              name: 'notes',
              'data-testid': 'notes',
              required: true,
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
        <ModalDivider />
        <Title className="mB20">Screen Settings</Title>
        <div className="settingsContainer">
          <div className="settingsItem">
            <Title className="small">General</Title>
            <div>
              <Checkmark
                title="Dooh Enabled"
                value={formData.dooh_enabled === 1}
                setValue={(value) => {
                  setFormData({
                    ...formData,
                    dooh_enabled: value ? 1 : 0,
                  });
                }}
              />
              {/*
              <Checkmark
                title="Active"
                value={formData.status === 1}
                setValue={(value) => {
                  setFormData({
                    ...formData,
                    status: value ? 1 : 0,
                  });
                }}
              />
              */}
            </div>
          </div>
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
