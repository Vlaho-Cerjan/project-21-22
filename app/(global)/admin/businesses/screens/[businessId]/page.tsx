import type {Metadata} from 'next';

import AdminScreensNew from '@/src/components/adminScreensView/adminScreensNew';

export const metadata: Metadata = {
  title: 'Orders Page',
  description:
    'Page for reviewing orders from businesses and approving or denying them.',
};

export default function AdminOrdersPage({
  params,
}: {
  params: {
    businessId: string;
  };
}) {
  return <AdminScreensNew params={params} />;
}
