'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import React from 'react';
import Description from '../common/description/description';
import StyledLink from '../common/link/link';
import Title from '../common/title/title';

export const UnauthorizedView = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    if (router)
      setTimeout(() => {
        router.push('/');
      }, 5000);
  }, [router]);

  return (
    <div className="flexCenteredContainer">
      <Title className="thinH1">Unauthorized</Title>
      <Description className="huge">
        You are not authorized to view{' '}
        <StyledLink className="huge" href={searchParams.get('redirect') || ''}>
          this
        </StyledLink>{' '}
        page. Redirecting you to the home page...
      </Description>
    </div>
  );
};
