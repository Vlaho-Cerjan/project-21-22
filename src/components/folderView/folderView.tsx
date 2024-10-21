'use client';

import type {ColDef, GridOptions} from 'ag-grid-enterprise';
import type {AgGridReact} from 'ag-grid-react';
import type {FuseResult} from 'fuse.js';
import dynamic from 'next/dynamic';
import {usePathname} from 'next/navigation';
import Script from 'next/script';
import React from 'react';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import type {Filter} from '@/types/filterData';
import type {GridData} from '@/types/gridData';
import Loading from '../common/loading/loading';
import Skeleton from '../common/skeleton/skeleton';
import FolderModalHeader from './folderModalHeader';
import FolderViewHeader from './folderViewHeader';

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

const DeleteItemModalLazy = dynamic(
  () => import('../common/modals/deleteItemsModal'),
  {
    ssr: false,
  },
);

const FolderFilterSidebarLazy = dynamic(() => import('./filterSidebar'), {
  ssr: false,
});

const ListViewLazy = dynamic(
  () => import('./ssrmListView/ssrmWrappedListView'),
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
    noSelect?: boolean;
    onItemDeSelect: (items: GridData[]) => void;
    onMediaEdit: (item: GridData) => void;
    noUpload?: boolean;
    type?: string;
    columnDefsData?: ColDef[];
    groupColumnDefData?: ColDef;
    gridOptions?: GridOptions;
    hardcodedTopFolders?: boolean;
    saveGridSettings?: (gridSettings: GridSettings) => void;
    pageLimit?: number;
    onDragDropFunction?: (updatedRows: GridData[]) => Promise<{
      success: boolean;
    }>;
  }
