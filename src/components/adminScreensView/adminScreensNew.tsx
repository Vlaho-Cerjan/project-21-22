'use client';

import {ScreenSort} from '@/src/constants/screensConstants';
import {useAppDispatch, useAppSelector} from '@/src/hooks';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {setColumnSettings} from '@/src/lib/grid/setColumnSettings';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import {setGridSettings} from '@/src/store/slices/gridSlice';
import {FormatDateWithTime} from '@/src/utils/FormatDate';
import type {Filter} from '@/types/filterData';
import type {
  CreateAdminScreen,
  GetAdminScreen,
  ListScreen,
} from '@/types/screens';
import type {IServerSideGetRowsParams} from 'ag-grid-community';
import type {
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
} from 'ag-grid-enterprise';
import type {AgGridReact} from 'ag-grid-react';
import React, {useCallback} from 'react';
import {toast} from 'react-toastify';
import {VenueUserData} from '../../../types/venues';
import {
  deleteCellRenderer,
  editCellRenderer,
} from '../common/listComponents/listComponents';
import GridListView from '../gridListView/gridListView';
import AddScreenModal from './modals/addScreenModal';
import EditScreenModal from './modals/editScreenModal';

const limit = 10;

const createScreen = async (data: CreateAdminScreen | null) => {
  if (!data)
    return {
      success: false,
      data: {
        id: '',
      },
    };

  const response: {
    success: boolean;
    data: {
      id: string;
    };
  } = await ClientApiRequest({
    uri: `admin/screen`,
    method: 'POST',
    auth: true,
    data,
  });

  return response;
};

const fetchItem = async (
  id: string,
): Promise<{
  success: boolean;
  data: GetAdminScreen;
}> => {
  const response = await ClientApiRequest({
    uri: `admin/screen/?screen_id=${id}`,
    auth: true,
  });

  return response;
};

const fetchVenue = async (
  id?: string,
): Promise<{
  success: boolean;
  data: VenueUserData;
} | null> => {
  if (!id) return null;
  const response: {
    success: boolean;
    data: VenueUserData;
  } = await ClientApiRequest({
    uri: `admin/venue/?venue_id=${id}`,
    auth: true,
  });

  return response;
};

