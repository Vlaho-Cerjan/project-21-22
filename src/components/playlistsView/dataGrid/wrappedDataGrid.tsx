import type {BackendPlaylistsData} from '@/src/constants/backendData';

import PlaylistsDataGrid from './playlistsDataGrid';

export default function WrappedDataGrid({
  gridRef,
  ...props
}: {
  gridRef: any;
  searchText: string;
  data: BackendPlaylistsData[];
  setData: React.Dispatch<React.SetStateAction<BackendPlaylistsData[]>>;
  setBackendPlaylistsData: React.Dispatch<
    React.SetStateAction<BackendPlaylistsData[]>
  >;
  selectedPlaylists: BackendPlaylistsData[];
  onItemDeSelect: (items: BackendPlaylistsData[]) => void;
  onPlaylistsEdit: (item: BackendPlaylistsData) => void;
}) {
  const {
    data,
    setData,
    setBackendPlaylistsData,
    selectedPlaylists,
    onItemDeSelect,
    onPlaylistsEdit,
    searchText,
  } = props;

  return (
    <PlaylistsDataGrid
      ref={gridRef}
      data={data}
      searchText={searchText}
      setData={setData}
      setBackendPlaylistsData={setBackendPlaylistsData}
      selectedPlaylists={selectedPlaylists}
      onItemDeSelect={onItemDeSelect}
      onPlaylistsEdit={onPlaylistsEdit}
    />
  );
}
