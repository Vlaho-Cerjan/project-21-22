'use client';

import {VenueSort} from '@/src/constants/venueConstants';
import {Zupanije} from '@/src/constants/zupanije';
import {useAppDispatch, useAppSelector} from '@/src/hooks';
import MemoVenuesAdd from '@/src/icons/venuesAdd';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {setColumnSettings} from '@/src/lib/grid/setColumnSettings';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {BusinessTypeState} from '@/src/store/slices/enumSlice';
import {setGridSettings} from '@/src/store/slices/gridSlice';
import {FormatDateWithTime} from '@/src/utils/FormatDate';
import type {Filter} from '@/types/filterData';
import {GridData} from '@/types/gridData';
import type {
  VenueUserCreateData,
  VenueUserData,
  VenueUserGroupData,
} from '@/types/venues';
import type {IServerSideGetRowsParams} from 'ag-grid-community';
import type {
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
} from 'ag-grid-enterprise';
import type {AgGridReact} from 'ag-grid-react';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {
  deleteCellRenderer,
  editCellRenderer,
} from '../common/listComponents/listComponents';
import GridListView from '../gridListView/gridListView';
import AddVenueModal from './modals/addVenueModal';
import EditVenueModal from './modals/editVenueModal';

const limit = 10;

const fetchItem = async (
  id: string,
): Promise<{
  success: boolean;
  data: VenueUserData;
}> => {
  const response: {
    success: boolean;
    data: VenueUserData;
  } = await ClientApiRequest({
    uri: `api/venue/?venue_id=${id}`,
    auth: true,
  });

  return response;
};

const fetchGroup = async (
  id?: string,
): Promise<{
  success: boolean;
  data: VenueUserGroupData;
} | null> => {
  if (!id) return null;
  const response: {
    success: boolean;
    data: VenueUserGroupData;
  } = await ClientApiRequest({
    uri: `api/group/?group_id=${id}`,
    auth: true,
  });

  return response;
};

