import React from 'react';

import {ModalDivider} from '../divider/divider';
import Modal from '../modal/modal';
import ModalFooter from '../modal/modalFooter';
import ModalHeader from '../modal/modalHeader';

export default function DeleteItemModal({
  open,
  setOpen,
  onSubmit,
  data,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
  data: any;
}) {
  const [isError, setIsError] = React.useState(false);

  return (
    <div>
      <Modal className="deleteMediaModal" open={open} setOpen={setOpen}>
        {data && (
          <ModalHeader
            title="Delete Media"
            description={`Are you sure you want to delete ${data.name}?`}
          />
        )}
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          isError={isError}
          setIsError={setIsError}
          modalClass="deleteMediaModal"
          buttonText="Delete"
          loadingText="Deleting ..."
          successText="Item deleted"
          errorText="Error"
          onSubmit={onSubmit}
          noIcon
          buttonVariant="error"
        />
      </Modal>
    </div>
  );
}
