import React from 'react';

import {timeOptions} from '@/src/constants/timeOptions';

import Label from '../../common/label/label';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import Dates from '../dates/dates';
import type {MediaActionData} from '../modals/editMediaModal';
import DaysSelector from './daysSelector';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function TextTab({
  open,
  setFormData,
  data,
}: {
  open: boolean;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      mediaName: string;
      mediaImage: string | null;
      startDate: Date | null;
      endDate: Date | null;
    }>
  >;
  data?: MediaActionData;
}) {
  const [mediaName, setMediaName] = React.useState('');
  const [mediaText, setMediaText] = React.useState<string | null>(null);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [startDateOnly, setStartDateOnly] = React.useState('');
  const [endDateOnly, setEndDateOnly] = React.useState('');
  const [startTime, setStartTime] = React.useState({
    id: '0',
    name: 'All Day',
  });
  const [endTime, setEndTime] = React.useState({
    id: '0',
    name: 'All Day',
  });
  const [daysSelected, setDaysSelected] = React.useState<string[]>(days);

  React.useEffect(() => {
    setStartDate(new Date());
  }, []);

  React.useEffect(() => {
    if (data) {
      setMediaName(data.name);
      setMediaText(data.text || '');
      const startDateData = new Date(data.startDate || '');
      if (data.startDate) {
        setStartDate(startDateData);
        setStartDateOnly(
          startDateData.toLocaleDateString(['en-US'], {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          }) || '',
        );
      }
      const endDateData = new Date(data.endDate || '');
      if (data.endDate) {
        setEndDate(endDateData || null);
        setEndDateOnly(
          endDateData.toLocaleDateString(['en-US'], {
            year: '2-digit',
            month: 'short',
            day: 'numeric',
          }) || '',
        );
      }
      if (data.startTime)
        setStartTime(
          timeOptions.find((option) => option.id === data.startTime) || {
            id: '0',
            name: 'All Day',
          },
        );
      if (data.endTime)
        setEndTime(
          timeOptions.find((option) => option.id === data.endTime) || {
            id: '0',
            name: 'All Day',
          },
        );
      if (data.days) setDaysSelected(data.days);
    }
  }, [data]);

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      id: data?.id || undefined,
      name: mediaName,
      text: mediaText,
      startDate,
      type: 'text',
      endDate,
      startTime: startTime.id,
      endTime: endTime.id,
      days: daysSelected,
    }));
  }, [
    mediaName,
    mediaText,
    startDate,
    endDate,
    startTime,
    endTime,
    daysSelected,
  ]);

  React.useEffect(() => {
    if (!open) {
      setMediaName('');
      setMediaText(null);
      setStartDate(new Date());
      setEndDate(null);
      setStartDateOnly('');
      setEndDateOnly('');
      setStartTime({
        id: '0',
        name: 'All Day',
      });
      setEndTime({
        id: '0',
        name: 'All Day',
      });
      setDaysSelected(days);
    }
  }, [open]);

  return (
    <div className="tabItem textTab">
      <ModalInputLabel
        labelText="Text Name"
        inputProps={{
          name: 'mediaName',
          value: mediaName,
          placeholder: 'Enter media name',
          onChange: (e) => {
            setMediaName(e.currentTarget.value);
          },
          required: true,
        }}
        errorText="Media name is required."
      />
      <div className="modalFormContainer customModalForm">
        <Label htmlFor="text">Text</Label>
        <div className="textAreaContainer">
          <div className="textAreaWrapper">
            <textarea
              name="text"
              value={mediaText || ''}
              onChange={(e) => {
                setMediaText(e.currentTarget.value);
              }}
              placeholder="Enter text"
              required
            />
          </div>
        </div>
        <div className="errorContainer text">
          <p className="error">Text is required.</p>
        </div>
      </div>
      <div className="modalFormContainer">
        <Label htmlFor="datesAndTimes">Dates & Times</Label>
        <Dates
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          startDateOnly={startDateOnly}
          setStartDateOnly={setStartDateOnly}
          endDateOnly={endDateOnly}
          setEndDateOnly={setEndDateOnly}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />
      </div>
      <div className="modalFormContainer">
        <Label htmlFor="mediaDays">Days</Label>
        <DaysSelector
          days={days}
          daysSelected={daysSelected}
          setDaysSelected={setDaysSelected}
        />
      </div>
    </div>
  );
}
