import React from 'react';
import {toast} from 'react-toastify';

import MemoTrash from '@/src/icons/trash';

import {ModalDivider} from '../../common/divider/divider';
import Modal from '../../common/modal/modal';
import ModalFooter from '../../common/modal/modalFooter';
import ModalHeader from '../../common/modal/modalHeader';
import ModalInputLabel from '../../common/modalInputLabel/modalInputLabel';
import ModalSelectLabel from '../../common/modalSelectLabel/modalSelectLabel';
import Sidebar from '../../common/sidebar/sidebar';
import SidebarContent from '../../common/sidebar/sidebarContent';
import SidebarFooter from '../../common/sidebar/sidebarFooter';
import SidebarHeader from '../../common/sidebar/sidebarHeader';

export default function EditVenue({
  open,
  setOpen,
  venue,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  venue: {
    id: string;
    name: string;
    address: string;
    other: string;
    signage: string;
    schedule: string;
    policy: string;
  };
  onSubmit: (data: {
    id: string;
    name: string;
    address: string;
    other: string;
    signage: string;
    schedule: string;
    policy: string;
  }) => 'error' | 'success';
}) {
  const [name, setName] = React.useState(venue.name);
  const [address, setAddress] = React.useState(venue.address);
  const [other, setOther] = React.useState(venue.other);
  const [signage, setSignage] = React.useState(venue.signage);
  const [schedule, setSchedule] = React.useState(venue.schedule);
  const [policy, setPolicy] = React.useState(venue.policy);
  const [removeOpen, setRemoveOpen] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const closeSidebarFunction = () => {
    setOpen(false);
    // reset form fields
    setTimeout(() => {
      setName(venue.name);
      setSignage(venue.signage);
      setSchedule(venue.schedule);
      setPolicy(venue.policy);
    }, 150);
  };

  return (
    <>
      <Sidebar
        sidebarOpen={open}
        setSidebarOpen={setOpen}
        closeSidebarFunction={closeSidebarFunction}
        className="editVenue"
        sidebarClasses="editVenueSidebar"
      >
        <SidebarHeader
          title="Edit Venue"
          description="Edit or remove your venue."
        />
        <SidebarContent>
          <form className="formContainer">
            <div className="dataContainer">
              <ModalInputLabel
                labelText="Venue Name"
                inputProps={{
                  value: name,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                  },
                  placeholder: 'Enter Area Name',
                }}
              />
              <ModalInputLabel
                labelText="Venue Address"
                inputProps={{
                  value: address,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setAddress(e.target.value);
                  },
                  placeholder: 'Enter Area Address',
                }}
              />
              <ModalInputLabel
                labelText="Suite / Unit / Other"
                inputProps={{
                  value: other,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setOther(e.target.value);
                  },
                  placeholder: 'Enter Extra Information',
                }}
              />
            </div>
            <ModalDivider />
            <div className="dataContainer">
              <ModalSelectLabel
                labelText="Venue Signage"
                selectProps={{
                  value: signage,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSignage(e.target.value);
                  },
                  placeholder: 'Choose Network Signage',
                }}
                data={[
                  {id: '1', name: 'Holiday Signage'},
                  {id: '2', name: 'Safety Signage'},
                  {id: '3', name: 'Other Signage'},
                ]}
              />
              <ModalSelectLabel
                labelText="Venue Schedule"
                selectProps={{
                  value: schedule,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setSchedule(e.target.value);
                  },
                  placeholder: 'Choose Network Schedule',
                }}
                data={[
                  {id: '1', name: 'Holiday Signage'},
                  {id: '2', name: 'Safety Signage'},
                  {id: '3', name: 'Other Signage'},
                ]}
              />
              <ModalSelectLabel
                labelText="Venue Policy"
                selectProps={{
                  value: policy,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setPolicy(e.target.value);
                  },
                  placeholder: 'Choose Network Policy',
                }}
                data={[
                  {id: '1', name: 'Holiday Signage'},
                  {id: '2', name: 'Safety Signage'},
                  {id: '3', name: 'Other Signage'},
                ]}
              />
            </div>
          </form>
        </SidebarContent>
        <ModalDivider />
        <SidebarFooter
          setOpen={setOpen}
          sidebarClass="editVenueSidebar"
          isError={isError}
          setIsError={setIsError}
          noIcon
          buttonText="Save Changes"
          onSubmit={() => {
            const result = onSubmit({
              id: venue.id,
              name,
              address,
              other,
              signage,
              schedule,
              policy,
            });
            if (result === 'success') {
              toast.success('Venue updated successfully');
              setOpen(false);
            } else {
              toast.error('Error updating venue');
            }
          }}
          loadingText="Saving..."
          successText="Changes Saved"
          backButtonText="Remove Venue"
          backButtonIcon={<MemoTrash />}
          backButtonFunction={() => {
            setRemoveOpen(true);
          }}
        />
      </Sidebar>
      <Modal
        className="removeVenueModal"
        open={removeOpen}
        setOpen={setRemoveOpen}
      >
        <ModalHeader
          title="Remove Venue"
          description="Are you sure you want to remove this venue?"
        />
        <ModalDivider />
        <ModalFooter
          setOpen={setRemoveOpen}
          modalClass="removeVenueModal"
          buttonText="Remove"
          loadingText="Removing ..."
          successText="Venue Removed"
          errorText="Error"
          onSubmit={() => {
            toast.success('Venue removed successfully');
            setRemoveOpen(false);
            setOpen(false);
          }}
          buttonIcon={<MemoTrash />}
        />
      </Modal>
    </>
  );
}
