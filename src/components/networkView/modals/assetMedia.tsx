import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalHeader from '../../common/modal/modalHeader';

export default function AssetMedia({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <div>
      <Modal className="attachMediaModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title="Attach Media"
          description={
            <span>Select media to add to your device signage set.</span>
          }
        />
        <ModalDivider />
        <div className="mainContent">
          <div className="attachNavSidebar" />
          <div className="attachContent" />
        </div>
      </Modal>
    </div>
  );
}
