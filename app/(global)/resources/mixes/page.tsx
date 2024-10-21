import type {Metadata} from 'next';

import MixesPage from '@/src/components/mixesView/mixes';

export const metadata: Metadata = {
  title: 'Mixes',
  description: 'Mixes',
};

export default function Page() {
  return <MixesPage />;
}
