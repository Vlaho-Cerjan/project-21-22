'use client';

import type {ColDef, GridOptions} from 'ag-grid-enterprise';
import type {AgGridReact} from 'ag-grid-react';
import dynamic from 'next/dynamic';
import {usePathname} from 'next/navigation';
import Script from 'next/script';
import React from 'react';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import type {Filter} from '@/types/filterData';
import type {GridData} from '@/types/gridData';
import Loading from '../common/loading/loading';
import Skeleton from '../common/skeleton/skeleton';
import GridListHeader from './gridListHeader/gridListHeader';
import GridViewHeader from './gridListViewHeader/gridViewHeader';

const CustomSearchModalLazy = dynamic(
  () => import('../common/searchModal/customSearchModal'),
  {
    ssr: false,
  },
);
const AddFolderModalLazy = dynamic(
  () => import('../common/modals/addFolderModal'),
  {
    ssr: false,
  },
);

const EditFolderModalLazy = dynamic(
  () => import('../common/modals/editFolderModal'),
  {
    ssr: false,
  },
);

const DeleteItemModalLazy = dynamic(
  () => import('../common/modals/deleteItemsModal'),
  {
    ssr: false,
  },
);

const FolderFilterSidebarLazy = dynamic(
  () => import('../folderView/filterSidebar'),
  {
    ssr: false,
  },
);

const ListViewLazy = dynamic(
  () => import('../folderView/ssrmListView/ssrmWrappedListView'),
  {
    ssr: false,
    loading: () => <Skeleton className="absolute folderView" />,
  },
);

const ForwardedRefListView = React.forwardRef<
  AgGridReact,
  {
    data: GridData[];
    setData: React.Dispatch<React.SetStateAction<GridData[]>>;
    selectedMedia: GridData[];
    onItemDeSelect: (items: GridData[]) => void;
    onMediaEdit: (item: GridData) => void;
    noUpload?: boolean;
    type?: string;
    columnDefsData?: ColDef[];
    groupColumnDefData?: ColDef;
    gridOptions?: GridOptions;
    hardcodedTopFolders?: boolean;
    onDragDropFunction?: (updatedRows: GridData[]) => Promise<{
      success: boolean;
    }>;
    saveGridSettings?: (gridSettings: GridSettings) => void;
    pageLimit?: number;
  }
>((props, ref) => {
  const {
    data,
    setData,
    selectedMedia,
    onItemDeSelect,
    onMediaEdit,
    noUpload,
    type,
    columnDefsData,
    groupColumnDefData,
    gridOptions,
    hardcodedTopFolders,
    saveGridSettings,
    onDragDropFunction,
    pageLimit,
  } = props;

  return (
    <ListViewLazy
      gridRef={ref}
      data={data}
      setData={setData}
      selectedMedia={selectedMedia}
      onItemDeSelect={onItemDeSelect}
      onMediaEdit={onMediaEdit}
      noUpload={noUpload}
      type={type}
      columnDefsData={columnDefsData}
      groupColumnDefData={groupColumnDefData}
      gridOptions={gridOptions}
      hardcodedTopFolders={hardcodedTopFolders}
      saveGridSettings={saveGridSettings}
      pageLimit={pageLimit}
      onDragDropFunction={onDragDropFunction}
    />
  );
});

ForwardedRefListView.displayName = 'ForwardedRefListView';

