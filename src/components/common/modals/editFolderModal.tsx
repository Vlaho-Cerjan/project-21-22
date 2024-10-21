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

export default function EditFolderModal({
  open,
  setOpen,
  noGroups,
  noDescription,
  onSubmit,
  folderData,
  selectedFolder,
  hardcodedTopFolders,
  editFolderName,
  editFolderDataId,
  editFolderData,
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
  folderData?: GridData[];
  selectedFolder?: {
    id: string;
    level: string;
  } | null;
  hardcodedTopFolders?: boolean;
  editFolderName?: string;
  editFolderDataId?: string;
  editFolderData?: GridData;
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

  React.useEffect(() => {
    if (editFolderData) {
      setFolderName(editFolderData.name || '');
      setFolderDescription(editFolderData?.description || '');
    }
  }, [editFolderData]);

  useDidUpdateEffect(() => {
    if (selectedFolder) {
      setSelectedFolderData(selectedFolder?.id);
    }
  }, [selectedFolder]);

  React.useEffect(() => {
    setModalClassName(`editFolderModal${random(0, 100000)}`);
  }, []);

  return (
    <div>
      <Modal
        className={`editFolderModal ${modalClassName}`}
        open={open}
        wrapperTestId={editFolderDataId}
        setOpen={setOpen}
      >
        <ModalHeader
          title={editFolderName ? `Edit ${editFolderName}` : 'Edit Folder'}
          description={`Edit your ${editFolderName || 'folder'} data.`}
        />
        <ModalDivider />
        <div className="contentContainer">
          <ModalContent>
            <div className="formContainer">
              <ModalInputLabel
                labelText={
                  editFolderName ? `${editFolderName} Name` : 'Folder Name'
                }
                labelProps={{
                  htmlFor: 'name',
                }}
                errorText={`${editFolderName || 'Folder'} name can not be empty`}
                inputProps={{
                  name: 'name',
                  type: 'text',
                  'data-testid': 'name',
                  required: true,
                  placeholder: `Enter ${editFolderName || 'folder'} name`,
                  value: folderName,
                  onChange: (e) => {
                    setFolderName(e.currentTarget.value);
                  },
                }}
              />
              {(typeof noDescription === 'undefined' || !noDescription) && (
                <ModalInputLabel
                  labelText={
                    editFolderName
                      ? `${editFolderName} Description`
                      : 'Folder Description'
                  }
                  labelProps={{
                    htmlFor: 'description',
                  }}
                  inputProps={{
                    name: 'description',
                    type: 'text',
                    'data-testid': 'description',
                    placeholder: `Enter ${editFolderName || 'folder'} description`,
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
                    editFolderName
                      ? `${editFolderName} Location`
                      : 'Folder Location'
                  }
                  labelProps={{
                    htmlFor: `${editFolderName || 'folder'}`,
                  }}
                  errorText={`Cannot edit to Root, please select a ${editFolderName || 'Folder'}`}
                  data={[
                    {
                      id: '',
                      name: hardcodedTopFolders
                        ? `Select ${editFolderName || 'Folder'}`
                        : `Root ${editFolderName || 'Folder'}`,
                    },
                    ...folderData.map((folder) => ({
                      id: folder.id,
                      name: folder.orgHierarchy?.join(' | '),
                    })),
                  ]}
                  selectProps={{
                    name: editFolderName || 'folder',
                    required: hardcodedTopFolders,
                    value: selectedFolderData || '',
                    onChange: (e) => {
                      setSelectedFolderData(e.currentTarget.value);
                    },
                    placeholder: `Select ${editFolderName || 'Folder'}`,
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
          buttonText={`Update ${editFolderName || 'Folder'}`}
          loadingText="Updating ..."
          successText={`${editFolderName || 'Folder'} Updated`}
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
