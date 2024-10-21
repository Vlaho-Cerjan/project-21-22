import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from 'react-datepicker';

import {timeOptions} from '@/src/constants/timeOptions';
import MemoClearDark from '@/src/icons/clear-dark';

import ClearButton from '../../common/button/clearButton';
import Label from '../../common/label/label';
import ModalSelectLabel from '../../common/modalSelectLabel/modalSelectLabel';

export default function DateTimePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  setStartDateOnly,
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
  setStartDateOnly: React.Dispatch<React.SetStateAction<string>>;
  setEndDateOnly: React.Dispatch<React.SetStateAction<string>>;
  startTime: {id: string; name: string};
  setStartTime: React.Dispatch<
    React.SetStateAction<{id: string; name: string}>
  >;
  endTime: {id: string; name: string};
  setEndTime: React.Dispatch<React.SetStateAction<{id: string; name: string}>>;
}) {
  return (
    <div className="dateTimePickerContainer">
      <div className="dateRangeHeader">
        <Label htmlFor="startDateTimePicker">Date Range</Label>
        <div
          // if start date is todays date
          className={`clearButtonContainer${
            (startDate &&
              startDate.toLocaleDateString() !==
                new Date().toLocaleDateString()) ||
            endDate
              ? ' active'
              : ''
          }`}
        >
          <ClearButton
            onClick={() => {
              setStartDate(null);
              setEndDate(null);
              setStartDateOnly('');
              setEndDateOnly('');
            }}
          >
            Clear Dates
            <MemoClearDark />
          </ClearButton>
        </div>
      </div>
      <DatePicker
        wrapperClassName="startDateTimePicker"
        inline
        shouldCloseOnSelect={false}
        onChange={(dates) => {
          const startDateOnlyData = dates[0]?.toLocaleDateString(['en-US'], {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          });
          const endDateOnlyData = dates[1]?.toLocaleDateString(['en-US'], {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          });
          setStartDate(dates[0]);
          setEndDate(dates[1]);
          setStartDateOnly(startDateOnlyData || '');
          setEndDateOnly(endDateOnlyData || '');
        }}
        selectsRange
        selected={startDate}
        startDate={startDate || new Date()}
        endDate={endDate || new Date()}
        dateFormat="MMM d, yyyy-HH:mm"
      />
      <div className="timesContainer">
        <ModalSelectLabel
          noError
          labelText="Start Time"
          selectProps={{
            name: 'startTime',
            value: startTime.name,
            onChange: (e) => {
              const selectedTime = timeOptions.find(
                (option) => option.id === e.currentTarget.value,
              );
              if (selectedTime) setStartTime(selectedTime);
            },
          }}
          data={timeOptions}
        />
        <ModalSelectLabel
          noError
          labelText="End Time"
          selectProps={{
            name: 'endTime',
            value: endTime.name,
            onChange: (e) => {
              const selectedTime = timeOptions.find(
                (option) => option.id === e.currentTarget.value,
              );
              if (selectedTime) setEndTime(selectedTime);
            },
          }}
          data={timeOptions}
        />
      </div>
    </div>
  );
}
