/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import React from 'react';

import type {BackendScheduleData} from '@/src/constants/backendData';
import {backendSchedulesData} from '@/src/constants/backendData';

import SchedulesView from './scheduleView';

export default function SchedulesPage() {
  const [rootData, setRootData] =
    React.useState<BackendScheduleData[]>(backendSchedulesData);

  const [_signageSetsData, setSchedulesData] = React.useState(
    rootData.filter((item) => item.orgHierarchy.length === 1),
  );
  const [selectedItems, setSelectedItems] = React.useState<
    BackendScheduleData[]
  >([]);
  const onItemDeSelect = (items: BackendScheduleData[]) => {
    setSelectedItems(items);
  };

  return (
    <div className="flexColumnContainer">
      <SchedulesView
        rootData={rootData}
        setRootData={setRootData}
        // mediaData={signageSetsData as any}
        setMediaData={setSchedulesData}
        onItemDeSelect={onItemDeSelect}
        selectedItems={selectedItems}
        placeName="Schedules"
        type="page"
      />
    </div>
  );
}
