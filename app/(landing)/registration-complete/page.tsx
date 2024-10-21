import RegistrationComplete from '@/src/components/registrationCompleteView/registrationComplete';
import type {Metadata} from 'next';

export default function Page() {
  return <RegistrationComplete />;
}

export const metadata: Metadata = {
  title: 'Registration Complete',
  description: 'Your registration is complete',
};
