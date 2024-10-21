import EmailVerification from '@/src/components/emailVerificationView/emailVerification';
import type {Metadata} from 'next';
import {Suspense} from 'react';

export default function Page() {
  return (
    <Suspense>
      <EmailVerification />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Email Verification',
  description: 'Verify your email address',
};
