'use client';

import {RegOrders} from '@/src/constants/registrationContants';
import {Zupanije} from '@/src/constants/zupanije';
import {useAppDispatch, useAppSelector} from '@/src/hooks';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {setColumnSettings} from '@/src/lib/grid/setColumnSettings';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {BusinessTypeState} from '@/src/store/slices/enumSlice';
import {setGridSettings} from '@/src/store/slices/gridSlice';
import {FormatDateWithTime} from '@/src/utils/FormatDate';
import {hideNoRows, showNoRows} from '@/src/utils/GridFunctions';
import type {Filter} from '@/types/filterData';
import type {RegistrationList} from '@/types/registrations';
import type {
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';
import type {AgGridReact} from 'ag-grid-react';
import React, {useCallback} from 'react';
import {editCellRenderer} from '../common/listComponents/listComponents';
import GridListView from '../gridListView/gridListView';
import EditRegistrationModal from './modals/editRegistrationModal';

const limit = 10;

const fetchItem = async (
  id: string,
): Promise<{
  success: boolean;
  data: RegistrationList;
}> => {
  const response: {
    success: boolean;
    data: RegistrationList;
  } = await ClientApiRequest({
    uri: `admin/registration/?registration_id=${id}`,
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

  const response: {
    success: boolean;
    data: {
      total: number;
      registrations: RegistrationList[];
    };
  } = await ClientApiRequest({
    uri: `admin/registration/search?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

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

  const response: {
    success: boolean;
    data: {
      total: number;
      registrations: RegistrationList[];
    };
  } = await ClientApiRequest({
    uri: `admin/registration/search?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  if (response.data.registrations) {
    return {
      success: response.success,
      data: {
        total: response.data.total,
        registrations: response.data.registrations,
      },
    };
  }

  return {
    success: response.success,
    data: {
      total: response.data.total,
      registrations: [],
    },
  };
};

export default function Registration() {
  const [regList, setRegList] = React.useState<RegistrationList[]>([]);
  const gridRef = React.useRef<AgGridReact>(null);
  const dispatch = useAppDispatch();
  const {
    conversionGridSettings: {columnsSettings},
  } = useAppSelector((state) => state.grid);

  // const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<
    RegistrationList | undefined
  >(undefined);
  const [placeName, setPlaceName] = React.useState('Pending Registrations');

  const {enumData} = useAppSelector((state) => state.enum);

  const [statusData] = React.useState(enumData?.registration_status);

  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);

  const {venueType} = useAppSelector((state) => state.enum);

  const [venueTypes, setVenueTypes] = React.useState<BusinessTypeState[]>([]);

  React.useEffect(() => {
    if (venueType) {
      setVenueTypes(venueType);
    }
  }, [venueType]);

  const [page, setPage] = React.useState(1);
  const [selectedSortKey, setSelectedSortKey] = React.useState(RegOrders[0]);
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
  React.useEffect(() => {
    const activeStatus = filters
      ? filters?.find((f) => f.id === 'status')?.data.find((f) => f.checked)
      : null;
    if (activeStatus) {
      setPlaceName(`${activeStatus.name} Registrations`);
    }
  }, [filters]);

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
      orderKey: key || 'name',
      direction: dir,
      filters: filtersData,
      searchText: searchTextData,
      listLimit: limitData,
      offset: offsetData,
    });

    if (res && res.data) {
      if (res.data.registrations) setRegList(res.data.registrations);
      else setRegList([]);
      // set total pages based on total items, round up to nearest whole number
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / limitData));
      else setTotalPages(0);
    } else {
      setRegList([]);
      setTotalPages(0);
    }
    // setListLoading(false);
  };
  */

  const searchItems = React.useMemo(
    () => async (searchTextData: string, filtersData: Filter[]) => {
      setLoading(true);
      const res = await fetchList({
        orderKey: selectedSortKey || 'name',
        direction,
        filters: filtersData,
        searchText: searchTextData,
        listLimit: limit,
        offset: 0,
      });

      setLoading(false);

      if (res && res.data && res.data.registrations) {
        return res.data.registrations;
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
        return `No ${activeFilters[0]?.name} registrations found. Try filtering to a different status.`;
      }

      return 'No Registrations Found For Selected Filters.';
    }
    return 'No Pending registrations found. Try filtering to a different status.';
  }, [filters]);

  const onSearch = async (searchTextData: string, filtersData: Filter[]) => {
    const list = await searchItems(searchTextData, filtersData);
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
          orderKey: selectedSortKey || 'name',
          direction,
          offset: request.startRow || 0,
          filters,
          searchText: searchTextData,
          listLimit: (request.endRow || 10) - (request.startRow || 0),
        });

        if (
          res.success &&
          res.data.registrations &&
          res.data.registrations.length > 0
        ) {
          success({
            rowData: res.data.registrations,
            rowCount: res.data.total,
          });
        } else if (
          res.success &&
          res.data.registrations &&
          res.data.registrations.length === 0
        ) {
          showNoRows(gridRef);
          success({
            rowData: [],
            rowCount: 0,
          });
        } else {
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
        orderKey: selectedSortKey || 'name',
        direction,
        offset: request.startRow || 0,
        filters,
        searchText,
        listLimit: (request.endRow || 10) - (request.startRow || 0),
      });

      if (
        res.success &&
        res.data.registrations &&
        res.data.registrations.length > 0
      ) {
        success({
          rowData: res.data.registrations,
          rowCount: res.data.total,
        });
      } else if (
        res.success &&
        res.data.registrations &&
        res.data.registrations.length === 0
      ) {
        showNoRows(gridRef);
        success({
          rowData: [],
          rowCount: 0,
        });
      } else {
        showNoRows(gridRef);
        success({
          rowData: [],
          rowCount: 0,
        });
      }
    },
    [selectedSortKey, direction, filters, searchText],
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
  React.useEffect(() => {
    if (regList.length > 0) {
      setEditMediaData(regList[0]);
      setOpenEditMediaModal(true);
    }
  }, [regList]);
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
  }, [selectedSortKey, direction, filters, searchText, page]);

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
        headerName: 'Name',
        // checkboxSelection: true,
        // headerCheckboxSelection: true,
        minWidth: 180,
        flex: 1,
        valueGetter: (params: any) => {
          return `${params.data.first_name} ${params.data.last_name}`;
        },
      },
      {
        headerName: 'Business',
        field: 'business_name',
        flex: 1,
        minWidth: 150,
        colId: 'business_name',
      },
      {
        // email
        headerName: 'Email',
        field: 'email',
        hide: true,
        flex: 1,
        colId: 'email',
      },
      {
        // phone_number
        headerName: 'Phone',
        field: 'phone_number',
        hide: true,
        flex: 1,
        colId: 'phone_number',
      },
      {
        // mobile_number
        headerName: 'Mobile',
        field: 'mobile_number',
        hide: true,
        flex: 1,
        colId: 'mobile_number',
      },
      {
        // address_1
        headerName: 'Address',
        field: 'address_1',
        hide: true,
        flex: 1,
        colId: 'address_1',
      },
      {
        // city
        headerName: 'City',
        field: 'city',
        hide: true,
        flex: 1,
        colId: 'city',
      },
      {
        // state_code
        headerName: 'State',
        field: 'state_code',
        hide: true,
        flex: 1,
        // minWidth: 250,
        colId: 'state_code',
        valueFormatter: (params: any) => {
          const zupanija = Zupanije
            ? Object.entries(Zupanije)?.find((z) => params.value.includes(z[1]))
            : null;

          if (zupanija) {
            return zupanija[0];
          }
          return params.value;
        },
      },
      {
        // country_code
        headerName: 'Country',
        field: 'country_code',
        hide: true,
        flex: 1,
        colId: 'country_code',
      },
      {
        // zip
        headerName: 'Zip',
        field: 'zip',
        hide: true,
        flex: 1,
        colId: 'zip',
      },
      {
        // business_type_id
        headerName: 'Business Type',
        field: 'business_type_id',
        hide: true,
        flex: 1,
        colId: 'business_type_id',
        valueFormatter: (params: any) => {
          return venueTypes
            ? venueTypes?.find((v) => v.id === params.value)?.name || ''
            : '';
        },
      },
      {
        // registration_notes
        headerName: 'Notes',
        field: 'registration_notes',
        hide: true,
        flex: 1,
        colId: 'registration_notes',
      },
      {
        // decline_reason
        headerName: 'Disqualification Reason',
        field: 'decline_reason',
        hide: true,
        flex: 1,
        colId: 'decline_reason',
      },
      {
        // dma_top_20
        headerName: 'DMA Top 20',
        field: 'dma_top_20',
        hide: true,
        flex: 1,
        colId: 'dma_top_20',
        valueFormatter: (params: any) => {
          return params.value === 1 ? 'Yes' : 'No';
        },
      },
      {
        // skip_email
        headerName: 'Skip Email',
        field: 'skip_email',
        hide: true,
        flex: 1,
        colId: 'skip_email',
        valueFormatter: (params: any) => {
          return params.value === 1 ? 'Yes' : 'No';
        },
      },
      {
        // do_not_ship_player
        headerName: 'Do Not Ship Player',
        field: 'do_not_ship_player',
        hide: true,
        flex: 1,
        colId: 'do_not_ship_player',
        valueFormatter: (params: any) => {
          return params.value === 1 ? 'Yes' : 'No';
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
        colId: 'updated_at',
        headerName: 'Updated',
        field: 'updated_at',
        cellEditor: 'agDateStringCellEditor',
        hide: true,
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
        minWidth: 120,
        valueFormatter: (params: any) => {
          return FormatDateWithTime(new Date(params.value));
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
              .includes(2) &&
            !filters
              ?.find((f) => f.id === 'status')
              ?.data.filter((fi) => fi.checked)
              .map((f) => f.id as number)
              .includes(4)
          : false,
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
    [filters, venueTypes, statusData],
  );

  const columnsWithSettings = React.useMemo(() => {
    if (columns && columnsSettings) {
      return setColumnSettings(columns, columnsSettings);
    }
    return columns;
  }, [columns, columnsSettings]);

  return (
    <div className="folderViewContainer">
      <GridListView
        grid={gridRef}
        saveGridSettings={(settings) => {
          // console.log('settings', settings);
          dispatch(
            setGridSettings({
              conversionGridSettings: settings,
            }),
          );
        }}
        onSort={onSort}
        sortKeys={RegOrders}
        selectedSortKey={selectedSortKey}
        direction={direction}
        rootData={regList}
        // addButtonTooltipText={addButtonTooltipText}
        setRootData={setRegList}
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
        // denyButtonDataId="denyRegistrationButton"
        // approveButtonDataId="approveRegistrationButton"
        openSearchModalDataId="openRegistrationSearchModal"
        clearSearchDataId="clearRegistrationSearch"
        mobileClearSearchDataId="mobileClearRegistrationSearch"
        // approveButtonIcon={<MemoCheckmarkCircle />}
        // approveButtonTooltipText="Approve Pending Registrations"
        // denyButtonIcon={<MemoCircleMinus />}
        // denyButtonTooltipText="Deny Pending Registrations"
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
          overlayNoRowsTemplate: noRowsMessage,
          rowModelType: 'serverSide',
          onGridReady,
          // debug: true,
        }}
        page={page}
        setPage={setPage}
        pageLimit={limit}
        /*
        onServerSideLoad={async (loadLimit, offset) => {
          const res = await fetchList({
            orderKey: selectedSortKey || 'name',
            direction,
            filters,
            searchText,
            listLimit: loadLimit,
            offset,
          });

          if (res.success) {
            return {
              data: {
                total: res.data.total || -1,
                items: res.data.registrations || [],
              },
            };
          }

          return {
            data: {
              total: -1,
              items: [],
            },
          };
        }}
          */
        columnDefsData={columnsWithSettings}
        editMediaModal={
          <EditRegistrationModal
            open={openEditMediaModal}
            setOpen={setOpenEditMediaModal}
            id={editMediaData?.id || ''}
            onSubmit={async (id, reason) => {
              // const res = await updateReg(data);
              // if (res.success) {
              if (reason === 'approve') {
                if (
                  regList &&
                  filters &&
                  filters
                    ?.find((f) => f.id === 'status')
                    ?.data.filter((f) => f.id === 3 && f.checked).length === 0
                ) {
                  if (gridRef && gridRef.current && gridRef.current.api) {
                    gridRef.current.api.applyServerSideTransaction({
                      remove: [editMediaData],
                    });
                  }
                  setRegList(regList.filter((r) => r.id !== id));
                  setOpenEditMediaModal(false);
                  return;
                }
              }
              if (reason === 'deny') {
                if (
                  regList &&
                  filters &&
                  filters
                    ?.find((f) => f.id === 'status')
                    ?.data.filter((f) => f.id === 4 && f.checked).length === 0
                ) {
                  if (gridRef && gridRef.current && gridRef.current.api) {
                    gridRef.current.api.applyServerSideTransaction({
                      remove: [editMediaData],
                    });
                  }
                  setRegList(regList.filter((r) => r.id !== id));
                  setOpenEditMediaModal(false);
                  return;
                }
              }
              if (reason === 'undo') {
                if (
                  regList &&
                  filters &&
                  filters
                    ?.find((f) => f.id === 'status')
                    ?.data.filter((f) => f.id === 2 && f.checked).length === 0
                ) {
                  if (gridRef && gridRef.current && gridRef.current.api) {
                    gridRef.current.api.applyServerSideTransaction({
                      remove: [editMediaData],
                    });
                  }
                  setRegList(regList.filter((r) => r.id !== id));
                  setOpenEditMediaModal(false);
                  return;
                }
              }
              const item = await fetchItem(id);
              if (item.success) {
                if (gridRef && gridRef.current && gridRef.current.api) {
                  gridRef.current.api.applyServerSideTransaction({
                    update: [item.data],
                  });
                }
                setRegList((prev) => {
                  const index = prev ? prev.findIndex((r) => r.id === id) : -1;
                  const newList = [...prev];
                  newList[index] = {
                    ...item.data,
                  };
                  return newList;
                });
              }
              setOpenEditMediaModal(false);
              // }
            }}
          />
        }
        editMediaData={editMediaData}
        setEditMediaData={setEditMediaData}
        searchDataTypes={[
          {
            id: 'registration',
            name: 'Registration',
            defItems: 5,
          },
        ]}
        searchDisplayKeys={[
          {
            id: 'business_name',
            position: 'top left',
          },
          {
            id: ['first_name', 'last_name'],
            position: 'bottom left',
          },
          {
            id: 'email',
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
