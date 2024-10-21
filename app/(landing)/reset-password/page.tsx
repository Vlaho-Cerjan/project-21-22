import ResetPassword from '@/src/components/resetPasswordView/resetPassword';
import type {Metadata} from 'next';
import {Suspense} from 'react';

export default function Page() {
  return (
    <Suspense>
      <ResetPassword />
    </Suspense>
  );
}

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password',
};
