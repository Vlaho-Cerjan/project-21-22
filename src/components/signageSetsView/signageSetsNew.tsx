/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import type {
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
import React from 'react';

import type {BackendSignageData} from '@/src/constants/backendData';
import {backendSignageData} from '@/src/constants/backendData';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import type {GridData} from '@/types/gridData';
import {editCellRenderer} from '../common/listComponents/listComponents';
import FolderView from '../folderView/folderView';
import CreateNewSignageModal from './modals/createNewSignageModal';
import EditSignageModal from './modals/editSignageModal';

export default function MediaAssetsPage() {
  const [rootData, setRootData] =
    React.useState<BackendSignageData[]>(backendSignageData);
  const [mediaData, setMediaData] = React.useState(
    rootData.filter((item) => item.orgHierarchy.length === 1),
  );
  const [selectedItems, _setSelectedItems] = React.useState<
    BackendSignageData[]
  >([]);
  // const onItemDeSelect = (items: BackendSignageData[]) => {
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
    <div className="viewContainer signageViewContainer">
      <FolderView
        onSearch={() => {
          return Promise.resolve([]);
        }}
        // fuseSearchKey={['name', 'slideData.slides.data.name']}
        addButtonTooltipText="Add Signage Set"
        sortKeys={sorts}
        data={rootData}
        setData={setRootData}
        listData={mediaData}
        editMediaData={editMediaData}
        setListData={setMediaData}
        // onItemDeSelect={onItemDeSelect}
        selectedItems={selectedItems}
        placeName="Signage Sets"
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
              if (!d1 || !d2) return 0;
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
          <CreateNewSignageModal
            open={openAddMediaModal}
            setOpen={setOpenAddMediaModal}
            onSubmit={(data) => {
              const newSignageSet: BackendSignageData = {
                id: (rootData.length + 1).toString(),
                folderId: selectedFolderId || undefined,
                name: data.signageSetName,
                type: 'signage',
                url: data.mediaData.slides[0]?.data.url,
                orgHierarchy: [data.signageSetName],
                created_at: new Date().toISOString(),
                slideData: data.mediaData,
                textData: data.textData,
              };
              const tempRootData = [...rootData, newSignageSet];
              // sort data by folder first and by sortBy value
              setRootData(tempRootData);
              setOpenAddMediaModal(false);
            }}
          />
        }
        editMediaModal={
          <EditSignageModal
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
                  name: data.signageSetName,
                  slideData: data.mediaData,
                  textData: data.textData,
                };
              }
              setRootData(tempRootData);
              setOpenEditMediaModal(false);
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
            id: 'signage',
            name: 'Signage',
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
