import '@/src/styles/main/main.css';

import type {Metadata} from 'next';
import React from 'react';

import MainNav from '@/src/components/nav/mainNav';

export const metadata: Metadata = {
  title: {
    template: '%s | Project Portal',
    default: 'Project Portal',
  },
};
export default function GeneralLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mainContainer">
      <div id="header" className="header">
        <MainNav />
      </div>
      <div className="container">{children}</div>
    </section>
  );
}
