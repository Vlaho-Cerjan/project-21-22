'use client';

import {OrderSort} from '@/src/constants/orderConstants';
import {useAppDispatch, useAppSelector} from '@/src/hooks';
import MemoCreateOrder from '@/src/icons/Icons/create-order';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {setColumnSettings} from '@/src/lib/grid/setColumnSettings';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {setGridSettings} from '@/src/store/slices/gridSlice';
import {FormatDateWithTime} from '@/src/utils/FormatDate';
import {hideNoRows, showNoRows} from '@/src/utils/GridFunctions';
import type {Filter} from '@/types/filterData';
import {GridData} from '@/types/gridData';
import type {OrdersAdminListData, OrdersListData} from '@/types/orders';
import type {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from 'ag-grid-enterprise';
import type {AgGridReact} from 'ag-grid-react';
import React, {useCallback} from 'react';
import {
  deleteCellRenderer,
  editCellRenderer,
} from '../common/listComponents/listComponents';
import GridListView from '../gridListView/gridListView';
import AddOrderModal from './modals/addOrderModal';
import EditOrderModal from './modals/editOrderModal';

const limit = 10;

const fetchItem = async (
  id: string,
): Promise<{
  success: boolean;
  data: OrdersListData;
}> => {
  const response: {
    success: boolean;
    data: OrdersListData;
  } = await ClientApiRequest({
    uri: `admin/order/?order_id=${id}`,
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

  const response: {
    success: boolean;
    data: {
      total: number;
      orders: OrdersListData[];
    };
  } = await ClientApiRequest({
    uri: `admin/order/list?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  return response;
};

/*
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

  const response: {
    success: boolean;
    data: {
      total: number;
      orders: OrdersListData[];
    };
  } = await ClientApiRequest({
    uri: `admin/order/search?business_id=${businessId}&limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}${checkedFilters && checkedFilters.length > 0 ? `&status=${checkedFilters.join(' ')}` : ''}`,
    auth: true,
  });

  if (response.data.orders) {
    return {
      success: response.success,
      data: {
        total: response.data.total,
        orders: response.data.orders,
      },
    };
  }

  return {
    success: response.success,
    data: {
      total: response.data.total,
      orders: [],
    },
  };
};
*/
export default function AdminOrder({params}: {params: {businessId: string}}) {
  const {businessId} = params;
  const [orderList, setOrderList] = React.useState<OrdersListData[]>([]);
  const gridRef = React.useRef<AgGridReact>(null);
  const dispatch = useAppDispatch();
  const {
    adminOrdersGridSettings: {columnsSettings},
  } = useAppSelector((state) => state.grid);

  // const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<
    OrdersListData | undefined
  >(undefined);
  const [placeName, setPlaceName] = React.useState('Pending Orders');

  const {enumData} = useAppSelector((state) => state.enum);

  const [statusData] = React.useState(enumData?.order_status);

  const [selectedItems, setSelectedItems] = React.useState<GridData[]>([]);

  const [openDeleteMediaModal, setOpenDeleteMediaModal] = React.useState(false);
  const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [selectedSortKey, setSelectedSortKey] = React.useState(OrderSort[0]);
  const [direction, setDirection] = React.useState('asc');
  //const {setLoading} = React.useContext(LoadingContext);
  //const [searchText, setSearchText] = React.useState('');
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
      setPlaceName(`${activeStatus.name} Orders`);
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
      if (res.data.orders) setOrderList(res.data.orders);
      else setOrderList([]);
      // set total pages based on total items, round up to nearest whole number
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / limitData));
      else setTotalPages(0);
    } else {
      setOrderList([]);
      setTotalPages(0);
    }
    // setListLoading(false);
  };
  */

  /*
  const searchItems = React.useMemo(
    () => async (searchTextData: string, filtersData: Filter[]) => {
      setLoading(true);
      const res = await fetchList({
        businessId,
        orderKey: selectedSortKey || 'name',
        direction,
        filters: filtersData,
        searchText: searchTextData,
        listLimit: limit,
        offset: 0,
      });

      setLoading(false);

      if (res && res.data && res.data.orders) {
        return res.data.orders;
      }
      return [];
    },
    [selectedSortKey, direction],
  );

  */
  const noRowsMessage = React.useMemo(() => {
    const activeFilters = filters
      ? filters?.find((f) => f.id === 'status')?.data.filter((f) => f.checked)
      : null;
    if (activeFilters && activeFilters.length > 0) {
      if (activeFilters.length === 1) {
        return `No ${activeFilters[0]?.name} orders found. Try filtering to a different status.`;
      }

      return 'No Orders Found For Selected Filters.';
    }
    return 'No Pending orders found. Try filtering to a different status.';
  }, [filters]);

  const onSort = async (key: string, sortDir: string) => {
    setDirection(sortDir);
    setSelectedSortKey(key);
  };

  const onDeleteFunction = async () => {
    const res = await ClientApiRequest({
      uri: `admin/order?order_id=${selectedItems[0]?.id}`,
      method: 'DELETE',
      auth: true,
    });

    if (res.success) {
      if (gridRef && gridRef.current && gridRef.current.api) {
        gridRef.current.api.applyServerSideTransaction({
          remove: selectedItems,
        });
      }
      setOrderList(orderList.filter((r) => !selectedItems.includes(r)));
      return 'success';
    }
    return 'error';
  };
  const getRowsFunction = useCallback(
    async (ps: any) => {
      const {success, request} = ps as IServerSideGetRowsParams;
      //const searchTextData = api.getQuickFilter() || searchText || '';
      hideNoRows(gridRef);
      /*
      const searchFunc = async () => {
        const res = await searchList({
          businessId,
          orderKey: selectedSortKey || 'name',
          direction,
          offset: request.startRow || 0,
          filters,
          searchText: searchTextData,
          listLimit: (request.endRow || 10) - (request.startRow || 0),
        });

        if (res.success && res.data.orders && res.data.orders.length > 0) {
          setOrderList(res.data.orders);
          success({
            rowData: res.data.orders,
            rowCount: res.data.total,
          });
        } else if (
          res.success &&
          res.data.orders &&
          res.data.orders.length === 0
        ) {
          setOrderList([]);
          showNoRows(gridRef);
          success({
            rowData: [],
            rowCount: 0,
          });
        } else {
          setOrderList([]);
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
*/
      const res = await fetchList({
        businessId,
        orderKey: selectedSortKey || 'name',
        direction,
        offset: request.startRow || 0,
        filters,
        //searchText,
        listLimit: (request.endRow || 10) - (request.startRow || 0),
      });

      if (res.success && res.data.orders && res.data.orders.length > 0) {
        setOrderList(res.data.orders);
        success({
          rowData: res.data.orders,
          rowCount: res.data.total,
        });
      } else if (
        res.success &&
        res.data.orders &&
        res.data.orders.length === 0
      ) {
        setOrderList([]);
        showNoRows(gridRef);
        success({
          rowData: [],
          rowCount: 0,
        });
      } else {
        setOrderList([]);
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
      filters,
      businessId,
      //searchText
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
  React.useEffect(() => {
    if (orderList.length > 0) {
      setEditMediaData(orderList[0]);
      setOpenEditMediaModal(true);
    }
  }, [orderList]);
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
    filters,
    //searchText,
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
        headerName: 'Name',
        //headerCheckboxSelection: true,
        //minWidth: 180,
        flex: 1,
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
        colId: 'shipping_status',
        headerName: 'Shipping Status',
        field: 'shipping_status',
        cellRenderer: (params: any) => {
          return <div className="shippingStatus">{params.value}</div>;
        },
      },
      {
        colId: 'tracking',
        headerName: 'Tracking',
        field: 'tracking',
        cellRenderer: (params: any) => {
          return <div className="trackingOrder">{params.value}</div>;
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
    [statusData],
  );

  const columnsWithSettings: ColDef[] = React.useMemo(() => {
    if (columns && columnsSettings) {
      return setColumnSettings(columns, columnsSettings);
    }
    return columns;
  }, [columns, columnsSettings]);

  useDidUpdateEffect(() => {
    if (!openDeleteMediaModal) {
      setSelectedItems([]);
    }
  }, [openDeleteMediaModal]);

  React.useEffect(() => {
    if (columnsWithSettings) {
      const newCols = columnsWithSettings.map((col) => {
        /*
        if (col.colId === 'name') {
          if (
            !(
              orderList && orderList.filter((r) => r.status === 3).length === 0
            ) ||
            (filters &&
              filters
                ?.find((f) => f.id === 'status')
                ?.data.filter((fi) => fi.checked)
                .map((f) => f.id as number)
                .includes(1))
          ) {
            col.checkboxSelection = true;
            col.headerCheckboxSelection = true;
          } else {
            col.checkboxSelection = false;
            col.headerCheckboxSelection = false;
          }
        }
          */
        if (col.colId === 'shipping_status' || col.colId === 'tracking') {
          if (
            filters &&
            !filters
              ?.find((f) => f.id === 'status')
              ?.data.filter((fi) => fi.checked)
              .map((f) => f.id as number)
              .includes(5)
          ) {
            col.hide = true;
            col.suppressColumnsToolPanel = true;
          } else {
            col.hide = false;
            col.suppressColumnsToolPanel = false;
          }
        }
        if (col.colId === 'delete') {
          if (
            (orderList &&
              orderList.filter((r) => r.status === 1).length === 0) ||
            (filters &&
              !filters
                ?.find((f) => f.id === 'status')
                ?.data.filter((fi) => fi.checked)
                .map((f) => f.id as number)
                .includes(1))
          ) {
            col.hide = true;
          } else {
            col.hide = false;
          }
        }
        if (col.colId === 'edit') {
          if (
            (orderList &&
              orderList.filter((r) => r.status === 1 || r.status === 2)
                .length === 0) ||
            (filters &&
              !filters
                ?.find((f) => f.id === 'status')
                ?.data.filter((fi) => fi.checked)
                .map((f) => f.id as number)
                .includes(1))
          ) {
            col.hide = true;
          } else {
            col.hide = false;
          }
        }

        return col;
      });

      if (gridRef && gridRef.current && gridRef.current.api) {
        gridRef.current.api.setGridOption('columnDefs', newCols);
      }
    }
  }, [gridRef, filters, orderList, columnsWithSettings]);

  return (
    <div className="folderViewContainer">
      <GridListView
        grid={gridRef}
        saveGridSettings={(settings) => {
          // console.log('settings', settings);
          dispatch(
            setGridSettings({
              adminOrdersGridSettings: settings,
            }),
          );
        }}
        onSort={onSort}
        sortKeys={OrderSort}
        selectedSortKey={selectedSortKey}
        direction={direction}
        rootData={orderList}
        addButtonDataId="adminAddOrderButton"
        addButtonIcon={<MemoCreateOrder />}
        addButtonTooltipText="Add a New Order"
        setOpenAddMediaModal={setOpenAddMediaModal}
        setRootData={setOrderList}
        selectedItems={selectedItems}
        deleteOpen={openDeleteMediaModal}
        showDeleteButton={false}
        setDeleteOpen={setOpenDeleteMediaModal}
        // setOpenAddMediaModal={setOpenAddMediaModal}
        openEditMediaModal={openEditMediaModal}
        setOpenEditMediaModal={setOpenEditMediaModal}
        deleteButtonDataId="adminDeleteOrderButton"
        deleteModalDescription={`Are you sure you want to delete the selected order${selectedItems.length > 1 ? 's' : ''}?`}
        deleteModalText="Delete Orders"
        deleteTooltipText="Delete Orders"
        deleteItemsFunction={onDeleteFunction}
        deleteModalDataId="deleteOrderModal"
        // onApprove={() => {
        //  setApproveModalOpen(true);
        // }}
        // onDeny={() => {
        //  setDenyModalOpen(true);
        // }}
        // denyButtonDataId="denyOrderButton"
        // approveButtonDataId="approveOrderButton"
        // approveButtonIcon={<MemoCheckmarkCircle />}
        // approveButtonTooltipText="Approve Pending Orders"
        // denyButtonIcon={<MemoCircleMinus />}
        // denyButtonTooltipText="Deny Pending Orders"
        noSearch
        placeName={placeName}
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
                items: res.data.orders || [],
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
        addMediaModal={
          <AddOrderModal
            businessId={businessId}
            open={openAddMediaModal}
            setOpen={setOpenAddMediaModal}
            onSubmit={async (data) => {
              if (
                gridRef &&
                gridRef.current &&
                data.success &&
                orderList.length > 9
              ) {
                gridRef.current.api.refreshServerSide();
                return;
              }
              const item = await fetchItem(data.data.id);
              if (item.success) {
                setOrderList((prev) => {
                  return [itemToListItem, ...prev];
                });
                const itemToListItem: OrdersAdminListData = {
                  business_id: businessId,
                  id: item.data.id,
                  product_id: item.data.product_id,
                  venue_id: item.data.venue_id,
                  shipping_id: item.data.shipping_id,
                  name: item.data.name,
                  status: item.data.status,
                  created_at: item.data.created_at,
                  updated_at: item.data.updated_at,
                };
                if (
                  filters &&
                  filters
                    ?.find((f) => f.id === 'status')
                    ?.data.find((fi) => fi.checked)?.id === 1
                ) {
                  if (gridRef && gridRef.current) {
                    //gridRef.current.api.refreshServerSide();
                    gridRef.current.api.applyServerSideTransaction({
                      add: [itemToListItem],
                    });
                  }
                }
              }
            }}
          />
        }
        editMediaModal={
          <EditOrderModal
            open={openEditMediaModal}
            setOpen={setOpenEditMediaModal}
            id={editMediaData?.id || ''}
            onSubmit={async (id, reason) => {
              // const res = await updateReg(data);
              // if (res.success) {
              if (!id) return;
              if (reason === 'approve') {
                if (
                  orderList &&
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
                  setOrderList(orderList.filter((r) => r.id !== id));
                  setOpenEditMediaModal(false);
                  return;
                }
              }
              if (reason === 'deny') {
                if (
                  orderList &&
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
                  setOrderList(orderList.filter((r) => r.id !== id));
                  setOpenEditMediaModal(false);
                  return;
                }
              }
              if (reason === 'undo') {
                if (
                  orderList &&
                  filters &&
                  filters
                    ?.find((f) => f.id === 'status')
                    ?.data.filter((f) => f.id === 1 && f.checked).length === 0
                ) {
                  if (gridRef && gridRef.current && gridRef.current.api) {
                    gridRef.current.api.applyServerSideTransaction({
                      remove: [editMediaData],
                    });
                  }
                  setOrderList(orderList.filter((r) => r.id !== id));
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
                setOrderList((prev) => {
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
      />
    </div>
  );
}
