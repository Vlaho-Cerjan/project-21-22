import React from 'react';

import MemoAdd from '@/src/icons/add';

import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalSelectLabelFuzzy from '../../common/modalSelectLabel/modalSelectLabelFuzzy';
import type {fakeArea, fakeVenue} from '../../dataGrid/fakeData';

export default function DeviceAddDeviceModal({
  open,
  setOpen,
  onSubmit,
  areaData,
  venueData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    deviceName: string;
    venue: string;
    area: string;
  }) => 'error' | 'success';
  areaData: typeof fakeArea;
  venueData: typeof fakeVenue;
}) {
  const [deviceName, setDeviceName] = React.useState('');
  const [area, setArea] = React.useState({
    id: '',
    name: '',
  });
  const [venue, setVenue] = React.useState({
    id: '',
    name: '',
  });
  const [isError, setIsError] = React.useState(false);
  const [venueDataState, setVenueDataState] = React.useState(venueData);

  const onSubmitClick = () => {
    const res = onSubmit({
      deviceName,
      area: area.name,
      venue: venue.name,
    });
    if (res === 'error') setIsError(true);
    else setOpen(false);
    return Promise.resolve(res);
  };

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setDeviceName('');
        setIsError(false);
      }, 200);
    }
  }, [open]);

  React.useEffect(() => {
    if (area.id !== '') {
      const filteredVenues = venueData.filter(
        (item) => item.areaId === area.id,
      );
      setVenueDataState(filteredVenues);
    } else {
      setVenueDataState(venueData);
    }
  }, [area]);

  return (
    <Modal className="deviceAddDeviceModal" open={open} setOpen={setOpen}>
      <ModalHeader
        title="Add Device"
        description="Add a new device to this venue."
      />
      <ModalDivider />
      <div className="contentContainer">
        <ModalContent>
          <div className="formContainer">
            <div className="formControl">
              <ModalInputLabel
                labelText="Device Name"
                labelProps={{
                  htmlFor: 'deviceName',
                }}
                errorText="Device name can not be empty"
                inputProps={{
                  name: 'deviceName',
                  type: 'text',
                  required: true,
                  placeholder: 'Enter device name',
                  value: deviceName,
                  onChange: (e) => {
                    setDeviceName(e.currentTarget.value);
                  },
                }}
              />
            </div>
            <div className="formControl">
              <ModalSelectLabelFuzzy
                inputTestId="deviceArea"
                labelText="Device Area"
                labelProps={{
                  htmlFor: 'deviceArea',
                }}
                errorText="Device area can not be empty"
                selectProps={{
                  name: 'deviceArea',
                  required: true,
                  value: area.id,
                  onChange: (e) => {
                    const fakeAreaItem = areaData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    if (fakeAreaItem)
                      setArea({
                        id: fakeAreaItem.id,
                        name: fakeAreaItem.name,
                      });
                  },
                }}
                data={[
                  {
                    id: '',
                    name: 'Select Device Area',
                  },
                  ...areaData.map((item) => ({
                    id: item.id,
                    name: item.name,
                  })),
                ]}
                searchData={areaData.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                dropdownId="deviceAreaDropdown"
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={area}
                setValue={setArea}
                dataName="Device Area"
              />
            </div>
            <div className="formControl">
              <ModalSelectLabelFuzzy
                inputTestId="deviceVenue"
                labelText="Device Venue"
                labelProps={{
                  htmlFor: 'deviceVenue',
                }}
                selectProps={{
                  name: 'deviceVenue',
                  value: venue.id,
                  onChange: (e) => {
                    const fakeVenueItem = venueData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    if (fakeVenueItem)
                      setArea({
                        id: fakeVenueItem.id,
                        name: fakeVenueItem.name,
                      });
                  },
                }}
                data={[
                  {
                    id: '',
                    name: 'Select Device Venue',
                  },
                  ...venueDataState.map((item) => ({
                    id: item.id,
                    name: item.name,
                  })),
                ]}
                searchData={venueDataState.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                dropdownId="deviceVenueDropdown"
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={venue}
                setValue={setVenue}
                dataName="Device Venue"
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
        modalClass="deviceAddDeviceModal"
        buttonText="Add Device"
        loadingText="Adding ..."
        successText="Device Added"
        onSubmit={() => onSubmitClick()}
        buttonIcon={<MemoAdd />}
      />
    </Modal>
  );
}
