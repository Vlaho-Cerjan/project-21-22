import React from 'react';

import MemoAdd from '@/src/icons/add';
import InputValidationAll from '@/src/utils/InputValidationAll';

import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalSelectLabelFuzzy from '../../common/modalSelectLabel/modalSelectLabelFuzzy';
import type {fakeArea} from '../../dataGrid/fakeData';

const signageData = [
  {id: '1', name: 'Holiday Signage', channels: 12, hours: 24},
  {id: '2', name: 'Safety Signage', channels: 6, hours: 12, recent: true},
  {id: '3', name: 'Other Signage', channels: 5, hours: 11, recent: true},
  {id: '4', name: 'Test Signage', channels: 12, hours: 30},
  {id: '5', name: 'Test 2 Signage', channels: 7, hours: 15},
  {id: '6', name: 'Test 3 Signage', channels: 8, hours: 22, recent: true},
  {id: '7', name: 'Test 4 Signage', channels: 23, hours: 19},
  {id: '8', name: 'Test 5 Signage', channels: 55, hours: 63, recent: true},
  {id: '9', name: 'Test 6 Signage', channels: 12, hours: 23},
  {id: '10', name: 'Test 7 Signage', channels: 5, hours: 9},
];

const scheduleData = [
  {id: '1', name: 'Test Schedule 1', channels: 12},
  {id: '2', name: 'Test Schedule 2', channels: 6, recent: true},
  {id: '3', name: 'Test Schedule 3', channels: 5},
  {id: '4', name: 'Test Schedule 4', channels: 8},
  {id: '5', name: 'Test Schedule 5', channels: 11, recent: true},
  {id: '6', name: 'Test Schedule 6', channels: 42},
  {id: '7', name: 'Test Schedule 7', channels: 20},
  {id: '8', name: 'Test Schedule 8', channels: 7, recent: true},
  {id: '9', name: 'Test Schedule 9', channels: 3},
  {id: '10', name: 'Test Schedule 10', channels: 10, recent: true},
];

const policyData = [
  {id: '1', name: 'Test Policy 1', recent: true},
  {id: '2', name: 'Test Policy 2'},
  {id: '3', name: 'Test Policy 3'},
  {id: '4', name: 'Test Policy 4'},
  {id: '5', name: 'Test Policy 5', recent: true},
  {id: '6', name: 'Test Policy 6'},
  {id: '7', name: 'Test Policy 7'},
  {id: '8', name: 'Test Policy 8', recent: true},
  {id: '9', name: 'Test Policy 9'},
  {id: '10', name: 'Test Policy 10', recent: true},
];

