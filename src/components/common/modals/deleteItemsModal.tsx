import React from 'react';

import {ModalDivider} from '../divider/divider';
import Modal from '../modal/modal';
import ModalFooter from '../modal/modalFooter';
import ModalHeader from '../modal/modalHeader';

export default function DeleteItemsModal({
  text,
  deleteButtonDataId,
  description,
  open,
  setOpen,
  onSubmit,
  itemCount,
  modalDataId,
}: {
  text?: string;
  deleteButtonDataId?: string;
  description?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => Promise<'success' | 'error'>;
  itemCount: number;
  modalDataId?: string;
}) {
  const [isError, setIsError] = React.useState(false);

  return (
    <div>
      <Modal
        wrapperTestId={modalDataId || 'deleteMediaModal'}
        className="deleteMediaModal"
        open={open}
        setOpen={setOpen}
      >
        <ModalHeader
          title={text || `Delete Item${itemCount > 1 ? 's' : ''}`}
          description={
            description ||
            `Are you sure you want to delete ${
              itemCount > 1 ? 'these items' : 'this item'
            }?`
          }
        />
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          isError={isError}
          setIsError={setIsError}
          submitDataTestId={deleteButtonDataId}
          modalClass="deleteMediaModal"
          buttonText="Delete"
          loadingText="Deleting ..."
          successText={`Item${itemCount > 1 ? 's' : ''} deleted`}
          errorText="Error"
          onSubmit={async () => {
            const response = await onSubmit();

            return response;
          }}
          noIcon
          buttonVariant="error"
        />
      </Modal>
    </div>
  );
}
