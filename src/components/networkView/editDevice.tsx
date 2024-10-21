'use client';

import 'swiper/css';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import {toast} from 'react-toastify';
import type {SliderData, TextSliderData} from 'types/slideDataType';
import {useWindowSize} from 'usehooks-ts';

import Button from '@/src/components/common/button/button';
import ClearButton from '@/src/components/common/button/clearButton';
import NoStyleButton from '@/src/components/common/button/noStyleButton';
import WhiteButton from '@/src/components/common/button/whiteButton';
import Description from '@/src/components/common/description/description';
import {ModalDivider} from '@/src/components/common/divider/divider';
import Label from '@/src/components/common/label/label';
import ModalInputLabel from '@/src/components/common/modalInputLabel/modalInputLabel';
import ModalSelectLabelFuzzy from '@/src/components/common/modalSelectLabel/modalSelectLabelFuzzy';
import Title from '@/src/components/common/title/title';
import {fakeArea, fakeVenue} from '@/src/components/dataGrid/fakeData';
import MemoDown from '@/src/icons/down';
import MemoGlobePin from '@/src/icons/globe-pin';
import MemoImageGrid from '@/src/icons/image-grid';
import MemoProjectPlayerDevices from '@/src/icons/project-player-devices';
import MemoMove from '@/src/icons/move';
import MemoRightThin from '@/src/icons/right-thin';
import MemoSave from '@/src/icons/save';
import MemoTrash from '@/src/icons/trash';
import MemoVenues from '@/src/icons/venues';

import SignageSliderSkeleton from './slider/signageSliderSkeleton';

const SignageSliderLazy = dynamic(() => import('./slider/signageSlider'), {
  ssr: false,
  loading: () => <SignageSliderSkeleton />,
});

const MoveDeviceLazy = dynamic(
  () => import('./sidebars/moveDevice/moveDevice'),
  {
    ssr: false,
  },
);

const AssetMediaLazy = dynamic(() => import('./modals/assetMedia'), {
  ssr: false,
});

const DeviceUnlinkDeviceModalLazy = dynamic(
  () => import('./modals/unlinkDeviceModal'),
  {
    ssr: false,
  },
);

export interface SearchParams {
  folderId?: string;
}

