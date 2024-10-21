'use client';

import type {AgGridReact} from 'ag-grid-react';
import type {FuseResult} from 'fuse.js';
import dynamic from 'next/dynamic';
import React from 'react';
import {toast} from 'react-toastify';
import {useWindowSize} from 'usehooks-ts';

import Button from '@/src/components/common/button/button';
import Description from '@/src/components/common/description/description';
import IconButton from '@/src/components/common/iconButton/iconButton';
import Title from '@/src/components/common/title/title';
import {
  fakeArea,
  fakeData,
  fakeVenue,
} from '@/src/components/dataGrid/fakeData';
import {useAppDispatch, useAppSelector} from '@/src/hooks/index';
import MemoAddItemV4 from '@/src/icons/add-item-v4';
import MemoClear from '@/src/icons/clear';
import MemoListView from '@/src/icons/list-view';
import MemoMapPin from '@/src/icons/map-pin';
import MemoSearch from '@/src/icons/search';
import {setView} from '@/src/store/slices/viewSlice';

import Skeleton from '../common/skeleton/skeleton';

export interface FakeDataWithAreaVenue {
  id: string;
  deviceName?: string;
  venue?: string;
  area: string;
  nowPlaying?: string;
  signage?: string;
  schedule?: string;
  channelMix?: string;
  tvCode?: string;
  macAddress?: string;
  lastActive?: string;
  rewards?: string;
  build?: string;
  addressName?: string;
  addressTitle?: string;
  coords?: {
    lat: string;
    lng: string;
  };
  recent?: boolean;
  type?: string;
}

const EditAreaLazy = dynamic(
  () => import('@/src/components/networkView/sidebars/editArea'),
  {
    ssr: false,
  },
);

const EditNetworkLazy = dynamic(
  () => import('@/src/components/networkView/sidebars/editNetwork'),
  {
    ssr: false,
  },
);

const EditVenueLazy = dynamic(
  () => import('@/src/components/networkView/sidebars/editVenue'),
  {
    ssr: false,
  },
);

const RcDropdownLazy = dynamic(() => import('rc-dropdown'), {ssr: false});

const AgGridSearchModalLazy = dynamic(
  () => import('@/src/components/common/searchModal/customSearchModal'),
  {
    ssr: false,
  },
);

const DeviceAddAreaModalLazy = dynamic(
  () => import('@/src/components/networkView/modals/addAreaModal'),
  {
    ssr: false,
  },
);

const DeviceAddVenueModalLazy = dynamic(
  () => import('@/src/components/networkView/modals/addVenueModal'),
  {
    ssr: false,
  },
);

const DeviceAddDeviceModalLazy = dynamic(
  () => import('@/src/components/networkView/modals/addDeviceModal'),
  {
    ssr: false,
  },
);

const DataGridComponent = dynamic(
  () => import('@/src/components/dataGrid/wrappedDataGrid'),
  {
    ssr: false,
    loading: () => <Skeleton className="absolute" />,
  },
);

const ForwardedRefDataGrid = React.forwardRef<
  AgGridReact,
  {data: FakeDataWithAreaVenue[]; searchText: string}
>((props, ref) => {
  const {data, searchText} = props;

  return (
    <DataGridComponent gridRef={ref} data={data} searchText={searchText} />
  );
});

ForwardedRefDataGrid.displayName = 'ForwardedRefDataGrid';

const GoogleMapComponent = dynamic(
  () => import('@/src/components/googleMaps/googleMaps'),
  {
    ssr: false,
    loading: () => <Skeleton className="absolute" />,
  },
);

