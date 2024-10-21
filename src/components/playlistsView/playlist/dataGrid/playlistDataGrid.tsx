import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-quartz.min.css';
import 'ag-grid-enterprise';

import type {
  ICellRendererParams,
  SelectionChangedEvent,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
import {AgGridReact} from 'ag-grid-react';
import Image from 'next/image';
import React, {forwardRef, useMemo} from 'react';

import Rating from '@/src/components/common/rating/rating';
import type {BackendVideoData} from '@/src/constants/backendData';

interface DataGridProps {
  searchText: string;
  data: BackendVideoData[];
  selectedVideos: BackendVideoData[];
  onItemDeSelect: (items: BackendVideoData[]) => void;
}

const PlaylistDataGrid = forwardRef<AgGridReact, DataGridProps>(
  function DataGrid(props, ref) {
    const {searchText, data, selectedVideos, onItemDeSelect} = props;
    const gridRef = React.useRef<AgGridReact | null>(null);
    const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
    const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);

    const ratingCellRenderer = (params: ICellRendererParams) => {
      return (
        <div>
          <Rating rating={params.data.rating} />
        </div>
      );
    };

    const videoNameCellRenderer = (params: ICellRendererParams) => {
      return (
        <div className="videoCell">
          <div className="videoImgContainer">
            <Image
              src={params.data.url}
              alt={params.data.name}
              width={48}
              height={28}
            />
          </div>
          <div className="videoName">{params.data.name}</div>
        </div>
      );
    };

    const rowData = useMemo(() => {
      return data;
    }, [data]);
    const columnDefs = useMemo(
      () => [
        {
          field: 'name',
          headerName: 'Video',
          minWidth: 250,
          sortable: true,
          checkboxSelection: true,
          headerCheckboxSelection: true,
          valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) return '';

            return params.value;
          },
          comparator: (valueA: string, valueB: string) => {
            const nameA = valueA.toLowerCase();
            const nameB = valueB.toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          },
          cellRenderer: videoNameCellRenderer,
        },
        {
          field: 'artist',
          sortable: true,
          valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) return '';

            return params.value;
          },
        },
        {
          field: 'genre',
          sortable: true,
          valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) return '';

            return params.value.charAt(0).toUpperCase() + params.value.slice(1);
          },
        },
        {
          field: 'duration',
          sortable: true,
          valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) return '';

            const durationInSeconds = params.value;
            // get duration in minutes and seconds or hours and minutes
            const hours = Math.floor(durationInSeconds / 3600);
            const minutes = Math.floor((durationInSeconds % 3600) / 60);
            const seconds = Math.floor(durationInSeconds % 60);
            const hoursString = hours > 0 ? `${hours}:` : '';
            const minutesString = `${minutes < 10 ? '0' : ''}${minutes}:`;
            const secondsString = seconds < 10 ? `0${seconds}` : seconds;
            return `${hoursString}${minutesString}${secondsString}`;
          },
        },
        {
          field: 'rating',
          sortable: true,
          minWidth: 100,
          maxWidth: 100,
          cellRenderer: ratingCellRenderer,
          comparator: (valueA: string, valueB: string) => {
            const ratingOrder = ['tv-g', 'tv-pg', 'tv-14', 'tv-ma'];
            const ratingA = ratingOrder.indexOf(valueA.toLocaleLowerCase());
            const ratingB = ratingOrder.indexOf(valueB.toLocaleLowerCase());
            if (ratingA < ratingB) return -1;
            if (ratingA > ratingB) return 1;
            return 0;
          },
        },
      ],
      [],
    );
    const defaultColDef = useMemo(() => {
      return {
        minWidth: 100,
        flex: 1,
        sortable: false,
        resizable: false,
        suppressHeaderMenuButton: true,
      };
    }, []);

    const onSelectionChanged = (event: SelectionChangedEvent) => {
      const selectedNodes = event.api.getSelectedNodes();
      const mapOldOrderToNewData = selectedNodes.map((playlist) => {
        return playlist.data;
      });
      if (
        ![
          'api',
          'apiSelectAll',
          'apiSelectAllFiltered',
          'apiSelectAllCurrentPage',
        ].includes(event.source)
      )
        onItemDeSelect(mapOldOrderToNewData);
    };

    React.useEffect(() => {
      // resize listener to resize grid on window resize
      const resizeListener = () => {
        if (gridRef.current) {
          gridRef.current.api.sizeColumnsToFit();
        }
      };
      window.addEventListener('resize', resizeListener);
      return () => {
        window.removeEventListener('resize', resizeListener);
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

    React.useEffect(() => {
      if (gridRef && gridRef.current && gridRef.current.api) {
        const nodesToSelect: any[] = [];
        // unselect all nodes)
        gridRef.current.api.deselectAll();
        gridRef.current.api.forEachNode((node) => {
          if (
            node.data &&
            selectedVideos.find(
              (selected) => selected && selected.id === node.data.id,
            )
          ) {
            nodesToSelect.push(node);
          }
        });
        gridRef.current.api.setNodesSelected({
          nodes: nodesToSelect,
          newValue: true,
        });
      }
    }, [selectedVideos, gridRef.current?.api]);

    return (
      <div style={containerStyle}>
        <div
          style={gridStyle}
          id="playlistDataGrid"
          className="ag-theme-quartz ag-project-theme ag-folder-project-theme agNormalHeight"
        >
          {
            <AgGridReact
              ref={(element) => {
                gridRef.current = element;
                if (typeof ref === 'function') {
                  ref(element);
                } else if (typeof ref === 'object' && ref !== null) {
                  ref.current = element;
                }
              }}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
              groupSelectsChildren
              // treeData
              suppressRowClickSelection
              suppressContextMenu
              suppressMovableColumns
              suppressDragLeaveHidesColumns
              animateRows
              rowHeight={40}
              onSelectionChanged={onSelectionChanged}
            />
          }
        </div>
      </div>
    );
  },
);

export default PlaylistDataGrid;
