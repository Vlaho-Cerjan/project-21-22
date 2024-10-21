import {random} from 'lodash';
import React from 'react';

import useDidUpdateEffect from '@/src/lib/useDidUpdateEffect';
import type {GridData} from '@/types/gridData';
import {ModalDivider} from '../divider/divider';
import Modal from '../modal/modal';
import ModalContent from '../modal/modalContent';
import ModalFooter from '../modal/modalFooter';
import ModalHeader from '../modal/modalHeader';
import ModalInputLabel from '../modalInputLabel/modalInputLabel';
import ModalSelectLabel from '../modalSelectLabel/modalSelectLabel';

export default function AddFolderModal({
  open,
  setOpen,
  noGroups,
  noDescription,
  onSubmit,
  placeName,
  folderData,
  selectedFolder,
  hardcodedTopFolders,
  addFolderName,
  addFolderDataId,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  noGroups?: boolean;
  noDescription?: boolean;
  onSubmit: (
    data: {
      name: string;
      description?: string;
    },
    folderId?: string,
  ) => Promise<'success' | 'error'>;
  placeName: string;
  folderData?: GridData[];
  selectedFolder?: {
    id: string;
    level: string;
  } | null;
  hardcodedTopFolders?: boolean;
  addFolderName?: string;
  addFolderDataId?: string;
}) {
  const [folderName, setFolderName] = React.useState('');
  const [folderDescription, setFolderDescription] = React.useState('');
  const [selectedFolderData, setSelectedFolderData] = React.useState<
    string | undefined
  >(undefined);
  const [isError, setIsError] = React.useState(false);
  const [modalClassName, setModalClassName] = React.useState('');

  useDidUpdateEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFolderName('');
        setFolderDescription('');
        setSelectedFolderData(undefined);
        setIsError(false);
      }, 200);
    }
  }, [open]);

  useDidUpdateEffect(() => {
    if (selectedFolder) {
      setSelectedFolderData(selectedFolder?.id);
    }
  }, [selectedFolder]);

  React.useEffect(() => {
    setModalClassName(`addFolderModal${random(0, 100000)}`);
  }, []);

  return (
    <div>
      <Modal
        className={`addFolderModal ${modalClassName}`}
        open={open}
        wrapperTestId={addFolderDataId}
        setOpen={setOpen}
      >
        <ModalHeader
          title={addFolderName ? `Add ${addFolderName}` : 'Add Folder'}
          description={`Create a new ${addFolderName || 'folder'} to store your ${placeName}.`}
        />
        <ModalDivider />
        <div className="contentContainer">
          <ModalContent>
            <div className="formContainer">
              <ModalInputLabel
                labelText={
                  addFolderName ? `${addFolderName} Name` : 'Folder Name'
                }
                labelProps={{
                  htmlFor: 'name',
                }}
                errorText={`${addFolderName || 'Folder'} name can not be empty`}
                inputProps={{
                  name: 'name',
                  type: 'text',
                  'data-testid': 'name',
                  required: true,
                  placeholder: `Enter ${addFolderName || 'folder'} name`,
                  value: folderName,
                  onChange: (e) => {
                    setFolderName(e.currentTarget.value);
                  },
                }}
              />
              {(typeof noDescription === 'undefined' || !noDescription) && (
                <ModalInputLabel
                  labelText={
                    addFolderName
                      ? `${addFolderName} Description`
                      : 'Folder Description'
                  }
                  labelProps={{
                    htmlFor: 'description',
                  }}
                  inputProps={{
                    name: 'description',
                    type: 'text',
                    'data-testid': 'description',
                    placeholder: `Enter ${addFolderName || 'folder'} description`,
                    value: folderDescription,
                    onChange: (e) => {
                      setFolderDescription(e.currentTarget.value);
                    },
                  }}
                />
              )}
              {folderData && (typeof noGroups === 'undefined' || !noGroups) && (
                <ModalSelectLabel
                  labelText={
                    addFolderName
                      ? `${addFolderName} Location`
                      : 'Folder Location'
                  }
                  labelProps={{
                    htmlFor: `${addFolderName || 'folder'}`,
                  }}
                  errorText={`Cannot add to Root, please select a ${addFolderName || 'Folder'}`}
                  data={[
                    {
                      id: '',
                      name: hardcodedTopFolders
                        ? `Select ${addFolderName || 'Folder'}`
                        : `Root ${addFolderName || 'Folder'}`,
                    },
                    ...folderData.map((folder) => ({
                      id: folder.id,
                      name: folder.orgHierarchy?.join(' | '),
                    })),
                  ]}
                  selectProps={{
                    name: addFolderName || 'folder',
                    required: hardcodedTopFolders,
                    value: selectedFolderData || '',
                    onChange: (e) => {
                      setSelectedFolderData(e.currentTarget.value);
                    },
                    placeholder: `Select ${addFolderName || 'Folder'}`,
                  }}
                />
              )}
            </div>
          </ModalContent>
        </div>
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          isError={isError}
          setIsError={setIsError}
          modalClass={modalClassName}
          buttonText={`Create ${addFolderName || 'Folder'}`}
          loadingText="Creating ..."
          successText={`${addFolderName || 'Folder'} Created`}
          errorText="Error"
          onSubmit={async () => {
            const res = await onSubmit(
              {
                name: folderName,
                description: folderDescription,
              },
              selectedFolderData,
            );

            return res;
          }}
          noIcon
        />
      </Modal>
    </div>
  );
}
