'use client';

import React from 'react';

import Description from '@/src/components/common/description/description';
import Title from '@/src/components/common/title/title';

export default function Headers({page}: {page: number}) {
  const [title, setTitle] = React.useState('New Order');
  const [description, setDescription] = React.useState(
    'How many Project Players does this venue require?',
  );
  const [childStep, setChildStep] = React.useState(1);

  React.useEffect(() => {
    if (page === 1) {
      setTitle('New Order');
      setDescription('How many Project Players does this venue require?');
    }
    if (page === 2) {
      setTitle('Select Venue');
      setDescription('Select the venue for this order:');
    }
    if (page === 3) {
      setTitle('New Order');
      setDescription('Enter the shipping and billing address for this order:');
    } else if (page === 4) {
      setTitle('New Order');
      setDescription('Review your order before submitting:');
    } else if (page === 5) {
      setTitle('Thank You');
      setDescription('Your order has been submitted.');
    }
    setTimeout(() => {
      setChildStep(page);
    }, 150);
  }, [page]);

  return (
    <div className={`orderHeaders step${page}`}>
      <div className={`step step${childStep}`}>
        <Title data-testid="orderHeaderTitle" className="bold big">
          {title}
        </Title>
        <Description data-testid="orderHeaderDescription" className="big">
          {description}
        </Description>
      </div>
    </div>
  );
}
