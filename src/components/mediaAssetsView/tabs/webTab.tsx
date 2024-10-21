import React from 'react';

import Button from '../../common/button/button';
import Label from '../../common/label/label';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import Dates from '../dates/dates';
import DaysSelector from './daysSelector';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WebTab({
  open,
  setFormData,
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
}) {
  const [mediaName, setMediaName] = React.useState('');
  const [mediaRSS, setMediaRSS] = React.useState<string | null>(null);
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
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
    setFormData((prev) => ({
      ...prev,
      mediaName,
      mediaRSS,
      startDate,
      endDate,
    }));
  }, [mediaName, mediaRSS, startDate, endDate]);

  React.useEffect(() => {
    if (!open) {
      setMediaName('');
      setMediaRSS(null);
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
    <div className="tabItem webTab">
      <ModalInputLabel
        labelText="RSS Name"
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
        <Label htmlFor="rss">RSS</Label>
        <div className="textAreaContainer">
          <div className="textAreaWrapper">
            <textarea
              name="rss"
              value={mediaRSS || ''}
              onChange={(e) => {
                setMediaRSS(e.currentTarget.value);
              }}
              placeholder="Enter text"
              required
            />
            <div className="rssExampleContainer">
              <div className="rssExampleWrapper">
                <div>
                  <Button
                    onClick={() => {
                      setMediaRSS(
                        'https://abcnews.go.com/abcnews/moneyheadlines',
                      );
                    }}
                    className="rssExample"
                  >
                    <p>Suggestion: ABC Money</p>
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setMediaRSS('http://feeds.foxnews.com/foxnews/latest');
                    }}
                    className="rssExample"
                  >
                    <p>Suggestion: Fox News Headlines</p>
                  </Button>
                </div>
                <div>
                  <Button
                    onClick={() => {
                      setMediaRSS(
                        'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
                      );
                    }}
                    className="rssExample"
                  >
                    <p>Suggestion: NY Times Technology</p>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="errorContainer rss">
          <p className="error">RSS is required.</p>
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