const fetchList = async ({
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  orderKey: string;
  direction: string;
  offset: number;
  filters?: Filter[];
  searchText?: string;
  listLimit: number;
}) => {
  const status = filters ? filters?.find((f) => f.id === 'status') : null;

  const checkedFilters = status?.data
    .filter((f) => f.checked)
    ?.map((f) => f.id);

  console.log(
    `api/venue/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` fetchList `,
    `api/group/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
  );

  const res1: {
    success: boolean;
    data: {
      total: number;
      venues: VenueUserData[];
    };
  } = await ClientApiRequest({
    uri: `api/venue/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const res2: {
    success: boolean;
    data: {
      total: number;
      groups: VenueUserGroupData[];
    };
  } = await ClientApiRequest({
    uri: `api/group/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response = {
    success: res1.success && res2.success,
    data: {
      total: res2.data && res2.data.total ? res2.data.total + 1 : 0,
      venues: res1.data && res1.data.venues,
      groups: res2.data && res2.data.groups,
    },
  };

  return response;
};

const searchList = async ({
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  orderKey: string;
  direction: string;
  offset: number;
  filters?: Filter[];
  searchText?: string;
  listLimit: number;
}) => {
  const status = filters ? filters?.find((f) => f.id === 'status') : null;

  const checkedFilters = status?.data
    .filter((f) => f.checked)
    ?.map((f) => f.id);

  console.log(
    `api/venue/search?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` searchList `,
    `api/group/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
  );

  const groupRes: {
    success: boolean;
    data: {
      total: number;
      groups: VenueUserGroupData[];
    };
  } = await ClientApiRequest({
    uri: `api/group/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response: {
    success: boolean;
    data: {
      total: number;
      venues: VenueUserData[];
    };
  } = await ClientApiRequest({
    uri: `api/venue/search?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  if (response.data.venues) {
    const venList: (VenueUserData & {
      groupName?: string;
      type?: string;
    })[] = response.data.venues.map((v) => ({
      ...v,
      groupName:
        (groupRes &&
          groupRes.data &&
          groupRes.data.groups &&
          groupRes.data.groups.find((g) => v.group_id && g.id === v.group_id)
            ?.name) ||
        '',
      type: 'venue',
    }));

    return {
      success: response.success,
      data: {
        total: response.data.total,
        venues: venList,
      },
    };
  }

  return {
    success: false,
    data: {
      total: 0,
      venues: [],
    },
  };
};

const fetchGroups = async ({
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  orderKey: string;
  direction: string;
  offset: number;
  filters?: Filter[];
  searchText?: string;
  listLimit: number;
}) => {
  const status = filters ? filters?.find((f) => f.id === 'status') : null;

  const checkedFilters = status?.data
    .filter((f) => f.checked)
    ?.map((f) => f.id);

  console.log(
    `api/group/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` fetchGroups `,
  );

  const groupRes: {
    success: boolean;
    data: {
      total: number;
      groups: VenueUserGroupData[];
    };
  } = await ClientApiRequest({
    uri: `api/group/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response: {
    success: boolean;
    data: {
      total: number;
      venues: VenueUserData[];
    };
  } = await ClientApiRequest({
    uri: `api/venue/list?limit=1&offset=${offset}&order_by=${orderKey}&direction=${direction}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  return {
    success: groupRes.success,
    data: {
      total: groupRes && groupRes.data && groupRes.data.total,
      groups:
        groupRes &&
        groupRes.data &&
        groupRes.data.groups &&
        groupRes.data.groups,
    },
    venSuccess: response.success,
    venTotal: response.data.total,
  };
};

const fetchVenueList = async ({
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  orderKey: string;
  direction: string;
  offset: number;
  filters?: Filter[];
  searchText?: string;
  listLimit: number;
}) => {
  const status = filters ? filters?.find((f) => f.id === 'status') : null;

  const checkedFilters = status?.data
    .filter((f) => f.checked)
    ?.map((f) => f.id);

  console.log(
    `api/venue/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` fetchVenueList `,
  );

  const res1: {
    success: boolean;
    data: {
      total: number;
      venues: VenueUserData[];
    };
  } = await ClientApiRequest({
    uri: `api/venue/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response = {
    success: res1.success,
    data: {
      total: res1.data.total,
      venues: res1.data.venues,
    },
  };

  return response;
};

const fetchGroupList = async ({
  groupId,
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  groupId: string;
  orderKey: string;
  direction: string;
  offset: number;
  filters?: Filter[];
  searchText?: string;
  listLimit: number;
}) => {
  const status = filters ? filters?.find((f) => f.id === 'status') : null;

  const checkedFilters = status?.data
    .filter((f) => f.checked)
    ?.map((f) => f.id);

  console.log(
    `api/venue/list?group_id=${groupId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` fetchGroupList `,
  );

  const res2: {
    success: boolean;
    data: {
      total: number;
      venues: VenueUserData[];
    };
  } = await ClientApiRequest({
    uri: `api/venue/list?group_id=${groupId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response = {
    success: res2.success,
    data: {
      total: res2.data && res2.data.total && res2.data.total,
      groupVenues: res2.data && res2.data.venues,
    },
  };

  return response;
};

const createGroup = async ({
  name,
  description,
}: {
  name: string;
  description?: string;
}) => {
  const res = await ClientApiRequest({
    uri: `api/group`,
    method: 'POST',
    auth: true,
    data: {
      name,
      description,
    },
  });

  return res;
};

const updateGroup = async ({
  groupId,
  name,
  description,
}: {
  groupId: string;
  name: string;
  description?: string;
}) => {
  const res = await ClientApiRequest({
    uri: `api/group`,
    method: 'PUT',
    auth: true,
    data: {
      group_id: groupId,
      name,
      description,
    },
  });

  return res;
};

const createVenue = async (data: VenueUserCreateData) => {
  const res = await ClientApiRequest({
    uri: 'api/venue',
    method: 'POST',
    auth: true,
    data,
  });

  return res;
};

/*
const updateData: (updatedData: VenueUserData | null) => Promise<{
  success: boolean;
  data: VenueUserData;
}> = async (updatedData) => {
  if (!updatedData) return;
  console.log('updateData', updatedData);
  const res = await ClientApiRequest({
    uri: 'api/venue',
    method: 'PUT',
    auth: true,
    data: updatedData,
  });

  return res;
};
*/

const toggleVenues = async (venues: string[], gId: string) => {
  const res = await ClientApiRequest({
    uri: 'api/venue/toggle',
    method: 'PUT',
    auth: true,
    data: {
      venue_ids: venues,
      group_id: gId,
    },
  });

  return res;
};

const deleteVenue = async (venueId: string) => {
  const res = await ClientApiRequest({
    uri: `api/venue?venue_id=${venueId}`,
    method: 'DELETE',
    auth: true,
  });

  return res as {success: boolean; data: null};
};

const deleteGroup = async (groupId: string) => {
  const res = await ClientApiRequest({
    uri: `api/group?group_id=${groupId}`,
    method: 'DELETE',
    auth: true,
  });

  return res as {success: boolean; data: null};
};

export default function UserVenues() {
  const gridRef = React.useRef<AgGridReact>(null);
  const venueGroupName = 'Non Grouped Venues';
  const [venueList, setVenueList] = React.useState<
    (VenueUserData | VenueUserGroupData)[]
  >([]);
  //const [venueListData, setVenueListData] = React.useState<
  // (VenueUserData | VenueUserGroupData)[]
  //>([]);
  const dispatch = useAppDispatch();
  const {
    venueGridSettings: {
      columnsSettings,
      // view
    },
  } = useAppSelector((state) => state.grid);

  //const [folderView, setFolderView] = React.useState<'list' | 'card'>('list');

  const [gridCS, setGridCS] = React.useState<typeof columnsSettings | null>(
    null,
  );

  React.useEffect(() => {
    if (columnsSettings) {
      setGridCS(columnsSettings);
    } else {
      setGridCS(null);
    }
  }, [columnsSettings]);

  /*
  useDidUpdateEffect(() => {
    dispatch(
      setGridSettings({
        venueGridSettings: {
          view: folderView,
        },
      }),
    );
  }, [folderView]);

  React.useEffect(() => {
    if (view) {
      setFolderView(view);
    }
  }, [view])
  */
  // const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<
    VenueUserData | undefined
  >(undefined);
  const [placeName, setPlaceName] = React.useState('Venues');

  const {enumData, venueType} = useAppSelector((state) => state.enum);

  const [statusData] = React.useState(enumData?.venue_status);

  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);

  const [venueTypes, setVenueTypes] = React.useState<BusinessTypeState[]>([]);

  const [openAddVenueModal, setOpenAddVenueModal] = React.useState(false);
  const [openDeleteMediaModal, setOpenDeleteMediaModal] = React.useState(false);
  const [openEditFolderModal, setOpenEditFolderModal] = React.useState(false);
  const [editFolderData, setEditFolderData] = React.useState<GridData | null>(
    null,
  );

  React.useEffect(() => {
    if (venueType) {
      setVenueTypes(venueType);
    }
  }, [venueType]);

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [selectedSortKey, setSelectedSortKey] = React.useState(VenueSort[0]);
  const [direction, setDirection] = React.useState('asc');
  const {setLoading} = React.useContext(LoadingContext);
  const [searchText, setSearchText] = React.useState('');
  const [filters, setFilters] = React.useState<Filter[]>([
    {
      id: 'status',
      name: 'Status',
      type: 'radio',
      data: Object.entries(statusData || {}).map((st) => ({
        id: st[1],
        name: st[0].charAt(0).toUpperCase() + st[0].slice(1).toLowerCase(),
        checked: st[1] === 2 || false,
      })),
    },
  ]);
  //const [groupId, setGroupId] = React.useState('');
  const [listLoading, setListLoading] = React.useState(false);

  React.useEffect(() => {
    const activeStatus = filters
      ? filters?.find((f) => f.id === 'status')?.data.find((f) => f.checked)
      : null;
    if (activeStatus) {
      setPlaceName(`${activeStatus.name} Venues`);
    }
  }, [filters]);

  const fetchItems = async ({
    groupIdFI,
    orderKey,
    directionFI,
    offset = 0,
    filtersFI,
    searchTextFI,
    limitData = limit,
  }: {
    groupIdFI?: string;
    orderKey: string;
    directionFI: string;
    offset?: number;
    filtersFI?: Filter[];
    searchTextFI?: string;
    limitData?: number;
  }) => {
    setListLoading(true);
    console.log('searchText fetchItems', searchText);
    if (searchText && searchText.trim().length > 0) {
      console.log('searchText fetchItems');
      const res = await searchList({
        orderKey,
        direction: directionFI,
        offset,
        filters: filtersFI,
        searchText: searchTextFI,
        listLimit: limitData,
      });

      if (res && res.data) {
        if (res.data.venues) {
          setVenueList(res.data.venues);
        } else setVenueList([]);
        if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
        else setTotalPages(0);
      } else {
        setVenueList([]);
        setTotalPages(0);
      }
      setListLoading(false);
      return;
    }

    if (groupIdFI) {
      console.log('groupId fetchItems');
      const res = await fetchGroupList({
        groupId: groupIdFI || '',
        orderKey,
        direction: directionFI,
        offset,
        filters: filtersFI,
        searchText: searchTextFI,
        listLimit: limitData,
      });

      if (res && res.data) {
        if (res.data.groupVenues) {
          setVenueList(res.data.groupVenues);
        } else setVenueList([]);
        if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
        else setTotalPages(0);
      } else {
        setVenueList([]);
        setTotalPages(0);
      }

      setListLoading(false);
      return;
    }

    console.log('fetchItems');
    const res = await fetchList({
      orderKey,
      direction: directionFI,
      offset,
      filters: filtersFI,
      searchText: searchTextFI,
      listLimit: limitData,
    });

    if (res && res.data) {
      if (res.data.venues) {
        const venList = [];
        if (res.data.groups)
          venList.push(
            ...res.data.groups.map((v) => ({
              ...v,
              groupName: v.name,
              type: 'folder',
            })),
          );
        venList.push(...res.data.venues);

        setVenueList(venList);
      } else setVenueList([]);
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
      else setTotalPages(0);
    } else {
      setVenueList([]);
      setTotalPages(0);
    }
    setListLoading(false);
  };

  const refreshList = React.useCallback(() => {
    fetchItems({
      orderKey: selectedSortKey || 'name',
      directionFI: direction,
      filtersFI: filters,
      searchTextFI: searchText,
      limitData: limit,
    });
  }, [selectedSortKey, direction, filters, searchText, limit]);

  /*
  const fetchListItems = async ({
    id,
    orderKey,
    direction,
    offset = 0,
    filters,
    searchText,
    limitData = limit,
  }: {
    id: string;
    orderKey: string;
    direction: string;
    offset?: number;
    filters?: Filter[];
    searchText?: string;
    limitData?: number;
  }) => {
    setListLoading(true);
    const res = await fetchList({
      id,
      orderKey,
      direction,
      offset,
      filters,
      searchText,
      listLimit: limitData,
    });

    if (res && res.data) {
      if (res.data.venues) {
        const venList = [];
        if (res.data.groups)
          venList.push(
            ...res.data.groups.map((v) => ({
              ...v,
              groupName: v.name,
              type: 'folder',
            })),
          );
        venList.push(
          ...res.data.venues.map((v) => ({
            ...v,
            type: 'venue',
          })),
        );

        setVenueListData(venList);
      } else setVenueListData([]);
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
      else setTotalPages(0);
    } else {
      setVenueListData([]);
      setTotalPages(0);
    }
    setListLoading(false);
  };
*/
  const searchItems = React.useMemo(
    () => async (searchTextData: string, filtersData: Filter[]) => {
      setLoading(true);
      const res = await searchList({
        orderKey: selectedSortKey || 'name',
        direction,
        offset: 0,
        filters: filtersData,
        searchText: searchTextData,
        listLimit: limit,
      });

      setLoading(false);

      if (res && res.data && res.data.venues) {
        return res.data.venues;
      }
      return [];
    },
    [selectedSortKey, direction],
  );

  const noRowsMessage = React.useMemo(() => {
    const activeFilters = filters
      ? filters?.find((f) => f.id === 'status')?.data.filter((f) => f.checked)
      : null;
    if (activeFilters && activeFilters.length > 0) {
      if (activeFilters.length === 1) {
        return `No ${activeFilters[0]?.name} venues found. Try filtering to a different status.`;
      }

      return 'No Venues Found For Selected Filters.';
    }
    return 'No Pending venues found. Try filtering to a different status.';
  }, [filters]);

  const onSearch = React.useMemo(
    () => async (searchTextData: string, filtersData: Filter[]) => {
      if (searchTextData && searchTextData.trim().length > 0) {
        const list = await searchItems(searchTextData, filtersData);
        if (list) return list;
        return [];
      } else return [];
    },
    [],
  );

  const onSort = async (key: string, sortDir: string) => {
    setDirection(sortDir);
    setSelectedSortKey(key);
  };

  React.useEffect(() => {
    if (gridRef && gridRef.current && gridRef.current.api) {
      gridRef.current.api.updateGridOptions({
        quickFilterText: searchText,
      });
    }
  }, [searchText]);

  const getRowsFunction = useCallback(
    async (ps: any) => {
      const {success, request, api} = ps as IServerSideGetRowsParams;
      const {rowGroupCols} = request;
      const {valueCols} = request;
      const {groupKeys} = request;
      const searchTextData = api.getQuickFilter() || searchText || '';

      const searchFunc = async () => {
        const res = await searchList({
          orderKey: selectedSortKey || 'name',
          direction,
          offset: request.startRow || 0,
          filters,
          searchText: searchTextData,
          listLimit: (request.endRow || 10) - (request.startRow || 0),
        });

        // remove group name from each venue
        const venuesWithoutGroupName = res.data.venues.map((v) => {
          const venue = {...v};
          delete venue.groupName;
          return venue;
        });

        success({
          rowData: venuesWithoutGroupName,
          rowCount: res.data.total,
        });
      };

      const fetchGroupData = async () => {
        const res = await fetchGroups({
          orderKey: selectedSortKey || 'name',
          direction,
          offset: request.startRow
            ? request.startRow - (request.startRow === 0 ? 0 : 1)
            : 0,
          filters,
          searchText: searchTextData,
          listLimit:
            (request.endRow ? request.endRow : limit) -
            (request.startRow ? request.startRow : 0) -
            (request.startRow === 0 ? 1 : 0),
        });

        if (res.success) {
          const venList: (VenueUserGroupData & {
            groupName?: string;
            type?: string;
          })[] = [];

          if (request.startRow === 0) {
            venList.push({
              id: 'non_grouped',
              name: venueGroupName,
              groupName: venueGroupName,
              description: 'Venues without a group',
              type: 'folder',
              created_at: '',
              updated_at: '',
              total_venues: res.venTotal,
              venues: [],
            });
          }

          if (res.data.groups) {
            venList.push(
              ...res.data.groups.map((v) => ({
                ...v,
                groupName: v.name,
                type: 'folder',
              })),
            );
          }

          if (venList.length === 0) {
            toast.error('No Groups Found For Selected Filters.');
            success({
              rowData: [],
              rowCount: 0,
            });
            return;
          }

          console.log(res.data.total + 1, 'group total');

          success({
            rowData: venList,
            rowCount: res.data.total + 1,
          });
        } else {
          toast.error('No Groups Found For Selected Filters.');
          success({
            rowData: [],
            rowCount: 0,
          });
        }
      };

      const fetchVenuesData = async () => {
        const res = await fetchVenueList({
          orderKey: selectedSortKey || 'name',
          direction,
          offset: request.startRow || 0,
          filters,
          searchText: searchTextData,
          listLimit: (request.endRow || 10) - (request.startRow || 0),
        });
        if (res.success && res.data.venues) {
          success({
            rowData: res.data.venues.map((v) => ({
              ...v,
              groupName: venueGroupName,
              type: 'venue',
            })),
            rowCount: res.data.total,
          });
          return;
        }
        toast.error('No Venues Found For Selected Filters And Group.');
        success({
          rowData: [],
          rowCount: 0,
        });
      };

      if (rowGroupCols.length > groupKeys.length) {
        const rowGroupCol = rowGroupCols[groupKeys.length];
        const colsToSelect = [rowGroupCol?.id];

        valueCols.forEach(function (valueCol) {
          colsToSelect.push(
            `${valueCol.aggFunc}(${valueCol.id}) AS ${valueCol.id}`,
          );
        });

        if (
          colsToSelect.length === 1 &&
          colsToSelect[0] === 'groupName' &&
          groupKeys.length === 0
        ) {
          if (searchTextData && searchTextData.trim().length > 0) {
            console.log('searchFunc 1');
            await searchFunc();
          } else {
            console.log('fetchGroupData 1');
            await fetchGroupData();
          }
          return;
        }

        toast.error('No Venues Found For Selected Filters And Group.');
        if (groupKeys.length > 0) {
          success({
            rowData: [],
            rowCount: 0,
          });
          return;
        }

        success({
          rowData: [],
          rowCount: 0,
        });

        return;
      }
      if (groupKeys.length > 0) {
        if (groupKeys.length === 1) {
          if (groupKeys[0]?.toLocaleLowerCase() === 'non grouped venues') {
            if (searchTextData && searchTextData.trim().length > 0) {
              console.log('searchFunc 2');
              await searchFunc();
            } else {
              console.log('fetchVenuesData 2');
              await fetchVenuesData();
            }
            return;
          }

          if (searchTextData && searchTextData.trim().length > 0) {
            console.log('searchFunc 3');
            await searchFunc();
            return;
          }
          const getRowByName = (groupName: string) => {
            const rowData: typeof venueList = [];
            api.forEachNode(
              (node) =>
                node.data &&
                node.data.name === groupName &&
                rowData.push(node.data),
            );
            return rowData[0];
          };
          const venueListData2 = getRowByName(groupKeys[0] || '');
          const groupData = venueListData2;
          const groupRes = await fetchGroupList({
            groupId: groupData?.id || '',
            orderKey: selectedSortKey || 'name',
            direction,
            offset: request.startRow || 0,
            filters,
            searchText: searchTextData,
            listLimit: (request.endRow || 10) - (request.startRow || 0),
          });
          if (groupRes.success) {
            const venList = [];
            if (groupRes && groupRes.data && groupRes.data.groupVenues)
              venList.push(
                ...groupRes.data.groupVenues.map((v) => ({
                  ...v,
                  groupName: groupKeys[0],
                  type: 'venue',
                })),
              );
            success({
              rowData: venList,
              rowCount: groupRes.data.total,
            });
            return;
          }

          toast.error('No Venues Found For Selected Filters And Group.');
          success({
            rowData: [],
            rowCount: 0,
          });
          return;
        }
        return;
      }

      if (searchTextData && searchTextData.trim().length > 0) {
        console.log('searchFunc 4');
        await searchFunc();
        return;
      }

      console.log('fetchGroupData 4');
      await fetchGroupData();
    },
    [selectedSortKey, direction, filters],
  );

  useDidUpdateEffect(() => {
    fetchItems({
      orderKey: selectedSortKey || 'name',
      directionFI: direction,
      filtersFI: filters,
      searchTextFI: searchText,
      limitData: limit,
      offset: (page - 1) * limit,
    });
    /*
    fetchListItems({
      id: businessId,
      orderKey: selectedSortKey || 'name',
      direction,
      filters,
      searchText,
      limitData: limit,
      offset: (page - 1) * limit,
    });
    */
  }, [selectedSortKey, direction, filters, searchText]);

  useDidUpdateEffect(() => {
    if (gridRef && gridRef.current) {
      gridRef.current.api.setGridOption('serverSideDatasource', {
        getRows: async (rowParams) => {
          await getRowsFunction(rowParams);
        },
      });
      // gridRef.current.api.refreshServerSide();
    }
  }, [selectedSortKey, direction, filters]);

  React.useEffect(() => {
    fetchItems({
      orderKey: selectedSortKey || 'name',
      directionFI: direction,
      filtersFI: filters,
      searchTextFI: searchText,
      limitData: limit,
    });

    if (gridRef && gridRef.current && gridRef.current.api) {
      gridRef.current.api.setGridOption('serverSideDatasource', {
        getRows: async (rowParams) => {
          await getRowsFunction(rowParams);
        },
      });
      // gridRef.current.api.refreshServerSide();
    }

    /*
    fetchListItems({
      id: businessId,
      orderKey: selectedSortKey || 'name',
      direction,
      filters,
      searchText,
      limitData: limit,
    });
    */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
  React.useEffect(() => {
    if (venueList.length > 0) {
      setEditMediaData(venueList[0]);
      setOpenEditMediaModal(true);
    }
  }, [venueList]);
  */
  const columns = React.useMemo(
    () => [
      {
        field: searchText ? 'name' : 'groupName',
        colId: searchText ? 'name' : 'groupName',
        suppressColumnsToolPanel: true,
        rowGroup: !searchText,
        hide: !searchText,
      },
      {
        field: 'description',
        colId: 'description',
      },
      {
        // address_1
        headerName: 'Address',
        field: 'address_1',
        hide: true,
        colId: 'address_1',
      },
      {
        // city
        headerName: 'City',
        field: 'city',
        hide: true,
        colId: 'city',
      },
      {
        // state_code
        headerName: 'State',
        field: 'state_code',
        hide: true,
        // minWidth: 250,
        colId: 'state_code',
        valueFormatter: (valueParams: any) => {
          if (!valueParams.value) return null;
          const zupanija = Zupanije
            ? Object.entries(Zupanije)?.find((z) =>
                valueParams.value.includes(z[1]),
              )
            : null;

          if (zupanija) {
            return zupanija[0];
          }
          return valueParams.value;
        },
      },
      {
        // country_code
        headerName: 'Country',
        field: 'country_code',
        hide: true,
        colId: 'country_code',
      },
      {
        // zip
        headerName: 'Zip',
        field: 'zip',
        hide: true,
        colId: 'zip',
      },
      {
        // business_type_id
        headerName: 'Venue Type',
        field: 'venue_type_id',
        hide: true,
        colId: 'venue_type_id',
        valueFormatter: (valueParams: any) => {
          return venueTypes
            ? venueTypes?.find((v) => v.id === valueParams.value)?.name || ''
            : '';
        },
      },
      {
        // venue_notes
        headerName: 'Notes',
        field: 'venue_notes',
        hide: true,
        colId: 'venue_notes',
      },
      {
        // decline_reason
        headerName: 'Disqualification Reason',
        field: 'denial_reason',
        hide: true,
        colId: 'denial_reason',
      },
      {
        colId: 'status',
        headerName: 'Status',
        field: 'status',
        minWidth: 120,
        cellRenderer: (valueParams: any) => {
          if (statusData) {
            const status = statusData
              ? Object.entries(statusData)?.find(
                  (st) => st[1] === valueParams.value,
                )
              : null;
            return status ? status[0] : valueParams.value;
          }
          return valueParams.value;
        },
      },
      {
        colId: 'updated_at',
        headerName: 'Updated',
        field: 'updated_at',
        cellEditor: 'agDateStringCellEditor',
        hide: true,
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) => {
          if (
            params.data.type === 'folder' &&
            params.data.id === 'non_grouped'
          ) {
            return '';
          } else return FormatDateWithTime(new Date(params.value));
        },
      },
      {
        colId: 'created_at',
        headerName: 'Submitted',
        field: 'created_at',
        cellEditor: 'agDateStringCellEditor',
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) => {
          if (
            params.data.type === 'folder' &&
            params.data.id === 'non_grouped'
          ) {
            return '';
          } else return FormatDateWithTime(new Date(params.value));
        },
      },
      {
        field: 'delete',
        headerName: 'Delete',
        colId: 'delete',
        suppressColumnsToolPanel: true,
        // hide edit if the filtered statuses are not 2 or 4
        pinned: 'right' as const,
        sortable: false,
        resizable: false,
        headerClass: 'deleteHeader',
        hide: filters
          ? !filters
              ?.find((f) => f.id === 'status')
              ?.data.filter((fi) => fi.checked)
              .map((f) => f.id as number)
              .includes(1)
          : false,
        cellRenderer: (params: ICellRendererParams) => {
          if (
            params.data.type === 'folder' &&
            params.data.id === 'non_grouped'
          ) {
            return '';
          }
          return deleteCellRenderer(
            params,
            () => {
              if (params.data) {
                setSelectedItems([params.data]);
                setOpenDeleteMediaModal(true);
              }
            },
            true,
          );
        },
        minWidth: 80,
        maxWidth: 80,
        cellStyle: {
          justifyContent: 'center',
        },
      },
      {
        field: 'edit',
        headerName: 'Edit',
        suppressColumnsToolPanel: true,
        // hide edit if the filtered statuses are not 2 or 4
        hide: filters
          ? !filters
              ?.find((f) => f.id === 'status')
              ?.data.filter((fi) => fi.checked)
              .map((f) => f.id as number)
              .includes(1)
          : false,
        pinned: 'right' as const,
        sortable: false,
        resizable: false,
        headerClass: 'editHeader',
        cellRenderer: (params: ICellRendererParams) => {
          if (
            params.data.type === 'folder' &&
            params.data.id === 'non_grouped'
          ) {
            return '';
          }
          return editCellRenderer(
            params,
            () => {
              if (params.data) {
                if (params.data.type !== 'folder') {
                  setEditMediaData(params.data);
                  setOpenEditMediaModal(true);
                } else {
                  setEditFolderData(params.data);
                  setOpenEditFolderModal(true);
                }
              }
            },
            true,
          );
        },
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          justifyContent: 'center',
        },
      },
    ],
    [filters, searchText, venueList, venueTypes, statusData],
  );

  const columnsWithSettings = React.useMemo(() => {
    if (columns && gridCS) {
      return setColumnSettings(columns, gridCS) as typeof columns;
    }
    return columns;
  }, [columns, gridCS]);

  const onGridReady = useCallback(
    (gridReadyParams: GridReadyEvent) => {
      const {api} = gridReadyParams;
      const serverSideDatasource: IServerSideDatasource = {
        getRows: async (rowParams) => {
          await getRowsFunction(rowParams);
        },
      };
      api!.setGridOption('serverSideDatasource', serverSideDatasource);
    },
    [getRowsFunction],
  );

  return (
    <div className="folderViewContainer">
      <GridListView
        //noSelect
        noFolderGroups
        //folderView={folderView}
        //setFolderView={setFolderView}
        onDragDropFunction={async (data) => {
          const res = await toggleVenues(
            data.map((v) => v.id) || '',
            data[0]?.group_id || '',
          );
          //if (res.success) {
          //refreshList();
          //}
          return res;
        }}
        /*
        onDragDropItem={async ({item, destination}) => {
          setListLoading(true);
          const res = await toggleVenues([item.id || ''], destination || '');
          if (res.success && gridRef.current) {
            gridRef.current.api.refreshServerSide();
          }
          setListLoading(false);
          return res;
        }}
        onBreadcrumbClickFunction={(groupBdId) => {
          if (groupBdId !== '-1') {
            setGroupId(groupBdId);
          } else setGroupId('');
        }}
        onFolderDoubleClickFunction={async (folder) => {
          setListLoading(true);
          const res = await fetchGroupList({
            groupId: folder.id || '',
            orderKey: selectedSortKey || 'name',
            direction,
            offset: 0,
            filters,
            searchText,
            listLimit: limit,
          });

          if (res.success) {
            setGroupId(folder.id || '');
            if (res.data.groupVenues) {
              setVenueList(
                res.data.groupVenues.map((v) => ({
                  ...v,
                  groupName: folder.name,
                  type: 'venues',
                })) || [],
              );
            } else {
              setVenueList([]);
              toast.info('No venues found in this group');
            }
          } else {
            setGroupId('');
            setVenueList([]);
            toast.error('No venues found in this group');
          }
          setListLoading(false);
        }}
        findFolder={async (folderId) => {
          setListLoading(true);
          const res = await fetchList({
            orderKey: selectedSortKey || 'name',
            direction,
            offset: 0,
            filters,
            searchText,
            listLimit: limit,
          });

          setListLoading(false);
          if (res.success) {
            if (folderId) {
              const venGroup = res.data.groups.find((g) => g.id === folderId);
              if (venGroup) {
                return {
                  data: venGroup.venues || [],
                };
              }
              toast.error('No venues found in this group');
              return null;
            }
            const venList = [];
            if (res.data.groups)
              venList.push(
                ...res.data.groups.map((v) => ({...v, type: 'folder'})),
              );
            venList.push(...res.data.venues);

            return {
              data: venList,
            };
          }
          return null;
        }}
          */
        hardcodedTopFolders
        editFolderDataId="editVenueGroupModal"
        editFolderName="Group"
        editFolderData={editFolderData}
        openEditFolderModal={openEditFolderModal}
        setOpenEditFolderModal={setOpenEditFolderModal}
        editFolderFunction={async (data) => {
          setLoading(true);
          const res = await updateGroup({
            groupId: editFolderData?.id || '',
            name: data.name,
            description: data.description,
          });

          const group = await fetchGroup(editFolderData?.id || '');
          if (res.success) {
            toast.success('Group updated successfully');
            if (
              group &&
              group.data &&
              gridRef &&
              gridRef.current &&
              gridRef.current.api
            ) {
              const oldRow = gridRef.current.api.getRowNode(
                group.data.id || '',
              );

              gridRef.current.api.applyServerSideTransaction({
                remove: [
                  {
                    id: group.data.id,
                  },
                ],
              });

              gridRef.current.api.applyServerSideTransaction({
                add: [
                  {
                    ...group.data,
                    type: 'folder',
                    groupName: group.data.name,
                  },
                ],
                addIndex: (oldRow?.rowIndex || 0) + 1 || 0,
              });
            }
            return 'success';
          } else {
            toast.error(`Failed to update group ${res.error}`);
            return 'error';
          }
        }}
        addFolderFunction={async (data) => {
          // create a new group
          setLoading(true);
          const res = await createGroup({
            name: data.name,
            description: data.description,
          });

          if (res.success) {
            toast.success('Group created successfully');
            const group = await fetchGroup(res.data.id);
            if (group && gridRef && gridRef.current && gridRef.current.api) {
              gridRef.current.api.applyServerSideTransaction({
                add: [
                  {
                    ...group.data,
                    type: 'folder',
                    groupName: group.data.name,
                  },
                ],
              });
            }
            return 'success';
          } else {
            toast.error(`Failed to create group ${res.error}`);
            return 'error';
          }
        }}
        addFolderName="Group"
        addFolderTooltipText="Add Group"
        addFolderButtonDataId="addVenueGroupButton"
        addFolderDataId="addVenueGroupModal"
        deleteModalDataId="deleteVenueModal"
        deleteButtonDataId="deleteVenueButton"
        deleteOpen={openDeleteMediaModal}
        setDeleteOpen={setOpenDeleteMediaModal}
        showDeleteButton={false}
        deleteItemsFunction={async () => {
          setLoading(true);
          const itemToDelete = selectedItems[0];
          if (!itemToDelete) return 'error';
          const res: {
            success: boolean;
            data: null;
          } =
            itemToDelete.type === 'folder'
              ? await deleteGroup(itemToDelete.id)
              : await deleteVenue(itemToDelete.id);

          if (res.success) {
            if (itemToDelete.type === 'folder') {
              if (gridRef && gridRef.current && gridRef.current.api) {
                gridRef.current.api.applyServerSideTransaction({
                  remove: [itemToDelete],
                });
                gridRef.current.api.refreshServerSide();
              }
            } else {
              const itemGroup = await fetchGroup(itemToDelete.group_id);
              if (gridRef && gridRef.current && gridRef.current.api) {
                gridRef.current.api.applyServerSideTransaction({
                  route: [
                    itemGroup && itemGroup.data
                      ? itemGroup.data.name
                      : venueGroupName,
                  ],
                  remove: [itemToDelete],
                });
              }
              setVenueList(
                venueList.filter((v) => v.id !== itemToDelete.id) || [],
              );
            }
            toast.success(
              itemToDelete.type === 'folder'
                ? 'Group Deleted Successfully'
                : 'Venue Deleted Successfully',
            );
            setOpenDeleteMediaModal(false);
            setLoading(false);
            return 'success';
          }
          toast.error(
            `Failed to delete ${itemToDelete.type === 'folder' ? 'group' : 'venue'}.`,
          );
          setLoading(false);
          return 'error';
        }}
        grid={gridRef}
        listLoading={listLoading}
        saveGridSettings={(settings) => {
          // console.log('settings', settings);
          dispatch(
            setGridSettings({
              venueGridSettings: settings,
            }),
          );
        }}
        onSort={onSort}
        sortKeys={VenueSort}
        selectedSortKey={selectedSortKey}
        direction={direction}
        rootData={venueList}
        // addButtonTooltipText={addButtonTooltipText}
        setRootData={setVenueList}
        //listData={venueListData}
        //setListData={setVenueListData}
        selectedItems={selectedItems}
        // setOpenAddMediaModal={setOpenAddMediaModal}
        openEditMediaModal={openEditMediaModal}
        setOpenEditMediaModal={setOpenEditMediaModal}
        // onApprove={() => {
        //  setApproveModalOpen(true);
        // }}
        // onDeny={() => {
        //  setDenyModalOpen(true);
        // }}
        // denyButtonDataId="denyVenueButton"
        // approveButtonDataId="approveVenueButton"
        openSearchModalDataId="openVenueSearchModal"
        clearSearchDataId="clearVenueSearch"
        mobileClearSearchDataId="mobileClearVenueSearch"
        // approveButtonIcon={<MemoCheckmarkCircle />}
        // approveButtonTooltipText="Approve Pending Venues"
        // denyButtonIcon={<MemoCircleMinus />}
        // denyButtonTooltipText="Deny Pending Venues"
        placeName={placeName}
        setSearchTextList={setSearchText}
        onSearch={onSearch}
        onItemDeSelect={(items) => {
          setSelectedItems(items);
        }}
        filters={filters}
        setFilters={setFilters}
        type="page"
        gridOptions={{
          treeData: false,
          overlayNoRowsTemplate: noRowsMessage,
          groupAllowUnbalanced: false,
          rowModelType: 'serverSide',
          debug: false,
          onGridReady,
          getChildCount: (dataItem) => {
            if (dataItem.type === 'folder') {
              return dataItem.total_venues || 0;
            }
            return 0;
          },
          rowDragMultiRow: true,
          selection: {
            mode: 'multiRow',
            //groupSelects: 'descendants',
            headerCheckbox: false,
            hideDisabledCheckboxes: true,
            checkboxes: (params) => {
              if (params.data.type === 'folder') {
                return false;
              }
              return true;
            },
          },
        }}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        pageLimit={limit}
        columnDefsData={columnsWithSettings}
        groupColumnDefData={{
          headerName: 'Group/Venue Name (Venue Count)',
          field: 'name',
          flex: 1,
          editable: false,
          minWidth: 330,
          cellRendererParams: {
            //suppressCount: true,
          },
        }}
        addButtonDataId="addVenueButton"
        addButtonTooltipText="Add Venue"
        addButtonIcon={<MemoVenuesAdd />}
        setOpenAddMediaModal={setOpenAddVenueModal}
        addMediaModal={
          <AddVenueModal
            open={openAddVenueModal}
            setOpen={setOpenAddVenueModal}
            onSubmit={async (data) => {
              if (!data) return 'error';
              const res = await createVenue(data);
              if (res.success) {
                const item = await fetchItem(res.data.id);
                setVenueList((prev) => {
                  const newList = [...prev];
                  newList.unshift(item.data);
                  return newList;
                });
                if (
                  filters &&
                  filters
                    ?.find((f) => f.id === 'status')
                    ?.data.filter((f) => f.id === 1 && f.checked) &&
                  gridRef &&
                  gridRef.current &&
                  gridRef.current.api
                ) {
                  const item = await fetchItem(res.data.id);
                  if (item.success) {
                    toast.success('Venue added successfully');
                    gridRef.current.api.applyServerSideTransaction({
                      route: [venueGroupName],
                      add: [
                        {
                          ...item.data,
                          groupName: venueGroupName,
                          type: 'venue',
                        },
                      ],
                    });
                  } else {
                    refreshList();
                  }
                } else refreshList();
                setOpenAddVenueModal(false);
                return 'success';
              }
              return 'error';
            }}
          />
        }
        editMediaModal={
          <EditVenueModal
            open={openEditMediaModal}
            setOpen={setOpenEditMediaModal}
            id={editMediaData?.id || ''}
            onSubmit={async (id) => {
              if (!id) return;
              const editedItem = await fetchItem(id);
              const editedItemGroup = editedItem.data.group_id
                ? await fetchGroup(editedItem.data.group_id)
                : null;

              if (editedItem.success) {
                toast.success('Venue updated successfully');
                if (gridRef && gridRef.current) {
                  gridRef.current.api.applyServerSideTransaction({
                    route: [
                      !editedItemGroup
                        ? venueGroupName
                        : editedItemGroup?.data.name,
                    ],
                    update: [
                      {
                        ...editedItem.data,
                        groupName: editedItemGroup?.data.name,
                        group_id: editedItemGroup?.data.id,
                        type: 'venue',
                      },
                    ],
                  });
                }
                setVenueList((prev) => {
                  const index = prev
                    ? prev.findIndex((r) => 'id' in r && r.id === id)
                    : -1;
                  const newList = [...prev];
                  newList[index] = {
                    ...editedItem.data,
                  };
                  return newList;
                });
              }
              //}
              setOpenEditMediaModal(false);
            }}
          />
        }
        editMediaData={editMediaData}
        setEditMediaData={setEditMediaData}
        searchDataTypes={[
          {
            id: 'venue',
            name: 'Venue',
            defItems: 5,
          },
        ]}
        searchDisplayKeys={[
          {
            id: 'name',
            position: 'top left',
          },
          {
            id: ['description'],
            position: 'bottom left',
          },
          {
            id: 'groupName',
            position: 'top right',
          },
          {
            id: ['address_1', 'city'],
            position: 'bottom right',
          },
        ]}
      />
    </div>
  );
}
