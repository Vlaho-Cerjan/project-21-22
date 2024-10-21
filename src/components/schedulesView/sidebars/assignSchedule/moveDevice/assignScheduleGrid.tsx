import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-quartz.min.css';
import 'ag-grid-enterprise';

import {AgGridReact} from 'ag-grid-react';
import React, {forwardRef, useMemo, useState} from 'react';
import {useWindowSize} from 'usehooks-ts';

interface DataGridProps {
  data: any;
}

const ActionDataGrid = forwardRef<AgGridReact, DataGridProps>(
  function DataGrid(props, ref) {
    // Each Column Definition results in one Column.
    const gridRef = React.useRef<AgGridReact | null>(null);
    const {data} = props;
    const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
    const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);

    const {width} = useWindowSize();

    React.useEffect(() => {
      if (gridRef && gridRef.current && gridRef.current.api) {
        gridRef.current.api.sizeColumnsToFit();
      }
    }, [width]);

    React.useEffect(() => {
      setTimeout(() => {
        if (gridRef && gridRef.current && gridRef.current.api) {
          gridRef.current.api.sizeColumnsToFit();
        }
      }, 500);
    }, []);

    const [columnDefs] = useState([
      /* {
        headerName: 'Area',
        field: 'areaName',
        valueFormatter: (params: any) => {
          if (params && params.data) {
            if (params.data.areaName === '') return '';
            return params.data.areaName;
          }
          return '';
        },
        checkboxSelection: (params: any) => {
          if (params && params.data) {
            if (params.data.areaName === '') return false;

            return true;
          }
          return false;
        },
      },
      {
        headerName: 'Venue',
        field: 'venueName',
        valueFormatter: (params: any) => {
          if (params && params.data) {
            if (params.data.venueName === '') return '';
            return params.data.venueName;
          }
          return '';
        },
        checkboxSelection: (params: any) => {
          if (params && params.data) {
            if (params.data.venueName === '') return false;

            return true;
          }
          return false;
        },
      }, */
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
      /* {
        headerName: 'Device',
        field: 'deviceName',
        valueFormatter: (params: any) => {
          if (params && params.data) {
            if (params.data.deviceName === '') return '';
            return params.data.deviceName;
          }
          return '';
        },
        checkboxSelection: (params: any) => {
          if (params && params.data) {
            if (params.data.deviceName === '') return false;

            return true;
          }
          return false;
        },
      }, */
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
    /*
    const autoGroupColumnDef: ColDef = useMemo(() => {
      return {
        headerName: 'Area / Venue / Device',
        suppressHeaderMenuButton: true,
        flex: 1,
        resizable: false,
        cellRendererParams: {
          checkbox: (params: any) => {
            if (params.value) return true;
            return false;
          },
        },
        // sizeColumnsToFit: true,
        // minWidth: 80,
        // maxWidth: 190,
      };
    }, []);
*/
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
            tooltipShowDelay={0}
            suppressContextMenu
            suppressMovableColumns
            suppressDragLeaveHidesColumns
            rowSelection="multiple"
            suppressRowClickSelection
            suppressAggFuncInHeader
            animateRows
            getDataPath={(dataPath) => dataPath.orgHierarchy}
            groupSelectsChildren
            treeData
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            // autoGroupColumnDef={autoGroupColumnDef}
            isRowSelectable={(rowNode) => {
              return rowNode.data ? rowNode.data.deviceName !== '' : false;
            }}
            rowModelType="clientSide"
          />
        </div>
      </div>
    );
  },
);

export default ActionDataGrid;
