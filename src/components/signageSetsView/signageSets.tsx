/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';

import type {BackendSignageData} from '@/src/constants/backendData';
import {backendSignageData} from '@/src/constants/backendData';

import SignageView from './signageView';

export default function SignageSetsPage() {
  const [rootData, setRootData] =
    React.useState<BackendSignageData[]>(backendSignageData);
  const [_signageSetsData, setSignageSetsData] = React.useState(
    rootData.filter((item) => item.orgHierarchy.length === 1),
  );
  const [selectedItems, setSelectedItems] = React.useState<
    BackendSignageData[]
  >([]);
  const onItemDeSelect = (items: BackendSignageData[]) => {
    setSelectedItems(items);
  };

  return (
    <div className="flexColumnContainer">
      <SignageView
        rootData={rootData}
        setRootData={setRootData}
        // mediaData={signageSetsData}
        setMediaData={setSignageSetsData}
        onItemDeSelect={onItemDeSelect}
        selectedItems={selectedItems}
        placeName="Signage Sets"
        type="page"
      />
    </div>
  );
}