export default function GridListView({
  open,
  rootData,
  setRootData,
  selectedItems,
  placeName,
  onItemDeSelect,
  type,
  addMediaModal,
  editMediaModal,
  editMediaData,
  setEditMediaData,
  // deleteItemsFunction,
  addFolderFunction,
  addFolderButtonDataId,
  addFolderTooltipText,
  addFolderIcon,
  addFolderName,
  addFolderDataId,
  editFolderFunction,
  editFolderDataId,
  editFolderName,
  editFolderData,
  openEditFolderModal,
  setOpenEditFolderModal,
  filters,
  setFilters,
  searchDataTypes,
  searchDisplayKeys,
  // openAddMediaModal,
  setOpenAddMediaModal,
  openEditMediaModal,
  setOpenEditMediaModal,
  columnDefsData,
  groupColumnDefData,
  gridOptions,
  addButtonTooltipText,
  addButtonIcon,
  hardcodedTopFolders,
  approveButtonTooltipText,
  onApprove,
  approveButtonIcon,
  denyButtonTooltipText,
  deleteTooltipText,
  onDeny,
  denyButtonIcon,
  deleteModalDataId,
  deleteModalText,
  deleteModalDescription,
  deleteItemsFunction,
  addButtonDataId,
  denyButtonDataId,
  approveButtonDataId,
  openSearchModalDataId,
  clearSearchDataId,
  mobileClearSearchDataId,
  deleteButtonDataId,
  sortKeys,
  selectedSortKey,
  onSort,
  direction,
  onSearch,
  setSearchTextList,
  saveGridSettings,
  pageLimit,
  //totalPages,
  //page,
  //setPage,
  grid,
  listLoading,
  deleteOpen,
  setDeleteOpen,
  showDeleteButton,
  noSearch,
  onDragDropFunction,
  // setListLoading,

  noFolderGroups,
}: {
  open?: boolean;
  rootData: GridData[];
  setRootData: React.Dispatch<React.SetStateAction<any[]>>;
  selectedItems: GridData[];
  placeName: string;
  onItemDeSelect: (items: GridData[]) => void;
  type: 'modal' | 'page';
  addMediaModal?: React.ReactNode;
  editMediaModal: React.ReactNode;
  editMediaData: GridData | undefined;
  setEditMediaData: React.Dispatch<React.SetStateAction<any | undefined>>;
  // deleteItemsFunction: () => void;
  addFolderFunction?: (
    data: {
      name: string;
      description?: string;
    },
    parentId?: string,
  ) => Promise<'success' | 'error'>;
  addFolderButtonDataId?: string;
  addFolderTooltipText?: string;
  addFolderIcon?: React.ReactNode;
  addFolderName?: string;
  addFolderDataId?: string;
  editFolderFunction?: (
    data: {
      name: string;
      description?: string;
    },
    folderId?: string,
  ) => Promise<'success' | 'error'>;
  editFolderDataId?: string;
  editFolderName?: string;
  editFolderData?: GridData | null;
  openEditFolderModal?: boolean;
  setOpenEditFolderModal?: React.Dispatch<React.SetStateAction<boolean>>;
  searchDataTypes?: {
    id: string;
    name: string;
    defItems: number;
  }[];
  searchDisplayKeys?: (
    | {
        id: any;
        position: 'top left' | 'top right' | 'bottom right';
      }
    | {
        id: any[];
        position: 'bottom left';
      }
  )[];
  // openAddMediaModal: boolean;
  setOpenAddMediaModal?: React.Dispatch<React.SetStateAction<boolean>>;
  openEditMediaModal: boolean;
  setOpenEditMediaModal: React.Dispatch<React.SetStateAction<boolean>>;
  filters?: Filter[];
  setFilters?: React.Dispatch<React.SetStateAction<Filter[]>>;
  columnDefsData?: ColDef[];
  groupColumnDefData?: ColDef;
  gridOptions?: GridOptions;
  addButtonIcon?: React.ReactNode;
  deleteTooltipText?: string;
  deleteModalDataId?: string;
  addButtonTooltipText?: string;
  approveButtonTooltipText?: string;
  onApprove?: () => void;
  approveButtonIcon?: React.ReactNode;
  denyButtonTooltipText?: string;
  onDeny?: () => void;
  denyButtonIcon?: React.ReactNode;
  hardcodedTopFolders?: boolean;
  deleteModalText?: string;
  deleteModalDescription?: string;
  deleteItemsFunction?: () => Promise<'success' | 'error'>;
  addButtonDataId?: string;
  denyButtonDataId?: string;
  approveButtonDataId?: string;
  openSearchModalDataId?: string;
  clearSearchDataId?: string;
  mobileClearSearchDataId?: string;
  deleteButtonDataId?: string;
  sortKeys?: string[];
  selectedSortKey?: string;
  onSort?: (sortKey: string, direction: string) => void;
  direction?: string;
  onSearch?: (
    searchText: string,
    filters: Filter[],
    id?: string,
  ) => Promise<GridData[]>;
  setSearchTextList?: React.Dispatch<React.SetStateAction<string>>;
  saveGridSettings: (settings: GridSettings) => void;
  totalPages?: number;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  pageLimit?: number;
  grid?: React.RefObject<AgGridReact>;
  listLoading?: boolean;
  deleteOpen?: boolean;
  setDeleteOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  showDeleteButton?: boolean;
  noSearch?: boolean;
  // setListLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  onDragDropFunction?: (updatedRows: GridData[]) => Promise<{
    success: boolean;
  }>;
  noFolderGroups?: boolean;
}) {
  const pathname = usePathname();

  const [modalDelay, setModalDelay] = React.useState(false);
  const [openFilterSidebar, setOpenFilterSidebar] = React.useState(false);
  const [openAddFolderModal, setOpenAddFolderModal] = React.useState(false);
  const [deleteMediaModalOpen, setDeleteMediaModalOpen] = React.useState(false);
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [gridSearchText, setGridSearchText] = React.useState('');
  const [searchData, setSearchData] = React.useState<GridData[]>([]);
  const [showFolderButton, setShowFolderButton] = React.useState(false);

  React.useEffect(() => {
    if (typeof addFolderFunction !== 'undefined') setShowFolderButton(true);
  }, [addFolderFunction]);

  React.useEffect(() => {
    if (typeof setSearchTextList !== 'undefined')
      setSearchTextList(gridSearchText);
  }, [gridSearchText]);

  React.useEffect(() => {
    if (!openEditMediaModal) setEditMediaData(undefined);
  }, [openEditMediaModal]);

  React.useEffect(() => {
    if (deleteOpen) {
      setDeleteMediaModalOpen(true);
    }
  }, [deleteOpen]);

  React.useEffect(() => {
    if (!deleteMediaModalOpen) {
      if (typeof setDeleteOpen !== 'undefined') setDeleteOpen(false);
    }
  }, [deleteMediaModalOpen]);

  React.useEffect(() => {
    setTimeout(() => {
      setModalDelay(true);
    }, 500);
  }, []);

  React.useEffect(() => {
    if (typeof open !== 'undefined' && !open) {
      const hdata = window.history.state;
      window.history.pushState(hdata, '', pathname);
    }
  }, [open]);

  const onDeleteItems = () => {
    setDeleteMediaModalOpen(true);
  };

  /*
  const addFolderFunc = (folderName: string, folderId?: string) => {
    const parentsNames = rootData.find(
      (item) => item.id === folderId,
    )?.orgHierarchy;

    const newFolderItem: GridData = {
      name: folderName,
      id: Math.random().toString(),
      type: 'folder',
      folderId: folderId || undefined,
      orgHierarchy: parentsNames ? [...parentsNames, folderName] : [folderName],
      created_at: new Date().toISOString(),
    };

    const newRootData = [...rootData, newFolderItem];
    setRootData(newRootData);
    setMediaData([...mediaData, newFolderItem]);
  };
  */

  return (
    <div id="folderViewContainer" className="folderViewContainer">
      <GridListHeader
        id="folderModalHeader"
        itemCount={rootData ? rootData.length : 0}
        noSearch={noSearch}
        setOpenAddFolderModal={setOpenAddFolderModal}
        showFolderButton={showFolderButton}
        addFolderButtonDataId={addFolderButtonDataId}
        addFolderIcon={addFolderIcon}
        addFolderTooltipText={addFolderTooltipText}
        showDeleteButton={showDeleteButton}
        addButtonDataId={addButtonDataId}
        denyButtonDataId={denyButtonDataId}
        approveButtonDataId={approveButtonDataId}
        openSearchModalDataId={openSearchModalDataId}
        clearSearchDataId={clearSearchDataId}
        mobileClearSearchDataId={mobileClearSearchDataId}
        deleteButtonDataId={deleteButtonDataId}
        setOpenAddMediaModal={setOpenAddMediaModal}
        openSearchModal={openSearchModal}
        setOpenSearchModal={setOpenSearchModal}
        placeName={placeName}
        type={type}
        onDeleteItems={onDeleteItems}
        selectedItems={selectedItems}
        deleteTooltipText={deleteTooltipText}
        addButtonTooltipText={addButtonTooltipText}
        addButtonIcon={addButtonIcon}
        approveButtonTooltipText={approveButtonTooltipText}
        onApprove={onApprove}
        approveButtonIcon={approveButtonIcon}
        denyButtonTooltipText={denyButtonTooltipText}
        onDeny={onDeny}
        denyButtonIcon={denyButtonIcon}
        resetData={async () => {
          if (typeof onSearch !== 'undefined') await onSearch('', []);
          setGridSearchText('');
          setTimeout(() => {
            setSearchText('');
          }, 500);
          const api = grid?.current?.api;
          if (api) {
            setTimeout(() => {
              api.collapseAll();
            }, 100);
          }
        }}
        gridSearchText={gridSearchText}
        searchText={searchText}
      />
      <div className="folderViewContent">
        <GridViewHeader
          setFolderSidebarOpen={setOpenFilterSidebar}
          filters={filters}
          setFilters={setFilters}
          onSort={onSort}
          sortKeys={sortKeys}
          selectedSortKey={selectedSortKey}
          direction={direction}
        />
        {(typeof open === 'undefined' || open) && (
          <div id="gridListContainer" className="gridListContainer list">
            <div className="listView">
              <ForwardedRefListView
                ref={grid}
                data={rootData}
                setData={setRootData}
                selectedMedia={selectedItems}
                onItemDeSelect={onItemDeSelect}
                onMediaEdit={(data: any) => {
                  setEditMediaData(data);
                  setOpenEditMediaModal(true);
                }}
                columnDefsData={columnDefsData}
                groupColumnDefData={groupColumnDefData}
                gridOptions={gridOptions}
                hardcodedTopFolders={hardcodedTopFolders}
                saveGridSettings={saveGridSettings}
                pageLimit={pageLimit}
                onDragDropFunction={onDragDropFunction}
              />
              {typeof listLoading !== 'undefined' && (
                <Loading loading={listLoading} />
              )}
            </div>
          </div>
        )}
        {/*
        page &&
          typeof setPage !== 'undefined' &&
          typeof totalPages !== 'undefined' &&
          totalPages > 1 && (
            <GridListViewFooter
              page={page}
              setPage={setPage}
              pageSize={totalPages || 1}
            />
          )
          */}
      </div>
      {modalDelay && (
        <>
          {addMediaModal}
          {editMediaData && editMediaModal}
          {filters && typeof setFilters !== 'undefined' && (
            <FolderFilterSidebarLazy
              open={openFilterSidebar}
              setOpen={setOpenFilterSidebar}
              filters={filters}
              setFilters={setFilters}
            />
          )}
          {typeof editFolderFunction !== 'undefined' &&
            typeof openEditFolderModal !== 'undefined' &&
            typeof setOpenEditFolderModal !== 'undefined' &&
            typeof editFolderData !== 'undefined' &&
            editFolderData !== null && (
              <EditFolderModalLazy
                editFolderData={editFolderData}
                editFolderDataId={editFolderDataId}
                editFolderName={editFolderName}
                noGroups={noFolderGroups}
                open={openEditFolderModal}
                setOpen={setOpenEditFolderModal}
                onSubmit={async (submitData) => {
                  const res = await editFolderFunction(submitData);
                  if (res === 'success') setOpenEditFolderModal(false);
                  return res;
                }}
                folderData={
                  rootData && rootData.filter((rd) => rd.type === 'folder')
                }
              />
            )}
          {typeof addFolderFunction !== 'undefined' && (
            <AddFolderModalLazy
              addFolderDataId={addFolderDataId}
              addFolderName={addFolderName}
              noGroups={noFolderGroups}
              hardcodedTopFolders={!!hardcodedTopFolders}
              folderData={
                rootData && rootData.filter((rd) => rd.type === 'folder')
              }
              open={openAddFolderModal}
              setOpen={setOpenAddFolderModal}
              placeName={placeName}
              onSubmit={async (submitData, parentId) => {
                const res = await addFolderFunction(submitData, parentId);
                if (res === 'success') setOpenAddFolderModal(false);
                return res;
              }}
            />
          )}
          {typeof deleteItemsFunction !== 'undefined' && (
            <DeleteItemModalLazy
              modalDataId={deleteModalDataId}
              deleteButtonDataId={deleteButtonDataId}
              text={deleteModalText}
              description={deleteModalDescription}
              open={deleteMediaModalOpen}
              setOpen={setDeleteMediaModalOpen}
              itemCount={selectedItems.length}
              onSubmit={() => {
                const res = deleteItemsFunction();
                setDeleteMediaModalOpen(false);

                return res;
              }}
            />
          )}
          {(typeof noSearch === 'undefined' || !noSearch) &&
            typeof onSearch !== 'undefined' &&
            searchDataTypes &&
            searchDisplayKeys && (
              <CustomSearchModalLazy
                onSearch={onSearch}
                filters={filters || []}
                openSearch={openSearchModal}
                setOpenSearch={setOpenSearchModal}
                searchText={searchText}
                setSearchText={setSearchText}
                setGridSearchText={setGridSearchText}
                data={searchData}
                setData={setSearchData}
                dataTypes={searchDataTypes}
                displayKeys={searchDisplayKeys}
              />
            )}
        </>
      )}
      <Script async defer src="/assets/js/dragAndDrop.min.js" />
    </div>
  );
}
