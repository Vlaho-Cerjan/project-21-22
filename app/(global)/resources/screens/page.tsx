import UserScreensNew from '@/src/components/screensView/screensNew';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Screens Page',
  description: 'Page for managing screens for Project Portal Users.',
};

export default function ConversionPage() {
  return <UserScreensNew />;
}