export default function DeviceAddVenueModal({
  areaData,
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    venueName: string;
    venueAddress: string;
    venueOther: string;
    venueSignage: string;
    venueSchedule: string;
    venuePolicy: string;
    venueAreaId: string;
  }) => 'error' | 'success';
  areaData: typeof fakeArea;
}) {
  const [venueName, setVenueName] = React.useState('');
  const [venueAddress, setVenueAddress] = React.useState('');
  const [venueOther, setVenueOther] = React.useState('');
  const [venueAreaId, setVenueAreaId] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [venueSignage, setVenueSignage] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [venueSchedule, setVenueSchedule] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [venuePolicy, setVenuePolicy] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isError, setIsError] = React.useState(false);

  const onSubmitClick = () => {
    const res = onSubmit({
      venueName,
      venueAddress,
      venueOther,
      venueSignage: venueSignage?.id || '',
      venueSchedule: venueSchedule?.id || '',
      venuePolicy: venuePolicy?.id || '',
      venueAreaId: venueAreaId?.id || '',
    });
    if (res === 'error') setIsError(true);
    else setOpen(false);
    return Promise.resolve(res);
  };

  const onChangeFn = (name: string) => {
    const input = document.querySelector(`input[name="${name}"]`);
    const errorEl = document.querySelector(`.errorContainer.${name}`);
    if (input) {
      InputValidationAll([input as HTMLInputElement], [errorEl]);
    }
  };

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setVenueName('');
        setVenueAddress('');
        setVenueOther('');
        setVenueSignage(null);
        setVenueSchedule(null);
        setVenuePolicy(null);
        setVenueAreaId(null);
        setIsError(false);
      }, 200);
    }
  }, [open]);

  React.useEffect(() => {
    if (venueSignage) onChangeFn('venueSignage');
  }, [venueSignage]);

  React.useEffect(() => {
    if (venueSchedule) onChangeFn('venueSchedule');
  }, [venueSchedule]);

  React.useEffect(() => {
    if (venuePolicy) onChangeFn('venuePolicy');
  }, [venuePolicy]);

  React.useEffect(() => {
    if (venueAreaId) onChangeFn('venueAreaId');
  }, [venueAreaId]);

  return (
    <Modal className="deviceAddVenueModal" open={open} setOpen={setOpen}>
      <ModalHeader
        title="Add Venue"
        description="Organize your devices under venues."
      />
      <ModalDivider />
      <div className="contentContainer">
        <ModalContent>
          <div className="formContainer">
            <div className="formControl">
              <ModalInputLabel
                labelText="Venue Name"
                labelProps={{
                  htmlFor: 'venueName',
                }}
                errorText="Venue name can not be empty"
                inputProps={{
                  name: 'venueName',
                  type: 'text',
                  required: true,
                  placeholder: 'Enter venue name',
                  value: venueName,
                  onChange: (e) => {
                    setVenueName(e.currentTarget.value);
                  },
                }}
              />
            </div>
            <div className="formControl">
              <ModalInputLabel
                labelText="Venue Address"
                labelProps={{
                  htmlFor: 'venueAddress',
                }}
                errorText="Venue address can not be empty"
                inputProps={{
                  name: 'venueAddress',
                  type: 'text',
                  required: true,
                  placeholder: 'Enter venue address',
                  value: venueAddress,
                  onChange: (e) => {
                    setVenueAddress(e.currentTarget.value);
                  },
                }}
              />
            </div>
            <div className="formControl">
              <ModalInputLabel
                labelText="Suite / Unit / Other"
                labelProps={{
                  htmlFor: 'venueOther',
                }}
                inputProps={{
                  name: 'venueOther',
                  type: 'text',
                  placeholder: 'Enter other information',
                  value: venueOther,
                  onChange: (e) => {
                    setVenueOther(e.currentTarget.value);
                  },
                }}
              />
            </div>
          </div>
        </ModalContent>
        <ModalDivider />
        <ModalContent>
          <div className="formContainer">
            <div className="formControl">
              <ModalSelectLabelFuzzy
                inputTestId="venueAreaId"
                labelText="Venue Area"
                labelProps={{
                  htmlFor: 'venueAreaId',
                }}
                errorText="Please select area"
                selectProps={{
                  id: 'venueAreaId',
                  name: 'venueAreaId',
                  value: venueAreaId?.id || '',
                  onChange: (e) => {
                    const data = areaData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setVenueAreaId(data || null);
                  },
                }}
                data={[{id: '', name: 'Select Area'}, ...areaData]}
                dropdownId="venueAreaIdDropdown"
                searchData={areaData}
                searchKeys={['name', 'channels', 'hours']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={venueAreaId || null}
                setValue={(tempData) => {
                  const data = areaData.find((item) => item.id === tempData.id);
                  setVenueAreaId(data || null);
                }}
                dataName="Area"
              />
            </div>
            <div className="formControl">
              <ModalSelectLabelFuzzy
                inputTestId="venueSignage"
                labelText="Venue Signage"
                labelProps={{
                  htmlFor: 'venueSignage',
                }}
                errorText="Please select signage"
                selectProps={{
                  id: 'venueSignage',
                  name: 'venueSignage',
                  required: true,
                  value: venueSignage?.id || '',
                  onChange: (e) => {
                    const data = signageData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setVenueSignage(data || null);
                  },
                }}
                data={[{id: '', name: 'Select Signage'}, ...signageData]}
                dropdownId="venueSignageDropdown"
                searchData={signageData}
                searchKeys={['name', 'channels', 'hours']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                  bottomLeft: 'channels',
                  topRight: 'hours',
                }}
                displayStartLimit={5}
                value={venueSignage || null}
                setValue={(tempData) => {
                  const data = signageData.find(
                    (item) => item.id === tempData.id,
                  );
                  setVenueSignage(data || null);
                }}
                dataName="Signage"
              />
            </div>
            <div className="formControl">
              <ModalSelectLabelFuzzy
                inputTestId="venueSchedule"
                labelText="Venue Schedule"
                labelProps={{
                  htmlFor: 'venueSchedule',
                }}
                errorText="Please select a schedule"
                selectProps={{
                  id: 'venueSchedule',
                  name: 'venueSchedule',
                  required: true,
                  value: venueSchedule?.id || '',
                  onChange: (e) => {
                    const data = scheduleData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setVenueSchedule(data || null);
                  },
                }}
                data={[{id: '', name: 'Select Schedule'}, ...scheduleData]}
                dropdownId="venueScheduleDropdown"
                searchData={scheduleData}
                searchKeys={['name', 'channels']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                  bottomLeft: 'channels',
                }}
                displayStartLimit={5}
                value={venueSchedule || null}
                setValue={(tempData) => {
                  const data = scheduleData.find(
                    (item) => item.id === tempData.id,
                  );
                  setVenueSchedule(data || null);
                }}
                dataName="Schedule"
              />
            </div>
            <div className="formControl">
              <ModalSelectLabelFuzzy
                inputTestId="venuePolicy"
                labelText="Venue Policy Override"
                labelProps={{
                  htmlFor: 'venuePolicy',
                }}
                errorText="Please select a policy"
                selectProps={{
                  id: 'venuePolicy',
                  name: 'venuePolicy',
                  required: true,
                  value: venuePolicy?.id || '',
                  onChange: (e) => {
                    const data = policyData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setVenuePolicy(data || null);
                  },
                }}
                data={[{id: '', name: 'Select Policy'}, ...policyData]}
                dropdownId="venuePolicyDropdown"
                searchData={policyData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={venuePolicy || null}
                setValue={(tempData) => {
                  const data = policyData.find(
                    (item) => item.id === tempData.id,
                  );
                  setVenuePolicy(data || null);
                }}
                dataName="Policy"
              />
            </div>
          </div>
        </ModalContent>
      </div>
      <ModalDivider />
      <ModalFooter
        setOpen={setOpen}
        isError={isError}
        setIsError={setIsError}
        modalClass="deviceAddVenueModal"
        buttonText="Add Venue"
        loadingText="Adding Venue"
        successText="Venue Added"
        onSubmit={() => onSubmitClick()}
        buttonIcon={<MemoAdd />}
      />
    </Modal>
  );
}
