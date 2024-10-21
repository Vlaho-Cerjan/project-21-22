'use client';

import type {AgGridReact} from 'ag-grid-react';
import type {FuseResult} from 'fuse.js';
import dynamic from 'next/dynamic';
import React from 'react';
import {useWindowSize} from 'usehooks-ts';

import type {
  BackendPlaylistsData,
  BackendVideoData,
} from '@/src/constants/backendData';
import {backendVideosData} from '@/src/constants/backendData';
import MemoAddVideo from '@/src/icons/add-video';
import MemoClear from '@/src/icons/clear';
import MemoSearch from '@/src/icons/search';
import MemoTrash from '@/src/icons/trash';

import {ModalDivider} from '../../common/divider/divider';
import IconButton from '../../common/iconButton/iconButton';
import ModalLabel from '../../common/label/modalLabel';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import Skeleton from '../../common/skeleton/skeleton';

const DataGridComponent = dynamic(
  () =>
    import('@/src/components/playlistsView/playlist/dataGrid/wrappedDataGrid'),
  {
    ssr: false,
    loading: () => <Skeleton className="absolute" />,
  },
);

const ForwardedRefDataGrid = React.forwardRef<
  AgGridReact,
  {
    searchText: string;
    data: BackendVideoData[];
    selectedVideos: BackendVideoData[];
    onItemDeSelect: (items: BackendVideoData[]) => void;
  }
>((props, ref) => {
  const {searchText, data, selectedVideos, onItemDeSelect} = props;

  return (
    <DataGridComponent
      searchText={searchText}
      data={data}
      selectedVideos={selectedVideos}
      onItemDeSelect={onItemDeSelect}
      gridRef={ref}
    />
  );
});

ForwardedRefDataGrid.displayName = 'ForwardedRefDataGrid';

const AddVideoSidebarLazy = dynamic(
  () => import('../sidebars/addVideosSidebar'),
  {
    ssr: false,
  },
);

const CustomSearchModalLazy = dynamic(
  () => import('@/src/components/common/searchModal/customSearchModal'),
  {
    ssr: false,
  },
);

