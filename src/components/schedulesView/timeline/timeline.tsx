'use client';

import type {Channel, Program} from 'planby';
import {ChannelBox, Epg, Layout, useEpg} from 'planby';
import React from 'react';

import {PlanbyTimeline} from './planbyTimeline';
import CustomProgramItem from './program';

interface ChannelItemProps {
  channel: Channel;
}

const ChannelItem = ({channel}: ChannelItemProps) => {
  const {position, title} = channel;
  return (
    <ChannelBox className="dayTitle" {...position}>
      <div>{title}</div>
    </ChannelBox>
  );
};

const Timeline = ({epg}: {epg: Program[]}) => {
  const channels = React.useMemo(
    () => [
      {
        uuid: '1',
        type: 'channel',
        title: 'Mon',
        logo: 'Monday',
      },
      {
        uuid: '2',
        type: 'channel',
        title: 'Tue',
        logo: 'Tuesday',
      },
      {
        uuid: '3',
        type: 'channel',
        title: 'Wed',
        logo: 'Wednesday',
      },
      {
        uuid: '4',
        type: 'channel',
        title: 'Thu',
        logo: 'Thursday',
      },
      {
        uuid: '5',
        type: 'channel',
        title: 'Fri',
        logo: 'Friday',
      },
      {
        uuid: '6',
        type: 'channel',
        title: 'Sat',
        logo: 'Saturday',
      },
      {
        uuid: '7',
        type: 'channel',
        title: 'Sun',
        logo: 'Sunday',
      },
    ],
    [],
  );

  const {getEpgProps, getLayoutProps} = useEpg({
    epg,
    channels,
    dayWidth: 2175,
    itemHeight: 75,
    startDate: new Date('2022-12-12T00:00:00'),
    theme: {
      primary: {
        600: '#1a202c',
        900: '#fff',
      },
      grey: {300: '#fff'},
      white: '#fff',
      green: {
        300: '#2C7A7B',
      },
      loader: {
        teal: '#5DDADB',
        purple: '#3437A2',
        pink: '#F78EB6',
        bg: '#fff',
      },
      scrollbar: {
        border: '#ffffff',
        thumb: {
          bg: '#e1e1e1',
        },
      },
      gradient: {
        blue: {
          300: '#002eb3',
          600: '#002360',
          900: '#051937',
        },
      },
      text: {
        grey: {
          300: '#323234',
          500: '#fff',
        },
      },
      timeline: {
        divider: {
          bg: '#718096',
        },
      },
    },
  });

  return (
    <div
      style={{
        flexGrow: 1,
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flexGrow: 1,
        }}
      >
        <Epg {...getEpgProps()}>
          <Layout
            {...getLayoutProps()}
            sidebarWidth={125}
            renderTimeline={(props) => <PlanbyTimeline {...props} />}
            renderProgram={({program, ...rest}) => (
              <CustomProgramItem
                key={program.data.id}
                program={program}
                {...rest}
              />
            )}
            renderChannel={({channel}) => (
              <ChannelItem key={channel.uuid} channel={channel} />
            )}
          />
        </Epg>
      </div>
    </div>
  );
};

export default Timeline;
