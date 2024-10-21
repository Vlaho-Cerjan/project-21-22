import dynamic from 'next/dynamic';
import React from 'react';

import MemoClockCheck from '@/src/icons/clock-check';
import MemoClockCross from '@/src/icons/clock-cross';
import MemoSchedule from '@/src/icons/schedule';
import MemoScheduleCross from '@/src/icons/schedule-cross';

import NoStyleButton from '../../common/button/noStyleButton';
import DateTimePicker from './dateTimePicker';

const RcDropdownLazy = dynamic(() => import('rc-dropdown'), {ssr: false});

export default function Dates({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startDateOnly,
  setStartDateOnly,
  endDateOnly,
  setEndDateOnly,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
}: {
  startDate: Date | null;
  setStartDate: React.Dispatch<React.SetStateAction<Date | null>>;
  endDate: Date | null;
  setEndDate: React.Dispatch<React.SetStateAction<Date | null>>;
  startDateOnly: string;
  setStartDateOnly: React.Dispatch<React.SetStateAction<string>>;
  endDateOnly: string;
  setEndDateOnly: React.Dispatch<React.SetStateAction<string>>;
  startTime: {id: string; name: string};
  setStartTime: React.Dispatch<
    React.SetStateAction<{id: string; name: string}>
  >;
  endTime: {id: string; name: string};
  setEndTime: React.Dispatch<React.SetStateAction<{id: string; name: string}>>;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const closeDropdown = (e: Event) => {
      if (
        (e.target as HTMLElement).classList.contains('datesDropdown') ||
        (e.target as HTMLElement).closest('.datesDropdown') ||
        (e.target as HTMLElement).classList.contains('react-datepicker') ||
        (e.target as HTMLElement).closest('.react-datepicker') ||
        (e.target as HTMLElement).classList.contains(
          'react-datepicker__day ',
        ) ||
        (e.target as HTMLElement).closest('.react-datepicker__day ')
      ) {
        return;
      }
      if (
        !(e.target as HTMLElement).classList.contains('rc-dropdown') &&
        !(e.target as HTMLElement).closest('.rc-dropdown') &&
        open
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', closeDropdown);
      document.addEventListener('touchstart', closeDropdown);
    }
    return () => {
      document.removeEventListener('click', closeDropdown);
      document.removeEventListener('touchstart', closeDropdown);
    };
  }, [open]);

  return (
    <div className="datesDropdown">
      <RcDropdownLazy
        visible={open}
        overlayClassName="datesDropdownOverlay"
        overlay={
          <DateTimePicker
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            setStartDateOnly={setStartDateOnly}
            setEndDateOnly={setEndDateOnly}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
          />
        }
      >
        <div className="datesTimesContainer">
          <NoStyleButton
            onClick={(e) => {
              e.preventDefault();
              setOpen(!open);
            }}
            className="dateTimeRangeButton"
          >
            <div className="dateTimeContainer">
              <div className="dateContainer startDate">
                <MemoSchedule />
                <span>Start {startDateOnly || 'Today'}</span>
              </div>
              <div className="timeContainer startTime">
                <MemoClockCheck />
                <span>From {startTime.name || 'All Day'}</span>
              </div>
            </div>
            <div className="dateTimeContainer">
              <div className="dateContainer endDate">
                <MemoScheduleCross />
                <span>End {endDateOnly || 'Never'}</span>
              </div>
              <div className="timeContainer endTime">
                <MemoClockCross />
                <span>To {endTime.name || 'All Day'}</span>
              </div>
            </div>
          </NoStyleButton>
        </div>
      </RcDropdownLazy>
    </div>
  );
}
