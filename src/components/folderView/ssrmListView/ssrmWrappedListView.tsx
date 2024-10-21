import type {ColDef, GridOptions} from 'ag-grid-enterprise';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import type {GridData} from '@/types/gridData';
import ListView from './ssrmListView';

export default function SsrmWrappedListView({
  gridRef,
  ...props
}: {
  gridRef: any;
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  setMediaData?: React.Dispatch<React.SetStateAction<any[]>>;
  selectedMedia: any[];
  noSelect?: boolean;
  onItemDeSelect: (items: any[]) => void;
  onMediaEdit: (item: any) => void;
  noUpload?: boolean;
  type?: string;
  columnDefsData?: ColDef[];
  groupColumnDefData?: ColDef;
  gridOptions?: GridOptions;
  hardcodedTopFolders?: boolean;
  saveGridSettings?: (gridSettings: GridSettings) => void;
  pageLimit?: number;
  onDragDropFunction?: (updatedRows: GridData[]) => Promise<{
    success: boolean;
  }>;
}) {
  const {
    data,
    setData,
    setMediaData,
    selectedMedia,
    onItemDeSelect,
    onMediaEdit,
    noSelect,
    noUpload,
    type,
    columnDefsData,
    gridOptions,
    hardcodedTopFolders,
    saveGridSettings,
    pageLimit,
    groupColumnDefData,
    onDragDropFunction,
  } = props;

  return (
    <ListView
      ref={gridRef}
      data={data}
      setData={setData}
      noSelect={noSelect}
      setMediaData={setMediaData}
      selectedMedia={selectedMedia}
      onItemDeSelect={onItemDeSelect}
      onMediaEdit={onMediaEdit}
      noUpload={noUpload}
      type={type}
      columnDefsData={columnDefsData}
      groupColumnDefData={groupColumnDefData}
      gridOptions={gridOptions}
      hardcodedTopFolders={hardcodedTopFolders}
      saveGridSettings={saveGridSettings}
      pageLimit={pageLimit}
      onDragDropFunction={onDragDropFunction}
    />
  );
}
