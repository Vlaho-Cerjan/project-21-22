/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import type {ValueFormatterParams} from 'ag-grid-enterprise';
import React from 'react';

import {backendData} from '@/src/constants/backendData';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import type {Filter} from '@/types/filterData';
import FolderView from '../folderView/folderView';
import AddMediaModal from './modals/addMediaModal';
import EditMediaModal from './modals/editMediaModal';

export default function MediaAssetsPage() {
  const [rootData, setRootData] = React.useState(backendData);
  const [GridData, setMediaData] = React.useState(
    rootData.filter((item) => item.orgHierarchy?.length === 1),
  );
  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);
  const onItemDeSelect = (items: any[]) => {
    setSelectedItems(items);
  };
  const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<any | null>(null);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [selectedFolderId, _setSelectedFolderId] = React.useState<
    string | null
  >(null);

  const sorts = [
    'name',
    'type',
    'size',
    'duration',
    'updated_at',
    'created_at',
  ];

  const filters: Filter[] = [
    {
      id: 'type',
      name: 'Type',
      type: 'checkbox',
      data: [
        {
          id: 'image',
          name: 'Image',
          checked: false,
        },
        {
          id: 'video',
          name: 'Video',
          checked: false,
        },
        {
          id: 'text',
          name: 'Text',
          checked: false,
        },
      ],
    },
  ];

  return (
    <div className="viewContainer mediaAssetContainer">
      <FolderView
        onSearch={() => {
          return Promise.resolve([]);
        }}
        // fuseSearchKey={['name', 'type', 'duration', 'size', 'text']}
        data={rootData}
        setData={setRootData}
        listData={GridData}
        setListData={setMediaData}
        onItemDeSelect={onItemDeSelect as any}
        selectedItems={selectedItems}
        placeName="Media Assets"
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
            field: 'duration',
            headerName: 'Length',
            valueFormatter: (params: any) => {
              if (!params.value) return '';
              const minutes = Math.floor(params.value / 60);
              const seconds = Math.floor(params.value % 60);
              return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            },
          },
        ]}
        addMediaModal={
          <AddMediaModal
            open={openAddMediaModal}
            setOpen={setOpenAddMediaModal}
            onSubmit={(data) => {
              if (data) {
                const newRootData = [...rootData];
                const newMediaData: any = {
                  id: Math.random().toString(),
                  name: data.name,
                  type: data.type,
                  url: data.url,
                  text: data.text,
                  startDate: data.startDate?.toISOString() || '',
                  endDate: data.endDate?.toISOString() || '',
                  startTime: data.startTime,
                  endTime: data.endTime,
                  days: data.days,
                  folderId: selectedFolderId || undefined,
                  orgHierarchy: selectedFolderId
                    ? [
                        ...(newRootData.find(
                          (item) => item.id === selectedFolderId,
                        )?.orgHierarchy || []),
                        data.name,
                      ]
                    : [data.name],
                };
                newRootData.push(newMediaData);
                setRootData(newRootData);
                setMediaData([...GridData, newMediaData]);
              }
              setOpenAddMediaModal(false);
            }}
          />
        }
        editMediaModal={
          <EditMediaModal
            open={openEditMediaModal}
            setOpen={setOpenEditMediaModal}
            onSubmit={(data) => {
              if (data) {
                const newRootData = [...rootData];
                const newMediaData: any = {
                  id: data.id,
                  name: data.name,
                  type: data.type,
                  url: data.url,
                  text: data.text,
                  startDate: data.startDate?.toISOString() || '',
                  endDate: data.endDate?.toISOString() || '',
                  startTime: data.startTime,
                  endTime: data.endTime,
                  days: data.days,
                  folderId: selectedFolderId || undefined,
                  orgHierarchy: selectedFolderId
                    ? [
                        ...(newRootData.find(
                          (item) => item.id === selectedFolderId,
                        )?.orgHierarchy || []),
                        data.name,
                      ]
                    : [data.name],
                };
                // replace old data with new data
                const index = newRootData.findIndex(
                  (item) => item.id === data.id,
                );
                newRootData.splice(index, 1, newMediaData);
                setRootData(newRootData);
                setMediaData(
                  GridData.map((item) =>
                    item.id === data.id ? newMediaData : item,
                  ),
                );
              }
              setOpenEditMediaModal(false);
            }}
            data={editMediaData}
          />
        }
        editMediaData={editMediaData}
        setEditMediaData={setEditMediaData}
        openAddMediaModal={openAddMediaModal}
        setOpenAddMediaModal={setOpenAddMediaModal}
        openEditMediaModal={openEditMediaModal}
        setOpenEditMediaModal={setOpenEditMediaModal}
        sortKeys={sorts}
        filters={filters}
        searchDataTypes={[
          {
            id: 'image',
            name: 'Image',
            defItems: 3,
          },
          {
            id: 'video',
            name: 'Video',
            defItems: 3,
          },
          {
            id: 'text',
            name: 'Text',
            defItems: 3,
          },
        ]}
        searchDisplayKeys={[
          {
            id: 'name',
            position: 'top left',
          },
          {
            id: 'duration',
            position: 'top right',
          },
          {
            id: ['size'],
            position: 'bottom left',
          },
        ]}
        setSearchTextList={function (
          _value: React.SetStateAction<string>,
        ): void {}}
        saveGridSettings={function (_settings: GridSettings): void {}}
        findFolder={function (_folderId: string | null) {}}
        onFolderDoubleClickFunction={function (_folder: any): void {}}
        folderView="list"
        setFolderView={function (
          _value: React.SetStateAction<'list' | 'card'>,
        ): void {}}
        addFolderFunction={function (
          _data: {name: string; description?: string},
          _parentId?: string,
        ): Promise<'success' | 'error'> {
          return Promise.resolve('success');
        }}
      />
    </div>
  );
}
