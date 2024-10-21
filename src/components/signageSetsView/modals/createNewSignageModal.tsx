import React from 'react';
import {toast} from 'react-toastify';
import type {SliderData, TextSliderData} from 'types/slideDataType';

import {ModalDivider} from '../../common/divider/divider';
import ModalLabel from '../../common/label/modalLabel';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import SignageSlider from '../../networkView/slider/signageSlider';

export default function CreateNewSignageModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (data: {
    signageSetName: string;
    mediaData: SliderData;
    textData: TextSliderData;
  }) => void;
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
      }, 200);
    }
  }, [open]);

  return (
    <div>
      <Modal className="actionSignageSetModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title="Add Signage Set"
          description="Create a new signage set."
        />
        <ModalDivider />
        <div className="contentContainer">
          <ModalContent>
            <div className="formContainer">
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
          modalClass="actionSignageSetModal"
          buttonText="Create Signage Set"
          loadingText="Creating ..."
          successText="Signage Set Created"
          errorText="Error"
          onSubmit={() => {
            if (mediaData.slides.length === 0) {
              toast.error('Please add at least one slide.');
              return Promise.resolve('error');
            }
            if (mediaData.timing === '' || textData.timing === '') {
              toast.error('Please add timing for each slide.');
              return Promise.resolve('error');
            }
            onSubmit({
              signageSetName,
              mediaData,
              textData,
            });
            return Promise.resolve('success');
          }}
          noIcon
        />
      </Modal>
    </div>
  );
}
