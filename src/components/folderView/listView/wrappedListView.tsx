import type {ColDef, GridOptions} from 'ag-grid-enterprise';

import type {GridSettings} from '@/src/store/slices/gridSlice';
import ListView from './listView';

export default function WrappedListView({
  gridRef,
  ...props
}: {
  gridRef: any;
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  setMediaData?: React.Dispatch<React.SetStateAction<any[]>>;
  selectedMedia: any[];
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
}) {
  const {
    data,
    setData,
    setMediaData,
    selectedMedia,
    onItemDeSelect,
    onMediaEdit,
    noUpload,
    type,
    columnDefsData,
    gridOptions,
    hardcodedTopFolders,
    saveGridSettings,
    pageLimit,
    groupColumnDefData,
  } = props;

  return (
    <ListView
      ref={gridRef}
      data={data}
      setData={setData}
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
    />
  );
}
