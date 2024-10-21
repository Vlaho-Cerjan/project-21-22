import {UnauthorizedView} from '@/src/components/unauthorizedView/unauthorized';
import type {Metadata} from 'next';

export default function Page() {
  return <UnauthorizedView />;
}

export const metadata: Metadata = {
  title: 'Unauthorized',
  description:
    'Page where unauthorized users are redirected to when they try to access restricted pages.',
};
