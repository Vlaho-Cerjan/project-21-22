'use client';

import type {AgGridReact} from 'ag-grid-react';
import type {FuseResult} from 'fuse.js';
import dynamic from 'next/dynamic';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import type {BackendPlaylistsData} from '@/src/constants/backendData';
import {backendPlaylistsData, BackendTypes} from '@/src/constants/backendData';

import Skeleton from '../common/skeleton/skeleton';
import PlaylistsHeader from './playlistsHeader';

const CreateNewPlaylistModalLazy = dynamic(
  () => import('./modals/createNewPlaylistModal'),
  {
    ssr: false,
  },
);

const EditPlaylistModalLazy = dynamic(
  () => import('./modals/editPlaylistModal'),
  {
    ssr: false,
  },
);

const DeleteItemsModalLazy = dynamic(
  () => import('../common/modals/deleteItemsModal'),
  {
    ssr: false,
  },
);

const AddFolderModalLazy = dynamic(() => import('./modals/addFolderModal'), {
  ssr: false,
});

const CustomSearchModalLazy = dynamic(
  () => import('./modals/playlistsSearchModal'),
  {ssr: false},
);

const DataGridComponent = dynamic(
  () => import('@/src/components/playlistsView/dataGrid/wrappedDataGrid'),
  {
    ssr: false,
    loading: () => <Skeleton className="absolute" />,
  },
);

const ForwardedRefDataGrid = React.forwardRef<
  AgGridReact,
  {
    searchText: string;
    data: BackendPlaylistsData[];
    setData: React.Dispatch<React.SetStateAction<BackendPlaylistsData[]>>;
    setBackendPlaylistsData: React.Dispatch<
      React.SetStateAction<BackendPlaylistsData[]>
    >;
    selectedPlaylists: BackendPlaylistsData[];
    onItemDeSelect: (items: BackendPlaylistsData[]) => void;
    onPlaylistsEdit: (item: BackendPlaylistsData) => void;
  }
>((props, ref) => {
  const {
    searchText,
    data,
    setData,
    setBackendPlaylistsData,
    selectedPlaylists,
    onItemDeSelect,
    onPlaylistsEdit,
  } = props;

  return (
    <DataGridComponent
      searchText={searchText}
      data={data}
      setData={setData}
      setBackendPlaylistsData={setBackendPlaylistsData}
      selectedPlaylists={selectedPlaylists}
      onItemDeSelect={onItemDeSelect}
      onPlaylistsEdit={onPlaylistsEdit}
      gridRef={ref}
    />
  );
});

ForwardedRefDataGrid.displayName = 'ForwardedRefDataGrid';

