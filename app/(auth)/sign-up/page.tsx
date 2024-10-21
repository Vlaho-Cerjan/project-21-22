import type {Metadata} from 'next';

import SignUp from '@/src/components/auth/signUpView/signUp';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Sign up for an account',
};

export default function Page() {
  return <SignUp />;
}
