import React from 'react';
import {toast} from 'react-toastify';
import type {SliderData, TextSliderData} from 'types/slideDataType';

import type {BackendSignageData} from '@/src/constants/backendData';
import MemoAssignSet from '@/src/icons/assign-set';
import MemoTrash from '@/src/icons/trash';

import {ModalDivider} from '../../common/divider/divider';
import IconButton from '../../common/iconButton/iconButton';
import ModalLabel from '../../common/label/modalLabel';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import DeleteItemModal from '../../common/modals/deleteItemModal';
import SignageSlider from '../../networkView/slider/signageSlider';
import AssignSet from '../sidebars/assignSet/moveDevice/assignSet';

export default function EditSignageModal({
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
    signageSetName: string;
    mediaData: SliderData;
    textData: TextSliderData;
  }) => void;
  data: BackendSignageData;
  sortData: (data: BackendSignageData[]) => void;
  rootData: BackendSignageData[];
}) {
  const [signageSetName, setSignageSetName] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [mediaData, setMediaData] = React.useState<SliderData>({
    id: '',
    timing: '',
    slides: [],
  });
  const [textData, setTextData] = React.useState<TextSliderData>({
    id: '',
    timing: '',
    slides: [],
  });
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [assignSetOpen, setAssignSetOpen] = React.useState(false);
  const [assignSetOpenDelay, setAssignSetOpenDelay] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setAssignSetOpenDelay(true);
    }, 500);
  }, []);

  React.useEffect(() => {
    if (data) {
      setSignageSetName(data.name);
      if (data.slideData) setMediaData(data.slideData);
      if (data.textData) setTextData(data.textData);
    }
  }, [data]);

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSignageSetName('');
        setMediaData({
          id: '',
          timing: '',
          slides: [],
        });
        setTextData({
          id: '',
          timing: '',
          slides: [],
        });
        setIsError(false);
      }, 250);
    }
  }, [open]);

  return (
    <div>
      <Modal className="editSignageSetModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title="Edit Signage Set"
          description="Edit existing signage set."
        />
        <ModalDivider />
        <div className="contentContainer">
          <ModalContent>
            <div className="formControl buttonFormControl">
              {data && (
                <div className="buttonsContainer">
                  <IconButton
                    onClick={() => setAssignSetOpen(true)}
                    data-tooltip-content={`Assign ${data && data.name}`}
                    data-tooltip-id={`assignSet_${data && data.id}`}
                    icon={<MemoAssignSet />}
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
                  labelText="Signage Set Name"
                  labelProps={{
                    htmlFor: 'name',
                  }}
                  errorText="Signage set name can not be empty"
                  inputProps={{
                    name: 'name',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter signage set name',
                    value: signageSetName,
                    onChange: (e) => {
                      setSignageSetName(e.currentTarget.value);
                    },
                  }}
                />
              </div>
            </div>
          </ModalContent>
          <ModalDivider />
          <ModalContent>
            <ModalLabel htmlFor="signageSliderContainer">
              Signage Slides
            </ModalLabel>
            <SignageSlider
              mediaData={mediaData}
              setMediaData={setMediaData}
              textData={textData}
              setTextData={setTextData}
              type="signage"
            />
          </ModalContent>
        </div>
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          isError={isError}
          setIsError={setIsError}
          modalClass="editSignageSetModal"
          buttonText="Edit Signage Set"
          loadingText="Editing ..."
          successText="Signage Set Edited"
          errorText="Error"
          onSubmit={() => {
            if (mediaData.slides.length === 0) {
              toast.error('Please add at least one slide.');
              return Promise.resolve('error');
            }
            if (
              mediaData.timing === '' ||
              (textData && (!textData.timing || textData.timing === ''))
            ) {
              toast.error('Please add timing for each slide.');
              return Promise.resolve('error');
            }
            onSubmit({
              id: data.id,
              signageSetName,
              mediaData,
              textData,
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
          const signageSetIndex = rootDataCopy.findIndex(
            (signageSet) => signageSet.id === data.id,
          );
          rootDataCopy.splice(signageSetIndex, 1);
          sortData(rootDataCopy);
          setDeleteModalOpen(false);
          setTimeout(() => {
            setOpen(false);
          }, 300);
        }}
        data={data}
      />
      {assignSetOpenDelay && (
        <AssignSet
          open={assignSetOpen}
          setOpen={setAssignSetOpen}
          signageData={data}
          onSubmit={(id, tempData) => {
            console.log('assign set', id, tempData);
            return 'success';
          }}
        />
      )}
    </div>
  );
}
