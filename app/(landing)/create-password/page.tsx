import CreatePassword from '@/src/components/createPasswordView/createPassword';
import type {Metadata} from 'next';
import {Suspense} from 'react';

export default function Page() {
  return (
    <Suspense>
      <CreatePassword />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Create Password',
  description: 'Create a password for your account',
};
