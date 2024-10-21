/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import type {
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
import React from 'react';

import type {BackendScheduleData} from '@/src/constants/backendData';
import {backendSchedulesData} from '@/src/constants/backendData';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import type {GridData} from '@/types/gridData';
import {editCellRenderer} from '../common/listComponents/listComponents';
import FolderView from '../folderView/folderView';
import CreateNewScheduleModal from './modals/addNewScheduleModal';
import EditScheduleModal from './modals/editScheduleModal';

export default function MediaAssetsPage() {
  const [rootData, setRootData] =
    React.useState<BackendScheduleData[]>(backendSchedulesData);
  const [mediaData, setMediaData] = React.useState(
    rootData.filter((item) => item.orgHierarchy.length === 1),
  );
  const [selectedItems, _setSelectedItems] = React.useState<
    BackendScheduleData[]
  >([]);
  // const onItemDeSelect = (items: BackendScheduleData[]) => {
  //  setSelectedItems(items);
  // };
  const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<any | null>(null);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [selectedFolderId, _setSelectedFolderId] = React.useState<
    string | null
  >(null);

  const sorts = ['name', 'updated_at', 'created_at'];

  return (
    <div className="viewContainer scheduleViewContainer">
      <FolderView
        onSearch={() => {
          return Promise.resolve([]);
        }}
        // fuseSearchKey={['name', 'assigned.area', 'assigned.venue']}
        addButtonTooltipText="Add Schedule"
        sortKeys={sorts}
        data={rootData}
        setData={setRootData}
        listData={mediaData}
        editMediaData={editMediaData}
        setListData={setMediaData}
        // onItemDeSelect={onItemDeSelect}
        selectedItems={selectedItems}
        placeName="Schedules"
        // selectedFolderId={selectedFolderId}
        // setSelectedFolderId={setSelectedFolderId}
        type="page"
        columnDefsData={[
          {
            field: 'type',
            valueFormatter: (params: ValueFormatterParams) => {
              if (!params.value) return '';
              return (
                params.value.charAt(0).toUpperCase() + params.value.slice(1)
              );
            },
          },
          {
            field: 'updated_at',
            headerName: 'Modified',
            valueFormatter: (params: ValueFormatterParams) => {
              if (!params.value) return '';
              return new Date(params.value).toLocaleDateString();
            },
            comparator: (d1: string, d2: string) => {
              return new Date(d1).getTime() < new Date(d2).getTime() ? -1 : 1;
            },
          },
          {
            field: 'edit',
            headerName: 'Edit',
            pinned: 'right',
            sortable: false,
            headerClass: 'editHeader',
            cellRenderer: (params: ICellRendererParams) => {
              return editCellRenderer(params, () => {
                if (params.data) {
                  setEditMediaData(params.data);
                  setOpenEditMediaModal(true);
                }
              });
            },
            minWidth: 60,
            maxWidth: 60,
            cellStyle: {
              justifyContent: 'center',
            },
          },
        ]}
        addMediaModal={
          <CreateNewScheduleModal
            open={openAddMediaModal}
            setOpen={setOpenAddMediaModal}
            onSubmit={(data) => {
              const newScheduleSet: BackendScheduleData = {
                id: (rootData.length + 1).toString(),
                folderId: selectedFolderId || undefined,
                name: data.name,
                type: 'schedule',
                orgHierarchy: selectedFolderId
                  ? [selectedFolderId, data.name]
                  : [data.name],
                created_at: new Date().toISOString(),
                playlists: data.playlists,
                playlistsCount: data.playlists.length,
              };
              const tempRootData = [...rootData, newScheduleSet];
              // sort data by folder first and by sortBy value
              setRootData(tempRootData);
              setOpenAddMediaModal(false);
            }}
          />
        }
        editMediaModal={
          <EditScheduleModal
            open={openEditMediaModal}
            setOpen={setOpenEditMediaModal}
            data={editMediaData}
            sortData={(data) => {
              setRootData(data);
            }}
            rootData={rootData}
            onSubmit={(data) => {
              const tempRootData = [...rootData];
              const index = tempRootData.findIndex(
                (item) => item.id === data.id,
              );
              const item = tempRootData[index];
              if (index !== -1 && item) {
                tempRootData[index] = {
                  ...item,
                  name: data.scheduleName,
                  playlists: data.playlists,
                  playlistsCount: data.playlists.length,
                };
              }
              setRootData(tempRootData);
              setOpenEditMediaModal(false);
              setEditMediaData(undefined);
            }}
          />
        }
        setEditMediaData={setEditMediaData}
        openAddMediaModal={openAddMediaModal}
        setOpenAddMediaModal={setOpenAddMediaModal}
        openEditMediaModal={openEditMediaModal}
        setOpenEditMediaModal={setOpenEditMediaModal}
        searchDataTypes={[
          {
            id: 'schedule',
            name: 'Schedule',
            defItems: 5,
          },
        ]}
        searchDisplayKeys={[
          {
            id: 'name',
            position: 'top left',
          },
        ]}
        onItemDeSelect={function (_items: GridData[]): void {
          throw new Error('Function not implemented.');
        }}
        setSearchTextList={function (
          _value: React.SetStateAction<string>,
        ): void {
          throw new Error('Function not implemented.');
        }}
        saveGridSettings={function (_settings: GridSettings): void {
          throw new Error('Function not implemented.');
        }}
        findFolder={function (_folderId: string | null) {
          throw new Error('Function not implemented.');
        }}
        addFolderFunction={function (
          _data: {name: string; description?: string},
          _parentId?: string,
        ): Promise<'success' | 'error'> {
          throw new Error('Function not implemented.');
        }}
        onFolderDoubleClickFunction={function (_folder: GridData): void {
          throw new Error('Function not implemented.');
        }}
        folderView="list"
        setFolderView={function (
          _value: React.SetStateAction<'list' | 'card'>,
        ): void {
          throw new Error('Function not implemented.');
        }}
      />
    </div>
  );
}
