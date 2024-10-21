import type {Metadata} from 'next';

import AdminOrder from '@/src/components/adminOrdersView/orders';

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
  return <AdminOrder params={params} />;
}
