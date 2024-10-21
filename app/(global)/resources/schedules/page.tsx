import type {Metadata} from 'next';

import SchedulesPage from '@/src/components/schedulesView/schedulesNew';

export const metadata: Metadata = {
  title: 'Schedules',
  description: 'Schedules Page',
};

export default function Page() {
  return <SchedulesPage />;
}