export default function DeviceNetwork() {
  const {width} = useWindowSize();
  const [openSearch, setOpenSearch] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [gridSearchText, setGridSearchText] = React.useState('');
  const gridRef = React.useRef<AgGridReact>(null);
  const [playlistsData, setPlaylistsData] =
    React.useState<BackendPlaylistsData[]>(backendPlaylistsData);
  const [fakeDataState, setFakeDataState] =
    React.useState<BackendPlaylistsData[]>(playlistsData);
  const [selectedItems, setSelectedItems] = React.useState<
    BackendPlaylistsData[]
  >([]);
  const [deleteMediaModalOpen, setDeleteMediaModalOpen] = React.useState(false);
  const [deleteMediaModalOpenDelay, setDeleteMediaModalOpenDelay] =
    React.useState(false);
  const [openAddFolderModal, setOpenAddFolderModal] = React.useState(false);
  const [openAddFolderModalDelay, setOpenAddFolderModalDelay] =
    React.useState(false);
  const [createNewPlaylistModalOpen, setCreateNewPlaylistModalOpen] =
    React.useState(false);
  const [createNewPlaylistModalOpenDelay, setCreateNewPlaylistModalOpenDelay] =
    React.useState(false);
  const [editPlaylistModalOpen, setEditPlaylistModalOpen] =
    React.useState(false);
  const [editPlaylistModalOpenDelay, setEditPlaylistModalOpenDelay] =
    React.useState(false);
  const [editData, setEditData] = React.useState<BackendPlaylistsData | null>(
    null,
  );
  const onItemDeSelect = (items: BackendPlaylistsData[]) => {
    setSelectedItems(items);
  };
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
    keys: ['name', 'type'],
  };

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
    setTimeout(() => {
      setOpenAddFolderModalDelay(true);
      setDeleteMediaModalOpenDelay(true);
      setCreateNewPlaylistModalOpenDelay(true);
      setEditPlaylistModalOpenDelay(true);
    }, 1000);
  }, []);
  React.useEffect(() => {
    handleSearch(fakeDataState, searchText);
  }, [searchText, fakeDataState]);

  React.useEffect(() => {
    const buttonSearchContainer = document.querySelector(
      '.playlistsSearchButtonContainer',
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

  const onDeleteItems = () => {
    setDeleteMediaModalOpen(true);
  };

  return (
    <div className="folderViewContainer">
      <PlaylistsHeader
        openSearch={openSearch}
        setOpenSearch={setOpenSearch}
        searchText={searchText}
        gridRef={gridRef}
        gridSearchText={gridSearchText}
        setGridSearchText={setGridSearchText}
        setSearchText={setSearchText}
        setOpenAddFolderModal={setOpenAddFolderModal}
        setOpenCreateNewPlaylistModal={setCreateNewPlaylistModalOpen}
        onDeleteItems={onDeleteItems}
        selectedItems={selectedItems}
        setData={setData}
        fakeDataState={fakeDataState}
      />
      <div className="playlistsDataGridContainer">
        <ForwardedRefDataGrid
          ref={gridRef}
          data={fakeDataState}
          searchText={gridSearchText}
          setData={setFakeDataState}
          setBackendPlaylistsData={setPlaylistsData}
          selectedPlaylists={selectedItems}
          onItemDeSelect={onItemDeSelect}
          onPlaylistsEdit={(item) => {
            setEditData(item);
            setEditPlaylistModalOpen(true);
          }}
        />
      </div>
      {openSearch && (
        <CustomSearchModalLazy
          openSearch={openSearch}
          setOpenSearch={setOpenSearch}
          searchText={searchText}
          setSearchText={setSearchText}
          gridRef={gridRef}
          setGridSearchText={setGridSearchText}
          data={data}
          dataTypes={
            BackendTypes.map((type) => ({
              id: type.id,
              name: type.name,
              defItems: 3,
            })) || []
          }
          displayKeys={[
            {
              id: 'name',
              position: 'top left',
            },
            {
              id: ['videos'],
              position: 'bottom left',
            },
          ]}
        />
      )}
      {openAddFolderModalDelay && (
        <AddFolderModalLazy
          open={openAddFolderModal}
          setOpen={setOpenAddFolderModal}
          onSubmit={(folderName) => {
            const newFolder = {
              id: (fakeDataState.length + 1).toString(),
              name: folderName,
              type: 'folder',
              orgHierarchy: [folderName],
            };
            const tempRootData = [...fakeDataState, newFolder];
            // sort data by folder first and by sortBy value
            const tempData = tempRootData.sort((a, b) => {
              if (a.type === 'folder' && b.type !== 'folder') return -1;
              if (a.type !== 'folder' && b.type === 'folder') return 1;
              return 0;
            });

            setFakeDataState(tempData);
            setOpenAddFolderModal(false);
          }}
        />
      )}
      {deleteMediaModalOpenDelay && (
        <DeleteItemsModalLazy
          open={deleteMediaModalOpen}
          setOpen={setDeleteMediaModalOpen}
          itemCount={selectedItems?.length || 0}
          onSubmit={() => {
            const tempData = fakeDataState.filter(
              (item) => !selectedItems?.includes(item),
            );
            setFakeDataState(tempData);
            setSelectedItems([]);
            setDeleteMediaModalOpen(false);
            return Promise.resolve('success');
          }}
        />
      )}
      {createNewPlaylistModalOpenDelay && (
        <CreateNewPlaylistModalLazy
          open={createNewPlaylistModalOpen}
          setOpen={setCreateNewPlaylistModalOpen}
          onSubmit={(playlistData) => {
            const newPlaylist: BackendPlaylistsData = {
              id: (fakeDataState.length + 1).toString(),
              name: playlistData.name,
              videos: playlistData.videos,
              url: '/assets/images/mcd2.png',
              type: 'playlist',
              orgHierarchy: [playlistData.name],
            };
            const tempRootData = [...fakeDataState, newPlaylist];
            // sort data by folder first and by sortBy value
            const tempData = tempRootData.sort((a, b) => {
              if (a.type === 'folder' && b.type !== 'folder') return -1;
              if (a.type !== 'folder' && b.type === 'folder') return 1;
              return 0;
            });

            setFakeDataState(tempData);
            setCreateNewPlaylistModalOpen(false);
          }}
        />
      )}
      {editPlaylistModalOpenDelay && editData && (
        <EditPlaylistModalLazy
          open={editPlaylistModalOpen}
          setOpen={setEditPlaylistModalOpen}
          data={editData}
          onSubmit={(playlistData) => {
            const tempData = fakeDataState.map((item) => {
              if (item.id === playlistData.id) {
                return {
                  ...item,
                  name: playlistData.name,
                  videos: playlistData.videos,
                };
              }
              return item;
            });
            setFakeDataState(tempData);
            setEditPlaylistModalOpen(false);
            setEditData(null);
          }}
        />
      )}
    </div>
  );
}