>((props, ref) => {
  const {
    data,
    setData,
    selectedMedia,
    noSelect,
    onItemDeSelect,
    onMediaEdit,
    noUpload,
    type,
    columnDefsData,
    groupColumnDefData,
    gridOptions,
    hardcodedTopFolders,
    saveGridSettings,
    pageLimit,
    onDragDropFunction,
  } = props;

  return (
    <ListViewLazy
      gridRef={ref}
      data={data}
      setData={setData}
      noSelect={noSelect}
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

const CardViewLazy = dynamic(() => import('./cardView/cardView'), {
  ssr: false,
  loading: () => <Skeleton className="absolute folderView" />,
});

// TODO fix hardcoded top folders to be boolean and to automatically find all the folders instead

export default function FolderView({
  open,
  data,
  setData,
  listData,
  setListData,
  selectedItems,
  placeName,
  // noFolderSelect,
  noSelect,
  noUpload,
  onItemDeSelect,
  type,
  addMediaModal,
  editMediaModal,
  editMediaData,
  setEditMediaData,
  // deleteItemsFunction,
  // addFolderFunction,
  filters,
  setFilters,
  searchDataTypes,
  searchDisplayKeys,
  // openAddMediaModal,
  setOpenAddMediaModal,
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
  // setListLoading,
  // fuseSearchKeys,
  openAddMediaModal,
  openEditMediaModal,
  findFolder,
  addFolderFunction,
  addFolderButtonDataId,
  addFolderTooltipText,
  addFolderIcon,
  addFolderName,
  onFolderDoubleClickFunction,
  folderView,
  setFolderView,
  onFileUpload,
  noAddFolderGroups,
  onBreadcrumbClickFunction,

  onDragDropItem,
  onDragDropFunction,
}: {
  open?: boolean;
  data: GridData[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  listData: GridData[];
  setListData: React.Dispatch<React.SetStateAction<any[]>>;
  selectedItems: GridData[];
  placeName: string;
  // noFolderSelect?: boolean;
  noSelect?: boolean;
  noUpload?: boolean;
  onItemDeSelect: (items: GridData[]) => void;
  type: 'modal' | 'page';
  addMediaModal?: React.ReactNode;
  editMediaModal: React.ReactNode;
  editMediaData: GridData | undefined;
  setEditMediaData: React.Dispatch<React.SetStateAction<any | undefined>>;
  // deleteItemsFunction: () => void;
  // addFolderFunction: (folderName: string, parentId: string[] | null) => void;
  searchDataTypes: {
    id: string;
    name: string;
    defItems: number;
  }[];
  searchDisplayKeys: (
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
  setOpenEditMediaModal: React.Dispatch<React.SetStateAction<boolean>>;
  filters?: Filter[];
  setFilters?: React.Dispatch<React.SetStateAction<Filter[]>>;
  columnDefsData?: ColDef[];
  groupColumnDefData?: ColDef;
  gridOptions?: GridOptions;
  addButtonIcon?: React.ReactNode;
  deleteTooltipText?: string;
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
  onSearch: (
    searchText: string,
    filters: Filter[],
    id?: string,
  ) => Promise<GridData[]>;
  setSearchTextList: React.Dispatch<React.SetStateAction<string>>;
  saveGridSettings: (settings: GridSettings) => void;
  totalPages?: number;
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  pageLimit?: number;
  grid?: React.RefObject<AgGridReact>;
  listLoading?: boolean;
  // setListLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  // fuseSearchKeys?: string[];
  openAddMediaModal?: boolean;
  openEditMediaModal?: boolean;
  findFolder: (folderId: string | null) => any;
  addFolderFunction: (
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
  onFolderDoubleClickFunction: (folder: GridData) => void;
  folderView: 'list' | 'card';
  setFolderView: React.Dispatch<React.SetStateAction<'list' | 'card'>>;
  onFileUpload?: ({
    name,
    url,
    type,
    folderId,
  }: {
    name: string;
    url: string;
    type: string;
    folderId?: string;
  }) => void;
  onDragDropItem?: ({
    item,
    destination,
  }: {
    item: GridData;
    destination: string;
  }) => Promise<{
    success: boolean;
  }>;
  noAddFolderGroups?: boolean;
  onBreadcrumbClickFunction?: (folderId: string) => void;
  onDragDropFunction?: (updatedRows: GridData[]) => Promise<{
    success: boolean;
  }>;
}) {
  const pathname = usePathname();
  const [isGrid, setIsGrid] = React.useState(false);
  const [breadcrumbs, setBreadcrumbs] = React.useState<
    {id: string; name: string}[]
  >([{id: '-1', name: placeName}]);
  const [selectedFolder, setSelectedFolder] = React.useState<{
    id: string;
    level: string;
  } | null>(null);
  const [prevFolder, setPrevFolder] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [openFilterSidebar, setOpenFilterSidebar] = React.useState(false);
  const [openAddFolderModal, setOpenAddFolderModal] = React.useState(false);
  const [deleteMediaModalOpen, setDeleteMediaModalOpen] = React.useState(false);
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [gridSearchText, setGridSearchText] = React.useState('');
  const [searchData, setSearchData] = React.useState<FuseResult<GridData>[]>(
    data
      ? data.map((item) => {
          return {
            item,
            refIndex: 0,
            score: 0,
            matches: [],
          };
        })
      : [],
  );

  React.useEffect(() => {
    if (!openEditMediaModal) setEditMediaData(undefined);
  }, [openEditMediaModal]);
  const [modalDelay, setModalDelay] = React.useState(false);

  React.useEffect(() => {
    if (isGrid) {
      setFolderView('card');
    } else {
      setFolderView('list');
    }
  }, [isGrid]);

  React.useEffect(() => {
    setTimeout(() => {
      setModalDelay(true);
    }, 500);
  }, []);

  /*
  const handleSearch = async (data: GridData[], searchTextTemp: string) => {
    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(data, {
      keys: fuseSearchKeys || ['name', 'type', 'duration', 'size', 'text'],
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
        data.map((item) => ({
          item,
          refIndex: 0,
          score: 0,
          matches: [],
        })),
      );
    }
  };
*/
  const onFolderDoubleClick = React.useMemo(
    () => (folder: GridData) => {
      onFolderDoubleClickFunction(folder);
      setSelectedFolder({
        id: folder.id || '',
        level: folder.group_id ? 'sub' : 'top',
      });
      setPrevFolder(
        breadcrumbs[breadcrumbs.length - 1] || {
          id: '-1',
          name: placeName,
        },
      );
      setBreadcrumbs([
        ...breadcrumbs,
        {id: folder.id || '', name: folder.name || ''},
      ]);
      const hdata = window.history.state;
      window.history.pushState(hdata, '', `?folderId=${folder.id}`);
    },
    [placeName, breadcrumbs],
  );

  const setBreadcrumbsData = React.useMemo(
    () => (hierarchy: string[]) => {
      const breadcrumbsData = [
        {
          id: '-1',
          name: placeName,
        },
      ];
      for (let i = 0; i < hierarchy.length; i += 1) {
        const item = data.find(
          (tempItem) => tempItem.orgHierarchy === hierarchy.slice(0, i + 1),
        );
        if (item)
          breadcrumbsData.push({
            id: item.id || '',
            name: item.name || '',
          });
      }

      setBreadcrumbs(breadcrumbsData);
    },
    [placeName],
  );

  React.useEffect(() => {
    setSearchTextList(gridSearchText);
  }, [gridSearchText]);

  React.useEffect(() => {
    const setFolderViewEffect = async () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('folderId')) {
        const folderData = await findFolder(params.get('folderId') || '');
        if (folderData) {
          setData(folderData.data || []);
          setBreadcrumbsData(folderData.orgHierarchy || []);
        }
      } else {
        setBreadcrumbs([{id: '-1', name: placeName}]);
      }
    };
    setFolderViewEffect();
    window.addEventListener('popstate', setFolderViewEffect);
    return () => {
      window.removeEventListener('popstate', setFolderViewEffect);
    };
  }, []);

  const onBreadcrumbClick = React.useMemo(
    () => async (folderId: string) => {
      const hdata = window.history.state;
      if (typeof onBreadcrumbClickFunction !== 'undefined')
        onBreadcrumbClickFunction(folderId);
      if (folderId === '-1') {
        const folderData = await findFolder(null);
        if (folderData) setData(folderData.data);
        setPrevFolder(null);
        setSelectedFolder(null);
        setBreadcrumbs([{id: '-1', name: placeName}]);
        window.history.pushState(hdata, '', pathname);
        return;
      }

      const folderData = await findFolder(folderId);
      if (folderData) setData(folderData.data);
      const folderIndex = breadcrumbs.findIndex((item) => item.id === folderId);
      const newBc = breadcrumbs.slice(0, folderIndex + 1);
      setBreadcrumbs(newBc);
      setSelectedFolder({
        id: folderData.id || '',
        level: folderData.group_id ? 'sub' : 'top',
      });
      // console.log(newBc, folderId, 'breadcrumbs');
      setPrevFolder(
        newBc[newBc.length - 2] || {
          id: '-1',
          name: placeName,
        },
      );
      window.history.pushState(hdata, '', `?folderId=${folderId}`);
    },
    [placeName, breadcrumbs],
  );

  React.useEffect(() => {
    if (folderView === 'list') {
      setIsGrid(false);
      if (breadcrumbs.length > 1) onBreadcrumbClick('-1');
    } else {
      setIsGrid(true);
    }
  }, [folderView]);

  React.useEffect(() => {
    if (!open) {
      setBreadcrumbs([{id: '-1', name: placeName}]);
      const hdata = window.history.state;
      window.history.pushState(hdata, '', pathname);
    }
  }, [open, placeName]);

  const onDeleteItems = () => {
    setDeleteMediaModalOpen(true);
  };

  const isModalOpen = React.useMemo(() => {
    return (
      openFilterSidebar ||
      openAddFolderModal ||
      deleteMediaModalOpen ||
      openAddMediaModal ||
      openEditMediaModal ||
      openSearchModal
    );
  }, [
    openFilterSidebar,
    openAddFolderModal,
    deleteMediaModalOpen,
    openAddMediaModal,
    openEditMediaModal,
    openSearchModal,
  ]);

  return (
    <div id="folderViewContainer" className="folderViewContainer">
      <FolderModalHeader
        id="folderModalHeader"
        itemCount={data.length || 0}
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={onBreadcrumbClick}
        setOpenAddFolderModal={setOpenAddFolderModal}
        addFolderButtonDataId={addFolderButtonDataId}
        addFolderIcon={addFolderIcon}
        addFolderTooltipText={addFolderTooltipText}
        // setOpenAddFolderModal={setOpenAddFolderModal}
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
          await onSearch('', []);
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
        <FolderViewHeader
          isGrid={isGrid}
          setIsGrid={setIsGrid}
          setFolderSidebarOpen={setOpenFilterSidebar}
          filters={filters}
          setFilters={setFilters}
          onSort={onSort}
          sortKeys={sortKeys}
          selectedSortKey={selectedSortKey}
          direction={direction}
        />
        {(typeof open === 'undefined' || open) && (
          <div
            id="gridListContainer"
            className={`gridListContainer${isGrid ? ' grid' : ' list'}`}
          >
            <div className="listView">
              <ForwardedRefListView
                ref={grid}
                data={listData}
                setData={setListData}
                selectedMedia={selectedItems}
                noSelect={noSelect}
                onItemDeSelect={onItemDeSelect}
                onMediaEdit={(dataMediaEdit: any) => {
                  setEditMediaData(dataMediaEdit);
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
            </div>
            <div id="folderView" className="folderView">
              <CardViewLazy
                placeName={placeName}
                onDragDropItem={onDragDropItem}
                onFileUpload={onFileUpload}
                noUpload={noUpload}
                rootData={data}
                setRootData={setData}
                onFolderDoubleClick={onFolderDoubleClick}
                noSelect={noSelect}
                prevFolder={prevFolder}
                selectedFolder={selectedFolder}
                selectedItems={selectedItems}
                onItemDeSelect={onItemDeSelect}
                breadcrumbs={breadcrumbs}
                onBreadcrumbClick={onBreadcrumbClick}
                // findFolder={findFolder}
                isModalOpen={isModalOpen}
                isVisible={open}
                onMediaEdit={(dataMediaEdit: any) => {
                  setEditMediaData(dataMediaEdit);
                  setOpenEditMediaModal(true);
                }}
                hardcodedTopFolders={hardcodedTopFolders}
              />
              {typeof listLoading !== 'undefined' && (
                <Loading classes={['fullBg']} loading={listLoading} />
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
          {typeof filters !== 'undefined' &&
            filters &&
            typeof setFilters !== 'undefined' && (
              <FolderFilterSidebarLazy
                open={openFilterSidebar}
                setOpen={setOpenFilterSidebar}
                filters={filters}
                setFilters={setFilters}
              />
            )}
          <AddFolderModalLazy
            addFolderName={addFolderName}
            noGroups={noAddFolderGroups}
            hardcodedTopFolders={!!hardcodedTopFolders}
            folderData={data.filter((rd) => rd.type === 'folder')}
            selectedFolder={selectedFolder}
            open={openAddFolderModal}
            setOpen={setOpenAddFolderModal}
            placeName={placeName}
            onSubmit={async (submitData, parentId) => {
              const res = await addFolderFunction(submitData, parentId);
              if (res === 'success') setOpenAddFolderModal(false);
              return res;
            }}
          />
          <DeleteItemModalLazy
            text={deleteModalText}
            description={deleteModalDescription}
            open={deleteMediaModalOpen}
            setOpen={setDeleteMediaModalOpen}
            itemCount={selectedItems.length}
            onSubmit={async () => {
              if (typeof deleteItemsFunction !== 'undefined') {
                const res = await deleteItemsFunction();

                setDeleteMediaModalOpen(false);
                return res;
              }

              setDeleteMediaModalOpen(false);
              return 'error';
            }}
          />
          <CustomSearchModalLazy
            filters={filters}
            onSearch={onSearch}
            setData={setSearchData}
            openSearch={openSearchModal}
            setOpenSearch={setOpenSearchModal}
            searchText={searchText}
            setSearchText={setSearchText}
            setGridSearchText={setGridSearchText}
            data={searchData}
            dataTypes={searchDataTypes}
            displayKeys={searchDisplayKeys}
          />
        </>
      )}
      <Script async defer src="/assets/js/dragAndDrop.min.js" />
    </div>
  );
}
