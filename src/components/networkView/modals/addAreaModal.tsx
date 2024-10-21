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
import {policyData, scheduleData, signageData} from '../../dataGrid/fakeData';

export default function DeviceAddAreaModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    areaName: string;
    areaSignage: string;
    areaSchedule: string;
    areaPolicy: string;
  }) => 'error' | 'success';
}) {
  const [areaName, setAreaName] = React.useState('');
  const [areaSignage, setAreaSignage] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [areaSchedule, setAreaSchedule] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [areaPolicy, setAreaPolicy] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isError, setIsError] = React.useState(false);

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
        setAreaName('');
        setAreaSignage(null);
        setAreaSchedule(null);
        setAreaPolicy(null);
        setIsError(false);
      }, 200);
    }
  }, [open]);

  React.useEffect(() => {
    if (areaSignage) onChangeFn('areaSignage');
  }, [areaSignage]);

  React.useEffect(() => {
    if (areaSchedule) onChangeFn('areaSchedule');
  }, [areaSchedule]);

  React.useEffect(() => {
    if (areaPolicy) onChangeFn('areaPolicy');
  }, [areaPolicy]);

  const onSubmitClick = () => {
    const res = onSubmit({
      areaName,
      areaSignage: areaSignage?.id || '',
      areaSchedule: areaSchedule?.id || '',
      areaPolicy: areaPolicy?.id || '',
    });
    if (res === 'error') setIsError(true);
    else setOpen(false);
    return Promise.resolve(res);
  };

  return (
    <Modal className="deviceAddAreaModal" open={open} setOpen={setOpen}>
      <ModalHeader
        title="Add Area"
        description="Organize your devices under areas."
      />
      <ModalDivider />
      <div className="contentContainer">
        <ModalContent>
          <div className="formContainer">
            <div className="formControl">
              <ModalInputLabel
                labelText="Area Name"
                errorText="Area name can not be empty"
                inputProps={{
                  name: 'areaName',
                  type: 'text',
                  required: true,
                  placeholder: 'Enter area name',
                  value: areaName,
                  onChange: (e) => {
                    setAreaName(e.currentTarget.value);
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
                inputTestId="areaSignage"
                labelText="Area Signage"
                labelProps={{
                  htmlFor: 'areaSignage',
                }}
                errorText="Please select signage"
                selectProps={{
                  id: 'areaSignage',
                  name: 'areaSignage',
                  required: true,
                  value: areaSignage?.id || '',
                  onChange: (e) => {
                    const data = signageData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setAreaSignage(data || null);
                  },
                }}
                data={[{id: '', name: 'Select Signage'}, ...signageData]}
                dropdownId="areaSignageDropdown"
                searchData={signageData}
                searchKeys={['name', 'channels', 'hours']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                  bottomLeft: 'channels',
                  bottomRight: 'hours',
                }}
                displayStartLimit={5}
                value={areaSignage || null}
                setValue={(tempData) => {
                  const data = signageData.find(
                    (item) => item.id === tempData.id,
                  );
                  setAreaSignage(data || null);
                }}
                dataName="Signage"
              />
            </div>
            <div className="formControl">
              <ModalSelectLabelFuzzy
                inputTestId="areaSchedule"
                labelText="Area Schedule"
                labelProps={{
                  htmlFor: 'areaSchedule',
                }}
                errorText="Please select a schedule"
                selectProps={{
                  id: 'areaSchedule',
                  name: 'areaSchedule',
                  required: true,
                  value: areaSchedule?.id || '',
                  onChange: (e) => {
                    const data = scheduleData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setAreaSchedule(data || null);
                  },
                }}
                data={[{id: '', name: 'Select Schedule'}, ...scheduleData]}
                dropdownId="areaScheduleDropdown"
                searchData={scheduleData}
                searchKeys={['name', 'channels']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                  bottomLeft: 'channels',
                }}
                displayStartLimit={5}
                value={areaSchedule || null}
                setValue={(tempData) => {
                  const data = scheduleData.find(
                    (item) => item.id === tempData.id,
                  );
                  setAreaSchedule(data || null);
                }}
                dataName="Schedule"
              />
            </div>
            <div className="formControl">
              <ModalSelectLabelFuzzy
                inputTestId="areaPolicy"
                labelText="Area Policy Override"
                labelProps={{
                  htmlFor: 'areaPolicy',
                }}
                errorText="Please select a policy"
                selectProps={{
                  id: 'areaPolicy',
                  name: 'areaPolicy',
                  required: true,
                  value: areaPolicy?.id || '',
                  onChange: (e) => {
                    const data = policyData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setAreaPolicy(data || null);
                  },
                }}
                data={[{id: '', name: 'Select Policy'}, ...policyData]}
                dropdownId="areaPolicyDropdown"
                searchData={policyData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={areaPolicy || null}
                setValue={(tempData) => {
                  const data = policyData.find(
                    (item) => item.id === tempData.id,
                  );
                  setAreaPolicy(data || null);
                }}
                dataName="Policy"
              />
            </div>
          </div>
        </ModalContent>
      </div>
      <ModalDivider />
      <ModalFooter
        noBackButton
        setOpen={setOpen}
        isError={isError}
        setIsError={setIsError}
        modalClass="deviceAddAreaModal"
        buttonText="Add Area"
        loadingText="Adding Area"
        successText="Area Added"
        buttonIcon={<MemoAdd />}
        onSubmit={() => onSubmitClick()}
      />
    </Modal>
  );
}
