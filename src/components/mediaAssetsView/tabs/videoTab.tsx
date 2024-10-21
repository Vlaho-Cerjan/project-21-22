import React from 'react';

import {timeOptions} from '@/src/constants/timeOptions';

import Label from '../../common/label/label';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import Dates from '../dates/dates';
import type {MediaActionData} from '../modals/editMediaModal';
import VideoUpload from '../upload/videoUpload';
import DaysSelector from './daysSelector';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function VideoTab({
  open,
  setFormData,
  data,
}: {
  open: boolean;
  setFormData: React.Dispatch<
    React.SetStateAction<{
      mediaName: string;
      mediaVideo: string | null;
      startDate: Date | null;
      endDate: Date | null;
    }>
  >;
  data?: MediaActionData;
}) {
  const [mediaName, setMediaName] = React.useState('');
  const [mediaVideo, setMediaVideo] = React.useState<string | null>(null);
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
      setMediaVideo(data.url || '');
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
      url: mediaVideo,
      type: 'video',
      startDate,
      endDate,
      startTime: startTime.id,
      endTime: endTime.id,
      days: daysSelected,
    }));
  }, [
    mediaName,
    mediaVideo,
    startDate,
    endDate,
    startTime,
    endTime,
    daysSelected,
  ]);

  React.useEffect(() => {
    if (!open) {
      setMediaName('');
      setMediaVideo(null);
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
    <div id="videoTab" className="tabItem videoTab">
      <ModalInputLabel
        labelText="Video Name"
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
        <Label htmlFor="videoAsset">Video</Label>
        <VideoUpload video={mediaVideo} setVideo={setMediaVideo} />
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
