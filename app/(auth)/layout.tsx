'use client';

import '@/src/styles/global-auth.css';
import '@/src/styles/signup/signup.css';

import React, {Suspense} from 'react';
import {useWindowSize} from 'usehooks-ts';

import Header from '@/src/components/auth/common/header/header';
import SignInModal from '@/src/components/auth/signInModal/signInModal';
import {ResizedAdaptiveImage} from '@/src/lib/adaptiveImage';
import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';

export default function AuthLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const {width} = useWindowSize();
  const [showImage, setShowImage] = React.useState(true);
  const [inputError, setInputError] = React.useState(false);

  React.useEffect(() => {
    if (width && width <= 992) {
      setShowImage(false);
    } else {
      setShowImage(true);
    }
  }, [width]);

  useDidUpdateEffect(() => {
    if (!open) {
      setInputError(false);
    }
  }, [open]);

  return (
    <div className="bgContainer">
      <section className="mainContainer">
        <div className="contentContainer">
          <Header setOpen={setOpen} />
          {children}
        </div>
        {showImage ? (
          <ResizedAdaptiveImage
            src="https://media.project-api.tv/api/image/6ca2aad0-024e-11ef-b71f-03978373c1e4/image.jpg"
            // src="/assets/images/signup/coffee-swift.png"
            alt="Coffee Swift"
            loading="eager"
            fetchPriority="high"
          />
        ) : null}
        <Suspense>
          <SignInModal
            open={open}
            setOpen={setOpen}
            inputError={inputError}
            setInputError={setInputError}
          />
        </Suspense>
      </section>
    </div>
  );
}
