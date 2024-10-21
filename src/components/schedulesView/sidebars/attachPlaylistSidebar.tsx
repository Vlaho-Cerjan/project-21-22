import React from 'react';

import type {BackendPlaylistsData} from '@/src/constants/backendData';
import {backendPlaylistsData} from '@/src/constants/backendData';
import MemoCheckmark from '@/src/icons/checkmark';

import {ModalDivider} from '../../common/divider/divider';
import ModalSelectLabel from '../../common/modalSelectLabel/modalSelectLabel';
import ModalSelectLabelFuzzy from '../../common/modalSelectLabel/modalSelectLabelFuzzy';
import Sidebar from '../../common/sidebar/sidebar';
import SidebarContent from '../../common/sidebar/sidebarContent';
import SidebarFooter from '../../common/sidebar/sidebarFooter';
import SidebarHeader from '../../common/sidebar/sidebarHeader';

export default function AttachPlaylistSidebar({
  id,
  className,
  selectedDateTimes,
  open,
  setOpen,
  onSubmit,
}: {
  id: string;
  className: string;
  selectedDateTimes: {day: string; startTime: string; endTime: string}[];
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    playlist: BackendPlaylistsData | undefined;
    day: string;
    startTime: string;
    endTime: string;
  }) => void;
}) {
  const [playlist, setPlaylist] = React.useState<
    BackendPlaylistsData | undefined
  >(undefined);

  const [playlistsData, setPlaylistsData] = React.useState<
    BackendPlaylistsData[]
  >([]);

  const times = [
    {id: '2022-12-12T00:00:00', name: '12:00 AM', disabled: false},
    {id: '2022-12-12T01:00:00', name: '1:00 AM', disabled: false},
    {id: '2022-12-12T02:00:00', name: '2:00 AM', disabled: false},
    {id: '2022-12-12T03:00:00', name: '3:00 AM', disabled: false},
    {id: '2022-12-12T04:00:00', name: '4:00 AM', disabled: false},
    {id: '2022-12-12T05:00:00', name: '5:00 AM', disabled: false},
    {id: '2022-12-12T06:00:00', name: '6:00 AM', disabled: false},
    {id: '2022-12-12T07:00:00', name: '7:00 AM', disabled: false},
    {id: '2022-12-12T08:00:00', name: '8:00 AM', disabled: false},
    {id: '2022-12-12T09:00:00', name: '9:00 AM', disabled: false},
    {id: '2022-12-12T10:00:00', name: '10:00 AM', disabled: false},
    {id: '2022-12-12T11:00:00', name: '11:00 AM', disabled: false},
    {id: '2022-12-12T12:00:00', name: '12:00 PM', disabled: false},
    {id: '2022-12-12T13:00:00', name: '1:00 PM', disabled: false},
    {id: '2022-12-12T14:00:00', name: '2:00 PM', disabled: false},
    {id: '2022-12-12T15:00:00', name: '3:00 PM', disabled: false},
    {id: '2022-12-12T16:00:00', name: '4:00 PM', disabled: false},
    {id: '2022-12-12T17:00:00', name: '5:00 PM', disabled: false},
    {id: '2022-12-12T18:00:00', name: '6:00 PM', disabled: false},
    {id: '2022-12-12T19:00:00', name: '7:00 PM', disabled: false},
    {id: '2022-12-12T20:00:00', name: '8:00 PM', disabled: false},
    {id: '2022-12-12T21:00:00', name: '9:00 PM', disabled: false},
    {id: '2022-12-12T22:00:00', name: '10:00 PM', disabled: false},
    {id: '2022-12-12T23:00:00', name: '11:00 PM', disabled: false},
    {id: '2022-12-12T24:00:00', name: '12:00 AM', disabled: false},
  ];

  const daysData = [
    {
      id: '1',
      name: 'Monday',
      disabled: false,
      times: times.map((item) => {
        return {
          ...item,
          id: `${item.id}_1`,
        };
      }),
    },

    {
      id: '2',
      name: 'Tuesday',
      disabled: false,
      times: times.map((item) => {
        return {
          ...item,
          id: `${item.id}_2`,
        };
      }),
    },
    {
      id: '3',
      name: 'Wednesday',
      disabled: false,
      times: times.map((item) => {
        return {
          ...item,
          id: `${item.id}_3`,
        };
      }),
    },
    {
      id: '4',
      name: 'Thursday',
      disabled: false,
      times: times.map((item) => {
        return {
          ...item,
          id: `${item.id}_4`,
        };
      }),
    },
    {
      id: '5',
      name: 'Friday',
      disabled: false,
      times: times.map((item) => {
        return {
          ...item,
          id: `${item.id}_5`,
        };
      }),
    },
    {
      id: '6',
      name: 'Saturday',
      disabled: false,
      times: times.map((item) => {
        return {
          ...item,
          id: `${item.id}_6`,
        };
      }),
    },
    {
      id: '7',
      name: 'Sunday',
      disabled: false,
      times: times.map((item) => {
        return {
          ...item,
          id: `${item.id}_7`,
        };
      }),
    },
  ];

  const [days, setDays] = React.useState(daysData);

  const [day, setDay] = React.useState(
    days.find((item) => item.disabled === false),
  );

  const [startTime, setStartTime] = React.useState(
    day?.times.find((item) => item.disabled === false),
  );

  const [endTime, setEndTime] = React.useState(
    day?.times.slice(1).find((item) => item.disabled === false),
  );

  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setPlaylistsData(
      backendPlaylistsData.filter((item) => item.type !== 'folder'),
    );
  }, [backendPlaylistsData]);

  React.useEffect(() => {
    if (day) {
      setStartTime(day.times.find((item) => item.disabled === false));
      setEndTime(day.times.slice(1).find((item) => item.disabled === false));
    }
  }, [day]);

  React.useEffect(() => {
    if (!open) {
      setPlaylist(undefined);
      setDays(daysData);
      setDay(daysData[0]);
      setStartTime(daysData[0]?.times[0]);
      setEndTime(daysData[0]?.times[1]);
      setPlaylistsData(
        backendPlaylistsData.filter((item) => item.type !== 'folder'),
      );
      setError(false);
    } else if (selectedDateTimes.length > 0) {
      days.forEach((dayItem) => {
        const selectedDateTime = selectedDateTimes.filter(
          (item) => item.day === dayItem.id,
        );

        if (selectedDateTime.length > 0) {
          const startTimeIndexes = selectedDateTime.map((item) =>
            dayItem.times.findIndex(
              (time) => time.id === `${item.startTime}_${dayItem.id}`,
            ),
          );

          const endTimeIndexes = selectedDateTime.map((item) =>
            dayItem.times
              .slice(1)
              .findIndex((time) => time.id === `${item.endTime}_${dayItem.id}`),
          );

          const timeRanges = startTimeIndexes
            .map((item, index) => {
              return dayItem.times.slice(
                item,
                (endTimeIndexes[index] ?? 0) + 1,
              );
            })
            .flat();

          const tempDay = dayItem;

          tempDay.times.map((time) => {
            const tempTime = time;
            if (timeRanges.find((item) => item.id === tempTime.id)) {
              tempTime.disabled = true;
            } else {
              tempTime.disabled = false;
            }
            return tempTime;
          });

          setDays((prevDays) => {
            return prevDays.map((prevDay) => {
              if (prevDay.id === tempDay.id) {
                return tempDay;
              }
              return prevDay;
            });
          });
        }
      });
      if (day) {
        const enabledTimes = day.times.filter(
          (item) => item.disabled === false,
        );
        setStartTime(enabledTimes[0]);
        setEndTime(enabledTimes[1]);
      }
    }
  }, [open]);

  return (
    <div>
      <Sidebar
        className="attachPlaylistSidebarContainer"
        sidebarClasses={`attachPlaylistSidebar${id} ${className}`}
        sidebarOpen={open}
        setSidebarOpen={setOpen}
      >
        <SidebarHeader
          title="Attach Playlist"
          description="Schedule a playlist to run when you want"
        />
        <SidebarContent>
          <form className="formContainer">
            <div className="dataContainer">
              <ModalSelectLabelFuzzy
                inputTestId="playlist"
                labelText="Playlist"
                labelProps={{
                  htmlFor: 'playlist',
                }}
                errorText="Please select playlist"
                selectProps={{
                  id: 'playlist',
                  name: 'playlist',
                  required: true,
                  value: playlist?.id || '',
                  onChange: (e) => {
                    const data = playlistsData.find(
                      (item) => item.id === e.currentTarget.value,
                    );
                    setPlaylist(data || undefined);
                  },
                }}
                data={[{id: '', name: 'Select Playlist'}, ...playlistsData]}
                dropdownId={`playlistDropdown_${id}`}
                searchData={playlistsData}
                searchKeys={['name']}
                displayValue="name"
                display={{
                  topLeft: 'name',
                }}
                displayStartLimit={5}
                value={playlist || null}
                setValue={(tempData) => {
                  const data = playlistsData.find(
                    (item) => item.id === tempData.id,
                  );
                  setPlaylist(data || undefined);
                }}
                dataName="Playlist"
              />
              <ModalSelectLabel
                labelText="Day"
                selectProps={{
                  name: 'day',
                  value: day?.name,
                  onChange: (e) => {
                    const selectedDay = days.find(
                      (option) => option.id === e.currentTarget.value,
                    );
                    if (selectedDay) setDay(selectedDay);
                  },
                }}
                data={days}
              />
              <div className="row">
                <ModalSelectLabel
                  labelText="Start Time"
                  selectProps={{
                    name: 'startTime',
                    value: startTime?.name,
                    onChange: (e) => {
                      const selectedTimeIndex = day?.times.findIndex(
                        (option) => option.id === e.currentTarget.value,
                      );
                      if (selectedTimeIndex) {
                        setStartTime(day?.times[selectedTimeIndex]);
                      }
                    },
                  }}
                  data={day?.times || []}
                />
                <ModalSelectLabel
                  labelText="End Time"
                  selectProps={{
                    name: 'endTime',
                    value: endTime?.name,
                    onChange: (e) => {
                      const selectedTime = day?.times
                        .slice(1)
                        .find((option) => option.id === e.currentTarget.value);
                      if (selectedTime) setEndTime(selectedTime);
                    },
                  }}
                  data={day?.times || []}
                />
              </div>
            </div>
          </form>
        </SidebarContent>
        <ModalDivider />
        <SidebarFooter
          setOpen={setOpen}
          isError={error}
          setIsError={setError}
          sidebarClass={`attachPlaylistSidebar${id}`}
          buttonText="Attach Playlist"
          buttonIcon={<MemoCheckmark />}
          successText="Playlist attached successfully"
          onSubmit={() => {
            setOpen(false);
            onSubmit({
              playlist,
              day: day?.id || '',
              startTime: startTime?.id.split('_')[0] || '',
              endTime: endTime?.id.split('_')[0] || '',
            });
            return Promise.resolve('success');
          }}
        />
      </Sidebar>
    </div>
  );
}
