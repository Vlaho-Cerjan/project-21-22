'use client';

import {ScreenSort} from '@/src/constants/screensConstants';
import {useAppDispatch, useAppSelector} from '@/src/hooks';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {setColumnSettings} from '@/src/lib/grid/setColumnSettings';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import {setGridSettings} from '@/src/store/slices/gridSlice';
import {FormatDateWithTime} from '@/src/utils/FormatDate';
import {hideNoRows, showNoRows} from '@/src/utils/GridFunctions';
import type {Filter} from '@/types/filterData';
import {GridData} from '@/types/gridData';
import type {GetUserScreen, ListScreen} from '@/types/screens';
import type {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';
import type {AgGridReact} from 'ag-grid-react';
import React, {useCallback} from 'react';
import {editCellRenderer} from '../common/listComponents/listComponents';
import GridListView from '../gridListView/gridListView';
import EditScreenModal from './modals/editScreenModal';

const limit = 10;

const fetchItem = async (
  id: string,
): Promise<{
  success: boolean;
  data: GetUserScreen;
}> => {
  const response: {
    success: boolean;
    data: GetUserScreen;
  } = await ClientApiRequest({
    uri: `api/screen/?screen_id=${id}`,
    auth: true,
  });

  return response;
};

const fetchList = async ({
  screenKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  screenKey: string;
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

  // TODO add business id where it needs to be

  const response: {
    success: boolean;
    data: {
      total: number;
      screens: ListScreen[];
    };
  } = await ClientApiRequest({
    uri: `api/screen/list?limit=${listLimit}&offset=${offset}&screen_by=${screenKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  return response;
};

const searchList = async ({
  screenKey,
  direction,
  offset = 0,
  filters,
  searchText = '',
  listLimit = limit,
}: {
  screenKey: string;
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

  const response: {
    success: boolean;
    data: {
      total: number;
      screens: ListScreen[];
    };
  } = await ClientApiRequest({
    uri: `api/screen/search?limit=${listLimit}&offset=${offset}&screen_by=${screenKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  if (!response.data || !response.data.screens)
    return {
      success: response.success,
      data: {
        total: 0,
        screens: [],
      },
    };

  if (response.data.screens) {
    return {
      success: response.success,
      data: {
        total: response.data.total,
        screens: response.data.screens,
      },
    };
  }

  return {
    success: response.success,
    data: {
      total: response.data.total,
      screens: [],
    },
  };
};

export default function Screen() {
  const [screenList, setScreenList] = React.useState<ListScreen[]>([]);
  const gridRef = React.useRef<AgGridReact>(null);
  const dispatch = useAppDispatch();
  const {
    screensGridSettings: {columnsSettings},
  } = useAppSelector((state) => state.grid);

  //const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<
    ListScreen | undefined
  >(undefined);
  const [placeName] = React.useState('Screens');

  const {enumData} = useAppSelector((state) => state.enum);

  const [statusData] = React.useState(enumData?.screen_status);

  const [selectedItems, setSelectedItems] = React.useState<GridData[]>([]);

  //const {venueType} = useAppSelector((state) => state.enum);

  //const [venueTypes, setVenueTypes] = React.useState<BusinessTypeState[]>([]);

  //React.useEffect(() => {
  //  if (venueType) {
  //    setVenueTypes(venueType);
  //  }
  //}, [venueType]);

  //const [openDeleteMediaModal, setOpenDeleteMediaModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [selectedSortKey, setSelectedSortKey] = React.useState(ScreenSort[0]);
  const [direction, setDirection] = React.useState('asc');
  const {setLoading} = React.useContext(LoadingContext);
  const [searchText, setSearchText] = React.useState('');

  /*
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


  React.useEffect(() => {
    const activeStatus = filters
      ? filters?.find((f) => f.id === 'status')?.data.find((f) => f.checked)
      : null;
    if (activeStatus) {
      setPlaceName(`${activeStatus.name} Screens`);
    }
  }, [filters]);

  */

  /*
  const fetchItems = async ({
    key,
    dir,
    filtersData,
    searchTextData,
    offsetData = 0,
    limitData = limit,
  }: {
    key: string;
    dir: string;
    filtersData: Filter[];
    searchTextData: string;
    offsetData?: number;
    limitData?: number;
  }) => {
    // setListLoading(true);
    const res = await fetchList({
      screenKey: key || 'name',
      direction: dir,
      filters: filtersData,
      searchText: searchTextData,
      listLimit: limitData,
      offset: offsetData,
    });

    if (res && res.data) {
      if (res.data.screens) setScreenList(res.data.screens);
      else setScreenList([]);
      // set total pages based on total items, round up to nearest whole number
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / limitData));
      else setTotalPages(0);
    } else {
      setScreenList([]);
      setTotalPages(0);
    }
    // setListLoading(false);
  };
  */

  const searchItems = React.useMemo(
    () => async (searchTextData: string) => {
      setLoading(true);
      const res = await fetchList({
        screenKey: selectedSortKey || 'name',
        direction,
        //filters: filtersData,
        searchText: searchTextData,
        listLimit: limit,
        offset: 0,
      });

      setLoading(false);

      if (res && res.data && res.data.screens) {
        return res.data.screens;
      }
      return [];
    },
    [selectedSortKey, direction],
  );
  const noRowsMessage = React.useMemo(
    () => {
      /*
    const activeFilters = filters
      ? filters?.find((f) => f.id === 'status')?.data.filter((f) => f.checked)
      : null;
    if (activeFilters && activeFilters.length > 0) {
      if (activeFilters.length === 1) {
        return `No ${activeFilters[0]?.name} screens found. Try filtering to a different status.`;
      }

      return 'No Screens Found For Selected Filters.';
    }
      */
      return 'No Pending screens found.';
    },
    [
      //filters
    ],
  );

  const onSearch = async (searchTextData: string) => {
    const list = await searchItems(searchTextData);
    if (list) return list;
    return [];
  };

  const onSort = async (key: string, sortDir: string) => {
    setDirection(sortDir);
    setSelectedSortKey(key);
  };

  const getRowsFunction = useCallback(
    async (ps: any) => {
      const {success, request, api} = ps as IServerSideGetRowsParams;
      const searchTextData = api.getQuickFilter() || searchText || '';
      hideNoRows(gridRef);
      const searchFunc = async () => {
        const res = await searchList({
          screenKey: selectedSortKey || 'name',
          direction,
          offset: request.startRow || 0,
          //filters,
          searchText: searchTextData,
          listLimit: (request.endRow || 10) - (request.startRow || 0),
        });

        if (res.success && res.data.screens && res.data.screens.length > 0) {
          setScreenList(res.data.screens);
          success({
            rowData: res.data.screens,
            rowCount: res.data.total,
          });
        } else if (
          res.success &&
          res.data.screens &&
          res.data.screens.length === 0
        ) {
          setScreenList([]);
          showNoRows(gridRef);
          success({
            rowData: [],
            rowCount: 0,
          });
        } else {
          setScreenList([]);
          showNoRows(gridRef);
          success({
            rowData: [],
            rowCount: 0,
          });
        }
      };

      if (searchTextData) {
        searchFunc();
        return;
      }

      const res = await fetchList({
        screenKey: selectedSortKey || 'name',
        direction,
        offset: request.startRow || 0,
        //filters,
        searchText,
        listLimit: (request.endRow || 10) - (request.startRow || 0),
      });

      if (res.success && res.data.screens && res.data.screens.length > 0) {
        setScreenList(res.data.screens);
        success({
          rowData: res.data.screens,
          rowCount: res.data.total,
        });
      } else if (
        res.success &&
        res.data.screens &&
        res.data.screens.length === 0
      ) {
        setScreenList([]);
        showNoRows(gridRef);
        success({
          rowData: [],
          rowCount: 0,
        });
      } else {
        setScreenList([]);
        showNoRows(gridRef);
        success({
          rowData: [],
          rowCount: 0,
        });
      }
    },
    [
      selectedSortKey,
      direction,
      searchText,
      //filters,
    ],
  );

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

  /*
  const onDeleteFunction = async () => {
    const res = await ClientApiRequest({
      uri: `api/screen?screen_id=${selectedItems[0]?.id}`,
      method: 'DELETE',
      auth: true,
    });

    if (res.success) {
      if (gridRef && gridRef.current && gridRef.current.api) {
        gridRef.current.api.applyServerSideTransaction({
          remove: selectedItems,
        });
      }
      setScreenList(screenList.filter((r) => !selectedItems.includes(r)));
      return 'success';
    }
    return 'error';
  };
  */

  /*
  React.useEffect(() => {
    if (screenList.length > 0) {
      setEditMediaData(screenList[0]);
      setOpenEditMediaModal(true);
    }
  }, [screenList]);
  */

  /*
  useDidUpdateEffect(() => {
    if (!openDeleteMediaModal) {
      setSelectedItems([]);
    }
  }, [openDeleteMediaModal]);
*/
  useDidUpdateEffect(() => {
    if (gridRef && gridRef.current) {
      gridRef.current.api.setGridOption('serverSideDatasource', {
        getRows: async (rowParams) => {
          await getRowsFunction(rowParams);
        },
      });
      // gridRef.current.api.refreshServerSide();
    }

    /*
    fetchItems({
      key: selectedSortKey || 'name',
      dir: direction,
      filtersData: filters,
      searchTextData: searchText,
      offsetData: (page - 1) * limit,
    });
    */
  }, [
    selectedSortKey,
    direction,
    //filters,
    searchText,
    page,
  ]);

  /*
  React.useEffect(() => {
    fetchItems({
      key: selectedSortKey || 'name',
      dir: direction,
      filtersData: filters,
      searchTextData: searchText,
    });
  }, []);
  */

  const columns = React.useMemo(
    () => [
      {
        colId: 'name',
        field: 'name',
        suppressColumnsToolPanel: true,
        headerName: 'Name',
        // checkboxSelection: true,
        // headerCheckboxSelection: true,
        //minWidth: 180,
        flex: 1,
      },
      {
        colId: 'dooh_enabled',
        headerName: 'DOOH Enabled',
        field: 'dooh_enabled',
        minWidth: 120,
        cellRenderer: (params: any) => {
          return params.value ? 'Yes' : 'No';
        },
      },
      {
        colId: 'status',
        headerName: 'Status',
        field: 'status',
        minWidth: 120,
        cellRenderer: (params: any) => {
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
      /*
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
      */
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
    [statusData],
  );

  const columnsWithSettings: ColDef[] = React.useMemo(() => {
    if (columns && columnsSettings) {
      return setColumnSettings(
        columns,
        columnsSettings, //filters
      );
    }
    return columns;
  }, [
    columns,
    columnsSettings,
    //filters
  ]);

  return (
    <div className="folderViewContainer">
      <GridListView
        grid={gridRef}
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
        //addButtonTooltipText={'Create New Screen'}
        //addButtonDataId="addScreenButton"
        //addButtonIcon={<MemoCreateScreen />}
        setRootData={setScreenList}
        selectedItems={selectedItems}
        //setOpenAddMediaModal={setOpenAddMediaModal}
        openEditMediaModal={openEditMediaModal}
        setOpenEditMediaModal={setOpenEditMediaModal}
        //deleteOpen={openDeleteMediaModal}
        showDeleteButton={false}
        //setDeleteOpen={setOpenDeleteMediaModal}
        //deleteModalDataId="deleteScreenModal"
        //deleteButtonDataId="deleteScreenButton"
        //deleteModalDescription={`Are you sure you want to delete the selected screen${selectedItems.length > 1 ? 's' : ''}?`}
        //deleteModalText="Delete Screens"
        //deleteTooltipText="Delete Screens"
        //deleteItemsFunction={onDeleteFunction}
        // onApprove={() => {
        //  setApproveModalOpen(true);
        // }}
        // onDeny={() => {
        //  setDenyModalOpen(true);
        // }}
        // denyButtonDataId="denyScreenButton"
        // approveButtonDataId="approveScreenButton"
        //openSearchModalDataId="openScreenSearchModal"
        //clearSearchDataId="clearScreenSearch"
        mobileClearSearchDataId="mobileClearScreenSearch"
        // approveButtonIcon={<MemoCheckmarkCircle />}
        // approveButtonTooltipText="Approve Pending Screens"
        // denyButtonIcon={<MemoCircleMinus />}
        // denyButtonTooltipText="Deny Pending Screens"
        placeName={placeName}
        onItemDeSelect={(items) => {
          setSelectedItems(items);
        }}
        //filters={filters}
        //setFilters={setFilters}
        type="page"
        gridOptions={{
          overlayNoRowsTemplate: noRowsMessage,
          rowModelType: 'serverSide',
          onGridReady,
          // debug: true,
        }}
        page={page}
        setPage={setPage}
        pageLimit={limit}
        columnDefsData={columnsWithSettings}
        editMediaModal={
          <EditScreenModal
            open={openEditMediaModal}
            setOpen={setOpenEditMediaModal}
            id={editMediaData?.id || ''}
            onSubmit={async (id) => {
              // const res = await updateReg(data);
              // if (res.success) {
              const item = await fetchItem(id);
              if (item.success) {
                if (gridRef && gridRef.current) {
                  gridRef.current.api.applyServerSideTransaction({
                    update: [item.data],
                  });
                }
              }
              setOpenEditMediaModal(false);
              // }
            }}
          />
        }
        editMediaData={editMediaData}
        setEditMediaData={setEditMediaData}
        onSearch={onSearch}
        openSearchModalDataId="openScreenSearchModal"
        clearSearchDataId="clearScreenSearch"
        setSearchTextList={setSearchText}
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
            id: ['updated_at'],
            position: 'top right',
          },
          {
            id: ['status'],
            position: 'bottom left',
          },
          {
            id: ['dooh_enabled'],
            position: 'bottom right',
          },
        ]}
      />
    </div>
  );
}
