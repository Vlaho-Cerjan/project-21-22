import PhoneVerified from '@/src/components/phoneVerifiedView/phoneVerified';
import type {Metadata} from 'next';
import {Suspense} from 'react';

export default function Page() {
  return (
    <Suspense>
      <PhoneVerified />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Phone Verified',
  description: 'Your phone number has been verified',
};
