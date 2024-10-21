import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';

export default function ApproveModal({
  open,
  setOpen,
  onSubmit,
  itemCount,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => void;
  itemCount: number;
}) {
  const [isError, setIsError] = React.useState(false);

  return (
    <div>
      <Modal className="approveModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title={`Approve Pending  Registration${itemCount > 1 ? 's' : ''}`}
          description={`Are you sure you want to approve ${
            itemCount === 1 ? 'this' : `these ${itemCount}`
          } pending ${itemCount === 1 ? 'registration' : 'registrations'}?`}
        />
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          isError={isError}
          submitDataTestId="approveRegSubmit"
          backDataTestId="approveRegBack"
          setIsError={setIsError}
          modalClass="approveModal"
          buttonText="Approve"
          loadingText="Approving ..."
          successText="Items approved"
          errorText="Error"
          onSubmit={onSubmit}
          noIcon
        />
      </Modal>
    </div>
  );
}
