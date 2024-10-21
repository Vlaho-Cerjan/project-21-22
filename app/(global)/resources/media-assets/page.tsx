import type {Metadata} from 'next';

import MediaAssetsPage from '@/src/components/mediaAssetsView/mediaAssetsPage';

export const metadata: Metadata = {
  title: 'Media Assets Page',
  description: 'Media Assets Page',
};

export default function Page() {
  return <MediaAssetsPage />;
}
