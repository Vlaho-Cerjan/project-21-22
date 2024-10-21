/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import type {
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
import React from 'react';

import type {BackendMixesData} from '@/src/constants/backendData';
import {backendMixesData} from '@/src/constants/backendData';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import type {GridData} from '@/types/gridData';
import {editCellRenderer} from '../common/listComponents/listComponents';
import FolderView from '../folderView/folderView';

export default function MediaAssetsPage() {
  const [rootData, setRootData] =
    React.useState<BackendMixesData[]>(backendMixesData);
  const [mediaData, setMediaData] = React.useState(
    rootData.filter((item) => item.orgHierarchy.length === 1),
  );
  const [selectedItems, setSelectedItems] = React.useState<BackendMixesData[]>(
    [],
  );
  const onItemDeSelect = (items: GridData[]) => {
    setSelectedItems(items as any);
  };
  const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<any | null>(null);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  // const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(
  //  null,
  // ;

  const sorts = ['name', 'updated_at', 'created_at'];

  return (
    <div className="viewContainer mixViewContainer">
      <FolderView
        onSearch={() => {
          return Promise.resolve([]);
        }}
        // fuseSearchKey={['name', 'mix.playlist.name']}
        addButtonTooltipText="Add Mix"
        sortKeys={sorts}
        data={rootData}
        setData={setRootData}
        listData={mediaData}
        editMediaData={editMediaData}
        setListData={setMediaData}
        onItemDeSelect={onItemDeSelect}
        selectedItems={selectedItems}
        placeName="Mixes"
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
        addMediaModal={<div />}
        editMediaModal={<div />}
        setEditMediaData={setEditMediaData}
        openAddMediaModal={openAddMediaModal}
        setOpenAddMediaModal={setOpenAddMediaModal}
        openEditMediaModal={openEditMediaModal}
        setOpenEditMediaModal={setOpenEditMediaModal}
        searchDataTypes={[
          {
            id: 'mix',
            name: 'Mix',
            defItems: 5,
          },
        ]}
        searchDisplayKeys={[
          {
            id: 'name',
            position: 'top left',
          },
        ]}
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
        onFolderDoubleClickFunction={function (_folder: GridData): void {
          throw new Error('Function not implemented.');
        }}
        folderView="list"
        setFolderView={function (
          _value: React.SetStateAction<'list' | 'card'>,
        ): void {
          throw new Error('Function not implemented.');
        }}
        addFolderFunction={function (
          _data: {name: string; description?: string},
          _parentId?: string,
        ): Promise<'success' | 'error'> {
          throw new Error('Function not implemented.');
        }}
      />
    </div>
  );
}
