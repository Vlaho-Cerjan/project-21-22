'use client';

import {BizOrders} from '@/src/constants/businessConstants';
import {Zupanije} from '@/src/constants/zupanije';
import {useAppDispatch, useAppSelector} from '@/src/hooks';
import MemoGetOrder from '@/src/icons/Icons/get-order';
import MemoScreen from '@/src/icons/Icons/screen';
import MemoVenuesNav from '@/src/icons/venuesNav';
import ClientApiRequest from '@/src/lib/clientApiRouter';
import {setColumnSettings} from '@/src/lib/grid/setColumnSettings';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import {LoadingContext} from '@/src/store/providers/loadingProvider';
import type {BusinessTypeState} from '@/src/store/slices/enumSlice';
import {setGridSettings} from '@/src/store/slices/gridSlice';
import {FormatDateWithTime} from '@/src/utils/FormatDate';
import type {BusinessData} from '@/types/businesses';
import type {ICellRendererParams} from 'ag-grid-enterprise';
import type {AgGridReact} from 'ag-grid-react';
import Link from 'next/link';
import React from 'react';
import {editCellRenderer} from '../common/listComponents/listComponents';
import GridListView from '../gridListView/gridListView';
import EditBusinessModal from './modals/editBusinessModal';

const limit = 10;

/*
const ApproveModalLazy = dynamic(() => import('./modals/approveModal'), {
  ssr: false,
});

const DenyModalLazy = dynamic(() => import('./modals/denyModal'), {
  ssr: false,
});
*/

const fetchItem = async (
  id: string,
): Promise<{
  success: boolean;
  data: BusinessData;
}> => {
  const response: {
    success: boolean;
    data: BusinessData;
  } = await ClientApiRequest({
    uri: `admin/business/?business_id=${id}`,
    auth: true,
  });

  return response;
};

const fetchList = async ({
  orderKey,
  direction,
  offset = 0,
  // filters,
  searchText = '',
  listLimit = limit,
}: {
  orderKey: string;
  direction: string;
  offset: number;
  // filters?: Filter[];
  searchText?: string;
  listLimit: number;
}) => {
  const response: {
    success: boolean;
    data: {
      total: number;
      businesses: BusinessData[];
    };
  } = await ClientApiRequest({
    uri: `admin/business/search?limit=${listLimit}&offset=${offset}&order_by=${orderKey}&direction=${direction}${searchText !== '' ? `&search=${searchText}` : ''}`,
    auth: true,
  });

  return response;
};

