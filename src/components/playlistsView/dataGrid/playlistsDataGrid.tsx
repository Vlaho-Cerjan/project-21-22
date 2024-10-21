import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-quartz.min.css';
import 'ag-grid-enterprise';

import type {
  CellClassParams,
  ICellRendererParams,
  IRowNode,
  SelectionChangedEvent,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
import {AgGridReact} from 'ag-grid-react';
import React, {forwardRef, useCallback, useMemo} from 'react';

import type {BackendPlaylistsData} from '@/src/constants/backendData';
import {GetTypeById} from '@/src/utils/GetTypeById';

import {editCellRenderer} from '../../common/listComponents/listComponents';

const getFileIcon = (name: string) => {
  const endsWith = (str: string, match: string) => {
    if (str == null || !str.length || match == null || !match.length) {
      return false;
    }
    const len = str.length;
    return str.substring(len - match.length, len) === match;
  };

  return endsWith(name, '.mp3') || endsWith(name, '.wav')
    ? 'file-audio'
    : endsWith(name, '.xls')
      ? 'file-excel'
      : endsWith(name, '.txt')
        ? 'file-txt'
        : endsWith(name, '.pdf')
          ? 'file-pdf'
          : endsWith(name, '.png') ||
              endsWith(name, '.jpg') ||
              endsWith(name, '.jpeg')
            ? 'file-image'
            : endsWith(name, '.mp4') || endsWith(name, '.mov')
              ? 'file-video'
              : 'folder';
};

let potentialParent: any = null;

const cellClassRules = {
  'hover-over': (params: any) => {
    return params.node === potentialParent;
  },
};

// this updates the orgHierarchy locations in our data, we update the data
// before we send it to AG Grid
const moveToPath = (
  newParentPath: string[],
  node: any,
  allUpdatedNodes: any,
) => {
  // last part of the file path is the file name
  if (node.data) {
    const oldPath = node.data.orgHierarchy;
    const fileName = oldPath[oldPath.length - 1];
    const newChildPath = newParentPath.slice();
    newChildPath.push(fileName);
    node.data.orgHierarchy = newChildPath;
    allUpdatedNodes.push(node.data);
    if (node.childrenAfterGroup) {
      node.childrenAfterGroup.forEach((childNode: any) => {
        moveToPath(newChildPath, childNode, allUpdatedNodes);
      });
    }
  }
};

const isSelectionParentOfTarget = (selectedNode: any, targetNode: any) => {
  const children = [...(selectedNode.childrenAfterGroup || [])];
  if (!targetNode) {
    return false;
  }
  while (children.length) {
    const node = children.shift();
    if (!node) return false;
    if (node.key === targetNode.key) {
      return true;
    }
    if (node.childrenAfterGroup && node.childrenAfterGroup.length) {
      children.push(...node.childrenAfterGroup);
    }
  }
  return false;
};

const arePathsEqual = (path1: string[], path2: string[]) => {
  if (path1.length !== path2.length) {
    return false;
  }
  let equal = true;
  path1.forEach((item, index) => {
    if (path2[index] !== item) {
      equal = false;
    }
  });
  return equal;
};

const refreshRows = (api: any, rowsToRefresh: any) => {
  const params = {
    // refresh these rows only.
    rowNodes: rowsToRefresh,
    // because the grid does change detection, the refresh
    // will not happen because the underlying value has not
    // changed. to get around this, we force the refresh,
    // which skips change detection.
    force: true,
  };
  api.refreshCells(params);
};

const setPotentialParentForNode = (api: any, overNode: any) => {
  let newPotentialParent;
  if (overNode) {
    newPotentialParent =
      overNode.data.type === 'folder'
        ? // if over a folder, we take the implaylistste row
          overNode
        : // if over a file, we take the parent row (which will be a folder)
          overNode.parent;
  } else {
    newPotentialParent = null;
  }
  const alreadySelected = potentialParent === newPotentialParent;
  if (alreadySelected) {
    return;
  }
  // we refresh the previous selection (if it exists) to clear
  // the highlighted and then the new selection.
  const rowsToRefresh = [];
  if (potentialParent) {
    rowsToRefresh.push(potentialParent);
  }
  if (newPotentialParent) {
    rowsToRefresh.push(newPotentialParent);
  }
  potentialParent = newPotentialParent;
  refreshRows(api, rowsToRefresh);
};

const getFileCellRenderer = () => {
  class FileCellRenderer {
    eGui: HTMLElement | null = null;

    init(params: any) {
      const tempDiv = document.createElement('div');
      const {value, data} = params;
      if (data && data.type) {
        const icon = getFileIcon(data ? data.url : '');
        let folderIcon = null;
        if (icon === 'folder') {
          folderIcon = `<span class="imageContainer"><svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g>
        <path d="M26.6955 11.2712V9C26.6955 7.89543 25.5572 7 24.1531 7H15.9792C15.5584 7 15.1649 6.8362 14.9282 6.56252L13.0902 4.43752C12.8535 4.16382 12.4599 4 12.0391 4H6.35609C4.95194 4 3.81366 4.89543 3.81366 6V18.4169C3.81366 19.2912 4.71466 20 5.82609 20V20C6.85152 20 7.71297 19.3935 7.82621 18.5918L8.64722 12.7791C8.79029 11.7663 9.87861 11 11.1741 11H25.424C26.1472 11 26.8361 11.2423 27.3184 11.6662C27.8007 12.09 28.0307 12.6555 27.9509 13.2209L27.2446 18.2209C27.1016 19.2337 26.0133 20 24.7178 20H5.82609" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        </svg>
        </span>
        `;
        }
        if (icon === 'file-image') {
          folderIcon = `<span class="imageContainer">
        <Image src="${params.data.url}" alt=${params.data.name} fill />
        </span>`;
        }
        if (icon === 'file-video') {
          folderIcon = `<span class="imageContainer">
        <Image src="${params.data.thumb || ''}" alt=${params.data.name} fill />
        </span>`;
        }
        if (icon === 'file-txt') {
          folderIcon = `<span class="imageContainer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M11.71 15.0099L8.86 8.37988L6 15.0099L6.51 13.8199H11.2" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M17 21H7C4.791 21 3 19.209 3 17V7C3 4.791 4.791 3 7 3H17C19.209 3 21 4.791 21 7V17C21 19.209 19.209 21 17 21Z" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17.161 11.579C17.9464 12.3643 17.9464 13.6376 17.161 14.423C16.3757 15.2083 15.1024 15.2083 14.317 14.423C13.5317 13.6376 13.5317 12.3643 14.317 11.579C15.1024 10.7937 16.3757 10.7937 17.161 11.579" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M17.75 11V15" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        </span>
        `;
        }
        tempDiv.innerHTML = folderIcon
          ? `<span title="${value}" class="itemWithImage">${folderIcon} <span class="filename">${value}</span></span>`
          : `<span title="${value}" class="filename">${value}</span>`;
        this.eGui = tempDiv.firstChild as HTMLElement;
      }
    }

    getGui() {
      return this.eGui;
    }
  }
  return FileCellRenderer;
};

interface DataGridProps {
  searchText: string;
  data: BackendPlaylistsData[];
  setData: React.Dispatch<React.SetStateAction<BackendPlaylistsData[]>>;
  setBackendPlaylistsData: React.Dispatch<
    React.SetStateAction<BackendPlaylistsData[]>
  >;
  selectedPlaylists: BackendPlaylistsData[];
  onItemDeSelect: (items: BackendPlaylistsData[]) => void;
  onPlaylistsEdit: (item: BackendPlaylistsData) => void;
}

const PlaylistsDataGrid = forwardRef<AgGridReact, DataGridProps>(
  function DataGrid(props, ref) {
    const {
      searchText,
      data,
      setData,
      setBackendPlaylistsData,
      selectedPlaylists,
      onItemDeSelect,
      onPlaylistsEdit,
    } = props;
    const gridRef = React.useRef<AgGridReact | null>(null);
    const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
    const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);
    const [isDragActive, setIsDragActive] = React.useState(false);
    const [isUploadActive, setIsUploadActive] = React.useState(false);
    const [isOnFolder, setIsOnFolder] = React.useState(false);
    const [folderId, setFolderId] = React.useState<string | undefined>(
      undefined,
    );

    const rowData = useMemo(() => {
      return data;
    }, [data]);
    const columnDefs = useMemo(
      () => [
        /* {
          field: 'videos',
          sortable: true,
          cellClassRules,
          cellClass: (params: CellClassParams) => {
            const classes = [];
            if (params.data) {
              if (
                (isDragActive || isUploadActive) &&
                params.data.type === 'folder'
              ) {
                classes.push('dragging');
              }
              if (params.data.type === 'folder') {
                classes.push('folder');
              }
              if (params.data.id === folderId) {
                classes.push('uploadFolder');
              }
            }
            return classes;
          },
          valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) return '';
            return `${params.value.length}`;
          },
        },
        */
        {
          field: 'type',
          sortable: true,
          cellClassRules,
          cellClass: (params: CellClassParams) => {
            const classes = [];
            if (params.data) {
              if (
                (isDragActive || isUploadActive) &&
                params.data.type === 'folder'
              ) {
                classes.push('dragging', 'first');
              }
              if (params.data.type === 'folder') {
                classes.push('folder');
              }
              if (params.data.id === folderId) {
                classes.push('uploadFolder');
              }
            }
            return classes;
          },
          valueFormatter: (params: ValueFormatterParams) => {
            if (!params.value) return '';
            if (params.value === 'folder') return 'Folder';

            const type = GetTypeById(params.value);
            return type?.name || '';
          },
        },
        {
          field: 'edit',
          headerName: 'Edit',
          pinned: true,
          sortable: false,
          headerClass: 'editHeader',
          cellRenderer: (params: ICellRendererParams) => {
            return editCellRenderer(params, () => {
              if (params.data) {
                onPlaylistsEdit(params.data);
              }
            });
          },
          cellClassRules,
          cellClass: (params: CellClassParams) => {
            const classes = [];
            if (params.data) {
              if (
                (isDragActive || isUploadActive) &&
                params.data.type === 'folder'
              ) {
                classes.push('dragging', 'last');
              }
              if (params.data.type === 'folder') {
                classes.push('folder');
              }
              if (params.data.id === folderId) {
                classes.push('uploadFolder');
              }
            }
            return classes;
          },
          minWidth: 60,
          maxWidth: 60,
          flexGrow: 0,
          cellStyle: {
            justifyContent: 'center',
          },
        },
      ],
      [isDragActive, isUploadActive, folderId],
    );
    const defaultColDef = useMemo(() => {
      return {
        minWidth: 100,
        flex: 0,
        sortable: false,
        suppressHeaderMenuButton: true,
      };
    }, []);
    const autoGroupColumnDef = useMemo(() => {
      return {
        headerName: 'Playlist',
        cellClass: (params: CellClassParams) => {
          const classes = [];

          if (params.data) {
            if (
              (isDragActive || isUploadActive) &&
              params.data.type === 'folder'
            ) {
              classes.push('dragging', 'first');
            }
            if (params.data.type === 'folder') {
              classes.push('folder');
            }
            if (params.data.id === folderId) {
              classes.push('uploadFolder');
            }
          }
          return classes;
        },
        cellClassRules: {
          'hover-over': (params: any) => {
            return params.node === potentialParent;
          },
        },
        flex: 1,
        editable: true,
        rowDrag: true,
        minWidth: 330,
        suppressHeaderMenuButton: true,
        headerCheckboxSelection: true,
        sortable: true,
        comparator: (
          valueA: string | null | undefined,
          valueB: string | null | undefined,
          nodeA: IRowNode,
          nodeB: IRowNode,
          isDescending: boolean,
        ) => {
          if (valueA && valueB) {
            // sort by folder first
            if (nodeA.data.type === 'folder' && nodeB.data.type !== 'folder') {
              return isDescending ? 1 : -1;
            }
            if (nodeA.data.type !== 'folder' && nodeB.data.type === 'folder') {
              return isDescending ? -1 : 1;
            }

            // then sort by name
            const nameA = valueA.toLowerCase();
            const nameB = valueB.toLowerCase();
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
          }
          return 0;
        },
        cellRendererParams: {
          checkbox: true,
          suppressCount: true,
          innerRenderer: getFileCellRenderer(),
        },
      };
    }, [isDragActive, isUploadActive, folderId]);

    const getDataPath = useMemo(() => {
      return (tempData: any) => {
        return tempData.orgHierarchy;
      };
    }, []);

    const getRowId = useMemo(() => {
      return (params: any) => {
        return params.data.id;
      };
    }, []);

    const onSelectionChanged = (event: SelectionChangedEvent) => {
      const selectedNodes = event.api.getSelectedNodes();
      const mapOldOrderToNewData = selectedNodes.map((playlists) => {
        return playlists.data;
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
      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
      };

      const onDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setIsOnFolder(false);
        setFolderId(undefined);
        setIsUploadActive(false);
      };

      const onDragDrop = (e: DragEvent) => {
        e.preventDefault();
        setIsOnFolder(false);
        setFolderId(undefined);
        setIsUploadActive(false);
      };
      const attachPlaylistsModalContainer = document.getElementById(
        'attachPlaylistsModalContainer',
      );
      const folderGrid = document.getElementById('folderGrid');
      if (attachPlaylistsModalContainer && folderGrid) {
        attachPlaylistsModalContainer.addEventListener('dragover', onDragOver);
        attachPlaylistsModalContainer.addEventListener(
          'dragleave',
          onDragLeave,
        );
        attachPlaylistsModalContainer.addEventListener('drop', onDragDrop);
        folderGrid.addEventListener('drop', onDragDrop);
      }
      return () => {
        if (folderGrid && attachPlaylistsModalContainer) {
          attachPlaylistsModalContainer.removeEventListener(
            'dragover',
            onDragOver,
          );
          attachPlaylistsModalContainer.removeEventListener(
            'dragleave',
            onDragLeave,
          );
          attachPlaylistsModalContainer.removeEventListener('drop', onDragDrop);
          folderGrid.removeEventListener('drop', onDragDrop);
        }
      };
    }, []);

    const onRowDragMove = useCallback((event: any) => {
      setIsDragActive(true);
      setPotentialParentForNode(event.api, event.overNode);
    }, []);

    const onRowDragLeave = useCallback((event: any) => {
      // clear node to highlight
      setPotentialParentForNode(event.api, null);
    }, []);

    const onRowDragEnd = useCallback(
      (event: any) => {
        setIsDragActive(false);
        if (!potentialParent) {
          return;
        }
        const movingData = event.node.data;
        // take new parent path from parent, if data is missing, means it's the root node,
        // which has no data.
        const newParentPath = potentialParent.data
          ? potentialParent.data.orgHierarchy
          : [];
        const needToChangeParent = !arePathsEqual(
          newParentPath,
          movingData.orgHierarchy,
        );
        // check we are not moving a folder into a child folder
        const invalidMode = isSelectionParentOfTarget(
          event.node,
          potentialParent,
        );
        if (invalidMode) {
          console.log('invalid move');
        }
        if (needToChangeParent && !invalidMode && gridRef && gridRef.current) {
          const updatedRows: BackendPlaylistsData[] = [];
          moveToPath(newParentPath, event.node, updatedRows);
          gridRef.current.api.applyTransaction({
            update: updatedRows,
          });
          gridRef.current.api.clearFocusedCell();
          if (
            updatedRows &&
            (potentialParent.data || potentialParent.level === -1)
          ) {
            updatedRows.forEach((updatedRow) => {
              if (updatedRow.id === movingData.id) {
                updatedRow.folderId = potentialParent.data
                  ? potentialParent.data.id
                  : undefined;
              }
            });
            setData(
              data.map((tempItem) => {
                const updatedRow = updatedRows.find(
                  (updatedItem) => updatedItem.id === tempItem.id,
                );
                if (updatedRow) {
                  return updatedRow;
                }
                return tempItem;
              }),
            );
            setBackendPlaylistsData(
              data.filter((tempItem) => tempItem.orgHierarchy.length === 1),
            );
          }
        }
        // clear node to highlight
        setPotentialParentForNode(event.api, null);
      },
      [potentialParent],
    );

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
            selectedPlaylists.find(
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
    }, [selectedPlaylists, gridRef.current?.api]);

    return (
      <div style={containerStyle}>
        <div
          style={gridStyle}
          id="folderGrid"
          className={`ag-theme-quartz ag-project-theme ag-folder-project-theme${
            isUploadActive ? ' uploadActive' : ''
          }${isOnFolder ? ' onFolder' : ''}`}
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
              autoGroupColumnDef={autoGroupColumnDef}
              rowSelection="multiple"
              groupSelectsChildren
              treeData
              suppressRowClickSelection
              suppressContextMenu
              suppressMovableColumns
              suppressDragLeaveHidesColumns
              animateRows
              rowHeight={40}
              getDataPath={getDataPath}
              getRowId={getRowId}
              onRowDragMove={onRowDragMove}
              onRowDragLeave={onRowDragLeave}
              onRowDragEnd={onRowDragEnd}
              onSelectionChanged={onSelectionChanged}
            />
          }
        </div>
      </div>
    );
  },
);

export default PlaylistsDataGrid;
