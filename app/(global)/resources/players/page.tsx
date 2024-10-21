import type {Metadata} from 'next';

import DeviceNetwork from '@/src/components/networkView/network';

export const metadata: Metadata = {
  title: 'Network Devices',
};

export default function NetworkDevicesPage() {
  return <DeviceNetwork />;
}
