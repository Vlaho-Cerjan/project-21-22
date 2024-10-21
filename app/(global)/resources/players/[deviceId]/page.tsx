import type {Metadata} from 'next';

import EditDevice from '@/src/components/networkView/editDevice';

export const metadata: Metadata = {
  title: 'Edit Device',
};

export default function EditDevicePage({
  params,
}: {
  params: {
    deviceId: string;
  };
}) {
  return <EditDevice params={params} />;
}
