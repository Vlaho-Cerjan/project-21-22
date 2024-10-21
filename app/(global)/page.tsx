import type {Metadata} from 'next';

// `app/page.tsx` is the UI for the `/` URL
export default function Page() {
  return <h1>Hello, Home page!</h1>;
}

export const metadata: Metadata = {
  title: 'Dashboard',
};
