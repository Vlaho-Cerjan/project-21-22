import type {OrdersUpdateData} from '@/types/orders';
import React from 'react';
import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalContent from '../../common/modal/modalContent';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalTextAreaLabel from '../../common/modalTextAreaLabel/modalTextAreaLabel';

export default function DenyModal({
  open,
  setOpen,
  onSubmit,
  itemCount,
  data,
  setData,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (denyData: {denyReason: string; denyNote: string}) => void;
  itemCount: number;
  data: OrdersUpdateData | null;
  setData: React.Dispatch<React.SetStateAction<OrdersUpdateData | null>>;
}) {
  const [isError, setIsError] = React.useState(false);
  /*
  const denyOptions = [
    {
      id: 'Affiliate',
      name: 'Affiliate',
    },
    {
      id: 'Cancelled',
      name: 'Cancelled',
    },
    {
      id: 'Converted',
      name: 'Converted',
    },
    {
      id: 'Demo',
      name: 'Demo',
    },
    {
      id: 'Disqualified',
      name: 'Disqualified',
    },
    {
      id: 'Disqualified_DMA',
      name: 'Disqualified_DMA',
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
    },
    {
      id: 'Enterprise_AVOD',
      name: 'Enterprise_AVOD',
    },
    {
      id: 'Internal',
      name: 'Internal',
    },
    {
      id: 'Open',
      name: 'Open',
    },
    {
      id: 'Partner',
      name: 'Partner',
    },
    {
      id: 'Pending',
      name: 'Pending',
    },
    {
      id: 'Unresponsive',
      name: 'Unresponsive',
    },
  ];

  */
  const [denyReason, setDenyReason] = React.useState<string | null>(null);

  const [denyNote, setDenyNote] = React.useState('');

  React.useEffect(() => {
    setDenyNote((data && data.notes && data.notes.order_notes) || '');
  }, [data]);

  return (
    <div>
      <Modal className="denyModal" open={open} setOpen={setOpen}>
        <ModalHeader
          title={`Deny Pending Order${itemCount > 1 ? 's' : ''}`}
          description={`Are you sure you want to deny ${
            itemCount === 1 ? 'this' : `these ${itemCount}`
          } pending ${itemCount === 1 ? 'order' : 'orders'}?`}
        />
        <ModalDivider />
        <ModalContent>
          <div className="formContainer">
            {/*
            <ModalSelectLabelFuzzy
              labelText="Reason"
              data={denyOptions}
              searchData={denyOptions}
              dropdownId="denyReasonDropdown"
              searchKeys={['name']}
              displayValue="name"
              display={{
                topLeft: 'name',
              }}
              displayStartLimit={5}
              value={denyReason}
              setValue={(data) => {
                setDenyReason(data);
              }}
              dataName="Reason"
              selectProps={{
                id: 'denyReason',
                name: 'denyReason',
                required: true,
                value: denyReason?.id || '',
                onChange: (e) => {
                  const data = denyOptions.find(
                    (item) => item.id === e.currentTarget.value,
                  );
                  setDenyReason(data || null);
                },
              }}
            />
            */}
            <ModalInputLabel
              labelText="Reason"
              inputProps={{
                id: 'denyReason',
                name: 'denyReason',
                placeholder: 'Rejection Reason',
                'data-testid': 'denyReason',
                required: true,
                value: denyReason || '',
                onChange: (e) => {
                  setDenyReason(e.currentTarget.value);
                },
              }}
            />
            <ModalTextAreaLabel
              labelText="Add Note"
              duplicateId="regNotes"
              textareaProps={{
                id: 'denyNote',
                name: 'denyNote',
                'data-testid': 'denyNote',
                placeholder: 'Additional Information',
                minLength: 1,
                maxLength: 500,
                value: denyNote,
                onChange: (e) => {
                  if (data)
                    setData({
                      ...data,
                      notes: {
                        ...data.notes,
                        order_notes: e.currentTarget.value,
                      },
                    });
                  setDenyNote(e.currentTarget.value);
                },
              }}
            />
          </div>
        </ModalContent>
        <ModalDivider />
        <ModalFooter
          setOpen={setOpen}
          backDataTestId="denyRegBack"
          submitDataTestId="denyRegSubmit"
          isError={isError}
          setIsError={setIsError}
          modalClass="denyModal"
          buttonText="Deny"
          loadingText="Denying ..."
          successText="Items denied"
          errorText="Error"
          onSubmit={() =>
            onSubmit({
              denyReason: denyReason || '',
              denyNote,
            })
          }
          noIcon
          buttonVariant="error"
        />
      </Modal>
    </div>
  );
}
