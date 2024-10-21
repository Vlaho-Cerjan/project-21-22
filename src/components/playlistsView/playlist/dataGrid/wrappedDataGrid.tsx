import type {BackendVideoData} from '@/src/constants/backendData';

import PlaylistDataGrid from './playlistDataGrid';

export default function WrappedDataGrid({
  gridRef,
  ...props
}: {
  searchText: string;
  gridRef: any;
  data: BackendVideoData[];
  selectedVideos: BackendVideoData[];
  onItemDeSelect: (items: BackendVideoData[]) => void;
}) {
  const {searchText, data, selectedVideos, onItemDeSelect} = props;

  return (
    <PlaylistDataGrid
      searchText={searchText}
      ref={gridRef}
      data={data}
      selectedVideos={selectedVideos}
      onItemDeSelect={onItemDeSelect}
    />
  );
}