export default function Business() {
  const [regList, setRegList] = React.useState<BusinessData[]>([]);
  const gridRef = React.useRef<AgGridReact>(null);
  const dispatch = useAppDispatch();
  const {
    businessesGridSettings: {columnsSettings},
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
  // const [openAddMediaModal, setOpenAddMediaModal] = React.useState(false);
  const [openEditMediaModal, setOpenEditMediaModal] = React.useState(false);
  const [editMediaData, setEditMediaData] = React.useState<
    BusinessData | undefined
  >(undefined);
  const placeName = 'Businesses';

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
  const [totalPages, setTotalPages] = React.useState(0);
  const [selectedSortKey, setSelectedSortKey] = React.useState(BizOrders[0]);
  const [direction, setDirection] = React.useState('asc');
  const {setLoading} = React.useContext(LoadingContext);
  const [searchText, setSearchText] = React.useState('');
  const [listLoading, setListLoading] = React.useState(false);
  // const [filters, setFilters] = React.useState([]);

  const fetchItems = async ({
    key,
    dir,
    // filtersData,
    searchTextData,
    offsetData = 0,
    limitData = limit,
  }: {
    key: string;
    dir: string;
    // filtersData: Filter[];
    searchTextData: string;
    offsetData?: number;
    limitData?: number;
  }) => {
    setListLoading(true);
    const res = await fetchList({
      orderKey: key,
      direction: dir,
      // filters: filtersData,
      searchText: searchTextData,
      offset: offsetData,
      listLimit: limitData,
    });

    if (res && res.data) {
      if (res.data.businesses) setRegList(res.data.businesses);
      else setRegList([]);
      if (res.data.total) setTotalPages(Math.ceil(res.data.total / limit));
      else setTotalPages(0);
    } else {
      setRegList([]);
      setTotalPages(0);
    }
    setListLoading(false);
  };

  const searchItems = React.useMemo(
    () => async (searchTextData: string) => {
      setLoading(true);
      const res = await fetchList({
        orderKey: selectedSortKey || 'business_name',
        direction,
        // filters,
        searchText: searchTextData,
        offset: 0,
        listLimit: limit,
      });

      setLoading(false);

      if (res && res.data && res.data.businesses) {
        return res.data.businesses;
      }
      return [];
    },
    [],
  );

  const onSearch = React.useMemo(
    () => async (searchTextData: string) => {
      const list = await searchItems(searchTextData);
      if (list) return list;
      return [];
    },
    [],
  );

  const onSort = async (key: string, sortDir: string) => {
    setDirection(sortDir);
    setSelectedSortKey(key);
  };

  const venuesCellRenderer = (params: ICellRendererParams) => {
    return (
      <Link
        className="venuesButton"
        data-testid={`venuesButton_${params.data.id}`}
        href={`/admin/businesses/${params.data.id}`}
      >
        <MemoVenuesNav />
      </Link>
    );
  };

  const screensCellRenderer = (params: ICellRendererParams) => {
    return (
      <Link
        className="screensButton"
        data-testid={`screensButton_${params.data.id}`}
        href={`/admin/businesses/screens/${params.data.id}`}
      >
        <MemoScreen />
      </Link>
    );
  };

  const ordersCellRenderer = (params: ICellRendererParams) => {
    return (
      <Link
        className="ordersButton"
        data-testid={`ordersButton_${params.data.id}`}
        href={`/admin/businesses/orders/${params.data.id}`}
      >
        <MemoGetOrder />
      </Link>
    );
  };

  useDidUpdateEffect(() => {
    fetchItems({
      key: selectedSortKey || 'business_name',
      dir: direction,
      // filtersData: filters,
      searchTextData: searchText,
      offsetData: (page - 1) * limit,
      limitData: limit,
    });
  }, [selectedSortKey, direction, searchText, page]);

  React.useEffect(() => {
    fetchItems({
      key: selectedSortKey || 'business_name',
      dir: direction,
      // filtersData: filters,
      searchTextData: searchText,
      offsetData: 0,
      limitData: limit,
    });
  }, []);

  /*
  React.useEffect(() => {
    if (regList.length > 0) {
      setEditMediaData(regList[0]);
      setOpenEditMediaModal(true);
    }
  }, [regList]);
  */

  const columns = React.useMemo(
    () => [
      {
        headerName: 'Business',
        field: 'business_name',
        flex: 1,
        minWidth: 150,
        colId: 'business_name',
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
        // address_1
        headerName: 'Address',
        field: 'address_1',
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
        flex: 1,
        colId: 'business_type_id',
        valueFormatter: (params: any) => {
          return venueTypes
            ? venueTypes?.find((v) => v.id === params.value)?.name || ''
            : '';
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
        field: 'orders',
        headerName: 'Orders',
        suppressColumnsToolPanel: true,
        pinned: 'right' as const,
        sortable: false,
        resizable: false,
        headerClass: 'ordersHeader',
        cellRenderer: ordersCellRenderer,
        minWidth: 80,
        maxWidth: 80,
        cellStyle: {
          justifyContent: 'center',
        },
      },
      {
        field: 'venues',
        headerName: 'Venues',
        suppressColumnsToolPanel: true,
        pinned: 'right' as const,
        sortable: false,
        resizable: false,
        headerClass: 'venuesHeader',
        cellRenderer: venuesCellRenderer,
        minWidth: 80,
        maxWidth: 80,
        cellStyle: {
          justifyContent: 'center',
        },
      },
      {
        field: 'screens',
        headerName: 'Screens',
        suppressColumnsToolPanel: true,
        pinned: 'right' as const,
        sortable: false,
        resizable: false,
        headerClass: 'screensHeader',
        cellRenderer: screensCellRenderer,
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
        pinned: 'right' as const,
        sortable: false,
        resizable: false,
        headerClass: 'editHeader',
        cellRenderer: (params: ICellRendererParams) => {
          return editCellRenderer(params, () => {
            setEditMediaData(params.data);
            setOpenEditMediaModal(true);
          });
        },
        minWidth: 60,
        maxWidth: 60,
        cellStyle: {
          justifyContent: 'center',
        },
      },
    ],
    [regList, venueTypes, statusData],
  );

  const columnsWithSettings = React.useMemo(() => {
    if (columns && gridCS) {
      return setColumnSettings(columns, gridCS);
    }
    return columns;
  }, [columns, gridCS]);

  return (
    <div className="folderViewContainer">
      <GridListView
        grid={gridRef}
        listLoading={listLoading}
        saveGridSettings={(settings) => {
          // console.log('settings', settings);
          dispatch(
            setGridSettings({
              businessesGridSettings: settings,
            }),
          );
        }}
        onSort={onSort}
        sortKeys={BizOrders}
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
        // denyButtonDataId="denyBusinessButton"
        // approveButtonDataId="approveBusinessButton"
        openSearchModalDataId="openBusinessSearchModal"
        clearSearchDataId="clearBusinessSearch"
        mobileClearSearchDataId="mobileClearBusinessSearch"
        // approveButtonIcon={<MemoCheckmarkCircle />}
        // approveButtonTooltipText="Approve Pending Businesses"
        // denyButtonIcon={<MemoCircleMinus />}
        // denyButtonTooltipText="Deny Pending Businesses"
        placeName={placeName}
        setSearchTextList={setSearchText}
        onSearch={onSearch}
        onItemDeSelect={(items) => {
          setSelectedItems(items);
        }}
        // filters={filters}
        // setFilters={setFilters}
        type="page"
        gridOptions={{
          treeData: false,
          overlayNoRowsTemplate: 'No businesses found.',
        }}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        pageLimit={limit}
        columnDefsData={columnsWithSettings}
        editMediaModal={
          <EditBusinessModal
            open={openEditMediaModal}
            setOpen={setOpenEditMediaModal}
            id={editMediaData?.id || ''}
            onSubmit={async (id) => {
              const item = await fetchItem(id);
              if (item.success) {
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
            id: 'business',
            name: 'Business',
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
