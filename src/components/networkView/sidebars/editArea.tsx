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

export default function EditArea({
  open,
  setOpen,
  area,
  onSubmit,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  area: {
    id: string;
    name: string;
    signage: string;
    schedule: string;
    policy: string;
  };
  onSubmit: (data: {
    id: string;
    name: string;
    signage: string;
    schedule: string;
    policy: string;
  }) => 'error' | 'success';
}) {
  const [name, setName] = React.useState(area.name);
  const [signage, setSignage] = React.useState(area.signage);
  const [schedule, setSchedule] = React.useState(area.schedule);
  const [policy, setPolicy] = React.useState(area.policy);
  const [removeOpen, setRemoveOpen] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  const closeSidebarFunction = () => {
    setOpen(false);
    // reset form fields
    setTimeout(() => {
      setName(area.name);
      setSignage(area.signage);
      setSchedule(area.schedule);
      setPolicy(area.policy);
    }, 150);
  };

  return (
    <>
      <Sidebar
        sidebarOpen={open}
        setSidebarOpen={setOpen}
        closeSidebarFunction={closeSidebarFunction}
        className="editArea"
        sidebarClasses="editAreaSidebar"
      >
        <SidebarHeader
          title="Edit Area"
          description="Edit or remove your area."
        />
        <SidebarContent>
          <form className="formContainer">
            <div className="dataContainer">
              <ModalInputLabel
                labelText="Area Name"
                inputProps={{
                  value: name,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    setName(e.target.value);
                  },
                  placeholder: 'Enter Area Name',
                }}
              />
            </div>
            <ModalDivider />
            <div className="dataContainer">
              <ModalSelectLabel
                labelText="Area Signage"
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
                labelText="Area Schedule"
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
                labelText="Area Policy"
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
          sidebarClass="editAreaSidebar"
          setOpen={setOpen}
          isError={isError}
          setIsError={setIsError}
          noIcon
          backButtonText="Remove Area"
          backButtonIcon={<MemoTrash />}
          backButtonFunction={() => {
            setRemoveOpen(true);
          }}
          buttonText="Save Changes"
          loadingText="Saving..."
          successText="Changes Saved"
          onSubmit={() => {
            const result = onSubmit({
              id: area.id,
              name,
              signage,
              schedule,
              policy,
            });
            if (result === 'success') {
              toast.success('Area saved successfully');
              setOpen(false);
            } else {
              toast.error('Error saving area');
            }
          }}
        />
      </Sidebar>
      <Modal
        className="removeAreaModal"
        open={removeOpen}
        setOpen={setRemoveOpen}
      >
        <ModalHeader
          title="Remove Area"
          description="Are you sure you want to remove this area?"
        />
        <ModalDivider />
        <ModalFooter
          modalClass="removeAreaModal"
          setOpen={setRemoveOpen}
          buttonText="Remove"
          loadingText="Removing ..."
          successText="Area Removed"
          errorText="Error"
          onSubmit={() => {
            toast.success('Area removed successfully');
            setRemoveOpen(false);
            setOpen(false);
          }}
          buttonIcon={<MemoTrash />}
          buttonVariant="error"
        />
      </Modal>
    </>
  );
}
