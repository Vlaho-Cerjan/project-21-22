import Business from '@/src/components/adminBusinessesView/businesses';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Businesses Page',
  description: 'Administrative page for viewing and managing businesses',
};

export default function BusinessesPage() {
  return <Business />;
}
