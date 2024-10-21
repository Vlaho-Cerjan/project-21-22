import type {Program} from 'planby';
import React from 'react';

import type {
  BackendScheduleData,
  PlaylistsData,
} from '@/src/constants/backendData';
import MemoAssignSchedule from '@/src/icons/assign-set';
import MemoAttachment from '@/src/icons/attachment';
import MemoTrash from '@/src/icons/trash';
import GetColorByType from '@/src/utils/GetColorByType';

import WhiteButton from '../../common/button/whiteButton';
import {ModalDivider} from '../../common/divider/divider';
import IconButton from '../../common/iconButton/iconButton';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import DeleteItemModal from '../../common/modals/deleteItemModal';
import AssignSchedule from '../sidebars/assignSchedule/moveDevice/assignSchedule';
import AttachPlaylistSidebar from '../sidebars/attachPlaylistSidebar';
import Timeline from '../timeline/timeline';

export default function EditScheduleModal({
  open,
  setOpen,
  onSubmit,
  data,
  sortData,
  rootData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    id: string;
    scheduleName: string;
    playlists: PlaylistsData[];
  }) => void;
  data: BackendScheduleData;
  sortData: (data: BackendScheduleData[]) => void;
  rootData: BackendScheduleData[];
}) {
  const [scheduleName, setScheduleName] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [assignScheduleOpen, setAssignScheduleOpen] = React.useState(false);
  const [assignScheduleOpenDelay, setAssignScheduleOpenDelay] =
    React.useState(false);
  const [epg, setEpg] = React.useState<Program[]>([]);
  const [openAttachPlaylist, setOpenAttachPlaylist] = React.useState(false);
  const [selectedDateTimes, setSelectedDateTimes] = React.useState<
    {day: string; startTime: string; endTime: string}[]
  >([]);
  const [playlists, setPlaylists] = React.useState<PlaylistsData[]>([]);

  React.useEffect(() => {
    setTimeout(() => {
      setAssignScheduleOpenDelay(true);
    }, 500);
  }, []);

  React.useEffect(() => {
    if (data) {
      setScheduleName(data.name);
      if (data.playlists)
        setEpg(
          data.playlists.map((playlist) => {
            return {
              channelUuid: playlist.day,
              id: playlist.playlist?.id || '',
              title: playlist.playlist?.name || '',
              description: '',
              since: playlist.startTime,
              till: playlist.endTime,
              color: GetColorByType(playlist.playlist?.type || ''),
              image: '',
            };
          }),
        );
      setSelectedDateTimes(
        data.playlists?.map((playlist) => {
          return {
            day: playlist.day,
            startTime: playlist.startTime,
            endTime: playlist.endTime,
          };
        }) || [],
      );
      setPlaylists(data.playlists || []);
    }
  }, [data]);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setScheduleName('');
        setIsError(false);
        setEpg([]);
      }, 250);
    }
  }, [open]);

  return (
    <div>
      <Modal className="editScheduleModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title="Edit Schedule"
          description="Edit existing schedule."
        />
        <ModalDivider />
        <div className="contentContainer">
          <ModalContent>
            <div className="formControl buttonFormControl">
              {data && (
                <div className="buttonsContainer">
                  <IconButton
                    onClick={() => setAssignScheduleOpen(true)}
                    data-tooltip-content={`Assign ${data && data.name}`}
                    data-tooltip-id={`assignSchedule_${data && data.id}`}
                    icon={<MemoAssignSchedule />}
                  />
                  <IconButton
                    onClick={() => setDeleteModalOpen(true)}
                    data-tooltip-content={`Delete ${data && data.name}`}
                    data-tooltip-id={`deleteSet_${data && data.id}`}
                    icon={<MemoTrash />}
                  />
                </div>
              )}
            </div>
            <div className="formContainer">
              <div className="formControl">
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
                    value: scheduleName,
                    onChange: (e) => {
                      setScheduleName(e.currentTarget.value);
                    },
                  }}
                />
              </div>
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
          modalClass="editScheduleModal"
          buttonText="Edit Schedule"
          loadingText="Editing ..."
          successText="Schedule Edited"
          errorText="Error"
          onSubmit={() => {
            onSubmit({
              id: data.id,
              scheduleName,
              playlists,
            });
            return Promise.resolve('success');
          }}
          noIcon
        />
      </Modal>
      <DeleteItemModal
        open={deleteModalOpen}
        setOpen={setDeleteModalOpen}
        onSubmit={() => {
          const rootDataCopy = [...rootData];
          const scheduleIndex = rootDataCopy.findIndex(
            (schedule) => schedule.id === data.id,
          );
          rootDataCopy.splice(scheduleIndex, 1);
          sortData(rootDataCopy);
          setDeleteModalOpen(false);
          setTimeout(() => {
            setOpen(false);
          }, 300);
        }}
        data={data}
      />
      {assignScheduleOpenDelay && (
        <AssignSchedule
          open={assignScheduleOpen}
          setOpen={setAssignScheduleOpen}
          scheduleData={data}
          onSubmit={(id, tempData) => {
            console.log('assign schedule', id, tempData);
            return 'success';
          }}
        />
      )}
      <AttachPlaylistSidebar
        id="editScheduleModal"
        className="editSidebar"
        selectedDateTimes={selectedDateTimes}
        open={openAttachPlaylist}
        setOpen={setOpenAttachPlaylist}
        onSubmit={(submitData) => {
          setSelectedDateTimes([
            ...selectedDateTimes,
            {
              day: submitData.day || '',
              startTime: submitData.startTime || '',
              endTime: submitData.endTime || '',
            },
          ]);
          setEpg((prev) => {
            const newEpg: Program = {
              // create new uuid
              channelUuid: submitData.day || '',
              id:
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15),
              title: submitData.playlist?.name || '',
              description: '',
              since: submitData.startTime || '',
              till: submitData.endTime || '',
              image: '',
              color: GetColorByType(submitData.playlist?.type || ''),
            };
            setPlaylists((prevData) => {
              return [
                ...prevData,
                {
                  id:
                    Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15),
                  ...submitData,
                },
              ];
            });

            return [...prev, newEpg];
          });
        }}
      />
    </div>
  );
}
