import {DocumentationComponent} from '@/src/components/documentationView/documentation';
import {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Documentation',
  description: 'Documentation for Project Portal',
};

export default function Page() {
  return <DocumentationComponent />;
}
