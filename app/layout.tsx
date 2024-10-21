'use client';

import '@/src/styles/common/common.css';
import '@/src/styles/global-all.css';
import '@/src/styles/normalize.css';
import 'dotenv/config';
import 'rc-dropdown/assets/index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';

import dynamic from 'next/dynamic';
import {Outfit} from 'next/font/google';
// import function to register Swiper custom elements
import {AppProgressBar as ProgressBar} from 'next-nprogress-bar';
import React, {Suspense} from 'react';
import {Slide} from 'react-toastify';

import EnumProvider from '@/src/store/providers/enumProvider';
import {LoadingProvider} from '@/src/store/providers/loadingProvider';
import NextAuthProvider from '@/src/store/providers/nextAuthProvider';
import ReduxProvider from '@/src/store/reduxProvider';
import {AppConfig} from '@/src/utils/AppConfig';

// If loading a variable font, you don't need to specify the font weight
const outfit = Outfit({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--ag-font-family',
});

const ToastContainerLazy = dynamic(
  () => import('react-toastify').then((mod) => mod.ToastContainer),
  {ssr: false},
);

export default function GlobalLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const resizeOps = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`,
      );
      document.documentElement.style.setProperty(
        '--vw',
        `${window.innerWidth * 0.01}px`,
      );
    };

    resizeOps();
    window.addEventListener('resize', resizeOps);

    return () => {
      window.removeEventListener('resize', resizeOps);
    };
  }, []);

  return (
    <html
      data-testid="html"
      lang={AppConfig.locale}
      className={`${outfit.className} ${outfit.variable}`}
    >
      <body>
        <NextAuthProvider>
          <ReduxProvider>
            <EnumProvider>
              <LoadingProvider>
                <main>{children}</main>
                <ToastContainerLazy
                  limit={3}
                  transition={Slide}
                  position="top-left"
                  theme="colored"
                />
                <Suspense>
                  <ProgressBar
                    height="3px"
                    color="#0070e6"
                    disableAnchorClick={true}
                    options={{showSpinner: false}}
                    shallowRouting
                  />
                </Suspense>
              </LoadingProvider>
            </EnumProvider>
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
