import type {Metadata} from 'next';

import PlaylistsPage from '@/src/components/playlistsView/playlistsNew';

export const metadata: Metadata = {
  title: 'Playlists',
  description: 'Playlists',
};

export default function Page() {
  return <PlaylistsPage />;
}
