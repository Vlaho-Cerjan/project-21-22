/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import type {FuseResult} from 'fuse.js';
import dynamic from 'next/dynamic';
import {usePathname} from 'next/navigation';
import Script from 'next/script';
import React from 'react';

import type {BackendSignageData} from '@/src/constants/backendData';
import {backendSignageData} from '@/src/constants/backendData';
import MemoEditMoreSignage from '@/src/icons/edit-more-signage';

import type {Filter} from '@/types/filterData';
import Skeleton from '../common/skeleton/skeleton';
import FolderModalHeader from '../folderView/folderModalHeader';
import FolderViewHeader from '../folderView/folderViewHeader';

const CustomSearchModalLazy = dynamic(
  () => import('../common/searchModal/customSearchModal'),
  {ssr: false},
);

const AddFolderModalLazy = dynamic(
  () => import('../common/modals/addFolderModal'),
  {ssr: false},
);

const DeleteItemModalLazy = dynamic(
  () => import('../common/modals/deleteItemsModal'),
  {ssr: false},
);

const CreateNewSignageModalLazy = dynamic(
  () => import('./modals/createNewSignageModal'),
  {ssr: false},
);

const EditSignageModalLazy = dynamic(
  () => import('./modals/editSignageModal'),
  {ssr: false},
);

const FolderFilterSidebarLazy = dynamic(
  () => import('../folderView/filterSidebar'),
  {ssr: false},
);

const ListViewLazy = dynamic(() => import('../folderView/listView/listView'), {
  ssr: false,
  loading: () => <Skeleton className="absolute folderView" />,
});

const CardViewLazy = dynamic(() => import('../folderView/cardView/cardView'), {
  ssr: false,
  loading: () => <Skeleton className="absolute folderView" />,
});

