import Venues from '@/src/components/venuesView/venues';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Venues',
  description: 'Venues',
};

export default function NetworkDevicesPage() {
  return <Venues />;
}