export default function EditDevice({params}: {params: {deviceId: string}}) {
  console.log(params.deviceId);
  const [openUnlinkDeviceModal, setOpenUnlinkDeviceModal] =
    React.useState(false);
  const [openMediaAssetModal, setOpenMediaAssetModal] = React.useState(false);
  const {width} = useWindowSize();

  const networkSignageData = [
    {
      name: 'Network Signage',
      id: '1',
      type: 'networkSignage',
    },
    {
      name: 'Network Signage 2',
      id: '2',
      type: 'networkSignage',
    },
  ];

  const venueSignageData = [
    {
      name: 'Venue Signage',
      id: '1',
      type: 'venueSignage',
    },
    {
      name: 'Venue Signage 2',
      id: '2',
      type: 'venueSignage',
    },
  ];

  const areaSignageData = [
    {
      name: 'Area Signage',
      id: '1',
      type: 'areaSignage',
    },
    {
      name: 'Area Signage 2',
      id: '2',
      type: 'areaSignage',
    },
  ];

  const networkScheduleData = [
    {
      name: 'Network Schedule',
      id: '1',
      type: 'networkSchedule',
    },
    {
      name: 'Network Schedule 2',
      id: '2',
      type: 'networkSchedule',
    },
  ];

  const venueScheduleData = [
    {
      name: 'Venue Schedule',
      id: '1',
      type: 'venueSchedule',
    },
    {
      name: 'Venue Schedule 2',
      id: '2',
      type: 'venueSchedule',
    },
  ];

  const areaScheduleData = [
    {
      name: 'Area Schedule',
      id: '1',
      type: 'areaSchedule',
    },
    {
      name: 'Area Schedule 2',
      id: '2',
      type: 'areaSchedule',
    },
  ];

  const deviceScheduleData = [
    {
      name: 'Device Schedule',
      id: '1',
      type: 'deviceSchedule',
    },
    {
      name: 'Device Schedule 2',
      id: '2',
      type: 'deviceSchedule',
    },
  ];

  const networkPolicyData = [
    {
      name: 'Network Policy',
      id: '1',
      type: 'networkPolicy',
    },
    {
      name: 'Network Policy 2',
      id: '2',
      type: 'networkPolicy',
    },
  ];

  const venuePolicyData = [
    {
      name: 'Venue Policy',
      id: '1',
      type: 'venuePolicy',
    },
    {
      name: 'Venue Policy 2',
      id: '2',
      type: 'venuePolicy',
    },
  ];

  const areaPolicyData = [
    {
      name: 'Area Policy',
      id: '1',
      type: 'areaPolicy',
    },
    {
      name: 'Area Policy 2',
      id: '2',
      type: 'areaPolicy',
    },
  ];

  const devicePolicyData = [
    {
      name: 'Device Policy',
      id: '1',
      type: 'devicePolicy',
    },
    {
      name: 'Device Policy 2',
      id: '2',
      type: 'devicePolicy',
    },
  ];

  const [deviceData, setDeviceData] = React.useState({
    id: '1',
    name: 'Project Player 1',
    area: 'southern_california',
    venue: 'san_diego',
    nowPlaying: 'The Beatles - Hey Jude',
    status: 'Online',
    lastActive: '2 hours ago',
    macAddress: '80:97:33:06:DC:8C',
    activationCode: '420389',
    logo: '/assets/images/mcdonalds.png',
    rewards: [
      {
        month: 'JUL',
        progress: '80',
      },
      {
        month: 'AUG',
        progress: '100',
      },
      {
        month: 'SEP',
        progress: '50',
      },
    ],
    deviceType: 'Project Player',
    mode: 'Production',
    build: '105.0476',
    cachedVideos: '435',
    freeSpace: '3.2GB',
    speed: '35Mbps',
    temperature: '96°',
    networkSignage: '1',
    venueSignage: '1',
    areaSignage: '1',
    networkSchedule: '1',
    venueSchedule: '1',
    areaSchedule: '1',
    deviceSchedule: '1',
    networkPolicy: '1',
    venuePolicy: '1',
    areaPolicy: '1',
    devicePolicy: '1',
  });

  const breadcrumbs = React.useMemo(() => {
    const areaBreadcrumb = fakeArea.find((item) => item.id === deviceData.area);
    const venueBreadcrumb = fakeVenue.find(
      (item) => item.id === deviceData.venue,
    );
    return [
      {
        id: areaBreadcrumb?.id || '',
        name: areaBreadcrumb?.name || '',
        type: 'area',
      },
      {
        id: venueBreadcrumb?.id || '',
        name: venueBreadcrumb?.name || '',
        type: 'venue',
      },
    ];
  }, [deviceData]);

  const [deviceName, setDeviceName] = React.useState(deviceData.name);
  const [networkSignage, setNetworkSignage] = React.useState(
    networkSignageData.find((item) => item.id === deviceData.networkSignage),
  );
  const [venueSignage, setVenueSignage] = React.useState(
    venueSignageData.find((item) => item.id === deviceData.venueSignage),
  );
  const [areaSignage, setAreaSignage] = React.useState(
    areaSignageData.find((item) => item.id === deviceData.areaSignage),
  );
  const [networkSchedule, setNetworkSchedule] = React.useState(
    networkScheduleData.find((item) => item.id === deviceData.networkSchedule),
  );
  const [venueSchedule, setVenueSchedule] = React.useState(
    venueScheduleData.find((item) => item.id === deviceData.venueSchedule),
  );
  const [areaSchedule, setAreaSchedule] = React.useState(
    areaScheduleData.find((item) => item.id === deviceData.areaSchedule),
  );
  const [deviceSchedule, setDeviceSchedule] = React.useState(
    deviceScheduleData.find((item) => item.id === deviceData.deviceSchedule),
  );
  const [networkPolicy, setNetworkPolicy] = React.useState(
    networkPolicyData.find((item) => item.id === deviceData.networkPolicy),
  );
  const [venuePolicy, setVenuePolicy] = React.useState(
    venuePolicyData.find((item) => item.id === deviceData.venuePolicy),
  );
  const [areaPolicy, setAreaPolicy] = React.useState(
    areaPolicyData.find((item) => item.id === deviceData.areaPolicy),
  );
  const [devicePolicy, setDevicePolicy] = React.useState(
    devicePolicyData.find((item) => item.id === deviceData.devicePolicy),
  );
  const [unlockPassword, setUnlockPassword] = React.useState('');
  const [locked, setLocked] = React.useState(true);

  const [textSlideData, setTextSlideData] = React.useState<TextSliderData>({
    id: '1',
    timing: '1',
    slides: [
      {
        id: '1',
        order: 1,
        data: {
          id: '8',
          name: 'Media 5',
          type: 'text',
          text: 'Text Signage Data',
          size: 4,
          updated_at: '2021-08-10T00:00:00.000Z',
          orgHierarchy: ['Media 5'],
        },
        textColor: '#fff',
        backgroundColor: '#323234',
      },
      {
        id: '2',
        order: 2,
        data: {
          id: '11',
          name: 'Media 8',
          type: 'text',
          text: '🍟 Free Fries Now. Free McDonalds Later 🍟',
          size: 5,
          updated_at: '2021-08-10T00:00:00.000Z',
          orgHierarchy: ['Media 8'],
        },
        textColor: '#323234',
        backgroundColor: '#fff',
      },
      {
        id: '3',
        order: 3,
        data: {
          id: '14',
          name: 'Media 11',
          type: 'text',
          text: 'The Cardi B & Offset Meal',
          size: 5,
          updated_at: '2021-08-10T00:00:00.000Z',
          orgHierarchy: ['Media 11'],
        },
        textColor: '#fff',
        backgroundColor: '#323234',
      },
    ],
  });

  const [slideData, setSlideData] = React.useState<SliderData>({
    id: '1',
    timing: '3',
    slides: [
      {
        id: '1',
        order: 1,
        data: {
          id: '1',
          name: 'Media 1',
          type: 'image',
          url: '/assets/images/mcd1.png',
          size: 4234,
          updated_at: '2021-08-10T00:00:00.000Z',
          orgHierarchy: ['Media 1'],
        },
      },
      {
        id: '2',
        order: 2,
        data: {
          id: '2',
          name: 'Media 2',
          type: 'image',
          url: '/assets/images/mcd2.png',
          size: 1234,
          updated_at: '2021-08-10T00:00:00.000Z',
          orgHierarchy: ['Media 2'],
        },
      },
      {
        id: '3',
        order: 3,
        data: {
          id: '3',
          name: 'Media 3',
          type: 'image',
          url: '/assets/images/mcd3.png',
          size: 2324,
          updated_at: '2021-08-10T00:00:00.000Z',
          orgHierarchy: ['Media 3'],
        },
      },
    ],
  });

  const [openStatistics, setOpenStatistics] = React.useState(false);

  React.useEffect(() => {
    console.log(typeof setLocked);
  }, []);

  React.useEffect(() => {
    const sidebarStatisticsContainer = document.getElementById(
      'sidebarStatisticsContainer',
    );

    if (sidebarStatisticsContainer) {
      if (width <= 992) {
        // set height base on 'openStatistics' state
        const height = openStatistics
          ? sidebarStatisticsContainer.children[0]?.clientHeight
          : 0;

        sidebarStatisticsContainer.style.height = `${height}px`;
      } else {
        sidebarStatisticsContainer.style.height = `auto`;
      }
    }
  }, [openStatistics, width]);

  const [openDeviceMove, setOpenDeviceMove] = React.useState(false);
  const [openDeviceMoveDelay, setOpenDeviceMoveDelay] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setOpenDeviceMoveDelay(true);
    }, 500);
  }, []);

  return (
    <div className="editDevicePageContainer">
      <Title className="big pageTitle">{deviceData.name}</Title>
      <div className="editDeviceContainer">
        <div className="editDevice">
          <div className="editDeviceHeader">
            <div className="breadcrumbsContainer">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={item.id}>
                  <Link href="#" className="breadcrumb link">
                    {item.type === 'area' && <MemoGlobePin />}
                    {item.type === 'venue' && <MemoVenues />}
                    <Title title={item.name}>{item.name}</Title>
                  </Link>
                  {index !== breadcrumbs.length - 1 && (
                    <div className="breadcrumbSeparator">
                      <MemoRightThin />
                    </div>
                  )}
                </React.Fragment>
              ))}
              <div className="breadcrumbSeparator">
                <MemoRightThin />
              </div>
              <div className="breadcrumb">
                <Title title={deviceData.name}>{deviceData.name}</Title>
              </div>
              <WhiteButton
                onClick={() => setOpenDeviceMove(true)}
                className="changeDeviceButton"
              >
                <MemoMove />
                Move Device
              </WhiteButton>
            </div>
            <div className="projectPlayerIconContainer">
              <MemoProjectPlayerDevices className="deviceIcon" />
              <div className="shadowIcon" />
            </div>
          </div>
          <ModalDivider />
          <div className="formContainer">
            <div className="row">
              <ModalInputLabel
                labelText="Device Name"
                inputProps={{
                  required: true,
                  placeholder: 'Enter Device Name',
                  value: deviceName,
                  onChange: (e) => setDeviceName(e.currentTarget.value),
                }}
                errorText="Device Name is required"
              />
              <ModalInputLabel
                labelText="Unlock Password"
                inputProps={{
                  placeholder: 'Enter Unlock Password',
                  value: unlockPassword,
                  type: 'password',
                  onChange: (e) => setUnlockPassword(e.currentTarget.value),
                }}
                errorText="Unlock Password is incorrect"
              />
            </div>
          </div>
          <ModalDivider />
          <div className="formContainer">
            <div className="row">
              <ModalSelectLabelFuzzy
                inputTestId="networkSignage"
                labelText="Network Signage"
                labelProps={{
                  htmlFor: 'networkSignage',
                }}
                errorText="Please select network signage"
                selectProps={{
                  id: 'networkSignage',
                  name: 'networkSignage',
                  required: true,
                  value: networkSignage?.id || '',
                  onChange: (e) => {
                    const data = networkSignageData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setNetworkSignage(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Network Singage'},
                  ...networkSignageData,
                ]}
                dropdownId="networkSignageDropdown"
                searchData={networkSignageData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={networkSignage || null}
                setValue={(tempData) => {
                  const data = networkSignageData.find(
                    (item) => item.id === tempData.id,
                  );
                  setNetworkSignage(data || undefined);
                }}
                dataName="Network Signage"
                locked={locked}
              />
              <ModalSelectLabelFuzzy
                inputTestId="areaSignage"
                labelText="Area Signage"
                labelProps={{
                  htmlFor: 'areaSignage',
                }}
                errorText="Please select area signage"
                selectProps={{
                  id: 'areaSignage',
                  name: 'areaSignage',
                  required: true,
                  value: areaSignage?.id || '',
                  onChange: (e) => {
                    const data = areaSignageData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setAreaSignage(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Area Singage'},
                  ...areaSignageData,
                ]}
                dropdownId="areaSignageDropdown"
                searchData={areaSignageData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={areaSignage || null}
                setValue={(tempData) => {
                  const data = areaSignageData.find(
                    (item) => item.id === tempData.id,
                  );
                  setAreaSignage(data || undefined);
                }}
                dataName="Area Signage"
                locked={locked}
              />
            </div>
            <div className="row">
              <ModalSelectLabelFuzzy
                inputTestId="venueSignage"
                labelText="Venue Signage"
                labelProps={{
                  htmlFor: 'venueSignage',
                }}
                errorText="Please select venue signage"
                selectProps={{
                  id: 'venueSignage',
                  name: 'venueSignage',
                  required: true,
                  value: venueSignage?.id || '',
                  onChange: (e) => {
                    const data = venueSignageData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setVenueSignage(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Venue Singage'},
                  ...venueSignageData,
                ]}
                dropdownId="venueSignageDropdown"
                searchData={venueSignageData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={venueSignage || null}
                setValue={(tempData) => {
                  const data = venueSignageData.find(
                    (item) => item.id === tempData.id,
                  );
                  setVenueSignage(data || undefined);
                }}
                dataName="Venue Signage"
                locked={locked}
              />
              <div className="formControl" />
            </div>
            <div className="row sliderRow">
              <Label htmlFor="editSignageSlider" className="signageSliderLabel">
                Device Specific Signage
              </Label>
              <SignageSliderLazy
                mediaData={slideData}
                setMediaData={setSlideData}
                textData={textSlideData}
                setTextData={setTextSlideData}
                type="device"
              />
            </div>
          </div>
          <ModalDivider />
          <div className="formContainer">
            <div className="row">
              <ModalSelectLabelFuzzy
                inputTestId="networkSchedule"
                labelText="Network Schedule Override"
                labelProps={{
                  htmlFor: 'networkSchedule',
                }}
                errorText="Please select network schedule"
                selectProps={{
                  id: 'networkSchedule',
                  name: 'networkSchedule',
                  required: true,
                  value: networkSchedule?.id || '',
                  onChange: (e) => {
                    const data = networkScheduleData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setNetworkSchedule(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Network Singage'},
                  ...networkScheduleData,
                ]}
                dropdownId="networkScheduleDropdown"
                searchData={networkScheduleData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={networkSchedule || null}
                setValue={(tempData) => {
                  const data = networkScheduleData.find(
                    (item) => item.id === tempData.id,
                  );
                  setNetworkSchedule(data || undefined);
                }}
                dataName="Network Schedule"
                locked={locked}
              />
              <ModalSelectLabelFuzzy
                inputTestId="areaSchedule"
                labelText="Area Schedule Override"
                labelProps={{
                  htmlFor: 'areaSchedule',
                }}
                errorText="Please select area schedule"
                selectProps={{
                  id: 'areaSchedule',
                  name: 'areaSchedule',
                  required: true,
                  value: areaSchedule?.id || '',
                  onChange: (e) => {
                    const data = areaScheduleData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setAreaSchedule(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Area Schedule'},
                  ...areaScheduleData,
                ]}
                dropdownId="areaScheduleDropdown"
                searchData={areaScheduleData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={areaSchedule || null}
                setValue={(tempData) => {
                  const data = areaScheduleData.find(
                    (item) => item.id === tempData.id,
                  );
                  setAreaSchedule(data || undefined);
                }}
                dataName="Area Schedule"
                locked={locked}
              />
            </div>
            <div className="row">
              <ModalSelectLabelFuzzy
                inputTestId="venueSchedule"
                labelText="Venue Schedule Override"
                labelProps={{
                  htmlFor: 'venueSchedule',
                }}
                errorText="Please select venue schedule"
                selectProps={{
                  id: 'venueSchedule',
                  name: 'venueSchedule',
                  required: true,
                  value: venueSchedule?.id || '',
                  onChange: (e) => {
                    const data = venueScheduleData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setVenueSchedule(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Venue Singage'},
                  ...venueScheduleData,
                ]}
                dropdownId="venueScheduleDropdown"
                searchData={venueScheduleData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={venueSchedule || null}
                setValue={(tempData) => {
                  const data = venueScheduleData.find(
                    (item) => item.id === tempData.id,
                  );
                  setVenueSchedule(data || undefined);
                }}
                dataName="Venue Schedule"
                locked={locked}
              />
              <ModalSelectLabelFuzzy
                inputTestId="deviceSchedule"
                labelText="Device Schedule Override"
                labelProps={{
                  htmlFor: 'deviceSchedule',
                }}
                errorText="Please select device schedule"
                selectProps={{
                  id: 'deviceSchedule',
                  name: 'deviceSchedule',
                  required: true,
                  value: deviceSchedule?.id || '',
                  onChange: (e) => {
                    const data = deviceScheduleData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setDeviceSchedule(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Device Schedule'},
                  ...deviceScheduleData,
                ]}
                dropdownId="deviceScheduleDropdown"
                searchData={deviceScheduleData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={deviceSchedule || null}
                setValue={(tempData) => {
                  const data = deviceScheduleData.find(
                    (item) => item.id === tempData.id,
                  );
                  setDeviceSchedule(data || undefined);
                }}
                dataName="Device Schedule"
              />
            </div>
          </div>
          <ModalDivider />
          <div className="formContainer">
            <div className="row">
              <ModalSelectLabelFuzzy
                inputTestId="networkPolicy"
                labelText="Network Policy Override"
                labelProps={{
                  htmlFor: 'networkPolicy',
                }}
                errorText="Please select network policy"
                selectProps={{
                  id: 'networkPolicy',
                  name: 'networkPolicy',
                  required: true,
                  value: networkPolicy?.id || '',
                  onChange: (e) => {
                    const data = networkPolicyData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setNetworkPolicy(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Network Singage'},
                  ...networkPolicyData,
                ]}
                dropdownId="networkPolicyDropdown"
                searchData={networkPolicyData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={networkPolicy || null}
                setValue={(tempData) => {
                  const data = networkPolicyData.find(
                    (item) => item.id === tempData.id,
                  );
                  setNetworkPolicy(data || undefined);
                }}
                dataName="Network Policy"
                locked={locked}
              />
              <ModalSelectLabelFuzzy
                inputTestId="areaPolicy"
                labelText="Area Policy Override"
                labelProps={{
                  htmlFor: 'areaPolicy',
                }}
                errorText="Please select area policy"
                selectProps={{
                  id: 'areaPolicy',
                  name: 'areaPolicy',
                  required: true,
                  value: areaPolicy?.id || '',
                  onChange: (e) => {
                    const data = areaPolicyData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setAreaPolicy(data || undefined);
                  },
                }}
                data={[{id: '', name: 'Select Area Policy'}, ...areaPolicyData]}
                dropdownId="areaPolicyDropdown"
                searchData={areaPolicyData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={areaPolicy || null}
                setValue={(tempData) => {
                  const data = areaPolicyData.find(
                    (item) => item.id === tempData.id,
                  );
                  setAreaPolicy(data || undefined);
                }}
                dataName="Area Policy"
                locked={locked}
              />
            </div>
            <div className="row">
              <ModalSelectLabelFuzzy
                inputTestId="venuePolicy"
                labelText="Venue Policy Override"
                labelProps={{
                  htmlFor: 'venuePolicy',
                }}
                errorText="Please select venue policy"
                selectProps={{
                  id: 'venuePolicy',
                  name: 'venuePolicy',
                  required: true,
                  value: venuePolicy?.id || '',
                  onChange: (e) => {
                    const data = venuePolicyData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setVenuePolicy(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Venue Singage'},
                  ...venuePolicyData,
                ]}
                dropdownId="venuePolicyDropdown"
                searchData={venuePolicyData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={venuePolicy || null}
                setValue={(tempData) => {
                  const data = venuePolicyData.find(
                    (item) => item.id === tempData.id,
                  );
                  setVenuePolicy(data || undefined);
                }}
                dataName="Venue Policy"
                locked={locked}
              />
              <ModalSelectLabelFuzzy
                inputTestId="devicePolicy"
                labelText="Device Policy Override"
                labelProps={{
                  htmlFor: 'devicePolicy',
                }}
                errorText="Please select device policy"
                selectProps={{
                  id: 'devicePolicy',
                  name: 'devicePolicy',
                  required: true,
                  value: devicePolicy?.id || '',
                  onChange: (e) => {
                    const data = devicePolicyData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setDevicePolicy(data || undefined);
                  },
                }}
                data={[
                  {id: '', name: 'Select Device Policy'},
                  ...devicePolicyData,
                ]}
                dropdownId="devicePolicyDropdown"
                searchData={devicePolicyData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={devicePolicy || null}
                setValue={(tempData) => {
                  const data = devicePolicyData.find(
                    (item) => item.id === tempData.id,
                  );
                  setDevicePolicy(data || undefined);
                }}
                dataName="Device Policy"
              />
            </div>
          </div>
          <ModalDivider />
          <div className="buttonsContainer">
            <ClearButton
              onClick={() => {
                setOpenUnlinkDeviceModal(true);
              }}
            >
              <MemoTrash />
              Unlink Device
            </ClearButton>
            <Button className="rightButton">
              <MemoSave />
              Save Device
            </Button>
          </div>
        </div>
        <div id="editDeviceSidebarStickyContainer" className="stickyContainer">
          <div className="editDeviceSidebar">
            <div className="editItemContainer">
              <Title className="editSidebarTitle">Activation Code</Title>
              <div className="codeContainer">
                {deviceData.activationCode.split('').map((item, index) => (
                  <div key={`${item}_${index}`} className="codeNumber">
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="editItemRowContainer">
              <div className="editItemContainer">
                <Title className="editSidebarTitle">Custom Logo</Title>
                <div className="editItemVisual">
                  <div className="content">
                    <Image
                      src={deviceData.logo}
                      alt="McDonalds"
                      width={70}
                      height={62}
                    />
                  </div>
                  <div className="bgImage">
                    <MemoImageGrid />
                  </div>
                </div>
              </div>
              <div className="editItemContainer">
                <Title className="editSidebarTitle">Rewards</Title>
                <div className="editItemVisual noBorder">
                  {deviceData.rewards.map((item) => (
                    <div className="rewardContainer" key={item.month}>
                      <div className="reward">
                        <div
                          style={{height: `${item.progress}%`}}
                          className={`rewardTracker progress-${item.progress}`}
                        />
                      </div>
                      <Title className="rewardTitle">{item.month}</Title>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="editItemContainer">
              {width > 992 ? (
                <Title className="editSidebarTitle">Statistics</Title>
              ) : (
                <NoStyleButton
                  onClick={() => {
                    setOpenStatistics(!openStatistics);
                  }}
                  className={`white editSidebarTitle${
                    openStatistics ? ' open' : ''
                  }`}
                >
                  Statistics
                  <MemoDown />
                </NoStyleButton>
              )}
              <div
                id="sidebarStatisticsContainer"
                className="statisticsContainer"
              >
                <div className="statisticsWrapper">
                  {[
                    {title: 'Last Active', value: deviceData.lastActive},
                    {title: 'Device Type', value: deviceData.deviceType},
                    {title: 'Mode', value: deviceData.mode},
                    {title: 'MAC Address', value: deviceData.macAddress},
                    {title: 'Build', value: deviceData.build},
                    {title: 'Cached Videos', value: deviceData.cachedVideos},
                    {title: 'Free Space', value: deviceData.freeSpace},
                    {title: 'Speed', value: deviceData.speed},
                    {title: 'Temperature', value: deviceData.temperature},
                    {title: 'Now Playing', value: deviceData.nowPlaying},
                  ].map((val) => (
                    <div className="infoRow" key={`${val.title}_${val.value}`}>
                      <Title className="infoTitle">{val.title}</Title>
                      <Description className="infoDescription">
                        {val.value}
                      </Description>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {openUnlinkDeviceModal && (
        <DeviceUnlinkDeviceModalLazy
          open={openUnlinkDeviceModal}
          setOpen={setOpenUnlinkDeviceModal}
          onSubmit={() => {
            toast.success('Device unlinked successfully');
            return 'success';
          }}
        />
      )}
      {openMediaAssetModal && (
        <AssetMediaLazy
          open={openMediaAssetModal}
          setOpen={setOpenMediaAssetModal}
        />
      )}
      {openDeviceMoveDelay && (
        <MoveDeviceLazy
          open={openDeviceMove}
          setOpen={setOpenDeviceMove}
          onSubmit={(data) => {
            if (
              data.venue === deviceData.venue &&
              data.area === deviceData.area
            ) {
              toast.info('Device already in the same area and venue');
              return 'info';
            }
            setDeviceData((prevData) => {
              const newData = {...prevData};
              newData.area = data.area;
              newData.venue = data.venue || '';
              return newData;
            });
            toast.success('Device moved successfully');
            setOpenDeviceMove(false);
            return 'success';
          }}
          deviceData={deviceData}
        />
      )}
    </div>
  );
}