export default function DeviceNetwork() {
  const {width} = useWindowSize();
  const viewState = useAppSelector((state) => state.view);
  const [view, setViewPage] = React.useState<string | null>(null);
  const dispatch = useAppDispatch();
  const [openSearch, setOpenSearch] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [gridSearchText, setGridSearchText] = React.useState('');
  const gridRef = React.useRef<AgGridReact>(null);
  const [openAddAreaModal, setOpenAddAreaModal] = React.useState(false);
  const [openAddVenueModal, setOpenAddVenueModal] = React.useState(false);
  const [openAddDeviceModal, setOpenAddDeviceModal] = React.useState(false);
  const [editNetworkOpen, setEditNetworkOpen] = React.useState(false);
  const [editNetworkOpenDelay, setEditNetworkOpenDelay] = React.useState(false);
  const [editAreaOpen, setEditAreaOpen] = React.useState(false);
  const [editAreaOpenDelay, setEditAreaOpenDelay] = React.useState(false);
  const [editVenueOpen, setEditVenueOpen] = React.useState(false);
  const [editVenueOpenDelay, setEditVenueOpenDelay] = React.useState(false);
  const [fakeAreaState, setFakeAreaState] = React.useState(fakeArea);
  const [fakeVenueState, setFakeVenueState] = React.useState(fakeVenue);
  const [fakeDataState, setFakeDataState] = React.useState<
    FakeDataWithAreaVenue[]
  >(
    fakeData.map((item) => ({
      ...item,
      addressName: item.addressName || '',
      addressTitle: item.addressTitle || '',
      coords: item?.coords || {lat: '', lng: ''},
      recent: item?.recent || false,
      venue:
        fakeVenueState.find((venue) => venue.id === item.venue)?.name || '',
      area: fakeAreaState.find((area) => area.id === item.area)?.name || '',
    })),
  );
  const [data, setData] = React.useState<
    FuseResult<(typeof fakeDataState)[0]>[]
  >(
    fakeDataState.map((item, index) => ({
      item,
      score: 0,
      matches: [],
      refIndex: index,
    })),
  );

  const options = {
    includeScore: true,
    includeMatches: true,
    keys: [
      'deviceName',
      'venue',
      'area',
      'nowPlaying',
      'signage',
      'schedule',
      'channelMix',
      'tvCode',
    ],
  };

  React.useEffect(() => {
    setTimeout(() => {
      setEditAreaOpenDelay(true);
      setEditNetworkOpenDelay(true);
      setEditVenueOpenDelay(true);
    }, 1000);
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      const dataTemp: FakeDataWithAreaVenue[] = fakeData.map((item) => ({
        ...item,
        addressName: item.addressName || '',
        addressTitle: item.addressTitle || '',
        coords: item?.coords || {lat: '', lng: ''},
        recent: item?.recent || false,
        venue:
          fakeVenueState.find((venue) => venue.id === item.venue)?.name || '',
        area: fakeAreaState.find((area) => area.id === item.area)?.name || '',
      }));

      const unusedAreas = fakeAreaState.filter(
        (area) => !dataTemp.find((item) => item.area === area.name),
      );

      const unusedVenues = fakeVenueState.filter(
        (venue) => !dataTemp.find((item) => item.venue === venue.name),
      );

      dataTemp.push(
        ...unusedAreas.map((area) => ({
          id: (dataTemp.length + 1).toString(),
          area: area.name,
        })),
      );

      dataTemp.push(
        ...unusedVenues.map((venue) => ({
          id: (dataTemp.length + 1).toString(),
          venue: venue.name,
          area:
            fakeAreaState.find((area) => area.id === venue.areaId)?.name || '',
        })),
      );
    }, 100);
  }, [fakeAreaState, fakeVenueState]);

  React.useEffect(() => {
    if (viewState) {
      setViewPage(viewState.view);
      setSearchText('');
      setGridSearchText('');
    } else {
      setViewPage('map');
    }
  }, [viewState]);

  const handleSearch = async (dataTemp: any[], searchTextTemp: string) => {
    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(dataTemp, options);
    if (searchText !== '')
      setData(fuse.search(searchTextTemp).map((item) => item));
    else
      setData(
        dataTemp.map((item, index) => ({
          item,
          score: 0,
          matches: [],
          refIndex: index,
        })),
      );
  };

  React.useEffect(() => {
    handleSearch(fakeDataState, searchText);
  }, [searchText, fakeDataState]);

  React.useEffect(() => {
    const buttonSearchContainer = document.querySelector(
      '.buttonSearchContainer',
    );
    if (buttonSearchContainer && width > 768) {
      if (gridSearchText) {
        setTimeout(() => {
          const childrenWidthsCombined = Array.from(
            buttonSearchContainer.children,
          ).reduce((acc, child) => acc + child.clientWidth, 0);
          buttonSearchContainer.setAttribute(
            'style',
            `width: ${childrenWidthsCombined + 10}px`,
          );
        }, 290);
      } else {
        buttonSearchContainer.removeAttribute('style');
      }
    } else {
      buttonSearchContainer?.removeAttribute('style');
    }
  }, [gridSearchText, width]);

  return (
    <>
      <div className={`fullPageHeader ${view}`}>
        <div className="header">
          <Title style={{lineHeight: 1}} className="big">
            Device Network
          </Title>
          <div className="devicesCount">
            <Description>/</Description>
            <Description>{fakeDataState.length} DEVICES</Description>
          </div>
        </div>
        <div className="buttonsContainer">
          <div
            className={`buttonSearchContainer${
              gridSearchText ? ' active' : ''
            }`}
          >
            <IconButton
              data-tooltip-id={!openSearch ? 'searchTooltip' : undefined}
              data-tooltip-content="Search devices"
              containerProps={{
                className: 'searchIconButton',
              }}
              disabled={view === 'map'}
              onClick={() => {
                const input = document.querySelector(
                  '.searchInputContainer input',
                );
                setOpenSearch(true);
                setTimeout(() => {
                  if (input && input instanceof HTMLInputElement) input.focus();
                }, 300);
              }}
              icon={<MemoSearch />}
            />
            <div className="buttonTextContainer">
              <div className="buttonText">{searchText}</div>
              <IconButton
                data-tooltip-id="clearTooltip1"
                data-tooltip-content="Clear Search"
                onClick={() => {
                  setGridSearchText('');
                  setTimeout(() => {
                    setSearchText('');
                  }, 500);
                  setData(
                    fakeDataState.map((item, index) => ({
                      item,
                      score: 0,
                      matches: [],
                      refIndex: index,
                    })),
                  );
                  const api = gridRef.current?.api;
                  if (api) {
                    setTimeout(() => {
                      api.collapseAll();
                    }, 100);
                  }
                }}
                icon={<MemoClear />}
              />
            </div>
          </div>
          {view === 'list' ? (
            <IconButton
              data-tooltip-id="viewTooltip"
              data-tooltip-content="Map View"
              icon={<MemoMapPin />}
              onClick={() => dispatch(setView('map'))}
            />
          ) : (
            <IconButton
              icon={<MemoListView />}
              data-tooltip-id="viewTooltip"
              data-tooltip-content="List View"
              onClick={() => {
                dispatch(setView('list'));
              }}
            />
          )}
          <div>
            <RcDropdownLazy
              overlay={
                <div className="dropdownContent">
                  <Button
                    onClick={() => setOpenAddDeviceModal(true)}
                    className="link"
                  >
                    Add Device
                  </Button>
                  <Button
                    onClick={() => setOpenAddAreaModal(true)}
                    className="link"
                  >
                    Add Area
                  </Button>
                  <Button
                    onClick={() => setOpenAddVenueModal(true)}
                    className="link"
                  >
                    Add Venue
                  </Button>
                </div>
              }
              overlayClassName="addDropdown"
              trigger={['click']}
            >
              <IconButton
                data-tooltip-id="addDeviceTooltip"
                data-tooltip-content="Add Device or Group"
                data-tooltip-place="top-start"
                id="addDropdownActivator"
                icon={<MemoAddItemV4 />}
              />
            </RcDropdownLazy>
          </div>
        </div>
      </div>
      <div
        className={`searchResultMobileContainer${
          gridSearchText ? ' active' : ''
        }`}
      >
        <div className="searchResultContainer">
          <div className="searchText">{searchText}</div>
          <IconButton
            data-tooltip-id="clearTooltip2"
            data-tooltip-content="Clear Search"
            onClick={() => {
              setGridSearchText('');
              setTimeout(() => {
                setSearchText('');
              }, 500);
              setData(
                fakeDataState.map((item, index) => ({
                  item,
                  score: 0,
                  matches: [],
                  refIndex: index,
                })),
              );
              const api = gridRef.current?.api;
              if (api) {
                setTimeout(() => {
                  api.collapseAll();
                }, 100);
              }
            }}
            className="clearButton"
            icon={<MemoClear />}
          />
        </div>
      </div>
      <div className={`networkMapGridContent ${view}`}>
        {view ? (
          view === 'map' ? (
            <GoogleMapComponent data={fakeDataState} />
          ) : (
            <ForwardedRefDataGrid
              data={fakeDataState}
              ref={gridRef}
              searchText={gridSearchText}
            />
          )
        ) : (
          <Skeleton className="absolute" />
        )}
      </div>
      {openSearch && (
        <AgGridSearchModalLazy
          openSearch={openSearch}
          setOpenSearch={setOpenSearch}
          searchText={searchText}
          setSearchText={setSearchText}
          setGridSearchText={setGridSearchText}
          data={data}
          setData={setData}
          onSearch={(searchtxt: string) => {
            console.log('searchtxt', searchtxt);
            return Promise.resolve([]);
          }}
          dataTypes={[
            {
              id: 'devices',
              name: 'Players',
              defItems: 5,
            },
            {
              id: 'media',
              name: 'Media',
              defItems: 5,
            },
          ]}
          displayKeys={[
            {
              id: 'deviceName',
              position: 'top left',
            },
            {
              id: ['venue', 'area'],
              position: 'bottom left',
            },
            {
              id: 'nowPlaying',
              position: 'top right',
            },
            {
              id: 'tvCode',
              position: 'bottom right',
            },
          ]}
        />
      )}
      {openAddAreaModal && (
        <DeviceAddAreaModalLazy
          open={openAddAreaModal}
          setOpen={setOpenAddAreaModal}
          onSubmit={(dataTemp) => {
            setFakeAreaState((prev) => [
              ...prev,
              {
                id: (prev.length + 1).toString(),
                name: dataTemp.areaName,
                signage: dataTemp.areaSignage,
                schedule: dataTemp.areaSchedule,
                policy: dataTemp.areaPolicy,
              },
            ]);
            toast.success('Area added successfully');
            return 'success';
          }}
        />
      )}
      {openAddVenueModal && (
        <DeviceAddVenueModalLazy
          areaData={fakeAreaState}
          open={openAddVenueModal}
          setOpen={setOpenAddVenueModal}
          onSubmit={(dataTemp) => {
            setFakeVenueState((prev) => [
              ...prev,
              {
                id: (prev.length + 1).toString(),
                name: dataTemp.venueName,
                address: dataTemp.venueAddress,
                other: dataTemp.venueOther,
                signage: dataTemp.venueSignage,
                schedule: dataTemp.venueSchedule,
                policy: dataTemp.venuePolicy,
                areaId: dataTemp.venueAreaId,
              },
            ]);
            toast.success('Venue added successfully');
            return 'success';
          }}
        />
      )}
      {openAddDeviceModal && (
        <DeviceAddDeviceModalLazy
          areaData={fakeAreaState}
          venueData={fakeVenueState}
          open={openAddDeviceModal}
          setOpen={setOpenAddDeviceModal}
          onSubmit={(dataTemp) => {
            setFakeDataState((prev) => [
              ...prev,
              {
                id: (prev.length + 1).toString(),
                deviceName: dataTemp.deviceName,
                venue: dataTemp.venue,
                area: dataTemp.area,
                nowPlaying: '',
                signage: '',
                schedule: '',
                channelMix: '',
                tvCode: '',
                macAddress: '',
                lastActive: '',
                rewards: '',
                build: '',
                addressName: '',
                addressTitle: '',
                coords: {
                  lat: '',
                  lng: '',
                },
                recent: false,
              },
            ]);
            toast.success('Device added successfully');
            return 'success';
          }}
        />
      )}
      {editNetworkOpenDelay && (
        <EditNetworkLazy
          open={editNetworkOpen}
          setOpen={setEditNetworkOpen}
          network={{
            id: '1',
            signage: '1',
            schedule: '1',
            policy: '1',
          }}
          onSubmit={() => {
            return 'success';
          }}
        />
      )}
      {editAreaOpenDelay && (
        <EditAreaLazy
          open={editAreaOpen}
          setOpen={setEditAreaOpen}
          area={{
            id: '1',
            name: 'SoCal',
            signage: '1',
            schedule: '1',
            policy: '1',
          }}
          onSubmit={() => {
            toast.success('Area edited successfully');
            return 'success';
          }}
        />
      )}
      {editVenueOpenDelay && (
        <EditVenueLazy
          open={editVenueOpen}
          setOpen={setEditVenueOpen}
          venue={{
            id: '1',
            name: 'Burbank McDonalds',
            address: '700 N Central Avenue, Glendale, CA 91203',
            other: 'Suite 430',
            signage: '1',
            schedule: '1',
            policy: '1',
          }}
          onSubmit={() => {
            toast.success('Venue edited successfully');
            return 'success';
          }}
        />
      )}
    </>
  );
}