const fetchList = async ({
  businessId,
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  businessId: string;
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
    `admin/screen/list?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` fetchList `,
    `admin/venue/list?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
  );

  const res1: {
    success: boolean;
    data: {
      total: number;
      screens: ListScreen[];
    };
  } = await ClientApiRequest({
    uri: `admin/screen/list?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const res2: {
    success: boolean;
    data: {
      total: number;
      venues: VenueUserData[];
    };
  } = await ClientApiRequest({
    uri: `admin/venue/list?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response = {
    success: res1.success && res2.success,
    data: {
      total: (res2.data && res2.data.total) || 0,
      screens: res1.data && res1.data.screens,
      venues: res2.data && res2.data.venues,
    },
  };

  return response;
};

const searchList = async ({
  businessId,
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  businessId: string;
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
    `admin/screen/search?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` searchList `,
    `admin/venue/list?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
  );

  const venueRes: {
    success: boolean;
    data: {
      total: number;
      venues: VenueUserData[];
    };
  } = await ClientApiRequest({
    uri: `admin/venue/list?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response: {
    success: boolean;
    data: {
      total: number;
      screens: ListScreen[];
    };
  } = await ClientApiRequest({
    uri: `admin/screen/search?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  if (response.data.screens) {
    const venList: (ListScreen & {
      groupName?: string;
      type?: string;
    })[] = response.data.screens.map((v) => ({
      ...v,
      groupName:
        venueRes.data.venues.find((g) => v.venue_id && g.id === v.venue_id)
          ?.name || '',
      type: 'screen',
    }));

    return {
      success: response.success,
      data: {
        total: response.data.total,
        screens: venList,
      },
    };
  }

  return {
    success: false,
    data: {
      total: 0,
      screens: [],
    },
  };
};

const fetchVenues = async ({
  businessId,
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  businessId: string;
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
    `admin/venue/search?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` fetchVenues `,
  );

  const venueRes: {
    success: boolean;
    data: {
      total: number;
      venues: VenueUserData[];
    };
  } = await ClientApiRequest({
    uri: `admin/venue/search?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  return venueRes;
};
/*
const fetchScreenList = async ({
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
    `admin/screen/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` fetchScreenList `,
  );

  const res1: {
    success: boolean;
    data: {
      total: number;
      screens: ListScreen[];
    };
  } = await ClientApiRequest({
    uri: `admin/screen/list?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response = {
    success: res1.success,
    data: {
      total: res1.data.total,
      screens: res1.data.screens,
    },
  };

  return response;
};
*/
const fetchVenueList = async ({
  businessId,
  venueId,
  orderKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  businessId: string;
  venueId: string;
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
    `admin/screen/list?business_id=${businessId}&venue_id=${venueId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    ` fetchVenueList `,
  );

  const res2: {
    success: boolean;
    data: {
      total: number;
      screens: ListScreen[];
    };
  } = await ClientApiRequest({
    uri: `admin/screen/list?business_id=${businessId}&venue_id=${venueId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  const response = {
    success: res2.success,
    data: {
      total: res2.data && res2.data.total && res2.data.total,
      venueScreens: res2.data && res2.data.screens,
    },
  };

  return response;
};

const toggleScreens = async (screens: string[], bId: string, vId: string) => {
  const res = await ClientApiRequest({
    uri: 'admin/screen/toggle',
    method: 'PUT',
    auth: true,
    data: {
      business_id: bId,
      screen_ids: screens,
      venue_id: vId,
    },
  });

  return res;
};

const deleteScreen = async (screenId: string) => {
  const res = await ClientApiRequest({
    uri: `admin/screen?screen_id=${screenId}`,
    method: 'DELETE',
    auth: true,
  });

  return res as {success: boolean; data: null};
};

export default function AdminScreensNew({
  params,
}: {
  params: {businessId: string};
}) {
  const {businessId} = params;
  const gridRef = React.useRef<AgGridReact>(null);
  const screenVenueName = 'Non Venued Screens';
  const [screenList, setScreenList] = React.useState<
    (ListScreen | VenueUserData)[]
  >([]);

  const dispatch = useAppDispatch();
  const {
    screensGridSettings: {
      columnsSettings,
      // view
    },
  } = useAppSelector((state) => state.grid);

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

  const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [openDeleteMediaModal, setOpenDeleteMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<
    ListScreen | undefined
  >(undefined);
  const [placeName] = React.useState('Screens');

  const {enumData} = useAppSelector((state) => state.enum);

  const [statusData] = React.useState(enumData?.screen_status || {});

  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);

  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(0);
  const [selectedSortKey, setSelectedSortKey] = React.useState(ScreenSort[0]);
  const [direction, setDirection] = React.useState('asc');
  const {setLoading} = React.useContext(LoadingContext);
  const [searchText, setSearchText] = React.useState('');
  const [listLoading, setListLoading] = React.useState(false);

  const fetchItems = async ({
    venueIdFI,
    orderKey,
    directionFI,
    offset = 0,
    filtersFI,
    searchTextFI,
    limitData = limit,
  }: {
    venueIdFI?: string;
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
        businessId,
        orderKey,
        direction: directionFI,
        offset,
        filters: filtersFI,
        searchText: searchTextFI,
        listLimit: limitData,
      });

      if (res && res.data) {
        if (res.data.screens) {
          setScreenList(res.data.screens);
        } else setScreenList([]);
        if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
        else setTotalPages(0);
      } else {
        setScreenList([]);
        setTotalPages(0);
      }
      setListLoading(false);
      return;
    }

    if (venueIdFI) {
      console.log('venueId fetchItems');
      const res = await fetchVenueList({
        businessId,
        venueId: venueIdFI || '',
        orderKey,
        direction: directionFI,
        offset,
        filters: filtersFI,
        searchText: searchTextFI,
        listLimit: limitData,
      });

      if (res && res.data) {
        if (res.data.venueScreens) {
          setScreenList(res.data.venueScreens);
        } else setScreenList([]);
        if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
        else setTotalPages(0);
      } else {
        setScreenList([]);
        setTotalPages(0);
      }

      setListLoading(false);
      return;
    }

    console.log('fetchItems');
    const res = await fetchList({
      businessId,
      orderKey,
      direction: directionFI,
      offset,
      filters: filtersFI,
      searchText: searchTextFI,
      listLimit: limitData,
    });

    if (res && res.data) {
      if (res.data.screens) {
        const venList = [];
        if (res.data.venues)
          venList.push(
            ...res.data.venues.map((v) => ({
              ...v,
              groupName: v.name,
              type: 'folder',
            })),
          );
        venList.push(...res.data.screens);

        setScreenList(venList);
      } else setScreenList([]);
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
      else setTotalPages(0);
    } else {
      setScreenList([]);
      setTotalPages(0);
    }
    setListLoading(false);
  };

  const searchItems = React.useMemo(
    () => async (searchTextData: string, filtersData: Filter[]) => {
      setLoading(true);
      const res = await searchList({
        businessId,
        orderKey: selectedSortKey || 'name',
        direction,
        offset: 0,
        filters: filtersData,
        searchText: searchTextData,
        listLimit: limit,
      });

      setLoading(false);

      if (res && res.data && res.data.screens) {
        return res.data.screens;
      }
      return [];
    },
    [selectedSortKey, direction],
  );

  const noRowsMessage = React.useMemo(() => {
    return 'No Screens Found';
  }, []);

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
          businessId,
          orderKey: selectedSortKey || 'name',
          direction,
          offset: request.startRow || 0,
          //filters,
          searchText: searchTextData,
          listLimit: (request.endRow || 10) - (request.startRow || 0),
        });

        // remove venue name from each screen
        const screensWithoutVenueName = res.data.screens.map((v) => {
          const screen = {...v};
          delete screen.groupName;
          return screen;
        });

        success({
          rowData: screensWithoutVenueName,
          rowCount: res.data.total,
        });
      };

      const fetchVenueData = async () => {
        const res = await fetchVenues({
          businessId,
          orderKey: selectedSortKey || 'name',
          direction,
          offset: request.startRow || 0,
          //filters,
          searchText: searchTextData,
          listLimit: (request.endRow || 10) - (request.startRow || 0),
        });

        if (res.success) {
          const venList: (VenueUserData & {
            groupName?: string;
            type?: string;
          })[] = [];

          if (res.data.venues) {
            venList.push(
              ...res.data.venues.map((v) => ({
                ...v,
                groupName: v.name,
                type: 'folder',
              })),
            );
          }

          if (venList.length === 0) {
            toast.error('No Venues Found For Selected Filters.');
            success({
              rowData: [],
              rowCount: 0,
            });
            return;
          }

          success({
            rowData: venList,
            rowCount: res.data.total, // +1
          });
        } else {
          toast.error('No Venues Found For Selected Filters.');
          success({
            rowData: [],
            rowCount: 0,
          });
        }
      };

      if (rowGroupCols.length > groupKeys.length) {
        const rowVenueCol = rowGroupCols[groupKeys.length];
        const colsToSelect = [rowVenueCol?.id];

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
            console.log('fetchVenueData 1');
            await fetchVenueData();
          }
          return;
        }

        toast.error('No Screens Found For Selected Filters And Venue.');
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
          if (searchTextData && searchTextData.trim().length > 0) {
            console.log('searchFunc 3');
            await searchFunc();
            return;
          }
          const getRowByName = (groupName: string) => {
            const rowData: typeof screenList = [];
            api.forEachNode(
              (node) =>
                node.data &&
                node.data.name === groupName &&
                rowData.push(node.data),
            );
            return rowData[0];
          };
          const screenListData2 = getRowByName(groupKeys[0] || '');
          const venueData = screenListData2;
          const venueRes = await fetchVenueList({
            businessId,
            venueId: venueData?.id || '',
            orderKey: selectedSortKey || 'name',
            direction,
            offset: request.startRow || 0,
            //filters,
            searchText: searchTextData,
            listLimit: (request.endRow || 10) - (request.startRow || 0),
          });
          if (venueRes.success) {
            const venList = [];
            if (venueRes.data.venueScreens)
              venList.push(
                ...venueRes.data.venueScreens.map((v) => ({
                  ...v,
                  groupName: groupKeys[0],
                  type: 'screen',
                })),
              );
            success({
              rowData: venList,
              rowCount: venueRes.data.total,
            });
            return;
          }

          toast.error('No Screens Found For Selected Filters And Venue.');
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

      console.log('fetchVenueData 4');
      await fetchVenueData();
    },
    [selectedSortKey, direction, searchText],
  );

  useDidUpdateEffect(() => {
    fetchItems({
      orderKey: selectedSortKey || 'name',
      directionFI: direction,
      searchTextFI: searchText,
      limitData: limit,
      offset: (page - 1) * limit,
    });
  }, [selectedSortKey, direction, searchText]);

  useDidUpdateEffect(() => {
    if (gridRef && gridRef.current) {
      gridRef.current.api.setGridOption('serverSideDatasource', {
        getRows: async (rowParams) => {
          await getRowsFunction(rowParams);
        },
      });
      // gridRef.current.api.refreshServerSide();
    }
  }, [selectedSortKey, direction]);

  React.useEffect(() => {
    fetchItems({
      orderKey: selectedSortKey || 'name',
      directionFI: direction,
      //filtersFI: filters,
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
  }, []);

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
        colId: 'dooh_enabled',
        headerName: 'DOOH Enabled',
        field: 'dooh_enabled',
        minWidth: 120,
        cellRenderer: (params: ICellRendererParams) => {
          if (params.data.type === 'folder') return '';
          return params.value ? 'Yes' : 'No';
        },
      },
      {
        colId: 'status',
        headerName: 'Status',
        field: 'status',
        minWidth: 120,
        cellRenderer: (params: any) => {
          if (params.data.type === 'folder') return '';
          if (statusData) {
            const status = statusData
              ? Object.entries(statusData)?.find((st) => st[1] === params.value)
              : null;
            return status ? status[0] : params.value;
          }
          return params.value;
        },
      },
      {
        colId: 'user_count',
        headerName: 'Users',
        field: 'user_count',
        hide: true,
      },
      {
        colId: 'last_activity',
        headerName: 'Last Activity',
        field: 'last_activity',
        cellEditor: 'agDateStringCellEditor',
        hide: true,
        minWidth: 120,
        valueFormatter: (params: any) => {
          if (params.data.type === 'folder') return '';
          return FormatDateWithTime(new Date(params.value));
        },
      },
      {
        colId: 'updated_at',
        headerName: 'Updated',
        field: 'updated_at',
        cellEditor: 'agDateStringCellEditor',
        minWidth: 120,
        valueFormatter: (params: any) => {
          return FormatDateWithTime(new Date(params.value));
        },
      },
      {
        colId: 'created_at',
        headerName: 'Submitted',
        field: 'created_at',
        cellEditor: 'agDateStringCellEditor',
        hide: true,
        minWidth: 120,
        valueFormatter: (params: any) => {
          return FormatDateWithTime(new Date(params.value));
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
        cellRenderer: (params: ICellRendererParams) => {
          if (
            params.data.type === 'folder' &&
            params.data.id === 'non_grouped'
          ) {
            return '';
          }
          return deleteCellRenderer(params, () => {
            if (params.data) {
              setSelectedItems([params.data]);
              setOpenDeleteMediaModal(true);
            }
          });
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
        colId: 'edit',
        suppressColumnsToolPanel: true,
        // hide edit if the filtered statuses are not 2 or 4
        pinned: 'right' as const,
        sortable: false,
        resizable: false,
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
    ],
    [statusData, searchText],
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
        noFolderGroups
        onDragDropFunction={async (data) => {
          const res = await toggleScreens(
            data.map((d) => d.id),
            businessId,
            data[0]?.venue_id || '',
          );
          //if (res.success) {
          //refreshList();
          //}
          return res;
        }}
        hardcodedTopFolders
        grid={gridRef}
        listLoading={listLoading}
        saveGridSettings={(settings) => {
          // console.log('settings', settings);
          dispatch(
            setGridSettings({
              screensGridSettings: settings,
            }),
          );
        }}
        onSort={onSort}
        sortKeys={ScreenSort}
        selectedSortKey={selectedSortKey}
        direction={direction}
        rootData={screenList}
        setRootData={setScreenList}
        selectedItems={selectedItems}
        openEditMediaModal={openEditMediaModal}
        setOpenEditMediaModal={setOpenEditMediaModal}
        openSearchModalDataId="openScreenSearchModal"
        clearSearchDataId="clearScreenSearch"
        mobileClearSearchDataId="mobileClearScreenSearch"
        placeName={placeName}
        setSearchTextList={setSearchText}
        onSearch={onSearch}
        onItemDeSelect={(items) => {
          setSelectedItems(items);
        }}
        //filters={filters}
        //setFilters={setFilters}
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
              return dataItem.total_screens || 0;
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
          headerName: 'Venue/Screen Name (Screen Count)',
          field: 'name',
          flex: 1,
          editable: false,
          minWidth: 350,
          cellRendererParams: {
            //suppressCount: true,
          },
        }}
        addButtonDataId="addScreenButton"
        setOpenAddMediaModal={setOpenAddMediaModal}
        addButtonTooltipText="Add Screen"
        addMediaModal={
          <AddScreenModal
            businessId={businessId}
            open={openAddMediaModal}
            setOpen={setOpenAddMediaModal}
            onSubmit={async (data) => {
              if (data) {
                const res = await createScreen(data);
                if (res.success) {
                  const item = await fetchItem(res.data.id);
                  const venue = await fetchVenue(data.venue_id);
                  if (gridRef && gridRef.current) {
                    gridRef.current.api.applyServerSideTransaction({
                      route: [!venue ? screenVenueName : venue?.data.name],
                      add: [
                        {
                          ...item.data,
                          groupName: venue?.data.name || screenVenueName,
                          type: 'screen',
                        },
                      ],
                    });
                  }

                  toast.success('Screen created successfully');
                  setOpenAddMediaModal(false);
                  return 'success';
                }

                return 'error';
              }
              return 'error';
            }}
          />
        }
        editMediaModal={
          <EditScreenModal
            open={openEditMediaModal}
            setOpen={setOpenEditMediaModal}
            id={editMediaData?.id || ''}
            onSubmit={async (id) => {
              if (!id) return;
              const editedItem = await fetchItem(id);
              const editedItemVenue = editedItem.data.venue_id
                ? await fetchVenue(editedItem.data.venue_id)
                : null;

              if (editedItem.success) {
                toast.success('Screen updated successfully');
                if (gridRef && gridRef.current) {
                  gridRef.current.api.applyServerSideTransaction({
                    route: [
                      !editedItemVenue
                        ? screenVenueName
                        : editedItemVenue?.data.name,
                    ],
                    update: [
                      {
                        ...editedItem.data,
                        groupName: editedItemVenue?.data.name,
                        venue_id: editedItemVenue?.data.id,
                        type: 'screen',
                      },
                    ],
                  });
                }
                setScreenList((prev) => {
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
        showDeleteButton={false}
        deleteOpen={openDeleteMediaModal}
        setDeleteOpen={setOpenDeleteMediaModal}
        deleteModalDataId="deleteVenueModal"
        deleteButtonDataId="deleteVenueButton"
        deleteItemsFunction={async () => {
          setLoading(true);
          const itemToDelete = selectedItems[0];
          if (!itemToDelete) return 'error';
          const res: {
            success: boolean;
            data: null;
          } = await deleteScreen(itemToDelete.id);

          if (res.success) {
            const itemGroup = await fetchVenue(itemToDelete.venue_id);
            if (gridRef && gridRef.current && gridRef.current.api) {
              gridRef.current.api.applyServerSideTransaction({
                route: [itemGroup && itemGroup.data ? itemGroup.data.name : ''],
                remove: [itemToDelete],
              });
            }

            setScreenList((prev) => {
              return prev.filter((r) => 'id' in r && r.id !== itemToDelete.id);
            });
            toast.success('Screen Deleted Successfully');
            setOpenDeleteMediaModal(false);
            setLoading(false);
            return 'success';
          }
          toast.error(`Failed to delete venue'}.`);
          setLoading(false);
          return 'error';
        }}
        searchDataTypes={[
          {
            id: 'screen',
            name: 'Screen',
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