const filtersData: Filter[] = [
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

export default function SignageView({
  open,
  rootData,
  setRootData,
  selectedItems,
  // mediaData,
  setMediaData,
  placeName,
  onItemDeSelect,
  type,
}: {
  open?: boolean;
  rootData: BackendSignageData[];
  setRootData: React.Dispatch<React.SetStateAction<BackendSignageData[]>>;
  selectedItems: BackendSignageData[];
  // mediaData: BackendSignageData[];
  setMediaData: React.Dispatch<React.SetStateAction<BackendSignageData[]>>;
  placeName: string;
  onItemDeSelect: (items: BackendSignageData[]) => void;
  type: 'modal' | 'page';
}) {
  const pathname = usePathname();
  const [isGrid, setIsGrid] = React.useState(true);
  const [breadcrumbs, setBreadcrumbs] = React.useState<
    {id: string; name: string}[]
  >([{id: '-1', name: placeName}]);
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(
    null,
  );

  const [filters, setFilters] = React.useState<Filter[]>(filtersData);

  const [_prevFolderId, setPrevFolderId] = React.useState<string | null>(null);
  const [sortBy, _setSortBy] = React.useState('name');
  const [sortDirection, _setSortDirection] = React.useState('asc');

  const [openFilterSidebar, setOpenFilterSidebar] = React.useState(false);
  const [openFilterSidebarDelay, setOpenFilterSidebarDelay] =
    React.useState(false);
  const [openAddFolderModal, setOpenAddFolderModal] = React.useState(false);
  const [deleteMediaModalOpen, setDeleteMediaModalOpen] = React.useState(false);
  const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [openSearchModal, setOpenSearchModal] = React.useState(false);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<any | undefined>(
    undefined,
  );
  const [searchText, setSearchText] = React.useState('');
  const [searchData, setSearchData] = React.useState<
    FuseResult<BackendSignageData>[]
  >(
    rootData.map((item) => {
      return {
        item,
        refIndex: 0,
        score: 0,
        matches: [],
      };
    }),
  );
  const isModalOpen = React.useMemo(() => {
    return (
      openFilterSidebar ||
      openAddFolderModal ||
      deleteMediaModalOpen ||
      openAddMediaModal ||
      openSearchModal
    );
  }, [
    openFilterSidebar,
    openAddFolderModal,
    deleteMediaModalOpen,
    openAddMediaModal,
  ]);

  React.useEffect(() => {
    setTimeout(() => setOpenFilterSidebarDelay(true), 500);
  }, []);

  React.useEffect(() => {
    if (!openEditMediaModal) setTimeout(() => setEditMediaData(undefined), 300);
  }, [openEditMediaModal]);

  const handleSearch = async (
    data: BackendSignageData[],
    searchTextTemp: string,
  ) => {
    const Fuse = (await import('fuse.js')).default;
    const fuse = new Fuse(data, {
      keys: ['name', 'type', 'duration', 'size', 'text'],
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
        rootData.map((item) => ({
          item,
          refIndex: 0,
          score: 0,
          matches: [],
        })),
      );
    }
  };

  React.useEffect(() => {
    handleSearch(rootData, searchText);
  }, [searchText, rootData]);

  React.useEffect(() => {
    if (!isGrid) {
      setMediaData(rootData.filter((item) => item.orgHierarchy.length === 1));
      setPrevFolderId(null);
      setSelectedFolderId(null);
      setBreadcrumbs([{id: '-1', name: placeName}]);
    }
  }, [isGrid]);

  const getFilteredRootData = (folder?: BackendSignageData) => {
    if (!folder) {
      return rootData.filter((item) => item.orgHierarchy.length === 1);
    }
    const filteredRootData = rootData.filter(
      (item) => item.folderId === folder.id,
    );
    return filteredRootData;
  };

  const findFolder = (folderId: string) => {
    const folder = rootData.find((item) => item.id === folderId);
    return folder;
  };

  const onFolderDoubleClick = (folder: BackendSignageData) => {
    const folderData = getFilteredRootData(folder);
    setMediaData(folderData);
    setSelectedFolderId(folder.id);
    setPrevFolderId(
      (
        breadcrumbs[breadcrumbs.length - 1] || {
          id: '-1',
          name: placeName,
        }
      ).id,
    );
    setBreadcrumbs([...breadcrumbs, {id: folder.id, name: folder.name}]);
    const hdata = window.history.state;
    window.history.pushState(hdata, '', `?folderId=${folder.id}`);
  };

  const setBreadcrumbsData = (hierarchy: string[]) => {
    const breadcrumbsData = [
      {
        id: '-1',
        name: placeName,
      },
    ];
    for (let i = 0; i < hierarchy.length; i += 1) {
      const item = rootData.find(
        (tempItem) => tempItem.orgHierarchy === hierarchy.slice(0, i + 1),
      );
      if (item)
        breadcrumbsData.push({
          id: item.id,
          name: item.name,
        });
    }

    setBreadcrumbs(breadcrumbsData);
  };

  React.useEffect(() => {
    const setFolderView = () => {
      const params = new URLSearchParams(window.location.search);
      if (params.get('folderId')) {
        const folderData = findFolder(params.get('folderId') || '');
        if (folderData) {
          setMediaData(getFilteredRootData(folderData));
          setBreadcrumbsData(folderData.orgHierarchy);
        }
      } else {
        setMediaData(
          rootData.filter((item) => item.orgHierarchy.length === 1) || [],
        );
        setBreadcrumbs([{id: '-1', name: placeName}]);
      }
    };
    setFolderView();
    window.addEventListener('popstate', setFolderView);
    return () => {
      window.removeEventListener('popstate', setFolderView);
    };
  }, []);

  const onBreadcrumbClick = (folderId: string) => {
    const hdata = window.history.state;
    if (folderId === '-1') {
      setMediaData(rootData.filter((item) => item.orgHierarchy.length === 1));
      setPrevFolderId(null);
      setSelectedFolderId(null);
      setBreadcrumbs([{id: '-1', name: placeName}]);
      window.history.pushState(hdata, '', pathname);
      return;
    }

    const folderData = findFolder(folderId);
    if (folderData) setMediaData(getFilteredRootData(folderData));
    const folderIndex = breadcrumbs.findIndex((item) => item.id === folderId);
    setBreadcrumbs(breadcrumbs.slice(0, folderIndex + 1));
    setSelectedFolderId(folderId);
    setPrevFolderId(
      (
        breadcrumbs[breadcrumbs.length - 1] || {
          id: '-1',
          name: placeName,
        }
      ).id,
    );
    window.history.pushState(hdata, '', `?folderId=${folderId}`);
  };

  React.useEffect(() => {
    if (!open) {
      setMediaData(getFilteredRootData());
      setBreadcrumbs([{id: '-1', name: placeName}]);
      const hdata = window.history.state;
      window.history.pushState(hdata, '', pathname);
    }
  }, [open]);

  const sortData = (customRootData?: BackendSignageData[]) => {
    let tempRootData =
      typeof customRootData !== 'undefined'
        ? [...customRootData]
        : [...rootData];

    if (sortBy && sortDirection) {
      tempRootData = tempRootData.sort((a, b) => {
        const aVal = a[sortBy as keyof BackendSignageData] as string;
        const bVal = b[sortBy as keyof BackendSignageData] as string;
        if (sortBy === 'type') {
          // sort by image, video, text or reverse for desc
          if (aVal === 'image' && bVal !== 'image') {
            return sortDirection === 'asc' ? -1 : 1;
          }
          if (aVal !== 'image' && bVal === 'image') {
            return sortDirection === 'asc' ? 1 : -1;
          }
          if (aVal === 'video' && bVal !== 'video') {
            return sortDirection === 'asc' ? -1 : 1;
          }
          if (aVal !== 'video' && bVal === 'video') {
            return sortDirection === 'asc' ? 1 : -1;
          }
          if (aVal === 'text' && bVal !== 'text') {
            return sortDirection === 'asc' ? -1 : 1;
          }
          if (aVal !== 'text' && bVal === 'text') {
            return sortDirection === 'asc' ? 1 : -1;
          }
        }
        if (
          aVal &&
          bVal &&
          typeof aVal === 'string' &&
          typeof bVal === 'string'
        ) {
          if (aVal.toLowerCase() < bVal.toLowerCase()) {
            return sortDirection === 'asc' ? -1 : 1;
          }
          if (aVal.toLowerCase() > bVal.toLowerCase()) {
            return sortDirection === 'asc' ? 1 : -1;
          }
        } else if (
          aVal &&
          bVal &&
          typeof aVal === 'number' &&
          typeof bVal === 'number'
        ) {
          if (aVal < bVal) {
            return sortDirection === 'asc' ? -1 : 1;
          }
          if (aVal > bVal) {
            return sortDirection === 'asc' ? 1 : -1;
          }
        }
        return 0;
      });

      // sort folder first
      tempRootData = tempRootData.sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') {
          return -1;
        }
        if (a.type !== 'folder' && b.type === 'folder') {
          return 1;
        }
        return 0;
      });
    }

    setRootData(tempRootData);
    return tempRootData;
  };

  const filterData = () => {
    let tempRootData = [...rootData];

    if (
      filters &&
      filters.filter(
        (tempFilter) =>
          tempFilter.data.filter((item) => item.checked).length > 0,
      ).length > 0
    ) {
      // TODO filter with backend call
      // filter by type
      const typeFilter = filters.find((item) => item.id === 'type');

      const checkedTypeFilters = typeFilter?.data.filter(
        (item) => item.checked,
      );

      if (checkedTypeFilters && checkedTypeFilters.length > 0) {
        const typeFilters = checkedTypeFilters.map((item) => item.id);
        tempRootData = backendSignageData.filter((item) => {
          if (item.type === 'folder') {
            return true;
          }
          return typeFilters.includes(item.type);
        });
      } else {
        tempRootData = backendSignageData;
      }
    }
    if (
      filters &&
      !(
        filters.filter(
          (tempFilter) =>
            tempFilter.data.filter((item) => item.checked).length > 0,
        ).length > 0
      )
    ) {
      tempRootData = backendSignageData;
    }
    const tempSortedRootData = sortData(tempRootData);
    return tempSortedRootData;
  };

  React.useEffect(() => {
    filterData();
  }, [filters]);

  React.useEffect(() => {
    sortData();
  }, [sortBy, sortDirection]);

  React.useEffect(() => {
    if (rootData) {
      setMediaData(
        getFilteredRootData(
          selectedFolderId ? findFolder(selectedFolderId) : undefined,
        ),
      );
    }
  }, [rootData]);

  const onDeleteItems = () => {
    setDeleteMediaModalOpen(true);
  };

  return (
    <div id="signageSetsViewContainer" className="folderViewContainer">
      <FolderModalHeader
        openSearchModal={openSearchModal}
        resetData={() => {}}
        breadcrumbs={breadcrumbs}
        onBreadcrumbClick={onBreadcrumbClick}
        setOpenAddFolderModal={setOpenAddFolderModal}
        setOpenAddMediaModal={setOpenAddMediaModal}
        setOpenSearchModal={setOpenSearchModal}
        placeName={placeName}
        type={type}
        onDeleteItems={onDeleteItems}
        selectedItems={selectedItems}
        addButtonTooltipText="Create New Signage Set"
        addButtonIcon={<MemoEditMoreSignage />}
        id="signageSetsViewHeader"
        deleteTooltipText="Delete Signage Sets"
      />
      <div className="folderViewContent">
        <FolderViewHeader
          isGrid={isGrid}
          setIsGrid={setIsGrid}
          direction={sortDirection}
          selectedSortKey={sortBy}
          setFolderSidebarOpen={setOpenFilterSidebar}
        />
        <div
          id="gridListContainer"
          className={`gridListContainer${isGrid ? ' grid' : ' list'}`}
        >
          <div className="listView">
            <ListViewLazy
              data={rootData}
              setData={setRootData as any}
              setMediaData={setMediaData as any}
              selectedMedia={selectedItems}
              onItemDeSelect={onItemDeSelect as any}
              onMediaEdit={(data: any) => {
                setEditMediaData(data);
                setOpenEditMediaModal(true);
              }}
              noUpload
            />
          </div>
          <div id="folderView" className="folderView">
            <CardViewLazy
              rootData={rootData}
              setRootData={setRootData as any}
              onFolderDoubleClick={onFolderDoubleClick as any}
              selectedItems={selectedItems}
              onItemDeSelect={onItemDeSelect as any}
              breadcrumbs={breadcrumbs}
              onBreadcrumbClick={onBreadcrumbClick}
              isModalOpen={isModalOpen}
              onMediaEdit={(data: any) => {
                setEditMediaData(data);
                setOpenEditMediaModal(true);
              }}
              noUpload
              selectedFolder={null}
              prevFolder={null}
              placeName=""
            />
          </div>
        </div>
      </div>
      {openFilterSidebarDelay && (
        <FolderFilterSidebarLazy
          open={openFilterSidebar}
          setOpen={setOpenFilterSidebar}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      {openAddMediaModal && (
        <CreateNewSignageModalLazy
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
            sortData(tempRootData);
            setOpenAddMediaModal(false);
          }}
        />
      )}
      {openEditMediaModal && (
        <EditSignageModalLazy
          open={openEditMediaModal}
          setOpen={setOpenEditMediaModal}
          data={editMediaData}
          sortData={sortData}
          rootData={rootData}
          onSubmit={(data) => {
            const tempRootData = [...rootData];
            const index = tempRootData.findIndex((item) => item.id === data.id);
            const item = tempRootData[index];
            if (index !== -1 && item) {
              tempRootData[index] = {
                ...item,
                name: data.signageSetName,
                slideData: data.mediaData,
                textData: data.textData,
              };
            }
            sortData(tempRootData);
            setOpenEditMediaModal(false);
          }}
        />
      )}
      {openAddFolderModal && (
        <AddFolderModalLazy
          placeName="Signage Sets"
          open={openAddFolderModal}
          setOpen={setOpenAddFolderModal}
          onSubmit={(folderName) => {
            const newFolder = {
              id: (rootData.length + 1).toString(),
              name: folderName,
              type: 'folder',
              folderId: selectedFolderId || '-1',
              orgHierarchy: [
                ...(findFolder(selectedFolderId || '-1')?.orgHierarchy || []),
                folderName,
              ],
            };
            const tempRootData = [...rootData, newFolder];
            // sort data by folder first and by sortBy value
            sortData(tempRootData as any);
            setOpenAddFolderModal(false);
            return Promise.resolve('success');
          }}
          folderData={rootData.filter((rd) => rd.type === 'folder')}
          // selectedFolderId={selectedFolderId}
        />
      )}
      {deleteMediaModalOpen && (
        <DeleteItemModalLazy
          open={deleteMediaModalOpen}
          setOpen={setDeleteMediaModalOpen}
          itemCount={selectedItems.length}
          onSubmit={() => {
            const tempRootData = [...rootData];
            selectedItems.forEach((item) => {
              const index = tempRootData.findIndex(
                (tempItem) => tempItem.id === item.id,
              );
              if (index !== -1) {
                tempRootData.splice(index, 1);
              }
            });
            sortData(tempRootData);
            setDeleteMediaModalOpen(false);

            return Promise.resolve('success');
          }}
        />
      )}
      {openSearchModal && (
        <CustomSearchModalLazy
          onSearch={() => {
            return Promise.resolve([]);
          }}
          setData={setSearchData}
          openSearch={openSearchModal}
          setOpenSearch={setOpenSearchModal}
          searchText={searchText}
          setSearchText={setSearchText}
          data={searchData}
          dataTypes={[
            {
              id: 'signage',
              name: 'Signage',
              defItems: 7,
            },
          ]}
          displayKeys={[
            {
              id: 'name',
              position: 'top left',
            },
          ]}
        />
      )}
      <Script async defer src="/assets/js/dragAndDrop.min.js" />
    </div>
  );
}
