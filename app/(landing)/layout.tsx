'use client';

import '@/src/styles/landing/landing.css';

import React, {Suspense} from 'react';

import IconButton from '@/src/components/common/iconButton/iconButton';
import MemoProjectLogoBig from '@/src/icons/project-logo-big';
import MemoQuestion from '@/src/icons/question';

export default function LandingLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mainContainer landingMainContainer">
      <div className="headerContainer">
        <div className="headerWrapper">
          <div className="logo">
            <MemoProjectLogoBig aria-label="Project logo" />
          </div>
          <div className="helpContainer">
            <IconButton icon={<MemoQuestion />} />
          </div>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </section>
  );
}
