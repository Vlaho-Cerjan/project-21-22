import {ModuleRegistry} from '@ag-grid-community/core';
import 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.min.css';
import 'ag-grid-community/styles/ag-theme-quartz.min.css';
import 'ag-grid-enterprise';
import type {
  ColDef,
  GridApi,
  GridOptions,
  ICellRendererParams,
  IRowNode,
  RowDragCallbackParams,
  RowDragMoveEvent,
  SelectionChangedEvent,
  SideBarDef,
  ValueFormatterParams,
} from 'ag-grid-enterprise';
import {AgGridReact} from 'ag-grid-react';

import React, {forwardRef, useCallback, useMemo} from 'react';

import MemoCloudUpload from '@/src/icons/cloud-upload';
import MemoFolder from '@/src/icons/folder';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import type {GridData} from '@/types/gridData';
import {ColumnsToolPanelModule} from '@ag-grid-enterprise/column-tool-panel';
import {editCellRenderer} from '../../common/listComponents/listComponents';

ModuleRegistry.registerModules([ColumnsToolPanelModule]);

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

// this updates the orgHierarchy locations in our data, we update the data
// before we send it to AG Grid
const moveToPath = (
  newParentPath: string[] | string | null,
  newParentName: string,
  node: any,
  allUpdatedNodes: any,
) => {
  // last part of the file path is the file name
  if (node.data) {
    const oldPath = node.data.orgHierarchy || node.data.group_id || null;
    //console.log(newParentPath, oldPath, 'newParentPath, oldPath');
    if (
      typeof newParentPath === 'string' &&
      (typeof oldPath === 'string' || !oldPath)
    ) {
      node.data.group_id = newParentPath === '1' ? null : newParentPath;
      node.data.groupName = newParentName;
      allUpdatedNodes.push(node.data);
      if (node.childrenAfterGroup) {
        node.childrenAfterGroup.forEach((childNode: any) => {
          moveToPath(newParentPath, newParentName, childNode, allUpdatedNodes);
        });
      }
    } else if (
      Array.isArray(newParentPath) &&
      (Array.isArray(oldPath) || !oldPath)
    ) {
      const fileName = oldPath[oldPath.length - 1];
      const newChildPath = newParentPath.slice();
      newChildPath.push(fileName);
      node.data.orgHierarchy = newChildPath;
      node.data.groupName = newParentName;
      allUpdatedNodes.push(node.data);
      if (node.childrenAfterGroup) {
        node.childrenAfterGroup.forEach((childNode: any) => {
          moveToPath(newChildPath, newParentName, childNode, allUpdatedNodes);
        });
      }
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

const arePathsEqual = (
  path1: string[] | string | null,
  path2: string[] | string | null,
) => {
  if (!path1 || !path2) return false;
  if (typeof path1 === 'string' && typeof path2 === 'string') {
    return path1 === path2;
  }
  if (path1.length !== path2.length) return false;
  for (let i = 0; i < path1.length; i++) {
    if (path1[i] !== path2[i]) return false;
  }
  return true;
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

const getFileCellRenderer = () => {
  class FileCellRenderer {
    eGui: HTMLElement | null = null;

    init(params: any) {
      const tempDiv = document.createElement('div');
      const {value, data} = params;
      if (data && data.type) {
        const icon = data.url
          ? getFileIcon(data.url)
          : data.type === 'schedule'
            ? 'file-schedule'
            : data.type === 'text'
              ? 'file-txt'
              : data.type === 'rss'
                ? 'file-rss'
                : data.type === 'folder'
                  ? 'folder'
                  : 'none';
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
        if (icon === 'file-schedule') {
          folderIcon = `<span class="scheduleContainer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
<path d="M4.99792 16.0021L9.90497 16.0391" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 12.0005H15.0021" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.0037 7.99874H0.996216" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.99826 1.49609V4.49734" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.0017 1.49609V4.49734" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.0025 20.0038H3.99747C2.33978 20.0038 0.996216 18.6602 0.996216 17.0025V5.99795C0.996216 4.34026 2.33978 2.9967 3.99747 2.9967H16.0025C17.6602 2.9967 19.0037 4.34026 19.0037 5.99795V17.0025C19.0037 18.6602 17.6602 20.0038 16.0025 20.0038Z" stroke="#323234" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
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
        if (icon === 'file-rss') {
          folderIcon = `<span class="imageContainer">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17.5 16H19C20.3807 16 21.5 14.8807 21.5 13.5V6.5C21.5 5.11929 20.3807 4 19 4H8C6.61929 4 5.5 5.11929 5.5 6.5V8" stroke="#323232" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <rect x="2.5" y="8" width="15" height="12" rx="2.5" stroke="#323232" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.5 15.5L11.5 12.5" stroke="#323232" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11.5 15.5V12.5" stroke="#323232" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M8.5 12.5H11.5" stroke="#323232" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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

interface ListViewProps {
  data: GridData[];
  setData: React.Dispatch<React.SetStateAction<GridData[]>>;
  setMediaData?: React.Dispatch<React.SetStateAction<GridData[]>>;
  selectedMedia: GridData[];
  noSelect?: boolean;
  onItemDeSelect: (items: GridData[]) => void;
  onMediaEdit: (item: GridData) => void;
  noUpload?: boolean;
  type?: string;
  columnDefsData?: ColDef[];
  groupColumnDefData?: ColDef;
  gridOptions?: GridOptions;
  hardcodedTopFolders?: boolean;
  saveGridSettings?: (gridSettings: GridSettings) => void;
  pageLimit?: number;
  onDragDropFunction?: (updatedRows: GridData) => Promise<{
    success: boolean;
  }>;
}

const ListView = forwardRef<AgGridReact, ListViewProps>(
  function ListView(props, ref) {
    const {
      data,
      // setData,
      // setMediaData,
      selectedMedia,
      onItemDeSelect,
      onMediaEdit,
      noUpload,
      type,
      noSelect,
      columnDefsData,
      gridOptions,
      hardcodedTopFolders,
      groupColumnDefData,
      saveGridSettings,
      pageLimit = 10,
      onDragDropFunction,
    } = props;
    const gridRef = React.useRef<AgGridReact | null>(null);
    const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
    const gridStyle = useMemo(
      () => ({height: '100%', width: '100%', flex: '1 1 0px'}),
      [],
    );
    const [isDragActive, setIsDragActive] = React.useState(false);
    const [isUploadActive, setIsUploadActive] = React.useState(false);
    const [isOnFolder, setIsOnFolder] = React.useState(false);
    const [folderId, setFolderId] = React.useState<string | undefined>(
      undefined,
    );
    const [dragPlace, setDragPlace] = React.useState('Media');
    const [dragItem, setDragItem] = React.useState<GridData | null>(null);

    const [potentialParent, setPotentialParent] =
      React.useState<IRowNode | null>(null);

    const cellClassRules: any = React.useMemo(
      () => ({
        'hover-over': (params: any) => {
          //console.log(params.node.data, dragItem, 'hover-over');
          if (
            params.node.data &&
            params.node.data.type === 'folder' &&
            dragItem &&
            (dragItem.group_id === params.data.id ||
              (!dragItem.group_id && params.data.id === '1'))
          )
            return false;
          if (
            params.node.data &&
            params.node.data.type !== 'folder' &&
            params.node.data.group_id === dragItem?.group_id
          )
            return false;
          return params.node === potentialParent;
        },
      }),
      [dragItem, potentialParent],
    );

    const setPotentialParentForNode = useCallback(
      (
        api: GridApi,
        overNode: IRowNode | null,
        data: {
          hardcodedTopFolders: boolean;
          dragItem: GridData | null;
          potentialParent: IRowNode | null;
        },
      ) => {
        let newPotentialParent;
        if (overNode) {
          newPotentialParent =
            overNode.data.type === 'folder'
              ? // if over a folder, we take the immediate row
                overNode
              : // if over a file, we take the parent row (which will be a folder)
                overNode.parent;
        } else {
          newPotentialParent = null;
        }

        /*
        console.log(
          data.dragItem,
          newPotentialParent?.data,
          newPotentialParent?.data.id,
          'parent group id',
        );
        */
        if (
          data.hardcodedTopFolders &&
          newPotentialParent &&
          newPotentialParent.data.type === 'folder' &&
          data.dragItem &&
          data.dragItem.group_id === newPotentialParent.data.id
        ) {
          setPotentialParent(newPotentialParent);
          return;
        }

        /*
        if (
          newPotentialParent &&
          newPotentialParent.data.type === 'folder' &&
          !dragItem?.group_id &&
          newPotentialParent.data.id === '1'
        )
          return;
        */

        const alreadySelected = data.potentialParent === newPotentialParent;
        if (alreadySelected) {
          setPotentialParent(newPotentialParent);
          return;
        }
        // we refresh the previous selection (if it exists) to clear
        // the highlighted and then the new selection.
        const rowsToRefresh = [];
        if (data.potentialParent) {
          rowsToRefresh.push(data.potentialParent);
        }
        if (newPotentialParent) {
          rowsToRefresh.push(newPotentialParent);
        }
        setPotentialParent(newPotentialParent);
        refreshRows(api, rowsToRefresh);
      },
      [],
    );

    const rowData = useMemo(() => {
      return data;
    }, [data]);

    const cellClassFnc = ({
      params,
      i,
      dragActive,
      uploadActive,
      cDDL,
    }: {
      params: any;
      i?: number;
      dragActive: boolean;
      uploadActive: boolean;
      cDDL?: number;
    }) => {
      const classes = [];
      if (params.data) {
        if (
          (dragActive || uploadActive) &&
          params.node.data &&
          ((params.data.type === 'folder' &&
            (!dragItem || dragItem.group_id !== params.data.id)) ||
            (params.data.type !== 'folder' &&
              params.data.group_id !== dragItem?.group_id))
        ) {
          if (i && i === 0) classes.push('dragging', 'first');
          else if (i && cDDL && i === cDDL - 1)
            classes.push('dragging', 'last');
          else classes.push('dragging');
        }
        if (params.data.type === 'folder') {
          classes.push('folder');
        }
        if (params.data.id === folderId) {
          classes.push('uploadFolder');
        }
      }
      return classes;
    };

    const columnDefs: any = useMemo(
      () =>
        columnDefsData
          ? columnDefsData.map((colDefData, index) => {
              return {
                ...colDefData,
                cellClassRules,
                cellClass: (params: any) => {
                  return cellClassFnc({
                    params,
                    i: index,
                    dragActive: isDragActive,
                    uploadActive: isUploadActive,
                    cDDL: columnDefsData.length,
                  });
                },
              };
            })
          : [
              {
                field: 'type',
                cellClassRules,
                cellClass: (params: any) => {
                  return cellClassFnc({
                    params,
                    dragActive: isDragActive,
                    uploadActive: isUploadActive,
                  });
                },
                valueFormatter: (params: ValueFormatterParams) => {
                  if (!params.value) return '';
                  return (
                    params.value.charAt(0).toUpperCase() + params.value.slice(1)
                  );
                },
              },
              {
                field: 'updated_at',
                cellClassRules,
                cellClass: (params: any) => {
                  return cellClassFnc({
                    params,
                    dragActive: isDragActive,
                    uploadActive: isUploadActive,
                  });
                },
                headerName: 'Modified',
                valueFormatter: (params: ValueFormatterParams) => {
                  if (!params.value) return '';
                  return new Date(params.value).toLocaleDateString();
                },
                comparator: (d1: string, d2: string) => {
                  return new Date(d1).getTime() < new Date(d2).getTime()
                    ? -1
                    : 1;
                },
              },
              type === 'schedule'
                ? {
                    field: 'playlistsCount',
                    headerName: 'Playlists',
                    cellClassRules,
                    cellClass: (params: any) => {
                      return cellClassFnc({
                        params,
                        dragActive: isDragActive,
                        uploadActive: isUploadActive,
                      });
                    },
                  }
                : {
                    field: 'duration',
                    headerName: 'Length',
                    cellClassRules,
                    cellClass: (params: any) => {
                      return cellClassFnc({
                        params,
                        dragActive: isDragActive,
                        uploadActive: isUploadActive,
                      });
                    },
                    valueFormatter: (params: any) => {
                      if (!params.value) return '';
                      const minutes = Math.floor(params.value / 60);
                      const seconds = Math.floor(params.value % 60);
                      return `${minutes < 10 ? '0' : ''}${minutes}:${
                        seconds < 10 ? '0' : ''
                      }${seconds}`;
                    },
                  },
              {
                field: 'edit',
                headerName: 'Edit',
                pinned: 'right',
                sortable: false,
                headerClass: 'editHeader',
                cellRenderer: (params: ICellRendererParams) => {
                  return editCellRenderer(params, () => {
                    if (params.data) {
                      onMediaEdit(params.data);
                    }
                  });
                },
                cellClassRules,
                cellClass: (params: any) => {
                  return cellClassFnc({
                    params,
                    i: 2,
                    dragActive: isDragActive,
                    uploadActive: isUploadActive,
                    cDDL: 3,
                  });
                },
                minWidth: 60,
                maxWidth: 60,
                cellStyle: {
                  justifyContent: 'center',
                },
              },
            ],
      [
        isDragActive,
        columnDefsData,
        isUploadActive,
        folderId,
        hardcodedTopFolders,
        cellClassRules,
        dragItem,
      ],
    );

    const defaultColDef = useMemo(() => {
      return {
        sortable: false,
        suppressHeaderMenuButton: true,
        flex: 1,
      };
    }, []);
    const autoGroupColumnDef = useMemo(
      () =>
        groupColumnDefData
          ? {
              cellClassRules,
              cellClass: (params: any) => {
                return cellClassFnc({
                  params,
                  i: 0,
                  dragActive: isDragActive,
                  uploadActive: isUploadActive,
                  cDDL: 1,
                });
              },
              editable: true,
              rowDrag: hardcodedTopFolders
                ? (params: RowDragCallbackParams) => {
                    if (
                      params.node.data &&
                      params.data.type === 'folder' &&
                      params.node.data &&
                      !params.data.group_id
                    )
                      return false;

                    return true;
                  }
                : true,
              // minWidth: 330,
              suppressHeaderMenuButton: true,
              // headerCheckboxSelection: true,
              sortable: false,
              comparator: (
                valueA: string | null | undefined,
                valueB: string | null | undefined,
                nodeA: IRowNode,
                nodeB: IRowNode,
                isDescending: boolean,
              ) => {
                if (valueA && valueB) {
                  // sort by folder first
                  if (
                    nodeA.data.type === 'folder' &&
                    nodeB.data.type !== 'folder'
                  ) {
                    return isDescending ? 1 : -1;
                  }
                  if (
                    nodeA.data.type !== 'folder' &&
                    nodeB.data.type === 'folder'
                  ) {
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
                // checkbox: true,
                suppressCount: true,
                innerRenderer: getFileCellRenderer(),
              },
              ...groupColumnDefData,
            }
          : {
              headerName: 'Files',
              cellClass: (params: any) => {
                return cellClassFnc({
                  params,
                  i: 0,
                  dragActive: isDragActive,
                  uploadActive: isUploadActive,
                  cDDL: 1,
                });
              },
              cellClassRules,
              editable: true,
              rowDrag: hardcodedTopFolders
                ? (params: RowDragCallbackParams) => {
                    if (
                      params.node.data &&
                      params.data.type === 'folder' &&
                      params.node.data &&
                      !params.data.group_id
                    )
                      return false;

                    return true;
                  }
                : true,
              minWidth: 330,
              suppressHeaderMenuButton: true,
              headerCheckboxSelection: true,
              sortable: false,
              comparator: (
                valueA: string | null | undefined,
                valueB: string | null | undefined,
                nodeA: IRowNode,
                nodeB: IRowNode,
                isDescending: boolean,
              ) => {
                if (valueA && valueB) {
                  // sort by folder first
                  if (
                    nodeA.data.type === 'folder' &&
                    nodeB.data.type !== 'folder'
                  ) {
                    return isDescending ? 1 : -1;
                  }
                  if (
                    nodeA.data.type !== 'folder' &&
                    nodeB.data.type === 'folder'
                  ) {
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
            },
      [
        isDragActive,
        dragItem,
        cellClassRules,
        isUploadActive,
        folderId,
        hardcodedTopFolders,
      ],
    );

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

      const mapOldOrderToNewData = selectedNodes.map((media) => {
        return media.data;
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

    /*
    React.useEffect(() => {
      if (gridRef && gridRef.current && gridRef.current.api) {
        gridRef.current.api.updateGridOptions({
          quickFilterText: searchText,
        });

        // get the result data of the quick filter and print it to the console
        const rowsAfterFilter: any[] = [];
        gridRef.current.api.forEachNodeAfterFilter((node: any) => {
          rowsAfterFilter.push(node.data);
        });

        if (typeof setMediaData !== 'undefined') {
          if (rowsAfterFilter.length > 1) {
            setMediaData(
              rowsAfterFilter.filter((row) => row.type !== 'folder'),
            );
          } else setMediaData(rowsAfterFilter);
        }
      }
      setTimeout(() => {
        if (gridRef && gridRef.current && gridRef.current.api && searchText) {
          gridRef.current.api.expandAll();
        }
      }, 301);
    }, [searchText]);
    */
    React.useEffect(() => {
      const onDragOver = (e: DragEvent) => {
        e.preventDefault();
        if (
          e.dataTransfer?.types.includes('Files') &&
          (typeof noUpload === 'undefined' || !noUpload)
        ) {
          if (
            (e.target as HTMLElement).classList.contains('folder') ||
            (e.target as HTMLElement).closest('.folder')
          ) {
            const folderEl = (e.target as HTMLElement).closest('.ag-row');
            if (folderEl) {
              const folder = gridRef.current?.api.getRowNode(
                folderEl.getAttribute('row-id') || '',
              );
              if (folder && folder.data) {
                setDragPlace(folder.data.name);
                setIsOnFolder(true);
                setFolderId(folder.data.id);
              }
            }
          } else if (
            !(e.target as HTMLElement)
              .closest('.ag-row')
              ?.classList.contains('ag-row-level-0')
          ) {
            const itemEl = (e.target as HTMLElement).closest('.ag-row');
            if (itemEl) {
              const item = gridRef.current?.api.getRowNode(
                itemEl.getAttribute('row-id') || '',
              );
              if (item && item.data) {
                const folder = gridRef.current?.api.getRowNode(
                  item.data.folderId || '',
                );
                if (folder && folder.data) {
                  setDragPlace(folder.data.name);
                  setIsOnFolder(true);
                  setFolderId(folder.data.id);
                }
              }
            }
          } else {
            setDragPlace('Media');
            setIsOnFolder(false);
            setFolderId(undefined);
          }
          setIsUploadActive(true);
        }
      };

      const onDragLeave = (e: DragEvent) => {
        e.preventDefault();
        setDragPlace('Media');
        setIsOnFolder(false);
        setFolderId(undefined);
        setIsUploadActive(false);
      };

      const onDragDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragPlace('Media');
        setIsOnFolder(false);
        setFolderId(undefined);
        setIsUploadActive(false);
      };
      const attachMediaModalContainer = document.getElementById(
        'attachMediaModalContainer',
      );
      const folderGrid = document.getElementById('folderGrid');
      if (attachMediaModalContainer && folderGrid) {
        attachMediaModalContainer.addEventListener('dragover', onDragOver);
        attachMediaModalContainer.addEventListener('dragleave', onDragLeave);
        attachMediaModalContainer.addEventListener('drop', onDragDrop);
        folderGrid.addEventListener('drop', onDragDrop);
      }
      return () => {
        if (folderGrid && attachMediaModalContainer) {
          attachMediaModalContainer.removeEventListener('dragover', onDragOver);
          attachMediaModalContainer.removeEventListener(
            'dragleave',
            onDragLeave,
          );
          attachMediaModalContainer.removeEventListener('drop', onDragDrop);
          folderGrid.removeEventListener('drop', onDragDrop);
        }
      };
    }, []);

    const onRowDragMove = useCallback(
      (event: RowDragMoveEvent) => {
        setIsDragActive(true);
        setDragItem(event.node.data);
        setPotentialParentForNode(event.api, event.overNode || null, {
          hardcodedTopFolders: hardcodedTopFolders || false,
          dragItem: event.node.data,
          potentialParent,
        });
      },
      [hardcodedTopFolders, potentialParent, setPotentialParentForNode],
    );

    const onRowDragLeave = useCallback(
      (event: any) => {
        // clear node to highlight
        setDragItem(null);
        setPotentialParentForNode(event.api, null, {
          hardcodedTopFolders: hardcodedTopFolders || false,
          dragItem: null,
          potentialParent,
        });
      },
      [hardcodedTopFolders, potentialParent, setPotentialParentForNode],
    );

    const onRowDragEnd = useCallback(
      async (event: any) => {
        setIsDragActive(false);
        if (!potentialParent) {
          return;
        }
        gridRef.current?.api.setGridOption('loading', true);
        const movingData = event.node.data;

        const oldData = {...event.node};
        const oldPath = movingData.groupName;
        // take new parent path from parent, if data is missing, means it's the root node,
        // which has no data.
        const newParentPath: string[] | string | null = potentialParent.data
          ? potentialParent.data.orgHierarchy || potentialParent.data.id
          : null;
        const newParentName: string = potentialParent.data
          ? potentialParent.data.name
          : '';
        const needToChangeParent = !arePathsEqual(
          newParentPath,
          movingData.orgHierarchy || movingData.group_id || null,
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
          const updatedRows: GridData[] = [];
          moveToPath(newParentPath, newParentName, oldData, updatedRows);
          //console.log('updatedRows', updatedRows);
          if (typeof onDragDropFunction !== 'undefined' && updatedRows[0]) {
            const res = await onDragDropFunction(updatedRows[0]);
            // const res = {success: true};
            if (res.success) {
              gridRef.current.api.applyServerSideTransactionAsync({
                route: [oldPath],
                remove: [movingData],
              });
              gridRef.current.api.applyServerSideTransactionAsync({
                route: [newParentName],
                add: updatedRows,
              });
              /*
              if (
                updatedRows &&
                (potentialParent.data || potentialParent.level === -1)
              ) {
                updatedRows.forEach((updatedRow) => {
                  if (updatedRow.id === movingData.id) {
                    updatedRow.group_id = potentialParent.data
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
            if (typeof setMediaData !== 'undefined')
              setMediaData(
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
              }
              */
            }
          }
        }

        // clear node to highlight

        gridRef.current?.api.setGridOption('loading', false);
        setPotentialParentForNode(event.api, null, {
          hardcodedTopFolders: hardcodedTopFolders || false,
          dragItem: null,
          potentialParent,
        });
      },
      [
        hardcodedTopFolders,
        onDragDropFunction,
        potentialParent,
        setPotentialParentForNode,
      ],
    );

    React.useEffect(() => {
      // resize listener to resize grid on window resize
      const resizeListener = () => {
        if (gridRef.current && gridRef.current.api) {
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
        const nodesToSelect: any[] = [];
        // unselect all nodes)
        gridRef.current.api.deselectAll();
        gridRef.current.api.forEachNode((node) => {
          if (
            node.data &&
            selectedMedia.find(
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
    }, [selectedMedia, gridRef.current?.api]);

    const sideBar = useMemo<
      SideBarDef | string | string[] | boolean | null
    >(() => {
      return {
        toolPanels: [
          {
            id: 'columns',
            labelDefault: 'Columns',
            labelKey: 'columns',
            iconKey: 'columns',
            toolPanel: 'agColumnsToolPanel',
            toolPanelParams: {
              suppressRowGroups: true,
              suppressValues: true,
              suppressPivots: true,
              suppressPivotMode: true,
              suppressColumnFilter: true,
              suppressColumnSelectAll: true,
              suppressColumnExpandAll: true,
            },
          },
        ],
        // defaultToolPanel: 'columns',
      };
    }, []);

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
              rowData={
                gridOptions?.rowModelType &&
                gridOptions.rowModelType === 'serverSide'
                  ? undefined
                  : rowData
              }
              sideBar={sideBar}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              autoGroupColumnDef={autoGroupColumnDef}
              suppressRowClickSelection
              suppressContextMenu
              // suppressMovableColumns
              suppressDragLeaveHidesColumns
              onColumnMoved={(event) => {
                // console.log('onColumnMoved', event, event.api.getColumnState());
                if (saveGridSettings) {
                  const columns = event.api.getColumnState();
                  saveGridSettings({
                    columnsSettings: columns.map((col, index) => {
                      return {
                        id: col.colId,
                        hidden: col.hide || false,
                        order: index + 1,
                      };
                    }),
                  });
                }
              }}
              onColumnEverythingChanged={(event) => {
                const columns = event.api.getColumnState();
                if (event.source === 'toolPanelUi') {
                  if (saveGridSettings) {
                    saveGridSettings({
                      columnsSettings: columns.map((col, index) => {
                        return {
                          id: col.colId,
                          hidden: col.hide || false,
                          order: index + 1,
                        };
                      }),
                    });
                  }
                }
              }}
              animateRows
              rowHeight={40}
              onRowDragMove={onRowDragMove}
              onRowDragLeave={onRowDragLeave}
              onRowDragEnd={onRowDragEnd}
              {...((typeof noSelect === 'undefined' || !noSelect) && {
                onSelectionChanged,
              })}
              getRowId={getRowId}
              {...(gridOptions || {
                treeData: true,
                getDataPath,
                // getRowId,
                rowSelection:
                  typeof noSelect === 'undefined' || !noSelect
                    ? 'multiple'
                    : undefined,
                groupSelectsChildren: true,
              })}
              {...(typeof gridOptions !== 'undefined' &&
              gridOptions.rowModelType === 'serverSide'
                ? {
                    maxConcurrentDatasourceRequests: 1,
                    blockLoadDebounceMillis: 1000,
                    pagination: gridOptions.pagination,
                    paginationPageSize: gridOptions.pagination
                      ? pageLimit
                      : undefined,
                    maxBlocksInCache: 5,
                    cacheBlockSize: pageLimit,
                    paginationPageSizeSelector: false,
                  }
                : {})}
            />
          }
          {typeof noUpload === 'undefined' || !noUpload ? (
            <div
              className={`dropFilesHere${isUploadActive ? ' dragActive' : ''}`}
            >
              <MemoCloudUpload className="memoCloud" />
              <div className="textContainer">
                <span>Drop files to upload them to</span>
                <span className="folderName">
                  <MemoFolder />
                  {dragPlace}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);

export default ListView;
