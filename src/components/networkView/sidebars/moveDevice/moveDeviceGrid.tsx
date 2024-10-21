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

    const [columnDefs] = useState([
      {
        field: 'area',
        rowGroup: true,
        hide: true,
      },
      {
        headerName: 'Venue',
        field: 'name',
        checkboxSelection: true,
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
        headerName: 'Area',
        suppressHeaderMenuButton: true,
        flex: 1,
        // sizeColumnsToFit: true,
        // minWidth: 80,
        // maxWidth: 190,
      };
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
            tooltipShowDelay={0}
            rowSelection="single"
            suppressContextMenu
            suppressMovableColumns
            suppressDragLeaveHidesColumns
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            autoGroupColumnDef={autoGroupColumnDef}
            isRowSelectable={(rowNode) => {
              return rowNode.data ? rowNode.data.name !== '' : false;
            }}
            rowModelType="clientSide"
            groupDisplayType="singleColumn"
          />
        </div>
      </div>
    );
  },
);

export default ActionDataGrid;
