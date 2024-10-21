import type {Metadata} from 'next';

import SignageSetsPage from '@/src/components/signageSetsView/signageSetsNew';

export const metadata: Metadata = {
  title: 'Signage Sets',
  description: 'Signage Sets',
};

export default function Page() {
  return <SignageSetsPage />;
}
