import React from 'react';

import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';

export default function DeviceUnlinkDeviceModal({
  open,
  setOpen,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: () => 'error' | 'success';
}) {
  const [isError, setIsError] = React.useState(false);

  const onSubmitClick = () => {
    const res = onSubmit();
    return Promise.resolve(res);
  };

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setIsError(false);
      }, 200);
    }
  }, [open]);

  return (
    <Modal className="deviceAddDeviceModal" open={open} setOpen={setOpen}>
      <ModalHeader
        title="Unlink Device"
        description="Are you sure you want to unlink this device?"
      />
      <ModalDivider />
      <ModalFooter
        setOpen={setOpen}
        isError={isError}
        setIsError={setIsError}
        modalClass="deviceAddDeviceModal"
        buttonText="Unlink"
        loadingText="Unlinking ..."
        successText="Device Unlinked"
        errorText="Error"
        onSubmit={onSubmitClick}
        noIcon
        buttonVariant="error"
      />
    </Modal>
  );
}
