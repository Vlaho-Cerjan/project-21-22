import type {AgGridReact} from 'ag-grid-react';
import type {FuseResult} from 'fuse.js';
import React from 'react';

import type {BackendPlaylistsData} from '@/src/constants/backendData';
import MemoAddFolder from '@/src/icons/add-folder';
import MemoAddPlaylist from '@/src/icons/add-playlist';
import MemoClear from '@/src/icons/clear';
import MemoSearch from '@/src/icons/search';
import MemoTrash from '@/src/icons/trash';

import IconButton from '../common/iconButton/iconButton';
import Title from '../common/title/title';

export default function PlaylistsHeader({
  gridSearchText,
  setGridSearchText,
  gridRef,
  openSearch,
  setOpenSearch,
  searchText,
  setSearchText,
  setOpenAddFolderModal,
  setOpenCreateNewPlaylistModal,
  onDeleteItems,
  selectedItems,
  setData,
  fakeDataState,
}: {
  gridSearchText: string;
  setGridSearchText: React.Dispatch<React.SetStateAction<string>>;
  gridRef: React.MutableRefObject<AgGridReact | null>;
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setOpenAddFolderModal: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenCreateNewPlaylistModal: React.Dispatch<React.SetStateAction<boolean>>;
  onDeleteItems?: () => void;
  selectedItems?: any[];
  setData: React.Dispatch<
    React.SetStateAction<FuseResult<BackendPlaylistsData>[]>
  >;
  fakeDataState: BackendPlaylistsData[];
}) {
  return (
    <>
      <div className="folderViewHeader playlistsPageHeader">
        <div className="header">
          <Title component="h1" style={{lineHeight: 1}} className="big">
            Playlists
          </Title>
        </div>
        <div className="buttonsContainer">
          <div
            className={`playlistsSearchButtonContainer buttonSearchContainer${
              gridSearchText ? ' active' : ''
            }`}
          >
            <IconButton
              data-tooltip-id={!openSearch ? 'searchTooltip' : undefined}
              data-tooltip-content="Search playlists"
              containerProps={{
                className: 'searchIconButton',
              }}
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
          <IconButton
            onClick={() => setOpenAddFolderModal(true)}
            data-tooltip-id="addFolderTooltipPlaylists"
            data-tooltip-content="Add Folder"
            icon={<MemoAddFolder />}
          />
          <div className="actionsItemsContainer deleteItemsContainer">
            <IconButton
              disabled={selectedItems?.length === 0}
              onClick={onDeleteItems}
              data-tooltip-id="trashTooltipPlaylists"
              data-tooltip-content="Delete Playlists"
              icon={<MemoTrash />}
            />
            <div
              className={`actionsItemsCount${
                selectedItems?.length === 0 ? ' hidden' : ''
              }`}
            >
              {selectedItems?.length}
            </div>
          </div>
          <IconButton
            onClick={() => setOpenCreateNewPlaylistModal(true)}
            data-tooltip-id="addPlaylistTooltipPlaylists"
            data-tooltip-content="Create New Playlist"
            icon={<MemoAddPlaylist />}
          />
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
    </>
  );
}
