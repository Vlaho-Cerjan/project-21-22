import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-quartz.min.css';
import 'ag-grid-enterprise';

import {AgGridReact} from 'ag-grid-react';
import React, {forwardRef, useCallback, useMemo} from 'react';
import {useWindowSize} from 'usehooks-ts';

import {ICellRendererParams} from '@ag-grid-community/core';
import {linkEditCellRenderer} from '../common/listComponents/listComponents';
import type {FakeDataWithAreaVenue} from '../networkView/network';
import RewardRenderer from './renderers/rewardRenderer';

interface DataGridProps {
  searchText: string;
  data: FakeDataWithAreaVenue[];
}

const DataGrid = forwardRef<AgGridReact, DataGridProps>(
  function DataGrid(props, ref) {
    // Each Column Definition results in one Column.
    const gridRef = React.useRef<AgGridReact | null>(null);
    const {searchText, data} = props;
    const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
    const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);

    const {width} = useWindowSize();

    React.useEffect(() => {
      if (gridRef && gridRef.current && gridRef.current.api) {
        gridRef.current.api.sizeColumnsToFit();
      }
    }, [width]);

    const [columnDefs] = React.useState([
      {
        headerName: 'Location',
        tooltipField: 'location',
        cellRenderer: 'agGroupCellRenderer',
        showRowGroup: true,
        minWidth: 190,
        // rowDrag: true,
      },
      {
        field: 'area',
        rowGroup: true,
        hide: true,
      },
      {
        field: 'venue',
        rowGroup: true,
        hide: true,
      },
      {
        field: 'deviceName',
        tooltipField: 'deviceName',
        editable: true,
        sortable: true,
      },
      {
        field: 'nowPlaying',
        tooltipField: 'nowPlaying',
        sortable: true,
      },
      {
        field: 'signage',
        tooltipField: 'signage',
        editable: true,
        sortable: true,
      },
      {
        field: 'schedule',
        tooltipField: 'schedule',
        editable: true,
        sortable: true,
        /* suppressSizeToFit: true */
      },
      {
        field: 'channelMix',
        tooltipField: 'channelMix',
        editable: true,
        sortable: true,
      },
      {
        field: 'tvCode',
        tooltipField: 'tvCode',
        sortable: true,
      },
      {
        field: 'lastActive',
        tooltipField: 'lastActive',
        sortable: true,
      },
      {
        field: 'rewards',
        tooltipField: 'rewards',
        sortable: true,
        cellRenderer: RewardRenderer,
      },
      {
        field: 'edit',
        headerName: 'Edit',
        sortable: false,
        pinned: 'right',
        headerClass: 'editHeader',
        cellRenderer: (params: ICellRendererParams) => {
          return linkEditCellRenderer(`/network/devices/${params.data.id}`);
        },
        minWidth: 60,
        maxWidth: 60,
        flexGrow: 0,
        cellStyle: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      },
    ]);
    const defaultColDef = useMemo(() => {
      return {
        flex: 1,
        // sizeColumnsToFit: true,
        minWidth: 120,
        suppressHeaderMenuButton: true,
        tooltipValueGetter: (params: any) => {
          return params.value;
        },
        // maxWidth: 190,
        // skipHeaderOnAutoSize: true,
      };
    }, []);
    const autoGroupColumnDef = useMemo(() => {
      return {
        flex: 1,
        suppressHeaderMenuButton: true,
        // sizeColumnsToFit: true,
        // minWidth: 80,
        // maxWidth: 190,
      };
    }, []);

    React.useEffect(() => {
      if (gridRef && gridRef.current && gridRef.current.api) {
        gridRef.current.api.updateGridOptions({
          quickFilterText: searchText,
        });
      }
      setTimeout(() => {
        if (gridRef && gridRef.current && gridRef.current.api && searchText) {
          gridRef.current.api.expandAll();
        }
      }, 301);
    }, [searchText]);

    const onRowDragMove = useCallback((event: any) => {
      const movingNode = event.node;
      const {overNode} = event;
      // find out what country group we are hovering over
      let groupLocation = '';
      if (overNode.group) {
        groupLocation = overNode.key;
      } else {
        groupLocation = overNode.data.venue;
      }
      const needToChangeParent = movingNode.data.venue !== groupLocation;
      if (
        needToChangeParent &&
        gridRef &&
        gridRef.current &&
        gridRef.current.api
      ) {
        const movingData = movingNode.data;
        movingData.venue = groupLocation;
        gridRef.current.api.applyTransaction({
          update: [movingData],
        });
        gridRef.current.api.clearFocusedCell();
      }
    }, []);

    return (
      <div className="agGridContainer list" style={containerStyle}>
        <div style={gridStyle} className="ag-theme-quartz ag-project-theme">
          <AgGridReact
            ref={(element) => {
              gridRef.current = element;
              if (typeof ref === 'function') {
                ref(element);
              } else if (typeof ref === 'object' && ref !== null) {
                ref.current = element;
              }
            }}
            rowData={[...data]}
            onRowDragMove={onRowDragMove}
            tooltipShowDelay={0}
            // @ts-expect-error - ts-migrate(2532) FIXME: Object is possibly 'undefined'.
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            groupAllowUnbalanced
            enableGroupEdit
            suppressRowClickSelection
            suppressContextMenu
            suppressMovableColumns
            suppressDragLeaveHidesColumns
            rowModelType="clientSide"
            groupDisplayType="groupRows"
            animateRows
            singleClickEdit
            onRowGroupOpened={(grid) => {
              grid.api.sizeColumnsToFit();
            }}
          />
        </div>
      </div>
    );
  },
);

export default DataGrid;
