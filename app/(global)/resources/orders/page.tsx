import Order from '@/src/components/ordersView/orders';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Orders Page',
  description: 'Page for reviewing orders for Project devices.',
};

export default function ConversionPage() {
  return <Order />;
}
