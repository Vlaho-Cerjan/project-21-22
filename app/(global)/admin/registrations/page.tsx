import type {Metadata} from 'next';

import Registration from '@/src/components/adminRegistrationView/registration';

export const metadata: Metadata = {
  title: 'Registrations Page',
  description: 'Administrative page for viewing and managing registrations',
};

export default function ConversionPage() {
  return <Registration />;
}