export default function EditPlaylistModal({
  open,
  setOpen,
  data,
  onSubmit,
}: {
  open: boolean;
  data: BackendPlaylistsData;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: BackendPlaylistsData) => void;
}) {
  const [playlistName, setPlaylistName] = React.useState(data.name);
  const [isError, setIsError] = React.useState(false);
  const [openAddVideoSidebar, setAddVideoSidebarOpen] = React.useState(false);
  const [openAddVideoSidebarDelay, setOpenAddVideoSidebarDelay] =
    React.useState(false);
  const [selectedVideos, setSelectedVideos] = React.useState<
    BackendVideoData[]
  >(data.videos || []);
  const [gridSelectedVideos, setGridSelectedVideos] = React.useState<
    BackendVideoData[]
  >([]);
  const gridRef = React.useRef<AgGridReact>(null);
  const [searchText, setSearchText] = React.useState<string>('');
  const [gridSearchText, setGridSearchText] = React.useState<string>('');
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const [searchData, setSearchData] = React.useState<
    FuseResult<BackendVideoData>[]
  >([]);
  const {width} = useWindowSize();

  const handleSearch = async (
    fuseSearchData: BackendVideoData[],
    searchTextTemp: string,
  ) => {
    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(fuseSearchData, {
      keys: ['name', 'artist', 'duration', 'genre', 'rating'],
      includeMatches: true,
      includeScore: true,
      isCaseSensitive: false,
      ignoreLocation: true,
      ignoreFieldNorm: true,
    });

    if (searchTextTemp.length > 0) {
      const result = fuse.search(searchTextTemp);
      setSearchData(result);
    } else {
      setSearchData(
        selectedVideos.map((item) => ({
          item,
          refIndex: 0,
          score: 0,
          matches: [],
        })),
      );
    }
  };

  React.useEffect(() => {
    handleSearch(selectedVideos, searchText);
  }, [searchText]);

  React.useEffect(() => {
    setTimeout(() => {
      setOpenAddVideoSidebarDelay(true);
    }, 1000);
  }, []);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setPlaylistName('');
        setIsError(false);
      }, 200);
    } else {
      setPlaylistName(data.name);
      setSelectedVideos(data.videos || []);
    }
  }, [open]);

  React.useEffect(() => {
    const buttonSearchContainer = document.querySelector(
      '.playlistVideosSearchButtonContainer',
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
    <div>
      <Modal
        className="actionPlaylistModal editPlaylistModal fullWidth fullHeight"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader title="Edit Playlist" description="Edit your playlist." />
        <ModalDivider />
        <div className="contentContainer">
          <ModalContent>
            <div className="formContainer">
              <ModalInputLabel
                labelText="Playlist Name"
                labelProps={{
                  htmlFor: 'name',
                }}
                errorText="Playlist name can not be empty"
                inputProps={{
                  name: 'name',
                  type: 'text',
                  required: true,
                  placeholder: 'Enter playlist name',
                  value: playlistName,
                  onChange: (e) => {
                    setPlaylistName(e.currentTarget.value);
                  },
                }}
              />
            </div>
          </ModalContent>
          <ModalDivider />
          <ModalContent>
            <div className="searchDataHeader">
              <ModalLabel>
                {`Selected ${selectedVideos.length || ''} videos`}
              </ModalLabel>
              <div className="actionButtonsContainer">
                <div
                  className={`playlistVideosSearchButtonContainer buttonSearchContainer${
                    gridSearchText ? ' active' : ''
                  }`}
                >
                  <IconButton
                    disabled={selectedVideos.length === 0}
                    data-tooltip-id={
                      !openSearchModal ? 'searchTooltip' : undefined
                    }
                    data-tooltip-content="Search playlists"
                    containerProps={{
                      className: 'searchIconButton',
                    }}
                    onClick={() => {
                      const input = document.querySelector(
                        '.searchInputContainer input',
                      );
                      setOpenSearchModal(true);
                      setTimeout(() => {
                        if (input && input instanceof HTMLInputElement)
                          input.focus();
                      }, 300);
                    }}
                    icon={<MemoSearch />}
                  />
                  <div className="buttonTextContainer">
                    <div className="buttonText">{searchText}</div>
                    <IconButton
                      data-tooltip-id="clearTooltipPlaylistData"
                      data-tooltip-content="Clear Search"
                      onClick={() => {
                        setGridSearchText('');
                        setTimeout(() => {
                          setSearchText('');
                        }, 500);
                        setSearchData(
                          backendVideosData.map((item, index) => ({
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
                <div className="actionsItemsContainer deleteItemsContainer">
                  <IconButton
                    disabled={gridSelectedVideos?.length === 0}
                    onClick={() => {
                      // remove selected videos from grid
                      const newSelectedVideos = selectedVideos.filter(
                        (item) =>
                          !gridSelectedVideos.find(
                            (selected) => selected.id === item.id,
                          ),
                      );

                      setSelectedVideos(newSelectedVideos);
                    }}
                    data-tooltip-id="playlistTrashTooltip"
                    data-tooltip-content="Delete Videos"
                    icon={<MemoTrash />}
                  />
                  <div
                    className={`actionsItemsCount${
                      gridSelectedVideos?.length === 0 ? ' hidden' : ''
                    }`}
                  >
                    {gridSelectedVideos?.length}
                  </div>
                </div>
                <IconButton
                  onClick={() => {
                    setAddVideoSidebarOpen(true);
                  }}
                  data-tooltip-id="addVideoTooltipPlaylists"
                  data-tooltip-content="Add Videos"
                  icon={<MemoAddVideo />}
                />
              </div>
            </div>
            <div>
              <DataGridComponent
                searchText={gridSearchText}
                gridRef={gridRef}
                data={selectedVideos}
                selectedVideos={gridSelectedVideos}
                onItemDeSelect={(items) => {
                  setGridSelectedVideos(items);
                }}
              />
            </div>
          </ModalContent>
        </div>
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          isError={isError}
          setIsError={setIsError}
          modalClass="editPlaylistModal"
          buttonText="Edit Playlist"
          loadingText="Editing ..."
          successText="Playlist Edited"
          errorText="Error"
          onSubmit={() => {
            onSubmit({
              ...data,
              name: playlistName,
              videos: selectedVideos,
            });
            return Promise.resolve('success');
          }}
          noIcon
        />
      </Modal>
      {openAddVideoSidebarDelay && (
        <AddVideoSidebarLazy
          id="Playlists"
          className="playlists"
          selectedVideos={selectedVideos}
          open={openAddVideoSidebar}
          setOpen={setAddVideoSidebarOpen}
          onSubmit={(tempData) => {
            setSelectedVideos(tempData.videos);
          }}
        />
      )}
      <CustomSearchModalLazy
        openSearch={openSearchModal}
        setOpenSearch={setOpenSearchModal}
        searchText={searchText}
        setSearchText={setSearchText}
        setGridSearchText={setGridSearchText}
        data={searchData}
        setData={setSearchData}
        onSearch={(searchtxt: string) => {
          console.log('searchtxt', searchtxt);
          return Promise.resolve([]);
        }}
        dataTypes={[
          {
            id: 'video',
            name: 'Videos',
            defItems: 7,
          },
        ]}
        displayKeys={[
          {
            id: 'name',
            position: 'top left',
          },
          {
            id: 'rating' as any,
            position: 'top right',
          },
          {
            id: ['artist'] as any,
            position: 'bottom left',
          },
        ]}
      />
    </div>
  );
}
