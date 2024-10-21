import AdminVenues from '@/src/components/adminVenuesView/adminVenues';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Venues',
  description: 'Admin page for managing venues for a certain business.',
};

export default function EditDevicePage({
  params,
}: {
  params: {
    businessId: string;
  };
}) {
  return <AdminVenues params={params} />;
}
