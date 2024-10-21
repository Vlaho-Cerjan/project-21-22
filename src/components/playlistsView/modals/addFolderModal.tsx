import {random} from 'lodash';
import React from 'react';

import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';

export default function AddFolderModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (folderName: string) => void;
}) {
  const [folderName, setFolderName] = React.useState('');
  const [isError, setIsError] = React.useState(false);
  const [modalClassName, setModalClassName] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFolderName('');
        setIsError(false);
      }, 200);
    }
  }, [open]);

  React.useEffect(() => {
    setModalClassName(`addFolderModal${random(0, 100000)}`);
  }, []);

  return (
    <div>
      <Modal
        className={`addFolderModal ${modalClassName}`}
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader
          title="Add Folder"
          description="Create a new folder to store your Playlists."
        />
        <ModalDivider />
        <div className="contentContainer">
          <ModalContent>
            <div className="formContainer">
              <div className="formControl">
                <ModalInputLabel
                  labelText="Folder Name"
                  labelProps={{
                    htmlFor: 'name',
                  }}
                  errorText="Folder name can not be empty"
                  inputProps={{
                    name: 'name',
                    type: 'text',
                    required: true,
                    placeholder: 'Enter folder name',
                    value: folderName,
                    onChange: (e) => {
                      setFolderName(e.currentTarget.value);
                    },
                  }}
                />
              </div>
            </div>
          </ModalContent>
        </div>
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          isError={isError}
          setIsError={setIsError}
          modalClass={modalClassName}
          buttonText="Create Folder"
          loadingText="Creating ..."
          successText="Folder Created"
          errorText="Error"
          onSubmit={() => {
            onSubmit(folderName);
          }}
          noIcon
        />
      </Modal>
    </div>
  );
}
