import {AgGridReact} from 'ag-grid-react';

export const showNoRows = (
  gridRef: React.MutableRefObject<AgGridReact | null> | undefined,
) => {
  setTimeout(() => {
    if (gridRef && gridRef.current && gridRef.current.api)
      gridRef.current.api.showNoRowsOverlay();
  }, 250);
};

export const hideNoRows = (
  gridRef: React.MutableRefObject<AgGridReact | null> | undefined,
) => {
  if (gridRef && gridRef.current && gridRef.current.api)
    gridRef.current.api.hideOverlay();
};
