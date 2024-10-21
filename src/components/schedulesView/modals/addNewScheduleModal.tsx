'use client';

import type {Program} from 'planby';
import React from 'react';

import type {PlaylistsData} from '@/src/constants/backendData';
import MemoAttachment from '@/src/icons/attachment';
import GetColorByType from '@/src/utils/GetColorByType';

import WhiteButton from '../../common/button/whiteButton';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import AttachPlaylistSidebar from '../sidebars/attachPlaylistSidebar';
import Timeline from '../timeline/timeline';

export default function CreateNewScheduleModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    name: string;
    playlists: PlaylistsData[];
    selectedDateTimes: {day: string; startTime: string; endTime: string}[];
  }) => void;
}) {
  const [schedulesName, setSchedulesName] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [epg, setEpg] = React.useState<Program[]>([]);
  const [playlists, setPlaylists] = React.useState<PlaylistsData[]>([]);
  const [openAttachPlaylist, setOpenAttachPlaylist] = React.useState(false);
  const [selectedDateTimes, setSelectedDateTimes] = React.useState<
    {day: string; startTime: string; endTime: string}[]
  >([]);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSchedulesName('');
        setIsError(false);
        setEpg([]);
      }, 200);
    }
  }, [open]);

  return (
    <div>
      <Modal
        className="actionSchedulesModal fullWidth"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader
          title="Add Schedule"
          description="Create a new schedule."
        />
        <ModalDivider />
        <div className="contentContainer">
          <ModalContent>
            <div className="formContainer">
              <ModalInputLabel
                labelText="Schedule Name"
                labelProps={{
                  htmlFor: 'name',
                }}
                errorText="Schedule set name can not be empty"
                inputProps={{
                  name: 'name',
                  type: 'text',
                  required: true,
                  placeholder: 'Enter schedule name',
                  value: schedulesName,
                  onChange: (e) => {
                    setSchedulesName(e.currentTarget.value);
                  },
                }}
              />
            </div>
          </ModalContent>
          <ModalDivider />
          <ModalContent>
            <div className="playlistTimelineContainer">
              <div className="timelineHeader">
                <div className="leftContainer" />
                <div className="rightContainer">
                  <WhiteButton
                    onClick={() => {
                      setOpenAttachPlaylist(true);
                    }}
                  >
                    <MemoAttachment />
                    <span>Attach Playlist</span>
                  </WhiteButton>
                </div>
              </div>
              <div className="timelineBody">
                <Timeline epg={epg} />
              </div>
            </div>
          </ModalContent>
        </div>
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          isError={isError}
          setIsError={setIsError}
          modalClass="actionSchedulesModal"
          buttonText="Create Schedule"
          loadingText="Creating ..."
          successText="Schedule Created"
          errorText="Error"
          onSubmit={() => {
            onSubmit({
              name: schedulesName,
              playlists,
              selectedDateTimes,
            });
            return Promise.resolve('success');
          }}
          noIcon
        />
      </Modal>
      <AttachPlaylistSidebar
        id="addNewScheduleModal"
        className="attachSidebar"
        selectedDateTimes={selectedDateTimes}
        open={openAttachPlaylist}
        setOpen={setOpenAttachPlaylist}
        onSubmit={(data) => {
          setSelectedDateTimes([
            ...selectedDateTimes,
            {
              day: data.day || '',
              startTime: data.startTime || '',
              endTime: data.endTime || '',
            },
          ]);
          setPlaylists((prev) => {
            const newPlaylist: PlaylistsData = {
              // create new uuid
              id:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              ...data,
            };

            return [...prev, newPlaylist];
          });
          setEpg((prev) => {
            const newEpg: Program = {
              // create new uuid
              channelUuid: data.day || '',
              id:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              title: data.playlist?.name || '',
              description: '',
              since: data.startTime || '',
              till: data.endTime || '',
              image: '',
              color: GetColorByType(data.playlist?.type || ''),
            };

            return [...prev, newEpg];
          });
        }}
      />
    </div>
  );
}
